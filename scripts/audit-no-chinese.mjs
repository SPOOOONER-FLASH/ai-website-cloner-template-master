#!/usr/bin/env node
/**
 * The HYDE site shows no Chinese. Anywhere a visitor or a crawler reads.
 *
 * Client rule, 2026-09-23: 「官网永远不要显示中文的任何东西，你可以做镜像或者留存数据」.
 * Chinese stays in data (content JSON, code comments, the RAYEN mirror in out-rayen/) —
 * never on a cantonlock.com page.
 *
 * WHY A BUILD CHECK AND NOT A REVIEW. On the day the rule was stated, the export already
 * broke it in three places nobody had looked at: the finish-code notes on /finishes/
 * quoted the client's own Chinese term for ten finishes, an internal dashboard at
 * /status/ was entirely in Chinese, and the CMS login page had a Chinese title. Each was
 * written for a reason that made sense at the time. A rule that depends on every future
 * author remembering it is not a rule.
 *
 * WHAT IS READ. Visible text (script, style and comments removed), <title>, meta
 * content, alt/title/aria-label attributes, and JSON-LD — search engines quote that last
 * one directly. Next's serialised RSC payload inside <script> is NOT read: it carries the
 * page's data props, which legitimately include Chinese fields (nameZh) that no component
 * renders on this site. What matters is what is shown.
 *
 * ONE EXCLUSION, NAMED. /admin/ is the Decap CMS. Its field labels are Chinese because
 * the people editing content are, and they only appear after a GitHub login. Its public
 * shell (title, notice) is English. If that ever changes, remove it from ALLOW.
 *
 *   node scripts/audit-no-chinese.mjs            report and exit 1 on any finding
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = "out";
const ALLOW = new Set(["admin/index.html"]);
const HAN = /\p{Script=Han}/u;

/*
  JAPANESE, 2026-09-24. The /ja/ market pages (src/data/market-locales.ts) are written in
  Japanese, and Japanese kanji are the same Unicode block as Chinese hanzi — so the rule
  above, applied literally, fails every Japanese page for being Japanese.

  Under /ja/ the test becomes: a run of SEVEN OR MORE Han characters with no kana in it.
  Written Japanese interleaves kana constantly (particles, okurigana, です・ます), and the
  longest kanji-only compounds in this trade run four to six characters (耐久試験報告書 is
  seven, and the copy splits it). A seven-kanji run with no kana is a Chinese sentence,
  which is exactly what the client rule forbids. Everywhere else the original rule holds.
*/
const HAN_RUN_JA = /\p{Script=Han}{7,}/u;
const isJapanese = (rel) => rel.startsWith("ja/");

function* html(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      yield* html(p);
    } else if (entry.name.endsWith(".html")) yield p;
  }
}

const findings = [];
let pages = 0;
for (const file of html(ROOT)) {
  const rel = relative(ROOT, file).split(sep).join("/");
  if (ALLOW.has(rel)) continue;
  pages++;
  /*
    One Han string is allowed on every page: 日本語, the endonym of Japanese in the language
    menu (2026-09-24). A language switch lists each language in its own script — a reader
    looking for Japanese scans for 日本語, not for "Japanese" — and that word happens to be
    written in kanji. It is the only exception, spelled out here, and stripped before the
    check so the rule for everything else stays as strict as the day the client stated it.
  */
  const h = readFileSync(file, "utf8").replace(/日本語/g, "");
  const hits = [];
  const japanese = isJapanese(rel);
  const han = japanese ? HAN_RUN_JA : HAN;
  const take = (where, text) => {
    const m = japanese
      ? text.match(/.{0,24}\p{Script=Han}{7,}.{0,16}/u)
      : text.match(/.{0,24}\p{Script=Han}[\p{Script=Han}\s，。、「」：]*.{0,16}/u);
    if (m) hits.push(`${where}: ${m[0].replace(/\s+/g, " ").trim()}`);
  };

  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    if (han.test(m[1])) take("JSON-LD", m[1]);
  }
  const title = h.match(/<title>([\s\S]*?)<\/title>/);
  if (title && han.test(title[1])) take("title", title[1]);
  for (const m of h.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"/g)) if (han.test(m[1])) take("meta", m[1]);
  for (const m of h.matchAll(/\b(alt|title|aria-label)="([^"]*)"/g)) if (han.test(m[2])) take(m[1], m[2]);

  const visible = h
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<title>[\s\S]*?<\/title>/g, " ")
    .replace(/<[^>]+>/g, " ");
  if (han.test(visible)) take("text", visible);

  if (hits.length) findings.push([rel, hits]);
}

if (findings.length) {
  console.error(`✗ Chinese on ${findings.length} of ${pages} HYDE pages — client rule 2026-09-23, the site shows none:`);
  for (const [rel, hits] of findings.slice(0, 40)) {
    console.error(`  /${rel.replace(/index\.html$/, "")}`);
    for (const hit of hits) console.error(`      ${hit}`);
  }
  if (findings.length > 40) console.error(`  … and ${findings.length - 40} more`);
  process.exit(1);
}
console.log(`✓ no Chinese on any of ${pages} HYDE pages (visible text, title, meta, alt/aria, JSON-LD; /ja/ judged by kanji runs).`);
