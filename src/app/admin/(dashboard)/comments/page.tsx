import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteComment } from "@/app/admin/actions";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
    take: 100,
  });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">评论管理</h1>
      <p className="text-sm text-zinc-500">
        共 {comments.length} 条(最多显示最近 100 条)。删除不可恢复。
      </p>
      {comments.length === 0 ? (
        <p className="text-zinc-500">暂无评论。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {comments.map((c) => (
            <li key={c.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium">{c.author}</span>
                    <span className="text-xs text-zinc-400">
                      {dateFmt.format(c.createdAt)}
                    </span>
                    {c.ip && (
                      <span className="text-xs text-zinc-400">{c.ip}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {c.content}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    评论于:{" "}
                    <Link
                      href={`/posts/${c.post.slug}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {c.post.title}
                    </Link>
                  </p>
                </div>
                <ConfirmDeleteButton action={deleteComment.bind(null, c.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
