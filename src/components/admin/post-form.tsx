"use client";

import { useState } from "react";
import { useActionState } from "react";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import type { FormState } from "@/app/admin/actions";

interface CategoryOption {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
  slug: string;
}

export function PostForm({
  action,
  categories,
  tags,
  initial,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  categories: CategoryOption[];
  tags: TagOption[];
  initial?: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    status?: string;
    categoryId?: string | null;
    tagSlugs?: string[];
  };
  submitLabel: string;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm" htmlFor="post-title">
            标题 *
          </label>
          <input
            id="post-title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(initial?.slug ?? "");
            }}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
            placeholder="文章标题"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm" htmlFor="post-slug">
            Slug(URL 标识,留空自动生成)
          </label>
          <input
            id="post-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 font-mono text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
            placeholder="my-first-post"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm" htmlFor="post-summary">
          摘要(列表页显示)
        </label>
        <textarea
          id="post-summary"
          name="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={2}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
          placeholder="一两句话介绍这篇文章…"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm">正文(Markdown)</label>
        <input type="hidden" name="content" value={content} />
        <MarkdownEditor value={content} onChange={setContent} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm" htmlFor="post-status">
            状态
          </label>
          <select
            id="post-status"
            name="status"
            defaultValue={initial?.status ?? "DRAFT"}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
          >
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">发布</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm" htmlFor="post-category">
            分类
          </label>
          <select
            id="post-category"
            name="categoryId"
            defaultValue={initial?.categoryId ?? ""}
            className="h-10 w-full rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
          >
            <option value="">(无分类)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm">标签(可多选)</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-300 px-3 py-1 text-sm transition-colors has-checked:border-indigo-500 has-checked:bg-indigo-50 dark:border-zinc-700 dark:has-checked:bg-indigo-950/40"
            >
              <input
                type="checkbox"
                name="tags"
                value={t.slug}
                defaultChecked={initial?.tagSlugs?.includes(t.slug)}
                className="accent-indigo-500"
              />
              {t.name}
            </label>
          ))}
          {tags.length === 0 && (
            <p className="text-sm text-zinc-400">
              还没有标签,先去「标签与分类」里创建。
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-lg bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "保存中…" : submitLabel}
      </button>
    </form>
  );
}
