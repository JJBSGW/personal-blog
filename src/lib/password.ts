// 密码哈希(使用 Node 内置 crypto.scrypt,零第三方依赖)
// 存储格式:scrypt$<saltHex>$<hashHex>
import crypto from "node:crypto";

const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const hash = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LEN, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, expected.length, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}
