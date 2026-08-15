import type { Metadata } from "next";
import Link from "next/link";
import { listCategoriesWithCount } from "@/lib/posts";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "分类" };

export default async function CategoriesPage() {
  const categories = await listCategoriesWithCount();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">分类</h1>
      {categories.length === 0 ? (
        <p className="text-zinc-500">还没有分类。</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="rounded-xl border border-zinc-200 p-4 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <p className="font-medium">{c.name}</p>
              <p className="mt-1 text-sm text-zinc-500">{c._count.posts} 篇文章</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
