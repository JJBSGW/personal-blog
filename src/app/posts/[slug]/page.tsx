import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedPostBySlug,
  getPostNeighbors,
} from "@/lib/posts";
import { Markdown } from "@/components/markdown";
import { Toc } from "@/components/toc";
import { formatDate, readingMinutes } from "@/components/post-card";
import { ViewTracker } from "@/components/view-tracker";
import { CommentForm } from "@/components/comment-form";
import { siteConfig } from "@/lib/site";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "文章不存在" };
  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.summary ?? undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      url: `${siteConfig.url}/posts/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = await getPostNeighbors(post);
  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <article className="space-y-6">
      <ViewTracker slug={post.slug} />
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          {post.category && (
            <Link
              href={`/categories/${post.category.slug}`}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {post.category.name}
            </Link>
          )}
          <time dateTime={post.publishedAt?.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span>约 {readingMinutes(post.content)} 分钟</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight">
          {post.title}
        </h1>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link
                key={t.id}
                href={`/tags/${t.slug}`}
                className="text-sm text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                #{t.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <Toc content={post.content} />

      <Markdown content={post.content} />

      {/* 评论区 */}
      <section className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h2 className="text-xl font-bold">
          评论{comments.length > 0 && `(${comments.length})`}
        </h2>
        {comments.length > 0 && (
          <ul className="mt-4 space-y-4">
            {comments.map((c) => (
              <li
                key={c.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-medium">{c.author}</span>
                  <span className="text-xs text-zinc-400">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  {c.content}
                </p>
              </li>
            ))}
          </ul>
        )}
        <CommentForm slug={post.slug} />
      </section>

      <nav className="grid gap-3 border-t border-zinc-200 pt-5 text-sm sm:grid-cols-2 dark:border-zinc-800">
        {prev ? (
          <Link
            href={`/posts/${prev.slug}`}
            className="rounded-lg border border-zinc-200 p-3 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">← 上一篇</p>
            <p className="mt-1 font-medium line-clamp-1">{prev.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className="rounded-lg border border-zinc-200 p-3 text-right transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <p className="text-xs text-zinc-500 dark:text-zinc-400">下一篇 →</p>
            <p className="mt-1 font-medium line-clamp-1">{next.title}</p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
