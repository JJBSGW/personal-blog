import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { defaultResume, type ResumeData } from "@/lib/resume";
import { PrintButton } from "@/components/print-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "个人简历" };

export default async function ResumePage() {
  const row = await prisma.resume.findUnique({ where: { id: 1 } });
  const data = (row?.data ?? defaultResume) as unknown as ResumeData;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">个人简历</h1>
        <PrintButton />
      </div>

      {/* 头部 */}
      <header className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">{data.title}</p>
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
          {data.contact.email && <li>✉️ {data.contact.email}</li>}
          {data.contact.github && <li>🔗 {data.contact.github}</li>}
          {data.contact.location && <li>📍 {data.contact.location}</li>}
        </ul>
      </header>

      {/* 简介 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">个人简介</h2>
        <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
          {data.summary}
        </p>
      </section>

      {/* 教育背景 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">教育背景</h2>
        <div className="space-y-3">
          {data.education.map((item, i) => (
            <ResumeItemCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* 研究 / 项目经历 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">研究 / 项目经历</h2>
        <div className="space-y-3">
          {data.projects.map((item, i) => (
            <ResumeItemCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* 专业技能 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">专业技能</h2>
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {data.skills.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <span className="w-48 shrink-0 text-sm">{s.name}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`h-2 w-5 rounded-sm ${
                      n <= s.level
                        ? "bg-indigo-500"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 获奖荣誉 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">获奖荣誉</h2>
        <div className="space-y-3">
          {data.awards.map((item, i) => (
            <ResumeItemCard key={i} item={item} />
          ))}
        </div>
      </section>

      {/* 工作 / 实习经历 */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">工作 / 实习经历</h2>
        <div className="space-y-3">
          {data.experience.map((item, i) => (
            <ResumeItemCard key={i} item={item} />
          ))}
        </div>
      </section>

      <p className="text-center text-xs text-zinc-400">
        本站简历为占位内容,上线前请在后台(阶段 3.5)或数据库中替换为真实信息。
      </p>
    </div>
  );
}

function ResumeItemCard({ item }: { item: { title: string; subtitle?: string; period?: string; description?: string; tags?: string[] } }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="font-medium">{item.title}</p>
        {item.period && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.period}</p>
        )}
      </div>
      {item.subtitle && (
        <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-400">
          {item.subtitle}
        </p>
      )}
      {item.description && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {item.description}
        </p>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
