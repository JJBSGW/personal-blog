import fs from "node:fs";
import path from "node:path";
import { MediaLibrary } from "@/components/admin/media-library";

export const dynamic = "force-dynamic";

const IMG_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export default async function AdminMediaPage() {
  const dir = path.join(process.cwd(), "public", "uploads");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => IMG_EXT.includes(path.extname(f).toLowerCase()))
      .map((f) => `/uploads/${f}`)
      .sort()
      .reverse();
  } catch {
    files = [];
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">媒体库</h1>
      <p className="text-sm text-zinc-500">
        上传后点「复制」,把图片地址粘贴到文章封面或正文里。
      </p>
      <MediaLibrary files={files} />
    </div>
  );
}
