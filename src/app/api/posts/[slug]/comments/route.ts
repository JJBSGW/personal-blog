import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

// 发表评论:蜜罐防垃圾 + IP 限流(同 IP 1 小时内最多 5 条)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: {
      slug,
      OR: [
        { status: "PUBLISHED" },
        { status: "DRAFT", publishedAt: { lte: new Date() } },
      ],
    },
    select: { id: true },
  });
  if (!post) {
    return Response.json({ error: "文章不存在" }, { status: 404 });
  }

  let body: { author?: string; content?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400 });
  }

  const author = String(body.author ?? "").trim().slice(0, 50);
  const content = String(body.content ?? "").trim().slice(0, 2000);
  const website = String(body.website ?? "").trim();

  // 蜜罐:机器人填了隐藏字段 → 假装成功并丢弃
  if (website) return Response.json({ ok: true });
  if (!author || !content) {
    return Response.json({ error: "请填写昵称和内容" }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 限流
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await prisma.comment.count({
    where: { ip, createdAt: { gte: hourAgo } },
  });
  if (recentCount >= 5) {
    return Response.json({ error: "评论太频繁,请稍后再试" }, { status: 429 });
  }

  await prisma.comment.create({
    data: { postId: post.id, author, content, ip },
  });
  revalidatePath(`/posts/${slug}`);
  return Response.json({ ok: true });
}
