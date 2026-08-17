#!/usr/bin/env bash
# 部署到新网虚拟主机（香港机房）——生产环境
# 用法：DEPLOY_VHOST_PWD='面板生成的SFTP密码' ./src/scripts/deploy-vhost.sh [--skip-build]
# 依赖：pnpm（构建）、openssh sftp（系统自带）、curl（验证）
# 前置：面板 hcp.xinnet.com → SFTP/SSH → 生成密码（24h 有效）
set -euo pipefail

VHOST_HOST="app9700477507.xincache9.cn"
VHOST_PORT="52222"
VHOST_USER="app9700477507"
VHOST_SITE="https://tuxai.cn"
REMOTE_DIR="/home/app9700477507/www"

if [ -z "${DEPLOY_VHOST_PWD:-}" ]; then
  echo "错误：缺少密码，请先 export DEPLOY_VHOST_PWD='面板生成的SFTP密码'（24h 有效）" >&2
  exit 1
fi

if [ "${1:-}" != "--skip-build" ]; then
  echo "==> 构建中…"
  pnpm build
fi

[ -d dist ] || { echo "错误：dist/ 不存在，请先构建" >&2; exit 1; }

ASKPASS=$(mktemp /tmp/opencode/askpass.XXXXXX)
chmod 700 "$ASKPASS"
printf '#!/bin/sh\necho "%s"\n' "$DEPLOY_VHOST_PWD" > "$ASKPASS"

echo "==> 上传 dist/ 全部文件到 $VHOST_HOST…"
SSH_ASKPASS="$ASKPASS" SSH_ASKPASS_REQUIRE=force \
  scp -r -oStrictHostKeyChecking=no -oUserKnownHostsFile=/dev/null \
  -oConnectTimeout=15 -P "$VHOST_PORT" dist/. "$VHOST_USER@$VHOST_HOST:$REMOTE_DIR/"

rm -f "$ASKPASS"
echo "==> 上传完成，验证站点…"
for p in "" "what-is-linux/" "distros/ubuntu/" "tools/ollama/" "llms.txt" "en/tutorials/"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$VHOST_SITE/$p")
  echo "  /$p => $code"
  [ "$code" = "200" ] || { echo "警告：/$p 返回 $code" >&2; }
done
echo "==> 完成"