import type { Metadata } from "next";
import Link from "next/link";
import { listPostsForArchive } from "@/lib/posts";
import { formatDate } from "@/components/post-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "归档" };

interface Group {
  key: string;
  label: string;
  posts: { slug: string; title: string; publishedAt: Date | null }[];
}

export default async function ArchivePage() {
  const posts = await listPostsForArchive();

  // 按「年-月」分组(保持时间倒序)
  const groups: Group[] = [];
  const map = new Map<string, Group>();
  for (const p of posts) {
    const d = p.publishedAt ?? new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月`;
    let g = map.get(key);
    if (!g) {
      g = { key, label, posts: [] };
      map.set(key, g);
      groups.push(g);
    }
    g.posts.push(p);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">归档</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        共 {posts.length} 篇文章,按时间归档。
      </p>

      {groups.length === 0 ? (
        <div className="glass rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          <p className="text-4xl">📦</p>
          <p className="mt-3">还没有文章。</p>
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
              {g.label}
              <span className="ml-2 text-sm font-normal text-zinc-400">
                {g.posts.length} 篇
              </span>
            </h2>
            <ul className="glass divide-y divide-zinc-200/70 rounded-xl dark:divide-zinc-800/70">
              {g.posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/posts/${p.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40"
                  >
                    <span className="min-w-0 truncate font-medium">
                      {p.title}
                    </span>
                    <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(p.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
