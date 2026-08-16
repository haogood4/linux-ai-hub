# 任务状态

> 当前 sprint：W24-W29（2026-08-16 起）
> 状态：⬜ 待办 / 🔄 进行中 / ✅ 完成 / ⛔ 阻塞

## Sprint W24-W29

| 任务 | 状态 | 备注 |
|------|------|------|
| 修复依赖版本冲突（zod / @astrojs/svelte） | ✅ | ADR-001 |
| 移除 CDN Tailwind / Google Fonts，本地化样式 | ✅ | ADR-002 |
| 全局 Layout / Header / Footer / 移动端菜单 | ✅ | |
| 首页 `/` | ✅ | Hero + 路径引导 + 迁移 CTA |
| 清理 Astro 模板残留（Welcome / Layout / svg） | ✅ | |
| 内容集合配置 `src/content/config.ts` | ✅ | ADR-004 |
| `/what-is-linux` | ✅ | |
| `/why-linux` | ✅ | |
| `/distros` | ✅ | 六大发行版对比表 |
| TS 别名 / 类型检查 / 构建全绿 | ✅ | `pnpm astro check` 0 errors |
| 移除 svelte 集成，保持纯 Astro | ✅ | ADR-005，经用户确认；产物无 JS |
| 教程列表页 `/tutorials` | ✅ | 消费 content 集合 |
| 教程详情页 `/tutorials/[slug]` | ✅ | getStaticPaths + render，面包屑 / 标签 / 阅读时长 |
| `/distros/picker` 发行版选择器 | ✅ | 三问规则表 + define:vars 内联脚本 |
| `/alternatives` 软件替代方案 | ✅ | 五大类替代表 + 无 Linux 版清单 |
| `/try/install` Live USB 安装 | ✅ | 含 RiskNotice 风险提示 |
| `/try/virtualbox` 虚拟机 | ✅ | 含风险提示 |
| `/try/dual-boot` 双系统 | ✅ | 高风险提示 + 故障恢复 |
| 修复 mdx 死链 + 安装 @astrojs/mdx | ✅ | astro 升级 4.16.19 修复集合类型生成 |
| 域名 tuxai.cn 品牌落地 | ✅ | site 配置 / Header / Footer / 页面 title |
| 全路由链接验证 | ✅ | 11 路由全部 200 |
| `/paths` 学习路径页 | ✅ | 三档路径聚合，消除 Header 404 |
| `/hardware` 硬件兼容页 | ✅ | GPU/网卡/外设清单 + AI 选购建议 |
| `/faq` 常见问题页 | ✅ | 9 条新手 FAQ（details 折叠） |
| `/community` 社区入口页 | ✅ | 中英文社区导航 + 提问礼仪 |
| Ollama 本地部署教程 | ✅ | 首个 AI 教程，含 API 调用与风险提示 |
| SEO：robots + sitemap + canonical/OG | ✅ | @astrojs/sitemap 3.3.1，16 页全部收录 |
| 修复 Node 26 下 mdx 构建失败 | ✅ | style-to-js 2.0.2 override（ADR-006） |
| 导航/Footer/首页链接覆盖新页面 | ✅ | Footer 移除 `#` 占位死链 |
| 全路由验证 | ✅ | 18 路由全部 200 |
| `/tools` 工具评测页 | ✅ | 14 个真实工具 × 4 分类 + 详情页 |
| `/blog` 深度文章 | ✅ | 索引 + 详情页，首篇《为什么 AI 生态默认跑在 Linux 上》 |
| Header/Footer 导航覆盖新页面 | ✅ | Header 6 项 / Footer 5 项 |
| `/not-for-you` 诚实警示页 | ✅ | 5 类不适合人群 + 换机前三件事 + picker 游戏拦截 |
| `/404` 自定义页面 | ✅ | 快捷入口 + 首页引导，noindex |
| 博客扩充 | ✅ | 3 篇：《AI 生态跑在 Linux》《零风险尝试三种方式》《发行版怎么选》 |
| `check-links` 死链检查 | ✅ | `pnpm check:links`，654 站内链接 0 死链 |
| `audit-completion` 完成度核查 | ✅ | `pnpm check:completion`（命令名避开 pnpm 保留字） |
| FAQ FAQPage JSON-LD | ✅ | 结构化数据注入 BaseLayout jsonLd prop |
| 发行版独立详情页 | ✅ | 6 篇 MDX（Ubuntu/Mint/Fedora/Arch/Debian/Rocky），档案卡+风险提示+游戏入口 |
| 包管理器命令行游戏 | ✅ | 三派系独立关卡 + 同页命令对照表 + 隐藏提示按钮 |
| distros 列表页游戏按钮 | ✅ | 每个发行版卡片「🎮 练习游戏」直连对应派系关卡 |
| 学习路径数据化 | ✅ | paths 集合 3 篇 MDX（入门/进阶/AI 实践），/paths 消费集合 |
| 首页内容地图 | ✅ | 博客/工具/游戏/FAQ/硬件/社区六大入口 |
| 全路由可达性验证 | ✅ | 47 页均至少一个站内入链 |
| audit 脚本增强 | ✅ | 递归统计源文件/构建 HTML，distros 集合纳入核查 |
| 静态检查零警告基线 | ✅ | `pnpm astro check` 0 errors / 0 warnings / 0 hints |
| 自检脚本补齐（distros / inject-version） | ✅ | `check:distros`（含 live 在线验证）+ `build:inject-version`，修复 Fedora 官方文档死链 |
| 自检脚本补齐（release-prep / a11y / lhci） | ✅ | 发布核查 + WCAG 静态审计 + LHCI 门禁壳，修复首页 h3 跳级 |
| OG 社交分享图 | ✅ | `public/og-image.png`（1200×630，rsvg-convert 生成），BaseLayout 注入 og:image / twitter:image |
| favicon 显式引用 | ✅ | BaseLayout `<link rel="icon">`（svg + ico 双声明） |
| 站内搜索（零依赖方案） | ✅ | `build:search-index` 生成 46 页索引 + Header 搜索面板；Pagefind 因 registry 缺包跳过 |
| LHCI 浏览器门禁接入 | ✅ | @lhci/cli + lighthouserc.json，3 页全绿（perf/bp/seo 100，a11y 100）；修复对比度与链接下划线问题 |
| 对比度 / 链接可辨识修复 | ✅ | gray-400→500、not-for-you red-600、footer/面包屑/正文链接下划线 |
| 文档体系补齐 | ✅ | GIT_RULES.md、CHANGELOG.md、README 重写（清除 Astro 模板残留）、SCRIPTS.md 同步 |
| 选择器扩展 5 问 + 评分制 | ✅ | 新增显卡 / 迁移来源两问；穷举规则表改为 5 维加权评分（weights），平局并列展示备选 |
| 首页 JSON-LD 结构化数据 | ✅ | WebSite + Organization @graph（FAQ 页已有 FAQPage） |
| build 链一次到位 | ✅ | `pnpm build` 串联 search-index + inject-version，AGENTS.md §16 脚本表同步补全 |
| AEO：llms.txt | ✅ | 面向 AI 爬虫的站点索引（20 个关键页面），preview 验证 200 |
| GitHub Actions CI | ✅ | push/PR 触发：build + astro check + 6 自检脚本 + 产物断言；修复 pnpm 11 allowBuilds 配置后全绿（40s） |
| 部署文档 | ✅ | docs/DEPLOYMENT.md：Caddyfile（gzip + 安全头 + 404 兜底）、rsync 增量备份、Fail2ban、防火墙、发布检查单 |
| LHCI 入 CI | ✅ | 4→5 代表页（+picker、terminal-game）；check-lhci 支持 CHROME_PATH 覆盖；CI 门禁全绿 |
| llms.txt 防漂移 | ✅ | CI 断言 llms.txt 内 23 个站内链接均指向真实产物 |

## 验收提醒

- 涉及安装 / 分区 / 双系统的页面必须包含备份风险提示（AGENTS.md §7）
- 每次构建通过 + 移动端检查后再标记完成