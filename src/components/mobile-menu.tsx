"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileMenu({
  nav,
}: {
  nav: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        {open ? "✕" : "☰"}
      </button>
      {open && (
        <div className="absolute inset-x-0 top-14 border-b border-zinc-200 bg-background/95 backdrop-blur dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                {n.label}
              </Link>
            ))}
            <form action="/search" className="mt-2">
              <input
                name="q"
                type="search"
                placeholder="搜索…"
                className="h-9 w-full rounded-full border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
              />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
