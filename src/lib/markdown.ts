// Markdown 工具:slug 生成、目录提取、标题锚点 rehype 插件
// 注意:extractHeadings 与 rehypeHeadingIds 必须使用同一套 slugify 逻辑,
// 保证目录链接与正文锚点 id 一一对应。
import { visit } from "unist-util-visit";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\-_ ]/gu, "")
    .replace(/\s+/g, "-");
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** 从 Markdown 原文提取 h1-h3 目录(与渲染端锚点 id 一致) */
export function extractHeadings(markdown: string): TocItem[] {
  const counter = new Map<string, number>();
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const m = /^(#{1,3})\s+(.+)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].replace(/[`*_\[\]()]/g, "").trim();
    if (!text) continue;
    const base = slugify(text);
    const n = counter.get(base) ?? 0;
    counter.set(base, n + 1);
    items.push({ id: n > 0 ? `${base}-${n}` : base, text, level });
  }
  return items;
}

/** rehype 插件:给 h1-h3 补 id(与 extractHeadings 的 slugify 完全一致) */
export function rehypeHeadingIds() {
  return (tree: unknown) => {
    const counter = new Map<string, number>();
    visit(
      tree as never,
      "element",
      (node: {
        tagName: string;
        properties?: Record<string, unknown>;
        children?: { type: string; value?: string }[];
      }) => {
        if (!/^h[1-3]$/.test(node.tagName) || node.properties?.id) return;
        const text = (node.children ?? [])
          .filter((c) => c.type === "text")
          .map((c) => c.value ?? "")
          .join("");
        if (!text.trim()) return;
        const base = slugify(text);
        const n = counter.get(base) ?? 0;
        counter.set(base, n + 1);
        node.properties = { ...node.properties, id: n > 0 ? `${base}-${n}` : base };
      }
    );
  };
}

/** rehype 插件:给代码块补 data-language(供 CSS 显示语言标签) */
export function rehypeCodeLang() {
  return (tree: unknown) => {
    visit(
      tree as never,
      "element",
      (node: {
        tagName: string;
        properties?: Record<string, unknown>;
        children?: { tagName?: string; properties?: Record<string, unknown> }[];
      }) => {
        if (node.tagName !== "pre") return;
        const code = (node.children ?? []).find((c) => c.tagName === "code");
        const cls = code?.properties?.className;
        const joined = Array.isArray(cls) ? cls.join(" ") : String(cls ?? "");
        const m = /language-([\w+-]+)/.exec(joined);
        if (m) {
          node.properties = { ...node.properties, "data-language": m[1] };
        }
      }
    );
  };
}

/** rehype 插件:给正文 <img> 加懒加载与异步解码 */
export function rehypeLazyImages() {
  return (tree: unknown) => {
    visit(
      tree as never,
      "element",
      (node: {
        tagName: string;
        properties?: Record<string, unknown>;
      }) => {
        if (node.tagName === "img") {
          node.properties = {
            ...node.properties,
            loading: "lazy",
            decoding: "async",
          };
        }
      }
    );
  };
}
