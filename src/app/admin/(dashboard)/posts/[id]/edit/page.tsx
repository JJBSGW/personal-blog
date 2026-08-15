import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { updatePost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const [post, categories, tags] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: { tags: true, category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!post) notFound();

  const sp = await searchParams;
  const notice = sp.created ? "文章已创建 ✅" : sp.saved ? "已保存 ✅" : null;

  // datetime-local 需要本地时区的 "YYYY-MM-DDTHH:mm"
  const scheduledAt =
    post.status === "DRAFT" && post.publishedAt
      ? new Date(
          post.publishedAt.getTime() - post.publishedAt.getTimezoneOffset() * 60000
        )
          .toISOString()
          .slice(0, 16)
      : "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">编辑文章</h1>
        <Link
          href={`/posts/${post.slug}`}
          target="_blank"
          className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          查看前台 ↗
        </Link>
      </div>
      {notice && (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400">
          {notice}
        </p>
      )}
      <PostForm
        action={updatePost.bind(null, post.id)}
        categories={categories}
        tags={tags}
        initial={{
          title: post.title,
          slug: post.slug,
          summary: post.summary ?? "",
          content: post.content,
          status: post.status,
          categoryId: post.categoryId,
          tagSlugs: post.tags.map((t) => t.slug),
          scheduledAt,
          cover: post.cover,
          pinned: post.pinned,
        }}
        submitLabel="保存修改"
      />
    </div>
  );
}
