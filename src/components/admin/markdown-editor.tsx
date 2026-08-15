"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { rehypeHeadingIds } from "@/lib/markdown";

export function MarkdownEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const cjk = (value.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = value
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.round(cjk / 300 + words / 200));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-500">
          <span>Markdown 源码</span>
          <span>
            {value.length} 字符 · 约 {minutes} 分钟阅读
          </span>
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={20}
          spellCheck={false}
          className="h-[28rem] w-full resize-y rounded-lg border border-zinc-300 bg-transparent p-3 font-mono text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
          placeholder={"# 标题\n\n正文内容…(支持 Markdown:加粗、代码、表格、引用等)"}
        />
      </div>
      <div>
        <p className="mb-1 text-xs text-zinc-500">实时预览</p>
        <div className="h-[28rem] overflow-auto rounded-lg border border-zinc-300 p-4 dark:border-zinc-700">
          {value.trim() ? (
            <div className="prose prose-zinc max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  [rehypeHeadingIds, {}],
                  [rehypeHighlight, {}],
                ]}
              >
                {value}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">预览将显示在这里…</p>
          )}
        </div>
      </div>
    </div>
  );
}
