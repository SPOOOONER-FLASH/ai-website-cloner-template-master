#!/usr/bin/env node
/**
 * Finds the prose that reads as translated rather than written.
 *
 * ---------------------------------------------------------------------------
 * WHY A DETECTOR AND NOT A READ-THROUGH
 *
 * Client instruction, 2026-09-11: the copy should read as though an American PR agency
 * had polished it, while staying as sober as FSB or ASSA ABLOY — 「而不是棒读」.
 * The complaint was specific: mechanical, machine-translated, not fluent, and over-
 * explanatory.
 *
 * "Reads better" is a feeling, and a feeling cannot be re-checked next month when
 * somebody adds three more articles. So the failure modes are defined as patterns with
 * counts and line numbers, the same way every other quality rule in this repo is. Fix the
 * copy, re-run, watch the number fall — and the number stays fallen, because the next
 * writer is measured by it too.
 *
 * ---------------------------------------------------------------------------
 * THE FIVE THINGS THAT MAKE PROSE SOUND TRANSLATED
 *
 * 1. NOMINALISATION. The verb is turned into a noun and a weak verb carries the sentence:
 *    "provides protection for" instead of "protects". Chinese technical writing does this
 *    naturally and it survives translation; English readers hear a committee.
 *
 * 2. HEDGING. "can be considered", "helps to", "serves to". Every hedge is the writer
 *    declining to make the claim, and a factory that will not commit to its own backset
 *    reads as a factory unsure of it.
 *
 * 3. EMPTY ADJECTIVES. "high-quality", "reliable", "advanced", "one-stop". These are the
 *    words every competitor also uses, so they carry no information — and AGENTS.md
 *    already rules that a stated dimension beats an adjective.
 *
 * 4. OVER-EXPLANATION. "which means that", "in other words", "it is worth noting that".
 *    The client named this one directly. Explaining a sentence you just wrote says you do
 *    not trust it; delete the explanation and fix the sentence instead.
 *
 * 5. FLAT RHYTHM — the one nobody checks, and the one that produces 棒读.
 *    Prose that a person wrote varies: a long sentence, then a short one that lands.
 *    Machine translation produces sentences of near-identical length because it renders
 *    clause for clause. So this measures the standard deviation of sentence length, and
 *    flags any passage whose sentences are all the same size. It is the closest thing to
 *    a numeric definition of "wooden" that survives being automated.
 *
 * Spanish gets its own list, because its failure mode is different: it is usually
 * English calqued word-for-word rather than Chinese. "en orden a", "el mismo" as a
 * pronoun, passive "es realizado por" where Spanish wants "se realiza", and the register
 * slipping between tú and usted inside one page.
 *
 *   node scripts/audit-copy-register.mjs              # summary
 *   node scripts/audit-copy-register.mjs --list       # every hit with its location
 *   node scripts/audit-copy-register.mjs --es         # Spanish only
 *   node scripts/audit-copy-register.mjs --worst 12   # the 12 passages to fix first
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const listAll = args.includes("--list");
const esOnly = args.includes("--es");
const enOnly = args.includes("--en");
const worstN = args.indexOf("--worst") > -1 ? Number(args[args.indexOf("--worst") + 1]) : 10;

/* ---------------------------------------------------------------- patterns */

/**
 * Each rule is [name, regex, why]. The regex is deliberately narrow: a rule that fires on
 * correct prose gets ignored, and an ignored rule protects nothing.
 */
const EN_RULES = [
  ["nominalisation", /\b(?:provides?|offers?|delivers?|ensures?|performs?|conducts?|carries? out|makes? use of|gives?)\s+(?:the\s+|a\s+|an\s+)?\w+(?:tion|ment|ance|ence|ity|ing)\b/gi,
    "the verb became a noun — say what it does"],
  ["hedge", /\b(?:can be (?:considered|regarded|seen|used)|may (?:provide|offer|help)|helps? to|serves? to|is able to|are able to|it is possible to|aims? to provide)\b/gi,
    "a hedge is the writer declining to make the claim"],
  ["empty-adjective", /\b(?:high[- ]quality|top[- ]quality|high[- ]grade|reliable|advanced|innovative|cutting[- ]edge|world[- ]class|one[- ]stop|state[- ]of[- ]the[- ]art|superior|excellent|perfect(?:ly)?)\b/gi,
    "every competitor writes this, so it carries no information"],
  ["over-explanation", /\b(?:which means that|in other words|that is to say|it is worth noting that|it should be noted that|as we all know|needless to say|in fact,)\b/gi,
    "explaining the sentence you just wrote says you do not trust it"],
  ["translated-connective", /\b(?:at the same time|on the other hand,|so as to|in order to|first and foremost|last but not least|not only .{3,40} but also|according to the)\b/gi,
    "these are the connectives that survive translation from Chinese"],
  /*
    `leverage` is deliberately absent. In business writing it is a buzzword; in door
    hardware it is the mechanical quantity — "resist the leverage of someone pulling on a
    handle a metre from the hinge" is the correct technical word and the sentence needs
    it. The rule fired on exactly that line, which is how the exemption got written.
  */
  ["latinate-verb", /\b(?:utili[sz]e[ds]?|facilitate[ds]?|implement(?:ed|s|ation)?|optimi[sz]e[ds]?|streamline[ds]?)\b/gi,
    "use the plain verb — use, help, do"],
  /*
    NARROWED on 2026-09-11, after the first version fired 19 times and almost every hit
    was good prose:

      "…is not an answer. It is an answer plus an assumption."   parallel construction
      "This is a tooling question rather than a packaging one."  explicit contrast

    Both of those are doing work. What is NOT doing work is the opener that could be
    deleted with nothing lost — "It is important to note that", "There are several
    factors". So the rule now requires the throat-clearing word itself, rather than any
    "It is / This is". A rule that fires on correct prose gets ignored, and an ignored
    rule protects nothing — which this file's own header says, and did not follow.
  */
  ["empty-opener", /(?:^|\. )(?:It is (?:important|worth|necessary|essential|interesting)\b|It should be (?:noted|mentioned)|There are (?:many|several|a number of|various)\b)/g,
    "the sentence starts by clearing its throat"],
  /*
    Only before an adjective or adverb. "significantly cheaper" is filler; "very small
    batch" flagged the noun, and "highly polished" is the actual finish name in this
    trade — a real term, not an intensifier.
  */
  ["filler-intensifier", /\b(?:very|really|quite|extremely|significantly|substantially)\s+(?!polished\b)\w+(?:ly|er|est|ive|ous|ful|able|ible)?\b/gi,
    "an intensifier before an adjective is a weaker adjective"],
];

const ES_RULES = [
  ["calco-inglés", /\b(?:en orden a|aplicar para|jugar un (?:papel|rol)|tomar (?:acción|lugar)|hacer sentido|una vez que usted)\b/gi,
    "calcado del inglés palabra por palabra"],
  ["el-mismo-pronombre", /\b(?:el mismo|la misma|los mismos|las mismas)\s+(?:puede|debe|es|son|se)\b/gi,
    "«el mismo» como pronombre es lenguaje administrativo, no comercial"],
  ["pasiva-perifrástica", /\b(?:es|son|fue|fueron|será|serán)\s+\w+(?:ado|ada|ados|adas|ido|ida|idos|idas)\s+por\b/gi,
    "el español prefiere «se realiza» a «es realizado por»"],
  ["adjetivo-vacío", /\b(?:alta calidad|gran calidad|innovador(?:a|es)?|de vanguardia|excelente|perfecto|confiable|fiable|líder mundial|todo en uno)\b/gi,
    "lo escribe también cada competidor, así que no informa de nada"],
  ["sobre-explicación", /\b(?:es decir,|o sea,|cabe (?:destacar|señalar|mencionar)|vale la pena (?:señalar|destacar)|como todos sabemos|dicho de otro modo)\b/gi,
    "explicar la frase que se acaba de escribir dice que no se confía en ella"],
  ["gerundio-anglicado", /\b(?:siendo|teniendo|permitiendo|proporcionando|asegurando|ofreciendo)\s+\w+/gi,
    "gerundio calcado del -ing inglés; el español usa una oración de relativo"],
  ["registro-mixto", /\b(?:tú|tu\s+(?:puedes|necesitas|tienes)|contigo|tuyo)\b/gi,
    "el sitio trata al comprador de usted — el tuteo aquí rompe el registro"],
];

/* ---------------------------------------------------------------- rhythm */

/**
 * Standard deviation of sentence length, in words.
 *
 * A passage where every sentence is the same length is the numeric signature of 棒读.
 * Below 5 with at least four sentences is flat enough to hear; 8–14 is where readable
 * editorial prose usually sits. Passages shorter than four sentences are skipped — there
 * is no rhythm to measure in three.
 */
function rhythm(text) {
  const sentences = text
    .split(/(?<=[.!?。！？])\s+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n > 2);
  if (sentences.length < 4) return null;
  const mean = sentences.reduce((a, b) => a + b, 0) / sentences.length;
  const variance = sentences.reduce((a, n) => a + (n - mean) ** 2, 0) / sentences.length;
  return { sentences: sentences.length, mean: +mean.toFixed(1), sd: +Math.sqrt(variance).toFixed(1) };
}

/* ---------------------------------------------------------------- gather */

/** Every piece of prose we are responsible for, with where it came from. */
function passages() {
  const out = [];

  /* News articles: body and bodyEs are the largest prose on the site. */
  const NEWS = "content/news";
  if (existsSync(NEWS)) {
    for (const file of readdirSync(NEWS)) {
      if (!file.endsWith(".json")) continue;
      const record = JSON.parse(readFileSync(join(NEWS, file), "utf8"));
      const where = `news/${record.slug}`;
      if (record.summary) out.push({ where: `${where} · summary`, lang: "en", text: record.summary });
      if (record.summaryEs) out.push({ where: `${where} · summaryEs`, lang: "es", text: record.summaryEs });
      (record.body ?? []).forEach((p, i) => out.push({ where: `${where} · body[${i}]`, lang: "en", text: p }));
      (record.bodyEs ?? []).forEach((p, i) => out.push({ where: `${where} · bodyEs[${i}]`, lang: "es", text: p }));
    }
  }

  /*
    Data modules carry the company and factory descriptions the client named. Only string
    literals are read, and comments are stripped first — this file is full of long
    explanatory comments that are FOR US, and scoring them would drown the real copy.
  */
  const DATA_FILES = [
    "src/data/company.ts",
    "src/data/capability.ts",
    "src/data/home.ts",
    "src/data/home-es.ts",
    "src/data/services.ts",
    "src/data/navigation.ts",
    "src/data/representatives.ts",
  ];
  for (const path of DATA_FILES) {
    if (!existsSync(path)) continue;
    const source = readFileSync(path, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/^\s*\/\/.*$/gm, " ");
    for (const match of source.matchAll(/"((?:[^"\\]|\\.){40,})"/g)) {
      const text = match[1].replace(/\\"/g, '"').replace(/\\n/g, " ");
      /* Skip anything that is plainly not prose: paths, classes, identifiers. */
      if (/^[/.#]|^https?:|^[a-z-]+$|^\w+\/\w+/.test(text)) continue;
      if (!/\s/.test(text)) continue;
      const lang = path.includes("-es") || /[áéíóúñ¿¡]/.test(text) ? "es" : "en";
      out.push({ where: `${path.replace("src/data/", "")}`, lang, text });
    }
  }

  /*
    Rayen's own copy, including the English side added on 2026-09-10.

    The client named this site as the worst offender, so it is scanned field by field
    rather than through the generic string sweep: its English lives in `*En`-suffixed
    keys beside the Chinese, and `_readme` keys are notes to us, not copy.
  */
  const RAYEN = "content/rayen/site.json";
  if (existsSync(RAYEN)) {
    const walk = (node, path = "") => {
      for (const [key, value] of Object.entries(node ?? {})) {
        if (key === "_readme") continue;
        const here = path ? `${path}.${key}` : key;
        if (typeof value === "string") {
          if (value.length < 40 || !/\s/.test(value)) continue;
          /* Chinese text is out of scope: the client asked about EN and ES. */
          if (/[一-鿿]/.test(value)) continue;
          out.push({ where: `rayen/site.json · ${here}`, lang: "en", text: value });
        } else if (value && typeof value === "object") {
          walk(value, here);
        }
      }
    };
    walk(JSON.parse(readFileSync(RAYEN, "utf8")));
  }

  /*
    PAGE COPY — the largest surface, and the one the first version of this audit missed
    entirely.

    Most page prose is not a string literal; it is JSX text between tags, so a sweep for
    quoted strings finds the metadata and none of the writing. This pulls the text nodes
    out instead: anything between > and < that reads like a sentence.

    JSX expressions, class names and entities are dropped. The test for "reads like a
    sentence" is deliberately crude — three words and a lower-case word — because the
    alternative is parsing TSX, and a crude filter that over-collects is safer here than
    a clever one that silently skips the paragraph somebody actually wrote.
  */
  const APP_DIRS = ["src/app/(en)", "src/app/es", "src/app/zh"];
  const walkFiles = (dir, found = []) => {
    if (!existsSync(dir)) return found;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walkFiles(path, found);
      else if (entry.name.endsWith(".tsx")) found.push(path);
    }
    return found;
  };

  for (const dir of APP_DIRS) {
    for (const path of walkFiles(dir)) {
      const source = readFileSync(path, "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, " ")
        .replace(/^\s*\/\/.*$/gm, " ");
      const label = path.replaceAll("\\", "/").replace("src/app/", "");
      const lang = label.startsWith("es/") ? "es" : "en";

      for (const match of source.matchAll(/>([^<>{}]{40,})</g)) {
        const text = match[1].replace(/\s+/g, " ").trim();
        if (!/[a-záéíóúñ]/.test(text)) continue;
        if (text.split(/\s+/).length < 6) continue;
        if (/^[A-Z_]+$/.test(text)) continue;
        if (/[一-鿿]/.test(text)) continue;
        out.push({ where: label, lang, text });
      }
    }
  }

  return out;
}

/* ---------------------------------------------------------------- score */

const all = passages().filter((p) => (esOnly ? p.lang === "es" : enOnly ? p.lang === "en" : true));

const hits = [];
const byRule = new Map();
const flat = [];

/**
 * Is this match inside quotation marks?
 *
 * The best copy on this site quotes the bad phrase in order to attack it:
 *
 *   Un proveedor que responde «inoxidable de alta calidad» le está cotizando una fotografía.
 *
 * That sentence is the argument AGAINST empty adjectives, and the audit flagged it for
 * containing one. A rule that punishes the strongest paragraph on the page teaches the
 * writer to delete their best line, so quoted spans are excluded — «», "" and '' alike.
 */
function insideQuotes(text, index) {
  const before = text.slice(0, index);
  const pairs = [
    ["«", "»"],
    ["“", "”"],
    ['"', '"'],
  ];
  for (const [open, close] of pairs) {
    const opens = before.split(open).length - 1;
    const closes = before.split(close).length - 1;
    /* Same character for open and close: odd count means we are inside one. */
    if (open === close) {
      if (opens % 2 === 1) return true;
    } else if (opens > closes) {
      return true;
    }
  }
  return false;
}

for (const passage of all) {
  const rules = passage.lang === "es" ? ES_RULES : EN_RULES;
  for (const [name, pattern, why] of rules) {
    for (const m of passage.text.matchAll(pattern)) {
      if (insideQuotes(passage.text, m.index)) continue;
      hits.push({ ...passage, rule: name, match: m[0].trim(), why });
      byRule.set(name, (byRule.get(name) ?? 0) + 1);
    }
  }
  const r = rhythm(passage.text);
  if (r && r.sd < 5) flat.push({ ...passage, ...r });
}

/* Worst passages: most rule hits, then flattest rhythm. */
const perPassage = new Map();
for (const h of hits) perPassage.set(h.where, (perPassage.get(h.where) ?? 0) + 1);

console.log(`passages audited: ${all.length}  (en ${all.filter((p) => p.lang === "en").length}, es ${all.filter((p) => p.lang === "es").length})`);
console.log(`register hits: ${hits.length}`);
console.log(`flat-rhythm passages (sd < 5): ${flat.length}\n`);

console.log("by rule:");
for (const [name, n] of [...byRule].sort((a, b) => b[1] - a[1])) {
  const why = [...EN_RULES, ...ES_RULES].find(([r]) => r === name)?.[2] ?? "";
  console.log(`  ${String(n).padStart(4)}  ${name.padEnd(24)} ${why}`);
}

console.log(`\nworst ${worstN} passages:`);
for (const [where, n] of [...perPassage].sort((a, b) => b[1] - a[1]).slice(0, worstN)) {
  console.log(`  ${String(n).padStart(3)}  ${where}`);
}

if (flat.length) {
  console.log(`\nflattest rhythm — every sentence the same length, which is what 棒读 measures as:`);
  for (const f of flat.sort((a, b) => a.sd - b.sd).slice(0, 8)) {
    console.log(`  sd ${String(f.sd).padStart(4)}  ${f.sentences} sentences averaging ${f.mean} words  ${f.where}`);
  }
}

if (listAll) {
  console.log("\n== every hit ==");
  const grouped = new Map();
  for (const h of hits) {
    if (!grouped.has(h.where)) grouped.set(h.where, []);
    grouped.get(h.where).push(h);
  }
  for (const [where, list] of [...grouped].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${where}`);
    for (const h of list) console.log(`   [${h.rule}] "${h.match}"`);
  }
}

process.exitCode = 0;
