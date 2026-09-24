#!/usr/bin/env node
/**
 * 各站独立发布：npm run release:hyde / npm run release:rayen
 *
 * 甲方 2026-09-23：雷茵和 HYDE「各自独立工作推送部署」。
 *
 * ---------------------------------------------------------------------------
 * 为什么不在主工作区里构建
 *
 * 两站在同一个 Next 应用里构建，一次构建必然同时重写 out/ 和 out-rayen/。在共用的工作区
 * 里构建，就会覆盖另一边正在进行的构建产物，而一次 `git add` 又会把另一边还没提交的
 * 源码一起带走 —— 2026-09-23 这两种事都发生过。
 *
 * 所以这个脚本：
 *   1. 在 tmp/release-<站>-<时间>/ 建一个 origin/main 的干净检出（不含任何人未提交的东西）
 *   2. 在那里安装依赖、构建、跑本站的检查
 *   3. **只 git add 本站的输出目录**（HYDE → out/，雷茵 → out-rayen/），提交、推送
 *   4. 删掉那个检出
 *
 * 主工作区一个文件都不碰。另一边的输出目录在检出里也被重写了，但不提交，随检出一起丢弃。
 * 推送被拒（另一边刚推过）就 rebase 再推：两边提交的是不相交的目录，rebase 不会冲突。
 *
 * ---------------------------------------------------------------------------
 * 用法
 *
 *   npm run release:hyde
 *   npm run release:rayen
 *   node scripts/release-site.mjs --site hyde --trailer "Co-Authored-By: …"   追加提交说明尾行
 *   node scripts/release-site.mjs --site hyde --keep                           保留检出以便排查
 *   npm run release:rayen -- --root E:/release                              检出建在 E 盘（本机 C 盘满，甲方 09-24）
 *
 * 各站的检查：
 *   hyde   npm run deploy:prep（构建 + 全部导出检查）
 *   rayen  package.json 里有 deploy:prep:rayen 就用它，否则只 npm run build。
 *          雷茵的检查由雷茵那边定 —— 这个脚本不替它决定。
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { OUTPUT_DIR, laneOf } from "./lib/site-lanes.mjs";

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1];
};
const site = opt("--site");
const keep = args.includes("--keep");
const trailers = args.flatMap((a, i) => (a === "--trailer" && args[i + 1] ? [args[i + 1]] : []));

if (!["hyde", "rayen"].includes(site)) {
  console.error("用法：node scripts/release-site.mjs --site hyde|rayen");
  process.exit(2);
}
const OUT = OUTPUT_DIR[site];
const NAME = site === "hyde" ? "HYDE（cantonlock.com）" : "雷茵";
const ROOT = process.cwd();

/** Runs a command and returns its OWN exit status — never a pipe's. */
function run(cmd, cmdArgs, cwd, { capture = false } = {}) {
  const r = spawnSync(cmd, cmdArgs, {
    cwd,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  return { status: r.status ?? 1, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}
function must(label, r) {
  if (r.status !== 0) {
    console.error(`✗ ${label} 失败（退出码 ${r.status}）`);
    if (r.out) console.error(r.out.split("\n").slice(-15).join("\n"));
    throw new Error(label);
  }
  return r;
}

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "-").slice(0, 15);
/*
  检出放哪。默认是仓库里的 tmp/。

  甲方 2026-09-24：「改为 E 盘」。86132 这台的 C 盘满了（发布当天只剩 2.8GB），一份干净检出
  60,197 个文件约 4GB，再加依赖和构建，建到一半就报 No space left on device —— 而且报的是
  git worktree add 失败，看上去像仓库坏了。所以检出位置可以指定：

    npm run release:rayen -- --root E:/release
    RELEASE_ROOT=E:/release npm run release:hyde

  只影响检出建在哪；构建、只提交本站目录、推送、删除检出，全部照旧。
*/
const RELEASE_ROOT = opt("--root") ?? process.env.RELEASE_ROOT ?? "tmp";
const WT = join(RELEASE_ROOT, `release-${site}-${stamp}`);
let ok = false;

try {
  console.log(`→ ${NAME} 发布：拉取 origin/main（大仓库，可能要两三分钟）`);
  must("git fetch", run("git", ["fetch", "origin", "main"], ROOT));
  const base = run("git", ["rev-parse", "--short", "origin/main"], ROOT, { capture: true }).out.trim();

  console.log(`→ 在 ${WT} 建干净检出（${base}）`);
  must("git worktree add", run("git", ["worktree", "add", "--detach", WT, "origin/main"], ROOT));
  if (existsSync(".env.local")) copyFileSync(".env.local", join(WT, ".env.local"));

  console.log("→ 安装依赖（用本机缓存）");
  must("npm ci", run("npm", ["ci", "--prefer-offline", "--no-audit", "--no-fund"], WT));

  // Windows 新检出是 CRLF，这三个生成器的 --check 会误报过期；先各跑一遍（见 AGENTS.md）。
  for (const s of [
    ["scripts/build-product-image-config.mjs"],
    ["scripts/build-branded-editorial-list.mjs", "--write"],
    ["scripts/build-legacy-redirects.mjs"],
  ]) {
    if (existsSync(join(WT, s[0]))) run("node", s, WT, { capture: true });
  }

  const pkg = JSON.parse(readFileSync(join(WT, "package.json"), "utf8"));
  const prep =
    site === "hyde" ? "deploy:prep" : pkg.scripts?.["deploy:prep:rayen"] ? "deploy:prep:rayen" : "build";
  console.log(`→ 构建并检查：npm run ${prep}`);
  must(`npm run ${prep}`, run("npm", ["run", prep], WT));

  console.log(`→ 只暂存 ${OUT}/`);
  must("git add", run("git", ["add", "-A", "--", `${OUT}/`], WT));
  const staged = run("git", ["diff", "--cached", "--name-only"], WT, { capture: true })
    .out.split("\n")
    .filter(Boolean);
  const foreign = staged.filter((p) => laneOf(p) !== site);
  if (foreign.length) throw new Error(`暂存区里出现了 ${OUT}/ 以外的文件：${foreign.slice(0, 3).join(", ")}`);
  if (!staged.length) {
    console.log(`✓ ${OUT}/ 与 ${base} 已发布的版本完全一致，没有要发布的。`);
    ok = true;
  } else {
    const untracked = run("git", ["status", "--short", "--", `${OUT}/`], WT, { capture: true })
      .out.split("\n")
      .filter((l) => l.startsWith("??")).length;
    if (untracked) throw new Error(`${OUT}/ 里还有 ${untracked} 个未跟踪文件没被暂存`);

    const msgFile = join(WT, ".release-message.txt");
    writeFileSync(
      msgFile,
      [
        `发布（${NAME}）：构建 ${base}`,
        "",
        `由 scripts/release-site.mjs --site ${site} 在干净检出中构建，只提交 ${OUT}/（${staged.length} 个文件）。`,
        `源码即 ${base}，不含任何工作区里未提交的改动。另一站的输出目录未提交。`,
        ...(trailers.length ? ["", ...trailers] : []),
        "",
      ].join("\n"),
    );
    must("git commit", run("git", ["commit", "-q", "-F", msgFile], WT));

    for (let attempt = 1; ; attempt++) {
      console.log(`→ 推送（第 ${attempt} 次）`);
      if (run("git", ["push", "origin", "HEAD:main"], WT).status === 0) break;
      if (attempt >= 3) throw new Error("推送三次都被拒");
      console.log("  远端有更新（另一边刚发布过？），rebase 后重试");
      must("git fetch", run("git", ["fetch", "origin", "main"], WT));
      if (run("git", ["rebase", "origin/main"], WT).status !== 0) {
        run("git", ["rebase", "--abort"], WT);
        throw new Error(`rebase 冲突：有人同时改了 ${OUT}/。检出保留在 ${WT}，重新跑一次发布即可`);
      }
    }

    must("git fetch", run("git", ["fetch", "origin", "main"], WT));
    const head = run("git", ["rev-parse", "HEAD"], WT, { capture: true }).out.trim();
    const remote = run("git", ["rev-parse", "origin/main"], WT, { capture: true }).out.trim();
    if (head !== remote) throw new Error(`推送后远端不是本次提交（远端 ${remote.slice(0, 11)}）`);
    console.log(`✓ ${NAME} 已推送 ${head.slice(0, 11)}：${staged.length} 个文件，只在 ${OUT}/ 下。`);
    console.log("  服务器五分钟内拉取。记得 purge。");
    ok = true;
  }
} catch (error) {
  console.error(`✗ ${NAME} 发布中止：${error.message}`);
  process.exitCode = 1;
} finally {
  if (existsSync(WT) && ok && !keep) {
    console.log(`→ 删除检出 ${WT}`);
    run("git", ["worktree", "remove", "--force", WT], ROOT, { capture: true });
    if (existsSync(WT)) rmSync(WT, { recursive: true, force: true });
  } else if (existsSync(WT)) {
    console.log(`  检出保留在 ${WT}，排查完用 git worktree remove --force ${WT} 删除。`);
  }
}
