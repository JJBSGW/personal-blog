// 本地搜索服务:如缺失则自动下载 Meilisearch 二进制,并在 127.0.0.1:7700 启动
// 用法:node scripts/dev-search.mjs(等价 npm run search:dev)
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exeDir = path.resolve(__dirname, "..", ".cache", "meilisearch");
const exeName = process.platform === "win32" ? "meilisearch.exe" : "meilisearch";
const exe = path.join(exeDir, exeName);
const dbDir = path.resolve(__dirname, "..", ".cache", "meilisearch-data");
const PORT = Number(process.env.MEILISEARCH_PORT ?? 7700);

// 1) 端口已有服务则直接退出(幂等)
try {
  const res = await fetch(`http://127.0.0.1:${PORT}/health`, {
    signal: AbortSignal.timeout(1500),
  });
  if (res.ok) {
    console.log(`[dev-search] Meilisearch 已在 ${PORT} 端口运行,无需重复启动。`);
    process.exit(0);
  }
} catch {
  // 未运行,继续
}

// 2) 二进制缺失则自动下载
if (!fs.existsSync(exe)) {
  console.log("[dev-search] 首次运行,正在下载 Meilisearch(约 128MB)...");
  fs.mkdirSync(exeDir, { recursive: true });
  const url =
    process.platform === "win32"
      ? "https://github.com/meilisearch/meilisearch/releases/latest/download/meilisearch-windows-amd64.exe"
      : "https://github.com/meilisearch/meilisearch/releases/latest/download/meilisearch-linux-amd64";
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`[dev-search] 下载失败: HTTP ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(exe, buf);
  if (process.platform !== "win32") {
    fs.chmodSync(exe, 0o755);
  }
  console.log(`[dev-search] 下载完成(${(buf.length / 1024 / 1024).toFixed(0)} MB)`);
}

fs.mkdirSync(dbDir, { recursive: true });

// 3) 启动(stdio 直连终端,方便 Ctrl+C)
const child = spawn(
  exe,
  [
    "--db-path", dbDir,
    "--http-addr", `127.0.0.1:${PORT}`,
    "--env", "development",
    "--no-analytics",
  ],
  { stdio: "inherit" }
);
child.on("error", (e) => {
  console.error("[dev-search] 启动失败:", e.message);
  process.exit(1);
});
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
