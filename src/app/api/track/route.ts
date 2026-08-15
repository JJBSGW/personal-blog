import { prisma } from "@/lib/db";

// 全站访问埋点:记录 PV(60 秒内同 IP 同路径去重,降低刷新噪声)
export async function POST(request: Request) {
  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400 });
  }
  const path = String(body.path ?? "").slice(0, 200) || "/";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ua = (request.headers.get("user-agent") ?? "").slice(0, 300);

  // 60 秒去重
  const cutoff = new Date(Date.now() - 60 * 1000);
  const recent = await prisma.visitLog.findFirst({
    where: { ip, path, date: { gte: cutoff } },
    select: { id: true },
  });
  if (!recent) {
    await prisma.visitLog.create({ data: { path, ip, userAgent: ua } });
  }
  return Response.json({ ok: true });
}
