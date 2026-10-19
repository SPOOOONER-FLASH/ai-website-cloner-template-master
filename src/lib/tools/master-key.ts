/**
 * Key symbols for a master key plan (tool page /master-key-plan-generator/, 2026-10-19).
 *
 * The convention is the one content/news/how-to-write-a-keying-schedule-with-template.json
 * publishes (DHI keying nomenclature, as reflected in BHMA A156.28):
 *
 *   3 levels  GM → masters A, B → change keys A1, A2, B1
 *   4 levels  GGM → grand masters A, B → masters AA, AB → change keys AA1, AA2
 *   5 levels  GGM → A → AA → sub-masters AAA, AAB → change keys AAA1
 *
 * Two levels are not offered: the article names no symbols for them, and a convention we
 * cannot cite is the kind of plausible detail this site does not invent.
 *
 * Symbols only. Whether a platform can carry the plan is the platform's mastering rules
 * (content/guides/master-key-hierarchy-planning-2026.json), so nothing here counts capacity.
 */
export type Levels = 3 | 4 | 5;

export interface KeyPlanInput {
  levels: Levels;
  /** Keys at each level between the top key and the change keys, top first. */
  branches: number[];
  /** Change keys under each lowest master. */
  changeKeys: number;
}

export interface KeyNode {
  symbol: string;
  /** "GGM" | "GM" | "M" | "SM" | "CK" */
  role: string;
  /** Every key above this one, nearest first: the keys that also open its cylinder. */
  above: string[];
  children: KeyNode[];
}

export const MAX_BRANCH = 26;
export const MAX_CHANGE = 99;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** How many intermediate levels a plan of this size has (between top key and change keys). */
export const branchLevels = (levels: Levels) => levels - 2;

export function validPlan(input: KeyPlanInput): boolean {
  return (
    input.branches.length === branchLevels(input.levels) &&
    input.branches.every((n) => Number.isInteger(n) && n >= 1 && n <= MAX_BRANCH) &&
    Number.isInteger(input.changeKeys) &&
    input.changeKeys >= 1 &&
    input.changeKeys <= MAX_CHANGE
  );
}

export function keyPlan(input: KeyPlanInput): KeyNode {
  if (!validPlan(input)) throw new Error("invalid key plan");
  const top = input.levels === 3 ? "GM" : "GGM";
  const roles = input.levels === 3 ? ["M"] : input.levels === 4 ? ["GM", "M"] : ["GM", "M", "SM"];

  const build = (prefix: string, depth: number, above: string[]): KeyNode[] => {
    if (depth === input.branches.length) {
      return Array.from({ length: input.changeKeys }, (_, i) => ({
        symbol: `${prefix}${i + 1}`,
        role: "CK",
        above,
        children: [],
      }));
    }
    return Array.from({ length: input.branches[depth] }, (_, i) => {
      const symbol = `${prefix}${LETTERS[i]}`;
      return { symbol, role: roles[depth], above, children: build(symbol, depth + 1, [symbol, ...above]) };
    });
  };

  return { symbol: top, role: top, above: [], children: build("", 0, [top]) };
}

/** Every node, top first, depth-first — the order a key chart is read in. */
export function flatten(node: KeyNode): KeyNode[] {
  return [node, ...node.children.flatMap(flatten)];
}
