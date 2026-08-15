# syntax=docker/dockerfile:1
# 多阶段构建:依赖 → 构建 → 运行

# ---------- 依赖 ----------
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---------- 构建 ----------
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 生成 Prisma Client + 生产构建(页面均为 force-dynamic,构建期不连数据库)
RUN npx prisma generate && npm run build
# 移除 devDependencies,精简运行镜像
RUN npm prune --omit=dev --ignore-scripts

# ---------- 运行 ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Prisma schema-engine 需要 openssl
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/scripts ./scripts
COPY deploy/entrypoint.sh ./entrypoint.sh
# 保险:去除可能的 CRLF(Windows 检出),避免 Linux 容器内 "bad interpreter" 报错
RUN chmod +x ./entrypoint.sh && sed -i 's/\r$//' ./entrypoint.sh

EXPOSE 3000
CMD ["./entrypoint.sh"]
