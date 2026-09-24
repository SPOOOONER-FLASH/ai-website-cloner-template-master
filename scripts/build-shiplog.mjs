#!/usr/bin/env node
/**
 * 上线存档：docs/collaboration/SHIPLOG.md —— 每次推送自动更新（由 scripts/ship.mjs 调用）。
 *
 * 甲方 2026-09-23：「永远 push 一个立即写进一个文档，上线存档，方便我换电脑工作。」
 *
 * 为什么是生成的、不是手写的：手写的日志在最忙的时候最先被跳过，而那正是最需要它的时候。
 * 这里的每一行都来自 git 历史本身，所以它不可能漏记一次推送，也不可能记一次没发生的推送。
 * 它随仓库推上 GitHub，换一台电脑打开网页就能看到。
 *
 * 每一行：时间、属于哪一边（HYDE / 雷茵 / 发布 / 中立，按改动的文件判断）、做了什么、提交号。
 * 只列最近 30 天；更早的看 git log。
 *
 *   node scripts/build-shiplog.mjs          写文件
 *   node scripts/build-shiplog.mjs --check  过期则退出 1
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const OUT = "docs/collaboration/SHIPLOG.md";
const DAYS = 30;
const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });

const SEP = "\u001e";
const since = `--since=${DAYS}.days`;
const shasTouching = (...paths) =>
  new Set(git("log", "--first-parent", since, "--format=%H", "HEAD", "--", ...paths).split("\n").filter(Boolean));
// Pathspecs mirror scripts/lib/site-lanes.mjs; kept coarse on purpose — this only labels rows.
const touchesOut = shasTouching("out/");
const touchesOutRayen = shasTouching("out-rayen/");
const touchesSource = shasTouching(".", ":(exclude)out", ":(exclude)out-rayen");
const touchesRayenSrc = shasTouching("content/rayen", "src/app/zh", "src/app/zh-en", "src/components/rayen", "public/images/products-rayen", "public/images/products-rayen-en", "public/images/rayen", ":(glob)src/**/rayen*", ":(glob)scripts/**/*rayen*");
const touchesHydeSrc = shasTouching("content/news", "content/guides", "src/app/(en)", "src/app/es", "src/app/pt", "public/images/products-hyde", "public/search-index.json");

const raw = git("log", "--first-parent", since, "--format=%x1e%H%x09%ad%x09%s", "--date=format:%Y-%m-%d %H:%M", "HEAD");
const rows = [];
for (const block of raw.split(SEP).slice(1)) {
  const [sha, when, subject = "（提交说明为空）"] = block.trim().split("\t");
  if (/^shiplog[:：]/i.test(subject)) continue;
  const outs = [touchesOut.has(sha) && "HYDE", touchesOutRayen.has(sha) && "雷茵"].filter(Boolean);
  const src = [touchesHydeSrc.has(sha) && "HYDE", touchesRayenSrc.has(sha) && "雷茵"].filter(Boolean);
  const lane = !touchesSource.has(sha) && outs.length
    ? `发布 ${outs.join("+")}`
    : src.length
      ? src.join("+") + (outs.length ? ` · 发布 ${outs.join("+")}` : "")
      : outs.length
        ? `中立 · 发布 ${outs.join("+")}`
        : "中立";
  rows.push({ sha: sha.slice(0, 11), when, subject, lane });
}

const byDay = new Map();
for (const r of rows) {
  const day = r.when.slice(0, 10);
  if (!byDay.has(day)) byDay.set(day, []);
  byDay.get(day).push(r);
}

const esc = (s) => s.replace(/\|/g, "\\|");
const lines = [
  "# 上线存档",
  "",
  "**自动生成，不要手改。** 每次推送由 `npm run ship` / `npm run release:hyde` 重新生成。",
  "来源是 git 历史本身 —— 不会漏记，也不会记没发生的事。换电脑时在 GitHub 上打开这个文件即可。",
  "",
  "「推送」不等于「已上线」：服务器每 5 分钟拉一次；源码提交要等下一次「发布」提交才出现在网站上。",
  "推送失败、还没上去的，记在 [PUSH-PENDING.md](PUSH-PENDING.md)。",
  "",
  `最近 ${DAYS} 天 · 共 ${rows.length} 次提交`,
  "",
];
for (const [day, list] of byDay) {
  lines.push(`## ${day}`, "", "| 时间 | 哪一边 | 做了什么 | 提交 |", "|---|---|---|---|");
  for (const r of list) lines.push(`| ${r.when.slice(11)} | ${r.lane} | ${esc(r.subject)} | \`${r.sha}\` |`);
  lines.push("");
}
const text = `${lines.join("\n")}\n`;

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== text) {
    console.error(`${OUT} 过期 —— 跑 node scripts/build-shiplog.mjs`);
    process.exit(1);
  }
  process.exit(0);
}
writeFileSync(OUT, text);
console.log(`${OUT}：${rows.length} 次提交，${byDay.size} 天`);
