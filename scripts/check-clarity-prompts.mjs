/**
 * Clarity's Topic insights dialog rejects any prompt over 500 characters, and it does it
 * one prompt at a time, after you have already pasted it. A set written without checking
 * therefore costs a paste-reject-edit-repaste cycle per prompt, fifteen times per topic.
 *
 * This prints every prompt with its length and exits non-zero if any exceeds the limit,
 * so the set is known-good before the first paste. Re-run after editing the JSON.
 *
 * Usage:  node scripts/check-clarity-prompts.mjs [--print <topic substring>]
 *
 * --print writes the matching topic's prompts one per line, ready to copy into the
 * dialog. Without it the output is the length table only.
 */
import { readFileSync } from "node:fs";

const LIMIT = 500;
const SOURCE = "docs/research/clarity-topic-prompts.json";

const args = process.argv.slice(2);
const printIndex = args.indexOf("--print");
const printFilter = printIndex >= 0 ? (args[printIndex + 1] ?? "").toLowerCase() : null;

const data = JSON.parse(readFileSync(SOURCE, "utf8"));

let over = 0;

for (const topic of data.topics) {
  if (printFilter !== null) {
    if (!topic.title.toLowerCase().includes(printFilter)) continue;
    console.log(`# ${topic.title}\n`);
    for (const prompt of topic.prompts) console.log(`${prompt}\n`);
    continue;
  }

  console.log(`\n${topic.title} — ${topic.prompts.length} prompts`);
  topic.prompts.forEach((prompt, i) => {
    const n = prompt.length;
    if (n > LIMIT) over += 1;
    const flag = n > LIMIT ? "OVER" : "ok  ";
    console.log(`  ${String(i + 1).padStart(2)}  ${String(n).padStart(3)}  ${flag}  ${prompt.slice(0, 58)}…`);
  });
  const lengths = topic.prompts.map((p) => p.length).sort((a, b) => a - b);
  console.log(
    `      min ${lengths[0]} · median ${lengths[Math.floor(lengths.length / 2)]} · max ${lengths[lengths.length - 1]}`,
  );
}

if (printFilter !== null) process.exit(0);

if (over) {
  console.error(`\n${over} prompt(s) exceed ${LIMIT} characters — Clarity will reject them.`);
  process.exit(1);
}

console.log(`\nAll prompts are within ${LIMIT} characters.`);
