#!/usr/bin/env node
/**
 * Finds products whose name on this site disagrees with the name on stahlock.
 *
 * WHY THIS IS WORTH CHECKING. stahlock.com is the client's other storefront — same
 * company, same products, and the client confirmed on 2026-09-04 that its copy has been
 * checked by a person. So where the two sites call the same model number two different
 * things, one of them is wrong, and it is not automatically ours.
 *
 * The case that prompted this: model 015 is "Panic Exit Device" here and
 * "STAHLOCK MODEL: 015 - Trim Handle" there. Our own spec row on that page already says
 * "Used in combination with push bar and lock" — which is a trim, not a device. Bing's
 * keyword research puts `abs-015` at 169 impressions, the largest single keyword signal
 * the site has, so the page carrying a wrong product type is not a cosmetic problem.
 *
 * WHAT THIS DOES NOT DO. It does not rename anything. A rename moves a URL, and moving a
 * URL that is currently ranking is a decision with a cost — it needs a redirect, it resets
 * the page's history, and here it would be done on the strength of a page title scraped
 * from another site. The output is a question for the client, not an edit.
 *
 * MATCHING IS ON THE NOUN, NOT THE STRING. "607 SSET Tubular Lock" and
 * "STAHLOCK MODEL: 607 SSET - Tubular Lock" are the same name in two house styles, and a
 * string comparison would report all 305 as drift. What matters is whether the two sites
 * disagree about WHAT THE PRODUCT IS, so the comparison is over the product nouns each
 * name contains.
 *
 * Usage: node scripts/audit-name-drift.mjs [--all]
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CACHE = "docs/research/stahlock-features.json";
const DIR = "content/products";

const cache = JSON.parse(readFileSync(CACHE, "utf8"));

/**
 * The product nouns a name contains.
 *
 * Ordered longest-first so "exit device" is recognised before "device", and "lock case"
 * before "lock" — otherwise every lock case would read as agreeing with every lock.
 */
const NOUNS = [
  "panic exit device", "exit device", "trim handle", "lever handle", "grip handle",
  "pull handle", "door handle", "flush bolt", "hook lock", "rim lock", "night latch",
  "door viewer", "door closer", "door stopper", "floor spring", "patch fitting",
  "lock cylinder", "lock case", "lock body", "cylindrical lock", "tubular lock",
  "mortise lock", "commercial lock", "knob lock", "deadbolt", "door guard",
  "escutcheon", "indicator", "hinge", "latch", "trim", "handle", "lock", "bolt", "device",
];

const nounsIn = (text) => {
  const s = ` ${String(text ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  const found = [];
  let remaining = s;
  for (const noun of NOUNS) {
    if (remaining.includes(` ${noun} `)) {
      found.push(noun);
      /* Consume it, so "panic exit device" does not also count as "device". */
      remaining = remaining.replace(` ${noun} `, " ");
    }
  }
  return found;
};

/** stahlock titles read "STAHLOCK MODEL: 015 - Trim Handle". Only the tail is the name. */
const stahlockName = (title) =>
  String(title ?? "").replace(/^\s*STAHLOCK\s+MODEL\s*:\s*/i, "").replace(/^[^-]*-\s*/, "").trim();

const rows = [];
for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const product = JSON.parse(readFileSync(join(DIR, file), "utf8"));
  const entry = cache[product.slug];
  if (!entry?.title) continue;

  const theirs = stahlockName(entry.title);
  if (!theirs) continue;

  const ourNouns = nounsIn(product.name);
  const theirNouns = nounsIn(theirs);
  if (!ourNouns.length || !theirNouns.length) continue;

  /* Agreement is a shared noun. Different words for the same thing are not drift. */
  if (ourNouns.some((n) => theirNouns.includes(n))) continue;

  rows.push({
    model: product.model,
    ours: product.name,
    theirs,
    ourNouns: ourNouns.join("/"),
    theirNouns: theirNouns.join("/"),
    url: entry.url,
    published: Boolean(product.heroImage?.src),
  });
}

rows.sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));

console.log(
  `${Object.keys(cache).length} products mapped to stahlock · ${rows.length} where the two sites disagree about what the product is\n`,
);

const show = process.argv.includes("--all") ? rows : rows.slice(0, 30);
for (const r of show) {
  console.log(`  ${r.model.padEnd(12)} ours: ${r.ours}`);
  console.log(`  ${" ".repeat(12)} them: ${r.theirs}${r.published ? "" : "   (unpublished here)"}`);
}
if (rows.length > show.length) console.log(`\n  … ${rows.length - show.length} more (--all)`);
