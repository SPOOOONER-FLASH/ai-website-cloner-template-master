/**
 * Builds nginx 301 redirects from the old DedeCMS URLs to the new product pages.
 *
 * ---------------------------------------------------------------------------
 * Why this matters more than any on-page tweak
 *
 * Search Console reports ~820 indexed pages and Bing 533, and almost all of them are
 * the old `index.php?m=home&c=View&a=index&aid=NNNN` product URLs. Every one of those
 * now returns 404. Years of accumulated ranking and 236 external backlinks are pointing
 * at dead ends. A 301 hands that authority to the replacement page; a 404 discards it.
 *
 * `docs/research/legacy/index.json` is the aid → product-label table captured during
 * the original scrape. 423 of its 424 entries resolve to a product that still exists,
 * so this is a near-complete recovery rather than a blanket redirect to the homepage
 * (which Google treats as a soft 404 and passes almost nothing through).
 *
 * ---------------------------------------------------------------------------
 * Why nginx and not the app
 *
 * The site is `output: "export"` — there is no server to run Next.js redirects, and a
 * meta-refresh does not pass authority. nginx maps the query argument directly, which
 * costs one hash lookup per request.
 *
 *   node scripts/build-legacy-redirects.mjs
 *     → writes deploy/nginx/legacy-redirects.conf
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";

const OUT = "deploy/nginx/legacy-redirects.conf";
const TAXONOMY = "deploy/nginx/taxonomy-redirects.conf";
const check = process.argv.includes("--check");

/**
 * Legacy ids whose label cannot be matched to a product by rule.
 *
 * Without these the id falls through to `/products/`, which is the correct behaviour for
 * a model we no longer make and the WRONG behaviour for a model we still sell under a
 * label the matcher cannot read. Those two cases look identical in the unresolved list,
 * so each one is decided here, once, with its reason.
 *
 * ⚠ An id that resolves to nothing and is not named here stops the run (see below).
 * A blanket fallback would have hidden the first two of these indefinitely.
 */
const LEGACY_AID_OVERRIDES = {
  /* Label "Lc04 85×60mm". The model is written "LC04 85*60" — a multiplication sign
     against an asterisk, and a trailing "mm" the model does not carry. Still sold. */
  205: "/products/lock-cases/lc04-85-60-lock-case/",
  /* Label "72". The model is "072"; the matcher compares strings, so the leading zero
     loses it. Still sold, as the exit-device lock case. */
  381: "/products/panic-exit-devices/072-panic-exit-device-lock-case/",
  /* Label "024". Its neighbours (aid 1607 "316-D", 1609 "016") are exit-device trims, and
     there is no 024 in the catalogue — this one really is discontinued. The category is
     the nearest true page; the generic hub would be a worse answer, not a safer one. */
  1608: "/products/panic-exit-devices/",
};

/**
 * Legacy category ids, recovered from Bing Webmaster Tools' "duplicate titles" export on
 * 2026-08-31. That report pairs each failing URL with its old <title>, and the titles are
 * the DedeCMS category names — the table the original scrape missed.
 *
 * Only ids whose title maps onto a category that exists today. "Factory" (tid=89) and
 * "Contact us" (tid=91) are not product categories and are listed here deliberately,
 * pointing at the pages that replaced them.
 */
const LEGACY_CATEGORY_TIDS = {
  75: "/products/",
  89: "/company/",
  91: "/contact/",
  97: "/products/lock-cases/",
  99: "/products/knob-locks/",
  101: "/products/knob-locks/",
  105: "/products/knob-locks/",
  119: "/products/glass-door-accessories/",
  123: "/products/panic-exit-devices/",
  131: "/products/brass-steel-hinges/",
  133: "/products/hardware-accessories/",
};

/* --- live products, indexed by every identifier the old site might have used ----- */
const byKey = new Map();
for (const file of readdirSync("content/products").filter((f) => f.endsWith(".json"))) {
  const p = JSON.parse(readFileSync(`content/products/${file}`, "utf8"));
  const url = `/products/${p.categoryPath[0]}/${p.slug}/`;
  const model = String(p.model ?? "").toLowerCase().trim();
  if (model) byKey.set(model, url);
  // The legacy labels are sometimes "LC5845" and sometimes "607 SS ET" — index the
  // whole label and its first token so both shapes hit.
  byKey.set(`${model} ${String(p.name ?? "").toLowerCase().trim()}`.trim(), url);
}

/* --- aid -> label, from the original scrape ------------------------------------- */
const raw = JSON.parse(readFileSync("docs/research/legacy/index.json", "utf8"));
const entries = Array.isArray(raw) ? raw : Object.values(raw)[0];

const pairs = [];
const unresolved = [];
for (const e of entries) {
  const label = String(e.label ?? "").toLowerCase().trim();
  const target =
    LEGACY_AID_OVERRIDES[e.aid] ?? byKey.get(label) ?? byKey.get(label.split(/\s+/)[0]);
  if (target) pairs.push([String(e.aid), target]);
  else unresolved.push(e);
}

/*
  STOP RATHER THAN FALL BACK.

  Every id here is a URL with years of ranking behind it. When one stops resolving, the
  fallback sends it to `/products/` and the loss is invisible: the file still builds, the
  server still answers 301, and nobody can tell a deliberate hub redirect from a product
  whose slug changed under the matcher. That is what happened between 2026-09-07 and
  today — two ids quietly stopped resolving during the exit-device renames.

  AGENTS.md, 2026-09-11: when a default would be wrong rather than merely incomplete,
  stop the run. Decide the id in LEGACY_AID_OVERRIDES above and say why.
*/
if (unresolved.length) {
  throw new Error(
    `${unresolved.length} legacy id(s) resolve to no page: ` +
      unresolved.map((u) => `${u.aid} "${u.label}"`).join(", ") +
      "\nAdd each to LEGACY_AID_OVERRIDES with the reason, or map its label to a product.",
  );
}

/*
  NO CHAINS.

  `index.php?aid=397` pointed at `/products/panic-exit-devices/x2-panic-exit-device/`,
  which taxonomy-redirects.conf then 301s to `…-x2-panic-exit-device-trim/`. Two hops.
  It works, so nothing complained — but a chain dilutes what the first hop was built to
  carry, and it only survives because the taxonomy entry happens to still exist. Prune
  that entry and the legacy URL breaks outright.

  Seventeen ids were in that state on 2026-09-15 — fifteen from the exit-device renames,
  plus DS011 and the LC04 case. Regenerating fixes them; this guard is what stops it
  happening again silently.
*/
const taxonomySources = new Set(
  [...readFileSync(TAXONOMY, "utf8").matchAll(/^location = (\S+)/gm)].map((m) =>
    m[1].endsWith("/") ? m[1] : `${m[1]}/`,
  ),
);
const chained = pairs.filter(([, url]) => taxonomySources.has(url));
if (chained.length) {
  throw new Error(
    `${chained.length} legacy id(s) point at a URL that is itself redirected: ` +
      chained.map(([aid, url]) => `${aid} -> ${url}`).join(", ") +
      "\nPoint them at the final destination; a 301 chain loses what the first hop carries.",
  );
}

/* --- emit ------------------------------------------------------------------------ */
const lines = [
  "# Generated by scripts/build-legacy-redirects.mjs — do not edit by hand.",
  "#",
  "# Maps the old DedeCMS product URLs to their replacements. Search Console still",
  "# lists these as indexed; without a 301 each one is a 404 that throws away its",
  "# accumulated ranking and any backlink pointing at it.",
  "#",
  `# ${pairs.length} of ${entries.length} legacy product ids resolve to a live page.`,
  "# The rest fall through to /products/ — a relevant hub, not the homepage, so it",
  "# reads as a genuine replacement rather than a soft 404.",
  "",
  "map $arg_aid $legacy_product_url {",
  "    default \"\";",
  ...pairs.map(([aid, url]) => `    ${aid} "${url}";`),
  "}",
  "",
  "# Category listings (tid=NNN).",
  "#",
  "# The original scrape never captured the tid -> category table, so every tid fell",
  "# through to /products/. Bing Webmaster Tools handed it over by accident: its",
  "# \"duplicate titles\" export lists each failing URL beside its <title>, and those",
  "# titles are the old DedeCMS category names. Eleven ids recovered that way.",
  "#",
  "# tid=97 alone carries 456 internal links in Search Console. Landing all of them on",
  "# the generic hub reads to Google as a soft 404; landing them on Lock Cases does not.",
  "map $arg_tid $legacy_category_url {",
  "    default \"\";",
  ...Object.entries(LEGACY_CATEGORY_TIDS).map(([tid, url]) => `    ${tid} "${url}";`),
  "    # Not recovered: still the hub rather than a guess.",
  "    ~^\\d+$ \"/products/\";",
  "}",
  "",
  "# ── Language, and the bare old homepage ──────────────────────────────────",
  "#",
  "# Search Console, 2026-09-04: https://www.cantonlock.com/index.php?lang=es carries",
  "# 31 impressions at average position 4.97 — one of the best-ranking URLs the company",
  "# has. It is the OLD SPANISH HOMEPAGE, and it was landing on /products/ in English.",
  "# A Spanish buyer arriving from a Spanish result on an English hub is a lost visitor",
  "# and a wasted ranking, and it is the single clearest thing in that export.",
  "#",
  "# $legacy_lang_prefix carries the language onto whatever the aid/tid maps resolved to,",
  "# so an old Spanish category URL lands on the Spanish category rather than the English",
  "# one. Safe for every target those maps emit: /products/, /company/, /contact/ and",
  "# every category and product path all have a Spanish mirror (src/lib/spanish-mirror.ts).",
  "#",
  "# The \"es/\" key is not a typo. Search Console's 404 export of 2026-09-17 contains",
  "# https://www.cantonlock.com/index.php?lang=es/ — a trailing slash inside the QUERY",
  "# VALUE, from a link somebody wrote by hand years ago. nginx matches map keys exactly,",
  "# so \"es/\" fell to the default and a Spanish visitor was sent to the English tree.",
  "# One line is cheaper than the page it loses.",
  "map $arg_lang $legacy_lang_prefix {",
  "    default \"\";",
  "    es \"/es\";",
  "    \"es/\" \"/es\";",
  "}",
  "",
  "# The same, for the case where nothing resolved and the fallback is the site root.",
  "map $arg_lang $legacy_lang_home {",
  "    default \"/\";",
  "    es \"/es/\";",
  "    \"es/\" \"/es/\";",
  "}",
  "",
  "# Whether index.php was asking for a PAGE or was simply the old homepage.",
  "#",
  "# These were the same destination before, and they are not the same request. A bare",
  "# index.php is the old front page and belongs on the new front page; an aid or tid we",
  "# could not resolve is a request for a specific page, and /products/ is the honest",
  "# nearest thing. Sending the old homepage to /products/ answered a question nobody",
  "# asked and lost the homepage's own accumulated ranking.",
  "map \"$arg_aid$arg_tid\" $legacy_fallback_path {",
  "    default \"products/\";",
  "    \"\" \"\";",
  "}",
  "",
];

const conf = lines.join("\n");

/*
  --check is the whole reason the staleness lasted eleven days.

  The taxonomy conf has `npm run redirects:taxonomy` and a place in the deploy routine;
  this one had neither, so it was generated on 2026-09-04 and never again. Nothing in the
  repo could tell that its targets had drifted away from the catalogue — the drift only
  showed up as a redirect chain on the live site. `test:export` now regenerates and
  compares, which is the same guarantee every other generated file here already has.
*/
if (check) {
  if (readFileSync(OUT, "utf8") !== conf) {
    console.error(`${OUT} is out of date — run: npm run redirects:legacy`);
    console.error("  The catalogue moved and these 301s did not follow it.");
    process.exit(1);
  }
  console.log(`${OUT} — up to date (${pairs.length} product ids, no chains)`);
} else {
  mkdirSync("deploy/nginx", { recursive: true });
  writeFileSync(OUT, conf);

  console.log(`${OUT}`);
  console.log(`  resolved   ${pairs.length} / ${entries.length}`);
  console.log(`  overrides  ${Object.keys(LEGACY_AID_OVERRIDES).length} (aid 205, 381, 1608)`);
  console.log("  chains     0");
}
