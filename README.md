# 🎓 个人博客 personal-blog

全栈动态个人博客:文章管理后台 + 中文全文搜索 + 暗色模式 + 阅读统计 + 个人简历页。

- **GitHub**: https://github.com/JJBSGW/personal-blog
- **技术栈**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · PostgreSQL · Prisma 7 · Meilisearch(规划中)· Docker Compose + Caddy(部署)

## 🚀 快速开始(conda 环境)

项目已在 conda 环境 `blog` 中配置好(nodejs 22 + python 3.12):

```bash
conda activate blog        # 激活环境
cd F:\MasterWork\PersonalBlog

npm run db:dev             # 启动本地数据库(嵌入式 PostgreSQL,数据在 .cache/pgdata)
npm run search:dev         # 启动本地搜索服务(首次自动下载 Meilisearch,约128MB)
npm run dev                # 启动博客开发服务器 → http://localhost:3000
```

> 没有 conda 也可以用任意 Node.js ≥ 20.9 直接跑,项目不依赖 Python/conda,依赖全部在项目内 `node_modules`。

## 🗄️ 数据库

- **本地开发**:嵌入式 PostgreSQL 18(真实 Postgres 二进制,随项目走,不装系统服务)
  - 数据目录:`.cache/pgdata`(已 gitignore);想重置数据库,删除该目录后重新 `npm run db:dev`
  - 脚本幂等:数据已初始化会自动跳过 initdb;端口已被占用会提示"已在运行"
- **生产部署**:Docker Compose 中的 PostgreSQL(见 `deploy/`,阶段 6 完善)

## 🧪 常用命令

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发服务器(localhost:3000) |
| `npm run db:dev` | 启动/复用本地数据库(5432) |
| `npm run search:dev` | 启动/复用本地搜索服务(7700,首次自动下载) |
| `npm run prisma:migrate` | 生成并应用数据库迁移 |
| `npm run prisma:generate` | 重新生成 Prisma Client |
| `npm run prisma:studio` | 数据库可视化界面 |
| `npm run build` / `npm start` | 生产构建与启动 |
| `node scripts/create-admin.mjs <邮箱> <密码>` | 创建/重置管理员账号 |
| `npx tsx scripts/seed.mjs` | 灌入占位文章/标签/简历数据 |
| `npx tsx scripts/sync-search.mts` | 全量重建搜索索引 |

## 📁 项目结构

```
prisma/              数据模型(schema.prisma)与迁移(migrations/)
src/
  app/               页面(App Router)
  lib/db.ts          Prisma Client 全局单例
  generated/prisma/  生成的类型安全客户端(勿手改)
scripts/
  dev-db.mjs         本地数据库启动脚本(幂等)
  test-prisma.mjs    端到端自检
deploy/              部署编排(阶段 6)
PLAN.md              项目计划文档
```

## 📌 当前进度

- [x] 阶段 1:项目初始化 + 数据库 + 数据模型
- [x] 阶段 2:前台页面(列表/详情/标签/关于/简历/RSS)
- [x] 阶段 3:后台管理(登录/Markdown 编辑器)
- [x] 阶段 4:全文搜索(Meilisearch)
- [x] 阶段 5:暗色模式 + 阅读统计
- [ ] 阶段 6:部署上线(Docker Compose + Caddy + 域名)

详见 `PLAN.md`。
