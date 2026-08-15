import { prisma } from "@/lib/db";
import { defaultAboutContent } from "@/lib/site";
import { AboutEditor } from "@/components/admin/about-editor";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const cfg = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">关于页</h1>
      <p className="text-sm text-zinc-500">
        编辑内容(Markdown),保存后前台 /about 即时更新。留空则使用默认内容。
      </p>
      <AboutEditor initialContent={cfg?.aboutContent ?? defaultAboutContent} />
    </div>
  );
}
