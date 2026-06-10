import { useState, useEffect, useRef } from 'react';
import type { FateTypingState, EnvParamsTypingState, EnvData } from '../types';
import { siteConfig } from '../data/site';

/**
 * Fate text typing effect — 节奏：
 *   1 轮预设 (en + zh) → 1 句 hitokoto → 1 轮预设 → 1 句 hitokoto → ...
 *
 * hitokoto 句子从 /api/hitokoto 拉取（服务端代理 https://v1.hitokoto.cn）。
 * 拉取失败时本轮回退为一轮预设，下一轮继续尝试 hitokoto，避免上游故障时卡死。
 *
 * 一句一言之后立刻回到预设，是为了避开 /api/hitokoto 的 60s 进程内缓存——
 * 连续多次拉到同一句会让用户觉得"中文反复出现"。一言句子停留时间也比预设
 * 中文更长（HITOKOTO_PAUSE_AFTER_TYPE），让短句的呼吸感更明显。
 */
const HITOKOTO_PER_CYCLE = 1;
const HITOKOTO_PAUSE_AFTER_TYPE = 4000; // ms，比预设的 1500 长，给短句更长停留

export function useFateTypingEffect(textVisible: boolean): FateTypingState {
  const [displayedFateText, setDisplayedFateText] = useState('');
  const [isFateTypingActive, setIsFateTypingActive] = useState(false);

  useEffect(() => {
    if (!textVisible) return;

    const englishText = siteConfig.tagline.en;
    const chineseText = siteConfig.tagline.zh;
    const typingDelay = 80;
    const deleteDelay = 50;
    const chineseTypingDelay = 150;
    const chineseDeleteDelay = 100;
    const pauseAfterType = 1500;
    const pauseAfterDelete = 500;

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const abortControllers: AbortController[] = [];
    setIsFateTypingActive(true);

    const schedule = (fn: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (cancelled) return;
        fn();
      }, delay);
      timeouts.push(id);
    };

    const typeString = (str: string, index: number, delay: number, callback?: () => void) => {
      if (cancelled) return;
      if (index < str.length) {
        setDisplayedFateText(prev => prev + str[index]);
        schedule(() => typeString(str, index + 1, delay, callback), delay);
      } else if (callback) {
        schedule(callback, 0);
      }
    };

    const deleteString = (currentStr: string, delay: number, callback?: () => void) => {
      if (cancelled) return;
      if (currentStr.length > 0) {
        setDisplayedFateText(prev => prev.slice(0, -1));
        schedule(() => deleteString(currentStr.slice(0, -1), delay, callback), delay);
      } else if (callback) {
        schedule(callback, 0);
      }
    };

    // 一轮预设：en (英文节奏) → zh (中文节奏)
    const presetCycle = (onDone: () => void) => {
      typeString(englishText, 0, typingDelay, () => {
        schedule(() => {
          deleteString(englishText, deleteDelay, () => {
            schedule(() => {
              typeString(chineseText, 0, chineseTypingDelay, () => {
                schedule(() => {
                  deleteString(chineseText, chineseDeleteDelay, () => {
                    schedule(onDone, pauseAfterDelete);
                  });
                }, pauseAfterType);
              });
            }, pauseAfterDelete);
          });
        }, pauseAfterType);
      });
    };

    // 一句 hitokoto：fetch → 按中文节奏打/删；失败则回退一轮预设
    const hitokotoCycle = (onDone: () => void, onFail: () => void) => {
      const controller = new AbortController();
      abortControllers.push(controller);
      fetch('/api/hitokoto', { signal: controller.signal })
        .then(async (res) => {
          if (!res.ok) throw new Error(`status ${res.status}`);
          const data = await res.json();
          const text = typeof data?.text === 'string' ? data.text.trim() : '';
          if (!text) throw new Error('empty text');
          return text;
        })
        .then((text) => {
          if (cancelled) return;
          typeString(text, 0, chineseTypingDelay, () => {
            schedule(() => {
              deleteString(text, chineseDeleteDelay, () => {
                schedule(onDone, pauseAfterDelete);
              });
            }, HITOKOTO_PAUSE_AFTER_TYPE);
          });
        })
        .catch((err) => {
          if (cancelled) return;
          // AbortError 是组件卸载时的正常清理，不算失败
          if ((err as Error)?.name === 'AbortError') return;
          console.warn('[useFateTypingEffect] hitokoto fetch failed, fallback to preset:', (err as Error).message);
          onFail();
        });
    };

    // 主调度器
    let hitokotoCount = 0;
    const runHitokoto = () => {
      if (cancelled) return;
      if (hitokotoCount >= HITOKOTO_PER_CYCLE) {
        loop();
        return;
      }
      hitokotoCycle(
        () => {
          hitokotoCount++;
          runHitokoto();
        },
        // 失败：回退一轮预设，下一轮重新开始尝试 hitokoto
        () => {
          presetCycle(() => {
            hitokotoCount = 0;
            runHitokoto();
          });
        },
      );
    };

    const loop = () => {
      presetCycle(() => {
        hitokotoCount = 0;
        runHitokoto();
      });
    };

    loop();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
      abortControllers.forEach((c) => c.abort());
      timeouts = [];
      setDisplayedFateText('');
      setIsFateTypingActive(false);
    };
  }, [textVisible]);

  return { displayedFateText, isFateTypingActive };
}

/**
 * Environment parameters typing effect — generates and types random env data
 */
export function useEnvParamsTypingEffect(textVisible: boolean): EnvParamsTypingState {
  const [displayedEnvParams, setDisplayedEnvParams] = useState('');
  const [isEnvParamsTyping, setIsEnvParamsTyping] = useState(false);
  const [envData, setEnvData] = useState<EnvData | null>(null);
  const [envDataVersion, setEnvDataVersion] = useState(0);
  const currentTempRef = useRef(55.0);
  const lastGeneratedParamsRef = useRef('');

  useEffect(() => {
    if (textVisible) {
      const typingDelay = 35;
      const envDeleteDelay = 20;

      let timeouts = [];
      setIsEnvParamsTyping(true);

      const typeString = (str, index, delay, callback) => {
        if (index < str.length) {
          setDisplayedEnvParams(prev => prev + str[index]);
          const timeoutId = setTimeout(() => typeString(str, index + 1, delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const deleteEnvParamsString = (currentStr, delay, callback) => {
        if (currentStr.length > 0) {
          setDisplayedEnvParams(prev => prev.slice(0, -1));
          const timeoutId = setTimeout(() => deleteEnvParamsString(currentStr.slice(0, -1), delay, callback), delay);
          timeouts.push(timeoutId);
        } else if (callback) {
          const timeoutId = setTimeout(callback, 0);
          timeouts.push(timeoutId);
        }
      };

      const generateNewParams = () => {
        const tempChange = (Math.random() * 3) - 1.5;
        let newTemp = currentTempRef.current + tempChange;
        newTemp = Math.max(44, Math.min(66, newTemp));
        currentTempRef.current = newTemp;
        const tempStr = newTemp.toFixed(1);

        const rad = Math.floor(200 + Math.random() * 300);
        const o2 = (8 + Math.random() * 2).toFixed(1);

        const pollutionLevels = ["SEVERE", "CRITICAL", "UNSTABLE", "HAZARDOUS"];
        const pollution = pollutionLevels[Math.floor(Math.random() * pollutionLevels.length)];

        const rainStatus = ["IMMINENT", "LIKELY", "UNLIKELY", "CERTAIN"];
        const rain = rainStatus[Math.floor(Math.random() * rainStatus.length)];

        const warnings = [
          "ALERT: TOXIC EXPOSURE RISK",
          "CAUTION: RADIATION STORM",
          "DANGER: ACID ZONES EXPANDING",
          "URGENT: OXYGEN DEPLETION"
        ];
        const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
        const warningLine = Math.random() > 0.5 ? `\n${randomWarning}` : '';

        setEnvData({ temp: newTemp, rad, o2: parseFloat(o2), pollution, acidRain: rain });
        setEnvDataVersion(prev => prev + 1);

        return `TEMP: ${tempStr}°C\nRAD: ${rad}mSv/h\nO2: ${o2}%\nPOLLUTION: ${pollution}\nACID RAIN: ${rain}${warningLine}`;
      };

      const generateAndType = () => {
        const newParams = generateNewParams();
        lastGeneratedParamsRef.current = newParams;
        typeString(newParams, 0, typingDelay, () => {
          const updateTime = 8000 + Math.floor(Math.random() * 7000);
          const restartTimeout = setTimeout(() => {
            startTyping();
          }, updateTime);
          timeouts.push(restartTimeout);
        });
      };

      const startTyping = () => {
        const textToDelete = lastGeneratedParamsRef.current;

        if (textToDelete.length > 0) {
          deleteEnvParamsString(textToDelete, envDeleteDelay, () => {
            generateAndType();
          });
        } else {
          generateAndType();
        }
      };

      const initialDelay = setTimeout(() => {
        startTyping();
      }, 1000);
      timeouts.push(initialDelay);

      return () => {
        timeouts.forEach(clearTimeout);
        setDisplayedEnvParams('');
        setIsEnvParamsTyping(false);
        setEnvData(null);
        setEnvDataVersion(0);
        lastGeneratedParamsRef.current = '';
      };
    }
  }, [textVisible]);

  return { displayedEnvParams, isEnvParamsTyping, envData, envDataVersion };
}
