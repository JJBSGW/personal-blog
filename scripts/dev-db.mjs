// 本地开发数据库:运行真正的 PostgreSQL(embedded-postgres 包,二进制在工作区内),
// 数据持久化到 .cache/pgdata(不提交 Git)。
// 幂等设计:① 数据目录已初始化 → 跳过 initdb;② 端口已被占用 → 提示后直接退出。
import EmbeddedPostgres from 'embedded-postgres';
import pg from 'pg';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '..', '.cache', 'pgdata');
const PORT = 5432;
const DB_URL = `postgresql://postgres:postgres@127.0.0.1:${PORT}/postgres`;

// 1) 如果 5432 端口已经有 PostgreSQL 在跑,直接退出(避免重复启动)
const probe = new pg.Client({ connectionString: DB_URL, connectionTimeoutMillis: 1500 });
try {
  await probe.connect();
  await probe.end();
  console.log(`[dev-db] PostgreSQL 已在 127.0.0.1:${PORT} 运行,无需重复启动。`);
  process.exit(0);
} catch {
  // 端口空闲,继续启动
}

const pgServer = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
  initdbFlags: ['--encoding=UTF8', '--locale=C'],
  onLog: (msg) => console.log('[postgres]', msg),
  onError: (err) => console.error('[postgres:err]', err),
});

// 2) 数据目录已初始化则跳过 initdb(initdb 拒绝在非空目录重复初始化)
const isInitialized = fs.existsSync(path.join(dataDir, 'PG_VERSION'));
if (isInitialized) {
  console.log('[dev-db] 数据目录已初始化,跳过 initdb,直接启动...');
} else {
  await pgServer.initialise();
}

// 3) 启动
await pgServer.start();
console.log(`[dev-db] PostgreSQL 就绪: ${DB_URL}`);

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    console.log(`[dev-db] 收到 ${sig},正在停止 PostgreSQL...`);
    await pgServer.stop();
    process.exit(0);
  });
}
