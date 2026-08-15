import { prisma } from "@/lib/db";
import {
  createCategory,
  createTag,
  deleteCategory,
  deleteTag,
} from "@/app/admin/actions";
import { AddNameForm } from "@/components/admin/add-name-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const [tags, categories] = await Promise.all([
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">标签与分类</h1>
        <AddNameForm
          action={createTag}
          placeholder="新标签名,如:React"
          buttonLabel="+ 添加标签"
        />
        {tags.length === 0 ? (
          <p className="text-sm text-zinc-500">暂无标签。</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              >
                <span>
                  #{t.name}
                  <span className="ml-1 text-xs text-zinc-500">
                    {t._count.posts}
                  </span>
                </span>
                <ConfirmDeleteButton
                  action={deleteTag.bind(null, t.id)}
                  label="删"
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">分类</h2>
        <AddNameForm
          action={createCategory}
          placeholder="新分类名,如:生活"
          buttonLabel="+ 添加分类"
        />
        {categories.length === 0 ? (
          <p className="text-sm text-zinc-500">暂无分类。</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
              >
                <span>
                  {c.name}
                  <span className="ml-1 text-xs text-zinc-500">
                    {c._count.posts}
                  </span>
                </span>
                <ConfirmDeleteButton
                  action={deleteCategory.bind(null, c.id)}
                  label="删"
                />
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-zinc-500">
          提示:还有文章的标签/分类无法删除,需先移除文章中的引用。
        </p>
      </section>
    </div>
  );
}
