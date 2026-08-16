# 部署指南

> 目标环境：自托管 Linux 服务器（Debian 12 / Rocky 9）+ Caddy。纯静态站点，无 Node 进程常驻。

## 1. 本地构建

```sh
pnpm install
pnpm build          # astro build + search-index + inject-version 一次完成
pnpm release-prep   # 发布前核查（版本号 / 构建产物 / 死链 / 备份提示 / git 状态）
```

产物在 `dist/`：47 个页面 + `search-index.json`（站内搜索索引）+ `version.json`（版本与构建时间）+ `sitemap-*.xml` + `llms.txt`。

## 2. 上传

```sh
rsync -az --delete dist/ deploy@SERVER:/var/www/tuxai.cn/
```

`--delete` 会清理远端旧文件；首次部署前先备份服务器上已有内容（如有）。

## 3. Caddy 配置（/etc/caddy/Caddyfile）

```caddy
tuxai.cn {
    root * /var/www/tuxai.cn
    encode gzip
    file_server

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }

    # SPA 无需 fallback：站点为全静态多页；404 由 Astro 生成的 404.html 兜底
    try_files {path} {path}/ /404.html

    log {
        output file /var/log/caddy/tuxai.cn.log
    }
}
```

说明：
- `try_files` 兜底让未知路径返回自定义 404 页（HTTP 404 状态由 `file_server` 对缺失文件处理后经 `handle_errors` 呈现）。
- 纯静态站点不需要 systemd 服务；Caddy 自身由 systemd 管理（`systemctl enable --now caddy`）。
- 若日后接入 Plausible 自托管，另行配置反向代理，不影响本站点。

## 4. 备份

每日快照 + 保留 14 天（cron）：

```sh
# /etc/cron.d/tuxai-backup
15 3 * * * root rsync -az --link-dest=/var/backups/tuxai/yesterday /var/www/tuxai.cn/ /var/backups/tuxai/$(date +\%F)/ && \
    find /var/backups/tuxai -maxdepth 1 -type d -mtime +14 -exec rm -rf {} + && \
    touch /var/backups/tuxai/yesterday
```

`--link-dest` 硬链接增量，只占当日变化量。恢复：`rsync -az /var/backups/tuxai/YYYY-MM-DD/ /var/www/tuxai.cn/`。

## 5. 基础防护

- **SSH**：禁用密码登录（`PasswordAuthentication no`），仅密钥登录；如需换端口可改 `Port`。
- **Fail2ban**：保护 SSH 与 Caddy 访问日志，防暴力破解：

```sh
apt install fail2ban
# /etc/fail2ban/jail.local
[sshd]
enabled = true
maxretry = 5
bantime = 1h

[caddy]
enabled = true
port = http,https
logpath = /var/log/caddy/tuxai.cn.log
maxretry = 20
bantime = 1h
```

- **防火墙**：仅放行 22 / 80 / 443（`ufw allow OpenSSH && ufw allow 'WWW Full' && ufw enable`）。
- 保持系统更新：`apt update && apt upgrade`（建议配置无人值守安全更新）。

## 6. 发布流程检查单

1. `pnpm release-prep` 通过（阻断 0）
2. `pnpm check:links` / `pnpm check:a11y` 通过
3. 变更已提交并推送（CI 全绿）
4. `pnpm build` 后 rsync 上传
5. 验证：`curl -I https://tuxai.cn/`、`/search-index.json` 返回 200、`/llms.txt` 可达

## 安全与合规

- 站点无用户提交数据、无表单后端、无 cookie；部署侧无需额外数据处理合规措施。
- 若启用日志访问分析，注意日志含访客 IP，按当地法规保留期限管理。