"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CommentForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    // 蜜罐字段:机器人会填,人类看不见
    const website = (
      document.getElementById("c-website") as HTMLInputElement | null
    )?.value ?? "";
    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, content, website }),
      });
      if (res.ok) {
        setAuthor("");
        setContent("");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "提交失败,请重试");
      }
    } catch {
      setError("网络错误,请重试");
    }
    setPending(false);
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <input
        type="text"
        id="c-website"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div>
        <label className="mb-1 block text-sm" htmlFor="c-author">
          昵称
        </label>
        <input
          id="c-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="你的昵称 *"
          required
          maxLength={50}
          className="h-9 w-56 rounded-lg border border-zinc-300 bg-transparent px-3 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm" htmlFor="c-content">
          内容
        </label>
        <textarea
          id="c-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="友善交流,说说你的想法… *"
          required
          maxLength={2000}
          rows={3}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-zinc-900 px-5 py-2 text-sm text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "提交中…" : "发表评论"}
      </button>
    </form>
  );
}
