#!/usr/bin/env node
/**
 * 推送 + 上线存档：npm run ship
 *
 * 甲方 2026-09-23：
 *   「服务器总是掉线，让 agent 一直在等待，能不能设置推送三次上不去就提交报告我，
 *    或者完成其他工作的纪律。」
 *   「永远 push 一个立即写进一个文档，上线存档，方便我换电脑工作。」
 *
 * 做三件事：
 *   1. 重新生成 docs/collaboration/SHIPLOG.md（上线存档），有变化就单独提交一次「shiplog:」
 *   2. 推送，最多三次，每次限时 5 分钟；被拒（别人刚推过）就合并再推（共用工作区不能 rebase）
 *   3. 三次都失败：把未推送的提交记进 docs/collaboration/PUSH-PENDING.md（本地文件，
 *      下一次成功推送时一起带上去），打印报告，退出码 75 —— 意思是「稍后再推，先去做别的」。
 *      **不要原地重试等待。** 下一个提交做完再跑 npm run ship，积压的会一起推上去。
 *
 * 退出码：0 已推送 · 75 未推送已记录（去做别的）· 1 其他错误（rebase 冲突等，需要人看）
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PENDING = "docs/collaboration/PUSH-PENDING.md";
const TIMEOUT = 5 * 60 * 1000;

function git(args, { timeout = TIMEOUT } = {}) {
  const r = spawnSync("git", args, { encoding: "utf8", timeout });
  const timedOut = r.error?.code === "ETIMEDOUT";
  // Drop git's CRLF "warning:" lines: on this Windows tree there are thousands, and they pushed
  // the real error out of the one-line reason recorded in PUSH-PENDING.md (2026-09-24).
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`
    .split("\n")
    .filter((l) => !/^warning: in the working copy of /.test(l))
    .join("\n")
    .trim();
  return { ok: r.status === 0 && !timedOut, out, timedOut };
}
const now = () => new Date().toLocaleString("zh-CN", { hour12: false });

/** Merge local HEAD onto origin/main in tmp/ship-merge (reused) and push from there. */
function sideMerge() {
  const WT = "tmp/ship-merge";
  const local = git(["rev-parse", "HEAD"]).out;
  const count = git(["rev-list", "--count", "origin/main..HEAD"]).out;
  const inWt = (args) => {
    const r = spawnSync("git", ["-C", WT, ...args], { encoding: "utf8", timeout: TIMEOUT });
    return { ok: r.status === 0 && r.error?.code !== "ETIMEDOUT", out: `${r.stdout ?? ""}${r.stderr ?? ""}`.trim() };
  };
  if (!existsSync(`${WT}/.git`)) {
    git(["worktree", "prune"]);
    const add = git(["worktree", "add", "--detach", WT, "origin/main"], { timeout: 15 * 60 * 1000 });
    if (!add.ok) return { ok: false, why: `建旁路检出失败：${add.out.split("\n").pop()}` };
  } else {
    const co = inWt(["checkout", "-q", "--detach", "-f", "origin/main"]);
    if (!co.ok) return { ok: false, why: co.out.split("\n").pop() };
    inWt(["clean", "-fdq"]);
  }
  const mg = inWt(["merge", "--no-edit", "-m", "合并本地提交（ship 旁路合并）", local]);
  if (!mg.ok) {
    inWt(["merge", "--abort"]);
    return { ok: false, why: `真冲突，需要人看：${mg.out.split("\n").slice(-2).join(" / ")}` };
  }
  const push = inWt(["push", "origin", "HEAD:main"]);
  if (!push.ok) return { ok: false, why: push.out.split("\n").slice(-2).join(" / ") };
  return { ok: true, sha: inWt(["rev-parse", "--short", "HEAD"]).out, count };
}

// 1. 上线存档
const gen = spawnSync("node", ["scripts/build-shiplog.mjs"], { encoding: "utf8" });
if (gen.status !== 0) {
  console.error(`✗ 生成 SHIPLOG 失败：${gen.stderr}`);
  process.exit(1);
}
const LOGS = ["docs/collaboration/SHIPLOG.md", ...(existsSync(PENDING) ? [PENDING] : [])];
const dirty = LOGS.some((f) => !git(["diff", "--quiet", "--", f]).ok || !git(["ls-files", "--error-unmatch", f]).ok);
if (dirty) {
  git(["add", "--", ...LOGS]);
  const c = git(["commit", "-q", "-m", "shiplog: 更新上线存档", "--", ...LOGS]);
  if (!c.ok) console.error(`⚠ SHIPLOG 未能提交（继续推送）：${c.out.split("\n").pop()}`);
}

// 2. 推送，最多三次
const ahead = () => git(["rev-list", "--count", "@{u}..HEAD"]).out || "?";
let last = "";
for (let attempt = 1; attempt <= 3; attempt++) {
  console.log(`→ 推送（第 ${attempt}/3 次，最多等 5 分钟）`);
  const p = git(["push", "origin", "HEAD:main"]);
  if (p.ok) {
    console.log(`✓ 已推送。${existsSync(PENDING) ? "积压记录保留在 PUSH-PENDING.md（已随本次推送上去）。" : ""}`);
    console.log("  服务器 5 分钟内拉取。源码不等于上线：网站要等下一次 release:hyde。");
    process.exit(0);
  }
  last = p.timedOut ? "超时（5 分钟无响应）" : p.out.split("\n").slice(-2).join(" / ");
  if (/rejected|fetch first|non-fast-forward/i.test(p.out)) {
    /*
      merge, not rebase. This is a SHARED working tree: other agents' uncommitted edits are
      always present, and rebase refuses to start over them (first real run, 2026-09-24:
      "cannot rebase: You have unstaged changes"). Stashing their work to make room is
      forbidden. A merge works over a dirty tree, and when an incoming change touches a file
      somebody has open it stops BEFORE changing anything — nothing is lost either way.
    */
    console.log("  远端有新提交，合并后重试");
    const f = git(["fetch", "origin", "main"]);
    if (!f.ok) continue;
    const m = git(["merge", "--no-edit", "origin/main"]);
    if (!m.ok) {
      git(["merge", "--abort"]);
      /*
        The shared tree cannot take the merge — typically someone is mid-rebuild of out/ and
        the remote brought a newer out/. Do the merge in a side checkout instead and push
        from there. The shared tree is untouched; its branch catches up later, when whoever
        is building has committed.
      */
      console.log("  共用工作区有人正在改的文件与远端冲突 —— 改在旁路检出里合并并推送");
      const side = sideMerge();
      if (side.ok) {
        console.log(`✓ 已从旁路检出推送 ${side.sha}（含本地 ${side.count} 个提交）。共用工作区未动；它之后再跟上远端。`);
        process.exit(0);
      }
      last = `旁路合并也失败：${side.why}`;
      break;
    }
  }
}

// 3. 三次都失败：记下来，去做别的
const commits = git(["log", "--format=- `%h` %s", "origin/main..HEAD"]).out || "（无法列出）";
const entry = `\n## ${now()} · 三次推送失败\n\n原因：${last}\n\n未推送的提交：\n\n${commits}\n\n下一次 \`npm run ship\` 成功时这些会一起推上去。\n`;
const head = "# 未推送积压\n\n`npm run ship` 三次推不上时写这里（甲方 2026-09-23：推不上就报告，先做别的，不要干等）。\n成功推送后，这里的记录随之上传，作为历史保留。\n";
writeFileSync(PENDING, (existsSync(PENDING) ? readFileSync(PENDING, "utf8") : head) + entry);
console.error(`⚠ 三次推送都失败（${last}）。${ahead()} 个提交在本地，已记入 ${PENDING}。`);
console.error("  不要原地等待：继续做下一项工作，做完再 npm run ship，积压会一起推上去。向甲方报告这一行。");
process.exit(75);
