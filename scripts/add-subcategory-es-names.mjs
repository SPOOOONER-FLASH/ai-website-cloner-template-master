#!/usr/bin/env node
/**
 * Adds Spanish names to the 21 sub-categories in content/categories.json.
 *
 * The fifteen top-level ranges have carried `nameEs` since the Spanish catalogue shipped;
 * their children never did. That was invisible while nothing rendered a sub-category name
 * in Spanish — and it became the blocker the moment /es/collections/ was written, because
 * the page's heading, title and description are all that name.
 *
 * TRADE TERMS, NOT DICTIONARY TRANSLATIONS. These are the words a Spanish-speaking
 * hardware importer uses, which are not always the literal translation:
 *
 *   - "Barras antipánico" is the trade term for panic exit devices; "dispositivo de
 *     salida de pánico" is a back-translation nobody types into a search box.
 *   - "Cerradura tubular" and "cerradura cilíndrica" are the two chassis families and
 *     they are NOT interchangeable, exactly as in English.
 *   - "Mirilla" is the door viewer. "Visor de puerta" is understood but not what a
 *     locksmith or an importer says.
 *   - "Pasador embutido" for a flush bolt — "perno al ras" is a literal rendering that
 *     means nothing in the trade.
 *   - "Herrajes de fijación para puertas de vidrio" for patch fittings: there is no
 *     one-word Spanish equivalent, and "parche" would be actively wrong.
 *
 * A wrong term here is worse than an English one: it makes the page unfindable for the
 * search it exists to answer, while looking translated.
 *
 * Idempotent — run it twice and nothing changes.
 *
 * Usage: node scripts/add-subcategory-es-names.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";

const FILE = "content/categories.json";

/** `<parent>/<child>` -> Spanish name. */
const NAMES = {
  "panic-exit-devices/fire-door": "Barras antipánico para puertas cortafuegos",
  "panic-exit-devices/alarmed": "Barras antipánico con alarma",
  "panic-exit-devices/multi-point": "Cierre multipunto",
  "panic-exit-devices/exterior-trim": "Manillas exteriores para antipánico",
  "panic-exit-devices/special-applications": "Aplicaciones especiales",

  "knob-locks/commercial-locks": "Cerraduras comerciales",
  "knob-locks/heavy-duty-cylindrical-locks": "Cerraduras cilíndricas de servicio pesado",
  "knob-locks/light-duty-cylindrical-locks": "Cerraduras cilíndricas de servicio ligero",
  "knob-locks/tubular-locks": "Cerraduras tubulares",
  "knob-locks/wafer-locks": "Cerraduras de oblea",

  "glass-door-accessories/glass-door-patch-fittings":
    "Herrajes de fijación para puertas de vidrio",
  "glass-door-accessories/glass-door-handles": "Manijas para puertas de vidrio",

  "hardware-accessories/armoured-lock-covers": "Escudos de seguridad",
  "hardware-accessories/door-viewers": "Mirillas",
  "hardware-accessories/door-stoppers": "Topes de puerta",
  "hardware-accessories/power-transfer-devices": "Pasacables para puertas",
  "hardware-accessories/door-flush-bolts": "Pasadores embutidos",
  "hardware-accessories/house-numbers": "Números para viviendas",
  "hardware-accessories/indicators": "Indicadores de libre/ocupado",
  "hardware-accessories/latches": "Picaportes",
  "hardware-accessories/security-door-guards": "Cadenas de seguridad",
};

const raw = readFileSync(FILE, "utf8");
const data = JSON.parse(raw);
const categories = data.categories ?? data;

let added = 0;
let already = 0;
const missing = [];

for (const parent of categories) {
  for (const child of parent.children ?? []) {
    const key = `${parent.slug}/${child.slug}`;
    const name = NAMES[key];
    if (!name) {
      missing.push(key);
      continue;
    }
    if (child.nameEs === name) {
      already += 1;
      continue;
    }
    child.nameEs = name;
    added += 1;
  }
}

if (missing.length) {
  console.error(`No Spanish name for: ${missing.join(", ")}`);
  console.error("Add it to NAMES above rather than shipping an English heading.");
  process.exit(1);
}

if (added) writeFileSync(FILE, `${JSON.stringify(data, null, 2)}\n`);

console.log(`${FILE}: ${added} added, ${already} already correct.`);
