"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";
import { requireAdmin } from "@/lib/auth";

export interface FormState {
  error?: string;
  ok?: boolean;
}

const PUBLISHED = "PUBLISHED" as const;
const DRAFT = "DRAFT" as const;

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base || "post";
  let n = 2;
  for (;;) {
    const existing = await prisma.post.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function parsePostForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const status = formData.get("status") === PUBLISHED ? PUBLISHED : DRAFT;
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const tagSlugs = formData.getAll("tags").map(String);
  return { title, content, summary, rawSlug, status, categoryId, tagSlugs };
}

// ---------- 文章 ----------

export async function createPost(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const { title, content, summary, rawSlug, status, categoryId, tagSlugs } =
    parsePostForm(formData);
  if (!title) return { error: "标题不能为空" };

  const validTags = await prisma.tag.findMany({
    where: { slug: { in: tagSlugs } },
    select: { slug: true },
  });

  const post = await prisma.post.create({
    data: {
      title,
      slug: await uniqueSlug(rawSlug || slugify(title)),
      summary,
      content,
      status,
      publishedAt: status === PUBLISHED ? new Date() : null,
      categoryId,
      tags: { connect: validTags.map((t) => ({ slug: t.slug })) },
    },
  });
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}/edit?created=1`);
}

export async function updatePost(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "文章不存在" };

  const { title, content, summary, rawSlug, status, categoryId, tagSlugs } =
    parsePostForm(formData);
  if (!title) return { error: "标题不能为空" };

  const validTags = await prisma.tag.findMany({
    where: { slug: { in: tagSlugs } },
    select: { slug: true },
  });

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug: await uniqueSlug(rawSlug || slugify(title), id),
      summary,
      content,
      status,
      publishedAt:
        status === PUBLISHED ? existing.publishedAt ?? new Date() : null,
      categoryId,
      tags: { set: validTags.map((t) => ({ slug: t.slug })) },
    },
  });
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}/edit?saved=1`);
}

export async function deletePost(id: string) {
  await requireAdmin();
  await prisma.post.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// ---------- 标签与分类 ----------

export async function createTag(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "标签名不能为空" };
  const slug = slugify(name);
  try {
    await prisma.tag.create({ data: { name, slug } });
  } catch {
    return { error: "标签已存在或 slug 冲突" };
  }
  revalidatePath("/tags");
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteTag(id: string) {
  await requireAdmin();
  try {
    await prisma.tag.delete({ where: { id } });
  } catch {
    // 标签下还有文章,提示
    throw new Error("该标签下还有文章,请先移除文章中的标签");
  }
  revalidatePath("/tags");
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function createCategory(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "分类名不能为空" };
  const slug = slugify(name);
  try {
    await prisma.category.create({ data: { name, slug } });
  } catch {
    return { error: "分类已存在或 slug 冲突" };
  }
  revalidatePath("/categories");
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error("该分类下还有文章,请先移除文章中的分类");
  }
  revalidatePath("/categories");
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

// ---------- 简历 ----------

export async function saveResume(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const raw = String(formData.get("json") ?? "").trim();
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { error: "JSON 格式错误,无法解析" };
  }
  if (typeof data !== "object" || data === null || !("name" in data)) {
    return { error: "JSON 必须是包含 name 字段的对象" };
  }
  await prisma.resume.upsert({
    where: { id: 1 },
    update: { data },
    create: { id: 1, data },
  });
  revalidatePath("/resume");
  return { ok: true };
}

// ---------- 关于页 ----------

export async function saveAbout(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin();
  const content = String(formData.get("content") ?? "");
  await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: { aboutContent: content },
    create: { id: 1, aboutContent: content },
  });
  revalidatePath("/about");
  return { ok: true };
}
