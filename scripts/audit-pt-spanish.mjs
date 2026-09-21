#!/usr/bin/env node
/**
 * Reads every exported /pt/ page and reports the SPANISH still visible on it.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS BESIDE audit-pt-pages.mjs
 *
 * That script uses Spanish as its control: it reports a phrase only when the /pt/ page
 * agrees with the English twin and the Spanish twin has changed it. That rule is what
 * makes it free of false alarms on "EN 1125" and "SSET" — and it is also a blind spot
 * shaped exactly like this tree's history. The /pt/ routes were created by copying the
 * /es/ ones, so the residue they carry is not English. It is Spanish.
 *
 * Spanish residue is the worse of the two. English on a Portuguese page reads as "not
 * translated yet"; Spanish on a Portuguese page reads as "they think we are the same
 * market", and on 2026-09-17 the Portuguese glossary opened with a Spanish headline
 * — "Las palabras de nuestras fichas técnicas" — under a Portuguese <h1> tag, with the
 * Portuguese page audit reporting that route as clean.
 *
 * ---------------------------------------------------------------------------
 * HOW IT DECIDES A STRING IS SPANISH
 *
 * The mirror image of the other audit, with English as the control: a phrase is reported
 * when it appears in the /pt/ page AND in the /es/ twin and does NOT appear in the English
 * twin. If a phrase is identical in all three it is a model number, a standard or a brand.
 * If it is identical in Spanish and Portuguese but not English, it is either Spanish that
 * nobody translated — or one of the many phrases the two languages genuinely spell the
 * same way, which is why IDENTICAL is not enough on its own and each hit carries its
 * Spanish-marker evidence below.
 *
 * MARKERS. A reported phrase must also contain at least one form that does not exist in
 * Portuguese: ¿ ¡, or a word from the list below. Those are the give-aways a reader sees
 * first, and requiring one turns a fuzzy overlap into a finding somebody can act on.
 *
 * Usage:
 *   node scripts/audit-pt-spanish.mjs            # summary, worst routes first
 *   node scripts/audit-pt-spanish.mjs --full     # every phrase, grouped by route
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = "out";
const FULL = process.argv.includes("--full");

/**
 * Words that exist in Spanish and not in Portuguese.
 *
 * Kept deliberately small and certain. A word that exists in both — "porta" does not, but
 * "problema", "material" and "modelo" do — belongs nowhere near this list: a false alarm
 * here costs somebody an afternoon proving a correct page wrong.
 */
const SPANISH_ONLY = [
  "el",
  "los",
  "las",
  "una",
  "unos",
  "unas",
  "del",
  "al",
  "y",
  "es",
  "son",
  "está",
  "están",
  "ser",
  "muy",
  "pero",
  "también",
  "más",
  "aquí",
  "allí",
  "así",
  "sólo",
  "usted",
  "nuestro",
  "nuestros",
  "nuestra",
  "nuestras",
  "su",
  "sus",
  "cómo",
  "qué",
  "cuál",
  "cuáles",
  "según",
  "cuando",
  "donde",
  "puede",
  "pueden",
  "tiene",
  "tienen",
  "hace",
  "hacer",
  "envíenos",
  "consúltenos",
  "pregúntenos",
  "cerradura",
  "cerraduras",
  "manilla",
  "manillas",
  "herraje",
  "herrajes",
  "pestillo",
  "cerradero",
  "embellecedor",
  "bisagra",
  "bisagras",
  "tirador",
  "tiradores",
  "puerta",
  "puertas",
  "acabado",
  "acabados",
  "gama",
  "ficha",
  "fichas",
  "pedido",
  "pedidos",
  "muestra",
  "muestras",
  "plazo",
  "plazos",
  "precio",
  "precios",
  "búsqueda",
  "página",
  "páginas",
  "inicio",
  "empresa",
  "contacto",
  "descargas",
  "noticias",
  "proyectos",
  "fábrica",
  "catálogo",
  "especificación",
  "instalación",
  "seguridad",
  "vidrio",
  "madera",
  "acero",
  "latón",
  "tamaño",
  "espesor",
  "anchura",
  "medida",
  "medidas",
];

/*
  Words above that Portuguese also uses, or uses in a way that would make the marker lie.
  Listed rather than deleted so the next session can see the decision instead of
  re-discovering it: "pedido", "modelo", "material" and "problema" are the same word in
  both languages, and "su"/"y"/"es" appear inside URLs, model codes and abbreviations.
*/
const NOT_A_MARKER = new Set([
  /*
    Spelled identically in Portuguese. "Ver catálogo" on the Portuguese home page was the
    first run's one false positive, and a false positive on an audit somebody acts on is
    expensive: it sends a session to prove a correct page wrong.
  */
  "catálogo",
  "página",
  "páginas",
  "fábrica",
  "acabado",
  "acabados",
  "pedido",
  "pedidos",
  "gama",
  "ficha",
  "fichas",
  "empresa",
  "contacto",
  "vidrio",
  "madera",
  "acero",
  "medida",
  "medidas",
  "su",
  "sus",
  "y",
  "es",
  "al",
  "cuando",
  "donde",
  "ser",
]);

const MARKERS = SPANISH_ONLY.filter((word) => !NOT_A_MARKER.has(word));
const MARKER_RE = new RegExp(`(?:^|[^\\p{L}])(${MARKERS.join("|")})(?![\\p{L}])`, "iu");

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function phrases(text) {
  return new Set(
    text
      .split("\n")
      .map((line) => line.trim().replace(/\s+/g, " "))
      .filter((line) => line.length >= 8 && line.length <= 240)
      .filter((line) => /\s/.test(line))
      .filter((line) => /[A-Za-zÀ-ÿ]{3}/.test(line)),
  );
}

function pages(dir) {
  const found = [];
  if (!existsSync(dir)) return found;
  const walk = (current) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name === "index.html") found.push(path);
    }
  };
  walk(dir);
  return found;
}

const ptPages = pages(join(OUT, "pt"));
if (!ptPages.length) {
  console.error(`No Portuguese pages under ${OUT}/pt. Run a build first.`);
  process.exit(1);
}

const routes = [];

for (const ptPath of ptPages) {
  const route =
    "/" + relative(join(OUT, "pt"), ptPath).split(sep).slice(0, -1).join("/") + "/";
  const clean = route === "//" ? "/" : route;

  const enPath = join(OUT, clean, "index.html");
  const esPath = join(OUT, "es", clean, "index.html");

  const pt = phrases(visibleText(readFileSync(ptPath, "utf8")));
  const en = existsSync(enPath) ? phrases(visibleText(readFileSync(enPath, "utf8"))) : null;
  const es = existsSync(esPath) ? phrases(visibleText(readFileSync(esPath, "utf8"))) : null;

  const spanish = [];
  for (const phrase of pt) {
    /* ¿ and ¡ need no control at all: Portuguese does not have them. */
    const punctuation = /[¿¡]/.test(phrase);
    if (!punctuation) {
      if (!es || !es.has(phrase)) continue;
      if (en && en.has(phrase)) continue;
      if (!MARKER_RE.test(phrase)) continue;
    }
    spanish.push(phrase);
  }

  if (spanish.length) routes.push({ route: `/pt${clean}`, spanish: spanish.sort() });
}

routes.sort((a, b) => b.spanish.length - a.spanish.length);

const byPhrase = new Map();
for (const { route, spanish } of routes) {
  for (const phrase of spanish) {
    if (!byPhrase.has(phrase)) byPhrase.set(phrase, []);
    byPhrase.get(phrase).push(route);
  }
}
const ranked = [...byPhrase.entries()].sort((a, b) => b[1].length - a[1].length);

console.log("Spanish still visible on Portuguese pages\n");
console.log(`  pages with Spanish    ${routes.length} of ${ptPages.length}`);
console.log(`  distinct phrases      ${ranked.length}`);

console.log(`\nMost widespread — one component, not many bugs:\n`);
for (const [phrase, on] of ranked.slice(0, FULL ? ranked.length : 40)) {
  const label = phrase.length > 96 ? `${phrase.slice(0, 93)}…` : phrase;
  console.log(`  ${String(on.length).padStart(4)} pages  ${label}`);
}

if (FULL) {
  console.log(`\n\nBy route:\n`);
  for (const { route, spanish } of routes) {
    console.log(`  ${route}  — ${spanish.length}`);
    for (const phrase of spanish) console.log(`      ${phrase}`);
  }
} else if (ranked.length > 40) {
  console.log(`\n  … ${ranked.length - 40} more. Run with --full for all of them.`);
}

console.log(
  "\n⚠ A phrase is reported when the Spanish twin has it, the English twin does not, and\n" +
    "  it carries a word Portuguese does not use. Anything spelled the same in all three\n" +
    "  is a model number or a standard and is excluded.",
);
