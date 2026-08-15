"use client";

import { useEffect, useRef } from "react";

/** 文章阅读埋点:进入页面时上报一次(防抖由服务端 IP+时间窗口处理) */
export function ViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    fetch(`/api/posts/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);
  return null;
}
