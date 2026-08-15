import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "搜索" };

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">搜索</h1>
      <form action="/search" className="flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="输入关键词…"
          className="h-10 flex-1 rounded-full border border-zinc-300 bg-transparent px-4 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="h-10 rounded-full bg-zinc-900 px-5 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          搜索
        </button>
      </form>
      {query && (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          <p className="text-4xl">🔍</p>
          <p className="mt-3">
            你搜索了「{query}」,但中文全文搜索功能将在阶段 4 上线(Meilisearch)。
          </p>
        </div>
      )}
    </div>
  );
}
