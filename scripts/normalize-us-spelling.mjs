#!/usr/bin/env node
/**
 * American spelling for the English articles: node scripts/normalize-us-spelling.mjs [--check]
 *
 * Client, 2026-09-23: 「英语要像美国人写的」. The English side had been written in British
 * spelling throughout (centre ×200+, aluminium ×50, center ×0), which a US specifier reads
 * as a foreign supplier on the first line. See docs/collaboration/2026-09-24-voice-en-es-pt.md.
 *
 * Scope: content/news and content/guides, English fields only (any key ending in Es/Pt, and
 * everything beneath it, is skipped). Untouched on purpose:
 *   - URLs, paths and file names (hyde-export-catalogue-2026.pdf stays as published)
 *   - `code spans`: they quote a label exactly as a product page prints it, and product
 *     records (shared by both sites) are not converted yet
 *   - proper nouns — none of the words below occur as one in these files (checked 2026-09-24)
 *
 * --check exits 1 if anything would change, so a British spelling cannot creep back in.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIRS = ["content/news", "content/guides"];
const CHECK = process.argv.includes("--check");

/** British → American, lower-case stems. Case of the first letter / whole word is preserved. */
const WORDS = {
  centre: "center", centres: "centers", centred: "centered", "off-centre": "off-center",
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
  // not part of a path, file name, slug or URL: no [-/_.\w] glued on either side
  `(?<![\\w/_.-])(${Object.keys(WORDS).sort((a, b) => b.length - a.length).join("|")})(?![\\w/_-]|\\.\\w)`,
  "gi",
);

function matchCase(src, out) {
  if (src === src.toUpperCase()) return out.toUpperCase();
  if (src[0] === src[0].toUpperCase()) return out[0].toUpperCase() + out.slice(1);
  return out;
}

function fixProse(text) {
  if (/^(https?:|\/)[^\s]*$/.test(text)) return text;
  // Split on `code spans` and markdown link targets "](...)" and leave those parts alone.
  return text
    .split(/(`[^`\n]*`|\]\([^)]*\))/)
    .map((part, i) => (i % 2 ? part : part.replace(RE, (m) => matchCase(m, WORDS[m.toLowerCase()]))))
    .join("");
}

const SKIP_KEYS = /^(slug|url|href|src|model|models|relatedModels|image|heroImage|file|path|id)$/;
function walk(value, key = "") {
  if (/(Es|Pt|Zh)$/.test(key) || SKIP_KEYS.test(key)) return value;
  if (typeof value === "string") return fixProse(value);
  if (Array.isArray(value)) return value.map((v) => walk(v, key));
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, k)]));
  return value;
}

let changed = 0;
for (const dir of DIRS) {
  for (const f of readdirSync(dir).filter((n) => n.endsWith(".json"))) {
    const p = join(dir, f);
    const raw = readFileSync(p, "utf8");
    const next = `${JSON.stringify(walk(JSON.parse(raw)), null, 2)}\n`;
    if (JSON.stringify(JSON.parse(raw)) === JSON.stringify(JSON.parse(next))) continue;
    changed += 1;
    if (CHECK) console.error(`British spelling in ${p}`);
    else writeFileSync(p, next);
  }
}
if (CHECK && changed) {
  console.error(`✗ ${changed} article(s) use British spelling. Run: node scripts/normalize-us-spelling.mjs`);
  process.exit(1);
}
console.log(CHECK ? "✓ articles use American spelling" : `✓ ${changed} article(s) converted to American spelling`);
