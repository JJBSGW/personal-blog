// 创建/重置管理员账号(纯 Node 脚本,本地与生产容器内均可运行)
// 用法:node scripts/create-admin.mjs <email> <password(至少8位)>
// 密码哈希格式与 src/lib/password.ts 完全一致(scrypt$salt$hash)
import "dotenv/config";
import pg from "pg";
import crypto from "node:crypto";

const email = (process.argv[2] ?? "").trim().toLowerCase();
const password = process.argv[3] ?? "";
if (!email || password.length < 8) {
  console.error("用法: node scripts/create-admin.mjs <email> <password(至少8位)>");
  process.exit(1);
}

const { Client } = pg;
const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const salt = crypto.randomBytes(16);
const hash = await new Promise((resolve, reject) => {
  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) reject(err);
    else resolve(derivedKey);
  });
});
const stored = `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;

await client.query(
  `INSERT INTO "User" (id, email, name, "passwordHash", role, "createdAt", "updatedAt")
   VALUES ($1, $2, $3, $4, 'ADMIN', now(), now())
   ON CONFLICT (email) DO UPDATE
     SET "passwordHash" = EXCLUDED."passwordHash",
         name = EXCLUDED.name,
         role = 'ADMIN',
         "updatedAt" = now()`,
  [crypto.randomUUID(), email, email.split("@")[0], stored]
);

console.log(`管理员账号就绪: ${email}(密码已设置,可随时重跑本脚本重置)`);
await client.end();
