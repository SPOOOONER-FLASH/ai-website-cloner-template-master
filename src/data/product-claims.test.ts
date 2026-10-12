import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * No HYDE product page claims a grade, a fire rating or a certificate that no certificate
 * on file supports (2026-10-12).
 *
 * The site says in its own words that there is no ANSI/BHMA certification and no UL listing
 * among the factory's credentials, and that nothing it publishes will imply one until
 * certificate numbers exist. Three records still said "Standards: ANSI Grade 2/3" (copied
 * from Alibaba and stahlock.com listings), three panic devices carried a "Fire Rating" row in
 * hours, and nineteen records listed ISO 9001 as a product certification, which then became a
 * "Which standards does it hold?" FAQ answer. ISO 9001 is the company's quality system
 * (src/data/company.ts), not a property of a product, so it stays company-level only.
 *
 * Checked in all ten homes of the text: the record's en/es/pt fields and the seven overlays.
 */
const DIR = path.join(process.cwd(), "content/products");
const LOCALES = ["fr", "de", "ja", "ko", "tr", "ru", "ar"];

const ANSI_GRADE = /ANSI(\/BHMA)?\s*(Grade|grado|الدرجة)/i;
const FIRE_LABEL = /^fire rating$/i;
const HOURS = /\d[\d.,]*\s*(?:(?:hours?|heures?|Stunden|horas|saat)\b|час|ساعة|時間|시간)/i;
const FIRE = /fire|feu|feuer|brand|fuego|fogo|incend|yangın|огн|пожар|حريق|耐火|防火|화재|방화/i;

type Spec = { label: string; value: string };
type Texts = { where: string; prose: unknown[]; specs: Spec[] };

const hyde = new Map<string, Record<string, unknown>>();
for (const file of fs.readdirSync(DIR).filter((name) => name.endsWith(".json"))) {
  const record = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")) as Record<string, unknown>;
  const sites = record.sites as string[] | undefined;
  if (!sites || sites.includes("hyde")) hyde.set(file.replace(/\.json$/, ""), record);
}

const list = (value: unknown): unknown[] => (value == null ? [] : Array.isArray(value) ? value : [value]);

function* texts(): Generator<Texts> {
  for (const [id, record] of hyde) {
    for (const suffix of ["", "Es", "Pt"]) {
      yield {
        where: `${id}${suffix ? ` (${suffix.toLowerCase()})` : ""}`,
        prose: ["features", "summary", "description"].flatMap((f) => list(record[f + suffix])),
        specs: list(record["specs" + suffix]) as Spec[],
      };
    }
  }
  for (const locale of LOCALES) {
    const overlay = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), `content/i18n/${locale}/products.json`), "utf8"),
    ) as Record<string, Record<string, unknown>>;
    for (const [id, entry] of Object.entries(overlay)) {
      if (!hyde.has(id)) continue;
      yield {
        where: `${locale}/${id}`,
        prose: ["features", "summary", "description"].flatMap((f) => list(entry[f])),
        specs: list(entry.specs) as Spec[],
      };
    }
  }
}

test("no HYDE product text claims an ANSI grade", () => {
  const found: string[] = [];
  for (const { where, prose, specs } of texts()) {
    for (const line of [...prose, ...specs.map((s) => `${s.label}: ${s.value}`)]) {
      if (typeof line === "string" && ANSI_GRADE.test(line)) found.push(`${where}: ${line}`);
    }
  }
  assert.deepEqual(found, []);
});

test("no HYDE spec table carries a fire rating", () => {
  const found: string[] = [];
  for (const { where, specs } of texts()) {
    for (const { label = "", value = "" } of specs) {
      if (FIRE_LABEL.test(label) || (HOURS.test(value) && FIRE.test(`${label} ${value}`))) {
        found.push(`${where}: ${label} = ${value}`);
      }
    }
  }
  assert.deepEqual(found, []);
});

test("no HYDE record lists ISO 9001 as a product certification", () => {
  const found = [...hyde]
    .filter(([, record]) => list(record.certifications).some((c) => /ISO 9001/.test(JSON.stringify(c))))
    .map(([id]) => id);
  assert.deepEqual(found, [], "ISO 9001 is company-level: src/data/company.ts");
});
