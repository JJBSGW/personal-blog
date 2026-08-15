import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTagBySlug, listPublishedPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Pagination } from "@/components/pagination";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/tags/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  return { title: tag ? `标签 #${tag.name}` : "标签不存在" };
}

export default async function TagPage({ params, searchParams }: PageProps<"/tags/[slug]">) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const { page: rawPage } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);
  const { posts, totalPages, page: current } = await listPublishedPosts({ page, tagSlug: slug });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">标签 #{tag.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">共 {posts.length} 篇文章(当前页)。</p>
      <section className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </section>
      <Pagination page={current} totalPages={totalPages} basePath={`/tags/${slug}`} />
    </div>
  );
}
