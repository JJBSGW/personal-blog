"use server";

// 服务端动作(薄壳层):解析表单 → 调用领域服务 → 刷新缓存/重定向
// 领域业务逻辑见 src/lib/services/*
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import {
  createPost as createPostService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  type PostInput,
} from "@/lib/services/posts";
import {
  createTag as createTagService,
  deleteTag as deleteTagService,
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
} from "@/lib/services/taxonomy";
import {
  createLink as createLinkService,
  deleteLink as deleteLinkService,
  deleteComment as deleteCommentService,
  saveResumeData,
  saveAboutContent,
  saveSiteSettings,
  type LinkInput,
  type SiteSettingsInput,
} from "@/lib/services/content";

export interface FormState {
  error?: string;
  ok?: boolean;
}

function err(e: unknown): FormState {
  return { error: e instanceof Error ? e.message : "操作失败" };
}

const PUBLISHED = "PUBLISHED" as const;

function parsePostForm(formData: FormData): PostInput {
  const status = formData.get("status") === PUBLISHED ? PUBLISHED : ("DRAFT" as const);
  const scheduledRaw = String(formData.get("scheduledAt") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    summary: String(formData.get("summary") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    status,
    categoryId: String(formData.get("categoryId") ?? "") || null,
    tagSlugs: formData.getAll("tags").map(String),
    cover: String(formData.get("cover") ?? "").trim() || null,
    pinned: formData.get("pinned") === "on",
    scheduledAt: scheduledRaw ? new Date(scheduledRaw) : null,
  };
}

// ---------- 文章 ----------

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  let post;
  try {
    post = await createPostService(parsePostForm(formData));
  } catch (e) {
    return err(e);
  }
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}/edit?created=1`);
}

export async function updatePost(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  let post;
  try {
    post = await updatePostService(id, parsePostForm(formData));
  } catch (e) {
    return err(e);
  }
  revalidatePath("/");
  revalidatePath(`/posts/${post.slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts/${post.id}/edit?saved=1`);
}

export async function deletePost(id: string) {
  await requireAdmin();
  await deletePostService(id);
  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

// ---------- 标签与分类 ----------

export async function createTag(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  try {
    await createTagService(name);
  } catch (e) {
    return err(e);
  }
  revalidatePath("/tags");
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await deleteTagService(id);
  revalidatePath("/tags");
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  try {
    await createCategoryService(name);
  } catch (e) {
    return err(e);
  }
  revalidatePath("/categories");
  revalidatePath("/admin/tags");
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await deleteCategoryService(id);
  revalidatePath("/categories");
  revalidatePath("/admin/tags");
  redirect("/admin/tags");
}

// ---------- 友链 ----------

export async function createLink(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const input: LinkInput = {
    name: String(formData.get("name") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    sort: Math.max(0, Number(formData.get("sort")) || 0),
  };
  try {
    await createLinkService(input);
  } catch (e) {
    return err(e);
  }
  revalidatePath("/links");
  revalidatePath("/admin/links");
  return { ok: true };
}

export async function deleteLink(id: string) {
  await requireAdmin();
  await deleteLinkService(id);
  revalidatePath("/links");
  revalidatePath("/admin/links");
  redirect("/admin/links");
}

// ---------- 评论 ----------

export async function deleteComment(id: string) {
  await requireAdmin();
  await deleteCommentService(id);
  revalidatePath("/admin/comments");
  redirect("/admin/comments");
}

// ---------- 简历 ----------

export async function saveResume(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const raw = String(formData.get("json") ?? "").trim();
  try {
    await saveResumeData(raw);
  } catch (e) {
    return err(e);
  }
  revalidatePath("/resume");
  return { ok: true };
}

// ---------- 关于页 ----------

export async function saveAbout(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  await saveAboutContent(String(formData.get("content") ?? ""));
  revalidatePath("/about");
  return { ok: true };
}

// ---------- 站点设置 ----------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const pick = (k: string) => {
    const v = String(formData.get(k) ?? "").trim();
    return v || null;
  };
  const data: SiteSettingsInput = {
    siteName: pick("siteName"),
    description: pick("description"),
    author: pick("author"),
    github: pick("github"),
    email: pick("email"),
    footerText: pick("footerText"),
  };
  await saveSiteSettings(data);
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
