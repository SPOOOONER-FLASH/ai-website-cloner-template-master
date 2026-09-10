#!/usr/bin/env node
/**
 * Repairs the 2026-09-10 panic-device rename, which half-applied.
 *
 * ---------------------------------------------------------------------------
 * WHAT WENT WRONG, TWICE, IN TWO DIFFERENT WAYS
 *
 * Fifteen records in `panic-exit-devices` were named "Panic Exit Device" while their own
 * `Type` spec row said "Trim handle · outside lever" (fourteen of them) or "Profile lock
 * case" (one). rename-product-slug.mjs was run over them, and two faults surfaced:
 *
 *  1. THIRTEEN RECORDS GOT A DOUBLED SLUG. `retarget()` rewrites every string containing
 *     the old slug, and it was applied to an object whose `slug` had ALREADY been set to
 *     the new one. Because the new slug contains the old as a prefix
 *     (`001-panic-exit-device` → `001-panic-exit-device-trim`), the replacement fired on
 *     the new value too and produced `001-panic-exit-device-trim-trim`. The FILE was named
 *     correctly, so record and filename disagreed. Fixed at source in that script; this
 *     repairs the records it already wrote.
 *
 *  2. 023 PS DIED PARTWAY. Its assets were renamed and its record never was, leaving a
 *     record pointing at filenames that no longer existed and duplicate images in
 *     products-hyde. Windows file-lock contention (errno -4094) is the standing suspect —
 *     see the note in AGENTS.md — and the script does its asset moves before the record
 *     write with no rollback, so a mid-run failure lands exactly here.
 *
 * Idempotent: run it twice and the second run reports nothing to do.
 *
 *   node scripts/repair-panic-trim-rename-20260910.mjs [--write]
 */

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";
const ASSET_DIRS = ["public/images/products", "public/images/products-hyde", "public/videos/products"];
const MOVES = "content/taxonomy-moves.json";
const write = process.argv.includes("--write");

const md5 = (path) => createHash("md5").update(readFileSync(path)).digest("hex");
const plan = [];

/* ---- fault 1: a record whose slug does not equal its own filename ---------------- */

for (const file of readdirSync(DIR)) {
  if (!file.endsWith(".json")) continue;
  const path = join(DIR, file);
  const record = JSON.parse(readFileSync(path, "utf8"));
  const expected = file.replace(/\.json$/, "");
  if (record.slug === expected) continue;
  plan.push({
    what: `slug ${record.slug} → ${expected}`,
    run: () => {
      record.slug = expected;
      writeFileSync(path, `${JSON.stringify(record, null, 2)}\n`);
    },
  });
}

/* ---- fault 2: finish 023 PS ------------------------------------------------------ */

const OLD = "023-ps-panic-exit-device";
const NEW = "023-ps-panic-exit-device-trim";
const oldPath = join(DIR, `${OLD}.json`);

if (existsSync(oldPath)) {
  /*
    Assets first. A plain file whose -trim twin already exists is a byte-identical
    duplicate left by the interrupted run — verified by hash before removing, because
    "probably the same image" is not a reason to delete a photograph.
  */
  for (const dir of ASSET_DIRS) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!name.startsWith(OLD) || name.startsWith(NEW)) continue;
      const target = name.replace(OLD, NEW);
      const from = join(dir, name);
      const to = join(dir, target);
      if (existsSync(to)) {
        if (md5(from) !== md5(to)) {
          console.error(`× ${from} and ${to} differ — not touching either. Resolve by hand.`);
          process.exitCode = 1;
          continue;
        }
        plan.push({ what: `delete duplicate ${from} (identical to ${target})`, run: () => unlinkSync(from) });
      } else {
        plan.push({ what: `move ${from} → ${target}`, run: () => renameSync(from, to) });
      }
    }
  }

  plan.push({
    what: `record ${OLD} → ${NEW}, name → Panic Exit Device Trim`,
    run: () => {
      const raw = readFileSync(oldPath, "utf8").split(OLD).join(NEW);
      const record = JSON.parse(raw);
      record.name = "Panic Exit Device Trim";
      record.slug = NEW;
      writeFileSync(join(DIR, `${NEW}.json`), `${JSON.stringify(record, null, 2)}\n`);
      unlinkSync(oldPath);
    },
  });

  /* The 301 the interrupted run never wrote. Without it the indexed URL 404s. */
  const moves = JSON.parse(readFileSync(MOVES, "utf8"));
  if (!(moves.productMerges ?? []).some((m) => m.from === OLD)) {
    plan.push({
      what: `301 ${OLD} → ${NEW}`,
      run: () => {
        const current = JSON.parse(readFileSync(MOVES, "utf8"));
        current.productMerges = current.productMerges ?? [];
        current.productMerges.push({
          from: OLD,
          to: NEW,
          category: "panic-exit-devices",
          why: "Renamed Panic Exit Device → Panic Exit Device Trim; the record's own Type row reads outside lever trim.",
        });
        writeFileSync(MOVES, `${JSON.stringify(current, null, 2)}\n`);
      },
    });
  }
}

if (!plan.length) {
  console.log("✔ nothing to repair.");
  process.exit(0);
}

for (const step of plan) console.log(`  ${step.what}`);
if (!write) {
  console.log(`\n${plan.length} change(s). --write not given; nothing changed.`);
  process.exit(0);
}
for (const step of plan) step.run();
console.log(`\n✔ ${plan.length} change(s) applied. Now run npm run content.`);
