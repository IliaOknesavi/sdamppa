#!/usr/bin/env bash
# Сборка и заливка статического сайта на твой сервер по rsync.
#
#   SERVER=user@host REMOTE=/var/www/codex ./deploy/deploy.sh
#
set -euo pipefail

SERVER="${SERVER:?Укажи SERVER=user@host}"
REMOTE="${REMOTE:-/var/www/codex}"

echo "▸ Сборка..."
npm run build

echo "▸ Заливка build/ → $SERVER:$REMOTE"
rsync -avz --delete build/ "$SERVER:$REMOTE/"

echo "✓ Готово. Не забудь про SPA-fallback в конфиге веб-сервера (см. deploy/nginx.conf или Caddyfile)."
