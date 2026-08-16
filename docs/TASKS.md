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

## 验收提醒

- 涉及安装 / 分区 / 双系统的页面必须包含备份风险提示（AGENTS.md §7）
- 每次构建通过 + 移动端检查后再标记完成