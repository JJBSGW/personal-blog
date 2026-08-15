// Prisma 7 配置文件(官方推荐格式)
// 运行 Prisma 命令前需要先启动本地数据库: node scripts/dev-db.mjs
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
