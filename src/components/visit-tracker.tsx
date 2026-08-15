"use client";

import { useEffect, useRef } from "react";

/** 全站访问埋点:进入页面时上报一次(服务端 60 秒去重),跳过 /admin 与 /api */
export function VisitTracker() {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    const path = window.location.pathname;
    if (path.startsWith("/admin") || path.startsWith("/api")) return;
    fired.current = true;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    }).catch(() => {});
  }, []);
  return null;
}
