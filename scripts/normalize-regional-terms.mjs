#!/usr/bin/env node
/**
 * Spanish → neutral Latin American trade Spanish, Portuguese → Brazilian Portuguese.
 *
 *   node scripts/normalize-regional-terms.mjs            report what would change (exit 1 if anything)
 *   node scripts/normalize-regional-terms.mjs --write    apply
 *   node scripts/normalize-regional-terms.mjs --review   after --write: list the contexts a person should read
 *
 * ---------------------------------------------------------------------------
 * WHY
 *
 * es-glossary.ts has said since it was written that the register is Latin American — the buyers
 * are in Colombia, Ecuador, Peru, Argentina and Mexico — and then 755 strings on the site said
 * `manilla`, the peninsular word, including dozens inside the glossary itself. The Portuguese
 * side was worse in a different way: the guides were written largely in European Portuguese
 * («aspas», "tem de", "aro", "sítio", "noutro"), while the traffic and the glossary are
 * Brazilian. A Brazilian buyer reads that as "this was not written for us".
 *
 * TARGET, decided 2026-09-24 (TODO item 8):
 *   - Spanish: NEUTRAL Latin American, not Mexican. Peru, Colombia and Argentina send the
 *     enquiries. So `manija` (not manilla), `perilla` (not pomo), `entrada` for backset
 *     (not "distancia al eje"), `planilla de herrajes` for a door hardware schedule (not the
 *     Iberian "cuadro"/"relación", not the Mexican "cédula"), `marco` (not cerco), `piso`
 *     (not suelo), `baño` (not aseo), `perforación` for a bored hole (not taladro, which in
 *     Latin America is the drill). `tirador` and `cerradero` STAY: they are understood
 *     everywhere, whereas `jaladera` and `contrachapa` are Mexican — those two are search
 *     synonyms in es-glossary.ts, never page words.
 *   - Portuguese: Brazilian. "aspas" not «», "tem que" not "tem de", gerund not "está a
 *     fazer", `planilha` for the schedule (not "mapa", not "cronograma", which in Brazil
 *     is a timeline), `marco` for the frame (not "aro"), `lugar` (not "sítio").
 *
 * Only strings under Spanish/Portuguese keys are touched (…Es / …Pt / es / pt), never English,
 * never content/rayen. In src/ only double-quoted literals in the ES/PT data files listed below,
 * so a comment that quotes the rejected word (like the glossary header) survives.
 *
 * The swaps that change grammatical gender (cuadro → planilla, taladro → perforación,
 * pomo → perilla, mapa → planilha) carry the article and a following adjective with them;
 * `--review` prints every changed noun with its neighbours so the rest can be read by a person.
 * src/data/regional-terms.test.ts runs the check and fails if a rejected form comes back.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const L = "\\p{L}";
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const keepCase = (orig, rep) => (orig && orig[0] !== orig[0].toLowerCase() ? cap(rep) : rep);

/** A plain word rule: whole word, case of the first letter preserved. */
function word(from, to) {
  return { re: new RegExp(`(?<![${L}])${from}(?![${L}])`, "giu"), fn: (m) => keepCase(m, to), label: `${from} → ${to}` };
}

/**
 * picaporte → pestillo, one sentence at a time, and REFUSING when the sentence already says
 * "pestillo". A sentence with both words names two different parts (the spec session found
 * "Tres pestillos cuadrados, más picaporte" = three deadbolts plus a latch); swapping would
 * give both parts one word and the row could no longer tell them apart. So it stops the run
 * and a person rewrites that sentence (deadbolt → cerrojo, flush bolt → pasador) first.
 */
function picaporteRule() {
  return {
    re: new RegExp(`[^.;!?\\n]*(?<![${L}])picaportes?(?![${L}])[^.;!?\\n]*`, "giu"),
    fn: (sentence) => {
      if (new RegExp(`(?<![${L}])pestillos?(?![${L}])`, "iu").test(sentence)) {
        throw new Error(
          `picaporte and pestillo in one sentence — rewrite it by hand (D1): «${sentence.trim()}»`,
        );
      }
      return sentence.replace(new RegExp(`(?<![${L}])(p)icaporte(s?)(?![${L}])`, "giu"), (_m, p, s) => `${p}estillo${s}`);
    },
    label: "picaporte → pestillo (D1)",
  };
}

/*
  Gender-carrying swap. `det` maps a determiner before the old noun to the one the new noun needs;
  `adj` turns a following adjective that agreed with the old gender into the new one.
*/
const ES_M2F = { el: "la", un: "una", del: "de la", al: "a la", este: "esta", ese: "esa", aquel: "aquella", nuestro: "nuestra", otro: "otra", mismo: "misma", primer: "primera", nuevo: "nueva", viejo: "vieja", buen: "buena", ningún: "ninguna", algún: "alguna", propio: "propia", segundo: "segunda", solo: "sola", único: "única", pequeño: "pequeña", los: "las", unos: "unas", estos: "estas", esos: "esas", nuestros: "nuestras", otros: "otras", muchos: "muchas", algunos: "algunas", todos: "todas", mismos: "mismas", propios: "propias", nuevos: "nuevas", dichos: "dichas", ambos: "ambas", varios: "varias", pocos: "pocas", cuyo: "cuya", cuyos: "cuyas", dos: "dos", tres: "tres" };
const PT_M2F = { o: "a", um: "uma", do: "da", no: "na", ao: "à", pelo: "pela", num: "numa", dum: "duma", este: "esta", esse: "essa", deste: "desta", desse: "dessa", neste: "nesta", nesse: "nessa", seu: "sua", nosso: "nossa", outro: "outra", mesmo: "mesma", próprio: "própria", novo: "nova", bom: "boa", pequeno: "pequena", primeiro: "primeira", único: "única", velho: "velha", os: "as", uns: "umas", dos: "das", nos: "nas", aos: "às", pelos: "pelas", estes: "estas", esses: "essas", seus: "suas", nossos: "nossas", outros: "outras", mesmos: "mesmas", próprios: "próprias", ambos: "ambas", dois: "duas", vários: "várias", muitos: "muitas", poucos: "poucas", todos: "todas", cujo: "cuja", cujos: "cujas", três: "três" };
const ADJ_O = /^(?:\p{L}+(?:ado|ido|ico|ivo|oso|ero|ario|orio|ano|ino|eto|ecto|uro|izo|iço|ísimo)|pequeño|pequeno|redondo|fijo|fixo|liso|largo|longo|corto|curto|ancho|estrecho|angosto|abierto|aberto|cerrado|fechado|nuevo|novo|viejo|velho|antiguo|antigo|correcto|correto|completo|mismo|mesmo|propio|próprio|típico|escrito|dicho|hueco|macizo|maciço|rígido|bloqueado|equivocado|errado|certo|entero|inteiro|limpio|limpo|junto|distinto|único|solo|nulo)$/iu;
/* words that end like an agreeing adjective but are adverbs or nouns: never re-gendered */
const NOT_ADJ = /^(?:demasiado|lado|grado|estado|mercado|cuidado|resultado|sentido|ruido|período|periodo|medio|meio|poco|pouco|mucho|muito|tanto|todo|pedido|contenido|conteúdo|registro|número|centro|cuadro|quadro|metro|litro)$/iu;

function genderSwap({ lang, from, fromPl, to, toPl, map, skipBefore }) {
  const dets = Object.keys(map).sort((a, b) => b.length - a.length).join("|");
  /* up to two agreeing words before the noun: "los dos", "ese único", "um pequeno" */
  const re = new RegExp(`(?<![${L}])((?:(?:${dets})\\s+){0,2})(${fromPl}|${from})(?![${L}])(\\s+(\\p{L}+))?`, "giu");
  return {
    label: `${from} → ${to}`,
    re,
    fn: (m, chain, noun, tail, next, offset, str) => {
      if (skipBefore && skipBefore.test(str.slice(Math.max(0, offset - 24), offset) + (chain ?? ""))) return m;
      const plural = noun.toLowerCase() === fromPl.toLowerCase();
      let out = "";
      const words = chain && chain.trim() ? chain.trim().split(/\s+/) : [];
      for (const w of words) out += keepCase(w, map[w.toLowerCase()] ?? w) + " ";
      out += keepCase(words.length ? "x" : noun, plural ? toPl : to);
      if (tail) {
        let n = next;
        const base = plural ? n.replace(/s$/u, "") : n;
        if (ADJ_O.test(base) && !NOT_ADJ.test(base)) n = plural ? n.replace(/os$/u, "as") : n.replace(/o$/u, "a");
        out += tail.slice(0, tail.length - next.length) + n;
      }
      return out;
    },
    lang,
  };
}

/* Spanish ------------------------------------------------------------------------------- */
const ES_RULES = [
  word("manillas", "manijas"),
  word("manilla", "manija"),
  genderSwap({ lang: "es", from: "pomo", fromPl: "pomos", to: "perilla", toPl: "perillas", map: ES_M2F }),
  word("distancias al eje", "entradas"),
  word("distancia al eje", "entrada"),
  word("costes", "costos"),
  word("coste", "costo"),
  word("relación de herrajes", "planilla de herrajes"),
  word("relación de puertas", "planilla de puertas"),
  word("cédulas", "planillas"),
  word("cédula", "planilla"),
  /*
    Client decision D1 (2026-09-24): lock terms follow the RAE. Latch bolt = "pestillo",
    deadbolt = "cerrojo", lever = "manija". "picaporte" is retired: it is the lever handle in
    Argentina and the latch or the knocker elsewhere. Hyde 文案 rewrote the article bodies by
    hand first (2026-09-24), because "pestillo" had meant the deadbolt in some paragraphs.
  */
  word("picaporte de resbalón", "pestillo"),
  word("resbalón", "pestillo"),
  // picaporteRule() — switched on once Hyde 文案 has rewritten the two feature sentences (hy008, s564)
  // that name a latch and a deadbolt together; then --write converts the rest (≈96 featuresEs).
  // picaporteRule(),
  word("albercas", "piscinas"),
  word("alberca", "piscina"),
  word("aseos", "baños"),
  word("aseo", "baño"),
  word("cercos", "marcos"),
  word("cerco", "marco"),
  word("suelos", "pisos"),
  word("suelo", "piso"),
  word("lejía", "cloro"),
  word("vídeo", "video"),
  /* the product and promo copy that uses "cuadro" for the schedule (elsewhere in products it is an electrical panel) */
  word("la partida más barata del cuadro", "la partida más barata de la planilla"),
  word("un cuadro de puertas", "una planilla de puertas"),
  word("el cuadro de puertas", "la planilla de puertas"),
  word("revisión de cuadros", "revisión de planillas"),
  word("taladro pasante", "perforación pasante"),
  word("No requiere taladro", "No requiere perforación"),
  word("pedir una oferta", "pedir una cotización"),
  word("ofertar", "cotizar"),
];
/* only in news/guides: "cuadro" there is the hardware schedule; in product specs it can be the spindle */
const ES_PROSE_RULES = [
  genderSwap({ lang: "es", from: "cuadro", fromPl: "cuadros", to: "planilla", toPl: "planillas", map: ES_M2F }),
  genderSwap({ lang: "es", from: "taladro", fromPl: "taladros", to: "perforación", toPl: "perforaciones", map: ES_M2F, skipBefore: /(?:ataques?|resistencia|con)\s+(?:de\s+|al\s+|a\s+)?(?:un\s+|el\s+)?$/iu }),
];

/* Portuguese ----------------------------------------------------------------------------- */
/*
  Words ending in -ar/-er/-ir/-or that are not verbs. Without this, "está a maior parte" became
  "está maiondo parte" and shipped in the push-bar article (Hyde 文案 found it, 2026-09-24).
*/
const NOT_VERB =
  "maior|melhor|pior|menor|anterior|posterior|exterior|interior|superior|inferior|valor|cor|calor|setor|motor|fator|favor|lugar|par|bar|mar|colher|mulher|qualquer|particular|similar|regular|popular|familiar|singular|circular|solar|militar|pilar|dólar|radar";
const INF = `(?!(?:${NOT_VERB})(?![\\p{L}]))\\p{L}+(?:ar|er|ir|or|ôr)(?:-se)?`;
const gerund = (inf) => inf.replace(/-se$/, "").replace(/ar$/u, "ando").replace(/er$/u, "endo").replace(/ir$/u, "indo").replace(/[oô]r$/u, "ondo") + (inf.endsWith("-se") ? "-se" : "");
const PT_RULES = [
  { label: "« » → \" \"", re: /[«»]/g, fn: () => '"' },
  { label: "tem de + infinitivo → tem que", re: new RegExp(`(?<![${L}])(tem|têm|ter|terá|teria|terão|teriam|tinha|tinham|tenha|tenham|tendo) de (?=${INF}(?![${L}]))`, "giu"), fn: (m, v) => `${v} que ` },
  { label: "estar a + infinitivo → gerúndio", re: new RegExp(`(?<![${L}])(está|estão|estar|estava|estavam|esteja|estejam) a (${INF})(?![${L}])`, "giu"), fn: (m, v, inf) => `${v} ${gerund(inf)}` },
  word("connosco", "conosco"),
  word("receção", "recepção"),
  word("ecrã", "tela"),
  word("planeamento", "planejamento"),
  word("gerir", "gerenciar"),
  word("registar", "registrar"),
  word("húmida", "úmida"),
  word("húmido", "úmido"),
  word("económicos", "econômicos"),
  word("económico", "econômico"),
  word("económica", "econômica"),
  word("eletrónica", "eletrônica"),
  word("eletrónico", "eletrônico"),
  word("fenómeno", "fenômeno"),
  word("lixívia", "água sanitária"),
  word("lacado", "laqueado"),
  /* European ó/é before m/n where Brazil writes ô/ê (the -ém endings, "também", "alguém", are the same in both) */
  ...[["molibdénio", "molibdênio"], ["nitrogénio", "nitrogênio"], ["oxigénio", "oxigênio"], ["tungsténio", "tungstênio"], ["homogéneo", "homogêneo"], ["homogénea", "homogênea"], ["incómodos", "incômodos"], ["incómodo", "incômodo"], ["incómoda", "incômoda"], ["cómoda", "cômoda"], ["cómodo", "cômodo"], ["arquitetónicos", "arquitetônicos"], ["arquitetónico", "arquitetônico"], ["arquitetónica", "arquitetônica"], ["acrónimos", "acrônimos"], ["acrónimo", "acrônimo"], ["património", "patrimônio"], ["sinónimo", "sinônimo"], ["anónimo", "anônimo"], ["género", "gênero"], ["prémio", "prêmio"], ["ténis", "tênis"], ["bónus", "bônus"], ["fenómenos", "fenômenos"]].map(([a, b]) => word(a, b)),
  word("secções", "seções"),
  word("secção", "seção"),
  word("factos", "fatos"),
  { label: "tem de se + infinitivo → tem que se", re: new RegExp(`(?<![${L}])(tem|têm|ter) de se (?=${INF}(?![${L}]))`, "giu"), fn: (m, v) => `${v} que se ` },
  word("diz-lhe", "indica"),
  word("dá-lhe", "dá a você"),
  word("enumera-as", "as enumera"),
  word("vossas", "suas"),
  word("vossos", "seus"),
  word("vossa", "sua"),
  word("vosso", "seu"),
  word("invulgarmente", "excepcionalmente"),
  word("invulgares", "incomuns"),
  word("invulgar", "incomum"),
  word("rasto", "rastro"),
  word("noutros", "em outros"),
  word("noutras", "em outras"),
  word("noutro", "em outro"),
  word("noutra", "em outra"),
  word("contra-chapas", "contra-testas"),
  word("contra-chapa", "contra-testa"),
  word("rode a chave", "gire a chave"),
  word("rodada", "girada"),
  word("rodar", "girar"),
  word("a direito", "reto"),
  word("em falta", "faltando"),
  word("pela ordem", "na ordem"),
];
const PT_PROSE_RULES = [
  genderSwap({ lang: "pt", from: "cronograma", fromPl: "cronogramas", to: "planilha", toPl: "planilhas", map: PT_M2F }),
  genderSwap({ lang: "pt", from: "mapa", fromPl: "mapas", to: "planilha", toPl: "planilhas", map: PT_M2F }),
  word("aros", "marcos"),
  word("aro", "marco"),
  word("sítios", "lugares"),
  word("sítio", "lugar"),
];

/* src/ files that hold Spanish page copy in double-quoted literals (Portuguese src copy is not in scope) */
const SRC_ES_FILES = ["src/data/es-glossary.ts", "src/data/capability.ts", "src/data/company.ts", "src/data/es-features.ts", "src/data/finish-codes.ts", "src/data/hardware-terms.ts", "src/data/home-es.ts", "src/data/site.ts", "src/lib/configurator.ts", "src/app/es/projects/page.tsx", "src/components/site/WelcomeIntro.tsx"];
const SRC_ES_RULES = [word("manillas", "manijas"), word("manilla", "manija"), genderSwap({ lang: "es", from: "pomo", fromPl: "pomos", to: "perilla", toPl: "perillas", map: ES_M2F }), word("distancia al eje", "entrada")];

function rulesFor(lang, file) {
  /* category-positioning.json is prose too: its sentences end up in every product description */
  const prose = /content[\\/](news|guides)[\\/]|category-positioning\.json$/.test(file);
  if (lang === "es") return prose ? [...ES_RULES, ...ES_PROSE_RULES] : ES_RULES;
  return prose ? [...PT_RULES, ...PT_PROSE_RULES] : PT_RULES;
}

function applyRules(s, rules, tally) {
  for (const r of rules) {
    s = s.replace(r.re, (...args) => {
      const out = r.fn(...args);
      if (out !== args[0]) tally[r.label] = (tally[r.label] ?? 0) + 1;
      return out;
    });
  }
  return s;
}

function walk(v, lang, file, tally) {
  if (typeof v === "string") return lang ? applyRules(v, rulesFor(lang, file), tally) : v;
  if (Array.isArray(v)) return v.map((x) => walk(x, lang, file, tally));
  if (v && typeof v === "object") {
    const o = {};
    for (const [k, x] of Object.entries(v)) {
      let l = lang;
      if (/Es$/.test(k) || k === "es") l = "es";
      else if (/Pt$/.test(k) || k === "pt") l = "pt";
      else if (/En$/.test(k) || k === "en" || k === "zh") l = null;
      o[k] = walk(x, l, file, tally);
    }
    return o;
  }
  return v;
}

function jsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "rayen" ? [] : jsonFiles(p);
    return e.name.endsWith(".json") ? [p] : [];
  });
}

/** Returns [{ file, tally, next }] for every file that would change. */
export function scan() {
  const changes = [];
  /* category-positioning.json feeds the product titles and descriptions (build-product-titles.mjs) */
  for (const file of [...jsonFiles(path.join(ROOT, "content")), path.join(ROOT, "src/data/category-positioning.json")]) {
    const raw = fs.readFileSync(file, "utf8");
    const tally = {};
    const data = walk(JSON.parse(raw), null, file, tally);
    if (Object.keys(tally).length) {
      const eol = raw.includes("\r\n") ? "\r\n" : "\n";
      changes.push({ file, tally, next: JSON.stringify(data, null, 2).split("\n").join(eol) + eol });
    }
  }
  for (const rel of SRC_ES_FILES) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const tally = {};
    const next = raw.replace(/"(?:[^"\\\n]|\\.)*"/g, (lit) => applyRules(lit, SRC_ES_RULES, tally));
    if (Object.keys(tally).length) changes.push({ file, tally, next });
  }
  return changes;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const mode = process.argv.includes("--write") ? "write" : process.argv.includes("--review") ? "review" : "check";
  if (mode === "review") {
    const re = /(?:\p{L}+\s+){0,2}(?:planillas|planilla|perforaciones|perforación|perillas|perilla|planilhas|planilha)(?:\s+\p{L}+){0,2}/giu;
    const seen = new Map();
    for (const file of [...jsonFiles(path.join(ROOT, "content")), ...SRC_ES_FILES.map((f) => path.join(ROOT, f))]) {
      if (!fs.existsSync(file)) continue;
      for (const m of fs.readFileSync(file, "utf8").matchAll(re)) seen.set(m[0].toLowerCase(), (seen.get(m[0].toLowerCase()) ?? 0) + 1);
    }
    for (const [k, n] of [...seen].sort()) console.log(String(n).padStart(4), k);
  } else {
    const changes = scan();
    const total = {};
    for (const c of changes) for (const [k, n] of Object.entries(c.tally)) total[k] = (total[k] ?? 0) + n;
    for (const [k, n] of Object.entries(total).sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(5), k);
    console.log(`${changes.length} files${mode === "write" ? " written" : " would change"}`);
    if (mode === "write") for (const c of changes) fs.writeFileSync(c.file, c.next);
    else if (changes.length) process.exitCode = 1;
  }
}
export { genderSwap, ES_M2F, PT_M2F, applyRules, picaporteRule };
