import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";

const nav = [
  { href: "/", label: "首页" },
  { href: "/archive", label: "归档" },
  { href: "/tags", label: "标签" },
  { href: "/links", label: "友链" },
  { href: "/about", label: "关于" },
  { href: "/resume", label: "简历" },
];

export function Header() {
  return (
    <header className="no-print sticky top-0 z-10 border-b border-zinc-200 bg-background/80 backdrop-blur dark:border-zinc-800">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-5 px-4">
        <Link
          href="/"
          className="shrink-0 text-lg font-bold tracking-tight"
          title={siteConfig.description}
        >
          {siteConfig.name}
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="transition-colors hover:text-zinc-950 dark:hover:text-zinc-100">
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/search" className="ml-auto hidden sm:block">
          <input
            name="q"
            type="search"
            placeholder="搜索…"
            className="h-8 w-36 rounded-full border border-zinc-300 bg-transparent px-3 text-sm outline-none transition-all focus:w-48 focus:border-zinc-500 dark:border-zinc-700"
          />
        </form>
        <ThemeToggle />
      </div>
    </header>
  );
}
