#!/usr/bin/env node
/**
 * 上线日志：docs/collaboration/上线日志-RELEASES.md —— 每次 HYDE 发布一个版本号，记录这一版带上线了哪些改动。
 *
 * 甲方 2026-10-13：「以后出一个 hot fix 或者 update 日志 放到 hyde 你命名版本号，记录每次上线什么 有跟踪」。
 *
 * 和 SHIPLOG 的区别：SHIPLOG 记每一次推送（源码推上去不等于上线）；这里只记真正上线的发布，
 * 每版列出「上一版构建的源码 → 这一版构建的源码」之间的全部改动。全部来自 git 历史，所以不会漏记、
 * 也不会记一次没发生的发布。版本号规则在 scripts/lib/release-version.mjs，发布脚本用同一套规则
 * 把版本号写进发布提交和线上 /release.json，线上是哪一版随时可查。
 *
 *   node scripts/build-release-log.mjs           写 markdown
 *   node scripts/build-release-log.mjs --docx    另导出 Word 到 Desktop\hyde
 *   node scripts/build-release-log.mjs --check   过期则退出 1
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { RELEASE_SUBJECT, assignVersions, releaseDate, releaseType, RELEASE_TZ } from "./lib/release-version.mjs";

const OUT = "docs/collaboration/上线日志-RELEASES.md";
const SINCE = "2026-09-20";
const DAYS = 30;
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

/* Every release commit reachable from HEAD, oldest first. Not --first-parent: ship.mjs merges, so a
   release pushed by the release checkout can sit on a second parent. */
const releases = assignVersions(
  git("log", `--since=${SINCE}`, "--reverse", "--date-order", "--format=%H%x09%cI%x09%s", "HEAD")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, when, subject] = line.split("\t");
      return { sha, when, subject };
    })
    .filter((r) => RELEASE_SUBJECT.test(r.subject))
    .map((r) => ({ ...r, build: /构建\s+([0-9a-f]{7,40})/.exec(r.subject)?.[1] })),
);

const NOISE = /^(shiplog[:：]|发布（|Merge )/;
/* Docs-only commits (goal rows, agent-updates, reports) change nothing on the site: counted, not listed. */
const SITE = [".", ":(exclude)docs", ":(exclude)AGENTS.md", ":(exclude)HANDOFF.md"];
const commitsBetween = (from, to, paths = []) =>
  git("log", "--no-merges", "--format=%h%x09%s", `${from}..${to}`, "--", ...paths)
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split("\t"))
    .filter(([, s]) => !NOISE.test(s))
    .map(([sha, subject]) => ({ sha, subject }));
const changesBetween = (from, to) => {
  try {
    const site = commitsBetween(from, to, SITE);
    return { site, docs: commitsBetween(from, to).length - site.length };
  } catch {
    return null; // a build commit that is not in this clone's history
  }
};

const cutoff = Date.now() - DAYS * 86400e3;
const rows = [];
for (let i = releases.length - 1; i >= 0; i--) {
  const r = releases[i];
  if (Date.parse(r.when) < cutoff) break;
  const prev = releases[i - 1];
  const changes = prev?.build && r.build ? changesBetween(prev.build, r.build) : null;
  rows.push({ ...r, changes, type: changes ? releaseType(changes.site.map((c) => c.subject)) : "—" });
}

const time = (iso) => new Date(iso).toLocaleString("zh-CN", { timeZone: RELEASE_TZ, hour12: false, month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
const lines = [
  "# HYDE 上线日志（cantonlock.com）",
  "",
  "> 自动生成：`node scripts/build-release-log.mjs`（每次 `npm run ship` 也会更新）。不要手改。",
  "",
  "每一版 = 一次真正上线的发布。版本号 `v年.月.日.当天第几版`；**Hotfix** = 这一版只带修复，**Update** = 带新内容或改版。",
  "「改动」是上一版之后、这一版构建时进入主线的全部源码提交。",
  "",
  "**线上现在是哪一版**：打开 https://cantonlock.com/release.json （看 `version`）。服务器在发布后 5 分钟内拉取；Cloudflare purge 之前，不带参数的页面可能还是旧版。",
  "",
  `最近 ${DAYS} 天共 ${rows.length} 版。`,
  "",
];
let day = "";
for (const r of rows) {
  const d = releaseDate(r.when);
  if (d !== day) {
    day = d;
    lines.push(`## ${d}`, "");
  }
  lines.push(`### ${r.version} · ${r.type} · ${time(r.when)}`, "");
  lines.push(`发布提交 \`${r.sha.slice(0, 12)}\`，构建源码 \`${r.build ?? "?"}\``, "");
  if (!r.changes) lines.push("- （第一版或源码不在本仓库历史中，改动未列出）");
  else if (!r.changes.site.length) lines.push("- 网站内容无改动（重新构建）");
  else for (const c of r.changes.site) lines.push(`- ${c.subject} \`${c.sha}\``);
  if (r.changes?.docs) lines.push(`- （另有 ${r.changes.docs} 个只改文档的提交，未列出）`);
  lines.push("");
}
const text = lines.join("\n");

if (process.argv.includes("--check")) {
  const now = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (now !== text) {
    console.error(`${OUT} 过期：运行 node scripts/build-release-log.mjs`);
    process.exit(1);
  }
  process.exit(0);
}
writeFileSync(OUT, text);
console.log(`✓ ${OUT}：${rows.length} 版（最新 ${rows[0]?.version ?? "无"}）`);
if (process.argv.includes("--docx")) {
  execFileSync("node", ["scripts/build-client-runbook-docx.mjs", "--src", OUT], { stdio: "inherit" });
}
