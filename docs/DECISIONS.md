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

## Decision: ADR-006 修复 Node 26 下 mdx 构建失败（style-to-js interop）

日期：2026-08-16

### 背景
安装 @astrojs/mdx 后，构建在解析带 style 属性的元素时崩溃：`styleToJs is not a function`。最小复现确认与内容无关，任何 .mdx 文件都失败。

### 选择
在 pnpm-workspace.yaml 增加 overrides：`style-to-js: 2.0.2`（连带 style-to-object 升级到 2.0.2）。

### 原因
根因是 Node 26 的 CJS-ESM interop：hast-util-to-estree@3.1.3 依赖的 style-to-js@1.0.0 用 `exports["default"]`（字符串 key）导出，Node 26 的 cjs-module-lexer 未能识别该命名导出，`import default` 返回整个 module.exports 对象导致调用失败。style-to-js@2.0.2 提供 ESM 入口（dist/index.mjs），无 interop 问题。

### 替代方案
- 升级 vite/esbuild：esbuild 0.21.5 的 interop 正常，问题出在 Node 运行时，无效。
- pnpm patch style-to-js 改导出语法：可行但维护成本高。

### 影响
仅影响 mdx 渲染链路；同时升级了 style-to-object（2.0.2），其 API 兼容。构建产物无变化。

---

## ADR-007 站内搜索采用零依赖轻量方案（替代 Pagefind）

日期：2026-08-16

### 背景
AGENTS.md §3 推荐 Pagefind 作为站内搜索方案（Phase 4 后置项）。实际安装 `@pagefind/astro`
时失败：私有 registry（registry.npmmirror.com）无该包，且未授权访问 npmjs 公共源。

### 选择
自研零依赖方案：
- `build-search-index.mjs`：构建后从 dist/ HTML 提取 title / description / h1-h3 / 正文摘要，
  生成 `search-index.json`（46 页约 45KB，静态文件）。
- Header 搜索面板：fetch 索引 → 客户端过滤 → 结果下拉（纯内联 JS，无框架、无额外请求）。

### 原因
保持「零外部依赖」约束；功能等价（标题/描述/标题/正文关键词检索），产物更小；未来若
registry 可用，可无缝替换为 Pagefind（索引与 UI 解耦）。

### 替代方案
- Pagefind（@pagefind/astro）——registry 缺包，不可用。
- 第三方搜索服务（Algolia 等）——需凭据与云端依赖，违背静态优先原则。

### 影响
Header.astro 新增搜索面板与内联脚本；构建流程改为 `pnpm build` 串联
`build-search-index`（构建产物一次到位）；部署时需同步上传 `dist/search-index.json`。

---

## ADR-008 LHCI 浏览器门禁接入

日期：2026-08-16

### 背景
无障碍的对比度、焦点可见等视觉项无法静态验证（ADR 前的 check-a11y 只覆盖源码级规则），
需真实浏览器渲染审计。

### 选择
安装 `@lhci/cli@0.15.1`（私有 registry 可用），新增 `lighthouserc.json`：静态服务 dist、
3 个代表页（首页 / distros / tutorials）、门禁性能 ≥0.5、无障碍 ≥0.9、best-practices ≥0.9、
SEO ≥0.9；`check:lhci` 脚本透传 `lhci autorun`。Chrome 使用系统 chromium
（chromePath 配置 + `--no-sandbox` 沙盒环境）。

### 原因
Lighthouse 是唯一需要浏览器渲染的审计项，引入该依赖是必要的例外；其余脚本保持零依赖。

### 影响
package.json 新增 @lhci/cli devDependency；首次接入发现并修复 2 类真实问题（灰色文字
对比度不足、链接仅靠颜色区分），3 页全绿（a11y 100）。lhci-reports / .lighthouseci
已加入 .gitignore。

### 教训
`pnpm add @lhci/cli` 重解析依赖树时把 `@astrojs/sitemap` 从 3.3.1 升级到 3.7.3
（`^3.3.1` 范围允许），3.7.3 的 build:done hook 读取 `routes.reduce` 崩溃（astro 4.16
hook 参数结构不同），导致构建失败且 sitemap 缺失。修复：sitemap 精确锁定 `3.3.1`。
再次印证 ADR-001 结论：**所有新增/变更依赖必须核对与 astro 4.16 生态的兼容性，
易变范围版本（^）在重解析时可能被意外升级**。

---

## ADR-009 评论区接入 Giscus（GitHub Discussions）

日期：2026-08-17

### 背景
博客与教程文章需要读者评论区。站点为纯静态托管（Astro 构建产物 + Nginx + CDN），
虚拟主机 SSH 仅开放 SFTP（无 shell 执行权限），无法运行 Waline/Artalk 等需常驻
后端进程的自建评论服务；Cactus（Matrix）在国内网络环境下加载不稳定。

### 选择
接入 [Giscus](https://giscus.app)：评论数据存储在仓库 GitHub Discussions（分类 General），
组件 `src/components/CommentSection.astro`（Astro 原生组件，注入 giscus client.js，
`is:inline` 透传外部脚本）。接入三个详情页模板：`/blog/[slug]`、`/tutorials/[slug]`
（zh-CN）、`/en/tutorials/[slug]`（en）。前置条件：仓库 `haogood4/linux-ai-hub`
由 private 改为 **public**（网站内容本就公开，无额外泄露；仓库无敏感文件）。

### 原因
零后端依赖、GitHub 登录天然防垃圾评论、读者画像（开发者）高度匹配、
评论与代码同仓库便于管理。

### 影响
- 仓库可见性 public；Discussions 已启用
- 评论加载依赖 giscus.app + GitHub API（国内访问基本可用，偶发慢）
- 无构建期影响（script 运行时注入），check 全绿、构建 67 页不变
