"use client";

import { useActionState } from "react";
import { createLink } from "@/app/admin/actions";

export function LinkForm() {
  const [state, formAction, pending] = useActionState(createLink, {});
  return (
    <form
      action={formAction}
      className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          required
          placeholder="站点名称 *"
          className="h-9 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <input
          name="url"
          required
          placeholder="链接(https://…)*"
          className="h-9 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      </div>
      <input
        name="description"
        placeholder="一句话介绍(可选)"
        className="h-9 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          name="sort"
          type="number"
          defaultValue={0}
          placeholder="排序(小的在前)"
          className="h-9 w-32 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-lg bg-zinc-900 px-5 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "添加中…" : "+ 添加友链"}
        </button>
      </div>
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
      {state.ok && (
        <p className="text-sm text-green-600 dark:text-green-400">已添加 ✅</p>
      )}
    </form>
  );
}
