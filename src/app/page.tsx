import { listPublishedPosts, getHotPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getSiteConfig } from "@/lib/site-config";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const [site, { posts, totalPages, page: current }, hot] = await Promise.all([
    getSiteConfig(),
    listPublishedPosts({ page }),
    getHotPosts(5),
  ]);

  return (
    <div className="space-y-8">
      <section className="animate-fade-up border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
          {site.name}
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {site.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {["💻 技术笔记", "🔧 折腾记录", "📚 读书随笔"].map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-zinc-300 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="glass rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
            <p className="text-4xl">🦉</p>
            <p className="mt-3">还没有文章。站长正在深夜赶稿…</p>
          </div>
        ) : (
          posts.map((post, i) => (
            <div
              key={post.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 6) * 70}ms` }}
            >
              <PostCard post={post} />
            </div>
          ))
        )}
      </section>

      <Pagination page={current} totalPages={totalPages} basePath="/" />

      {/* 热门文章 */}
      {hot.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold">🔥 热门文章</h2>
          <ol className="glass divide-y divide-zinc-200/70 rounded-xl dark:divide-zinc-800/70">
            {hot.map((h, i) => (
              <li key={h.slug}>
                <Link
                  href={`/posts/${h.slug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="w-5 shrink-0 text-center text-sm font-semibold text-zinc-400">
                      {i + 1}
                    </span>
                    <span className="truncate font-medium">{h.title}</span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                    {h.viewCount} 阅
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
