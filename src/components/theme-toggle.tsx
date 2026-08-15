"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "切换到亮色" : "切换到暗色"}
      aria-label="切换主题"
      className="flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
