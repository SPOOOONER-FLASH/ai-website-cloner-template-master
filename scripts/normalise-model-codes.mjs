/**
 * Makes one model-number prefix look the same everywhere it appears.
 *
 *   node scripts/normalise-model-codes.mjs            report only
 *   node scripts/normalise-model-codes.mjs --write    apply
 *   node scripts/normalise-model-codes.mjs --check    exit 1 if anything is inconsistent
 *
 * ---------------------------------------------------------------------------
 * WHY THIS MATTERS ON THIS SITE IN PARTICULAR
 *
 * Building /model-lookup on 2026-09-14 printed two of our own lock cases next to each
 * other:
 *
 *     Lc14 85×50mm
 *     LC04 85*60
 *
 * A survey of the catalogue found 29 records written `Lc` and 13 written `LC` — the same
 * prefix, two spellings, inside one category. Every other prefix in the catalogue is
 * upper case: DS011, DV12, HY007, SSH016, BH01, AR4, LH852, F101, G1169, T1018. `Lc` is
 * the outlier, so the fix is to raise it rather than lower the rest.
 *
 * AGENTS.md states the reason this is worth a commit of its own: "Consistency IS the
 * argument. Fifteen product plates shot identically say 'this is a factory with a
 * process'; fifteen shot differently say 'these came from somewhere'." A model number is
 * the smallest unit that argument is made in. A buyer comparing two quotations from us
 * should not have to wonder whether `Lc14` and `LC14` are two different parts.
 *
 * ---------------------------------------------------------------------------
 * WHY IT REPLACES TEXT RATHER THAN ONE FIELD
 *
 * The model number is not only in `model`. It is in image alt text, in `seoTitle`, in
 * `seoDescription`, in both Spanish variants, and — the one that would have been missed —
 * in the `relatedModels` arrays of OTHER products and of news articles, which match by
 * string. Rewriting `model` alone would have left those arrays pointing at a model number
 * that no longer exists, and nothing in the build would have said so.
 *
 * So the replacement is textual, over whole JSON files, anchored on a digit following the
 * prefix. `\bLc(?=\d)` cannot match an English word: no word in the copy is followed
 * immediately by a digit in that shape.
 *
 * SLUGS ARE NOT TOUCHED. They are lower case by construction and are the URL — changing
 * one would retire a live page to fix a display string, which is a bad trade and would
 * need a redirect entry rather than a rename.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Prefixes to raise, with the digit lookahead that keeps them out of prose.
 *
 * One entry today. The list exists so the next inconsistency found is a line rather than
 * a new script.
 */
const PREFIXES = [{ wrong: /\bLc(?=\d)/g, right: "LC", label: "Lc → LC" }];

const DIRECTORIES = ["content/products", "content/news", "content/projects"];

const write = process.argv.includes("--write");
const check = process.argv.includes("--check");

/**
 * `--skip-modified`: leave files another session is holding open.
 *
 * This checkout is shared, and a bulk textual rewrite is exactly the operation that
 * sweeps somebody else's uncommitted work into your commit — git stages a whole file,
 * not the lines you changed in it. On 2026-09-14 five news articles were mid-edit by
 * another session while this script wanted to rewrite a model number in their body copy.
 *
 * Skipping them costs one follow-up run and keeps both commits readable. The files are
 * listed on exit so the follow-up is not forgotten.
 */
const skipModified = process.argv.includes("--skip-modified");

const POSIX_SEPARATOR = /\\/g;

const modified = new Set(
  skipModified
    ? execFileSync("git", ["status", "--porcelain", "--", ...DIRECTORIES], { encoding: "utf8" })
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => line.slice(3).trim().replace(POSIX_SEPARATOR, "/"))
    : [],
);
const deferred = [];

let filesChanged = 0;
let replacements = 0;
const touched = [];

for (const directory of DIRECTORIES) {
  let entries;
  try {
    entries = readdirSync(directory);
  } catch {
    continue;
  }

  for (const file of entries) {
    if (!file.endsWith(".json")) continue;
    const path = join(directory, file);
    if (modified.has(path.replace(POSIX_SEPARATOR, "/"))) {
      const raw = readFileSync(path, "utf8");
      if (PREFIXES.some((prefix) => prefix.wrong.test(raw))) deferred.push(path);
      for (const prefix of PREFIXES) prefix.wrong.lastIndex = 0;
      continue;
    }
    const before = readFileSync(path, "utf8");
    let after = before;
    let hits = 0;

    for (const prefix of PREFIXES) {
      const matches = after.match(prefix.wrong);
      if (!matches) continue;
      hits += matches.length;
      after = after.replace(prefix.wrong, prefix.right);
    }

    if (!hits) continue;
    filesChanged += 1;
    replacements += hits;
    touched.push(`${path} (${hits})`);
    if (write) writeFileSync(path, after);
  }
}

function reportDeferred() {
  if (!deferred.length) return;
  console.log("\ndeferred — another session has these open, re-run after they commit:");
  for (const path of deferred) console.log(`  ${path}`);
}

if (!filesChanged) {
  console.log("model codes: consistent");
  reportDeferred();
  process.exit(0);
}

console.log(
  `${write ? "rewrote" : "would rewrite"} ${replacements} occurrence(s) in ${filesChanged} file(s)`,
);
for (const line of touched) console.log(`  ${line}`);
reportDeferred();

if (check) {
  console.error("\n❌ model prefixes are written more than one way.");
  console.error("   Run: node scripts/normalise-model-codes.mjs --write");
  process.exit(1);
}
