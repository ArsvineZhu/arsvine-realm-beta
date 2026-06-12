import React, { useEffect, useId, useRef, useState } from 'react';
import styles from '../../styles/MDXContent.module.scss';

/**
 * 句级注解 / 语句解释。
 *
 * 正文中被解释的文本带虚线下划线：
 *   - 桌面端：mouseenter / focus 展开，mouseleave / blur 收起。
 *   - 触屏：click 切换；外部 pointerdown 或 Escape 关闭。
 *
 * 触发器使用 `<span tabIndex={0}>` 而非 `<button>` —— `<button>` 是 form
 * control，浏览器把它当作 atomic inline-block 处理，跨多词文本无法在
 * 词间自然换行，并强制 text-align: center；用 `<span>` 才能让被解释
 * 文本与正文按正常 inline 流参与行盒断行。
 *
 * 通过 `tabIndex={0}` 与 keydown 处理保留键盘可访问性（Enter / Space 触发，
 * Escape 关闭），用 `aria-describedby` 关联 tooltip 满足读屏。
 *
 * 不依赖 floating-ui / popper —— 单 tooltip 场景，max-width + 视口安全
 * 边距足以避免横向溢出。
 */
interface ExplainProps {
  children: React.ReactNode;
  note: string;
}

export default function Explain({ children, note }: ExplainProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  // 仅在 open 时挂监听，避免无谓订阅；关闭时自动解绑。
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span className={styles.explainWrapper} ref={ref}>
      <span
        role="button"
        tabIndex={0}
        className={styles.explainTrigger}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        {children}
      </span>
      {open && (
        <span id={tooltipId} role="tooltip" className={styles.explainTooltip}>
          {note}
        </span>
      )}
    </span>
  );
}

