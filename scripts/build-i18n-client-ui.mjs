#!/usr/bin/env node
/**
 * Cut src/data/generated/i18n-ui-client.json: for each overlay locale, only the interface
 * sentences that "use client" components can reach — the keys content/i18n/ui-keys.json
 * places in a client file or in any module a client file imports (transitively, within
 * src/). src/lib/i18n-client.ts binds tx/dict to it; src/lib/i18n.ts keeps the full set for
 * server components.
 *
 * WHY. One shared module meant every locale's every translation shipped to the browser:
 * 1,267 KB in one homepage chunk on 2026-09-25, against the 1,200 KB budget in
 * static-export-performance.test.ts. The subset is a few hundred keys per locale.
 *
 * Runs after every merge (scripts/i18n-merge.mjs) and prune, and `--check` in test:export
 * so a stale subset fails the build rather than the reader.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];
const OUT = "src/data/generated/i18n-ui-client.json";
const keys = JSON.parse(readFileSync("content/i18n/ui-keys.json", "utf8"));

const norm = (p) => p.split("\\").join("/");
const resolveImport = (from, spec) => {
  let base;
  if (spec.startsWith("@/")) base = join("src", spec.slice(2));
  else if (spec.startsWith(".")) base = join(dirname(from), spec);
  else return null;
  for (const c of [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")]) {
    if (existsSync(c) && !c.endsWith("/")) {
      try {
        if (readFileSync(c).length >= 0 && !/\.(json|css)$/.test(c)) return norm(c);
      } catch {
        /* a directory */
      }
    }
  }
  return null;
};

/* Every src file with "use client", per git so generated/ and tmp/ never leak in. */
const files = execSync("git ls-files src", { encoding: "utf8" }).split(/\r?\n/).filter((f) => /\.(ts|tsx)$/.test(f));
const isClient = (f) => /^\s*["']use client["']/m.test(readFileSync(f, "utf8").slice(0, 400));
const reach = new Set();
const walk = (f) => {
  if (reach.has(f) || !existsSync(f)) return;
  reach.add(f);
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/from\s+["']([^"']+)["']/g)) {
    const r = resolveImport(f, m[1]);
    if (r && r.startsWith("src/")) walk(r);
  }
};
for (const f of files) if (isClient(f)) walk(norm(f));

const wanted = new Set(Object.entries(keys).filter(([, where]) => where.some((w) => reach.has(w.replace(/:\d+$/, "")))).map(([k]) => k));

/*
  Spec labels ride along in full (246 keys, ~10 KB per locale): src/lib/card-figure.ts reads
  them for the finder's client-side cards, and the table is small and bounded.
*/
const materials = new Set();
for (const f of readdirSync("content/products")) {
  if (!f.endsWith(".json")) continue;
  const p = JSON.parse(readFileSync(`content/products/${f}`, "utf8"));
  if ((!p.sites || p.sites.includes("hyde")) && p.material) for (const part of String(p.material).split(/\s*[/+,]\s*/)) materials.add(part.trim());
}
const out = {};
for (const locale of LOCALES) {
  const ui = JSON.parse(readFileSync(`content/i18n/${locale}/ui.json`, "utf8"));
  const glossaryPath = `content/i18n/${locale}/glossary.json`;
  const glossary = existsSync(glossaryPath) ? JSON.parse(readFileSync(glossaryPath, "utf8")) : {};
  /* ProductCard renders inside the finder (client): the material line needs its lookups. */
  const values = {};
  for (const table of [glossary.materialNames ?? {}, glossary.finishNames ?? {}]) Object.assign(values, table);
  for (const m of materials) if (glossary.specValues?.[m]) values[m] = glossary.specValues[m];
  out[locale] = {
    ui: Object.fromEntries([...wanted].filter((k) => k in ui).sort((a, b) => a.localeCompare(b, "en")).map((k) => [k, ui[k]])),
    specLabels: glossary.specLabels ?? {},
    values: Object.fromEntries(Object.entries(values).sort(([a], [b]) => a.localeCompare(b, "en"))),
  };
}
const text = JSON.stringify(out, null, 2) + "\n";
const sizeKb = Math.round(Buffer.byteLength(text) / 1024);
const summary = `${wanted.size} client-reachable keys from ${reach.size} modules; ${LOCALES.map((l) => `${l} ${Object.keys(out[l].ui).length}+${Object.keys(out[l].specLabels).length}+${Object.keys(out[l].values).length}`).join(", ")}; ${sizeKb} KB`;

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : "";
  if (current !== text) {
    console.error(`${OUT} is stale — run node scripts/build-i18n-client-ui.mjs (${summary})`);
    process.exit(1);
  }
  console.log(`client ui subset current — ${summary}`);
} else {
  writeFileSync(OUT, text);
  console.log(`${OUT}: ${summary}`);
}
