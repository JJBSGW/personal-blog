import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400 });
  }
  const email = (body.email ?? "").toString().trim().toLowerCase();
  const password = (body.password ?? "").toString();
  if (!email || !password) {
    return Response.json({ error: "请输入邮箱和密码" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return Response.json({ error: "邮箱或密码错误" }, { status: 401 });
  }

  const token = await createSession(user.id);
  const response = Response.json({ ok: true, email: user.email });
  response.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
  );
  return response;
}
