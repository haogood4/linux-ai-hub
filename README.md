# Linux AI Hub

推广 Linux 系统的网站，帮助开发者了解、配置并生产 AI 模型。

站点：https://tuxai.cn（构建中）

[![CI](https://github.com/haogood4/linux-ai-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/haogood4/linux-ai-hub/actions/workflows/ci.yml)

## 核心原则

- 面向新手友好，不贬低其他系统
- 强调 Linux 的自由、开源、安全、稳定、可定制
- 所有内容都应帮助用户降低尝试 Linux + AI 的门槛
- 代码保持简洁、组件化、可维护
- 页面必须兼顾 SEO、移动端和无障碍访问
- 内容真实保守，不编造数据；安装/分区/双系统页面必须含备份风险提示

## 页面

1. `/` 首页（Hero + 路径引导 + 内容地图）
2. `/what-is-linux` Linux 是什么
3. `/why-linux` 为什么选择 Linux
4. `/distros` 发行版推荐 + 6 个独立详情页 `/distros/{slug}`
5. `/distros/picker` 发行版选择器
6. `/try/install` / `/try/dual-boot` / `/try/virtualbox` 安装指南
7. `/alternatives` 软件替代方案
8. `/paths` 学习路线（入门 / 进阶 / AI 实践）
9. `/tutorials` AI 教程库（Ollama 已上线，其余规划中）
10. `/tools` 工具评测（14 个真实工具）
11. `/blog` 深度文章、`/faq`、`/hardware`、`/community`、`/not-for-you`
12. `/terminal-game` 包管理器命令行游戏（Debian / Arch / Red Hat）

## 技术方向

- Astro 4.x（纯 Astro，无客户端框架，产物零 JS）
- Tailwind CSS 4（`src/styles/global.css` @theme，本地样式）
- 系统字体栈（Inter 自托管后置）
- 内容放 `src/content/`（tutorials / paths / tools / blog / distros）
- 通用组件放 `src/components/`
- 站内搜索：零依赖轻量方案（构建时生成 `search-index.json` + Header 搜索框；Pagefind 因私有 registry 缺包暂未接入）

## 常用命令

| 命令 | 用途 |
|------|------|
| `pnpm dev` | 本地开发 |
| `pnpm build` | 生产构建（47 页） |
| `pnpm astro check` | 类型检查（0 errors / 0 warnings / 0 hints） |
| `pnpm check:completion` | 完成度核查 |
| `pnpm check:links` | 死链检查 |
| `pnpm check:distros` / `check:distros:live` | 发行版核查 / 官方链接在线验证 |
| `pnpm check:a11y` | 无障碍静态审计（WCAG 静态规则） |
| `pnpm check:lhci` | Lighthouse CI 门禁（需 lighthouserc.json + Chrome；CI 用 `CHROME_PATH` 覆盖） |
| `pnpm release-prep` | 发布就绪度核查 |
| `pnpm build:inject-version` | 构建版本注入（dist/version.json + meta） |
| `pnpm build:search-index` | 生成站内搜索索引 |

完整脚本文档见 `docs/SCRIPTS.md`。

## 项目文档

- `AGENTS.md` / `CLAUDE.md` — 工作守则
- `PROJECT_PLAN.md` — 开发计划
- `docs/DECISIONS.md` — 技术决策记录（ADR-001~006）
- `docs/TASKS.md` — 任务状态
- `docs/SCRIPTS.md` — 脚本使用文档
- `docs/DEPLOYMENT.md` — 部署指南（Caddy + 备份 + 防火墙）
- `GIT_RULES.md` — Git 操作规则

## 重要提醒

涉及安装、分区、双系统和迁移的内容，必须提醒用户提前备份数据。