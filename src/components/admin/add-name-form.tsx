"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";

export function AddNameForm({
  action,
  placeholder,
  buttonLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  placeholder: string;
  buttonLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="flex gap-2">
      <input
        name="name"
        required
        placeholder={placeholder}
        className="h-9 flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
      />
      <button
        type="submit"
        disabled={pending}
        className="h-9 shrink-0 rounded-lg bg-zinc-900 px-4 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "添加中…" : buttonLabel}
      </button>
      {state.error && (
        <p className="text-sm text-red-500">{state.error}</p>
      )}
    </form>
  );
}
