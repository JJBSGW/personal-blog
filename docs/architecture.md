# 项目架构与模块化约定

> 目标:低耦合、职责清晰,便于后续多人/多角色接入与功能扩展。

## 分层结构

```
src/
├── app/                    # 路由层(页面 + route handlers + server actions)
│   ├── (页面、admin 后台、api/*)
│   └── admin/actions.ts    # server actions 薄壳:解析表单→调服务→刷新缓存/重定向
├── lib/                    # 领域层(可复用、不依赖 UI)
│   ├── db.ts               # Prisma 单例
│   ├── auth.ts             # 会话 + 角色守卫(向外接口)
│   ├── password.ts         # 密码哈希
│   ├── rate-limit.ts       # 进程内限流
│   ├── format.ts           # 纯格式化工具(日期/阅读时长)
│   ├── markdown.ts         # slug/目录/锚点/rehype 插件
│   ├── site.ts             # 静态默认值(客户端安全,无 prisma)
│   ├── site-config.ts      # 服务端站点配置读取(getSiteConfig)
│   ├── posts.ts            # 前台文章查询服务
│   ├── search.ts           # Meilisearch 搜索服务
│   └── services/           # 领域服务层(纯业务逻辑,无 HTTP/表单/重定向)
│       ├── posts.ts        # 文章增删改 + 索引同步
│       ├── taxonomy.ts     # 标签/分类
│       └── content.ts      # 友链/评论/简历/站点内容
└── components/             # UI 层(展示与交互,不承载业务规则)
    └── admin/              # 后台组件
```

## 依赖方向(单向)

```
UI 层(components)
   ↓
路由层(app/*)
   ↓
领域服务层(lib/services, lib/posts, lib/search)
   ↓
基础设施层(lib/db, lib/auth, lib/password)
```

**原则**:上层可依赖下层,下层不得依赖上层;`lib/` 内不得 import `components/` 或 `app/`。

## 关键"向外接口"

### 1. 认证与角色(多人接入的核心接口)

`lib/auth.ts`:

- `getSessionUser(): Promise<SessionUser | null>` — 返回 `{ id, email, name, role }`
- `requireRole(...roles): Promise<SessionUser>` — 校验登录 + 角色,是统一的守卫入口
- `requireAdmin()` — `requireRole("ADMIN")` 的便捷包装
- `UserRole = "ADMIN" | "EDITOR"` — 角色枚举(Prisma `UserRole` 对齐)

> 后续接入多人时:
> - 新增用户时指定 `role`(普通写作者给 `EDITOR`,管理员给 `ADMIN`)
> - 页面/接口按 `requireRole("EDITOR")` 或 `requireRole("ADMIN")` 划分权限
> - 当前 `User.role` 默认 `ADMIN`;未来若开放自助注册,注册流程须显式赋 `EDITOR`

### 2. 领域服务层(供 server actions / API / 其它角色复用)

`lib/services/*` 暴露纯业务函数,例如:

- `createPost(input: PostInput)` / `updatePost(id, input)` / `deletePost(id)`
- `createTag(name)` / `deleteTag(id)`
- `createLink(input)` / `saveResumeData(rawJson)` / `saveSiteSettings(data)`

> 这些函数不接触 FormData / redirect / revalidatePath,任何入口(后台表单、未来 REST API、CLI、定时任务)都可直接调用。校验失败通过 `throw Error` 表达。

### 3. 站点配置

`getSiteConfig()`(lib/site-config.ts)返回合并后的站点信息(数据库值优先、静态默认兜底),全站通过它读取站名/简介/作者等,避免硬编码。

## 新增功能时的落点

| 需求 | 放哪里 |
|---|---|
| 新的写操作(如"新建草稿") | `lib/services/` 加函数 → `app/admin/actions.ts` 加薄壳 action |
| 新的前台查询(如"按月统计") | `lib/posts.ts` |
| 新的角色/权限 | `lib/auth.ts` 的 `requireRole` + `User.role` |
| 新的后台页面 | `app/admin/(dashboard)/` + `components/admin/` |
| 纯格式化函数 | `lib/format.ts` |

## 已知待办(与外部服务相关)

- 评论邮件通知(需 SMTP 配置,接口点:`app/api/posts/[slug]/comments/route.ts` 提交成功后)
- 公网部署(见 `deploy/README.md`)
