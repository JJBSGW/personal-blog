import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { LogoutButton } from "@/components/admin/logout-button";

const links = [
  { href: "/admin", label: "📊 仪表盘" },
  { href: "/admin/posts", label: "📝 文章管理" },
  { href: "/admin/posts/new", label: "✏️ 新建文章" },
  { href: "/admin/tags", label: "🏷️ 标签与分类" },
  { href: "/admin/comments", label: "💬 评论管理" },
  { href: "/admin/links", label: "🔗 友链管理" },
  { href: "/admin/media", label: "🖼️ 媒体库" },
  { href: "/admin/resume", label: "👤 个人简历" },
  { href: "/admin/about", label: "ℹ️ 关于页" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="shrink-0 md:w-48">
        <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
          <p className="text-sm font-semibold">{user.name ?? user.email}</p>
          <p className="mt-0.5 break-all text-xs text-zinc-500 dark:text-zinc-400">
            {user.email}
          </p>
          <nav className="mt-4 flex flex-col gap-1.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-1.5 border-t border-zinc-200 pt-3 dark:border-zinc-800">
            <Link
              href="/"
              className="rounded-lg px-2 py-1.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              🌐 查看前台
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
