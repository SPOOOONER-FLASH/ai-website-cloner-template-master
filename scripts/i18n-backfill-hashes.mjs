#!/usr/bin/env node
/**
 * One-off, re-runnable: give pre-hash overlay entries their `sourceHash` from the job files
 * they were merged from (tmp/i18n-done/ and tmp/i18n/), whose `source` is the English as it
 * stood at translation time. An entry no job file covers keeps no hash and therefore counts
 * as wholly stale on the next `i18n-batch --stale`, which is the honest outcome.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { hashRecord } from "./lib/i18n-source-hash.mjs";

const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const KINDS = ["products", "news", "guides", "projects", "categories", "faq"];
const jobs = ["tmp/i18n-done", "tmp/i18n"].flatMap((d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(".json")).map((f) => `${d}/${f}`) : []));
/* Later job files win: the newest source for a key is the one its current translation came from. */
jobs.sort((a, b) => (readFileSync(a).length, 0) || a.localeCompare(b));
const seen = {};
for (const file of jobs) {
  let job;
  try { job = JSON.parse(readFileSync(file, "utf8")); } catch { continue; }
  if (!KINDS.includes(job.kind) || !LOCALES.includes(job.locale)) continue;
  for (const item of job.items) {
    const filled = typeof item.target === "object" && Object.values(item.target).some((v) => (typeof v === "string" ? v.trim() : Array.isArray(v) ? v.length : v));
    if (!filled) continue;
    const fields = item.retranslate ?? Object.keys(hashRecord(job.kind, item.source));
    const partial = Object.fromEntries(Object.entries(hashRecord(job.kind, item.source)).filter(([f]) => fields.includes(f)));
    ((seen[job.locale] ??= {})[job.kind] ??= {})[item.key] = { ...(seen[job.locale][job.kind][item.key] ?? {}), ...partial };
  }
}
let written = 0;
for (const locale of LOCALES) for (const kind of KINDS) {
  const path = `content/i18n/${locale}/${kind}.json`;
  if (!existsSync(path)) continue;
  const overlay = JSON.parse(readFileSync(path, "utf8"));
  let changed = false;
  for (const [key, entry] of Object.entries(overlay)) {
    const h = seen[locale]?.[kind]?.[key];
    if (!h || typeof entry !== "object") continue;
    entry.sourceHash = { ...(entry.sourceHash ?? {}), ...h };
    changed = true;
    written++;
  }
  if (changed) writeFileSync(path, JSON.stringify(overlay, null, 2) + "\n");
}
console.log(`${written} entries given a sourceHash from ${jobs.length} job files`);
