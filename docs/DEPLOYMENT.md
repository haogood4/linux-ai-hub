# 部署指南

> 当前生产环境：新网虚拟主机（香港机房，免备案）。备选方案：自托管 Linux 服务器 + Caddy（见文末）。

## 0. 当前生产环境：新网虚拟主机（已上线 2026-08-17）

### 环境信息

- 控制台：`hcp.xinnet.com`（账号 `app9700477507`）
- 网站根目录：`/www`（SFTP 相对路径 `./www`）
- SFTP：`app9700477507.xincache9.cn:52222`（密码 24h 有效，面板生成）
- 域名：`tuxai.cn`（新网注册，实名已通过，NS: ns11/ns12.xincache.com，A: 91.110.206.229）
- 证书：TrustAsia DV（面板自动签发，**2026-11-14 到期需留意续签**）
- 临时访问地址（绑定域名前验证用）：`fbhbrldb.app9700477507.xincache8.cn`

### 更新部署

```sh
DEPLOY_VHOST_PWD='面板生成的SFTP密码' ./src/scripts/deploy-vhost.sh
```

脚本流程：`pnpm build` → SFTP 上传 `dist/` 全部文件 → 验证首页/代表页/llms.txt 状态码。
仅重新上传（跳过构建）：`DEPLOY_VHOST_PWD='…' ./src/scripts/deploy-vhost.sh --skip-build`

手动方式：面板「文件管理」或任意 SFTP 客户端（FileZilla 等）上传 `dist/` 内容到 `/www`。

### 虚拟主机限制与注意事项

- 无法自定义响应头（CSP/缓存/压缩由面板 CDN 统一管理，站内无外部资源，无 CSP 缺口）
- 未绑定域名时显示停站页（正常现象）；临时地址仅作验证
- **空间 2026-09-16 到期**：到期前需续费，否则站点停止
- **证书 2026-11-14 到期**：到期前在面板重新签发
- 面板已开启：CDN、WAF、自动续签证书

---

## 备选方案：自托管服务器 + Caddy

> 若将来迁移到 VPS（如腾讯云轻量香港 2C2G），可用本方案获得完整控制（自定义头、压缩、缓存、Fail2ban）。

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
    encode zstd gzip
    file_server

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
        Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'"
    }

    # SPA 无需 fallback：站点为全静态多页；404 由 Astro 生成的 404.html 兜底
    try_files {path} {path}/ /404.html

    # 静态资源缓存：图片/图标文件名不变，可短缓存；JSON（search-index/version）每次构建更新，不缓存
    @static path *.png *.svg *.ico
    header @static Cache-Control "public, max-age=86400"

    log {
        output file /var/log/caddy/tuxai.cn.log
    }
}
```

说明：
- `try_files` 兜底让未知路径返回自定义 404 页（HTTP 404 状态由 `file_server` 对缺失文件处理后经 `handle_errors` 呈现）。
- 站点无外部资源（系统字体栈、零 CDN/第三方脚本），CSP `'self'` 可直接生效；日后接入 Plausible 需在 `script-src` 与 `connect-src` 追加其域名。
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