"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <p className="text-5xl">💥</p>
      <h1 className="text-2xl font-bold">页面出错了</h1>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        {error.message || "发生了未知错误"}
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        重试
      </button>
    </div>
  );
}
