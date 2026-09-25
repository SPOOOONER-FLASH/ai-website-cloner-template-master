#!/usr/bin/env node
/**
 * Drop overlay entries whose English key has nothing to translate — figures, units, codes,
 * brand names. Before 2026-09-25 the merge refused a target identical to its source, so the
 * writers spelled units out ("80 kg" → "80 kilogram", "4\" × 3\"" → "4\" × 3\" (inç)") to get
 * past it. Without an entry the page prints the English, which for these keys is the right
 * text in every language. Re-runnable; prints what it removes.
 *
 *   node scripts/i18n-prune-untranslatable.mjs            # all seven locales
 *   node scripts/i18n-prune-untranslatable.mjs --locale tr
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

import { untranslatable } from "./lib/i18n-untranslatable.mjs";
import { execFileSync } from "node:child_process";

const i = process.argv.indexOf("--locale");
const locales = i === -1 ? ["fr", "de", "ja", "ko", "tr", "ru", "ar"] : [process.argv[i + 1]];
let removed = 0;
for (const locale of locales) {
  for (const kind of ["glossary", "ui"]) {
    const path = `content/i18n/${locale}/${kind}.json`;
    if (!existsSync(path)) continue;
    const data = JSON.parse(readFileSync(path, "utf8"));
    const tables = kind === "glossary" ? Object.values(data) : [data];
    let changed = false;
    for (const table of tables) {
      for (const [en, target] of Object.entries(table)) {
        if (typeof target !== "string" || !untranslatable(en)) continue;
        /* Keep a genuine translation of a brand-only string? There is none; drop all. */
        console.log(`${locale}/${kind}: drop ${JSON.stringify(en)} → ${JSON.stringify(target)}`);
        delete table[en];
        removed++;
        changed = true;
      }
    }
    if (changed) writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  }
}
console.log(`${removed} untranslatable entr${removed === 1 ? "y" : "ies"} removed`);
if (removed) execFileSync(process.execPath, ["scripts/build-i18n-client-ui.mjs"], { stdio: "inherit" });
