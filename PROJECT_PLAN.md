# Linux AI Hub 项目开发计划

> 最后更新：2026-08-16

## 1. 项目定位

面向新手与 AI 开发者的 Linux 推广平台：帮助用户了解 Linux、选择发行版、完成安装，并最终在 Linux 上部署 AI 模型与工具链。

## 2. 技术栈（以现有项目为准）

- **Framework**: Astro 4.16（静态优先，SSG）
- **Interactivity**: 纯 Astro（无 Svelte，ADR-005）
- **Styling**: Tailwind CSS 4（@tailwindcss/vite 插件，CSS-first 配置，`src/styles/global.css` 中 @theme 定义）
- **Fonts**: 系统字体栈（Inter 自托管 subset 后置）
- **Content**: MDX（`src/content/tutorials` 等）+ Git
- **Search**: Pagefind（后置）
- **Analytics**: Plausible（后置，唯一埋点方案）
- **Deploy**: 自托管 Linux + Caddy（后置）
- **i18n**: 默认中文（`lang="zh-CN"`），i18n 后置

## 3. 阶段规划

### Phase 0 — 基础搭建（完成）
- [x] Astro + Tailwind + Svelte 集成，依赖版本冲突修复（zod、@astrojs/svelte）
- [x] 首页 `/`（Hero + 路径引导 + 迁移 CTA）
- [x] 全局 Layout / Header / Footer / 移动端菜单
- [x] 内容集合配置 `src/content/config.ts`
- [x] `PROJECT_PLAN.md` / `docs/DECISIONS.md` / `docs/TASKS.md` 就绪

### Phase 1 — 核心科普页面（完成）
- [x] `/what-is-linux` Linux 是什么
- [x] `/why-linux` 为什么选择 Linux
- [x] `/distros` 发行版推荐（含适用人群）
- [x] `/distros/picker` 发行版选择器（静态表单 + 建议结果 + 游戏拦截）
- [x] `/alternatives` 软件替代方案
- [x] 发行版独立详情页 `/distros/{ubuntu,mint,fedora,arch,debian,rocky}`（档案卡 + 安装步骤 + 命令速查 + 专属避坑 FAQ）

### Phase 2 — 安装与迁移（完成）
- [x] `/try/install` 本机安装（Live USB，含备份风险提示）
- [x] `/try/dual-boot` 双系统（含分区风险提示）
- [x] `/try/virtualbox` 虚拟机尝试
- [x] `/hardware` 硬件兼容（GPU 选购、驱动）

### Phase 3 — AI 部署内容
- [x] 教程：Ollama 本地部署
- [x] 教程：llama.cpp / vLLM 推理
- [x] 教程：Docker + GPU 容器
- [x] 教程：Open WebUI 图形界面
- [x] 教程：Stable Diffusion 部署
- [x] 教程：RAG 知识库实战（Ollama embedding + Qdrant）
- [x] `/paths` 学习路径聚合页（paths 集合 3 档路线）
- [x] `/terminal-game` 包管理器命令行游戏（Debian/Arch/Red Hat 三派系独立关卡 + 命令对照表）

### Phase 4 — 社区与增长
- [x] `/community` 社区入口
- [x] `/blog` 深度文章（3 篇）
- [x] `/faq` 常见问题（含 FAQPage 结构化数据）
- [x] `/not-for-you` 诚实警示页（哪些人不适合 Linux）
- [x] SEO 完善（metadata、sitemap、robots、404 页、OG 分享图、favicon）
- [x] 自检脚本：check-links / check:completion / check-distros / check:a11y / check:lhci / release-prep / inject-version / search-index
- [x] 站内搜索：轻量零依赖方案（Pagefind 因私有 registry 缺包未接入，功能等价：Header 搜索面板 + search-index.json）
- [x] Lighthouse CI 门禁（@lhci/cli + lighthouserc.json，3 页全绿）
- [ ] Plausible 接入（需站点凭据）

## 4. 里程碑

| 里程碑 | 目标 | 时间 |
|--------|------|------|
| M0 基础可用 | 首页 + 3 个核心页面可访问，构建通过 | 2026-08 中 |
| M1 MVP | Phase 1-2 全部页面 + 安装风险提示齐全 | 2026-09 初 |
| M2 内容增强 | Phase 3 AI 教程 4 篇 + 学习路径 | 2026-09 底 |
| M3 上线 | 部署、SEO、Plausible、站内搜索 | 2026-10 |

## 5. 验收标准

- 页面可访问、移动端 375px~1920px 正常、无 TypeScript 错误
- 文案新手友好；涉及安装/分区/迁移页面必须包含备份风险提示
- 每个页面有基础 SEO metadata
- 内容真实保守，不编造数据

## 6. 相关文档

- `AGENTS.md` — 工作守则（优先遵守）
- `docs/DECISIONS.md` — 重大技术决策
- `docs/TASKS.md` — 任务状态
- `GIT_RULES.md` — Git 操作规则