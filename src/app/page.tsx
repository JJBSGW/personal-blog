import { listPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const [site, { posts, totalPages, page: current }] = await Promise.all([
    getSiteConfig(),
    listPublishedPosts({ page }),
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
    </div>
  );
}
