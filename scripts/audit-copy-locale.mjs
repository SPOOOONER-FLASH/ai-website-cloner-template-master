#!/usr/bin/env node
/**
 * Counts the words that tell a reader "this was not written for my market".
 *
 * Companion to audit-copy-register.mjs. That script measures prose that sounds
 * translated; this one measures prose that sounds like it was written for the wrong
 * country. The rules come from the three market style guides in docs/copy/style-guides/,
 * which were derived from the copy of local hardware manufacturers on 2026-09-24:
 *
 *   EN  → US buyers (Baldwin, Emtek, Detex, Marks USA, TownSteel …): American spelling.
 *   ES  → one neutral Latin-American Spanish for MX / AR / PE (Truper, Phillips, Kallay,
 *         Trabex, Cantol, Forte …): no voseo, no Spain-only words, no terms that mean
 *         a different part in Buenos Aires than in Lima.
 *   PT  → Brazilian Portuguese (Papaiz, Aliança, Soprano …): no European-Portuguese forms.
 *
 * Each field is checked in its own language only (body → EN, bodyEs → ES, bodyPt → PT),
 * so "contacto" in a Spanish paragraph is not reported as a Portuguese error.
 *
 *   node scripts/audit-copy-locale.mjs            # totals per rule
 *   node scripts/audit-copy-locale.mjs --list     # every hit with file · field[index]
 *   node scripts/audit-copy-locale.mjs --worst 15 # the 15 files to rewrite first
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const listAll = args.includes("--list");
const worstN = args.includes("--worst") ? Number(args[args.indexOf("--worst") + 1]) : 10;

/* A rule is a pattern plus the reason a local reader stumbles on it. Slugs and model
   codes are never checked: they are URLs and order codes, not prose. */
const RULES = {
  en: [
    [/\b(aluminium|centres?|colours?|coloured|catalogues?|metres?|grey|licence|behaviour|favour\w*|labour|tonnes?)\b/gi, "british-spelling", "US buyers read UK spelling as a foreign supplier; use aluminum, center, color, catalog, meter, gray"],
    // A positive stem list: an allowlist of every English word ending in -ise (mortise,
    // otherwise, precise, promise …) would never be complete.
    [/\b(standardis|galvanis|minimis|maximis|recognis|optimis|specialis|organis|customis|authoris|finalis|prioritis|utilis|summaris|characteris|categoris|normalis|stabilis|visualis|harmonis|emphasis)(e|ed|es|ing|ation|ations)\b/gi, "british-ise", "US spelling is -ize / -ization (standardize, galvanized, minimize)"],
  ],
  es: [
    [/\b(podés|tenés|querés|sabés|explorá|conocé|elegí|descargá|contactanos|consultá|mirá|hacé|accedé)\b/gi, "voseo", "voseo is Argentine only; Mexico and Peru read it as a local ad, not a factory"],
    [/\bpicaportes?\b/gi, "picaporte", "in Argentina a picaporte is the lever handle, not the latch; say pestillo (latch) or manija (handle)"],
    [/\bmanillas?\b/gi, "manilla", "Chile/Spain word; manija is understood in MX, AR and PE"],
    [/\bcortafuegos\b/gi, "cortafuegos", "Spain spelling; Latin America writes puerta cortafuego"],
    [/\b(vosotros|vuestr[oa]s?|coger)\b/gi, "spain-only", "Spain-only form"],
  ],
  pt: [
    [/\b(contactos?|equipas?|registar|ecrã|casa de banho|utilizador(es)?|telemóvel|autocarro)\b/gi, "pt-portugal", "European Portuguese; Brazil writes contato, equipe, registrar, tela, banheiro, usuário"],
    [/\b(tens|estás|podes|queres|sabes)\b/gi, "tu-form", "Brazilian trade copy addresses the reader as você, never tu"],
  ],
};


const LANG_OF = (key) => (key.endsWith("Es") ? "es" : key.endsWith("Pt") ? "pt" : "en");
const PROSE_KEYS = /^(title|summary|body|seoTitle|seoDescription|faq)(Es|Pt)?$/;

function strings(value, path, out) {
  if (typeof value === "string") out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${path}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) strings(v, `${path}.${k}`, out);
  return out;
}

const hits = [];
for (const dir of ["content/news", "content/guides"]) {
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const record = JSON.parse(readFileSync(join(dir, file), "utf8"));
    for (const [key, value] of Object.entries(record)) {
      if (!PROSE_KEYS.test(key)) continue;
      // faq holds all three languages as q/a, qEs/aEs, qPt/aPt.
      for (const [path, text] of strings(value, key, [])) {
        const leaf = path.split(".").pop().replace(/\[\d+\]$/, "");
        const lang = key === "faq" ? LANG_OF(leaf) : LANG_OF(key);
        for (const [re, rule, why] of RULES[lang]) {
          for (const m of text.matchAll(re)) {
            hits.push({ where: `${dir.split("/")[1]}/${file.replace(/\.json$/, "")} · ${path}`, file, lang, rule, word: m[0], why });
          }
        }
      }
    }
  }
}

const byRule = new Map();
for (const h of hits) byRule.set(`${h.lang}  ${h.rule}`, [...(byRule.get(`${h.lang}  ${h.rule}`) ?? []), h]);
console.log(`locale audit — ${hits.length} hits in content/news + content/guides\n`);
for (const [rule, list] of [...byRule].sort((a, b) => b[1].length - a[1].length)) {
  const words = [...list.reduce((m, h) => m.set(h.word.toLowerCase(), (m.get(h.word.toLowerCase()) ?? 0) + 1), new Map())]
    .sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w, n]) => `${w}×${n}`).join(", ");
  console.log(`${String(list.length).padStart(5)}  ${rule.padEnd(22)} ${words}`);
  console.log(`       ${list[0].why}`);
}

const byFile = new Map();
for (const h of hits) byFile.set(h.file, (byFile.get(h.file) ?? 0) + 1);
console.log(`\nworst ${worstN} files:`);
[...byFile].sort((a, b) => b[1] - a[1]).slice(0, worstN).forEach(([f, n]) => console.log(`${String(n).padStart(5)}  ${f}`));

if (listAll) {
  console.log("\nall hits:");
  for (const h of hits) console.log(`  ${h.lang} ${h.rule.padEnd(16)} ${h.word.padEnd(14)} ${h.where}`);
}
