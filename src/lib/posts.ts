// 前台数据访问层(仅查询已发布内容)
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

/** 文章 + 标签 + 分类 的完整类型 */
export type PostWithRelations = Prisma.PostGetPayload<{
  include: { tags: true; category: true };
}>;

export interface ListOptions {
  page?: number;
  pageSize?: number;
  tagSlug?: string;
  categorySlug?: string;
}

export interface ListResult {
  posts: PostWithRelations[];
  total: number;
  page: number;
  totalPages: number;
}

const PUBLISHED = "PUBLISHED";

/**
 * "可见"条件:已发布,或"定时发布"已到时间(DRAFT + publishedAt <= 现在)
 * 由此实现零基础设施的定时发布
 */
function visibleWhere(extra: Prisma.PostWhereInput = {}): Prisma.PostWhereInput {
  return {
    OR: [{ status: PUBLISHED }, { status: "DRAFT", publishedAt: { lte: new Date() } }],
    ...extra,
  };
}

export async function listPublishedPosts(opts: ListOptions = {}): Promise<ListResult> {
  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, opts.pageSize ?? 10));
  const where = visibleWhere({
    ...(opts.tagSlug ? { tags: { some: { slug: opts.tagSlug } } } : {}),
    ...(opts.categorySlug ? { category: { slug: opts.categorySlug } } : {}),
  });
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { tags: true, category: true },
    }),
    prisma.post.count({ where }),
  ]);
  return { posts, total, page, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: visibleWhere({ slug }),
    include: { tags: true, category: true },
  });
}

/** 上一篇 / 下一篇(按发布时间相邻,仅考虑可见文章) */
export async function getPostNeighbors(post: {
  slug: string;
  publishedAt: Date | null;
  createdAt: Date;
}) {
  const anchor = post.publishedAt ?? post.createdAt;
  const [prev, next] = await Promise.all([
    prisma.post.findFirst({
      where: visibleWhere({ publishedAt: { lt: anchor } }),
      orderBy: { publishedAt: "desc" },
      select: { slug: true, title: true },
    }),
    prisma.post.findFirst({
      where: visibleWhere({ publishedAt: { gt: anchor } }),
      orderBy: { publishedAt: "asc" },
      select: { slug: true, title: true },
    }),
  ]);
  return { prev, next };
}

export async function listTagsWithCount() {
  const tags = await prisma.tag.findMany({
    include: {
      _count: { select: { posts: { where: { status: PUBLISHED } } } },
    },
    orderBy: { name: "asc" },
  });
  return tags.filter((t) => t._count.posts > 0);
}

export async function listCategoriesWithCount() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { status: PUBLISHED } } } },
    },
    orderBy: { name: "asc" },
  });
  return categories.filter((c) => c._count.posts > 0);
}

export async function getTagBySlug(slug: string) {
  return prisma.tag.findUnique({ where: { slug } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}
