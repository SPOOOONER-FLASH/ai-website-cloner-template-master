import {
  DOOR_CONFIGURATION_CODES,
  FINISH_CODES,
  FUNCTION_CODES,
} from "../data/finish-codes.ts";

/**
 * Reads an order code the way the factory writes one.
 *
 * ---------------------------------------------------------------------------
 * THE GRAMMAR, AND HOW IT WAS FOUND
 *
 * It was not documented anywhere. It fell out of counting suffixes across the catalogue
 * on 2026-09-14: 78 models ending `ET`, 28 ending `BK`, 12 ending `PS` — and every one
 * of those with a `Function` spec row saying, respectively, "Entrance — keyed outside",
 * "Privacy — bathroom, turn button inside" and "Passage". The first two letters of the
 * same suffixes were the finish codes already in use elsewhere in the record.
 *
 *   587 SSBK   →   587  ·  SS (stainless)      ·  BK (privacy)
 *   201 PBET   →   201  ·  PB (polished brass) ·  ET (entrance)
 *   LH852 GMBK →   LH852 · GM (gun metal)      ·  BK (privacy)
 *
 * So a four-letter suffix is two two-letter codes, finish first.
 *
 * ---------------------------------------------------------------------------
 * WHY IT SPLITS BY POSITION AND NOT BY MATCHING LETTERS
 *
 * `BS` is a finish code AND a function code — `9212 BNBS` uses it as the second, the
 * cylinder range uses it as the first. A parser that scans for known codes anywhere in
 * the suffix has to guess which one `BS` is, and will be wrong half the time.
 *
 * Position settles it with no guessing: characters 0–1 are the finish slot, 2–3 are the
 * function slot, and each is then looked up in its OWN table. A code in the wrong slot
 * simply does not resolve, which is the correct outcome — `023 ETAN` comes back
 * unresolved rather than being read as a finish called ET.
 *
 * ---------------------------------------------------------------------------
 * UNRESOLVED IS A RESULT, NOT A FAILURE
 *
 * Roughly a fifth of suffixes in the catalogue do not parse: product words that happen
 * to trail the model (`ANTI THEFT`, `GLASS DOOR`), three-letter codes, and combinations
 * whose halves are not in either table. Returning them in `unresolved` rather than
 * throwing is deliberate — `scripts/audit-finish-codes.mjs` prints that list, and it is
 * how the factory question list stays specific instead of saying "some codes are unclear".
 */

const FINISH_BY_CODE = new Map(FINISH_CODES.map((entry) => [entry.code, entry]));
const FUNCTION_BY_CODE = new Map(FUNCTION_CODES.map((entry) => [entry.code, entry]));
const DOOR_BY_CODE = new Map(DOOR_CONFIGURATION_CODES.map((entry) => [entry.code, entry]));

export interface ParsedOrderCode {
  /** The model number with its suffixes removed. Never empty. */
  base: string;
  /**
   * Finish codes, in the order they appear.
   *
   * A list rather than one value because the catalogue has two-tone models — `9211 BNAC`
   * is black nickel and antique copper, `70 SNDK CP` carries a second finish after the
   * suffix. Returning only the first would have printed half of those products' finish
   * on the page and lost the other half silently.
   */
  finishes: string[];
  /** Function code, upper case, only when it is in the function table. */
  fn?: string;
  /** Door-configuration letter (S/D), only on the ranges where it is confirmed. */
  door?: string;
  /** Suffix tokens that resolved to none of the above, upper case, in order. */
  unresolved: string[];
}

/**
 * Splits a model number into base, finish and function.
 *
 * Accepts the three separators the catalogue actually uses — space, hyphen, underscore —
 * because the same code is written `564-MB`, `587 SSBK` and occasionally with neither.
 */
export function parseOrderCode(model: string, options?: { doorCodes?: boolean }): ParsedOrderCode {
  const tokens = String(model ?? "")
    .trim()
    .split(/[\s\-_]+/)
    .filter(Boolean);

  if (tokens.length === 0) return { base: "", finishes: [], unresolved: [] };

  const [base, ...rest] = tokens;
  const result: ParsedOrderCode = { base, finishes: [], unresolved: [] };
  const addFinish = (code: string) => {
    if (!result.finishes.includes(code)) result.finishes.push(code);
  };

  for (const token of rest) {
    const upper = token.toUpperCase();

    /*
      Four letters: two two-letter codes. The second slot is read as a function first and
      a finish second, which is the order that settles `BS` — it is both, and `9212 BNBS`
      means the function. `9211 BNAC` falls through to the finish reading and comes back
      two-tone, which is what that product is.

      Both halves must resolve or the whole token is unresolved: a half-read code is the
      thing this file exists to avoid.
    */
    if (/^[A-Z]{4}$/.test(upper)) {
      const finish = upper.slice(0, 2);
      const tail = upper.slice(2);
      if (FINISH_BY_CODE.has(finish)) {
        if (FUNCTION_BY_CODE.has(tail)) {
          addFinish(finish);
          if (!result.fn) result.fn = tail;
          continue;
        }
        if (FINISH_BY_CODE.has(tail)) {
          addFinish(finish);
          addFinish(tail);
          continue;
        }
      }
    }

    /* A bare code: finish alone (`564 MB`) or function alone (`023 ET`). */
    if (FINISH_BY_CODE.has(upper)) {
      addFinish(upper);
      continue;
    }
    if (FUNCTION_BY_CODE.has(upper) && !result.fn) {
      result.fn = upper;
      continue;
    }

    /*
      The single letter is only read where the catalogue confirms it — the escape-hardware
      range, where 316-S and 316-D carry `Door Type` spec rows saying single and double.
      The same letter on a door viewer means something the factory has not told us, so the
      caller opts in rather than the parser assuming.
    */
    if (options?.doorCodes && DOOR_BY_CODE.has(upper) && !result.door) {
      result.door = upper;
      continue;
    }

    result.unresolved.push(upper);
  }

  return result;
}

/**
 * Turns a raw `finishes[]` value into canonical codes.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS MESSIER THAN IT SHOULD BE
 *
 * The field was filled in by hand over years, and the same finish appears as `PB`,
 * `Polished Brass`, `Pb=polish Brass`, `PB Brass Polish` and `PB Are Available`. Some
 * cells hold a whole list crammed into one string — `PB.AB.AC.CP.SN`,
 * `GP.NB.AB.AC.SN.BRN.BC.NP.CP.CB.` — with dots as separators, which is why dots are
 * split on even though a dot normally ends a sentence.
 *
 * Normalising on read rather than rewriting 258 records is the safer half of the job:
 * the raw text stays exactly as the factory wrote it, and if this reader is wrong about
 * a cell the evidence to correct it is still there. Rewriting the records first would
 * have destroyed the only copy of the original wording.
 *
 * Trailing words that are commentary rather than finish — "available", "optional",
 * "custom colors available" — are dropped before lookup, since they modify the offer
 * and not the colour.
 */
export interface ParsedFinishValue {
  codes: string[];
  /** Fragments that named neither a known code nor a known name. */
  unresolved: string[];
}

/** Written names that appear in the field, mapped back to their code. */
const NAME_TO_CODE = new Map<string, string>([
  ["satin stainless steel", "SSS"],
  ["satin stainless", "SSS"],
  ["polished stainless steel", "PSS"],
  ["polished stainless", "PSS"],
  ["mirror polished", "PSS"],
  ["stainless steel", "SS"],
  ["polished brass", "PB"],
  ["polish brass", "PB"],
  ["brass polish", "PB"],
  ["antique brass", "AB"],
  ["antique copper", "AC"],
  ["chrome", "CP"],
  ["chrome plated", "CP"],
  ["chrome-plated", "CP"],
  ["satin chrome", "SC"],
  ["satin nickel", "SN"],
  ["stain nickel", "SN"],
  ["nickel-plated", "NP"],
  ["nickel plated", "NP"],
  ["black nickel", "BN"],
  ["black nickle", "BN"],
  ["gun metal", "GM"],
  ["matte black", "MB"],
  ["matt black", "MB"],
  ["black", "BL"],
  ["pvd", "PVD"],
]);

/** Words that qualify the offer rather than name a finish. */
const COMMENTARY = /\b(available|optional|custom(?:izable|ized)?|colou?rs?|to order|other|all|multiple|are|is|also)\b/gi;

/**
 * `Satin Stainless Steel (SSS)` — a name with its own code in brackets after it.
 *
 * Reduced to the code before anything else runs, because the alternative is reading the
 * cell as two finishes: the name resolving one way and the bracketed code another. On
 * `Satin Stainless Steel (SS)` those two answers genuinely differ, and the bracket is
 * the factory telling us which code it uses for that product.
 */
const NAME_WITH_CODE = /[A-Za-z][A-Za-z\s-]*\(\s*([A-Z]{2,3})\s*\)/g;

export function parseFinishValue(raw: string): ParsedFinishValue {
  const codes: string[] = [];
  const unresolved: string[] = [];

  const add = (code: string) => {
    if (!codes.includes(code)) codes.push(code);
  };

  /*
    `Pb=polish Brass` states the code and its expansion in one cell. Keeping only the
    left-hand side lands on the code table directly.
  */
  const fragments = String(raw ?? "")
    .replace(NAME_WITH_CODE, " $1 ")
    .split(/[.,;/、]|\s+or\s+|\s+and\s+|[()（）]/gi)
    .map((fragment) => fragment.split("=")[0])
    .map((fragment) => fragment.replace(COMMENTARY, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  for (const fragment of fragments) {
    const upper = fragment.toUpperCase();
    if (FINISH_BY_CODE.has(upper)) {
      add(upper);
      continue;
    }

    const named = NAME_TO_CODE.get(fragment.toLowerCase());
    if (named) {
      add(named);
      continue;
    }

    /*
      `PB Brass Polish`, `BN Black Nickle` — the code and its expansion side by side with
      no separator. Every token that is itself a code counts; the rest is the expansion
      the factory wrote for it. Requiring the code to be a whole token is what keeps this
      from reading `SB` out of the middle of a word.
    */
    const tokens = fragment.split(/\s+/).map((token) => token.toUpperCase());
    const tokenCodes = tokens.filter((token) => FINISH_BY_CODE.has(token));
    if (tokenCodes.length) {
      for (const code of tokenCodes) add(code);
      continue;
    }

    unresolved.push(fragment);
  }

  return { codes, unresolved };
}

/** The table row for a finish code, or undefined. */
export function finishCode(code: string) {
  return FINISH_BY_CODE.get(code.toUpperCase());
}

/** The table row for a function code, or undefined. */
export function functionCode(code: string) {
  return FUNCTION_BY_CODE.get(code.toUpperCase());
}
