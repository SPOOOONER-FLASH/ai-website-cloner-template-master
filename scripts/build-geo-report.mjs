#!/usr/bin/env node
/**
 * Desktop Word copy of the 2026-09-28 GEO learnings report, with its two appendices inlined.
 *
 * The markdown files stay the authority (they are what the next session reads); the Word file
 * is an export for the client, the same arrangement as CLIENT-RUNBOOK.md → .docx. This joins
 * the report and its appendices into one markdown file in tmp/ and hands it to the runbook
 * renderer, which writes <Desktop>\hyde\GEO-学习与进展-2026-09-28.docx.
 *
 *   node scripts/build-geo-report.mjs [--out <dir>]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n");
const demote = (md) => md.replace(/^(#{1,5}) /gm, "#$1 ");

let report = read("docs/collaboration/reports/2026-09-28-geo-learnings.md");
report = report
  .replace(/## 附录一：LinkedIn 起步稿\n\n[^\n]*\n/, `## 附录一：LinkedIn 起步稿\n\n${demote(read("docs/copy/linkedin-starter.md"))}\n`)
  .replace(/## 附录二：零品牌词题库\n\n[^\n]*\n/, () => {
    const queries = JSON.parse(read("docs/geo/baseline-queries.json")).queries;
    const table = queries.map((q) => `| ${q.id} | ${q.lang} | ${q.intent} | ${q.q} |`).join("\n");
    return `## 附录二：零品牌词题库\n\n${demote(read("docs/geo/README.md"))}\n\n### ${queries.length} 道问题\n\n| id | 语言 | 意图 | 问题 |\n|---|---|---|---|\n${table}\n`;
  });

mkdirSync("tmp/geo-report", { recursive: true });
const src = "tmp/geo-report/GEO-学习与进展-2026-09-28.md";
writeFileSync(src, report);

const outIdx = process.argv.indexOf("--out");
const args = ["scripts/build-client-runbook-docx.mjs", "--src", src, ...(outIdx !== -1 ? ["--out", process.argv[outIdx + 1]] : [])];
const r = spawnSync(process.execPath, args, { stdio: "inherit" });
process.exit(r.status ?? 1);
