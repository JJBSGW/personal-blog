import { prisma } from "@/lib/db";
import { deleteLink } from "@/app/admin/actions";
import { LinkForm } from "@/components/admin/link-form";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export const dynamic = "force-dynamic";

export default async function AdminLinksPage() {
  const links = await prisma.friendLink.findMany({
    orderBy: [{ sort: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">友链管理</h1>

      <LinkForm />

      {links.length === 0 ? (
        <p className="text-zinc-500">暂无友链。</p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
          {links.map((l) => (
            <li key={l.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium">
                  {l.name}
                  <span className="ml-2 text-xs font-normal text-zinc-400">
                    {l.url}
                  </span>
                </p>
                {l.description && (
                  <p className="mt-0.5 truncate text-sm text-zinc-500">
                    {l.description}
                  </p>
                )}
              </div>
              <ConfirmDeleteButton action={deleteLink.bind(null, l.id)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
