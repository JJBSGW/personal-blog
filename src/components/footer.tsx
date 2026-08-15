import Link from "next/link";
import { getSiteConfig } from "@/lib/site-config";

export async function Footer() {
  const site = await getSiteConfig();
  return (
    <footer className="no-print border-t border-zinc-200 py-6 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-1 px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          © {site.since} {site.author} · {site.footerText}
        </p>
        <p className="flex items-center gap-2">
          <Link href="/feed.xml" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            RSS
          </Link>
          <span>·</span>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <span>·</span>
          <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            关于本站
          </Link>
        </p>
      </div>
    </footer>
  );
}
