#!/usr/bin/env node
/**
 * Rewrite physical-direction utilities to logical ones, so /ar/ lays out mirrored.
 *
 * Arabic shipped as a full tree on 2026-09-25 with `dir="rtl"` on <html>. A Tailwind
 * `pl-12` is padding-LEFT in both directions; `ps-12` is padding on the reading side. In
 * left-to-right pages the two are identical, so this rewrite changes nothing for the
 * other nine locales — which is what makes it safe to run across the whole tree.
 *
 * WHAT IS LEFT ALONE, AND WHY
 *   - a class chunk that also carries `translate-x`: `left-1/2 -translate-x-1/2` centres
 *     an element, and only half of it would flip. Those need a hand-written `rtl:` pair.
 *   - src/components/site/EditorialCatalogue.module.css and NewsVisual.module.css: their
 *     `left:` / `right:` position hotspots over a PHOTOGRAPH. A photograph is never
 *     mirrored (docs/collaboration/2026-09-24-language-expansion-prep.md §2: mirroring a
 *     door photo turns a left-hand door into a right-hand one), so the hotspots stay put.
 *   - anything in the RAYEN lane.
 *
 * Re-runnable; docs/research/RTL-READINESS.md (scripts/audit-rtl-readiness.mjs) reports
 * what remains.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { laneOf } from "./lib/site-lanes.mjs";

const SKIP = new Set([
  "src/components/site/EditorialCatalogue.module.css",
  "src/components/site/NewsVisual.module.css",
]);

const TOKEN = [
  [/^(-?)ml-/, "$1ms-"],
  [/^(-?)mr-/, "$1me-"],
  [/^pl-/, "ps-"],
  [/^pr-/, "pe-"],
  [/^(-?)left-/, "$1start-"],
  [/^(-?)right-/, "$1end-"],
  [/^text-left$/, "text-start"],
  [/^text-right$/, "text-end"],
  [/^border-l(-|$)/, "border-s$1"],
  [/^border-r(-|$)/, "border-e$1"],
  [/^rounded-l(-|$)/, "rounded-s$1"],
  [/^rounded-r(-|$)/, "rounded-e$1"],
  [/^rounded-tl(-|$)/, "rounded-ss$1"],
  [/^rounded-bl(-|$)/, "rounded-es$1"],
  [/^rounded-tr(-|$)/, "rounded-se$1"],
  [/^rounded-br(-|$)/, "rounded-ee$1"],
  [/^float-left$/, "float-start"],
  [/^float-right$/, "float-end"],
];

const CSS = [
  [/\bmargin-left\s*:/g, "margin-inline-start:"],
  [/\bmargin-right\s*:/g, "margin-inline-end:"],
  [/\bpadding-left\s*:/g, "padding-inline-start:"],
  [/\bpadding-right\s*:/g, "padding-inline-end:"],
  [/(?<![\w-])left\s*:/g, "inset-inline-start:"],
  [/(?<![\w-])right\s*:/g, "inset-inline-end:"],
  [/\btext-align\s*:\s*left\b/g, "text-align: start"],
  [/\btext-align\s*:\s*right\b/g, "text-align: end"],
  [/\bborder-left(-\w+)?\s*:/g, "border-inline-start$1:"],
  [/\bborder-right(-\w+)?\s*:/g, "border-inline-end$1:"],
];

function files(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n).replace(/\\/g, "/");
    if (/node_modules|\/generated\//.test(p)) return [];
    if (statSync(p).isDirectory()) return files(p);
    return /\.(tsx|ts|css)$/.test(n) && laneOf(p) !== "rayen" && !SKIP.has(p) ? [p] : [];
  });
}

function convertToken(token) {
  const m = /^((?:[\w-]+:)*)(.*)$/.exec(token);
  const prefix = m[1];
  let bare = m[2];
  for (const [re, rep] of TOKEN) {
    if (re.test(bare)) {
      bare = bare.replace(re, rep);
      break;
    }
  }
  return prefix + bare;
}

let changed = 0;
for (const f of files("src")) {
  const text = readFileSync(f, "utf8");
  let out = text;
  if (f.endsWith(".css")) {
    for (const [re, rep] of CSS) out = out.replace(re, rep);
  } else {
    out = out.replace(/className=(\{?)([`"'])([^`"']+)\2|cn\(([^)]*)\)/g, (whole) => {
      if (/translate-x/.test(whole)) return whole;
      return whole.replace(/(?<=[\s"'`(,])(-?[\w:/\[\].%-]+)(?=[\s"'`),])/g, (token) => {
        const converted = convertToken(token);
        return converted;
      });
    });
    /* space-x reverses under rtl only when told to. */
    out = out.replace(/\bspace-x-(\d+)\b(?![^"'`]*rtl:space-x-reverse)/g, "space-x-$1 rtl:space-x-reverse");
  }
  if (out !== text) {
    writeFileSync(f, out);
    changed++;
    console.log(`rewrote ${f}`);
  }
}
console.log(`${changed} file(s) changed`);
