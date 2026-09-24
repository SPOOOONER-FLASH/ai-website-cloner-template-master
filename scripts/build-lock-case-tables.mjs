#!/usr/bin/env node
/**
 * Rebuilds the two tables and the counted sentences in
 * content/guides/mortise-lock-case-comparison-2026.json from the lock-case records.
 *
 *   node scripts/build-lock-case-tables.mjs          # write
 *   node scripts/build-lock-case-tables.mjs --check  # exit 1 if the guide is stale
 *
 * The guide says "the tables are generated from the specification rows", and until
 * 2026-09-24 they were typed by hand: when the spec session filled center distances on five
 * more cases, src/data/article-catalogue-claims.test.ts went red and the tables were five rows
 * short. The row set here is the test's own (HYDE lock-cases family, both Backset and Center
 * distance parse as mm), so the article, the test and the catalog cannot drift apart again.
 *
 * Inches follow src/lib/imperial.ts: nearest 1/16", written 3-3/8".
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const FILE = "content/guides/mortise-lock-case-comparison-2026.json";
const CHECK = process.argv.includes("--check");
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const word = (n) => WORDS[n] ?? String(n);

const products = readdirSync("content/products").filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")));
const hyde = products.filter((p) => !p.sites || p.sites.includes("hyde"));
const top = (p) => [].concat(p.categoryPath ?? [])[0];
const spec = (p, label) => p.specs?.find((s) => s.label === label)?.value;
const mm = (v) => Number((v ?? "").match(/(\d+(?:\.\d+)?)\s*mm/)?.[1] ?? NaN);

function inch(value) {
  const sixteenths = Math.round((value / 25.4) * 16);
  const whole = Math.floor(sixteenths / 16);
  let num = sixteenths % 16;
  let den = 16;
  while (num % 2 === 0 && num > 0) { num /= 2; den /= 2; }
  if (num === 0) return `${whole}"`;
  return whole === 0 ? `${num}/${den}"` : `${whole}-${num}/${den}"`;
}

const cases = hyde.filter((p) => top(p) === "lock-cases");
const rows = cases
  .map((p) => ({ p, b: mm(spec(p, "Backset")), c: mm(spec(p, "Center distance")) }))
  .filter((r) => r.b && r.c)
  .sort((x, y) => x.b - y.b || x.c - y.c || x.p.model.localeCompare(y.p.model));
const narrow = rows.filter((r) => r.b <= 35);
const standard = rows.filter((r) => r.b > 35);

function also(p) {
  const face = spec(p, "Faceplate");
  if (face) return `faceplate ${face.replace(/\s*mm$/, "mm")}`;
  return spec(p, "Bolts") ?? "not published";
}
function table(list) {
  const head = "| Model | Backset | Center distance | Cylinder | Also published |\n| --- | --- | --- | --- | --- |";
  return [head, ...list.map(({ p, b, c }) =>
    `| ${p.model} | ${b}mm (${inch(b)}) | ${c}mm (${inch(c)}) | ${spec(p, "Cylinder") ?? "not published"} | ${also(p)} |`)].join("\n");
}

const at85 = rows.filter((r) => r.c === 85);
const byCd = new Map();
for (const r of rows.filter((r) => r.c !== 85)) byCd.set(r.c, [...(byCd.get(r.c) ?? []), r.p.model]);
const others = [...byCd].sort((a, b) => b[0] - a[0]).map(([c, models]) => {
  const list = models.length === 1 ? models[0] : `${models.slice(0, -1).join(", ")} and ${models.at(-1)}`;
  return models.length === 1 ? `${c}mm (${list})` : `${c}mm (${word(models.length)} cases: ${list})`;
});
const othersText = `${others.slice(0, -1).join(", ")} and ${others.at(-1)}`;

const guide = JSON.parse(readFileSync(FILE, "utf8").replace(/\r\n/g, "\n"));
const body = [...guide.body];
const find = (re) => {
  const i = body.findIndex((p) => typeof p === "string" && re.test(p));
  if (i < 0) throw new Error(`paragraph not found: ${re}`);
  return i;
};
const set = (re, from, to) => {
  const i = find(re);
  if (!from.test(body[i])) throw new Error(`pattern not found in paragraph ${i}: ${from}`);
  body[i] = body[i].replace(from, to);
};

set(/^This guide lays out every lock case/, /\(\d+ of the \d+ lock-case records/, `(${rows.length} of the ${cases.length} lock-case records`);
set(/^This guide lays out every lock case/, /reading \d+ product pages/, `reading ${cases.length} product pages`);
set(/^The first thing the numbers show/, /and \d+ of the \d+ are in this group/, `and ${narrow.length} of the ${rows.length} are in this group`);
set(/^The first thing the numbers show/, /and \d+ are in that group/, `and ${standard.length} are in that group`);
body[find(/^Narrow-stile cases, by backset:/) + 1] = table(narrow);
body[find(/^Standard cases, by backset:/) + 1] = table(standard);
set(/^Across the published cases, 85mm/, /: \d+ of the \d+, including \w+ of the \w+ narrow-stile cases\. The others are .*$/,
  `: ${at85.length} of the ${rows.length}, including ${word(narrow.filter((r) => r.c === 85).length)} of the ${word(narrow.length)} narrow-stile cases. The others are ${othersText}.`);
set(/^Two kinds of gap are worth knowing/, /First, \d+ lock-case records do not publish both numbers/, `First, ${cases.length - rows.length} lock-case records do not publish both numbers`);

const next = { ...guide, body };
const out = JSON.stringify(next, null, 2) + "\n";
const stale = JSON.stringify(guide.body) !== JSON.stringify(body);
if (CHECK) {
  if (stale) { console.error(`${FILE} is stale: run node scripts/build-lock-case-tables.mjs`); process.exit(1); }
  console.log("lock-case tables are current");
} else {
  writeFileSync(FILE, out);
  console.log(`${rows.length} of ${cases.length} lock cases: ${narrow.length} narrow-stile, ${standard.length} standard${stale ? "" : " (no change)"}`);
}
