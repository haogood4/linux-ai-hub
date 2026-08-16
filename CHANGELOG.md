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
- SEO：robots.txt、sitemap、canonical、OG 基础标签、自定义 404
- 自检脚本：check:completion、check:links、check:distros、check:a11y、check:lhci（壳）、release-prep、build:inject-version
- 文档体系：AGENTS.md、PROJECT_PLAN.md、docs/DECISIONS.md（ADR-001~006）、docs/TASKS.md、docs/SCRIPTS.md、GIT_RULES.md

### 修复

- zod / @astrojs/svelte 依赖版本冲突（ADR-001）
- 移除 CDN Tailwind / Google Fonts，本地化样式（ADR-002）
- Node 26 下 MDX 构建失败（style-to-js override，ADR-006）
- Fedora 官方安装文档死链、首页 heading 跳级（h3 → h2）

### 技术决策

- 纯 Astro，移除 Svelte 集成（ADR-005）
- 默认中文，i18n 后置（ADR-003）

### 后置项（未实现）

- AI 教程：llama.cpp / vLLM、Docker + GPU、Stable Diffusion（占位）
- Plausible 埋点（需站点凭据）
- Pagefind 站内搜索、自托管 Inter 字体、LHCI 浏览器门禁、i18n 英文版