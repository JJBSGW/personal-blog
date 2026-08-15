import type { Metadata } from "next";
import Link from "next/link";
import { listTagsWithCount } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "标签" };

export default async function TagsPage() {
  const tags = await listTagsWithCount();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">标签</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        共 {tags.length} 个标签,按文章数排序。
      </p>
      {tags.length === 0 ? (
        <p className="text-zinc-500">还没有标签,先写几篇文章吧。</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <Link
              key={t.id}
              href={`/tags/${t.slug}`}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition-colors hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              #{t.name}
              <span className="ml-1.5 text-xs text-zinc-500">
                {t._count.posts}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
