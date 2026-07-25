# Changelog

All notable changes to **ARSVINE REALM** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.2] — 2026-07-25

### Security

- **brace-expansion DoS**: 升级 `brace-expansion` v1 从 `1.1.15` → `1.1.16`，修复连续非展开 `{}` 组导致的 O(2ⁿ) 指数级时间复杂度拒绝服务漏洞。该漏洞通过 `eslint` → `minimatch@3` 传递依赖引入，30 组 ~90 字节输入可阻塞线程数分钟。
- **PostCSS 路径遍历与 .map 文件泄露**: 升级 `postcss` 从 `8.5.10` → `8.5.18`，修复 `PreviousMap` 通过 `sourceMappingURL` 注释中 `../` 路径遍历读取任意 `.map` 文件并泄露 `sourcesContent` 的漏洞（CVE-2026 系列）。
- **PostCSS 任意文件读取与信息泄露**: 同上升级，修复默认选项下攻击者可通过 CSS 注释中的绝对/相对路径读取任意文件，并通过 `JSON.parse` 错误消息泄露文件开头 ~10 字节内容的漏洞，同时消除文件存在性预言机和 DoS 原语。
- **sharp / libvips 多个 CVE**: 升级 `sharp` 从 `0.34.5` → `0.35.3`（内置 libvips 8.18.3），修复上游 libvips 中的 CVE-2026-33327、CVE-2026-33328、CVE-2026-35590、CVE-2026-35591 等图像处理漏洞。

### Changed

- 升级 pnpm 从 `11.7.0` → `11.17.0`。
- 依赖版本覆盖（overrides）从 `package.json` 的 `pnpm` 字段迁移至 `pnpm-workspace.yaml`，以适配 pnpm 11 的新配置位置。

### Dependencies

- `next`: `16.2.10` → `16.2.11`
- `next-intl`: `4.13.2` → `4.13.4`
- `react` / `react-dom`: `19.2.7` → `19.2.8`
- `@next/bundle-analyzer`: `16.2.10` → `16.2.11`
- `eslint-config-next`: `16.2.10` → `16.2.11`

---

## [2.0.1] — 2026-07-24

### Fixed

- **运行时与交互稳定性加固**:
  - 自定义光标：修复注册机制与共享状态的竞态，统一光标切换动画。
  - 电力系统：持久化逻辑重构，增加测试覆盖，避免状态在刷新后丢失或不一致。
  - 路由过渡：修复内容页关闭时的过渡状态，移除冗余的 PagesNavigationRuntime。
  - 受保护博客文章状态机：补充取消路径的边界处理，对应 `docs/GOTCHAS.md` 中的注意事项。
  - 音乐播放器：水合后恢复用户音乐选择，移动端自动弹出的保护逻辑加严。
  - GitHub 内容源：推文与内容加载容错增强，避免网络波动时整页崩溃。
  - 资源目录：catalog provider 回退路径修复。
  - Tesseract 体验与导航列：动画时序和可见性修正。
- **资源发布**: 修复 `assets-publish` 脚本未递归发布子目录的问题。
- **CI 工作流**: 调整并发与缓存策略，加速构建。

### Added

- 新增 15+ 个测试文件覆盖光标、电力系统、过渡、博客状态机、音乐播放器、激活拉杆、资源发布脚本等关键路径，测试总数从 ~280 增至 402。
- `docs/GOTCHAS.md` 与 `docs/PERFORMANCE.md` 补充新的注意事项与性能调优记录。

---

## [2.0.0] — 2026-07-22

初始公开发布版本。ARSVINE REALM 2.0 全面重构：

- 基于 **Next.js 16 App Router** + **React 19** + **TypeScript**
- 末世 HUD 主题视觉，左栏导航 + 中央内容区 + 背景 Three.js 场景
- **next-intl 4** 三语支持（zh-CN / zh-TW / en），静态 locale 注册表
- MDX 博客系统，支持受保护文章（TOTP / 签名 cookie 访问控制）
- 自定义音乐播放器（云端音频目录 + 本地回退）
- 路由过渡动画、自定义光标、视差头像、粒子效果
- 完整的性能分级（性能分数 → 特效启用/禁用）
- 全面测试套件（Vitest + Testing Library，400+ 测试）

[2.0.2]: https://github.com/Arsvine-Realm-Dev-Team/arsvine-realm/compare/v2.0.1...v2.0.2
[2.0.1]: https://github.com/Arsvine-Realm-Dev-Team/arsvine-realm/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/Arsvine-Realm-Dev-Team/arsvine-realm/releases/tag/v2.0.0
