import { extractHeadings } from "@/lib/markdown";

export function Toc({ content }: { content: string }) {
  const headings = extractHeadings(content).filter((h) => h.level >= 2);
  if (headings.length === 0) return null;
  return (
    <nav className="glass rounded-xl p-4">
      <p className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
        本页目录
      </p>
      <ul className="space-y-1 text-sm">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 0.9}rem` }}>
            <a
              href={`#${h.id}`}
              className="text-zinc-600 transition-colors hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
