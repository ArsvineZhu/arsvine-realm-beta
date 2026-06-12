# MDX 多语言翻译与校对指南

本文档用于指导后续译者、编辑者或 AI 代理，对本站 MDX 文章进行 `zh-TW` 与 `en` 版本的翻译、校对和组件标注。

核心原则：

> 以 `zh-CN` 为母本，保留原作意义、节奏与表达；`zh-TW` 面向繁体中文读者自然校对；`en` 面向英文读者克制翻译，并在必要处用组件解释跨文化概念。

---

## 1. 文件与语言版本关系

通常一篇文章包含三份 MDX 文件：

```text
zh-CN.mdx
zh-TW.mdx
en.mdx
```

其中：

- `zh-CN.mdx` 是原版母本；
- `zh-TW.mdx` 是繁体中文校对版；
- `en.mdx` 是英文翻译版。

翻译时应优先对齐 `zh-CN.mdx` 的：

- frontmatter 字段；
- 标题、摘要、标签；
- 正文段落顺序；
- 语气、节奏、意象；
- `Term` / `Explain` 组件的位置与用途。

除非原文存在明显错别字、病句或结构错误，否则不要主动改写 `zh-CN` 原文。

---

## 2. 总体翻译原则

### 2.1 不做“重写型翻译”

本站随笔文本通常依赖短句、重复、停顿、留白和隐喻推进。翻译目标不是把文章改得更顺滑，而是尽量保留原文的文学结构。

应保留：

- 原文的句子重心；
- 情绪的克制感；
- 段落之间的停顿；
- 意象的陌生感；
- 重复句式带来的回环感。

例如：

```text
它不会回来了。
```

适合：

```text
It will not come back.
```

不宜过度解释为：

```text
It would never return to its previous state again.
```

后者虽然意思完整，但削弱了原文的短促感。

### 2.2 不替作者“拔高”

原文如果是克制、清醒、偏冷的，不要在译文中额外添加鸡汤式、宣言式或过度抒情的表达。

例如：

```text
Light can be received. Not every watt has to be burned out of you.
```

这个力度可以保留。

不宜改成：

```text
You deserve to receive light from the universe, and you never had to burn yourself for others.
```

后者已经不再是原文气质。

---

## 3. `zh-TW` 翻译与校对原则

`zh-TW` 不是机械繁简转换，而是面向繁体中文读者的自然校对版。

### 3.1 字形转换

应完成基本繁体化：

```text
父亲 → 父親
词语 → 詞語
游戏 → 遊戲
移动端 → 行動端
信息 → 訊息 / 資訊
里面 → 裡面
```

注意：

- 「信息」在聊天、消息语境中多译为「訊息」；
- 在技术、资料、数据语境中可译为「資訊」；
- 「里面」通常作「裡面」；
- 「视频」作「影片」或「視訊」需按语境判断。文章类语境多用「影片」。

### 3.2 词汇习惯

`zh-TW` 应尽量自然，但不要过度台湾本地化。

例如：

```text
高考
```

可以保留为「高考」，必要时用 `Explain` 解释，而不是强行改成「大學入學考試」。

```mdx
<Explain note="中國大陸高考約相當於大學入學考試。">高考</Explain>
```

### 3.3 保留原文身份

如果文章内容明显发生在大陆语境，不要为了繁体读者而抹去这种语境。

例如：

- 「高考」不必改成「學測」；
- 「全国 I 卷」不必改成台湾考试术语；
- 「养生文章」可以译为「養生文章」，必要时解释其网络语境。

---

## 4. `en` 翻译原则

英文版应是文学翻译，而不是说明文改写。

### 4.1 英文自然，但不牺牲原文节奏

英文需要读得自然，但不能把原文的短句和停顿全部合并成长句。

例如：

```text
月亮不发光。
```

适合：

```text
The moon does not produce light.
```

不必扩写为：

```text
The moon, as everyone knows scientifically, does not generate its own light.
```

后者破坏文章节奏。

### 4.2 标题可意译

英文标题不必逐字翻译，应保留原文的气质与指向。

例如：

```text
停
```

可译为：

```text
Where We Stop
```

因为这里的「停」不是命令，而是关系在某个距离停住的状态。

```text
父亲这个词
```

可译为：

```text
The Word “Father”
```

这样保留了「词」的自反性。

### 4.3 文化解释放入组件

英文正文应保持文章状态，不要在正文里堆解释。

不宜：

```mdx
Gaokao, which is China’s national college entrance examination, is...
```

更适合：

```mdx
<Explain note="The Chinese original is “高考”, China’s national college entrance examination.">Gaokao</Explain>
```

正文继续作为文学文本存在，陌生信息由组件承担。

---

## 5. `Term` 与 `Explain` 使用规则

本站 MDX 使用两个解释组件：

```mdx
<Term note="...">...</Term>
<Explain note="...">...</Explain>
```

二者的区别不在于“重要程度”，而在于解释对象的粒度。

---

### 5.1 `Term`：用于短词级解释

`Term` 用于对正文中的短词、外语词、日语注音、专名、混用语进行词汇级解释。它的重点不是补充文化背景，而是在不打断阅读的情况下给出一个简短对应、读法或释义。

`Term` 的 `note` 应当尽量短，通常不应明显长于被解释的词本身太多。若注释已经需要解释语境、背景、隐喻或整句话含义，说明它不再是词汇解释，应改用 `Explain`。

适合：

```mdx
我的个人 <Term note="作品集">Portfolio</Term> 网站终于开始试运行了。
```

```mdx
私の個人 <Term note="ポートフォリオ">Portfolio</Term>。
```

```mdx
私の個人 <Term note="つき">月</Term>。
```

```mdx
<Term note="月，日语读作 つき。">Tsuki</Term>
```

也可以用于短专名或短造词：

```mdx
<Term note="与光有关的造词。">Luminaere</Term>
```

不适合：

```mdx
<Term note="A familiar Chinese family phrase: it means “I’m doing this for your benefit,” but often carries parental authority, pressure, or emotional debt.">“it’s for your own good”</Term>
```

原因：这里的注释已经远超词汇对应，涉及家庭语境、情感压力和文化解释，应改用 `Explain`。

---

### 5.2 `Explain`：用于语境级解释

`Explain` 用于解释短语、句子、诗句、文化语境、隐喻、制度背景或无法直接从字面理解的表达。

适合解释：

- 中文固定表达；
- 中国大陆社会或考试制度；
- 诗句、典故、神话；
- 原文中的文化意象；
- 直译后英文读者可能误解的短语；
- 文章中需要保留但需要补充说明的概念。

例如：

```mdx
<Explain note="The Chinese original is “养生文章”: popular health-preservation articles, often mixing wellness advice, folk remedies, and dubious internet claims.">those wellness articles</Explain>
```

```mdx
<Explain note="中國大陸高考語文試卷類型之一。高考約相當於大學入學考試。">全國 I 卷</Explain>
```

```mdx
<Explain note="The original line is “妾若是嫦娥，长圆不教缺。” Chang’e is the moon goddess in Chinese mythology. The line means: if I were Chang’e, I would keep the moon forever full and never let it wane.">“If I were Chang’e, I would never let the moon be incomplete.”</Explain>
```

`Explain` 不应滥用。若正文无需解释也能自然理解，就不要强行添加组件。

---

## 6. 中文原句引用规则

在英文版 `note` 中引用中文原句、中文短语或中文诗句时，必须加引号。

正确：

```mdx
<Explain note="The Chinese original is “负重前行”, a common expression meaning to continue moving forward while carrying a heavy burden or responsibility.">carrying a heavy burden forward</Explain>
```

不推荐：

```mdx
<Explain note="The Chinese original is 负重前行, a common expression meaning...">carrying a heavy burden forward</Explain>
```

诗句同理：

```mdx
<Explain note="The original line is “妾若是嫦娥，长圆不教缺。” Chang’e is the moon goddess in Chinese mythology.">...</Explain>
```

建议使用中文弯引号 `“”`，这样不会和 MDX 属性中的英文双引号冲突。

---

## 7. Frontmatter 规则

MDX 文件通常以 frontmatter 开头：

```mdx
---
title: "标题"
date: "2026-06-08"
excerpt: "摘要"
tags: ["标签"]
pinned: false
originLocale: zh-CN
---
```

### 7.1 `zh-CN`

`zh-CN` 是原版，不需要 `originLocale`。

```mdx
---
title: "父亲这个词"
date: "2026-06-08"
excerpt: "由今年中国大陆高考语文作文题目有感而发"
tags: ["个人", "随笔"]
---
```

### 7.2 `zh-TW`

`zh-TW` 通常不需要 `originLocale`，除非项目另有要求。

```mdx
---
title: "父親這個詞"
date: "2026-06-08"
excerpt: "由今年中國大陸高考語文作文題目有感而發"
tags: ["個人", "隨筆"]
---
```

### 7.3 `en`

英文版建议保留：

```mdx
originLocale: zh-CN
```

例如：

```mdx
---
title: "The Word “Father”"
date: "2026-06-08"
excerpt: "Reflections prompted by this year’s Gaokao Chinese essay prompt"
tags: ["Personal", "Essay"]
originLocale: zh-CN
---
```

### 7.4 字段不要随意删除

应保留原文中的：

- `title`
- `date`
- `excerpt`
- `tags`
- `pinned`
- `originLocale`

如果原文件有 `pinned: false`，对应译文也应保留，除非项目明确不需要。

---

## 8. 标签翻译规则

### 8.1 中文标签

`zh-CN` 与 `zh-TW` 标签应对应转换：

```text
个人 → 個人
随笔 → 隨筆
朋友 → 朋友
游戏 → 遊戲
旅行 → 旅行
艺术 → 藝術
其他 → 其他
```

「其他」与「其它」优先使用「其他」，除非原文有特别风格需求。

### 8.2 英文标签

英文标签应简洁自然：

```text
个人 → Personal
随笔 → Essay
朋友 → Friend
游戏 → Game
旅行 → Travel
艺术 → Art
其他 → Other
```

若是专名、昵称或项目名，例如 `Tsuki`，通常保持不变。

---

## 9. 隐喻翻译规则

原文中的隐喻应尽量保留原物象，不要急着替换成英文惯用比喻。

例如：

```text
棉花墙
```

可译为：

```text
a wall made of cotton
```

虽然英文中不算惯用表达，但它保留了原文的陌生感。

```text
水渍一样慢慢洇开
```

可译为：

```text
spread slowly, like a water stain
```

```text
试用包
```

可译为：

```text
a sample packet
```

```text
水年复一年地渗进石头
```

可译为：

```text
water seeping into stone year after year
```

不要把这些意象改成过于常见的英文表达，否则会损失原文质地。

---

## 10. 常见文化词处理

### 10.1 高考

中文：

```mdx
<Explain note="中國大陸高考約相當於大學入學考試。">高考</Explain>
```

英文：

```mdx
<Explain note="The Chinese original is “高考”, China’s national college entrance examination.">Gaokao</Explain>
```

### 10.2 全国 I 卷

中文繁体：

```mdx
<Explain note="中國大陸高考語文試卷類型之一。高考約相當於大學入學考試。">全國 I 卷</Explain>
```

英文：

```mdx
<Explain note="The Chinese original is “全国 I 卷”. It refers to one version of the Chinese-language paper used in China’s Gaokao, the national college entrance examination.">National Paper I</Explain>
```

### 10.3 套作

中文繁体：

```mdx
<Explain note="套用預先準備好的模板文章。">套作</Explain>
```

英文：

```mdx
<Explain note="The Chinese original is “套作”, meaning the use of a pre-prepared template essay rather than writing genuinely in response to the prompt.">formulaic writing</Explain>
```

### 10.4 养生文章

英文：

```mdx
<Explain note="The Chinese phrase is “养生文章”: popular health-preservation articles, often mixing wellness advice, folk remedies, and dubious internet claims.">those wellness articles</Explain>
```

### 10.5 负重前行

英文：

```mdx
<Explain note="The Chinese original is “负重前行”, a common expression meaning to continue moving forward while carrying a heavy burden or responsibility.">carrying a heavy burden forward</Explain>
```

---

## 11. 语气与文风校对

校对完成后，应检查译文是否出现以下问题。

### 11.1 是否过度解释

错误倾向：

```text
This means that in Chinese family culture...
```

如果这类解释进入正文，通常应挪入 `Explain note`。

### 11.2 是否过度文学化

错误倾向：

```text
The boundless cosmos of tenderness embraced her wounded soul.
```

若原文没有这种风格，不应添加。

### 11.3 是否过度简化

错误倾向：

```text
He was sad.
```

如果原文通过动作、沉默、场景表现情绪，不要直接替作者说破。

### 11.4 是否丢失重复

原文有意重复的句式应尽量保留。

例如：

```text
暗下去，再亮回来。暗下去，再亮回来。
```

适合：

```text
It grows dark, then brightens again. Grows dark, then brightens again.
```

不要压缩成：

```text
It repeats its cycle.
```

---

## 12. MDX 语法注意事项

### 12.1 属性引号

组件属性使用英文双引号：

```mdx
<Explain note="...">...</Explain>
```

如果 `note` 内需要引用中文，用中文弯引号：

```mdx
<Explain note="The Chinese original is “为你好”.">...</Explain>
```

避免这样写：

```mdx
<Explain note="The Chinese original is "为你好".">...</Explain>
```

这会破坏 MDX 语法。

### 12.2 组件不要跨越过长段落

不建议用一个组件包住整段长文本。组件应尽量包住需要解释的最小表达单位。

适合：

```mdx
When we tell our parents not to read <Explain note="The Chinese phrase is “养生文章”: popular health-preservation articles.">those wellness articles</Explain>.
```

不适合：

```mdx
<Explain note="...">When we tell our parents not to read those wellness articles and then realize we sound like our mother...</Explain>
```

### 12.3 保持段落结构

翻译时不要随意合并或拆分段落。原文段落是文章节奏的一部分。

---

## 13. 输出格式要求

当用户要求“直接给出修改后的 MDX”时，应输出完整代码块：

```mdx
---
title: "..."
date: "..."
excerpt: "..."
tags: [...]
---

正文
```

当用户要求“生成文档”时，应输出或保存为 `.md` 文件。

当用户要求“只改这一段”时，只输出被修改的段落，不要附加整篇说明。

---

## 14. 最终校对清单

提交译文前检查：

- [ ] 是否以 `zh-CN` 为母本，没有擅自重写；
- [ ] `zh-TW` 是否完成自然繁体化，而非机械转换；
- [ ] `en` 是否自然、克制、保留原文节奏；
- [ ] frontmatter 字段是否完整；
- [ ] 英文版是否包含 `originLocale: zh-CN`；
- [ ] `Term` 是否只用于短词级解释；
- [ ] `Term note` 是否足够短，没有明显长于原词太多；
- [ ] 语境、文化、诗句、隐喻是否使用 `Explain`；
- [ ] 英文 `note` 中的中文原句是否加了引号；
- [ ] 组件是否没有包住过长文本；
- [ ] MDX 属性引号是否安全；
- [ ] 标签是否翻译自然；
- [ ] 隐喻是否尽量保留；
- [ ] 是否避免过度解释、过度文学化和过度简化。

---

## 15. 一句话总则

> 正文保留文学节奏，组件承担跨文化解释；`Term` 解释短词，`Explain` 解释语境；`zh-TW` 自然繁体化，`en` 克制文学化。
