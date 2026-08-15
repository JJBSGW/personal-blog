// 友链/评论/简历/站点内容 领域服务(纯业务逻辑)
import { prisma } from "@/lib/db";

export interface LinkInput {
  name: string;
  url: string;
  description: string;
  sort: number;
}

export async function createLink(input: LinkInput) {
  if (!input.name || !input.url) throw new Error("名称和链接不能为空");
  if (!/^https?:\/\//.test(input.url)) {
    throw new Error("链接需以 http:// 或 https:// 开头");
  }
  return prisma.friendLink.create({
    data: {
      name: input.name,
      url: input.url,
      description: input.description,
      sort: input.sort,
    },
  });
}

export async function deleteLink(id: string) {
  await prisma.friendLink.delete({ where: { id } });
}

export async function deleteComment(id: string) {
  await prisma.comment.delete({ where: { id } });
}

export async function saveResumeData(rawJson: string) {
  let data: unknown;
  try {
    data = JSON.parse(rawJson);
  } catch {
    throw new Error("JSON 格式错误,无法解析");
  }
  if (typeof data !== "object" || data === null || !("name" in data)) {
    throw new Error("JSON 必须是包含 name 字段的对象");
  }
  await prisma.resume.upsert({
    where: { id: 1 },
    update: { data },
    create: { id: 1, data },
  });
}

export async function saveAboutContent(content: string) {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { aboutContent: content },
    create: { id: 1, aboutContent: content },
  });
}

export interface SiteSettingsInput {
  siteName: string | null;
  description: string | null;
  author: string | null;
  github: string | null;
  email: string | null;
  footerText: string | null;
}

export async function saveSiteSettings(data: SiteSettingsInput) {
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, aboutContent: "", ...data },
  });
}
