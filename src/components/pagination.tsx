import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const link = (p: number) => `${basePath}?page=${p}`;
  return (
    <nav className="flex items-center justify-between border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
      {page > 1 ? (
        <Link href={link(page - 1)} className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100">
          ← 上一页
        </Link>
      ) : (
        <span />
      )}
      <span className="text-zinc-500 dark:text-zinc-400">
        第 {page} / {totalPages} 页
      </span>
      {page < totalPages ? (
        <Link href={link(page + 1)} className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100">
          下一页 →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
