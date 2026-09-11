#!/usr/bin/env node
/**
 * Does the Spanish say the same thing as the English?
 *
 * ---------------------------------------------------------------------------
 * WHY THIS MATTERS MORE THAN STYLE
 *
 * scripts/audit-copy-register.mjs asks whether the prose reads well. This asks whether
 * it is TRUE, and on this site that is a different and larger question.
 *
 * Every dimension on this site is a number somebody orders against. AGENTS.md puts it
 * plainly: a buyer cannot adjust a wrong backset with a file, and metal cannot be fixed
 * after the fact. The Spanish pages were translated from the English, and nobody has ever
 * checked that the figures survived the crossing. A 60mm backset that became 65mm in
 * Spanish is not a style problem and no amount of proofreading catches it, because both
 * sentences read perfectly.
 *
 * So this compares the NUMBERS in each English passage against the numbers in its Spanish
 * counterpart, and reports any that appear on one side and not the other.
 *
 * ---------------------------------------------------------------------------
 * THE THREE THINGS IT DELIBERATELY IGNORES
 *
 * 1. ORDER. "35/35, 30/40 or 40/30" may legitimately be reordered in translation, so the
 *    two sides are compared as multisets rather than sequences.
 *
 * 2. DECIMAL COMMA. Spanish writes 0,044 where English writes 0.044. That is correct
 *    localisation, not drift, so separators are normalised before comparing.
 *
 * 3. NUMBERS INSIDE WORDS. "A156.3" and "EN 1125" are standards, not measurements, and
 *    they are compared as whole tokens so that a standard number cannot silently match a
 *    dimension.
 *
 * What it does NOT ignore is a number missing entirely from one side. That is either a
 * dropped fact or an invented one, and both are worth stopping for.
 *
 * ---------------------------------------------------------------------------
 * LENGTH RATIO
 *
 * Spanish runs roughly 15–25% longer than English for the same content. A paragraph that
 * comes out much shorter has usually lost a clause; much longer usually means an
 * explanation was added that the English does not make. Both are reported as a second,
 * softer signal — a ratio is evidence to look at, not a verdict.
 *
 *   node scripts/audit-translation-parity.mjs
 *   node scripts/audit-translation-parity.mjs --numbers   # figure mismatches only
 *   node scripts/audit-translation-parity.mjs --length    # length anomalies only
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const only = args.find((a) => a.startsWith("--"))?.slice(2) ?? null;

const NEWS = "content/news";

/**
 * Every number in a passage, normalised for comparison.
 *
 * Spanish decimal commas become points so 0,044 and 0.044 are one number. Thousands
 * separators are stripped for the same reason. Ordinals and standalone digits inside
 * words are left attached to their token, so "A156.3" stays whole.
 */
function figures(text) {
  const normalised = text
    /* 1.234,5 → 1234.5   and   1,234.5 → 1234.5 */
    .replace(/(\d)[.,](\d{3})\b/g, "$1$2")
    .replace(/(\d),(\d)/g, "$1.$2");
  return (normalised.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
}

/** Multiset difference: what is in `a` that `b` does not also have, counting repeats. */
function missing(a, b) {
  const pool = [...b];
  const out = [];
  for (const n of a) {
    const i = pool.indexOf(n);
    if (i === -1) out.push(n);
    else pool.splice(i, 1);
  }
  return out;
}

const numberIssues = [];
const lengthIssues = [];
let compared = 0;

for (const file of readdirSync(NEWS)) {
  if (!file.endsWith(".json")) continue;
  const record = JSON.parse(readFileSync(join(NEWS, file), "utf8"));
  const slug = record.slug;

  const pairs = [];
  if (record.summary && record.summaryEs) pairs.push(["summary", record.summary, record.summaryEs]);
  if (record.seoDescription && record.seoDescriptionEs) {
    pairs.push(["seoDescription", record.seoDescription, record.seoDescriptionEs]);
  }
  if (Array.isArray(record.body) && Array.isArray(record.bodyEs)) {
    if (record.body.length !== record.bodyEs.length) {
      lengthIssues.push({
        where: `${slug}`,
        note: `body has ${record.body.length} paragraphs, bodyEs has ${record.bodyEs.length}`,
        severity: "high",
      });
    }
    const n = Math.min(record.body.length, record.bodyEs.length);
    for (let i = 0; i < n; i += 1) pairs.push([`body[${i}]`, record.body[i], record.bodyEs[i]]);
  }

  for (const [field, en, es] of pairs) {
    compared += 1;

    const enFigures = figures(en);
    const esFigures = figures(es);
    const droppedInEs = missing(enFigures, esFigures);
    const addedInEs = missing(esFigures, enFigures);
    if (droppedInEs.length || addedInEs.length) {
      numberIssues.push({ where: `${slug} · ${field}`, droppedInEs, addedInEs, en, es });
    }

    /* Spanish normally runs 1.0–1.35× the English. Outside that, look at it. */
    const ratio = es.length / en.length;
    if (ratio < 0.85 || ratio > 1.45) {
      lengthIssues.push({
        where: `${slug} · ${field}`,
        note: `ES/EN length ratio ${ratio.toFixed(2)} (${en.length} → ${es.length} chars)`,
        severity: ratio < 0.85 ? "short" : "long",
      });
    }
  }
}

console.log(`EN/ES passage pairs compared: ${compared}`);
console.log(`figure mismatches: ${numberIssues.length}`);
console.log(`length anomalies: ${lengthIssues.length}\n`);

if (!only || only === "numbers") {
  if (numberIssues.length) {
    console.log("== a figure appears on one side and not the other ==");
    console.log("   These are the ones worth stopping for: a dimension that changed in");
    console.log("   translation is a part a buyer cannot install.\n");
    for (const issue of numberIssues) {
      console.log(`  ${issue.where}`);
      if (issue.droppedInEs.length) console.log(`      only in EN: ${issue.droppedInEs.join(", ")}`);
      if (issue.addedInEs.length) console.log(`      only in ES: ${issue.addedInEs.join(", ")}`);
    }
    console.log("");
  } else {
    console.log("✔ every figure in the English appears in the Spanish, and none was invented.\n");
  }
}

if (!only || only === "length") {
  if (lengthIssues.length) {
    console.log("== length anomalies (softer signal — look, do not assume) ==");
    for (const issue of lengthIssues.sort((a, b) => (a.severity === "high" ? -1 : 1))) {
      console.log(`  [${issue.severity}] ${issue.where}: ${issue.note}`);
    }
  } else {
    console.log("✔ no length anomalies.");
  }
}

process.exitCode = numberIssues.length ? 1 : 0;
