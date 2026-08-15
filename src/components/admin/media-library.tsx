"use client";

import { useState } from "react";

export function MediaLibrary({ files }: { files: string[] }) {
  const [items, setItems] = useState<string[]>(files);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "上传失败");
        return;
      }
      setItems((prev) => [data.url as string, ...prev]);
    } catch {
      setError("网络错误,上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setError("复制失败,请手动复制");
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300">
          {uploading ? "上传中…" : "⬆️ 上传图片"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={onUpload}
            disabled={uploading}
          />
        </label>
        <p className="text-xs text-zinc-500">
          支持 jpg / png / webp / gif,单张 ≤ 5MB
        </p>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {items.length === 0 ? (
        <p className="text-zinc-500">还没有上传过图片。</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((url) => (
            <li
              key={url}
              className="glass overflow-hidden rounded-xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-32 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-2">
                <code className="truncate text-xs text-zinc-500">{url}</code>
                <button
                  onClick={() => copy(url)}
                  className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  {copied === url ? "已复制 ✓" : "复制"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
