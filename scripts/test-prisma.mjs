// 端到端验证:Prisma Client -> PostgreSQL
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const tag = await prisma.tag.create({ data: { name: '测试标签', slug: 'test-tag' } });
console.log('created tag:', tag);

const post = await prisma.post.create({
  data: {
    title: '第一篇测试文章',
    slug: 'hello-world',
    summary: '这是一段摘要',
    content: '## 你好\n\n这是一篇测试文章。',
    status: 'PUBLISHED',
    publishedAt: new Date(),
    tags: { connect: { id: tag.id } },
  },
});
console.log('created post:', post.title, '| views:', post.viewCount);

const withTags = await prisma.post.findUnique({
  where: { id: post.id },
  include: { tags: true, category: true },
});
console.log('post tags:', withTags.tags.map((t) => t.name).join(','));

await prisma.post.delete({ where: { id: post.id } });
await prisma.tag.delete({ where: { id: tag.id } });
await prisma.$disconnect();
console.log('ALL OK ✅');
