#!/usr/bin/env node
/**
 * American spelling across the English site: node scripts/normalize-us-spelling.mjs [--check]
 *
 * Client, 2026-09-23: 「英语要像美国人写的」; 2026-09-24: 「产品记录和界面也改美式拼写」.
 * The English side had been written in British spelling throughout (centre ×200+,
 * aluminium ×50, center ×0), which a US specifier reads as a foreign supplier on the
 * first line. See docs/collaboration/2026-09-24-voice-en-es-pt.md.
 *
 * WHAT IT TOUCHES
 *   Content JSON  content/{news,guides,products,projects}/*.json and the shared content
 *                 files below — English VALUES only. A key ending in Es/Pt/Zh, and
 *                 everything beneath it, is skipped; keys are never renamed.
 *   Lookup keys   content/i18n/zh-terms.json maps English labels and values to Chinese. An
 *                 American key is ADDED beside each British one (both kept), or RAYEN's
 *                 Chinese pages would leak English for every renamed label.
 *   Code          src/** and scripts/** (.ts .tsx .mjs), string literals and JSX text only,
 *                 found with the TypeScript parser — never identifiers, never comments.
 *                 This renames the spec-label KEYS in es-glossary.ts / pt-glossary.ts in
 *                 the same pass as the labels in content/products, which is the point: a
 *                 label renamed without its glossary key sends every /es and /pt spec row
 *                 for it back to English, and no test notices (spec chat, 2026-09-24; the
 *                 2026-09-11 incident in AGENTS.md is the same mechanism).
 *
 * WHAT IT NEVER TOUCHES
 *   - The RAYEN lane (scripts/lib/site-lanes.mjs), RAYEN-only product records,
 *     src/data/generated/**, out dirs, and scripts reading external text (EXTERNAL).
 *   - URLs, paths, file names, slugs: no [-/_.\w] may be glued to the word.
 *   - A literal that is one lower-case token ("catalogue", "enquiry"): those are enum
 *     values — the product finder's ?mode=catalogue is in visitors' URLs.
 *   - `code spans` inside prose, and the enum-like JSON keys in SKIP_KEYS.
 *
 * --check exits 1 if anything would change, so British spelling cannot creep back in.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { laneOf } from "./lib/site-lanes.mjs";

const CHECK = process.argv.includes("--check");
const require = createRequire(import.meta.url);

/** British → American, lower-case. The case of the matched word is carried over. */
const WORDS = {
  centre: "center", centres: "centers", centred: "centered",
  catalogue: "catalog", catalogues: "catalogs",
  aluminium: "aluminum",
  colour: "color", colours: "colors", coloured: "colored",
  grey: "gray",
  metre: "meter", metres: "meters", millimetre: "millimeter", millimetres: "millimeters",
  centimetre: "centimeter", centimetres: "centimeters", kilometre: "kilometer", kilometres: "kilometers",
  mortice: "mortise",
  behaviour: "behavior", behaviours: "behaviors",
  neighbour: "neighbor", neighbours: "neighbors", neighbouring: "neighboring",
  favour: "favor", favours: "favors", favourable: "favorable",
  enquiry: "inquiry", enquiries: "inquiries",
  programme: "program", programmes: "programs",
  travelling: "traveling", labelled: "labeled", labelling: "labeling", modelling: "modeling",
  storey: "story", storeys: "stories",
  defence: "defense", licence: "license", fibre: "fiber",
  organise: "organize", organised: "organized", organising: "organizing",
  organisation: "organization", organisations: "organizations",
  recognise: "recognize", recognises: "recognizes", recognised: "recognized", recognising: "recognizing",
  specialised: "specialized",
  standardise: "standardize", standardised: "standardized", standardising: "standardizing",
  normalised: "normalized", harmonised: "harmonized",
  authorise: "authorize", authorised: "authorized", unauthorised: "unauthorized",
  emphasised: "emphasized", emphasise: "emphasize",
  minimise: "minimize", minimised: "minimized", optimise: "optimize", optimised: "optimized",
  customise: "customize", customised: "customized", summarise: "summarize",
  prioritise: "prioritize", utilise: "utilize", realise: "realize", realised: "realized",
  galvanised: "galvanized", anodised: "anodized", finalised: "finalized",
  analyse: "analyze", analysed: "analyzed",
};

const RE = new RegExp(
  `(?<![\\w/_.-])(${Object.keys(WORDS).sort((a, b) => b.length - a.length).join("|")})(?![\\w/_-]|\\.\\w)`,
  "gi",
);
const ENUM_LIKE = /^[a-z0-9_-]+$/;

function matchCase(src, out) {
  if (src === src.toUpperCase()) return out.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return out[0].toUpperCase() + out.slice(1);
  return out;
}
const swap = (s) => s.replace(RE, (m) => matchCase(m, WORDS[m.toLowerCase()]));

/** Prose: leave URLs, `code spans` and markdown link targets alone. */
function fixProse(text, model = "") {
  // No ENUM_LIKE guard here: in JSON the enum-like fields are excluded by key (SKIP_KEYS),
  // and a spec value of plain "aluminium" is prose that should change.
  if (/^(https?:|\/)[^\s]*$/.test(text)) return text;
  // A record's own model number is the client's SKU, spelled as he spells it
  // ("5831-90mm grey"); the generated titles quote it verbatim.
  const guard = model ? new RegExp(`(${model.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`) : null;
  return text
    .split(/(`[^`\n]*`|\]\([^)]*\))/)
    .map((part, i) =>
      i % 2 ? part : guard ? part.split(guard).map((bit, j) => (j % 2 ? bit : swap(bit))).join("") : swap(part),
    )
    .join("");
}

/* ── content JSON ── */
const SKIP_KEYS =
  /^(slug|url|href|src|model|models|relatedModels|file|path|id|kind|type|status|mode|source|visual|format|sites|categoryPath|ctaHref|attachmentIds)$/;
function walk(value, key = "", model = "") {
  if (/(Es|Pt|Zh)$/.test(key) || SKIP_KEYS.test(key)) return value;
  if (typeof value === "string") return fixProse(value, model);
  if (Array.isArray(value)) return value.map((v) => walk(v, key, model));
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, k, model)]));
  return value;
}
const JSON_DIRS = ["content/news", "content/guides", "content/products", "content/projects"];
const JSON_FILES = [
  "content/categories.json", "content/downloads.json", "content/events.json", "content/faq.json",
  "content/image-alt-overrides.json", "content/navigation.json", "content/promo.json",
  "content/site-settings.json",
  // Read by the title generator: its British phrasing reappeared in every regenerated title.
  "src/data/category-positioning.json", "src/data/studio-studies.json",
];
const KEYED_FILES = ["content/i18n/zh-terms.json"];

/* ── code ── */
/**
 * Scripts that read OTHER people's text: a British competitor's spec labels (Stahlock), or a
 * supplier site (Artunion). Their string keys must match the source as published there.
 */
const EXTERNAL = /^scripts\/(stahlock-|scrape-)/;
function codeFiles(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n).replace(/\\/g, "/");
    if (/node_modules|\/generated\/|^out/.test(p)) return [];
    if (statSync(p).isDirectory()) return codeFiles(p);
    if (!/\.(tsx?|mjs)$/.test(n) || /\.d\.ts$/.test(n)) return [];
    if (p === "scripts/normalize-us-spelling.mjs" || laneOf(p) === "rayen" || EXTERNAL.test(p)) return [];
    return [p];
  });
}
function fixCode(path, src) {
  const ts = require("typescript");
  const kind = path.endsWith(".tsx") ? ts.ScriptKind.TSX : path.endsWith(".mjs") ? ts.ScriptKind.JS : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(path, src, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  const visit = (node) => {
    const k = node.kind;
    const literal =
      k === ts.SyntaxKind.StringLiteral || k === ts.SyntaxKind.NoSubstitutionTemplateLiteral ||
      k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle || k === ts.SyntaxKind.TemplateTail;
    if (literal || k === ts.SyntaxKind.JsxText) {
      // Module specifiers are paths; the lookarounds would protect most, but be explicit.
      const parent = node.parent;
      const isImport = parent && (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) ||
        (ts.isCallExpression(parent) && parent.expression.kind === ts.SyntaxKind.ImportKeyword));
      const start = node.getStart(sf);
      const raw = src.slice(start, node.getEnd());
      const inner = k === ts.SyntaxKind.JsxText ? raw : raw.slice(1, k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle ? -2 : -1);
      if (!isImport && !ENUM_LIKE.test(inner)) {
        const next = swap(inner);
        if (next !== inner) edits.push([start, raw, raw.replace(inner, next)]);
      }
    }
    if (k === ts.SyntaxKind.RegularExpressionLiteral) {
      // A regex matching our own labels must follow the rename, and one matching outside
      // input (a buyer typing "catalogue") must keep matching it: so it matches BOTH.
      const start = node.getStart(sf);
      const raw = src.slice(start, node.getEnd());
      const cut = raw.lastIndexOf("/");
      const body = raw.slice(1, cut);
      const next = body.replace(RE, (m, _w, at) => {
        const us = matchCase(m, WORDS[m.toLowerCase()]);
        // Already written as an alternation with the American form: leave it.
        return new RegExp(`\\b${us}\\b`, "i").test(body) ? m : `(?:${us}|${m})`;
      });
      if (next !== body) edits.push([start, raw, `/${next}${raw.slice(cut)}`]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  let out = src;
  for (const [start, raw, rep] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, start) + rep + out.slice(start + raw.length);
  if (/-glossary\.ts$/.test(path)) {
    // Some maps already carried both spellings; after the swap the pair is one entry twice.
    // Only WITHIN one object literal, and only when the value is identical too: the same
    // pair legitimately appears in two different maps of one file.
    const again = ts.createSourceFile(path, out, ts.ScriptTarget.Latest, true, kind);
    const drop = [];
    const scan = (node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const seen = new Map();
        for (const prop of node.properties) {
          if (!ts.isPropertyAssignment(prop) || !ts.isStringLiteral(prop.name)) continue;
          const value = prop.initializer.getText(again);
          if (seen.get(prop.name.text) === value) drop.push(prop);
          else if (!seen.has(prop.name.text)) seen.set(prop.name.text, value);
        }
      }
      ts.forEachChild(node, scan);
    };
    scan(again);
    for (const prop of drop.sort((a, b) => b.getStart(again) - a.getStart(again))) {
      // Remove from the start of its line through its trailing comma and newline.
      const lineStart = out.lastIndexOf("\n", prop.getStart(again)) + 1;
      let end = prop.getEnd();
      if (out[end] === ",") end++;
      if (out[end] === "\r") end++;
      if (out[end] === "\n") end++;
      out = out.slice(0, lineStart) + out.slice(end);
    }
  }
  return out;
}

/* ── run ── */
const changed = [];
const put = (p, before, after) => {
  if (before === after) return;
  changed.push(p);
  if (!CHECK) writeFileSync(p, after);
};
for (const dir of JSON_DIRS)
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    const p = `${dir}/${f}`;
    const raw = readFileSync(p, "utf8");
    const data = JSON.parse(raw);
    // RAYEN-only records render only on the RAYEN site: they keep the atlas's own spelling.
    if (Array.isArray(data.sites) && !data.sites.includes("hyde")) continue;
    const next = walk(data, "", typeof data.model === "string" ? data.model : "");
    if (JSON.stringify(data) !== JSON.stringify(next)) put(p, raw, `${JSON.stringify(next, null, 2)}\n`);
  }
for (const p of JSON_FILES) {
  const raw = readFileSync(p, "utf8");
  const next = walk(JSON.parse(raw));
  if (JSON.stringify(JSON.parse(raw)) !== JSON.stringify(next)) put(p, raw, `${JSON.stringify(next, null, 2)}\n`);
}
// Write mode only. RAYEN adds atlas-spelled keys here in its own daily work; a HYDE spelling
// check failing their commits would put our rule in their lane. The mirror test
// (src/lib/chinese-mirror.test.ts) already fails if a label the site uses has no entry.
for (const p of CHECK ? [] : KEYED_FILES) {
  // Line-level, so the file's own layout survives: after each `"British key": value` line,
  // add the same line with the American key unless it already exists. Both are kept
  // (RAYEN session, 2026-09-24): RAYEN-only records keep the atlas spelling.
  const original = readFileSync(p, "utf8");
  const eol = original.includes("\r\n") ? "\r\n" : "\n";
  const raw = original.replace(/\r\n/g, "\n");
  const lines = raw.split("\n");
  const present = new Set(lines.map((l) => l.match(/^\s*"([^"]+)":/)?.[1]).filter(Boolean));
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(\s*)"([^"]+)":(.*?)(,?)$/);
    const us = m && !ENUM_LIKE.test(m[2]) ? swap(m[2]) : null;
    if (!m || !us || us === m[2] || present.has(us) || /[[{]\s*$/.test(m[3])) {
      out.push(line);
      continue;
    }
    present.add(us);
    out.push(`${m[1]}"${m[2]}":${m[3]},`, `${m[1]}"${us}":${m[3]}${m[4]}`);
  }
  const next = out.join("\n");
  JSON.parse(next);
  // Written back with the file's own line endings, or the diff is every line.
  if (next !== raw) put(p, original, next.replace(/\n/g, eol));
}
for (const p of [...codeFiles("src"), ...codeFiles("scripts")]) {
  const raw = readFileSync(p, "utf8");
  put(p, raw, fixCode(p, raw));
}

if (CHECK && changed.length) {
  console.error(`✗ ${changed.length} file(s) use British spelling:\n  ${changed.slice(0, 20).join("\n  ")}`);
  console.error("Run: node scripts/normalize-us-spelling.mjs");
  process.exit(1);
}
console.log(CHECK ? "✓ English site uses American spelling" : `✓ ${changed.length} file(s) converted to American spelling`);
