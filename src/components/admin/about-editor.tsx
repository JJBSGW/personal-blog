"use client";

import { useState } from "react";
import { useActionState } from "react";
import { saveAbout } from "@/app/admin/actions";

export function AboutEditor({ initialContent }: { initialContent: string }) {
  const [content, setContent] = useState(initialContent);
  const [state, formAction, pending] = useActionState(saveAbout, {});

  return (
    <form action={formAction} className="space-y-4">
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={24}
        spellCheck={false}
        className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent p-3 font-mono text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        placeholder="# 关于本站(支持 Markdown)"
      />
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          已保存 ✅
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "保存中…" : "保存关于页"}
      </button>
    </form>
  );
}
