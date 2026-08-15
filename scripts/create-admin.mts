// 创建/重置管理员账号
// 用法:npx tsx scripts/create-admin.ts <email> <password>
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password.js";

const email = (process.argv[2] ?? "admin@example.dev").trim().toLowerCase();
const password = process.argv[3];
if (!password || password.length < 8) {
  console.error("用法:npx tsx scripts/create-admin.ts <email> <password>(至少 8 位)");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const passwordHash = await hashPassword(password);
const user = await prisma.user.upsert({
  where: { email },
  update: { passwordHash, name: email.split("@")[0] },
  create: { email, passwordHash, name: email.split("@")[0] },
});

console.log(`管理员账号就绪: ${user.email}`);
console.log(`(密码已更新,请妥善保存;可随时重跑本脚本重置)`);
await prisma.$disconnect();
