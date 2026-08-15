import { prisma } from "@/lib/db";
import { defaultResume } from "@/lib/resume";
import { ResumeEditor } from "@/components/admin/resume-editor";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
  const row = await prisma.resume.findUnique({ where: { id: 1 } });
  const data = (row?.data ?? defaultResume) as object;
  const json = JSON.stringify(data, null, 2);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">个人简历</h1>
      <ResumeEditor initialJson={json} />
    </div>
  );
}
