#!/usr/bin/env node
/**
 * Floor springs and top pivots: correct English copy, and the missing Spanish.
 * `npm run copy:floor-springs` (`--check` in test:export)
 *
 * THE DEFECT
 *
 * All 24 of these records carried an English summary describing a DIFFERENT PRODUCT:
 *
 *   D-1031  EN "45# steel pull handle."          PT "Mola de piso."
 *   D-3012  EN "304 Stainless Steel pull handle." PT "Mola de piso em aço inoxidável 304."
 *
 * A pull-handle batch was templated as `"{material} pull handle."` and the noun was never
 * changed. The Portuguese was written separately and is right, so the two languages have
 * been contradicting each other on every one of these pages — and because `t()` falls
 * back to English when a locale field is missing, the English sentence is also what the
 * Spanish mirror would print.
 *
 * WHAT THIS WRITES, AND WHY IT IS NOT INVENTION
 *
 * Every word comes from the record's own fields: `material`, `doorTypes`, and the spec
 * rows the factory published (`Double action`, `Max door weight`, `Body size`). Nothing
 * is added that the record does not already state. Where a record has no weight — the
 * five top pivots publish only a body size — the sentence says only what that record
 * knows, rather than borrowing a plausible figure from its neighbours. That is the
 * "a dash costs less trust than a plausible number" rule applied to prose.
 *
 * The spec ROWS are translated from the labels and values already present; no new
 * technical claim is created. Values that are pure measurements are carried across
 * unchanged, which is the only honest thing to do with a number.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const CHECK = process.argv.includes("--check");
const DIR = "content/products";

/*
 * Looked up case- and spelling-insensitively, which is not fussiness.
 *
 * The key here was written with the British spelling of that metal, to match the record. The first run of
 * `node scripts/normalize-us-spelling.mjs` after that rewrote it to "Aluminum + steel" —
 * correctly, by its own lights: it converts British spellings in English text, and it
 * cannot tell a lookup key from a sentence. The record kept the British spelling, because
 * these products are not in the HYDE scope that guard covers. So the map stopped matching
 * the data it was written for, and the script threw on the next run.
 *
 * That is the same failure as the `<language>`/`LOCALE_TAG` mix-up and the trinco/lingueta
 * swap, one level down: a value maintained for one purpose was read by something with a
 * different purpose. Here the fix is to stop depending on the exact bytes.
 */
const MATERIAL_TABLE = [
  ["45# steel", { es: "acero 45#", pt: "aço 45#" }],
  ["304 stainless steel", { es: "acero inoxidable 304", pt: "aço inoxidável 304" }],
  ["aluminum + steel", { es: "aluminio y acero", pt: "alumínio e aço" }],
];
const norm = (s) => (s ?? "").toLowerCase().replace(/alumini?um/g, "aluminum").trim();
const MATERIAL = Object.fromEntries(MATERIAL_TABLE.map(([k, v]) => [norm(k), v]));

const DOORS = {
  "Glass Door": { en: "glass doors", es: "puertas de vidrio", pt: "portas de vidro" },
  "Wooden Door,Metal Door": {
    en: "timber and metal doors",
    es: "puertas de madera y de metal",
    pt: "portas de madeira e de metal",
  },
};

/** Spec labels on these two families only. Values are measurements and carry across. */
const LABELS = {
  Variants: { es: "Variantes", pt: "Variantes" },
  "Double action": { es: "Doble acción", pt: "Duplo sentido" },
  "Max door width (spindle to edge)": {
    es: "Ancho máx. de puerta (eje al canto)",
    pt: "Largura máx. da porta (eixo à borda)",
  },
  "Glass thickness": { es: "Espesor del vidrio", pt: "Espessura do vidro" },
  "Max door weight": { es: "Peso máx. de puerta", pt: "Peso máx. da porta" },
  "Max opening angle": { es: "Ángulo máx. de apertura", pt: "Ângulo máx. de abertura" },
  "90° hold-open": { es: "Retención a 90°", pt: "Retenção a 90°" },
  "Two-stage closing valve": { es: "Válvula de cierre en dos tiempos", pt: "Válvula de fechamento em dois estágios" },
  "Closing force": { es: "Fuerza de cierre", pt: "Força de fechamento" },
  "Min door thickness": { es: "Espesor mín. de puerta", pt: "Espessura mín. da porta" },
  "Door leaf thickness": { es: "Espesor de la hoja", pt: "Espessura da folha" },
  "Body size": { es: "Medidas del cuerpo", pt: "Medidas do corpo" },
  "Pairs with": { es: "Se combina con", pt: "Combina com" },
  /* The hole cut in the floor for the cement case — "caja" / "caixa" would be the box. */
  "Cut-out": { es: "Hueco de obra", pt: "Recorte no piso" },
};

/** Only "Yes" needs translating; everything else in these rows is a measurement. */
const VALUES = { Yes: { es: "Sí", pt: "Sim" }, No: { es: "No", pt: "Não" } };

const NAME = {
  "Floor Spring": { es: "Muelle de piso", pt: "Mola de piso" },
  "Top Pivot": { es: "Pivote superior", pt: "Pivô superior" },
  "Glass Door Top Patch": { es: "Herraje superior para puerta de vidrio", pt: "Ferragem superior para porta de vidro" },
};

const spec = (record, label) => (record.specs ?? []).find((s) => s.label === label)?.value;

function summaries(record) {
  const mat = MATERIAL[norm(record.material)];
  const doors = DOORS[(record.doorTypes ?? []).join(",")];
  if (!mat) throw new Error(`No translation for material "${record.material}" (${record.model})`);
  if (!doors) throw new Error(`No translation for doorTypes ${JSON.stringify(record.doorTypes)} (${record.model})`);

  if (record.name === "Top Pivot") {
    const body = spec(record, "Body size");
    if (!body) throw new Error(`${record.model}: top pivot with no Body size`);
    return {
      en: `${record.material} top pivot for ${doors.en}. Body ${body}.`,
      es: `Pivote superior de ${mat.es} para ${doors.es}. Cuerpo ${body}.`,
      pt: `Pivô superior em ${mat.pt} para ${doors.pt}. Corpo ${body}.`,
    };
  }

  if (record.name === "Glass Door Top Patch") {
    /*
      The patch's decisive number is the glass it clamps, not a door weight — it carries
      none. Where the record also names the floor spring it pairs with, that is said,
      because a patch bought without its matching spring is the commonest way this set is
      ordered wrong.
    */
    const glass = spec(record, "Glass thickness");
    const pairs = spec(record, "Pairs with");
    const en = [`${record.material} top patch fitting for frameless glass doors.`];
    const es = [`Herraje superior de ${mat.es} para puertas de vidrio templado sin marco.`];
    const pt = [`Ferragem superior em ${mat.pt} para portas de vidro temperado sem caixilho.`];
    if (glass) {
      en.push(`Glass thickness ${glass}.`);
      es.push(`Espesor del vidrio ${glass}.`);
      pt.push(`Espessura do vidro ${glass}.`);
    }
    if (pairs) {
      en.push(`Pairs with ${pairs}.`);
      es.push(`Se combina con ${pairs}.`);
      pt.push(`Combina com ${pairs}.`);
    }
    return { en: en.join(" "), es: es.join(" "), pt: pt.join(" ") };
  }

  const dbl = spec(record, "Double action") === "Yes";
  const weight = spec(record, "Max door weight");
  if (!weight) throw new Error(`${record.model}: floor spring with no Max door weight`);
  return {
    en: `${record.material} ${dbl ? "double-action " : ""}floor spring for ${doors.en}. Max door weight ${weight}.`,
    es: `Muelle de piso ${dbl ? "de doble acción " : ""}de ${mat.es} para ${doors.es}. Peso máx. de puerta ${weight}.`,
    pt: `Mola de piso ${dbl ? "de duplo sentido " : ""}em ${mat.pt} para ${doors.pt}. Peso máx. da porta ${weight}.`,
  };
}

/*
 * Two scopes, deliberately different.
 *
 * THE PIVOT SET — floor springs, top pivots and the glass top patches — goes on HYDE, so
 * it gets all three languages. These three belong together: a floor spring carries the
 * leaf, a top pivot holds its head, and on frameless glass the patch is what the pivot
 * clamps to. Selling one without the others is how this set gets ordered wrong.
 *
 * THE OVERHEAD CLOSERS get their English noun corrected and nothing else. They carried the
 * same "pull handle" defect, which is live on RAYEN's English pages today and worth fixing
 * wherever it sits — but they are not published on HYDE, so writing Spanish for them would
 * be work for a page that does not exist. HYDE already has its own door-closers category;
 * whether these six belong in it is a taxonomy decision, not a copy fix, and it is not
 * made here.
 *
 * The 16 hydraulic hinges are untouched: their English is already correct.
 */
const PIVOT_SET = ["floor-springs", "top-pivots", "pivot-top-patches"];
const EN_ONLY = ["overhead-door-closers"];

/** Derived from the record's own specs, exactly as the pivot-set sentences are. */
function closerSummaryEn(record) {
  const doors = DOORS[(record.doorTypes ?? []).join(",")];
  if (!doors) throw new Error(`No doorTypes mapping for ${record.model}`);
  const dbl = spec(record, "Double action") === "Yes";
  const weight = spec(record, "Max door weight") ?? spec(record, "Maximum door weight");
  const base = `${record.material} ${dbl ? "double-action " : ""}overhead door closer for ${doors.en}.`;
  return weight ? `${base} Max door weight ${weight}.` : base;
}

const stale = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = `${DIR}/${file}`;
  const raw = readFileSync(path, "utf8");
  const record = JSON.parse(raw);
  const [top, sub] = record.categoryPath ?? [];
  if (top !== "floor-springs-and-pivots") continue;

  const next = { ...record };

  if (PIVOT_SET.includes(sub)) {
    const s = summaries(record);
    next.summary = s.en;
    next.summaryEs = s.es;
    next.summaryPt = s.pt;
    next.nameEs = NAME[record.name].es;
    next.namePt = NAME[record.name].pt;

    const tr = (locale) =>
      (record.specs ?? []).map(({ label, value }) => {
        const l = LABELS[label];
        if (!l) throw new Error(`No ${locale} translation for spec label "${label}" (${record.model})`);
        return { label: l[locale], value: VALUES[value]?.[locale] ?? value };
      });
    next.specsEs = tr("es");
    next.specsPt = tr("pt");
  } else if (EN_ONLY.includes(sub)) {
    next.summary = closerSummaryEn(record);
  } else {
    continue;
  }

  if (JSON.stringify(next) === JSON.stringify(record)) continue;
  stale.push(record.model);
  if (!CHECK) {
    const eol = raw.includes("\r\n") ? "\r\n" : "\n";
    writeFileSync(path, JSON.stringify(next, null, 2).split("\n").join(eol) + eol, "utf8");
  }
}

if (CHECK && stale.length) {
  console.error(`❌ ${stale.length} records in floor-springs-and-pivots have stale copy: ${stale.slice(0, 6).join(", ")}…`);
  console.error("   Run: npm run copy:floor-springs");
  process.exit(1);
}
console.log(CHECK ? "✅ floor-springs-and-pivots copy is current" : `floor-springs-and-pivots: ${stale.length} records rewritten`);
