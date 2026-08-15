// 文章领域服务:文章增删改与搜索索引同步(纯业务逻辑,不含 HTTP/表单/重定向)。
// 供 server actions 复用,未来也可供 API、CLI、其它角色调用。
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/markdown";
import { deletePostFromIndex, indexPost } from "@/lib/search";

export interface PostInput {
  title: string;
  content: string;
  summary: string;
  /** 原始 slug,留空则按标题自动生成 */
  slug?: string;
  status: "DRAFT" | "PUBLISHED";
  categoryId: string | null;
  tagSlugs: string[];
  cover: string | null;
  pinned: boolean;
  /** 定时发布:草稿 + 未来时间 */
  scheduledAt: Date | null;
}

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

async function resolveValidTagSlugs(tagSlugs: string[]): Promise<string[]> {
  const tags = await prisma.tag.findMany({
    where: { slug: { in: tagSlugs } },
    select: { slug: true },
  });
  return tags.map((t) => t.slug);
}

/** 同步文章到搜索索引(仅可见文章;失败不影响主流程) */
export async function syncPostToSearch(postId: string): Promise<void> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { tags: true, category: true },
  });
  if (!post) return;
  const visible =
    post.status === "PUBLISHED" ||
    (post.status === "DRAFT" && post.publishedAt !== null && post.publishedAt <= new Date());
  if (!visible) {
    await deletePostFromIndex(postId).catch(() => {});
    return;
  }
  await indexPost({
    id: post.id,
    title: post.title,
    content: post.content,
    summary: post.summary ?? "",
    slug: post.slug,
    tags: post.tags.map((t) => t.name),
    category: post.category?.name ?? null,
    status: post.status,
    publishedAt: post.publishedAt?.getTime() ?? 0,
  }).catch(() => {});
}

export async function createPost(input: PostInput) {
  if (!input.title) throw new Error("标题不能为空");
  const validTags = await resolveValidTagSlugs(input.tagSlugs);
  const post = await prisma.post.create({
    data: {
      title: input.title,
      slug: await uniqueSlug(input.slug || slugify(input.title)),
      summary: input.summary,
      content: input.content,
      status: input.status,
      publishedAt: input.status === "PUBLISHED" ? new Date() : input.scheduledAt,
      cover: input.cover,
      pinned: input.pinned,
      categoryId: input.categoryId,
      tags: { connect: validTags.map((slug) => ({ slug })) },
    },
  });
  await syncPostToSearch(post.id);
  return post;
}

export async function updatePost(id: string, input: PostInput) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new Error("文章不存在");
  if (!input.title) throw new Error("标题不能为空");
  const validTags = await resolveValidTagSlugs(input.tagSlugs);
  const post = await prisma.post.update({
    where: { id },
    data: {
      title: input.title,
      slug: await uniqueSlug(input.slug || slugify(input.title), id),
      summary: input.summary,
      content: input.content,
      status: input.status,
      publishedAt:
        input.status === "PUBLISHED" ? existing.publishedAt ?? new Date() : input.scheduledAt,
      cover: input.cover,
      pinned: input.pinned,
      categoryId: input.categoryId,
      tags: { set: validTags.map((slug) => ({ slug })) },
    },
  });
  await syncPostToSearch(post.id);
  return post;
}

export async function deletePost(id: string) {
  await prisma.post.delete({ where: { id } });
  await deletePostFromIndex(id).catch(() => {});
}
