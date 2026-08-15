// 通用格式化工具(纯函数,无 UI 依赖)

/** 估算阅读时长:中文按 300 字/分钟,英文按 200 词/分钟 */
export function readingMinutes(content: string): number {
  const cjk = (content.match(/[\u4e00-\u9fa5]/g) ?? []).length;
  const words = content
    .replace(/[\u4e00-\u9fa5]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 300 + words / 200));
}

const dateFmt = new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" });

export function formatDate(d: Date | null | undefined): string {
  return d ? dateFmt.format(d) : "未发布";
}
