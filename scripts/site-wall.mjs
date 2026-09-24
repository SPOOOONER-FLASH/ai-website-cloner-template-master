#!/usr/bin/env node
/**
 * 提交守卫：一个提交不能同时动雷茵独占和 HYDE 独占的文件。
 *
 * 由 .githooks/pre-commit 调用（`npm run wall:install` 装一次，本仓库所有工作区生效）。
 * 也可以手动跑：`node scripts/site-wall.mjs` 检查当前暂存区。
 *
 * 不需要知道是谁在提交 —— 只看提交本身。跨线的提交几乎总是事故：
 * 一次全量构建把 out/ 和 out-rayen/ 一起 git add，或者 git add 了一个目录，
 * 顺手扫进了另一边还没提交的改动。
 *
 * 确实需要跨线（极少，比如同时重命名两边都引用的东西）：
 *   SITE_WALL_OVERRIDE="理由" git commit ...
 * 理由会打印出来；请把同一句理由写进提交说明。
 */
import { execFileSync } from "node:child_process";
import { laneOf } from "./lib/site-lanes.mjs";

/*
  maxBuffer: a release commit stages ~13,000 files under out/ and the name list runs past 1 MB,
  Node's default. On 2026-09-24 that killed this hook with SIGTERM (ENOBUFS) and aborted the HYDE
  release at `git commit`, right after a clean build: the first release run with the hook actually
  installed (core.hooksPath had never been set on the old C: repo).
*/
/*
  A merge commit is exempt. Everything it brings in was committed — and walled — on its own
  side already; the index of a merge naturally holds both lanes, because the two sides each
  released. Git skips pre-commit for a clean merge, but a merge that stopped on a conflict is
  finished with `git commit`, which runs this hook. On 2026-09-24 that turned every
  `npm run ship` side merge with a SHIPLOG.md conflict into "真冲突" (exit 75): the conflict
  was resolved, then the concluding commit was rejected for carrying out-rayen/ and out/.
*/
let merging = false;
try {
  execFileSync("git", ["rev-parse", "-q", "--verify", "MERGE_HEAD"], { stdio: "ignore" });
  merging = true;
} catch {
  // not a merge
}
if (merging) process.exit(0);

const staged = execFileSync("git", ["diff", "--cached", "--name-only", "-z"], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 })
  .split("\0")
  .filter(Boolean);

const byLane = { rayen: [], hyde: [] };
for (const path of staged) {
  const lane = laneOf(path);
  if (lane) byLane[lane].push(path);
}

if (byLane.rayen.length && byLane.hyde.length) {
  const override = process.env.SITE_WALL_OVERRIDE;
  if (override) {
    console.error(`⚠ 分界墙被放行：${override}`);
    process.exit(0);
  }
  const sample = (list) => list.slice(0, 5).map((p) => `      ${p}`).join("\n") + (list.length > 5 ? `\n      …共 ${list.length} 个` : "");
  console.error(
    [
      "✗ 分界墙：这个提交同时动了雷茵和 HYDE 各自独占的文件。",
      "",
      `  雷茵（${byLane.rayen.length}）：`,
      sample(byLane.rayen),
      `  HYDE（${byLane.hyde.length}）：`,
      sample(byLane.hyde),
      "",
      "  拆成两个提交；不是你那一边的，先 git restore --staged 取消暂存，不要删、不要还原。",
      "  发布请用 npm run release:hyde / npm run release:rayen，它们只提交自己的输出目录。",
      "  确实需要跨线：SITE_WALL_OVERRIDE=\"理由\" git commit ...",
    ].join("\n"),
  );
  process.exit(1);
}
