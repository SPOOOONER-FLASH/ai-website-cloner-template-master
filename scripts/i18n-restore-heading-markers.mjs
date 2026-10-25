#!/usr/bin/env node
/**
 * Overlay article bodies must carry the English heading markers ("## ", "### ") at the same positions.
 *
 * 2026-10-25: 490 headings in the ja / ko / ar guide overlays (23 articles each), 8 in de and 2 in ru had
 * lost their "## " marker. On ko / ar pages they still rendered as headings, but only by luck:
 * articleBlocks() also treats short ALL-CAPS lines as headings, and a script without letter case passes
 * `text === text.toLocaleUpperCase()` every time. The same accident turned 1,053 short Japanese paragraphs
 * (they end in 。, which the [.!?] check does not catch) into <h2> on the live site, while 107 real
 * Japanese headings rendered as paragraphs. src/lib/article-layout.ts now applies the capitals rule only
 * to text whose letters are all upper-case cased letters, so the markers are what makes a heading.
 *
 *   node scripts/i18n-restore-heading-markers.mjs           # report what would change
 *   node scripts/i18n-restore-heading-markers.mjs --write   # restore the markers
 *   node scripts/i18n-restore-heading-markers.mjs --check   # exit 1 if any marker is missing (used by i18n-lint)
 *
 * Only bodies with the same length as the English are touched. A line is restored only if it looks like a
 * heading (one line, at most 160 characters); anything else is listed for a human and left alone.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { safeWrite } from "./lib/safe-write.mjs";

const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const KINDS = ["guides", "news"];
const write = process.argv.includes("--write");
const check = process.argv.includes("--check");
const MARKER = /^(#{2,3})\s+/;

const english = {};
for (const kind of KINDS) {
  english[kind] = {};
  for (const f of readdirSync(join("content", kind)).filter((n) => n.endsWith(".json"))) {
    const r = JSON.parse(readFileSync(join("content", kind, f), "utf8"));
    english[kind][r.slug] = r;
  }
}

let restored = 0;
const skipped = [];
for (const locale of LOCALES) {
  for (const kind of KINDS) {
    const path = join("content", "i18n", locale, `${kind}.json`);
    if (!existsSync(path)) continue;
    const overlay = JSON.parse(readFileSync(path, "utf8"));
    let changed = 0;
    for (const [slug, entry] of Object.entries(overlay)) {
      const en = english[kind][slug];
      if (!en || !Array.isArray(entry.body) || !Array.isArray(en.body)) continue;
      if (entry.body.length !== en.body.length) continue;
      entry.body.forEach((text, i) => {
        const marker = MARKER.exec(en.body[i] ?? "")?.[1];
        if (!marker || typeof text !== "string" || MARKER.test(text)) return;
        const line = text.trim();
        if (line.includes("\n") || [...line].length > 160) {
          skipped.push(`${locale}/${kind} ${slug} [${i}]: ${line.slice(0, 60)}`);
          return;
        }
        entry.body[i] = `${marker} ${line}`;
        changed += 1;
      });
    }
    restored += changed;
    if (changed) {
      console.log(`${locale}/${kind}: ${changed} heading marker(s) ${write ? "restored" : "missing"}`);
      if (write) safeWrite(path, `${JSON.stringify(overlay, null, 2)}\n`);
    }
  }
}

if (skipped.length) {
  console.log(`\n${skipped.length} line(s) sit where the English has a heading but do not look like one — check by hand:`);
  for (const s of skipped) console.log(`  ${s}`);
}
if (!restored && !skipped.length) console.log("heading markers match the English in every overlay");
if (check && (restored || skipped.length)) {
  console.error(`✗ ${restored + skipped.length} overlay heading(s) without the English marker — run node scripts/i18n-restore-heading-markers.mjs --write`);
  process.exit(1);
}
