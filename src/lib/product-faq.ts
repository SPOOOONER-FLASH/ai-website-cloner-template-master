import { SPEC_LABELS_ES } from "../data/es-glossary.ts";
import type { Locale } from "../data/site.ts";
import type { Product } from "../data/types.ts";

/**
 * The questions a product page can answer from facts it already states.
 *
 * ---------------------------------------------------------------------------
 * WHY THESE ARE RENDERED AND NOT ONLY MARKED UP
 *
 * The client asked for FAQPage structured data across the catalogue to lift ranking, and
 * I had argued against it. The argument was against the version that would have been
 * spam: a few hundred pages carrying near-identical invisible questions. Google treats a
 * FAQPage whose answers are not on the page as exactly that, and `FaqJsonLd` in
 * JsonLd.tsx already carries the same warning for the /faq page.
 *
 * So this builds the safe version instead. Every question is generated FROM the product's
 * own spec rows, which means two things at once: no two products get the same answers,
 * and the answers are already true. The page renders them, the markup mirrors them, and
 * the audit that asserts markup answers appear in visible text keeps passing.
 *
 * It also happens to be the single largest lever on the AI-citability score, which is
 * measured in concrete figures per page — a backset, a door thickness and a cycle count
 * are three more quotable numbers than the page had before.
 *
 * ---------------------------------------------------------------------------
 * WHAT MAKES A QUESTION ELIGIBLE
 *
 *   1. The fact is stated in this product's own record. Nothing is inferred, and no
 *      standard value is assumed for a missing one — a guessed backset is a container
 *      that cannot be installed.
 *   2. The recorded value appears in the answer verbatim, inside a sentence that names
 *      the model. The first version answered with the bare value — "stainless steel" —
 *      and 46 groups of products came out with byte-identical answer sets, the largest
 *      covering 24 pages. Products really do share a material, so the values were right;
 *      it was the answers that were interchangeable, which is the thin-content pattern
 *      this was meant to avoid. A sentence carrying the model number is unique per page,
 *      still contains the exact recorded value, and is the form an answer engine can
 *      quote whole.
 *   3. At least three questions survive, or the block is not emitted at all. Two
 *      questions is a stub; a stub on 400 pages is the thin content this was supposed to
 *      avoid.
 */

export interface ProductFaqItem {
  question: string;
  answer: string;
}

/**
 * Spec label → the question it answers, in each locale.
 *
 * Ordered by what a buyer asks first, not alphabetically: material and finish decide
 * whether the part suits the environment, backset and door thickness decide whether it
 * fits the door, and everything after that is refinement.
 */
const QUESTIONS: Array<{
  labels: string[];
  en: (model: string) => string;
  es: (model: string) => string;
  enA: (model: string, value: string) => string;
  esA: (model: string, value: string) => string;
}> = [
  {
    labels: ["Material"],
    en: (m) => `What is the ${m} made from?`,
    es: (m) => `¿De qué material es el ${m}?`,
    enA: (m, v) => `The ${m} is made from ${v}.`,
    esA: (m, v) => `El ${m} está fabricado en ${v}.`,
  },
  {
    labels: ["Finish", "Finishes", "Surface Finish", "Finishes Available"],
    en: (m) => `Which finishes is the ${m} available in?`,
    es: (m) => `¿En qué acabados está disponible el ${m}?`,
    enA: (m, v) => `The ${m} is available in ${v}.`,
    esA: (m, v) => `El ${m} está disponible en ${v}.`,
  },
  {
    labels: ["Backset"],
    en: (m) => `What backset does the ${m} use?`,
    es: (m) => `¿Qué entrada (backset) tiene el ${m}?`,
    enA: (m, v) => `The ${m} has a backset of ${v}.`,
    esA: (m, v) => `El ${m} tiene una entrada de ${v}.`,
  },
  {
    labels: ["Door thickness", "Suitable Door Thickness", "Door Thickness Range"],
    en: (m) => `What door thickness does the ${m} suit?`,
    es: (m) => `¿Para qué espesor de puerta sirve el ${m}?`,
    enA: (m, v) => `The ${m} suits a door thickness of ${v}.`,
    esA: (m, v) => `El ${m} sirve para un espesor de puerta de ${v}.`,
  },
  {
    labels: ["Function"],
    en: (m) => `What function does the ${m} provide?`,
    es: (m) => `¿Qué función cumple el ${m}?`,
    enA: (m, v) => `The ${m} provides ${v}.`,
    esA: (m, v) => `El ${m} cumple la función ${v}.`,
  },
  {
    labels: ["Centre distance", "Center Distance", "Grip centre distance"],
    en: (m) => `What is the centre distance on the ${m}?`,
    es: (m) => `¿Cuál es la distancia entre ejes del ${m}?`,
    enA: (m, v) => `The centre distance on the ${m} is ${v}.`,
    esA: (m, v) => `La distancia entre ejes del ${m} es ${v}.`,
  },
  {
    labels: ["Cycle life", "Durability"],
    en: (m) => `How many cycles is the ${m} tested to?`,
    es: (m) => `¿A cuántos ciclos está probado el ${m}?`,
    enA: (m, v) => `The ${m} is tested to ${v}.`,
    esA: (m, v) => `El ${m} está probado a ${v}.`,
  },
  {
    labels: ["Application", "Suitable for", "Suitable For", "Door Type"],
    en: (m) => `Where is the ${m} used?`,
    es: (m) => `¿Dónde se usa el ${m}?`,
    enA: (m, v) => `The ${m} is used on ${v}.`,
    esA: (m, v) => `El ${m} se usa en ${v}.`,
  },
  {
    labels: ["Handing"],
    en: (m) => `Is the ${m} handed?`,
    es: (m) => `¿El ${m} tiene mano (izquierda/derecha)?`,
    enA: (m, v) => `Handing for the ${m}: ${v}.`,
    esA: (m, v) => `Mano del ${m}: ${v}.`,
  },
  {
    labels: ["Size", "Sizes", "Plate size", "Length"],
    en: (m) => `What size is the ${m}?`,
    es: (m) => `¿Qué medidas tiene el ${m}?`,
    enA: (m, v) => `The ${m} measures ${v}.`,
    esA: (m, v) => `El ${m} mide ${v}.`,
  },
  {
    labels: ["Cylinder", "Lock Cylinder", "Cylinder Type"],
    en: (m) => `What cylinder does the ${m} take?`,
    es: (m) => `¿Qué cilindro admite el ${m}?`,
    enA: (m, v) => `The ${m} takes a ${v} cylinder.`,
    esA: (m, v) => `El ${m} admite un cilindro ${v}.`,
  },
  {
    labels: ["Packing", "Pieces per carton"],
    en: (m) => `How is the ${m} packed?`,
    es: (m) => `¿Cómo se embala el ${m}?`,
    enA: (m, v) => `The ${m} is packed as ${v}.`,
    esA: (m, v) => `El ${m} se embala como ${v}.`,
  },
];

/** How many questions one page may carry. Six is where a reader stops reading a list. */
const MAX_ITEMS = 6;
/** Below this the block is a stub, and a stub repeated across the catalogue is spam. */
const MIN_ITEMS = 3;

export function productFaqItems(product: Product, locale: Locale = "en"): ProductFaqItem[] {
  const es = locale === "es";
  const rows = es && product.specsEs?.length ? product.specsEs : product.specs;
  const byLabel = new Map<string, string>();
  for (const row of rows) {
    const value = row.unit ? `${row.value} ${row.unit}` : row.value;
    if (value && !byLabel.has(row.label)) byLabel.set(row.label, value);
  }

  /*
    The subject of every question. `modelTbc` marks a record whose model number is not
    confirmed; asking "what backset does the  use?" reads as a bug, so those products fall
    back to the product name.
  */
  const subject = product.modelTbc
    ? ((es && product.nameEs) || product.name)
    : product.model;

  /*
    On the Spanish side the rows are keyed by SPANISH labels — `specsEs` carries
    "Acabado", not "Finish". Looking up the English label there found nothing, so the
    Spanish pages emitted no questions at all while the English ones emitted six, and the
    two locales silently disagreed about which products had a FAQ.

    Each entry's labels are therefore expanded through the same glossary the rest of the
    Spanish catalogue is composed from. One source for the term, so a translator's
    decision reaches this file too instead of being re-spelled here.
  */
  const lookupLabels = (labels: string[]) =>
    es ? labels.flatMap((l) => [l, SPEC_LABELS_ES[l]]).filter(Boolean) : labels;

  const items: ProductFaqItem[] = [];
  for (const entry of QUESTIONS) {
    if (items.length >= MAX_ITEMS) break;
    const label = lookupLabels(entry.labels).find((l) => byLabel.has(l));
    if (!label) continue;
    const value = byLabel.get(label) as string;
    items.push({
      question: es ? entry.es(subject) : entry.en(subject),
      answer: es ? entry.esA(subject, value) : entry.enA(subject, value),
    });
  }

  /*
    Certifications are appended last and only when the record names one. Twenty of 435
    products carry a certification, so this question is rare — which is correct. A
    certification claim on a product that does not hold one is the most expensive sentence
    on the site.
  */
  if (items.length < MAX_ITEMS && product.certifications?.length) {
    const names = product.certifications
      .map((c) => (c.standard ? `${c.name} (${c.standard})` : c.name))
      .join(", ");
    items.push({
      question: es
        ? `¿Qué normas cumple el ${subject}?`
        : `Which standards does the ${subject} hold?`,
      answer: es
        ? `El ${subject} cumple ${names}.`
        : `The ${subject} holds ${names}.`,
    });
  }

  return items.length >= MIN_ITEMS ? items : [];
}

/** The heading the visible block uses, so the page and the markup cannot drift. */
export function productFaqHeading(locale: Locale = "en"): string {
  return locale === "es" ? "Preguntas frecuentes" : "Common questions";
}

/**
 * The Spanish label for a spec, used where a question needs to name the field itself.
 * Exported so a caller never reaches into the glossary and invents a second spelling.
 */
export function specLabel(label: string, locale: Locale = "en"): string {
  return locale === "es" ? (SPEC_LABELS_ES[label] ?? label) : label;
}
