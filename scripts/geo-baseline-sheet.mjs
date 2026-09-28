#!/usr/bin/env node
/**
 * Prints the GEO baseline scoring sheet as CSV — one row per question × platform × sample.
 *
 *   npm run geo:baseline                  → stdout
 *   npm run geo:baseline -- --out x.csv   → file
 *
 * The question set lives in docs/geo/baseline-queries.json and the protocol in
 * docs/geo/README.md. This prints the blank sheet so each run is filled in against the
 * same rows; it does not query any assistant itself (no API keys, and answers taken
 * from a logged-in account are personalised, which is exactly what the protocol avoids).
 */
import { readFileSync, writeFileSync } from "node:fs";

const set = JSON.parse(readFileSync(new URL("../docs/geo/baseline-queries.json", import.meta.url), "utf8"));
const columns = ["date", "id", "intent", "lang", "platform", "sample", "question", "mentioned (y/n)", "position (1-n)", "how described", "our URL cited", "other domains cited"];
const quote = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));

const rows = [columns];
for (const q of set.queries) {
  for (const platform of set.platforms) {
    for (let sample = 1; sample <= set.samplesPerQuestion; sample++) {
      rows.push(["", q.id, q.intent, q.lang, platform, sample, q.q, "", "", "", "", ""]);
    }
  }
}
const csv = rows.map((r) => r.map(quote).join(",")).join("\n") + "\n";

const outIndex = process.argv.indexOf("--out");
if (outIndex > -1 && process.argv[outIndex + 1]) {
  writeFileSync(process.argv[outIndex + 1], csv);
  console.log(`${rows.length - 1} rows (${set.queries.length} questions × ${set.platforms.length} platforms × ${set.samplesPerQuestion}) → ${process.argv[outIndex + 1]}`);
} else {
  process.stdout.write(csv);
}
