import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "友链" };

export default async function LinksPage() {
  const [links, site] = await Promise.all([
    prisma.friendLink.findMany({
      orderBy: [{ sort: "asc" }, { createdAt: "asc" }],
    }),
    getSiteConfig(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">友链</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        一些值得逛的站点。想交换友链?发邮件到 {site.email}。
      </p>

      {links.length === 0 ? (
        <div className="glass rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500 dark:border-zinc-700">
          <p className="text-4xl">🕸️</p>
          <p className="mt-3">还没有友链。站长去串门了,晚点把链接挂上来。</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass group rounded-xl p-4 transition-colors"
            >
              <p className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {l.name}
                <span className="ml-2 text-xs font-normal text-zinc-400">
                  ↗
                </span>
              </p>
              {l.description && (
                <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {l.description}
                </p>
              )}
              <p className="mt-2 truncate text-xs text-zinc-400">
                {l.url.replace(/^https?:\/\//, "")}
              </p>
            </a>
          ))}
        </div>
      )}

      <p className="text-sm text-zinc-500">
        <Link href="/" className="hover:underline">
          ← 回首页
        </Link>
      </p>
    </div>
  );
}
