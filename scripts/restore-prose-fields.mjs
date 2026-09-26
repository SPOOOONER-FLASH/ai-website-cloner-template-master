#!/usr/bin/env node
/**
 * After a translator run, puts the prose fields back to what HEAD holds.
 *
 * WHY THIS EXISTS. `translate-products-es.mjs` and `-pt.mjs` regenerate a record whole:
 * changing one spec row rewrites `summary*` and the four SEO fields as a side effect. Those
 * fields are not the spec lane's to write —
 *
 *     summary* / description* / features*      the copy session
 *     seoTitle* / seoDescription*              the engineering session
 *
 * — and a full run flattens 240 `summaryEs` into assembler stubs ("Una barra antipánico."),
 * which is the 2026-09-11 class of defect: a generator undoing work it cannot see. Measured
 * on 2026-09-24; see docs/collaboration/agent-updates/2026-09-24-claude-es-values-harvest.md.
 *
 * So the working order for any spec change is three steps, not one:
 *
 *     node scripts/translate-products-es.mjs --only "<models>" --write
 *     node scripts/translate-products-pt.mjs --only "<models>" --write
 *     node scripts/restore-prose-fields.mjs
 *
 * and the diff that comes out is spec rows only. Run it even after a narrow `--only`: the
 * rewrite happens per record, so three records are enough to lose three summaries.
 *
 * This compares against HEAD, so COMMIT or stash any deliberate prose edit of your own
 * first, or this will put it back. That is the point of it, but it cuts both ways.
 *
 *   node scripts/restore-prose-fields.mjs
 *   node scripts/restore-prose-fields.mjs --check    exit 1 if anything would be restored
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const check = process.argv.includes("--check");

/* Every field whose words are somebody else's lane. Spec rows are deliberately absent. */
const PROSE = [
  "summary",
  "summaryEs",
  "summaryPt",
  "seoTitle",
  "seoDescription",
  "seoTitleEs",
  "seoDescriptionEs",
  "seoTitlePt",
  "seoDescriptionPt",
];

let changed = 0;
const restored = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = `${DIR}/${file}`;
  const current = JSON.parse(readFileSync(path, "utf8"));

  let head;
  try {
    head = JSON.parse(
      execFileSync("git", ["show", `HEAD:${path}`], { encoding: "utf8", maxBuffer: 1 << 26 }),
    );
  } catch {
    continue; // a record added since HEAD has nothing to be restored to
  }

  let touched = false;
  for (const key of PROSE) {
    if (head[key] !== undefined && current[key] !== head[key]) {
      current[key] = head[key];
      restored.push(`${current.model} · ${key}`);
      touched = true;
    } else if (head[key] === undefined && current[key] !== undefined) {
      /* The generator invented a field the record never had. */
      delete current[key];
      restored.push(`${current.model} · ${key} (removed)`);
      touched = true;
    }
  }

  if (touched) {
    if (!check) writeFileSync(path, `${JSON.stringify(current, null, 2)}\n`);
    changed += 1;
  }
}

if (check) {
  if (!changed) {
    console.log("✓ no prose field has drifted from HEAD");
    process.exit(0);
  }
  console.error(`✗ ${changed} record(s) have prose changes a translator run would have made.`);
  console.error("  Run scripts/restore-prose-fields.mjs, or commit them deliberately.");
  for (const r of restored.slice(0, 20)) console.error("    " + r);
  process.exit(1);
}

console.log(`restored prose on ${changed} record(s)`);
for (const r of restored.slice(0, 20)) console.log("  " + r);
if (restored.length > 20) console.log(`  … ${restored.length - 20} more`);
