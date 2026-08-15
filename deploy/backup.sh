#!/usr/bin/env bash
# 数据库备份脚本:pg_dump 压缩 + 保留最近 14 份
# 用法:./backup.sh  ;或加入 crontab: 0 3 * * * /opt/blog/deploy/backup.sh >> /var/log/blog-backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")"

# 读取 .env(若存在)
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  . ./.env
  set +a
fi

mkdir -p ../backups
TS=$(date +%Y%m%d_%H%M%S)
FILE="../backups/blog_${TS}.sql.gz"

docker compose exec -T db pg_dump -U "${POSTGRES_USER:-blog}" "${POSTGRES_DB:-blog}" | gzip > "$FILE"

# 只保留最近 14 份
ls -1t ../backups/blog_*.sql.gz | tail -n +15 | xargs -r rm -f

echo "备份完成: $FILE"
