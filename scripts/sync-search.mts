// 全量同步已发布文章到 Meilisearch 索引(幂等)
// 运行:npx tsx scripts/sync-search.mts
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { rebuildIndex } from "../src/lib/search.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const posts = await prisma.post.findMany({
  where: { status: "PUBLISHED" },
  include: { tags: true, category: true },
  orderBy: { publishedAt: "desc" },
});

const docs = posts.map((p) => ({
  id: p.id,
  title: p.title,
  content: p.content,
  summary: p.summary ?? "",
  slug: p.slug,
  tags: p.tags.map((t) => t.name),
  category: p.category?.name ?? null,
  status: p.status,
  publishedAt: p.publishedAt?.getTime() ?? 0,
}));

await rebuildIndex(docs);
console.log(`搜索索引同步完成: ${docs.length} 篇文章`);
await prisma.$disconnect();
