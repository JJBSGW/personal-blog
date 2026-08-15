"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/site-config";

function Field({
  name,
  label,
  defaultValue,
  placeholder,
  textarea = false,
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm" htmlFor={`s-${name}`}>
        {label}
      </label>
      {textarea ? (
        <textarea
          id={`s-${name}`}
          name={name}
          defaultValue={defaultValue}
          rows={2}
          placeholder={placeholder}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      ) : (
        <input
          id={`s-${name}`}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      )}
    </div>
  );
}

export function SettingsForm({ site }: { site: SiteSettings }) {
  const [state, formAction, pending] = useActionState(saveSettings, {});

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="siteName" label="站点名称" defaultValue={site.name} />
        <Field name="author" label="作者昵称" defaultValue={site.author} />
      </div>
      <Field
        name="description"
        label="站点简介"
        defaultValue={site.description}
        textarea
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="github" label="GitHub 地址" defaultValue={site.github} />
        <Field name="email" label="联系邮箱" defaultValue={site.email} />
      </div>
      <Field
        name="footerText"
        label="页脚文字"
        defaultValue={site.footerText}
        placeholder="用 ☕ 和 ❤️ 构建"
      />
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.ok && (
        <p className="text-sm text-green-600 dark:text-green-400">已保存 ✅</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "保存中…" : "保存设置"}
      </button>
      <p className="text-xs text-zinc-400">
        留空的字段将使用默认值。站点域名(url)不在此修改,见 deploy 配置。
      </p>
    </form>
  );
}
