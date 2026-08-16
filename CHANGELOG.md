# Changelog

本项目的变更记录。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本语义遵循 [SemVer](https://semver.org/lang/zh-CN/)。

## [0.0.1] - 2026-08-16

### 新增

- 核心科普页面：首页、Linux 是什么、为什么选择 Linux、发行版推荐、发行版选择器
- 发行版独立详情页（Ubuntu / Linux Mint / Fedora / Arch / Debian / Rocky）
- 安装与迁移：Live USB 安装、双系统、虚拟机教程（均含备份风险提示）
- 包管理器命令行游戏（Debian / Arch / Red Hat 三派系 + 命令对照表 + 隐藏提示）
- 学习路径（入门 / 进阶 / AI 实践三档，数据化到 content 集合）
- AI 教程：Ollama 本地部署（首篇）
- 工具评测（14 个真实工具 × 4 分类）、深度文章（3 篇）、FAQ（含 FAQPage 结构化数据）
- 硬件兼容指南、软件替代方案、社区入口、诚实警示页、404 页
- SEO：robots.txt、sitemap、canonical、OG 完整标签（含 1200×630 分享图）、JSON-LD（WebSite / Organization / FAQPage）、自定义 404
- 站内搜索：零依赖方案（build-search-index 挂入 build 链 + Header 搜索面板）
- 自检脚本：check:completion、check:links、check:distros、check:a11y、check:lhci（LHCI 浏览器门禁，3 代表页全绿）、release-prep、build:inject-version、build:search-index
- 发行版选择器：5 问加权评分制（用途 / 经验 / 偏好 / 显卡 / 迁移来源），推荐 + 备选
- AEO：llms.txt（AI 爬虫可消费的站点索引）
- 工程化：GitHub Actions CI（build + 类型检查 + 全部自检脚本 + LHCI 门禁 + 产物/llms.txt 链接断言）、docs/DEPLOYMENT.md 部署指南
- 移动端搜索入口修复（此前 <640px 不可用）+ 面板关闭焦点归还 + aria-live 结果播报
- JSON-LD WebSite 增加 image 字段
- 文档体系：AGENTS.md、PROJECT_PLAN.md、docs/DECISIONS.md（ADR-001~008）、docs/TASKS.md、docs/SCRIPTS.md、GIT_RULES.md

### 修复

- zod / @astrojs/svelte 依赖版本冲突（ADR-001）
- 移除 CDN Tailwind / Google Fonts，本地化样式（ADR-002）
- Node 26 下 MDX 构建失败（style-to-js override，ADR-006）
- Fedora 官方安装文档死链、首页 heading 跳级（h3 → h2）
- 灰色文字对比度不足（gray-400→500）、链接仅靠颜色区分（补下划线）
- @lhci/cli 安装触发 @astrojs/sitemap 意外升级导致构建崩溃（锁定 3.3.1）
- CI 首次运行失败：pnpm 11 依赖构建脚本白名单配置错误（pnpm-workspace.yaml allowBuilds 重复键 + 占位值），修正为布尔映射

### 技术决策

- 纯 Astro，移除 Svelte 集成（ADR-005）
- 默认中文，i18n 后置（ADR-003）
- 站内搜索零依赖替代 Pagefind（ADR-007）、LHCI 门禁（ADR-008）

### 后置项（未实现）

- AI 教程：llama.cpp / vLLM、Docker + GPU、Stable Diffusion（占位）
- Plausible 埋点（需站点凭据）
- 自托管 Inter 字体（需 fonttools）、i18n 英文版