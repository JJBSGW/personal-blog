"use client";

import { useEffect, useState } from "react";

/** 文章页:顶部阅读进度条 + 回到顶部按钮 */
export function ReadingWidget() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min(100, (doc.scrollTop / total) * 100) : 0);
      setShowTop(doc.scrollTop > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* 顶部进度条 */}
      <div className="no-print fixed inset-x-0 top-0 z-30 h-0.5 bg-transparent">
        <div
          className="h-full bg-indigo-500 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* 回到顶部 */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="回到顶部"
          className="no-print fixed bottom-6 right-6 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-background text-lg shadow-md transition-colors hover:border-zinc-500 dark:border-zinc-700"
        >
          ↑
        </button>
      )}
    </>
  );
}
