"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-full border border-zinc-300 px-4 py-1.5 text-sm transition-colors hover:border-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      🖨️ 打印 / 导出 PDF
    </button>
  );
}
