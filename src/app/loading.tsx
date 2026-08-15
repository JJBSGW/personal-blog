export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24" role="status" aria-label="加载中">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-500 dark:border-zinc-700 dark:border-t-indigo-400" />
    </div>
  );
}
