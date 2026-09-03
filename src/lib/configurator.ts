import type { FinderProduct } from "./product-finder";

/**
 * The narrowing model behind the guided configurator.
 *
 * ---------------------------------------------------------------------------
 * WHY A CONFIGURATOR WHEN THERE IS ALREADY A PRODUCT FINDER
 *
 * The Finder is a filter: seven facets, all visible, all independent, and a grid of
 * results underneath. It is the right tool for somebody who already knows the vocabulary
 * — they arrive knowing they want a satin stainless mortise lock and want to see the
 * eleven of them.
 *
 * A configurator answers a different question, and it is the question our Clarity
 * sessions actually show: visitors paging through category listings, going back, paging
 * again. They do not know the vocabulary. Asked "material?" cold, they cannot answer.
 * Asked "what are you specifying?" then "which type?" then given the three materials that
 * remain, they can answer every one.
 *
 * The difference that matters is DEAD ENDS. A filter lets you pick satin brass and fire
 * door and find nothing, and the reader concludes we do not make much. A configurator
 * only ever offers a choice that still leads somewhere, so it cannot produce an empty
 * result. Everything here exists to hold that invariant.
 *
 * ---------------------------------------------------------------------------
 * THE RULES
 *
 * 1. Options are derived from the products still matching, never from a fixed list.
 * 2. A step with fewer than two distinct answers is SKIPPED. Asking a question with one
 *    possible answer is a click that teaches the reader nothing.
 * 3. Steps are ordered from the question a stranger can answer to the one only a
 *    specifier can — kind of product first, finish last.
 */

export type StepKey = "category" | "subCategory" | "material" | "doorType" | "finish";

export interface ConfiguratorStep {
  key: StepKey;
  /** The question, in the buyer's words rather than the database's. */
  question: string;
  /** Shown under the question when the term needs explaining. */
  hint?: string;
}

export const STEPS: readonly ConfiguratorStep[] = [
  {
    key: "category",
    question: "What are you specifying?",
    hint: "The kind of hardware, not the model.",
  },
  {
    key: "subCategory",
    question: "Which type?",
  },
  {
    key: "material",
    question: "What should it be made of?",
    hint: "Stainless resists corrosion; zinc alloy and iron cost less on volume.",
  },
  {
    key: "doorType",
    question: "What door does it go on?",
  },
  {
    key: "finish",
    question: "Which finish?",
    hint: "Ask us about any finish you need that is not listed — most are available to order.",
  },
] as const;

export const STEPS_ES: readonly ConfiguratorStep[] = [
  {
    key: "category",
    question: "¿Qué está especificando?",
    hint: "El tipo de herraje, no el modelo.",
  },
  { key: "subCategory", question: "¿De qué tipo?" },
  {
    key: "material",
    question: "¿De qué material?",
    hint: "El acero inoxidable resiste la corrosión; el zamak y el hierro cuestan menos en volumen.",
  },
  { key: "doorType", question: "¿En qué puerta se instala?" },
  {
    key: "finish",
    question: "¿Qué acabado?",
    hint: "Consúltenos cualquier acabado que no aparezca — casi todos se fabrican bajo pedido.",
  },
] as const;

/** Chosen value per step. A step with no entry has not been answered yet. */
export type Answers = Partial<Record<StepKey, string>>;

export interface Option {
  value: string;
  /** How many products remain if this is chosen. Never zero. */
  count: number;
  /** A photograph from one of those products, so the choice is visual. */
  image?: string;
}

/**
 * Trade names for the finish codes, and the cleanup the finish step needs to be usable.
 *
 * `finishes` is the messiest field in the catalogue: 93 distinct values mixing bare codes
 * (`PSS`, `AB`), full names ("Antique Brass"), a placeholder ("All Available"), and
 * twelve dotted code-lists where one record crams five finishes into a single string
 * (`PB.AB.AC.CP.SN`).
 *
 * Offered raw, the finish question shows the reader "PB.AB.AC.CP.SN" as one option, which
 * is not a finish and not a choice. Splitting and expanding here makes the step answerable
 * without editing 435 records that the design colleague may be revising — the underlying
 * data still wants a pass, and that is on the fill-in sheet.
 *
 * The table is the same one scripts/expand-finish-codes.mjs uses. Eight codes
 * (BP NB CB BC GP BRN N PVD) have no sourced name and are deliberately absent: an invented
 * finish name in a specification is worse than an unexpanded code.
 */
const FINISH_NAMES: Record<string, string> = {
  PB: "Polished Brass",
  AB: "Antique Brass",
  AC: "Antique Copper",
  SN: "Satin Nickel",
  SC: "Satin Chrome",
  CP: "Chrome Plated",
  SB: "Satin Brass",
  SP: "Bright Polished",
  BN: "Black Nickel",
  MB: "Matt Black",
  SS: "Stainless Steel",
  SSS: "Satin Stainless Steel",
  PSS: "Polished Stainless Steel",
  NP: "Nickel Plated",
  ORB: "Oil Rubbed Bronze",
};

/** Says nothing and cannot be chosen against. */
const FINISH_PLACEHOLDERS = new Set(["all available", "available", "n/a", "customized"]);

export function normaliseFinishes(raw: readonly string[] = []): string[] {
  const out = new Set<string>();
  for (const entry of raw) {
    for (const part of entry.split(/[.,/]|\s+or\s+/i)) {
      const value = part.trim().replace(/,$/, "");
      if (!value) continue;
      if (FINISH_PLACEHOLDERS.has(value.toLowerCase())) continue;
      out.add(FINISH_NAMES[value.toUpperCase()] ?? value);
    }
  }
  return [...out];
}

/** Every value a product offers for one step. Multi-valued for finishes and door types. */
function valuesFor(product: FinderProduct, key: StepKey): string[] {
  switch (key) {
    case "category":
      return product.categoryPath[0] ? [product.categoryPath[0]] : [];
    case "subCategory":
      return product.categoryPath[1] ? [product.categoryPath[1]] : [];
    case "material":
      return product.material ? [product.material] : [];
    case "doorType":
      return product.doorTypes ?? [];
    case "finish":
      return normaliseFinishes(product.finishes);
  }
}

/** Does this product satisfy every answer given so far? */
export function satisfies(product: FinderProduct, answers: Answers): boolean {
  return (Object.entries(answers) as [StepKey, string][]).every(
    ([key, value]) => !value || valuesFor(product, key).includes(value),
  );
}

/** The products still in play. */
export function remaining(products: FinderProduct[], answers: Answers): FinderProduct[] {
  return products.filter((product) => satisfies(product, answers));
}

/**
 * The options for one step, given what has been answered.
 *
 * Counts come from the products that would remain, so an option showing "4" leads to four
 * products and an option leading to none is simply absent — that is the no-dead-end
 * invariant, enforced by construction rather than by checking afterwards.
 */
export function optionsFor(
  products: FinderProduct[],
  answers: Answers,
  key: StepKey,
): Option[] {
  const pool = remaining(products, { ...answers, [key]: undefined });
  const counts = new Map<string, { count: number; image?: string }>();

  for (const product of pool) {
    for (const value of valuesFor(product, key)) {
      const entry = counts.get(value) ?? { count: 0, image: undefined };
      entry.count += 1;
      if (!entry.image && product.heroImage?.src) entry.image = product.heroImage.src;
      counts.set(value, entry);
    }
  }

  return [...counts.entries()]
    .map(([value, { count, image }]) => ({ value, count, image }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/**
 * The next question worth asking, or null when there is nothing left to ask.
 *
 * Skips any step whose options do not actually divide what is left. With one option the
 * question has one answer; with none the attribute is unpublished for these products,
 * and asking would be worse than skipping because the reader would read the empty step
 * as a fault.
 *
 * Also stops once the field is down to `enough` products — past that the reader is better
 * served by seeing them than by answering another question about them.
 */
export function nextStep(
  products: FinderProduct[],
  answers: Answers,
  steps: readonly ConfiguratorStep[] = STEPS,
  enough = 3,
): ConfiguratorStep | null {
  if (remaining(products, answers).length <= enough) return null;
  for (const step of steps) {
    if (answers[step.key]) continue;
    if (optionsFor(products, answers, step.key).length > 1) return step;
  }
  return null;
}

/** Every step that will be asked, for the progress rail — including the ones done. */
export function stepPath(
  products: FinderProduct[],
  answers: Answers,
  steps: readonly ConfiguratorStep[] = STEPS,
): StepKey[] {
  const asked: StepKey[] = [];
  const running: Answers = {};
  for (const step of steps) {
    const answer = answers[step.key];
    if (answer) {
      asked.push(step.key);
      running[step.key] = answer;
      continue;
    }
    if (optionsFor(products, running, step.key).length > 1) asked.push(step.key);
  }
  return asked;
}

/**
 * Answers as URL search params, and back.
 *
 * The configuration lives in the URL so it can be sent to a colleague or pasted into an
 * enquiry — which for a door schedule is the normal way this gets used. FSB does the same
 * thing, and it is the difference between a toy and something a specifier can work with.
 */
export function answersToParams(answers: Answers): URLSearchParams {
  const params = new URLSearchParams();
  for (const step of STEPS) {
    const value = answers[step.key];
    if (value) params.set(step.key, value);
  }
  return params;
}

export function answersFromParams(params: URLSearchParams | null): Answers {
  const answers: Answers = {};
  if (!params) return answers;
  for (const step of STEPS) {
    const value = params.get(step.key);
    if (value) answers[step.key] = value;
  }
  return answers;
}

/**
 * Drop the answer to `key` AND everything asked after it.
 *
 * Going back to "material" while keeping a finish chosen under the old material can leave
 * a combination no product has — the one way this UI could still show an empty result.
 * Later answers were chosen from options the earlier one produced, so they do not survive
 * it changing.
 */
export function reviseAt(answers: Answers, key: StepKey): Answers {
  const out: Answers = {};
  for (const step of STEPS) {
    if (step.key === key) break;
    if (answers[step.key]) out[step.key] = answers[step.key];
  }
  return out;
}
