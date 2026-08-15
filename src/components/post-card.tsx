import Link from "next/link";
import type { PostWithRelations } from "@/lib/posts";

/** 估算阅读时长:中文按 300 字/分钟,英文按 200 词/分钟 */
export function readingMinutes(content: string): number {
  const cjk = (content.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = content
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 300 + words / 200));
}

const dateFmt = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" });

export function formatDate(d: Date | null | undefined): string {
  return d ? dateFmt.format(d) : "未发布";
}

export function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="glass group rounded-xl p-5 transition-colors">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        {post.category && (
          <Link
            href={`/categories/${post.category.slug}`}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {post.category.name}
          </Link>
        )}
        <time>{formatDate(post.publishedAt)}</time>
        <span>约 {readingMinutes(post.content)} 分钟</span>
      </div>
      <h2 className="mt-2 text-xl font-semibold leading-snug">
        <Link href={`/posts/${post.slug}`} className="transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
          {post.title}
        </Link>
      </h2>
      {post.summary && (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {post.summary}
        </p>
      )}
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Link
              key={t.id}
              href={`/tags/${t.slug}`}
              className="text-xs text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              #{t.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
