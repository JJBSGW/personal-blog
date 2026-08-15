import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getSessionUser } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// 图片上传:multipart 表单字段 "file"
export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "未登录" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "请求格式错误" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "请选择要上传的图片" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      { error: "仅支持 jpg / png / webp / gif 图片" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "图片不能超过 5MB" }, { status: 400 });
  }

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const ext = (file.type.split("/")[1] || "png").replace("jpeg", "jpg");
  const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(UPLOAD_DIR, name), buf);

  return Response.json({ url: `/uploads/${name}` });
}
