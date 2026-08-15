import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { defaultAboutContent } from "@/lib/site";
import { getSiteConfig } from "@/lib/site-config";
import { Markdown } from "@/components/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "关于" };

export default async function AboutPage() {
  const [cfg, site] = await Promise.all([
    prisma.siteConfig.findUnique({ where: { id: 1 } }),
    getSiteConfig(),
  ]);
  const content = cfg?.aboutContent?.trim()
    ? cfg.aboutContent
    : defaultAboutContent;

  return (
    <div className="space-y-4">
      <Markdown content={content} />
      <p className="pt-2 text-xs text-zinc-400">
        © {site.since} {site.author} · 关于页可在后台编辑
      </p>
      <p>
        <Link href="/resume">→ 查看我的简历</Link>
      </p>
    </div>
  );
}
