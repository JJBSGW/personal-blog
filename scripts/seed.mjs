// 种子数据脚本:插入占位文章/标签/分类/简历,幂等(upsert,可重复执行)
// 运行:npx tsx scripts/seed.mjs
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PUBLISHED = "PUBLISHED";

const tags = [
  { name: "Next.js", slug: "nextjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "前端", slug: "frontend" },
  { name: "折腾", slug: "tinkering" },
  { name: "随笔", slug: "essay" },
  { name: "读书笔记", slug: "reading" },
];

const categories = [
  { name: "技术", slug: "tech" },
  { name: "随笔", slug: "essay" },
  { name: "折腾", slug: "tinkering" },
];

const posts = [
  {
    slug: "hello-world",
    title: "你好,深夜编码室!",
    summary: "第一篇占位文章:这里是深夜编码室,一个与代码搏斗的地方。",
    category: "tech",
    tagSlugs: ["nextjs", "typescript", "frontend"],
    viewCount: 233,
    content: `欢迎来到**深夜编码室** 👋

这是一个用 [Next.js 16](https://nextjs.org) + PostgreSQL + Prisma 搭建的全栈博客(占位内容)。

## 这里会写什么

- 前端与后端的踩坑笔记
- 服务器与部署的折腾记录
- 偶尔的读书笔记与随笔

## 关于本站的架构

\`\`\`text
浏览器 → Next.js 16 (App Router)
            ├─ PostgreSQL (文章/标签/统计)
            └─ Meilisearch (中文全文搜索,阶段 4)
\`\`\`

## 为什么叫"深夜编码室"

因为本博客大多数文章,都是在凌晨两点之后写出来的。

> 温馨提示:熬夜写代码一时爽,一直熬夜一直爽(并不)。

## 结语

占位文章到此为止。真正的第一篇文章,由未来的你来写。`,
  },
  {
    slug: "why-postgres-has-no-elephant",
    title: "我的博客跑在 PostgreSQL 上,却没有一只大象",
    summary: "关于我为什么给博客选 PostgreSQL,以及那只缺席的大象。",
    category: "tech",
    tagSlugs: ["postgresql", "tinkering"],
    viewCount: 10086,
    content: `PostgreSQL 的吉祥物是一只名叫 **Slonik** 的大象,但我的博客里一只都没有——因为我用的是嵌入式 Postgres,大象还在动物园。

## 为什么选 PostgreSQL

1. **稳定**:二十多年的积累,事务、索引、全文搜索样样齐全
2. **标准**:SQL 标准支持度最高,学了不亏
3. **生态**:Prisma、Drizzle 等 ORM 支持最好

## 本地开发怎么办

没有 Docker 的日子,我用 embedded-postgres 在项目目录里跑了一个真实的 PostgreSQL 18:

| 方案 | 优点 | 缺点 |
|---|---|---|
| Docker | 隔离、标准 | 需要装 Docker |
| 嵌入式 | 零安装、随项目走 | 仅适合开发 |
| 云数据库 | 免运维 | 花钱、有延迟 |

## 小结

开发用嵌入式,生产用 Docker Compose 里的正式 Postgres——**数据模型完全一致,无缝切换**。

> 大象虽然没来,但 Postgres 一直都在。`,
  },
  {
    slug: "typescript-type-gymnastics",
    title: "TypeScript 类型体操:从摸鱼到优雅",
    summary: "用几个小例子,展示 TypeScript 类型系统到底能玩出什么花样。",
    category: "tech",
    tagSlugs: ["typescript", "frontend"],
    viewCount: 2048,
    content: `TypeScript 的类型系统是图灵完备的——也就是说,你可以用它写出任何东西,包括让人看不懂的代码。

## 基础:字面量类型与联合

\`\`\`ts
type Status = "draft" | "published" | "archived";

function publish(s: Status) {
  // ...
}
\`\`\`

## 进阶:条件类型

\`\`\`ts
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>; // false
\`\`\`

## 高阶:模板字面量类型

\`\`\`ts
type EventName = \`on\${Capitalize<"click" | "submit">}\`;
// "onClick" | "onSubmit"
\`\`\`

## 摸鱼心得

- 类型体操写得好,不代表业务写得好
- 适度使用,避免成为"类型炼金术士"
- **可读性优先**,优雅其次

## 总结

类型系统是工具,不是目的。用它能少写 bug,而不是多写类型。`,
  },
  {
    slug: "deploy-502-guide",
    title: "部署服务器避坑指南:从 0 到 502",
    summary: "一次教科书级别的 502 事故复盘,以及那些没人告诉你的部署细节。",
    category: "tinkering",
    tagSlugs: ["tinkering", "nextjs"],
    viewCount: 666,
    content: `部署自己的第一台服务器,通常以一行 **502 Bad Gateway** 收场。本文(占位)复盘常见坑。

## 常见的 502 来源

### 1. 端口没对上

\`\`\`nginx
# 反代指到了 3001,但应用监听的是 3000
proxy_pass http://127.0.0.1:3001;
\`\`\`

### 2. 应用根本没起来

\`\`\`bash
# 检查进程
ss -tlnp | grep 3000
# 看日志
docker compose logs -f app
\`\`\`

### 3. 内存不足被 OOM

1. 数据库吃内存
2. 搜索引擎吃内存
3. Node 也吃内存
4. 于是大家一起死

## 防坑清单

- [x] 防火墙只开 80/443
- [x] SSH 用密钥登录
- [ ] 数据库和搜索不暴露公网
- [ ] 定时备份数据库

## 结语

502 不可怕,可怕的是不知道去哪里看日志。**先看日志,再修代码。**`,
  },
  {
    slug: "midnight-code-quality",
    title: "为什么深夜写的代码质量更高(并没有)",
    summary: "关于深夜编程的迷思:咖啡、月光与自欺欺人。",
    category: "essay",
    tagSlugs: ["essay"],
    viewCount: 42,
    content: `深夜写代码,有一种奇特的仪式感:世界安静了,只有键盘声和风扇声。

## 深夜编程的好处

- 没有消息打扰,专注度拉满
- 头脑"清醒"(其实是咖啡因在起作用)
- 提交记录看起来很有干劲

## 深夜编程的真相

| 时间 | 效率 | 次日后悔程度 |
|---|---|---|
| 早上 9 点 | 高 | 低 |
| 凌晨 2 点 | 幻觉般的高 | 极高 |

> 凌晨写下的注释,白天读起来往往像外星语。

## 结论

**早睡早起,代码更好。** 但如果你非要深夜写,记得写注释——给白天的自己。`,
  },
  {
    slug: "reading-notes-2026",
    title: "2026 上半年读书笔记(占位)",
    summary: "一个拖延症患者的读书清单:买了就是读了,收藏了就是学完了。",
    category: "essay",
    tagSlugs: ["reading", "essay"],
    viewCount: 7,
    content: `这是一篇诚实的读书笔记:以下书籍大多买了,部分翻过,极少数读完。

## 已读完(真的)

1. 《如何阅读一本书》(读了序言,算吗)
2. 《代码整洁之道》(第三章)

## 在读(无限期)

- 《深入理解计算机系统》(经典,就是有点厚)
- 《数据库系统概念》(翻到第 100 页,然后从第 1 页重来)

## 收藏但未读

- 《算法导论》(收藏即胜利)
- 《设计模式》(等一个用得上它的项目)

## 占位总结

> 读书最大的谎言:我收藏了 = 我会读。

明年上半年,争取把"在读"变成"读完"。`,
  },
];

const resumeData = {
  name: "夜猫子站长",
  title: "全栈开发爱好者 / 摸鱼学博士(占位)",
  contact: {
    email: "hi@example.dev",
    github: "https://github.com/JJBSGW",
    location: "赛博空间 404 号(占位)",
  },
  summary:
    "白天写业务代码,晚上写博客。对 TypeScript、PostgreSQL 与一切能折腾的东西保持好奇。本条为占位信息,上线前请替换。",
  education: [
    {
      title: "某大学 · 计算机科学(占位)",
      subtitle: "硕士研究生",
      period: "20XX - 20XX",
      description: "研究方向:分布式系统与摸鱼行为学(占位)。",
    },
  ],
  projects: [
    {
      title: "深夜编码室(本项目)",
      subtitle: "作者 / 运维 / 扫地僧",
      period: "2026 - 至今",
      description:
        "一个使用 Next.js 16 + PostgreSQL + Prisma 构建的全栈博客,含后台管理、中文全文搜索、阅读统计与简历页。",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    },
    {
      title: "占位项目:自动泡面机",
      subtitle: "硬件 × 软件",
      period: "20XX",
      description:
        "用树莓派控制泡面水温,并试图用量化数据证明泡面是深夜编程的最佳伴侣。",
      tags: ["Raspberry Pi", "IoT"],
    },
  ],
  skills: [
    { name: "TypeScript / JavaScript", level: 4 },
    { name: "React / Next.js", level: 4 },
    { name: "PostgreSQL / SQL", level: 3 },
    { name: "Docker / Linux", level: 3 },
    { name: "Python", level: 3 },
    { name: "CSS / Tailwind", level: 4 },
  ],
  awards: [
    { title: "最佳摸鱼奖(占位)", period: "20XX", description: "某次黑客松最优雅的摸鱼姿势。" },
    { title: "深夜提交之星(占位)", period: "20XX", description: "连续 30 天凌晨 2 点提交代码(不推荐模仿)。" },
  ],
  experience: [
    {
      title: "某不知名公司(占位)",
      subtitle: "前端实习生",
      period: "20XX",
      description: "负责把设计稿变成页面,以及把页面改回设计稿。",
    },
  ],
};

// ---------- 写入 ----------
async function main() {
  for (const t of tags) {
    await prisma.tag.upsert({ where: { slug: t.slug }, update: {}, create: t });
  }
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const p of posts) {
    const category = await prisma.category.findUnique({ where: { slug: p.category } });
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary,
        content: p.content,
        categoryId: category?.id ?? null,
        status: PUBLISHED,
        publishedAt: new Date(),
        viewCount: p.viewCount,
      },
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        content: p.content,
        categoryId: category?.id ?? null,
        status: PUBLISHED,
        publishedAt: new Date(),
        viewCount: p.viewCount,
        tags: { connect: p.tagSlugs.map((s) => ({ slug: s })) },
      },
    });
  }
  await prisma.resume.upsert({
    where: { id: 1 },
    update: { data: resumeData },
    create: { id: 1, data: resumeData },
  });

  // 友链占位(仅在没有任何友链时创建;后台可自由增删)
  const linkCount = await prisma.friendLink.count();
  if (linkCount === 0) {
    await prisma.friendLink.createMany({
      data: [
        { name: "Next.js 官方", url: "https://nextjs.org", description: "本博客使用的框架,文档齐全", sort: 1 },
        { name: "Prisma 官方", url: "https://www.prisma.io", description: "类型安全的数据库 ORM", sort: 2 },
        { name: "Meilisearch 官方", url: "https://www.meilisearch.com", description: "全文搜索引擎,中文分词很棒", sort: 3 },
        { name: "PostgreSQL 官方", url: "https://www.postgresql.org", description: "最可靠的开源关系型数据库", sort: 4 },
        { name: "MDN Web Docs", url: "https://developer.mozilla.org/zh-CN/", description: "前端开发者必备手册", sort: 5 },
      ],
    });
    console.log("友链占位已创建(5 条)");
  }

  const counts = {
    posts: await prisma.post.count(),
    tags: await prisma.tag.count(),
    categories: await prisma.category.count(),
    links: await prisma.friendLink.count(),
  };
  console.log("种子数据写入完成:", counts);
}

await main();
await prisma.$disconnect();
