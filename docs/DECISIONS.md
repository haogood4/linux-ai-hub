# 重大技术决策记录（ADR）

> 编号规则：ADR-xxx，按时间递增。仅记录影响页面、组件或开发流程的重大决策。

## ADR-001 修复依赖版本冲突：zod 与 @astrojs/svelte

日期：2026-08-16

### 背景
项目初始化后 `pnpm build` 立即失败，两个独立问题：
1. `zod-to-json-schema@3.25.2` 导入 `zod/v3` 子路径，而依赖树中被 astro 复用的 `zod@3.23.8` 无该子路径（peer 要求 `^3.25.28 || ^4`），构建报 `Package subpath './v3' is not defined`。
2. `@astrojs/svelte@9.0.1` 的 peer 要求 `astro ^7.0.0` 且依赖 `vite ^8.0.13`，与项目 astro 4.16 / vite 5.4 完全不匹配，导致 astro sync 阶段 vite `Object.values(undefined)` 崩溃。

### 选择
- zod 直接依赖锁定为 `^3.25.28`（3.x 最终线，提供 `zod/v3` 子路径，满足 zod-to-json-schema peer）。
- `@astrojs/svelte` 降至 `^6.0.2`（peer：astro ^4.0.0、svelte ^5.1.16，与 astro 4.16 完全匹配）。

### 原因
保持 Astro 4.x 技术栈（AGENTS.md 推荐），不升级大版本；在兼容范围内修复版本组合，改动最小、风险最低。

### 替代方案
- 升级 astro 至 7.x 以匹配 @astrojs/svelte 9 —— 大版本升级，破坏性大，MVP 阶段不值得。
- 移除 svelte 集成 —— 见 ADR-002，待确认。

### 影响
package.json 的 zod / @astrojs/svelte 版本；后续新增依赖须核对 peer 兼容性（Astro 4 生态）。

---

## ADR-002 移除 CDN 依赖，使用本地 Tailwind + 系统字体栈

日期：2026-08-16

### 背景
index.astro / BaseLayout.astro 通过 `https://cdn.tailwindcss.com` 脚本引入 Tailwind，并外链 Google Fonts。这与已安装的 `@tailwindcss/vite` 插件冲突（CDN 版不支持 Tailwind 4 的 Vite 编译流程），且引入第三方运行时依赖与隐私/性能问题。

### 选择
- 删除所有 CDN 脚本与 Google Fonts 外链。
- Tailwind 4 通过 `@tailwindcss/vite` 插件 + `src/styles/global.css` 的 `@import "tailwindcss"` 与 `@theme` 使用。
- 字体使用系统字体栈（Inter 优先，回退 PingFang SC / Noto Sans CJK / Microsoft YaHei）。
- 主题色 `--color-primary: #2563eb`（blue-600，白色文字对比度 ≥ 4.5:1，符合 WCAG AA）。

### 原因
构建产物自包含、离线可用、无第三方跟踪；AGENTS.md 推荐自托管字体但 MVP 阶段先使用系统栈，成本最低。

### 替代方案
- 自托管 Inter subset —— 后置（Phase 4）。
- Tailwind 3 配置方式 —— 项目已用 Tailwind 4，不倒退。

### 影响
所有页面的样式引入方式；后续样式统一走 `src/styles/global.css` 的 @theme。

---

## ADR-003 默认语言中文，i18n 后置

日期：2026-08-16

### 背景
原有模板使用 `globalThis.navigator.language` 等浏览器 API 在服务端渲染中取值，构建不安全且无实际 i18n 逻辑。

### 选择
- `<html lang="zh-CN">` 固定，文案默认中文简体。
- astro-i18n / 英文内容后置到 Phase 4 之后，届时再引入。

### 原因
目标用户以中文为主；MVP 阶段避免双语言维护成本，AGENTS.md 亦要求中英文修改必须同步，前期集中中文更可控。

### 影响
后续如需英文版，需统一改造 Layout 与所有页面文案。

---

## ADR-004 内容集合配置（进行中）

日期：2026-08-16

### 背景
`src/content/` 已存在 tutorials / paths / tools 目录与一篇 MDX 教程，但缺少集合 schema 配置，Astro 无法通过 `getCollection` 使用这些内容。

### 选择
创建 `src/content/config.ts`，用 zod 3 定义集合 schema（教程：title、slug、author、date、tags、estimatedReadTime、environment）。

### 原因
让已存在的 MDX 内容可被页面消费，数据驱动页面结构，符合 AGENTS.md「数据放在 src/content/」。

### 影响
后续新增内容文件必须符合 schema 校验，否则构建报错。
---

## ADR-005 移除 Svelte 集成，保持纯 Astro

日期：2026-08-16

### 背景
项目依赖 @astrojs/svelte 6.0.2 与 svelte 5，但没有任何 .svelte 组件；构建产物含 25KB 无人引用的客户端 JS。@astrojs/svelte@9 与 astro 4.16 存在 peer 冲突（ADR-001），版本维护成本高。

### 选择
移除 @astrojs/svelte、svelte 依赖与 svelte.config.js；astro.config.mjs 仅保留 Tailwind 插件与 @ 别名。

### 原因
纯静态页面（.astro）已覆盖全部需求；AGENTS.md §3 亦认可「静态内容优先」。经用户确认执行。

### 替代方案
- 保留 svelte 并升级 astro 7 —— 大版本升级，暂不需要。
- 迁移至 React（@astrojs/react）—— react/react-dom 依赖仍在，待需要高交互组件（如发行版选择器）时评估。

### 影响
后续需要高交互组件时，评估引入 @astrojs/react（react 19 已安装）或按需恢复 svelte；新增依赖须核对与 astro 4.16 / vite 5.4 的 peer 兼容性。
