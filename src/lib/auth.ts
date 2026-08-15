// 自建会话认证:随机 token 存库 + httpOnly Cookie
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "blog_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  return token;
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }
  return session.user;
}

/** 后台页面守卫:未登录则跳转登录页 */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function destroySession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}
