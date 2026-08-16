# Linux AI Hub 项目开发计划

> 最后更新：2026-08-16

## 1. 项目定位

面向新手与 AI 开发者的 Linux 推广平台：帮助用户了解 Linux、选择发行版、完成安装，并最终在 Linux 上部署 AI 模型与工具链。

## 2. 技术栈（以现有项目为准）

- **Framework**: Astro 4.16（静态优先，SSG）
- **Interactivity**: Svelte 5（@astrojs/svelte 6.0.2，仅高交互区域，当前无 .svelte 组件）
- **Styling**: Tailwind CSS 4（@tailwindcss/vite 插件，CSS-first 配置，`src/styles/global.css` 中 @theme 定义）
- **Fonts**: 系统字体栈（Inter 自托管 subset 后置）
- **Content**: MDX（`src/content/tutorials` 等）+ Git
- **Search**: Pagefind（后置）
- **Analytics**: Plausible（后置，唯一埋点方案）
- **Deploy**: 自托管 Linux + Caddy（后置）
- **i18n**: 默认中文（`lang="zh-CN"`），i18n 后置

## 3. 阶段规划

### Phase 0 — 基础搭建（进行中）
- [x] Astro + Tailwind + Svelte 集成，依赖版本冲突修复（zod、@astrojs/svelte）
- [x] 首页 `/`（Hero + 路径引导 + 迁移 CTA）
- [x] 全局 Layout / Header / Footer / 移动端菜单
- [ ] 内容集合配置 `src/content/config.ts`
- [ ] `PROJECT_PLAN.md` / `docs/DECISIONS.md` / `docs/TASKS.md` 就绪

### Phase 1 — 核心科普页面（MVP 必需）
- [ ] `/what-is-linux` Linux 是什么
- [ ] `/why-linux` 为什么选择 Linux
- [ ] `/distros` 发行版推荐（含适用人群）
- [ ] `/distros/picker` 发行版选择器（静态表单 + 建议结果）
- [ ] `/alternatives` 软件替代方案

### Phase 2 — 安装与迁移
- [ ] `/try/install` 本机安装（Live USB，含备份风险提示）
- [ ] `/try/dual-boot` 双系统（含分区风险提示）
- [ ] `/try/virtualbox` 虚拟机尝试
- [ ] `/hardware` 硬件兼容（GPU 选购、驱动）

### Phase 3 — AI 部署内容
- [ ] 教程：Ollama 本地部署
- [ ] 教程：llama.cpp / vLLM 推理
- [ ] 教程：Docker + GPU 容器
- [ ] 教程：Stable Diffusion 部署
- [ ] `/paths` 学习路径聚合页

### Phase 4 — 社区与增长
- [ ] `/community` 社区入口
- [ ] `/blog` 深度文章
- [ ] `/faq` 常见问题
- [ ] SEO 完善（metadata、sitemap、robots）
- [ ] Plausible 接入

## 4. 里程碑

| 里程碑 | 目标 | 时间 |
|--------|------|------|
| M0 基础可用 | 首页 + 3 个核心页面可访问，构建通过 | 2026-08 中 |
| M1 MVP | Phase 1-2 全部页面 + 安装风险提示齐全 | 2026-09 初 |
| M2 内容增强 | Phase 3 AI 教程 4 篇 + 学习路径 | 2026-09 底 |
| M3 上线 | 部署、SEO、Plausible、Pagefind | 2026-10 |

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