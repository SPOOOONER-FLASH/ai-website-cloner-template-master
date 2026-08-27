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
  [/^([\d.]+)\s*mm$/i, (m) => `${m[1]} mm`],
  // "60/70mm" — one unit shared by two figures, which is how the catalogue writes it.
  [/^([\d]+(?:\s*\/\s*[\d]+)+)\s*mm$/i, (m) => `${m[1].replace(/\s*\/\s*/g, "/")} mm`],
  [
    /^([\d\s./]+mm(?:\s*\/\s*[\d\s./]+mm)?) adjustable, latch and deadbolt both$/i,
    (m, sp) => `${sp(m[1])} regulable, tanto el picaporte como el cerrojo`,
  ],
  // "32x300x600 mm" — a dimension triple; only the separator is language.
  [/^([\d.]+)\s*[x×]\s*([\d.]+)\s*[x×]\s*([\d.]+)\s*mm$/i, (m) => `${m[1]} × ${m[2]} × ${m[3]} mm`],
];

/**
 * A finish or option CODE rather than a word — "SSS/PSS", "PB.AB.AC.CP.SN", "SS".
 * These are what a buyer writes on a purchase order, so they are identical in every
 * language and must NOT be translated. They are also not a coverage gap, so they are not
 * counted as missing.
 */
const IS_CODE = /^[A-Z0-9]{1,5}(\s*[./,+&-]\s*[A-Z0-9]{1,5})*\.?$/;

function translateValue(text) {
  const exact = glossary.values[text];
  if (exact) return exact;
  if (IS_CODE.test(text.trim())) return text.trim();

  // The client writes the same material a dozen ways; casing is not meaning.
  const folded = Object.keys(glossary.values).find(
    (key) => key.toLowerCase() === text.trim().toLowerCase(),
  );
  if (folded) return glossary.values[folded];

  const spaced = (s) => s.replace(/(\d)\s*mm\b/g, "$1 mm");
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
  note(text);
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
    const label = glossary.labels[row.label];
    if (!label) note(`LABEL: ${row.label}`);
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
for (const [term, count] of sorted.slice(0, 25)) console.log(`  ${String(count).padStart(4)}  ${term}`);
if (!write) console.log("\nReport only. Re-run with --write.");
