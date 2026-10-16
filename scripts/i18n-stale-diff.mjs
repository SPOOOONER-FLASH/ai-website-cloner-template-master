#!/usr/bin/env node
/**
 * What exactly moved in the English since each stale overlay entry was translated.
 *
 *   node scripts/i18n-stale-diff.mjs [--locale fr] [--kind guides] [--out tmp/i18n-patch]
 *
 * `i18n-batch.mjs --stale` re-cuts a whole field when its hash moved, and for a 66-paragraph
 * guide whose job file is no longer on disk that means 66 paragraphs to re-translate for a
 * one-number edit. The overlay entry still says which English it was made from: its
 * `sourceHash`. This walks the git history of the English record until it finds the version
 * with that hash, then compares index by index.
 *
 * Writes one patch job per locale, `<out>/<locale>-patch.json`:
 *   { locale, items: [{ kind, slug, field, index, oldEnglish, english, current, target: "" }] }
 * `index` is null for string fields. Fill `target` (the updated translation of `english`,
 * keeping everything `current` already says correctly) and apply with
 * `node scripts/i18n-apply-patch.mjs <file>`, which also moves `sourceHash` forward.
 *
 * Entries whose old English cannot be found in history (or whose array changed length) are
 * listed as `whole: true` items: those need the field re-translated with i18n-batch --stale.
 *
 * Written 2026-10-16, when seven locales carried 16 stale records each: 15 articles whose
 * English had moved by a count or a sentence, and 037's product record.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { FIELDS, hashOf, staleFields } from "./lib/i18n-source-hash.mjs";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const LOCALES = opt("locale") ? [opt("locale")] : ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const KINDS = opt("kind") ? [opt("kind")] : ["products", "news", "guides"];
const outDir = opt("out", "tmp/i18n-patch");
const today = new Date().toISOString().slice(0, 10);
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

const asSource = (kind, r) => (kind === "news" || kind === "guides" ? { ...r, faq: r.faq?.en ?? [] } : r);
const isLive = (kind, r) =>
  kind === "products" ? (!r.sites || r.sites.includes("hyde")) && Boolean(r.heroImage?.src) : !r.draft && r.publishedAt <= today;

/** Every committed version of one English record, newest first, parsed lazily and cached. */
const historyCache = new Map();
function history(path) {
  if (!historyCache.has(path)) {
    const revs = execFileSync("git", ["log", "--format=%H", "--", path], { encoding: "utf8" }).split("\n").filter(Boolean);
    const versions = [];
    historyCache.set(path, { revs, versions });
  }
  return historyCache.get(path);
}
function versionAt(path, i) {
  const h = history(path);
  if (h.versions[i] === undefined) {
    try {
      h.versions[i] = JSON.parse(execFileSync("git", ["show", `${h.revs[i]}:${path}`], { encoding: "utf8", maxBuffer: 1e8 }));
    } catch {
      h.versions[i] = null;
    }
  }
  return h.versions[i];
}
/** The English value of `field` whose hash is `want`, searching back through history. */
function englishFor(kind, path, field, want) {
  const { revs } = history(path);
  for (let i = 0; i < revs.length; i++) {
    const r = versionAt(path, i);
    if (!r) continue;
    const v = asSource(kind, r)[field];
    if (v !== undefined && hashOf(field, v) === want) return { value: v };
  }
  return undefined;
}

const jobs = Object.fromEntries(LOCALES.map((l) => [l, []]));
for (const kind of KINDS) {
  const folder = `content/${kind}`;
  const records = readdirSync(folder).filter((f) => f.endsWith(".json")).map((f) => readJson(`${folder}/${f}`));
  for (const locale of LOCALES) {
    const file = `content/i18n/${locale}/${kind}.json`;
    if (!existsSync(file)) continue;
    const overlay = readJson(file);
    for (const r of records) {
      const entry = overlay[r.slug];
      if (!isLive(kind, r) || !entry) continue;
      const src = asSource(kind, r);
      for (const field of staleFields(kind, src, entry)) {
        if (!FIELDS[kind].includes(field)) continue;
        const was = entry.sourceHash?.[field] && englishFor(kind, `${folder}/${r.slug}.json`, field, entry.sourceHash[field]);
        const now = src[field];
        const current = field === "faq" ? entry.faq : entry[field];
        const base = { kind, slug: r.slug, field };
        if (!was || (Array.isArray(now) && (!Array.isArray(was.value) || was.value.length !== now.length || !Array.isArray(current) || current.length !== now.length))) {
          jobs[locale].push({ ...base, whole: true, index: null, oldEnglish: was?.value ?? null, english: now, current: current ?? null, target: "" });
          continue;
        }
        if (Array.isArray(now)) {
          now.forEach((v, i) => {
            if (JSON.stringify(v) === JSON.stringify(was.value[i])) return;
            jobs[locale].push({ ...base, index: i, oldEnglish: was.value[i], english: v, current: current[i], target: "" });
          });
        } else {
          jobs[locale].push({ ...base, index: null, oldEnglish: was.value, english: now, current: current ?? "", target: "" });
        }
      }
    }
  }
}

mkdirSync(outDir, { recursive: true });
for (const [locale, items] of Object.entries(jobs)) {
  const path = `${outDir}/${locale}-patch.json`;
  writeFileSync(path, `${JSON.stringify({ locale, items }, null, 2)}\n`);
  const whole = items.filter((i) => i.whole).length;
  console.log(`${path}: ${items.length} item(s)${whole ? `, ${whole} need the whole field` : ""}`);
}
