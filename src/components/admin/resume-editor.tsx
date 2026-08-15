"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { saveResume } from "@/app/admin/actions";

export function ResumeEditor({ initialJson }: { initialJson: string }) {
  const [json, setJson] = useState(initialJson);
  const [state, formAction, pending] = useActionState(saveResume, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          直接编辑 JSON 数据,保存后前台简历页即时更新。
        </p>
        <Link
          href="/resume"
          target="_blank"
          className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          查看前台简历 ↗
        </Link>
      </div>
      <form action={formAction} className="space-y-4">
        <textarea
          name="json"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={30}
          spellCheck={false}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent p-3 font-mono text-xs outline-none focus:border-zinc-500 dark:border-zinc-700"
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
          {pending ? "保存中…" : "保存简历"}
        </button>
      </form>
    </div>
  );
}
