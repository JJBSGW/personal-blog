"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      onClick={onLogout}
      className="text-sm text-zinc-500 transition-colors hover:text-red-500 dark:text-zinc-400"
    >
      退出登录
    </button>
  );
}
