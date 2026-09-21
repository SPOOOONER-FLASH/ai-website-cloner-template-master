/**
 * Clarity's Topic insights dialog rejects any prompt over 500 characters, and it does it
 * one prompt at a time, after you have already pasted it. A set written without checking
 * therefore costs a paste-reject-edit-repaste cycle per prompt, fifteen times per topic.
 *
 * This validates every prompt, prints the length table, and can write one ready-to-use
 * document per topic. Sources are every docs/research/clarity-topic-prompts*.json.
 *
 * Usage:
 *   node scripts/check-clarity-prompts.mjs                     length table, exits 1 if any prompt is too long
 *   node scripts/check-clarity-prompts.mjs --print "standards" that topic's prompts, one per line, to paste
 *   node scripts/check-clarity-prompts.mjs --docs <directory>  one .md per topic, written into that directory
 *
 * The documents are generated, never hand-edited: the prompts live in the JSON, and a
 * document written by hand goes stale the moment a prompt changes and nobody can tell.
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LIMIT = 500;
const SOURCE_DIR = "docs/research";

const args = process.argv.slice(2);
const flagValue = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? (args[i + 1] ?? "") : null;
};
const printFilter = flagValue("--print")?.toLowerCase() ?? null;
const docsDir = flagValue("--docs");

const files = readdirSync(SOURCE_DIR)
  .filter((f) => /^clarity-topic-prompts.*\.json$/.test(f))
  .sort();

const topics = [];
for (const file of files) {
  const data = JSON.parse(readFileSync(join(SOURCE_DIR, file), "utf8"));
  for (const topic of data.topics) topics.push({ ...topic, file });
}

/* ---------------------------------------------------------------- --docs */

const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

if (docsDir !== null) {
  mkdirSync(docsDir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  for (const [i, topic] of topics.entries()) {
    const lines = [
      `# ${topic.title}`,
      "",
      `Clarity → AI Visibility → Topic insights → **+ Add topic**`,
      "",
      `生成于 ${today} · 由 \`node scripts/check-clarity-prompts.mjs --docs <目录>\` 产出，不要手改这个文件`,
      `来源：\`docs/research/${topic.file}\``,
      "",
      "## 怎么用",
      "",
      "1. Clarity → AI Visibility → Topic insights → 右上角 **+ Add topic**",
      `2. Title 填：\`${topic.title}\``,
      "3. 下面 15 条逐条粘进 User prompts，每条粘完点 **Add**",
      "4. 全部加完点 **Generate report**",
      "",
      "每周配额 10 份。全部 15 条都在 500 字符以内，粘贴不会被拒。",
      "",
    ];

    if (topic.why) lines.push("## 为什么选这个题", "", topic.why, "");
    if (topic.backedBy?.length) {
      lines.push(
        "## 站上哪些文章在回答它",
        "",
        ...topic.backedBy.map((s) => `- \`/news/${s}/\``),
        "",
        "报告跑完之后，对照 **Your top content to AI responses** 面板：",
        "上面这些文章出现在里面，说明选题和内容对上了；一个都没出现，",
        "先看那 15 条 prompt 是不是根本没问到这些题，再去怀疑文章写得不好。",
        "",
      );
    }

    lines.push(`## 15 条 prompt`, "");
    topic.prompts.forEach((p, n) => {
      lines.push(`### ${n + 1}　（${p.length} 字符）`, "", "```", p, "```", "");
    });

    const name = `${String(i + 1).padStart(2, "0")}-${slug(topic.title)}.md`;
    writeFileSync(join(docsDir, name), lines.join("\n"));
    console.log(`${name}  ${topic.prompts.length} 条`);
  }

  const index = [
    "# Clarity Topic insights — 全部选题",
    "",
    `生成于 ${today}。每份文件是一个主题，照着里面的步骤粘进 Clarity 即可。`,
    "",
    "| # | 主题 | 条数 | 文件 |",
    "|---|---|---|---|",
    ...topics.map(
      (t, i) =>
        `| ${i + 1} | ${t.title} | ${t.prompts.length} | \`${String(i + 1).padStart(2, "0")}-${slug(t.title)}.md\` |`,
    ),
    "",
    "⚠ 每周只有 10 份报告配额。已经跑过的不要重复生成。",
    "",
  ].join("\n");
  writeFileSync(join(docsDir, "README.md"), index);
  console.log(`README.md`);
  console.log(`\n${topics.length} 个主题写入 ${docsDir}`);
  process.exit(0);
}

/* ------------------------------------------------------------- --print */

if (printFilter !== null) {
  for (const topic of topics) {
    if (!topic.title.toLowerCase().includes(printFilter)) continue;
    console.log(`# ${topic.title}\n`);
    for (const prompt of topic.prompts) console.log(`${prompt}\n`);
  }
  process.exit(0);
}

/* -------------------------------------------------------------- default */

let over = 0;
for (const topic of topics) {
  console.log(`\n${topic.title} — ${topic.prompts.length} prompts  (${topic.file})`);
  topic.prompts.forEach((prompt, i) => {
    const n = prompt.length;
    if (n > LIMIT) over += 1;
    console.log(
      `  ${String(i + 1).padStart(2)}  ${String(n).padStart(3)}  ${n > LIMIT ? "OVER" : "ok  "}  ${prompt.slice(0, 54)}…`,
    );
  });
  const lengths = topic.prompts.map((p) => p.length).sort((a, b) => a - b);
  console.log(
    `      min ${lengths[0]} · median ${lengths[Math.floor(lengths.length / 2)]} · max ${lengths[lengths.length - 1]}`,
  );
}

if (over) {
  console.error(`\n${over} prompt(s) exceed ${LIMIT} characters — Clarity will reject them.`);
  process.exit(1);
}
console.log(`\n${topics.length} 个主题、${topics.reduce((n, t) => n + t.prompts.length, 0)} 条 prompt，全部在 ${LIMIT} 字符以内。`);
