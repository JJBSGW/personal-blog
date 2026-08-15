import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "关于" };

export default function AboutPage() {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert">
      <h1>关于本站</h1>
      <p>
        欢迎来到 <strong>{siteConfig.name}</strong>,一个由{" "}
        <strong>{siteConfig.author}</strong> 维护的个人博客。
      </p>
      <blockquote>
        <p>本站当前内容为占位信息,阶段 3.5 之后可在后台直接编辑本页。</p>
      </blockquote>
      <h2>这个博客是干什么的?</h2>
      <ul>
        <li>📝 技术笔记:前端、后端、数据库、部署踩坑</li>
        <li>🔧 折腾记录:各种工具、服务器、自动化</li>
        <li>📚 读书笔记:偶尔的阅读与胡思乱想</li>
      </ul>
      <h2>技术栈(本站本身就是个作品)</h2>
      <p>
        Next.js 16 + TypeScript + Tailwind CSS v4 + PostgreSQL + Prisma 7,后续会加入
        Meilisearch 中文全文搜索、暗色模式与阅读统计。整个项目开源在{" "}
        <a href={siteConfig.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        。
      </p>
      <h2>联系我</h2>
      <ul>
        <li>
          邮箱:<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>(占位)
        </li>
        <li>
          GitHub:<a href={siteConfig.github}>{siteConfig.github}</a>
        </li>
      </ul>
      <h2>其他页面</h2>
      <p>
        想快速了解我?看看 <Link href="/resume">我的简历</Link>;想按主题找文章,去{" "}
        <Link href="/tags">标签页</Link>;想订阅更新,用 <Link href="/feed.xml">RSS</Link>。
      </p>
    </div>
  );
}
