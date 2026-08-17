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
| 移动端搜索入口 | ✅ | 搜索按钮此前在 <640px 隐藏（功能缺失），改为全断点可见；面板关闭焦点归还（Escape）+ aria-live 结果播报 |
| JSON-LD 补强 | ✅ | WebSite 增加 image（og-image.png）；Organization 已有 logo；搜索为前端过滤无服务端 URL，不添加 SearchAction |
| terminal-game 动态 a11y 审计 | ✅ | 输出区与分数区 aria-live、输入 aria-label、重置后焦点管理均已在 |
| 真实浏览器交互测试 | ✅ | agent-browser 实测：搜索（输入→结果→跳转）、picker（5 问→Ubuntu+Mint 推荐）、终端游戏（答错/答对判分）全部通过 |
| dev 搜索索引修复 | ✅ | 索引仅生成 dist 导致 dev 模式搜索 404；改为双输出 dist + public（gitignore），SCRIPTS.md 注明 dev 依赖 |
| 移动端菜单修复 | ✅ | 实测 375px：菜单打开后导航链接横排重叠（flex-row）；修复为竖排（flex-col），几何断言通过 |
| 外链可达性核查 | ✅ | 60 个外部站点链接 54 直连可达，其余（wiki.archlinux/rockylinux/docs.docker）抖动后 200；Reddit 国内不可达已加提示 |
| 内容占位符扫描 | ✅ | 无占位/施工中残留 |
| 部署缓存建议 | ✅ | Caddyfile 增加图片/图标 1 天缓存；JSON 索引不缓存（每次构建更新）；压缩升级为 zstd + gzip |
| **上线部署（新网虚拟主机）** | ✅ 2026-08-17 | 香港机房免备案；SFTP 上传 dist → 临时地址验证全站 200 → 域名实名通过（NS 生效）→ 绑定 tuxai.cn（自动解析+A 记录 91.110.206.229）→ TrustAsia DV 证书自动签发 → **https://tuxai.cn 全站 46 页 HTTPS 200**。部署脚本 src/scripts/deploy-vhost.sh（零依赖，SSH_ASKPASS 传密码）。⚠️ 空间 2026-09-16 到期需续费；证书 2026-11-14 到期需续签 |
| sitemap 完整性 | ✅ | 46 条目 = 47 页 − 404（正确排除），无缺失无多余 |
| 内容真实性核查 | ✅ | ollama 教程命令/模型名/API 端口全部正确，事实表述保守；terminal-game 三派系 30 题命令全部正确（normalize 小写匹配设计合理） |

## 验收提醒

- 涉及安装 / 分区 / 双系统的页面必须包含备份风险提示（AGENTS.md §7）
- 每次构建通过 + 移动端检查后再标记完成
| llama.cpp 量化推理教程 | ✅ | 2026-08-17 | GGUF/Q4_K_M/llama-cli/llama-server OpenAI 兼容 API，内容经 2026-08 真实资料核查（b10369） |
| Docker + GPU 容器教程 | ✅ | 2026-08-17 | nvidia-container-toolkit（nvidia-docker2 已弃用）、CUDA 镜像验证、容器跑 Ollama 实战 |
| GitHub 动态页上线 | 🔄 | 2026-08-17 | 页面+导航已提交并 CI 全绿；等待 SFTP 密码部署 |

| vLLM 高吞吐推理教程 | ✅ | 2026-08-17 | vllm serve / OpenAI 兼容 API / 多卡并行 / AWQ，经 2026-08 官方文档核查 |
| Open WebUI 教程 | ✅ | 2026-08-17 | Docker Compose（Ollama+WebUI）、模型选型表、接 vLLM/llama.cpp 进阶 |
| Stable Diffusion 教程 | ✅ | 2026-08-17 | WebUI 部署、SD1.5/SDXL 模型、Civitai 来源、低显存参数，经 2026-08 资料核查 |
| 教程库规划清单更新 | ✅ | 2026-08-17 | Phase 3 全部 5 篇上线；新规划：RAG/Dify/MCP/ComfyUI/AI 视频/TTS |

| RAG 知识库实战教程 | ✅ | 2026-08-17 | Ollama embedding（nomic/bge-m3/all-minilm 对照）+ Qdrant 入库/检索/生成全流程 + rerank/混合检索进阶，经 2026-08 多源核查（embedding 维度、chunking 经验值、Qdrant 6333 端口） |

| Dify 可视化 AI 应用搭建教程 | ✅ | 2026-08-17 | Docker Compose 部署（11 容器、版本 1.13+、4G 内存起步）+ 对接 Ollama（OLLAMA_HOST=0.0.0.0 + host.docker.internal 避坑）+ 知识库问答应用实操，经 2026-08 多源核查 |

| ComfyUI 工作流入门教程 | ✅ | 2026-08-17 | Windows 便携包/Linux 源码两种安装 + 核心节点讲解（CheckpointLoader/KSampler/VAEDecode）+ 与 WebUI 共用模型（extra_model_paths.yaml）+ ComfyUI-Manager + 社区工作流加载，经 2026-08 多源核查（端口 8188、显存 4GB 起步、启动参数） |
