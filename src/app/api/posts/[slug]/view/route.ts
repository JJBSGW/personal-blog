import { prisma } from "@/lib/db";

// 阅读统计接口:按 IP + 10 分钟时间窗口去重防刷
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true },
  });
  if (!post) {
    return Response.json({ error: "文章不存在" }, { status: 404 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const cutoff = new Date(Date.now() - 10 * 60 * 1000);
  const recent = await prisma.viewLog.findFirst({
    where: { postId: post.id, ip, date: { gte: cutoff } },
    select: { id: true },
  });

  if (!recent) {
    await prisma.$transaction([
      prisma.viewLog.create({ data: { postId: post.id, ip } }),
      prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      }),
    ]);
  }

  return Response.json({ ok: true });
}
