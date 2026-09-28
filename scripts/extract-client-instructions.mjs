#!/usr/bin/env node
/**
 * Every message the client typed, from every local Claude Code and Codex session transcript,
 * for one month. The raw material for the monthly instruction audit (client, 2026-09-27:
 * 「核查我9月这一个月发布的所有指令……全部对话 chats」).
 *
 * Kept as a generator rather than a one-off paste, so the audit can be re-derived: the
 * transcripts are the source, this is the lens.
 *
 * What is dropped: tool results, system reminders, compaction summaries, slash-command
 * wrappers, cross-session messages from other agents, and task notifications — none of those
 * are the client speaking. Pasted blocks are kept, since the client pastes briefs.
 *
 * Only this machine's transcripts are reachable. Sessions run on the other computer (86132)
 * or in the cloud are not here; the audit says so rather than implying full coverage.
 *
 * Run: node scripts/extract-client-instructions.mjs --month 2026-09 --out tmp/claude-monthly
 */
import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { homedir } from "node:os";
import { join } from "node:path";

const arg = (n, d) => {
  const i = process.argv.indexOf(n);
  return i > -1 ? process.argv[i + 1] : d;
};
const MONTH = arg("--month", "2026-09");
/* --from/--to (inclusive dates) override --month; client 09-27: the period is 08-31 to 09-28. */
const FROM = arg("--from", `${MONTH}-01`);
const TO = arg("--to", `${MONTH}-31`);
const inRange = (ts) => !!ts && ts.slice(0, 10) >= FROM && ts.slice(0, 10) <= TO;
const OUT = arg("--out", "tmp/claude-monthly");
const CLAUDE_DIR = join(homedir(), ".claude", "projects");
const CODEX_DIR = join(homedir(), ".codex", "sessions");

const NOISE = [
  /^<(system-reminder|command-name|command-message|local-command|task-notification|cross-session-message|user-prompt-submit-hook)/,
  /^This session is being continued from a previous conversation/,
  /^\[Request interrupted/,
  /^Caveat: The messages below were generated/,
  /^<environment_context>|^<user_instructions>|^# AGENTS\.md instructions/,
];
const clean = (s) =>
  s
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/<(cross-session-message|task-notification)[\s\S]*?<\/\1>/g, "")
    .replace(/\[Image: source: [^\]]+\]/g, "[图片]")
    .trim();

function walk(dir, pred, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(e.name)) out.push(p);
  }
  return out;
}

/* Streamed: the longest transcript here is past 600 MB, beyond what one string can hold. */
async function* lines(file) {
  for await (const line of createInterface({ input: createReadStream(file, "utf8"), crlfDelay: Infinity })) yield line;
}

const rows = [];
const titles = new Map();

for (const file of walk(CLAUDE_DIR, (n) => n.endsWith(".jsonl"))) {
  const project = file.split(/[\\/]/).at(-2);
  for await (const line of lines(file)) {
    if (!line) continue;
    let j;
    try { j = JSON.parse(line); } catch { continue; }
    if (j.type === "custom-title" || j.type === "ai-title") {
      if (!titles.has(j.sessionId) || j.type === "custom-title") titles.set(j.sessionId, j.customTitle ?? j.aiTitle);
      continue;
    }
    if (j.type !== "user" || j.isMeta || j.isCompactSummary || !inRange(j.timestamp)) continue;
    const c = j.message?.content;
    const text = typeof c === "string" ? c : Array.isArray(c) ? c.filter((p) => p.type === "text").map((p) => p.text).join("\n") : "";
    const t = clean(text);
    if (!t || NOISE.some((r) => r.test(t))) continue;
    rows.push({ tool: "Claude", project, session: j.sessionId, time: j.timestamp, text: t });
  }
}

for (const file of walk(CODEX_DIR, (n) => n.endsWith(".jsonl"))) {
  if (statSync(file).mtime < new Date(FROM)) continue;
  let session = file.split(/[\\/]/).at(-1).replace(/\.jsonl$/, "");
  for await (const line of lines(file)) {
    if (!line) continue;
    let j;
    try { j = JSON.parse(line); } catch { continue; }
    const p = j.payload ?? {};
    if (j.type === "session_meta" && p.id) session = p.id;
    const time = j.timestamp ?? "";
    if (!inRange(time)) continue;
    let text = "";
    // Codex desktop logs what the person typed as item_completed → UserMessage; the
    // response_item "user" messages also carry injected context, so they are not used.
    if (j.type === "event_msg" && p.type === "item_completed" && p.item?.type === "UserMessage") {
      text = (p.item.content ?? []).filter((c) => c.type === "text").map((c) => c.text).join("\n");
    } else if (j.type === "event_msg" && p.type === "user_message") text = p.message ?? "";
    else continue;
    const t = clean(text);
    if (!t || NOISE.some((r) => r.test(t))) continue;
    rows.push({ tool: "Codex", project: "codex", session, time, text: t });
  }
}

rows.sort((a, b) => a.time.localeCompare(b.time));
// The same message can be logged twice (resume, fork). Keep the first.
const seen = new Set();
const unique = rows.filter((r) => {
  const k = `${r.time.slice(0, 16)}|${r.text.slice(0, 200)}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `client-messages-${FROM}_${TO}.json`), JSON.stringify(unique.map((r) => ({ ...r, title: titles.get(r.session) ?? "" })), null, 1));
const bySession = new Map();
for (const r of unique) {
  const k = `${r.tool} · ${titles.get(r.session) ?? r.session}`;
  if (!bySession.has(k)) bySession.set(k, []);
  bySession.get(k).push(r);
}
let md = `# ${FROM} 至 ${TO} 甲方消息原文（本机会话记录）\n\n共 ${unique.length} 条，${bySession.size} 个会话。\n`;
for (const [k, list] of bySession) {
  md += `\n## ${k}（${list.length} 条）\n`;
  for (const r of list) md += `\n- **${r.time.slice(5, 16).replace("T", " ")}** ${r.text.replace(/\n+/g, " ⏎ ").slice(0, 1500)}\n`;
}
writeFileSync(join(OUT, `client-messages-${FROM}_${TO}.md`), md);
console.log(`${unique.length} client messages from ${bySession.size} sessions → ${OUT}`);
for (const [k, list] of bySession) console.log(`  ${String(list.length).padStart(4)}  ${k}`);
