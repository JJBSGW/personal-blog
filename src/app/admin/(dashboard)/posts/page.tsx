import Link from "next/link";
import { prisma } from "@/lib/db";
import { deletePost } from "@/app/admin/actions";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" });

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true, _count: { select: { tags: true } } },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          ✏️ 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500">还没有文章。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="truncate font-medium hover:text-indigo-600 dark:hover:text-indigo-400"
                >
                  {p.title}
                </Link>
                <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                  <span
                    className={
                      p.status === "PUBLISHED"
                        ? "text-green-600 dark:text-green-400"
                        : "text-amber-600 dark:text-amber-400"
                    }
                  >
                    {p.status === "PUBLISHED" ? "已发布" : "草稿"}
                  </span>
                  <span>{p.category?.name ?? "未分类"}</span>
                  <span>{p._count.tags} 标签</span>
                  <span>{p.viewCount} 阅</span>
                  <span>{dateFmt.format(p.updatedAt)}</span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  编辑
                </Link>
                <ConfirmDeleteButton action={deletePost.bind(null, p.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
