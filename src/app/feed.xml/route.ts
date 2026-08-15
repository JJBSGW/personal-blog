import { listPublishedPosts } from "@/lib/posts";
import { getSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [site, { posts }] = await Promise.all([
    getSiteConfig(),
    listPublishedPosts({ page: 1, pageSize: 20 }),
  ]);
  const items = posts
    .map((p) => {
      const link = `${site.url}/posts/${p.slug}`;
      return [
        "<item>",
        `  <title>${escapeXml(p.title)}</title>`,
        `  <link>${escapeXml(link)}</link>`,
        `  <guid>${escapeXml(link)}</guid>`,
        `  <pubDate>${p.publishedAt?.toUTCString() ?? ""}</pubDate>`,
        `  <description>${escapeXml(p.summary ?? "")}</description>`,
        "</item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0">`,
    `  <channel>`,
    `    <title>${escapeXml(site.name)}</title>`,
    `    <link>${escapeXml(site.url)}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    items,
    `  </channel>`,
    `</rss>`,
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
