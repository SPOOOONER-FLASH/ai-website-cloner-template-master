#!/usr/bin/env node
/**
 * Monthly instruction audit + work summary, from the audit rows to a markdown report that
 * scripts/build-client-runbook-docx.mjs turns into Word (client, 2026-09-27:
 * 「把我发布过的所有指令归纳，完成的打勾，没完成的说明原因，整理一个 docx」).
 *
 * Inputs (--in, default tmp/claude-monthly): the audit JSON files written per source —
 *   audit-1-claude.json   client messages in this machine's Claude sessions
 *   audit-2-codex.json    client messages in this machine's Codex sessions
 *   audit-3-tasks.json    task files / goal lists / runbook / AGENTS.md in origin/main
 *                         (this is how the other computer's sessions are covered)
 *   audit-4-updates.json  agent-updates in the period
 *   audit-5-*.json        commit themes, releases, stats
 *   audit-3-goals.json    goals set in the period
 * Row schema: {date, source, area, instruction, status, evidence, note}.
 *
 * The same instruction usually arrives from two or three sources (the chat, the goal list,
 * the agent-update). Rows are merged when their instruction text overlaps enough; the merged
 * row keeps every source and the most advanced status that carries evidence.
 *
 * Outputs: docs/collaboration/reports/<name>.md and <name>.json (the merged rows, committed
 * so the audit can be re-read without the transcripts). Then run the docx script on the md.
 *
 * Run: node scripts/build-monthly-report.mjs --from 2026-08-31 --to 2026-09-28
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : d;
};
const IN = arg("--in", "tmp/claude-monthly");
const FROM = arg("--from", "2026-08-31");
const TO = arg("--to", "2026-09-28");
const NAME = arg("--name", `HYDE-月度工作总结-${FROM}_${TO}`);
const OUTDIR = "docs/collaboration/reports";

const load = (f) => (existsSync(join(IN, f)) ? JSON.parse(readFileSync(join(IN, f), "utf8")) : []);
const SOURCES = [
  ["audit-1-claude.json", "对话·Claude"],
  ["audit-2-codex.json", "对话·Codex"],
  ["audit-3-tasks.json", "仓库·任务清单"],
  ["audit-4-updates.json", "仓库·工作报告"],
  ["audit-5-instructions.json", "仓库·提交记录"],
];

const STATUS = {
  done: { mark: "✓", label: "已完成", rank: 5 },
  partial: { mark: "◐", label: "部分完成", rank: 3 },
  client: { mark: "▲", label: "待甲方操作", rank: 4 },
  waiting: { mark: "…", label: "等待外部", rank: 2 },
  not_done: { mark: "✗", label: "未完成", rank: 1 },
  superseded: { mark: "↺", label: "已改方向", rank: 6 },
};
const AREAS = ["纪律规则", "SEO", "工程", "发布运维", "数据分析", "多语言", "文案", "视觉", "产品数据", "其他", "非网站业务"];

const norm = (s) => (s ?? "").toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
const grams = (s) => {
  const t = norm(s);
  const g = new Set();
  for (let i = 0; i < t.length - 1; i++) g.add(t.slice(i, i + 2));
  return g;
};
const overlap = (a, b) => {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / Math.min(a.size, b.size);
};

const raw = [];
for (const [file, label] of SOURCES) {
  for (const r of load(file)) {
    if (!r?.instruction) continue;
    const status = STATUS[r.status] ? r.status : "not_done";
    raw.push({ ...r, status, area: AREAS.includes(r.area) ? r.area : "其他", sources: [`${label}：${r.source ?? ""}`], g: grams(r.instruction) });
  }
}

// Merge: most-evidenced first, so the surviving text is the verified phrasing.
raw.sort((a, b) => STATUS[b.status].rank - STATUS[a.status].rank || (b.evidence ?? "").length - (a.evidence ?? "").length);
const merged = [];
for (const r of raw) {
  const hit = merged.find((m) => (m.area === r.area || overlap(m.g, r.g) >= 0.8) && overlap(m.g, r.g) >= 0.62);
  if (!hit) {
    merged.push({ ...r });
    continue;
  }
  hit.sources.push(...r.sources);
  if ((r.date ?? "99") < (hit.date ?? "99")) hit.date = r.date;
  if (!hit.evidence && r.evidence) hit.evidence = r.evidence;
  if (!hit.note && r.note) hit.note = r.note;
  // A source that saw the work finished outranks one that saw it open, unless it was dropped.
  if (STATUS[r.status].rank > STATUS[hit.status].rank && r.evidence) {
    hit.status = r.status;
    hit.note = r.note || hit.note;
    hit.evidence = r.evidence || hit.evidence;
  }
}
for (const m of merged) delete m.g;
merged.sort((a, b) => AREAS.indexOf(a.area) - AREAS.indexOf(b.area) || (a.date ?? "").localeCompare(b.date ?? ""));
merged.forEach((m, i) => (m.id = `#${String(i + 1).padStart(3, "0")}`));

const website = merged.filter((m) => m.area !== "非网站业务");
const count = (rows, s) => rows.filter((r) => r.status === s).length;
const cell = (s) => String(s ?? "").replace(/\|/g, "／").replace(/\n+/g, " ").trim() || "—";
const table = (rows, cols) =>
  `| ${cols.map((c) => c[0]).join(" | ")} |\n| ${cols.map(() => "---").join(" | ")} |\n` +
  rows.map((r) => `| ${cols.map((c) => cell(c[1](r))).join(" | ")} |`).join("\n") +
  "\n";

const stats = load("audit-5-stats.json");
const themes = load("audit-5-achievements.json");
const releases = load("audit-5-releases.json");
const goals = load("audit-3-goals.json");

let md = `# HYDE 网站月度工作总结（${FROM} 至 ${TO}）

生成日期：${new Date().toISOString().slice(0, 10)}。由 \`scripts/build-monthly-report.mjs\` 从核查数据生成；改内容请改数据后重跑，不要直接改 Word。

**核查范围和来源**

- 本机全部 Claude Code 与 Codex 会话中甲方亲自发出的消息（\`scripts/extract-client-instructions.mjs\` 提取）。
- 远端仓库 origin/main 里的目标清单、任务文件、客户操作手册、AGENTS.md 纪律条款和每日工作报告（agent-updates）。**86132 那台电脑的会话原文本机读不到**，它的指令和进度通过这些仓库文件覆盖：那边的会话每完成一件事都会写进仓库。
- 本期全部提交记录${stats.total_commits ? `（${stats.total_commits} 个）` : ""}和上线发布记录。
- 雷茵（RAYEN）和惠恩按规定不在本报告范围；报价、展会等非网站事项放在附录。

**状态标记**：✓ 已完成 ◐ 部分完成 ▲ 待甲方操作 … 等待外部（工厂资料 / 其他会话 / 日期） ✗ 未完成 ↺ 已改方向（后来的指令取代了它）

## 一、总览

${table(
  [
    ["网站相关指令（合并去重后）", website.length],
    ["✓ 已完成", count(website, "done")],
    ["◐ 部分完成", count(website, "partial")],
    ["▲ 待甲方操作", count(website, "client")],
    ["… 等待外部", count(website, "waiting")],
    ["✗ 未完成", count(website, "not_done")],
    ["↺ 已改方向", count(website, "superseded")],
    ...(stats.total_commits ? [["本期提交（全部 / HYDE）", `${stats.total_commits} / ${stats.hyde_commits ?? "—"}`]] : []),
    ...(releases.length ? [["正式发布上线次数", releases.length]] : []),
  ],
  [
    ["项目", (r) => r[0]],
    ["数量", (r) => r[1]],
  ],
)}
按类别：

${table(
  AREAS.filter((a) => a !== "非网站业务" && website.some((w) => w.area === a)).map((a) => {
    const rows = website.filter((w) => w.area === a);
    return [a, rows.length, count(rows, "done"), count(rows, "partial") + count(rows, "not_done"), count(rows, "client") + count(rows, "waiting")];
  }),
  [
    ["类别", (r) => r[0]],
    ["指令数", (r) => r[1]],
    ["已完成", (r) => r[2]],
    ["未完成/部分", (r) => r[3]],
    ["待甲方/等待", (r) => r[4]],
  ],
)}`;

if (goals.length) {
  md += `\n## 二、本期设定的目标\n\n${table(goals, [
    ["设定日期", (g) => g.set_on],
    ["目标", (g) => g.goal],
    ["负责", (g) => g.owner],
    ["结果", (g) => g.outcome],
  ])}`;
}

if (themes.length) {
  md += `\n## 三、完成的主要工作\n\n`;
  for (const t of themes) md += `### ${t.theme}（${t.period ?? ""}${t.count ? `，${t.count} 个提交` : ""}）\n\n${t.summary}\n\n`;
}

const open = website.filter((w) => w.status !== "done" && w.status !== "superseded");
md += `\n## 四、未完成与待办（需要关注）\n\n共 ${open.length} 项。按状态分组，每条写明原因。\n`;
for (const s of ["not_done", "partial", "client", "waiting"]) {
  const rows = open.filter((r) => r.status === s);
  if (!rows.length) continue;
  md += `\n### ${STATUS[s].mark} ${STATUS[s].label}（${rows.length}）\n\n${table(rows, [
    ["编号", (r) => r.id],
    ["日期", (r) => r.date],
    ["类别", (r) => r.area],
    ["指令", (r) => r.instruction],
    ["原因 / 下一步", (r) => r.note],
  ])}`;
}

md += `\n## 五、全部指令核查清单（按类别）\n`;
for (const a of AREAS.filter((x) => x !== "非网站业务")) {
  const rows = website.filter((w) => w.area === a);
  if (!rows.length) continue;
  md += `\n### ${a}（${rows.length}）\n\n${table(rows, [
    ["状态", (r) => `${STATUS[r.status].mark} ${STATUS[r.status].label}`],
    ["编号", (r) => r.id],
    ["日期", (r) => r.date],
    ["指令", (r) => r.instruction],
    ["证据 / 说明", (r) => [r.evidence, r.status !== "done" ? r.note : ""].filter(Boolean).join("；")],
  ])}`;
}

if (releases.length) {
  md += `\n## 六、上线发布记录\n\n${table(releases, [
    ["日期", (r) => r.date],
    ["提交", (r) => r.hash],
    ["说明", (r) => r.subject],
  ])}`;
}

const biz = merged.filter((m) => m.area === "非网站业务");
if (biz.length) {
  md += `\n## 附录：非网站业务\n\n${table(biz, [
    ["状态", (r) => `${STATUS[r.status].mark} ${STATUS[r.status].label}`],
    ["日期", (r) => r.date],
    ["事项", (r) => r.instruction],
    ["说明", (r) => [r.evidence, r.note].filter(Boolean).join("；")],
  ])}`;
}

mkdirSync(OUTDIR, { recursive: true });
writeFileSync(join(OUTDIR, `${NAME}.md`), md);
writeFileSync(join(OUTDIR, `${NAME}.json`), JSON.stringify(merged, null, 1) + "\n");
console.log(`${raw.length} rows → ${merged.length} merged (${website.length} website, ${biz.length} other)`);
for (const s of Object.keys(STATUS)) console.log(`  ${STATUS[s].mark} ${STATUS[s].label}: ${count(website, s)}`);
console.log(`→ ${join(OUTDIR, NAME)}.md / .json`);
