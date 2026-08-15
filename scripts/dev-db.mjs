// 本地开发数据库:运行真正的 PostgreSQL(embedded-postgres 包,二进制在工作区内),
// 数据持久化到 .cache/pgdata(不提交 Git)。
// 注意:本脚本会启动 postgres/initdb 子进程,在受限沙箱下需要提升权限运行。
import EmbeddedPostgres from 'embedded-postgres';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', '.cache', 'pgdata');

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: 5432,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  onLog: (msg) => console.log('[postgres]', msg),
  onError: (err) => console.error('[postgres:err]', err),
});

await pg.initialise();
await pg.start();
console.log('[dev-db] PostgreSQL ready on 127.0.0.1:5432');
console.log('[dev-db] DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/postgres');

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    console.log(`[dev-db] received ${sig}, stopping PostgreSQL...`);
    await pg.stop();
    process.exit(0);
  });
}
