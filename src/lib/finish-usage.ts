import { publishedProducts } from "../data/products.ts";
import {
  DOOR_CONFIGURATION_CODES,
  FINISH_CODES,
  FUNCTION_CODES,
  type DoorConfigurationCode,
  type FinishCode,
  type FunctionCode,
} from "../data/finish-codes.ts";
import { parseFinishValue, parseOrderCode } from "./order-code.ts";

/**
 * How many published models each code actually appears on.
 *
 * Counted at build time from the catalogue rather than typed beside the table, because a
 * count typed by hand is a claim that decays: the catalogue gained 194 records in one
 * merge on 2026-09-14, and every hand-written number on the site would have been wrong
 * that afternoon with nothing to say so.
 *
 * A code with a count of zero still appears in the table. It means the code is in the
 * scheme but not on anything currently published — which is information, and is different
 * from the code not existing.
 */

const ESCAPE_HARDWARE = "panic-exit-devices";

export interface CodeUsage<T> {
  entry: T;
  /** Published models offering this code, from the model number or the finish field. */
  models: number;
  /** One model number a buyer can look up to see the code in place. Confirmed codes only. */
  example?: string;
}

function countFinishes(): Map<string, { models: number; example?: string }> {
  const counts = new Map<string, { models: number; example?: string }>();

  for (const product of publishedProducts) {
    const codes = new Set<string>();

    const parsed = parseOrderCode(product.model);
    for (const code of parsed.finishes) codes.add(code);

    for (const cell of product.finishes ?? []) {
      for (const code of parseFinishValue(cell).codes) codes.add(code);
    }

    for (const code of codes) {
      const current = counts.get(code) ?? { models: 0 };
      current.models += 1;
      /*
        Prefer an example where the code is in the MODEL number: a buyer checking the
        table wants to see `587 SSBK` and recognise the shape, not a model whose finish
        happens to be listed in a spec row further down its page.
      */
      if (!current.example && parsed.finishes.includes(code)) current.example = product.model;
      counts.set(code, current);
    }
  }

  return counts;
}

function countFunctions(): Map<string, { models: number; example?: string }> {
  const counts = new Map<string, { models: number; example?: string }>();
  for (const product of publishedProducts) {
    const parsed = parseOrderCode(product.model);
    if (!parsed.fn) continue;
    const current = counts.get(parsed.fn) ?? { models: 0 };
    current.models += 1;
    current.example ??= product.model;
    counts.set(parsed.fn, current);
  }
  return counts;
}

function countDoorCodes(): Map<string, { models: number; example?: string }> {
  const counts = new Map<string, { models: number; example?: string }>();
  for (const product of publishedProducts) {
    if (!product.categoryPath?.includes(ESCAPE_HARDWARE)) continue;
    const parsed = parseOrderCode(product.model, { doorCodes: true });
    if (!parsed.door) continue;
    const current = counts.get(parsed.door) ?? { models: 0 };
    current.models += 1;
    current.example ??= product.model;
    counts.set(parsed.door, current);
  }
  return counts;
}

function attach<T extends { code: string; evidence: string }>(
  entries: readonly T[],
  counts: Map<string, { models: number; example?: string }>,
): CodeUsage<T>[] {
  return entries.map((entry) => {
    const count = counts.get(entry.code);
    return {
      entry,
      models: count?.models ?? 0,
      /*
        No example beside an unconfirmed code. An example reads as a demonstration, and
        demonstrating a code we cannot expand would suggest we know what it means.
      */
      example: entry.evidence === "unconfirmed" ? undefined : count?.example,
    };
  });
}

export const finishUsage: CodeUsage<FinishCode>[] = attach(FINISH_CODES, countFinishes());
export const functionUsage: CodeUsage<FunctionCode>[] = attach(FUNCTION_CODES, countFunctions());
export const doorUsage: CodeUsage<DoorConfigurationCode>[] = attach(
  DOOR_CONFIGURATION_CODES,
  countDoorCodes(),
);

/** Published models whose number resolves to at least one finish code. */
export const modelsWithReadableFinish = publishedProducts.filter(
  (product) => parseOrderCode(product.model).finishes.length > 0,
).length;

/** Every published model, for the denominator beside the figure above. */
export const publishedModelCount = publishedProducts.length;
