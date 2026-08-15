import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export default async function AdminDashboard() {
  const [totalPosts, published, drafts, viewAgg, tagCount, categoryCount, recent, viewLogs] =
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
      // 近 30 天阅读记录(用于趋势图)
      prisma.viewLog.findMany({
        where: { date: { gte: daysAgo(29) } },
        select: { date: true },
      }),
    ]);

  // 按本地日期聚合
  const buckets = new Map<string, number>();
  for (const l of viewLogs) {
    const d = l.date;
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  const today = new Date();
  const series = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29 + i);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    return {
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      count: buckets.get(key) ?? 0,
      isToday: i === 29,
    };
  });
  const maxCount = Math.max(1, ...series.map((s) => s.count));

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
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">近 30 天阅读趋势</h2>
          <p className="text-xs text-zinc-500">
            按独立阅读事件计(同 IP 10 分钟内去重)
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex h-32 items-end gap-[2px]">
            {series.map((s, i) => (
              <div
                key={i}
                title={`${s.label}: ${s.count} 次`}
                className={`flex-1 rounded-t-sm ${
                  s.isToday
                    ? "bg-indigo-500"
                    : "bg-indigo-300 dark:bg-indigo-800"
                }`}
                style={{ height: `${Math.max(2, (s.count / maxCount) * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
            <span>{series[0]?.label}</span>
            <span>今天 {series[29]?.count} 次</span>
          </div>
        </div>
      </section>

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
