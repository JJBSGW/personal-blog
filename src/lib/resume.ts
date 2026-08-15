// 简历数据结构与占位数据(个人信息先用有趣占位符,阶段 3.5 可在后台编辑)
export interface ResumeItem {
  title: string;
  subtitle?: string;
  period?: string;
  description?: string;
  tags?: string[];
}

export interface ResumeSkill {
  name: string;
  level: number; // 1-5
}

export interface ResumeData {
  name: string;
  title: string;
  contact: { email?: string; github?: string; location?: string };
  summary: string;
  education: ResumeItem[];
  projects: ResumeItem[];
  skills: ResumeSkill[];
  awards: ResumeItem[];
  experience: ResumeItem[];
}

export const defaultResume: ResumeData = {
  name: "夜猫子站长",
  title: "全栈开发爱好者 / 摸鱼学博士(占位)",
  contact: {
    email: "hi@example.dev",
    github: "https://github.com/JJBSGW",
    location: "赛博空间 404 号(占位)",
  },
  summary:
    "白天写业务代码,晚上写博客。对 TypeScript、PostgreSQL 与一切能折腾的东西保持好奇。本条为占位信息,上线前请替换。",
  education: [
    {
      title: "某大学 · 计算机科学(占位)",
      subtitle: "硕士研究生",
      period: "20XX - 20XX",
      description: "研究方向:分布式系统与摸鱼行为学(占位)。",
    },
  ],
  projects: [
    {
      title: "深夜编码室(本项目)",
      subtitle: "作者 / 运维 / 扫地僧",
      period: "2026 - 至今",
      description:
        "一个使用 Next.js 16 + PostgreSQL + Prisma 构建的全栈博客,含后台管理、中文全文搜索、阅读统计与简历页。",
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    },
    {
      title: "占位项目:自动泡面机",
      subtitle: "硬件 × 软件",
      period: "20XX",
      description: "用树莓派控制泡面水温,并试图用量化数据证明泡面是深夜编程的最佳伴侣。",
      tags: ["Raspberry Pi", "IoT"],
    },
  ],
  skills: [
    { name: "TypeScript / JavaScript", level: 4 },
    { name: "React / Next.js", level: 4 },
    { name: "PostgreSQL / SQL", level: 3 },
    { name: "Docker / Linux", level: 3 },
    { name: "Python", level: 3 },
    { name: "CSS / Tailwind", level: 4 },
  ],
  awards: [
    { title: "最佳摸鱼奖(占位)", description: "某次黑客松最优雅的摸鱼姿势。", period: "20XX" },
    { title: "深夜提交之星(占位)", description: "连续 30 天凌晨 2 点提交代码(不推荐模仿)。", period: "20XX" },
  ],
  experience: [
    {
      title: "某不知名公司(占位)",
      subtitle: "前端实习生",
      period: "20XX",
      description: "负责把设计稿变成页面,以及把页面改回设计稿。",
    },
  ],
};
