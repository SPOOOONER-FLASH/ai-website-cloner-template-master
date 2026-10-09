#!/usr/bin/env node
/*
 * Files the client's Desktop\hyde into the folders defined in scripts/lib/desktop-hyde.mjs,
 * and regenerates the three documents that make the folder a working archive:
 *
 *   00 目录说明      what each folder holds
 *   00 人工代做清单  every 「现在要做的」 section of CLIENT-RUNBOOK.md, newest first
 *   01 待做计划      every row of the engineering goal list that is not finished
 *
 * Moves only, never deletes (Word's own ~$ lock files excepted, and only when Word is not
 * running). Every move is appended to 09-旧资料归档\移动记录.md so nothing is lost. A
 * hand-off document (手动操作) the runbook no longer points to is finished: it goes to
 * 09-旧资料归档\已完成的人工操作. Raw exports archived in the repo
 * (docs/research/analytics/<date>/raw) are copied into 04 by date.
 *
 *   node scripts/organize-desktop-hyde.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { DESKTOP_HYDE, FOLDERS, exportDate, folderFor } from "./lib/desktop-hyde.mjs";

const DRY = process.argv.includes("--dry");
const ROOT = DESKTOP_HYDE;
const log = [];
const today = new Date().toISOString().slice(0, 10);

function move(from, toDir, newName) {
  const name = newName ?? path.basename(from);
  let to = path.join(ROOT, toDir, name);
  if (path.resolve(from) === path.resolve(to)) return;
  if (fs.existsSync(to)) {
    const ext = path.extname(name);
    to = path.join(ROOT, toDir, `${path.basename(name, ext)} (${today})${ext}`);
  }
  log.push(`| ${path.relative(ROOT, from)} | ${path.relative(ROOT, to)} |`);
  if (DRY) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.renameSync(from, to);
}

const runbook = fs.readFileSync("docs/collaboration/CLIENT-RUNBOOK.md", "utf8");
const stillAsked = (name) => runbook.includes(name.replace(/^\d{4}-\d\d-\d\d-/, ""));

// 1. Loose files at the top level and in the old 「9.30 新研究方向」 drop folder.
const wordRunning = (() => {
  try {
    return execSync('tasklist /FI "IMAGENAME eq WINWORD.EXE"', { encoding: "utf8" }).includes("WINWORD");
  } catch {
    return true; // unsure: keep the lock files
  }
})();
const loose = [ROOT, path.join(ROOT, "9.30 新研究方向")]
  .filter((d) => fs.existsSync(d))
  .flatMap((d) => fs.readdirSync(d, { withFileTypes: true }).filter((e) => e.isFile()).map((e) => path.join(d, e.name)));
for (const file of loose) {
  const name = path.basename(file);
  if (name.startsWith("~$")) {
    if (!wordRunning && !DRY) fs.rmSync(file);
    continue;
  }
  if (path.dirname(file) !== ROOT && name === "CLIENT-RUNBOOK.docx") {
    move(file, FOLDERS.archive, "CLIENT-RUNBOOK-0930旧版.docx"); // a stale copy
    continue;
  }
  if (/\.zip$/i.test(name) && !/cantonlock\.com/i.test(name)) {
    move(file, FOLDERS.archive);
    continue;
  }
  if (/手动操作/.test(name) && !stillAsked(name)) {
    move(file, path.join(FOLDERS.archive, "已完成的人工操作"));
    continue;
  }
  const folder = folderFor(name);
  move(file, folder === FOLDERS.data ? path.join(folder, exportDate(name) ?? "未标日期") : folder);
}

// 2. Old sub-folders.
const sub = (n) => path.join(ROOT, n);
const relocate = { "9月资料": FOLDERS.archive, "clarity-topics": FOLDERS.research, "fsb-reference": FOLDERS.research, 报价: FOLDERS.sales };
for (const [dir, to] of Object.entries(relocate)) if (fs.existsSync(sub(dir))) move(sub(dir), to);
if (fs.existsSync(sub("seo"))) {
  for (const name of fs.readdirSync(sub("seo"))) {
    const folder = folderFor(name);
    move(path.join(sub("seo"), name), folder === FOLDERS.data ? path.join(folder, exportDate(name) ?? "未标日期") : folder);
  }
  if (!DRY && fs.readdirSync(sub("seo")).length === 0) fs.rmdirSync(sub("seo"));
}
const drop = sub("9.30 新研究方向");
if (!DRY && fs.existsSync(drop) && fs.readdirSync(drop).length === 0) fs.rmdirSync(drop);

// 3. Raw exports archived in the repo → 04 by date (copies; the repo stays the source).
const analytics = "docs/research/analytics";
for (const date of fs.readdirSync(analytics).filter((d) => /^\d{4}-\d\d-\d\d$/.test(d))) {
  const raw = path.join(analytics, date, "raw");
  if (!fs.existsSync(raw)) continue;
  const to = path.join(ROOT, FOLDERS.data, date);
  for (const name of fs.readdirSync(raw)) {
    const dest = path.join(to, name);
    if (fs.existsSync(dest) || !fs.statSync(path.join(raw, name)).isFile()) continue;
    if (!DRY) {
      fs.mkdirSync(to, { recursive: true });
      fs.copyFileSync(path.join(raw, name), dest);
    }
  }
}

// 4. The three working documents, generated from the repo's authorities.
const OUT = "docs/collaboration/desktop";
fs.mkdirSync(OUT, { recursive: true });

const sections = [...runbook.matchAll(/^## (现在要做的[^\n]*)\n([\s\S]*?)(?=^## |\n?$(?![\s\S]))/gm)].map((m) => ({
  title: m[1].replace(/^现在要做的/, "").replace(/^[：:]/, ""),
  first: m[2].split(/\n\s*\n/).map((p) => p.trim()).find((p) => p && !p.startsWith("---")) ?? "",
}));
const manual = [
  "# HYDE 人工代做清单",
  "",
  `生成：\`node scripts/organize-desktop-hyde.mjs\`，来源是操作手册（CLIENT-RUNBOOK）里每一节「现在要做的」，${today} 更新。做完一件告诉我，我从手册里移走，下次生成就不在这里了。`,
  "",
  "| # | 事项 | 第一步 |",
  "|---|---|---|",
  ...sections.map((s, i) => `| ${i + 1} | ${s.title.replace(/\|/g, "／")} | ${s.first.replace(/\n/g, " ").replace(/\|/g, "／").slice(0, 160)} |`),
  "",
  "详细步骤在同一个文件夹的 CLIENT-RUNBOOK.docx，以及各份「手动操作」Word。",
  "",
].join("\n");
fs.writeFileSync(path.join(OUT, "HYDE-人工代做清单.md"), manual);

const goal = fs.readFileSync("docs/collaboration/tasks/2026-09-24-hyde-engineering-goal.md", "utf8");
const open = goal
  .split(/\r?\n/)
  .filter((l) => /^\| \d+ \|/.test(l))
  .map((l) => l.split(/(?<!\\)\|/).map((c) => c.trim())) // cells may hold an escaped \|
  .map(([, n, what, status]) => ({ n, what, status }))
  // Finished rows start with their date ("09-25 实测…", "10-09 完成…") or say it was settled.
  .filter((r) => !/^\d\d-\d\d|^已改|^已在/.test(r.status) && !/完成/.test(r.status.slice(0, 12)));
const group = (re) => open.filter((r) => re.test(r.status));
const buckets = [
  ["等你（甲方）", /^待甲方/],
  ["等别的会话或日期", /^(等待|待文案|待视觉|待发布)/],
  ["我在做 / 做了一部分", /^(部分|待做|进行)/],
];
const used = new Set();
const plan = ["# HYDE 待做计划", "", `生成：\`node scripts/organize-desktop-hyde.mjs\`，来源是工程目标清单（docs/collaboration/tasks/2026-09-24-hyde-engineering-goal.md），${today} 更新。只列没完成的。`, ""];
for (const [title, re] of buckets) {
  const rows = group(re).filter((r) => !used.has(r.n));
  rows.forEach((r) => used.add(r.n));
  plan.push(`## ${title}（${rows.length}）`, "", "| # | 事项 | 现状 |", "|---|---|---|");
  plan.push(...rows.map((r) => `| ${r.n} | ${r.what.slice(0, 140)} | ${r.status.slice(0, 160)} |`), "");
}
const rest = open.filter((r) => !used.has(r.n));
if (rest.length) {
  plan.push(`## 其他未完成（${rest.length}）`, "", "| # | 事项 | 现状 |", "|---|---|---|");
  plan.push(...rest.map((r) => `| ${r.n} | ${r.what.slice(0, 140)} | ${r.status.slice(0, 160)} |`), "");
}
fs.writeFileSync(path.join(OUT, "HYDE-待做计划.md"), plan.join("\n"));

const readme = [
  "# HYDE 桌面文件夹目录说明",
  "",
  `生成：\`node scripts/organize-desktop-hyde.mjs\`，${today} 更新。以后新出的 Word 会自动放进对应文件夹。`,
  "",
  "| 文件夹 | 放什么 | 你什么时候看 |",
  "|---|---|---|",
  `| ${FOLDERS.todo} | 人工代做清单、操作手册、正在等你做的「手动操作」Word | **每次先看这里** |`,
  `| ${FOLDERS.plan} | 待做计划（工程目标里没完成的事）、旧的 TODO 总表 | 想知道还剩什么没做 |`,
  `| ${FOLDERS.reports} | 周报、月度总结、数据结论、长尾词报告、审计报告 | 看结果和趋势 |`,
  `| ${FOLDERS.research} | 研究、方案、评估、Clarity 话题、参考图、LinkedIn 文案 | 需要背景时 |`,
  `| ${FOLDERS.data} | GSC、Bing 等后台导出的原始数据，按导出日期一个文件夹 | 本地数据库：周环比、同比都从这里算 |`,
  `| ${FOLDERS.sales} | 产品目录 PDF、报价单 | 发客户时 |`,
  `| ${FOLDERS.archive} | 9 月旧资料、做完的人工操作、旧版手册、移动记录 | 一般不用看 |`,
  "",
  "## 以后导出的数据放哪",
  "",
  `从 Search Console、Bing 下载的文件照常发我。我存进仓库，并按日期复制到「${FOLDERS.data}\\日期」，两边都有。`,
  "",
].join("\n");
fs.writeFileSync(path.join(OUT, "HYDE-目录说明.md"), readme);

if (!DRY) {
  for (const md of ["HYDE-目录说明.md", "HYDE-人工代做清单.md", "HYDE-待做计划.md"]) {
    execFileSync(process.execPath, ["scripts/build-client-runbook-docx.mjs", "--src", path.join(OUT, md)], { stdio: "inherit" });
  }
  execFileSync(process.execPath, ["scripts/build-client-runbook-docx.mjs"], { stdio: "inherit" });
  if (log.length) {
    const record = path.join(ROOT, FOLDERS.archive, "移动记录.md");
    fs.mkdirSync(path.dirname(record), { recursive: true });
    const head = fs.existsSync(record) ? "" : "# 桌面 hyde 文件移动记录\n\n只移动、不删除。找不到某个文件时按原位置查这里。\n";
    fs.appendFileSync(record, `${head}\n## ${today}\n\n| 原位置 | 新位置 |\n|---|---|\n${log.join("\n")}\n`);
  }
}
console.log(`${DRY ? "[dry] " : ""}${log.length} moves; ${sections.length} manual tasks; ${open.length} open goal rows`);
if (DRY) console.log(log.join("\n"));
