// 服务端站点配置读取:数据库值优先,缺失时回退到静态默认值。
// 注意:此文件仅供服务端组件/路由使用(依赖 prisma),客户端组件请用 @/lib/site 的静态 siteConfig。
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site";

export interface SiteSettings {
  name: string;
  description: string;
  author: string;
  github: string;
  email: string;
  footerText: string;
  url: string;
  since: number;
}

export async function getSiteConfig(): Promise<SiteSettings> {
  let db = null;
  try {
    db = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  } catch {
    db = null;
  }
  return {
    name: db?.siteName?.trim() || siteConfig.name,
    description: db?.description?.trim() || siteConfig.description,
    author: db?.author?.trim() || siteConfig.author,
    github: db?.github?.trim() || siteConfig.github,
    email: db?.email?.trim() || siteConfig.email,
    footerText: db?.footerText?.trim() || "用 ☕ 和 ❤️ 构建",
    url: siteConfig.url,
    since: siteConfig.since,
  };
}
