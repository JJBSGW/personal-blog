// 自建会话认证:随机 token 存库 + httpOnly Cookie
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "blog_session";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 天

/** 角色(与 Prisma UserRole 对齐,便于未来扩展) */
export type UserRole = "ADMIN" | "EDITOR";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
}

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

export async function getSessionUser(): Promise<SessionUser | null> {
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
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role: session.user.role as UserRole,
  };
}

/**
 * 角色守卫(向外接口):校验登录并要求指定角色之一。
 * - 未登录 → 跳转 /admin/login
 * - 已登录但角色不符 → 跳转首页
 */
export async function requireRole(...roles: UserRole[]): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (roles.length > 0 && !roles.includes(user.role)) redirect("/");
  return user;
}

/** 后台页面守卫:要求管理员角色(兼容旧调用) */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole("ADMIN");
}

export async function destroySession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}
