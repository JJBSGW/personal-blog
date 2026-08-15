import type { Metadata } from "next";
import Link from "next/link";
import { searchPosts } from "@/lib/search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "搜索" };

function highlight(text: string): React.ReactNode {
  // Meilisearch 的 _formatted 字段:除 <mark> 高亮外其余均已转义,可安全渲染
  return (
    <span
      dangerouslySetInnerHTML={{ __html: text }}
      className="search-hit"
    />
  );
}

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  let hits: Awaited<ReturnType<typeof searchPosts>>["hits"] = [];
  let total = 0;
  let searchError: string | null = null;

  if (query) {
    try {
      const result = await searchPosts(query);
      hits = result.hits;
      total = result.total;
    } catch {
      searchError = "搜索服务暂不可用,请稍后再试。";
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">搜索</h1>
      <form action="/search" className="flex gap-2">
        <input
          name="q"
          defaultValue={query}
          placeholder="输入关键词,支持中文分词…"
          className="h-10 flex-1 rounded-full border border-zinc-300 bg-transparent px-4 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="h-10 rounded-full bg-zinc-900 px-5 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          搜索
        </button>
      </form>

      {searchError && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          {searchError}
        </p>
      )}

      {query && !searchError && (
        <>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            共找到约 {total} 条与「{query}」相关的结果
          </p>
          {hits.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
              <p className="text-4xl">🕵️</p>
              <p className="mt-3">没有找到相关内容,换个关键词试试?</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {hits.map((h) => (
                <li key={h.id}>
                  <Link
                    href={`/posts/${h.slug}`}
                    className="block rounded-xl border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
                  >
                    <h2 className="text-lg font-semibold">{highlight(h.title)}</h2>
                    {h.summary && (
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {highlight(h.summary)}
                      </p>
                    )}
                    <p className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                      {h.category && <span>{h.category}</span>}
                      {h.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                      <span>
                        {new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(
                          new Date(h.publishedAt)
                        )}
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      {!query && (
        <p className="text-zinc-500">输入关键词开始搜索(支持中文分词)。</p>
      )}
    </div>
  );
}
