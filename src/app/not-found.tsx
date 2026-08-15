import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-7xl">🦉</p>
      <h1 className="text-3xl font-bold">404 · 页面被猫叼走了</h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        你要找的内容不存在,或者站长还没来得及写。
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        回首页看看
      </Link>
    </div>
  );
}
