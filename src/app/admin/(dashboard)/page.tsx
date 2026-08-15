import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminDashboard() {
  const [totalPosts, published, drafts, viewAgg, tagCount, categoryCount, recent] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.tag.count(),
      prisma.category.count(),
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        take: 6,
        select: {
          id: true,
          title: true,
          status: true,
          updatedAt: true,
          viewCount: true,
        },
      }),
    ]);

  const stats = [
    { label: "全部文章", value: totalPosts },
    { label: "已发布", value: published },
    { label: "草稿", value: drafts },
    { label: "总浏览量", value: viewAgg._sum.viewCount ?? 0 },
    { label: "标签数", value: tagCount },
    { label: "分类数", value: categoryCount },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          ✏️ 写新文章
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">最近更新</h2>
        {recent.length === 0 ? (
          <p className="text-zinc-500">还没有文章,点击右上角开始写第一篇吧。</p>
        ) : (
          <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {recent.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <span className="min-w-0 truncate font-medium">{p.title}</span>
                  <span className="flex shrink-0 items-center gap-3 text-xs text-zinc-500">
                    <span
                      className={
                        p.status === "PUBLISHED"
                          ? "text-green-600 dark:text-green-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {p.status === "PUBLISHED" ? "已发布" : "草稿"}
                    </span>
                    <span>{p.viewCount} 阅</span>
                    <span>{dateFmt.format(p.updatedAt)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
