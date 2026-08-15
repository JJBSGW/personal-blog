// 标签与分类领域服务(纯业务逻辑)
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";

export async function createTag(name: string) {
  if (!name) throw new Error("标签名不能为空");
  const slug = slugify(name);
  try {
    return await prisma.tag.create({ data: { name, slug } });
  } catch {
    throw new Error("标签已存在或 slug 冲突");
  }
}

export async function deleteTag(id: string) {
  try {
    await prisma.tag.delete({ where: { id } });
  } catch {
    throw new Error("该标签下还有文章,请先移除文章中的标签");
  }
}

export async function createCategory(name: string) {
  if (!name) throw new Error("分类名不能为空");
  const slug = slugify(name);
  try {
    return await prisma.category.create({ data: { name, slug } });
  } catch {
    throw new Error("分类已存在或 slug 冲突");
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error("该分类下还有文章,请先移除文章中的分类");
  }
}
