#!/usr/bin/env node
/**
 * Rebuilds the two tables, the counted sentences, the summary and the counted FAQ answers in
 * content/guides/mortise-lock-case-comparison-2026.json from the lock-case records, in every
 * language the guide carries (English always; Spanish and Portuguese once bodyEs / bodyPt exist).
 *
 *   node scripts/build-lock-case-tables.mjs          # write
 *   node scripts/build-lock-case-tables.mjs --check  # exit 1 if the guide is stale
 *
 * The guide says "the tables are generated from the specification rows", and until
 * 2026-09-24 they were typed by hand: when the spec session filled center distances on five
 * more cases, src/data/article-catalogue-claims.test.ts went red and the tables were five rows
 * short. The row set here is the test's own (HYDE lock-cases family, both Backset and Center
 * distance parse as mm), so the article, the test and the catalog cannot drift apart again.
 *
 * The summary and FAQ were left to hand until the same day, and had drifted exactly as the
 * tables had (27 cases, 18 at 85mm, nine narrow-stile, against 32, 22 and twelve). They are
 * generated now too. A spec value this script has no Spanish or Portuguese for stops the run:
 * falling back to the English value would publish English inside a translated table.
 *
 * Inches follow src/lib/imperial.ts: nearest 1/16", written 3-3/8". English only; the Spanish
 * and Portuguese tables are metric.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const FILE = "content/guides/mortise-lock-case-comparison-2026.json";
const CHECK = process.argv.includes("--check");

const products = readdirSync("content/products").filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")));
const hyde = products.filter((p) => !p.sites || p.sites.includes("hyde"));
const top = (p) => [].concat(p.categoryPath ?? [])[0];
const spec = (p, label) => p.specs?.find((s) => s.label === label)?.value;
const mm = (v) => Number((v ?? "").match(/(\d+(?:\.\d+)?)\s*mm/)?.[1] ?? NaN);

function inch(value) {
  const sixteenths = Math.round((value / 25.4) * 16);
  const whole = Math.floor(sixteenths / 16);
  let num = sixteenths % 16;
  let den = 16;
  while (num % 2 === 0 && num > 0) { num /= 2; den /= 2; }
  if (num === 0) return `${whole}"`;
  return whole === 0 ? `${num}/${den}"` : `${whole}-${num}/${den}"`;
}

const cases = hyde.filter((p) => top(p) === "lock-cases");
const rows = cases
  .map((p) => ({ p, b: mm(spec(p, "Backset")), c: mm(spec(p, "Center distance")) }))
  .filter((r) => r.b && r.c)
  .sort((x, y) => x.b - y.b || x.c - y.c || x.p.model.localeCompare(y.p.model));
const narrow = rows.filter((r) => r.b <= 35);
const standard = rows.filter((r) => r.b > 35);
const at85 = rows.filter((r) => r.c === 85);
const narrowAt85 = narrow.filter((r) => r.c === 85);
const byCd = new Map();
for (const r of rows.filter((r) => r.c !== 85)) byCd.set(r.c, [...(byCd.get(r.c) ?? []), r.p.model]);
const otherGroups = [...byCd].sort((a, b) => b[0] - a[0]);

// Standard backsets: a single top value more than 10mm clear of the next is reported as an outlier.
const stdBacksets = [...new Set(standard.map((r) => r.b))].sort((a, b) => a - b);
const topB = stdBacksets.at(-1);
const outlier = standard.filter((r) => r.b === topB).length === 1 && topB - stdBacksets.at(-2) > 10 ? topB : null;
const stdMax = outlier ? stdBacksets.at(-2) : topB;

const L = {
  en: {
    body: "body", summary: "summary", faq: "en",
    words: ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],
    and: "and", cases: "cases",
    mmv: (n) => `${n}mm`, cell: (n) => `${n}mm (${inch(n)})`,
    head: "| Model | Backset | Center distance | Cylinder | Also published |\n| --- | --- | --- | --- | --- |",
    notPublished: "not published", faceplate: (v) => `faceplate ${v.replace(/\s*mm$/, "mm")}`,
  },
  es: {
    body: "bodyEs", summary: "summaryEs", faq: "es",
    words: ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve", "veinte"],
    and: "y", cases: "cajas",
    mmv: (n) => `${n} mm`, cell: (n) => `${String(n).replace(".", ",")} mm`,
    head: "| Modelo | Entrada | Distancia entre ejes | Cilindro | También publicado |\n| --- | --- | --- | --- | --- |",
    notPublished: "no publicado", faceplate: (v) => `frente ${v.replace(/\s*mm$/, " mm").replace(/(\d)\.(\d)/g, "$1,$2")}`,
    values: { "Euro profile": "Perfil europeo", "Four round bolts": "Cuatro cerrojos redondos" },
  },
  pt: {
    body: "bodyPt", summary: "summaryPt", faq: "pt",
    words: ["zero", "uma", "duas", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove", "vinte"],
    and: "e", cases: "caixas",
    mmv: (n) => `${n} mm`, cell: (n) => `${String(n).replace(".", ",")} mm`,
    head: "| Modelo | Distância ao eixo | Distância entre eixos | Cilindro | Também publicado |\n| --- | --- | --- | --- | --- |",
    notPublished: "não publicado", faceplate: (v) => `testa ${v.replace(/\s*mm$/, " mm").replace(/(\d)\.(\d)/g, "$1,$2")}`,
    values: { "Euro profile": "Perfil europeu", "Four round bolts": "Quatro ferrolhos redondos" },
  },
};

function helpers(lang) {
  const t = L[lang];
  const word = (n) => t.words[n] ?? String(n);
  const Word = (n) => word(n).charAt(0).toUpperCase() + word(n).slice(1);
  const list = (items) => (items.length === 1 ? items[0] : `${items.slice(0, -1).join(", ")} ${t.and} ${items.at(-1)}`);
  const value = (v) => {
    if (v === undefined) return t.notPublished;
    if (!t.values) return v;
    const out = t.values[v];
    if (!out) throw new Error(`${lang}: no translation for spec value "${v}" — add it to L.${lang}.values`);
    return out;
  };
  const also = (p) => {
    const face = spec(p, "Faceplate");
    return face ? t.faceplate(face) : value(spec(p, "Bolts"));
  };
  const table = (set) => [t.head, ...set.map(({ p, b, c }) =>
    `| ${p.model} | ${t.cell(b)} | ${t.cell(c)} | ${value(spec(p, "Cylinder"))} | ${also(p)} |`)].join("\n");
  const others = list(otherGroups.map(([c, models]) =>
    models.length === 1 ? `${t.mmv(c)} (${models[0]})` : `${t.mmv(c)} (${word(models.length)} ${t.cases}: ${list(models)})`));
  return { t, word, Word, list, table, others };
}

const guide = JSON.parse(readFileSync(FILE, "utf8").replace(/\r\n/g, "\n"));
const next = structuredClone(guide);

// Paragraphs are located in the English body and addressed by the same index in every language.
const en = guide.body;
const at = (re) => {
  const i = en.findIndex((p) => typeof p === "string" && re.test(p));
  if (i < 0) throw new Error(`paragraph not found: ${re}`);
  return i;
};
const P = {
  intro: at(/^This guide lays out every lock case/),
  families: at(/^The first thing the numbers show/),
  narrowTable: at(/^Narrow-stile cases, by backset:/) + 1,
  standardTable: at(/^Standard cases, by backset:/) + 1,
  common: at(/^Across the published cases, 85mm/),
  gaps: at(/^Two kinds of gap are worth knowing/),
};

// Per language: [paragraph, pattern, replacement] for every counted fragment in the prose.
const SENTENCES = {
  en: ({ word }) => [
    [P.intro, /\(\d+ of the \d+ lock-case records/, `(${rows.length} of the ${cases.length} lock-case records`],
    [P.intro, /reading \d+ product pages/, `reading ${cases.length} product pages`],
    [P.families, /and \d+ of the \d+ are in this group/, `and ${narrow.length} of the ${rows.length} are in this group`],
    [P.families, /and \d+ are in that group/, `and ${standard.length} are in that group`],
    [P.common, /: \d+ of the \d+, including \w+ of the \w+ narrow-stile cases\. The others are .*$/, null],
    [P.gaps, /First, \d+ lock-case records do not publish both numbers/, `First, ${cases.length - rows.length} lock-case records do not publish both numbers`],
  ],
  es: () => [
    [P.intro, /\(\d+ de los \d+ registros de cajas de cerradura/, `(${rows.length} de los ${cases.length} registros de cajas de cerradura`],
    [P.intro, /sin leer \d+ fichas de producto/, `sin leer ${cases.length} fichas de producto`],
    [P.families, /y \d+ de las \d+ están en este grupo/, `y ${narrow.length} de las ${rows.length} están en este grupo`],
    [P.families, /y \d+ están en ese grupo/, `y ${standard.length} están en ese grupo`],
    [P.common, /: \d+ de las \d+, incluidas \S+ de las \S+ cajas para perfil estrecho\. Las demás son .*$/, null],
    [P.gaps, /Primero, \d+ registros de cajas de cerradura no publican/, `Primero, ${cases.length - rows.length} registros de cajas de cerradura no publican`],
  ],
  pt: () => [
    [P.intro, /\(\d+ dos \d+ registros de caixas de fechadura/, `(${rows.length} dos ${cases.length} registros de caixas de fechadura`],
    [P.intro, /sem ler \d+ páginas de produto/, `sem ler ${cases.length} páginas de produto`],
    [P.families, /e \d+ das \d+ estão neste grupo/, `e ${narrow.length} das ${rows.length} estão neste grupo`],
    [P.families, /e \d+ estão nesse grupo/, `e ${standard.length} estão nesse grupo`],
    [P.common, /: \d+ das \d+, incluindo \S+ das \S+ caixas para perfil estreito\. As demais são .*$/, null],
    [P.gaps, /Primeiro, \d+ registros de caixas de fechadura não publicam/, `Primeiro, ${cases.length - rows.length} registros de caixas de fechadura não publicam`],
  ],
};
const COMMON = {
  en: ({ word, others }) => `: ${at85.length} of the ${rows.length}, including ${word(narrowAt85.length)} of the ${word(narrow.length)} narrow-stile cases. The others are ${others}.`,
  es: ({ word, others }) => `: ${at85.length} de las ${rows.length}, incluidas ${word(narrowAt85.length)} de las ${word(narrow.length)} cajas para perfil estrecho. Las demás son ${others}.`,
  pt: ({ word, others }) => `: ${at85.length} das ${rows.length}, incluindo ${word(narrowAt85.length)} das ${word(narrow.length)} caixas para perfil estreito. As demais são ${others}.`,
};
const SUMMARY = {
  en: [/^\d+ of our mortise lock cases/, `${rows.length} of our mortise lock cases`],
  es: [/^\d+ de nuestras cajas de cerradura de embutir/, `${rows.length} de nuestras cajas de cerradura de embutir`],
  pt: [/^\d+ das nossas caixas de fechadura de embutir/, `${rows.length} das nossas caixas de fechadura de embutir`],
};
const narrowRange = [narrow[0].b, narrow.at(-1).b];
const FAQ = {
  en: ({ word, Word, list, others }) => ({
    0: `85mm. Of the ${rows.length} lock cases that publish both numbers, ${at85.length} use an 85mm center distance, including ${word(narrowAt85.length)} of the ${word(narrow.length)} narrow-stile cases. The others are ${others}. The center distance must match the handle or plate, so on a replacement measure the existing holes first.`,
    1: `Between ${narrowRange[0]}mm and ${narrowRange[1]}mm on our range. ${Word(narrow.length)} published cases fall in that band: ${list(narrow.map((r) => r.p.model))}. Standard cases for timber and steel doors start at ${stdBacksets[0]}mm and run to ${stdMax}mm${outlier ? `, with one ${outlier}mm outlier` : ""}.`,
    3: `Most do not yet. Among the ${rows.length} cases with both backset and center distance, only the LC07 publishes its full geometry: a 240 × 23mm faceplate, 173mm case height, 72mm case depth, 26mm latch throw and 18.5mm bolt projection. For a replacement, ask for the faceplate and case dimensions before ordering and we will measure them rather than estimate.`,
  }),
  es: ({ word, Word, list, others }) => ({
    0: `85 mm. De las ${rows.length} cajas que publican los dos números, ${at85.length} usan 85 mm de distancia entre ejes, incluidas ${word(narrowAt85.length)} de las ${word(narrow.length)} cajas para perfil estrecho. Las demás son ${others}. La distancia entre ejes tiene que coincidir con la manija o la placa, así que en un reemplazo mida primero los agujeros existentes.`,
    1: `Entre ${narrowRange[0]} y ${narrowRange[1]} mm en nuestra gama. ${Word(narrow.length)} cajas publicadas están en esa franja: ${list(narrow.map((r) => r.p.model))}. Las cajas estándar para puertas de madera y de acero empiezan en ${stdBacksets[0]} mm y llegan a ${stdMax} mm${outlier ? `, con una excepción de ${outlier} mm` : ""}.`,
    3: `La mayoría todavía no. De las ${rows.length} cajas con entrada y distancia entre ejes, solo la LC07 publica su geometría completa: frente de 240 × 23 mm, altura de caja de 173 mm, profundidad de caja de 72 mm, salida del pestillo de 26 mm y proyección del cerrojo de 18,5 mm. Para un reemplazo, solicite las medidas del frente y de la caja antes de hacer el pedido y las mediremos en lugar de estimarlas.`,
  }),
  pt: ({ word, Word, list, others }) => ({
    0: `85 mm. Das ${rows.length} caixas que publicam os dois números, ${at85.length} usam 85 mm de distância entre eixos, incluindo ${word(narrowAt85.length)} das ${word(narrow.length)} caixas para perfil estreito. As demais são ${others}. A distância entre eixos precisa coincidir com a maçaneta ou o espelho, então numa substituição meça primeiro os furos existentes.`,
    1: `Entre ${narrowRange[0]} e ${narrowRange[1]} mm na nossa linha. ${Word(narrow.length)} caixas publicadas estão nessa faixa: ${list(narrow.map((r) => r.p.model))}. As caixas padrão para portas de madeira e de aço começam em ${stdBacksets[0]} mm e vão até ${stdMax} mm${outlier ? `, com uma exceção de ${outlier} mm` : ""}.`,
    3: `A maioria ainda não. Das ${rows.length} caixas com distância ao eixo e distância entre eixos, só a LC07 publica a geometria completa: testa de 240 × 23 mm, altura da caixa de 173 mm, profundidade de 72 mm, curso de 26 mm na peça com mola e projeção do ferrolho de 18,5 mm. Para uma substituição, peça as medidas da testa e da caixa antes de fechar o pedido, e nós as medimos em vez de estimá-las.`,
  }),
};

for (const lang of Object.keys(L)) {
  const h = helpers(lang);
  const t = h.t;
  const src = guide[t.body];
  if (!Array.isArray(src) || !src.length) continue; // language not translated yet
  if (src.length !== en.length) throw new Error(`${lang}: ${src.length} paragraphs against ${en.length} in English`);
  const body = [...src];
  for (const [i, from, to] of SENTENCES[lang](h)) {
    if (!from.test(body[i])) throw new Error(`${lang}: pattern not found in paragraph ${i}: ${from}`);
    body[i] = body[i].replace(from, to ?? COMMON[lang](h));
  }
  body[P.narrowTable] = h.table(narrow);
  body[P.standardTable] = h.table(standard);
  next[t.body] = body;

  const [sFrom, sTo] = SUMMARY[lang];
  if (!sFrom.test(guide[t.summary] ?? "")) throw new Error(`${lang}: summary pattern not found`);
  next[t.summary] = guide[t.summary].replace(sFrom, sTo);

  const faq = guide.faq?.[t.faq];
  if (!faq || faq.length !== guide.faq.en.length) throw new Error(`${lang}: FAQ missing or a different length from English`);
  next.faq[t.faq] = faq.map((item, i) => (FAQ[lang](h)[i] ? { ...item, answer: FAQ[lang](h)[i] } : item));
}

const stale = JSON.stringify(guide) !== JSON.stringify(next);
if (CHECK) {
  if (stale) { console.error(`${FILE} is stale: run node scripts/build-lock-case-tables.mjs`); process.exit(1); }
  console.log("lock-case tables are current");
} else {
  writeFileSync(FILE, JSON.stringify(next, null, 2) + "\n");
  console.log(`${rows.length} of ${cases.length} lock cases: ${narrow.length} narrow-stile, ${standard.length} standard${stale ? "" : " (no change)"}`);
}
