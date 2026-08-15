import { listPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { posts, totalPages, page: current } = await listPublishedPosts({ page });

  return (
    <div className="space-y-8">
      <section className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight">{siteConfig.name}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {siteConfig.description}
        </p>
      </section>

      <section className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
            <p className="text-4xl">🦉</p>
            <p className="mt-3">还没有文章。站长正在深夜赶稿…</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>

      <Pagination page={current} totalPages={totalPages} basePath="/" />
    </div>
  );
}
