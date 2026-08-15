#!/bin/sh
# 容器启动入口:先执行数据库迁移,再启动 Next.js
set -e

echo "[entrypoint] 正在执行数据库迁移(prisma migrate deploy)..."
npx prisma migrate deploy

echo "[entrypoint] 正在启动 Next.js..."
exec node node_modules/next/dist/bin/next start
