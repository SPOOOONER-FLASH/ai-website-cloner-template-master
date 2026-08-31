/**
 * Generates the Spanish side of every product record.
 *
 * NOT A TRANSLATION PASS. Product pages are structured text, so Spanish is composed from
 * the spec rows through src/data/es-glossary.ts rather than translated from the English
 * sentence. The summary is rebuilt by a Spanish assembler that mirrors summaryFrom() in
 * enrich-product-specs.mjs — same inputs, different grammar — which is why the output
 * reads as Spanish rather than as English wearing Spanish words.
 *
 * A term with no glossary entry is LEFT IN ENGLISH and reported at the end. Coverage is
 * therefore visible, and it improves by adding glossary entries, never by guessing. An
 * invented Spanish spec term is the same class of error as an invented dimension.
 *
 *   node scripts/translate-products-es.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const DIR = "content/products";
const write = process.argv.includes("--write");

/** The glossary is TypeScript; read it as text and lift the object literals out. */
function loadGlossary() {
  const source = readFileSync("src/data/es-glossary.ts", "utf8");
  const grab = (name) => {
    const start = source.indexOf(`export const ${name}`);
    const open = source.indexOf("{", start);
    let depth = 0;
    let i = open;
    for (; i < source.length; i++) {
      if (source[i] === "{") depth += 1;
      else if (source[i] === "}") {
        depth -= 1;
        if (!depth) {
          i += 1;
          break;
        }
      }
    }
    const body = source.slice(open, i).replace(/\/\/.*$/gm, "");
    return eval(`(${body})`);
  };
  return {
    labels: grab("SPEC_LABELS_ES"),
    values: grab("SPEC_VALUES_ES"),
    categories: grab("CATEGORY_NAMES_ES"),
  };
}

const glossary = loadGlossary();
const missing = new Map();
const note = (term) => missing.set(term, (missing.get(term) ?? 0) + 1);

/**
 * Values that are a number plus a qualifier. The number survives untouched; only the
 * qualifier is language. Spanish trade usage puts a space before the unit, so
 * "60mm / 70mm adjustable" becomes "60 mm / 70 mm regulable".
 */
const NUMERIC_RULES = [
  [
    /^([\d\s./]+mm(?:\s*\/\s*[\d\s./]+mm)?) adjustable$/i,
    (m, sp) => `${sp(m[1])} regulable`,
  ],
  [
    /^([\d\s./]+mm) to ([\d\s./]+mm) adjustable$/i,
    (m, sp) => `de ${sp(m[1])} a ${sp(m[2])}, regulable`,
  ],
  [
    /^([\d\s./]+mm) to ([\d\s./]+mm) standard; ([\d\s./]+mm) to ([\d\s./]+mm) on request$/i,
    (m, sp) => `de ${sp(m[1])} a ${sp(m[2])} de serie; de ${sp(m[3])} a ${sp(m[4])} bajo pedido`,
  ],
  [/^([\d.]+)\s*mm$/i, (m) => `${DIM(m[1])} mm`],
  // "60/70mm" — one unit shared by two figures, which is how the catalogue writes it.
  [/^([\d]+(?:\s*\/\s*[\d]+)+)\s*mm$/i, (m) => `${m[1].replace(/\s*\/\s*/g, "/")} mm`],
  [
    /^([\d\s./]+mm(?:\s*\/\s*[\d\s./]+mm)?) adjustable, latch and deadbolt both$/i,
    (m, sp) => `${sp(m[1])} regulable, tanto el picaporte como el cerrojo`,
  ],
  // "35–50mm" / "8-12mm" — a range; Spanish spells it out rather than keeping the dash.
  [/^([\d.]+)\s*[–-]\s*([\d.]+)\s*mm$/i, (m) => `de ${DIM(m[1])} a ${DIM(m[2])} mm`],
  // "60mm (2-3/8”)" — the imperial equivalent in brackets is printed, not translated.
  // The bracket must actually be a measurement; an English aside in there is not.
  [
    /^([\d.]+)\s*mm\s*(\([\d\s./'"”″＂+×x,-]+\))$/i,
    (m) => `${DIM(m[1])} mm ${m[2]}`,
  ],
  // "90-180°" and "180°" — degrees need no translation, only the range spelled out.
  [/^(\d+)\s*[–-]\s*(\d+)\s*°$/i, (m) => `de ${m[1]} a ${m[2]}°`],
  [/^(\d+)\s*°$/i, (m) => `${m[1]}°`],
  // "32x300x600 mm" — a dimension triple; only the separator is language.
  [
    /^([\d.]+)\s*[x×]\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*mm$/i,
    (m) => `${DIM(m[1])} × ${DIM(m[2])} × ${DIM(m[3])} mm`,
  ],
  /*
    The catalogue writes hinge sizes eleven different ways -- 4"x3"x2.0MM, 4.0''x3.0''x2.0mm,
    3.5"x3.5"x2.5MM. Only the separators and the decimal mark are language: Spanish trade
    writes 2,5 mm. Listing each string as a glossary entry would be a hundred entries that
    say nothing, and the next catalogue revision would miss again.
  */
  [
    /^([\d.]+)\s*(?:''|["”″＂])\s*[x×*]\s*([\d.]+)\s*(?:''|["”″＂])\s*[x×*]\s*([\d.]+)\s*mm$/i,
    (m) => DIM(m[1]) + "” × " + DIM(m[2]) + "” × " + DIM(m[3]) + " mm",
  ],
  // "100*100mm", "280*215*100mm", "18 x 183", "129*321.5mm" -- figures and a separator.
  [
    /^[\d.]+(?:\s*[x×*]\s*[\d.]+)+\s*(mm)?$/i,
    (m) => JOIN(m[0].replace(/\s*mm$/i, "")) + (m[1] ? " mm" : ""),
  ],
  // "103 mm x 66 mm" -- the unit repeated on each figure; Spanish states it once.
  [
    /^[\d.]+\s*mm(?:\s*[x×*]\s*[\d.]+\s*mm)+$/i,
    (m) => JOIN(m[0].replace(/\s*mm/gi, "")) + " mm",
  ],
  // "300mm,400mm,500mm,600mm" and "12mm, 14mm, 16mm" -- a size list, unit stated once.
  [
    /^[\d.]+(?:\s*mm?)?(?:\s*[,/]\s*[\d.]+(?:\s*mm?)?)+\s*$/i,
    (m) =>
      m[0]
        .split(/\s*[,/]\s*/)
        .map((n) => DIM(n.replace(/\s*mm?$/i, "")))
        .join(" / ") + " mm",
  ],
  // "8in/10in/12in/24in" and "8 in" -- inches, written with the prime the trade prints.
  [
    /^[\d.]+\s*in(?:\s*[,/]\s*[\d.]+\s*in)*$/i,
    (m) =>
      m[0]
        .split(/\s*[,/]\s*/)
        .map((n) => DIM(n.replace(/\s*in$/i, "")) + "”")
        .join(" / "),
  ],
  // '3", 4", 5", 6"' -- already primes; only the separator and decimal mark move.
  [
    /^[\d.]+\s*(?:''|["”″＂])(?:\s*[,/]\s*[\d.]+\s*(?:''|["”″＂]))+$/,
    (m) =>
      m[0]
        .split(/\s*[,/]\s*/)
        .map((n) => DIM(n.replace(/\s*(?:''|["”″＂])$/, "")) + "”")
        .join(" / "),
  ],
  // "042mm", "f44x24mm" -- the diameter sign carries the meaning, the rest is figures.
  [
    /^[Øøф⌀]\s*([\d.]+(?:\s*[x×*]\s*[\d.]+)*)\s*(mm)?$/i,
    (m) => "Ø " + JOIN(m[1]) + (m[2] ? " mm" : ""),
  ],
  // "180 Degrees" / "180 degree/200 degree" -- the word is language, the figure is not.
  [/^(\d+)\s*degrees?$/i, (m) => m[1] + "°"],
  [/^(\d+)\s*degrees?\s*\/\s*(\d+)\s*degrees?$/i, (m) => m[1] + "° / " + m[2] + "°"],
  // "90-180 deg" with the sign on both ends; the existing range rule allows it on one.
  [/^(\d+)\s*°\s*[–-]\s*(\d+)\s*°$/, (m) => "de " + m[1] + " a " + m[2] + "°"],
  [/^(\d+)\s*°\s+or\s+(\d+)\s*°$/i, (m) => m[1] + "° o " + m[2] + "°"],
];

/** Spanish writes the decimal mark as a comma: 2.5 mm is 2,5 mm on a Latin American quote. */
function DIM(n) {
  return n.trim().replace(".", ",");
}

/** Joins a dimension run with the multiplication sign the trade prints. */
function JOIN(text) {
  return text
    .split(/\s*[x×*]\s*/i)
    .map(DIM)
    .join(" × ");
}

/**
 * A finish or option CODE rather than a word — "SSS/PSS", "PB.AB.AC.CP.SN", "SS".
 * These are what a buyer writes on a purchase order, so they are identical in every
 * language and must NOT be translated. They are also not a coverage gap, so they are not
 * counted as missing.
 */
const IS_CODE = /^[A-Z0-9]{1,5}(\s*[./,+&-]\s*[A-Z0-9]{1,5})*\.?$/;

/*
  The catalogue carries invisible whitespace — "110<U+202F>mm (L) × 66<U+202F>mm (W)" uses a
  narrow no-break space where the eye sees a plain one. An exact-match glossary cannot see
  the difference and reports the term missing; adding a second entry per variant would grow
  the file without adding a word of Spanish. Normalise once, at the door.
*/
function normalise(text) {
  return text.replace(/[\u00a0\u2007\u202f\u2009]/g, " ");
}

function translateValue(input) {
  const text = normalise(input);
  const exact = glossary.values[text];
  if (exact) return exact;
  if (IS_CODE.test(text.trim())) return text.trim();

  // The client writes the same material a dozen ways; casing is not meaning.
  const folded = Object.keys(glossary.values).find(
    (key) => key.toLowerCase() === text.trim().toLowerCase(),
  );
  if (folded) return glossary.values[folded];

  const spaced = (s) => s.replace(/(\d)\s*mm\b/g, "$1 mm").replace(/(\d)\.(\d)/g, "$1,$2");
  for (const [pattern, build] of NUMERIC_RULES) {
    if (!build) continue;
    const hit = pattern.exec(text);
    if (hit) return build(hit, spaced);
  }
  return null;
}

function value(text) {
  const hit = translateValue(text);
  if (hit) return hit;
  note(normalise(text));
  return text;
}

/** Head noun per category, so a Spanish summary opens with the right word and gender. */
const NOUN_ES = {
  "lock-cases": "caja de cerradura de embutir",
  deadbolts: "cerrojo",
  "panic-exit-devices": "barra antipánico",
  "lever-handles": "manija de palanca",
  "knob-locks": "cerradura de pomo",
  "night-latches-rim-locks": "cerradura de sobreponer",
  "grip-handle-sets": "juego de manija con placa",
  "door-closers": "cierrapuertas",
  "lock-cylinders": "cilindro",
  "bathroom-accessories": "accesorio de baño",
  "brass-steel-hinges": "bisagra",
  "door-hinges": "bisagra",
  "stainless-steel-handles": "manija de acero inoxidable",
};

/** Feminine head nouns, so the article agrees. Spanish puts the adjective after. */
const FEMININE = /^(caja|manija|cerradura|bisagra|barra)/;

/**
 * Whether a spec value can be dropped mid-sentence.
 *
 * 44 records hold a whole English sentence where a value belongs — model 001's Material
 * reads "304SS / 304 Stainless Steel with Plated and suit for Panic Exit Device." Folding
 * that into a summary produced "Una barra antipánico de 304ss / 304 stainless steel with
 * plated and suit for panic exit device., para puerta cortafuego." The row still renders
 * in the spec table, where a long value is merely ugly; it just cannot go in a sentence.
 */
function usableAsPhrase(text) {
  return text.length <= 40 && !/[.;]/.test(text.trim().replace(/\.$/, ""));
}

/** Lower-cases prose but leaves order codes and alloy grades alone: 304SS, PB, SSS/PSS. */
function soften(text) {
  return text
    .split(/(\s+)/)
    .map((word) => (/[A-Z]{2,}|\d/.test(word) ? word : word.toLowerCase()))
    .join("")
    .replace(/\.$/, "");
}

function summaryEs(product) {
  const rows = product.specs ?? [];
  const get = (label) => rows.find((r) => r.label === label)?.value;
  const noun = NOUN_ES[product.categoryPath[0]];
  if (!noun) return null;

  let text = `${FEMININE.test(noun) ? "Una" : "Un"} ${noun}`;

  /*
    Spanish attaches the material with "de", so a value that is itself a noun phrase —
    "Cuerpo de hierro" — must be reduced to its head noun, or the sentence reads
    "caja de cerradura de embutir de cuerpo de hierro". English tolerates that stacking
    because it has no linking preposition; Spanish does not.
  */
  const material = get("Material");
  if (material && usableAsPhrase(material)) {
    text += ` de ${soften(value(material)).replace(/^(cuerpo|juego|caja) de /, "")}`;
  }

  const centre = get("Centre distance");
  const backset = get("Backset");
  if (centre && backset) {
    text += `, distancia entre ejes de ${value(centre)} y entrada de ${value(backset)}`;
  } else if (backset) {
    text += `, entrada de ${value(backset)}`;
  }

  if (get("Cylinder") === "Euro profile") text += ", preparada para cilindro europeo";

  const fn = get("Function");
  if (fn && usableAsPhrase(fn)) text += `, función ${soften(value(fn))}`;

  const application = get("Application");
  if (application && usableAsPhrase(application)) text += `, para ${soften(value(application))}`;

  return `${text}.`;
}

let translated = 0;
for (const file of readdirSync(DIR)) {
  const path = `${DIR}/${file}`;
  const product = JSON.parse(readFileSync(path, "utf8"));

  const specsEs = (product.specs ?? []).map((row) => {
    const label = glossary.labels[normalise(row.label)];
    if (!label) note(`LABEL: ${normalise(row.label)}`);
    return { label: label ?? row.label, value: value(row.value) };
  });

  const summary = summaryEs(product);
  if (!specsEs.length && !summary) continue;

  product.nameEs = glossary.categories[product.categoryPath[0]] ?? product.name;
  if (specsEs.length) product.specsEs = specsEs;
  if (summary) product.summaryEs = summary;
  translated += 1;

  if (write) writeFileSync(path, `${JSON.stringify(product, null, 2)}\n`);
}

const sorted = [...missing.entries()].sort((a, b) => b[1] - a[1]);
const untranslatedUses = sorted.reduce((n, [, count]) => n + count, 0);
console.log(`products given Spanish fields : ${translated}`);
console.log(`terms with no glossary entry  : ${sorted.length}, used ${untranslatedUses} times`);
const shown = process.argv.includes("--all") ? sorted : sorted.slice(0, 25);
for (const [term, count] of shown) console.log(`  ${String(count).padStart(4)}  ${term}`);
if (shown.length < sorted.length) console.log(`  … ${sorted.length - shown.length} more; re-run with --all`);
if (!write) console.log("\nReport only. Re-run with --write.");
