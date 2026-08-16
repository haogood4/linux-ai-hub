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
| 教程列表页 `/tutorials` | ⬜ | 消费 content 集合 |

## 验收提醒

- 涉及安装 / 分区 / 双系统的页面必须包含备份风险提示（AGENTS.md §7）
- 每次构建通过 + 移动端检查后再标记完成