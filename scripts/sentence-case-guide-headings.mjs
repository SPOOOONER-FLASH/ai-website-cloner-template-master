#!/usr/bin/env node
/**
 * Guide headings stored in capitals → written headings in sentence case, in every language
 * that has letter case (task #66, 2026-10-12: the client approved a guide layout whose
 * headings read as sentences; 161 English headings and their translations were all caps).
 *
 *   node scripts/sentence-case-guide-headings.mjs            dry run: writes tmp/claude-heading-case/review-<lang>.txt
 *   node scripts/sentence-case-guide-headings.mjs --write    rewrites the bodies
 *
 * WHY NOT toLowerCase(): German capitalises every noun, and capitals lose information
 * ("DORNMASS" is "Dornmaß"; "EN" and "BHMA" must stay capitals). So each word takes the
 * spelling the same language uses for it everywhere else in our own articles — the
 * paragraphs around these headings — counted, with sentence-initial uses discounted. Words
 * the corpus never spells out keep the fallback for their language and are listed in the
 * review file; OVERRIDES fixes the ones the count gets wrong ("send US" vs "US numbers").
 *
 * A heading was a heading BECAUSE it was in capitals (src/lib/article-layout.ts); the cased
 * text is written as "## Text", which the same parser reads as an explicit level-2 heading
 * with the same id (ids are built from the lowercased text). Japanese, Korean and Arabic have
 * no case and are untouched.
 *
 * Bookkeeping, so nothing downstream misreads a casing change as new content:
 *   - overlay `sourceHash.body` is moved to the new English hash only where it matched the old
 *     one (a translation that was current stays current; a stale one stays stale);
 *   - src/data/article-revisions.json takes the new hash without moving `updatedAt` — the words
 *     did not change, and a dateModified that jumps for formatting is what the stamper's own
 *     notes call freshness manipulation.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { hashOf } from "./lib/i18n-source-hash.mjs";

const WRITE = process.argv.includes("--write");
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const GUIDES = readdirSync("content/guides").filter((f) => f.endsWith(".json")).sort().map((f) => ({ file: join("content/guides", f), rec: read(join("content/guides", f)) }));
const NEWS = readdirSync("content/news").filter((f) => f.endsWith(".json")).map((f) => read(join("content/news", f)));
const OVERLAY_LANGS = ["fr", "de", "tr", "ru"]; // ja, ko, ar have no letter case
const TAG = { en: "en", es: "es", pt: "pt", fr: "fr", de: "de", tr: "tr", ru: "ru" };

/** Same test as articleBlocks(): a single line, ≤120 chars, no closing punctuation, ≥2 words, all capitals. */
const isCapitalsHeading = (text) =>
  typeof text === "string" && !text.includes("\n") && text.length <= 120 && !/[.!?]$/.test(text) &&
  (text.match(/\p{L}+/gu)?.length ?? 0) >= 2 && text === text.toLocaleUpperCase() && /\p{Lu}/u.test(text);

/* Per-language fixes where the corpus count picks the wrong spelling. Keyed by the capitals text. */
const OVERRIDES = {
  en: {
    "HOW THE CODES LINE UP WITH BHMA AND US NUMBERS": "How the codes line up with BHMA and US numbers",
  },
  de: {
    // "SIE"/"IHRE" here are "they"/"their", not the formal "you" the corpus counts most.
    "DIE ZEILE, DIE SIE NICHT UNTERSCHEIDET": "Die Zeile, die sie nicht unterscheidet",
    "OBJEKTSCHLÖSSER UND IHRE FUNKTIONEN": "Objektschlösser und ihre Funktionen",
    "SCHLIESSVERZÖGERUNG – UND WO SIE NICHT HINGEHÖRT": "Schließverzögerung – und wo sie nicht hingehört",
    "LAGER – UND WO SIE IHREN PREIS WERT SIND": "Lager – und wo sie ihren Preis wert sind",
    "DIE LIPPENLÄNGE – UND WIE MAN AUFHÖRT, SIE ZU RATEN": "Die Lippenlänge – und wie man aufhört, sie zu raten",
    "WAS WERKZEUGE KOSTEN – UND WARUM WIR ES IHNEN SAGEN, BEVOR SIE FRAGEN": "Was Werkzeuge kosten – und warum wir es Ihnen sagen, bevor Sie fragen",
    "WARUM DAS VERSTELLBARE DORNMASS MEHR WERT IST, ALS ES AUSSIEHT": "Warum das verstellbare Dornmaß mehr wert ist, als es aussieht",
    "WAS VOR DEM FERTIGEN ENTSCHIEDEN SEIN MUSS": "Was vor dem Fertigen entschieden sein muss",
    "FEDERRÜCKSTELLUNG – UND DER DEFEKT, DER WIE EIN SCHLOSSFEHLER AUSSIEHT": "Federrückstellung – und der Defekt, der wie ein Schlossfehler aussieht",
  },
};
/* Bodies that publish numbered standards: before a number these stay capitals in every language. */
const STANDARDS = new Set(["EN", "ISO", "UL", "DIN", "NFPA", "BS", "HS", "ANSI", "BHMA", "IEC", "ASTM", "GB", "TS"]);
/* Single words: spellings the corpus lacks or gets wrong in headings (German nouns above all). */
const WORDS = {
  en: { KEYWAYS: "keyways", CALCULATE: "calculate" },
  es: { CALCULADO: "calculado", "VEINTITRÉS": "veintitrés" },
  pt: { CALCULADO: "calculado", AJUSTES: "ajustes" },
  tr: { HIGH: "high", "SINIFLARI": "sınıfları", "TERMİN": "termin", "HANENİN": "hanenin", "TÜRÜ": "türü" },
  de: {
    GEWOHNHEITSWAHL: "Gewohnheitswahl", SKALEN: "Skalen", MODELLCODES: "Modellcodes", FRAGEN: "Fragen",
    OBJEKTSCHLIESSER: "Objektschließer", "TÜRBESTELLUNG": "Türbestellung", BESCHREIBUNGEN: "Beschreibungen",
    "ÜBERSTANDSREGEL": "Überstandsregel", VERBUND: "Verbund", DREIUNDZWANZIG: "dreiundzwanzig",
    VERBINDLICHE: "verbindliche", "FEDERRÜCKSTELLUNG": "Federrückstellung", ZWEITEILIGE: "zweiteilige",
    VERSTECKT: "versteckt", VERSCHIEBEN: "verschieben", ZUNICHTEMACHT: "zunichtemacht", AUSEINANDERLIEGEN: "auseinanderliegen",
  },
};

function corpusFor(lang) {
  const texts = [];
  const push = (v) => {
    if (typeof v === "string") { if (!isCapitalsHeading(v)) texts.push(v); }
    else if (Array.isArray(v)) v.forEach(push);
  };
  const suffix = { en: "", es: "Es", pt: "Pt" }[lang];
  if (suffix !== undefined) {
    for (const { rec } of GUIDES) ["title", "summary", "body"].forEach((f) => push(rec[f + suffix]));
    for (const rec of NEWS) ["title", "summary", "body"].forEach((f) => push(rec[f + suffix]));
  } else {
    for (const kind of ["guides", "news"]) {
      const path = `content/i18n/${lang}/${kind}.json`;
      if (!existsSync(path)) continue;
      for (const entry of Object.values(read(path))) ["title", "summary", "body"].forEach((f) => push(entry[f]));
    }
  }
  const counts = new Map();
  const word = /[\p{L}\p{M}][\p{L}\p{M}'’]*/gu;
  for (const text of texts) {
    for (const m of text.matchAll(word)) {
      const before = text.slice(Math.max(0, m.index - 3), m.index);
      const initial = m.index === 0 || /(^|[.!?:]\s+|\n\s*|[¿¡«"“]\s*)$/.test(before);
      const key = m[0].toLocaleUpperCase(TAG[lang]);
      const forms = counts.get(key) ?? new Map();
      forms.set(m[0], (forms.get(m[0]) ?? 0) + (initial ? 0.25 : 1));
      counts.set(key, forms);
    }
  }
  return counts;
}

function caseHeading(text, lang, corpus, unresolved) {
  if (OVERRIDES[lang]?.[text]) return OVERRIDES[lang][text];
  let first = true;
  const out = text.replace(/[\p{L}\p{M}][\p{L}\p{M}'’]*/gu, (w, offset) => {
    const forms = corpus.get(w);
    let best;
    if (WORDS[lang]?.[w]) best = WORDS[lang][w];
    else if (forms) best = [...forms.entries()].sort((a, b) => b[1] - a[1])[0][0];
    else {
      unresolved.add(w);
      best = w.toLocaleLowerCase(TAG[lang]);
    }
    /* A short capital word before a number is a standard or a code ("EN 1670", "A156.1"), not
       the Spanish, French or Turkish word "en". */
    const after = text.slice(offset + w.length);
    if (/^\d/.test(after) || (/^\s\d/.test(after) && STANDARDS.has(w))) best = w;
    /* Only the heading's opening word is capitalised: after "8301" or "EN 1670" the next word
       is mid-sentence. */
    if (first && !/^[\s"“«„'(\[]*$/.test(text.slice(0, offset))) first = false;
    if (first) {
      first = false;
      if (best === best.toLocaleLowerCase(TAG[lang])) best = best[0].toLocaleUpperCase(TAG[lang]) + best.slice(1);
    }
    return best;
  });
  return out;
}

const revisionHash = (article) => {
  const FIELDS = ["title", "summary", "body", "faq", "howTo"];
  const TEXT = FIELDS.flatMap((f) => (f === "howTo" ? [f] : [f, `${f}Es`, `${f}Pt`]));
  const text = Object.fromEntries(TEXT.filter((f) => article[f] !== undefined).map((f) => [f, article[f]]));
  return createHash("sha256").update(JSON.stringify(text)).digest("hex").slice(0, 16);
};

mkdirSync("tmp/claude-heading-case", { recursive: true });
const review = {};
const note = (lang, line) => (review[lang] ??= []).push(line);
const summary = {};

/* English, Spanish, Portuguese: on the records. */
const corpora = Object.fromEntries(["en", "es", "pt", ...OVERLAY_LANGS].map((l) => [l, corpusFor(l)]));
const unresolved = Object.fromEntries(Object.keys(corpora).map((l) => [l, new Set()]));
const oldEnglishBody = {};
const manifest = read("src/data/article-revisions.json");
let manifestMoved = 0;

for (const { file, rec } of GUIDES) {
  oldEnglishBody[rec.slug] = rec.body;
  const before = revisionHash(rec);
  let changed = false;
  for (const [lang, field] of [["en", "body"], ["es", "bodyEs"], ["pt", "bodyPt"]]) {
    if (!Array.isArray(rec[field])) continue;
    rec[field] = rec[field].map((line) => {
      if (!isCapitalsHeading(line)) return line;
      const cased = caseHeading(line.trim(), lang, corpora[lang], unresolved[lang]);
      note(lang, `${rec.slug}\n  ${line}\n  ${cased}`);
      summary[lang] = (summary[lang] ?? 0) + 1;
      changed = true;
      return `## ${cased}`;
    });
  }
  if (!changed) continue;
  const key = `guides/${rec.slug}`;
  if (manifest[key] === before) { manifest[key] = revisionHash(rec); manifestMoved++; }
  if (WRITE) writeFileSync(file, `${JSON.stringify(rec, null, 2)}\n`);
}

/* The seven overlay locales: content/i18n/<code>/guides.json. */
for (const lang of OVERLAY_LANGS) {
  const path = `content/i18n/${lang}/guides.json`;
  const raw = readFileSync(path, "utf8");
  const overlay = JSON.parse(raw);
  for (const [slug, entry] of Object.entries(overlay)) {
    if (!Array.isArray(entry.body)) continue;
    let changed = false;
    entry.body = entry.body.map((line) => {
      if (!isCapitalsHeading(line)) return line;
      const cased = caseHeading(line.trim(), lang, corpora[lang], unresolved[lang]);
      note(lang, `${slug}\n  ${line}\n  ${cased}`);
      summary[lang] = (summary[lang] ?? 0) + 1;
      changed = true;
      return `## ${cased}`;
    });
    const en = GUIDES.find((g) => g.rec.slug === slug)?.rec;
    if (en && entry.sourceHash?.body === hashOf("body", oldEnglishBody[slug])) entry.sourceHash.body = hashOf("body", en.body);
    if (changed || en) overlay[slug] = entry;
  }
  if (WRITE) writeFileSync(path, JSON.stringify(overlay, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
}

/* Overlays for ja/ko/ar carry no capitals, but their English source hash still has to follow. */
for (const lang of ["ja", "ko", "ar"]) {
  const path = `content/i18n/${lang}/guides.json`;
  const raw = readFileSync(path, "utf8");
  const overlay = JSON.parse(raw);
  for (const [slug, entry] of Object.entries(overlay)) {
    const en = GUIDES.find((g) => g.rec.slug === slug)?.rec;
    if (en && entry.sourceHash?.body === hashOf("body", oldEnglishBody[slug])) entry.sourceHash.body = hashOf("body", en.body);
  }
  if (WRITE) writeFileSync(path, JSON.stringify(overlay, null, 2) + (raw.endsWith("\n") ? "\n" : ""));
}

if (WRITE) writeFileSync("src/data/article-revisions.json", `${JSON.stringify(manifest, null, 2)}\n`);
for (const [lang, lines] of Object.entries(review)) {
  writeFileSync(`tmp/claude-heading-case/review-${lang}.txt`, `${lines.join("\n")}\n\nNOT IN CORPUS: ${[...unresolved[lang]].join(" ")}\n`);
}
console.log(`${WRITE ? "written" : "dry run"}: ${JSON.stringify(summary)}; revision hashes moved without a date: ${manifestMoved}`);
for (const [lang, set] of Object.entries(unresolved)) if (set.size) console.log(`  ${lang} not in corpus (${set.size}): ${[...set].slice(0, 30).join(" ")}`);
