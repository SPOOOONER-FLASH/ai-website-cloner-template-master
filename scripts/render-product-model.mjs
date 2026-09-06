#!/usr/bin/env node
/**
 * Renders a product from the dimensions the catalogue publishes, using Blender headless.
 *
 * ---------------------------------------------------------------------------
 * WHAT THIS IS FOR
 *
 * The catalogue has 435 products and 31 with enough geometry to draw. The other 404 are
 * blocked on the factory sending drawings, and no amount of software fixes that. This
 * covers the 31 — and, more importantly, it is the mechanism that makes the other 404
 * usable the day their numbers arrive, without anybody redesigning anything.
 *
 * ---------------------------------------------------------------------------
 * THE ONE RULE THIS FILE ENFORCES
 *
 * Every dimension handed to Blender is parsed out of the product's own spec rows. If a
 * dimension a model needs is not published, this REFUSES rather than substituting a
 * standard value. A 45mm backset is not a safe default just because it is common: the
 * whole reason to render from drawings instead of imagining is that the numbers are
 * load-bearing, and a default is a guess with a constant's face on.
 *
 * ---------------------------------------------------------------------------
 * WHY BLENDER AND NOT AN IMAGE MODEL
 *
 * An image model produces a plausible lock. Blender produces THIS lock, because the
 * spindle bore is at y = 45mm because the record says 45mm. The difference is not
 * quality; it is whether a buyer can order from the picture.
 *
 * Usage:
 *   node scripts/render-product-model.mjs --slug lc07-85-45mm-lock-case
 *   node scripts/render-product-model.mjs --slug ... --samples 256 --out tmp/renders
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i > -1 ? args[i + 1] : d;
};

/*
  Blender is not on PATH on this machine; it is a normal Windows install. Looked up rather
  than hard-coded to one version so a Blender upgrade does not silently break the script
  with a "file not found" that reads like a bug in the model.
*/
function findBlender() {
  const fromEnv = process.env.BLENDER_PATH;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;
  const roots = [
    "C:/Program Files/Blender Foundation",
    "C:/Program Files (x86)/Blender Foundation",
  ];
  for (const root of roots) {
    if (!existsSync(root)) continue;
    /* Newest version first, so an upgrade is picked up without editing this file. */
    for (const version of readdirSync(root).sort().reverse()) {
      const exe = join(root, version, "blender.exe");
      if (existsSync(exe)) return exe;
    }
  }
  return null;
}

/**
 * The first millimetre figure in a recorded value.
 *
 * Spec strings are prose as often as they are numbers — "13mm, with inside deadlocking
 * button", "25mm on rim deadbolt versions". The leading figure is the dimension; the rest
 * is the qualifier that makes it honest. Taking the first is right, and taking the last
 * would silently prefer the exception.
 */
function firstMm(value) {
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? Number(m[1].replace(",", ".")) : null;
}

/** "240 × 23mm" → [240, 23]. Both figures, in the order written. */
function pairMm(value) {
  const m = String(value).match(/(\d+(?:[.,]\d+)?)\s*[×x*]\s*(\d+(?:[.,]\d+)?)\s*mm/i);
  return m ? [Number(m[1].replace(",", ".")), Number(m[2].replace(",", "."))] : null;
}

/** What each model type needs before it can be drawn at all. */
const MODELS = {
  "lock-cases": {
    script: "scripts/blender/lock-case.py",
    /* label → param, and how to read it. Every one of these is required. */
    required: {
      centreDistance: { labels: ["Centre distance", "Center Distance"], read: firstMm },
      backset: { labels: ["Backset"], read: firstMm },
      caseHeight: { labels: ["Case height"], read: firstMm },
      caseDepth: { labels: ["Case depth"], read: firstMm },
    },
    pairs: {
      faceplate: { labels: ["Faceplate"], into: ["faceplateLength", "faceplateWidth"] },
    },
  },
};

const slug = flag("slug");
if (!slug) {
  console.error("need --slug");
  process.exit(1);
}

const file = join("content/products", `${slug}.json`);
if (!existsSync(file)) {
  console.error(`no such product: ${slug}`);
  process.exit(1);
}
const product = JSON.parse(readFileSync(file, "utf8"));
const family = product.categoryPath?.[0];
const model = MODELS[family];
if (!model) {
  console.error(
    `no parametric model for family "${family}". Modelled families: ${Object.keys(MODELS).join(", ")}`,
  );
  process.exit(1);
}

const specs = new Map((product.specs ?? []).map((s) => [s.label, s.value]));
const params = { samples: Number(flag("samples", 96)) };
const missing = [];

for (const [param, spec] of Object.entries(model.required)) {
  const label = spec.labels.find((l) => specs.has(l));
  const value = label ? spec.read(specs.get(label)) : null;
  if (value == null) missing.push(spec.labels[0]);
  else params[param] = value;
}
for (const spec of Object.values(model.pairs ?? {})) {
  const label = spec.labels.find((l) => specs.has(l));
  const pair = label ? pairMm(specs.get(label)) : null;
  if (!pair) missing.push(spec.labels[0]);
  else spec.into.forEach((name, i) => { params[name] = pair[i]; });
}

/* Optional: drawn only where published, never defaulted into existence here. */
const spindle = firstMm(specs.get("Spindle") ?? specs.get("Spindle Hole") ?? "");
if (spindle) params.spindle = spindle;

if (missing.length) {
  console.error(`${slug}: cannot render — the catalogue does not publish ${missing.join(", ")}.`);
  console.error("Ask the factory for those figures. Nothing is substituted.");
  process.exit(2);
}

const blender = findBlender();
if (!blender) {
  console.error("Blender not found. Set BLENDER_PATH to blender.exe.");
  process.exit(1);
}

const outDir = flag("out", "tmp/claude-renders");
mkdirSync(outDir, { recursive: true });
const paramFile = join(outDir, `${slug}.params.json`);
/*
  Absolute, because Blender resolves a relative render path against the DRIVE ROOT rather
  than the working directory. The first attempt passed "tmp/claude-renders/x.png" and
  Blender wrote it to C:\tmp\claude-renders\x.png, then reported success — which is
  exactly the failure the BLENDER_OK check below exists for, and it caught this on its
  first outing.
*/
const image = resolve(outDir, `${slug}.png`);
writeFileSync(paramFile, `${JSON.stringify(params, null, 1)}\n`);

console.log(`${slug} — every figure below is published by the catalogue:`);
for (const [k, v] of Object.entries(params)) {
  if (k === "samples") continue;
  console.log(`  ${k.padEnd(18)} ${v}mm`);
}

/*
  CHECK THE MARKER, NOT THE EXIT CODE.

  The first run of this printed "-> …png" for a render that never happened. Blender
  reported a Python traceback (`use_auto_smooth` was removed in 4.1) and still exited 0,
  so execFileSync raised nothing and the script congratulated itself. A build tool that
  says "done" when it did nothing is worse than one that crashes, because the next person
  goes looking for the file instead of the error.

  So the Python script prints BLENDER_OK as its last act, and this refuses to report
  success without both that line and a file on disk.
*/
const out = execFileSync(
  blender,
  ["--background", "--python", model.script, "--", paramFile, image],
  { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
);

/*
  statSync().isFile(), not existsSync(). A typo left `image` pointing at the OUTPUT
  DIRECTORY for one run, and existsSync said yes — so the guard that was written to stop
  false success reported false success. A check on the wrong noun is not a check.
*/
const rendered = existsSync(image) && statSync(image).isFile() && statSync(image).size > 0;
if (!out.includes("BLENDER_OK") || !rendered) {
  console.error("\nrender FAILED — Blender output follows:\n");
  console.error(out.split("\n").slice(-25).join("\n"));
  process.exit(1);
}
console.log(`\n-> ${image}`);
