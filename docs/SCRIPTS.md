# 脚本使用文档

> 项目脚本统一位于 `src/scripts/`：Node ESM、零外部依赖、shebang 可执行、人类可读 + JSON 双输出。

## 已实现

| 脚本 | 命令 | 用途 | 输出 |
|------|------|------|------|
| `audit-completion.mjs` | `pnpm check:completion` / `pnpm check:completion:json` | 完成度核查：页面数、集合条目、构建产物、sitemap 收录、安装页备份风险提示覆盖 | 人类可读 / JSON |
| `check-links.mjs` | `pnpm check:links` / `pnpm check:links:json` | 死链检查：扫描 dist/ HTML 产物的站内链接（a/img/link），站外链接仅报告不请求 | 人类可读 / JSON |
| `check-distros.mjs` | `pnpm check:distros` / `check:distros:json` / `check:distros:live` | 发行版核查：frontmatter 完整性、详情页构建产物、官方 URL 格式；`--check-live` 联网 HEAD 验证官方链接可达性 | 人类可读 / JSON |
| `inject-version.mjs` | `pnpm build:inject-version` | 构建版本注入：生成 dist/version.json（含构建时间），并注入 `meta generator` 到 dist/index.html（幂等） | 人类可读 / JSON |

## 注意事项

- **命令名差异**：AGENTS.md §16 表格中 `pnpm audit` / `pnpm audit:json` 与 pnpm 内置依赖审计命令冲突（私有 registry 无 audit endpoint），已完成度核查改为 `check:completion` 系列，使用以本表为准。
- `check-links` 依赖构建产物：运行前先 `pnpm build`。JS 模板字符串中的 `${...}` 占位链接会被自动忽略。
- 退出码约定：0 = 通过；1 = 发现死链 / 关键项失败；2 = 参数错误或产物缺失。

## 规划中（未实现）

AGENTS.md §16 表格中的 `release-prep.mjs`、`check-a11y.mjs`、`check-lhci.mjs` 尚未实现。落地前提：
- `check-lhci.mjs` 依赖 Lighthouse CI 环境（需引入依赖，与「零外部依赖」约束冲突），随 CI 上线推进
- `release-prep.mjs` 依赖版本管理流程（changelog / tag 策略）确认后实现
- `check-a11y.mjs` 的对比度等视觉项无法在纯静态脚本中自动验证，建议随 Playwright 审计环境落地