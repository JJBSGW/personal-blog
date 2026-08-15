import { prisma } from "@/lib/db";
import { createPost } from "@/app/admin/actions";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "新建文章 · 后台" };

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">新建文章</h1>
      <PostForm
        action={createPost}
        categories={categories}
        tags={tags}
        submitLabel="保存文章"
      />
    </div>
  );
}
