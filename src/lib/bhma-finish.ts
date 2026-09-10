/**
 * Our finish codes, translated into the numbers a North American specifier writes.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 *
 * On 2026-09-09 a buyer arrived carrying the competitor part number
 * `rxfse25r510l32d3`. The manufacturer never resolved, but the grammar did, and one
 * fragment identified the buyer: **32D**. That is not a colour, it is a code in the US
 * finish system, and a purchaser who writes it is specifying to BHMA. Our catalogue
 * answers in a different language entirely — `SSS`, `MB`, `CP` — which are house codes
 * that mean nothing outside our own price list.
 *
 * The client's principal put the requirement plainly the next day, about exactly these
 * North American enquiries: 「那就更加需要把资料做好。做清晰。让客人看到专业性」.
 * A finish table that a specifier can read without asking us is that, in one field.
 *
 * ---------------------------------------------------------------------------
 * THE TRAP, AND WHY MOST OF THIS FILE IS ABOUT REFUSING TO ANSWER
 *
 * Every cross-reference chart on the open web prints two columns — `US32D = 630` — and
 * that chart is incomplete in the one way that costs money. **A BHMA number encodes the
 * base metal as well as the appearance.** ANSI/BHMA A156.18 designates
 * A = steel, B = brass and bronze, C = stainless steel, and the code changes with it:
 *
 *   626  satin chromium plated, BRASS or bronze base
 *   652  satin chromium plated, STEEL base
 *   630  satin stainless — solid stainless, not plated at all
 *
 * 626 and 652 are visually the same part and are not the same product: different
 * corrosion resistance, different price, different life. A specifier who writes 626 and
 * receives 652 has a substitution, and on a public building that is a rejected
 * submittal. So a bare finish code cannot be mapped. `CP` on brass and `CP` on steel are
 * two different BHMA numbers, and our catalogue's finish field does not say which.
 *
 * What our catalogue does have is a separate `material` field. So the mapping takes both,
 * and returns null whenever either half is unknown or mixed. A dash costs a question; a
 * wrong number costs a container — the same rule as every other unstated dimension on
 * this site.
 *
 * ---------------------------------------------------------------------------
 * ZINC ALLOY HAS NO BHMA BASE DESIGNATION, AND THAT IS WORTH SAYING OUT LOUD
 *
 * A156.18's base materials are steel, brass/bronze and stainless. **Zinc alloy is not
 * among them**, and 92 of our published products are zinc alloy — the second largest
 * material group in the catalogue after stainless steel.
 *
 * This is not a gap in our data, it is a fact about the part, and it is precisely the
 * fact a North American specifier needs BEFORE a sample rather than after: a specification
 * calling for 626 on a brass base cannot be met with a zinc-alloy casting, however close
 * the colour comes. Saying so costs us some enquiries we would have lost anyway at the
 * submittal stage, and it is the difference between a supplier who knows the standard and
 * one who agrees to everything.
 *
 * Aluminium is in the same position, and so is any record whose material names two metals
 * ("brass or stainless steel") — that is a choice the buyer has not made yet, so there is
 * no single base to designate.
 */

/** A156.18 base-material groups. Zinc and aluminium are deliberately absent. */
export type BhmaBase = "steel" | "brass" | "stainless";

export interface BhmaFinish {
  /** Three-digit ANSI/BHMA A156.18 number. */
  bhma: string;
  /** The older US number a specifier is as likely to write. */
  us: string;
  /** Plain-language name, matching the wording on the BHMA chart. */
  name: string;
}

/**
 * The base material a `material` string determines, or null when it determines none.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS COUNTS METALS INSTEAD OF MATCHING THE FIRST ONE
 *
 * The obvious implementation tests for each metal in turn and returns the first hit, with
 * punctuation treated as a mixed-material veto. It is wrong in both directions on real
 * catalogue values:
 *
 *   "stainless steel 304/201"          one metal in two grades — the slash vetoed it,
 *                                      so six genuinely stainless records got no number
 *   "brass or stainless steel"         two metals, and a first-match reading returns
 *                                      whichever the author happened to type first
 *
 * So the string is reduced to the SET of base groups it mentions, and a designation is
 * returned only when that set has exactly one member. Grades and punctuation stop
 * mattering; what matters is whether the buyer has been told one metal or several.
 *
 * "other" is a member of the set rather than an early return, which is what makes
 * "zinc alloy+brass" resolve to null for the right reason: two groups, not one veto.
 *
 * Stainless is matched and then REMOVED from the string before steel is looked for,
 * because "stainless steel" contains "steel" — without that, every one of the 165
 * published stainless records would also count as a steel mention, land two groups, and
 * come back null.
 */
export function bhmaBase(material: string | undefined): BhmaBase | null {
  if (!material) return null;
  let value = material.toLowerCase();

  const groups = new Set<BhmaBase | "other">();

  /*
    Stainless first, and consumed. `\dss\b` catches the catalogue's "304SS" form, where
    there is no word boundary between the grade and the abbreviation.
  */
  if (/stainless|\bss\b|\dss\b|\b(?:304|316|201)\b/.test(value)) {
    groups.add("stainless");
    value = value.replace(/stainless(\s+steel)?|\bss\b|\dss\b/g, " ");
  }

  if (/brass|bronze|copper/.test(value)) groups.add("brass");
  if (/steel|iron/.test(value)) groups.add("steel");

  /* Real metals we work in that A156.18 has no base group for. */
  if (/zinc|zamak|aluminium|aluminum|abs|plastic|nylon|glass|wood/.test(value)) {
    groups.add("other");
  }

  if (groups.size !== 1) return null;
  const only = [...groups][0];
  return only === "other" ? null : only;
}

/**
 * Our finish codes and their BHMA equivalent per base metal.
 *
 * A code is present only where the equivalence is exact. Six of our codes are absent on
 * purpose and are listed with the reason, because an absence somebody cannot explain gets
 * "fixed" by the next person with a plausible guess:
 *
 *   AB  Antique Brass       — a family of relieved finishes, not one A156.18 number
 *   AC  Antique Copper      — same, and copper is not a base group
 *   BN  Black Nickel        — no A156.18 equivalent
 *   SP  Bright Polished     — names a process, not a colour or a metal
 *   SS  Stainless Steel     — does not say polished or satin; 629 and 630 both fit
 *   NP  Nickel Plated       — bright vs satin unstated; 618 and 619 both fit
 *
 * `SS` is the one that matters most, because it is our commonest finish value. It is left
 * unmapped rather than guessed at 630: satin and polished stainless are two submittals.
 */
const FINISH_TO_BHMA: Record<string, Partial<Record<BhmaBase, BhmaFinish>>> = {
  PB: {
    brass: { bhma: "605", us: "US3", name: "Bright Brass, clear coated" },
  },
  /* Both spellings of satin brass resolve — see the BS/SB note in configurator.ts. */
  SB: {
    brass: { bhma: "606", us: "US4", name: "Satin Brass, clear coated" },
  },
  BS: {
    brass: { bhma: "606", us: "US4", name: "Satin Brass, clear coated" },
  },
  SN: {
    brass: { bhma: "619", us: "US15", name: "Satin Nickel plated, clear coated" },
    steel: { bhma: "646", us: "US15", name: "Satin Nickel plated, clear coated" },
  },
  SC: {
    brass: { bhma: "626", us: "US26D", name: "Satin Chromium plated" },
    steel: { bhma: "652", us: "US26D", name: "Satin Chromium plated" },
  },
  CP: {
    brass: { bhma: "625", us: "US26", name: "Bright Chromium plated" },
    steel: { bhma: "651", us: "US26", name: "Bright Chromium plated" },
  },
  MB: {
    /*
      STEEL ONLY, and this entry is the reason the file is written this way.

      The first draft of it assumed 622 "Flat Black Coated" was base-independent — it is a
      powder coat, so why would the metal underneath change its number? The BHMA chart
      lists 622 against base material A, steel, and nothing else. Matt black over brass or
      over stainless is a real finish we sell and it is not 622, so it gets no number here
      rather than the nearest-looking one. That is the same error this whole module exists
      to prevent, caught in the module's own table.
    */
    steel: { bhma: "622", us: "US19", name: "Flat Black Coated" },
  },
  SSS: {
    stainless: { bhma: "630", us: "US32D", name: "Stainless Steel Metal, Satin" },
  },
  PSS: {
    stainless: { bhma: "629", us: "US32", name: "Stainless Steel Metal, Bright" },
  },
  ORB: {
    brass: { bhma: "613", us: "US10B", name: "Dark Oxidized Satin Bronze, oil rubbed" },
  },
};

/** Codes left unmapped on purpose, with the reason, so the gap is legible. */
export const UNMAPPED_FINISHES: Record<string, string> = {
  AB: "Antique Brass is a family of relieved finishes, not one A156.18 number",
  AC: "Antique Copper has no A156.18 equivalent and copper is not a base group",
  BN: "Black Nickel has no A156.18 equivalent",
  SP: "Bright Polished names a process, not a colour or a base metal",
  SS: "Stainless Steel does not state satin or polished — 630 and 629 both fit",
  NP: "Nickel Plated does not state bright or satin — 618 and 619 both fit",
  "MB over brass or stainless":
    "622 Flat Black Coated is listed against a steel base only; matt black over brass or stainless has no A156.18 number",
};

/**
 * Written-out finish names that mean one of the codes above.
 *
 * The `finishes` field is not a code column. 93 distinct values live in it and a third of
 * them are prose — "Satin Stainless", "Nickel-Plated", "satin stainless steel (SS)". The
 * first version of this module keyed on codes alone and scored 65 of 517 records; the
 * audit's own reason column is what showed why, listing `SATIN STAINLESS` and
 * `SATIN NICKEL` as unrecognised on records whose base metal was perfectly clear.
 *
 * These are spelling variants of a finish already in the table, so accepting them adds no
 * new claim — the number was already sourced. What is NOT here is any name that would
 * need a decision: "Brushed Satin", "Satin", "Black", "Custom finish" and "Painted" all
 * stay unrecognised, because deciding that "Satin" on a stainless part means 630 rather
 * than 629 is exactly the guess the module refuses to make.
 */
const FINISH_ALIASES: Record<string, string> = {
  "SATIN STAINLESS": "SSS",
  "SATIN STAINLESS STEEL": "SSS",
  "SATIN STAINLESS STEEL (SS)": "SSS",
  "POLISHED STAINLESS": "PSS",
  "POLISHED STAINLESS STEEL": "PSS",
  "MIRROR POLISHED": "PSS",
  "SATIN NICKEL": "SN",
  "SATIN CHROME": "SC",
  "SATIN CHROMIUM": "SC",
  CHROME: "CP",
  "CHROME PLATED": "CP",
  "CHROME-PLATED": "CP",
  "POLISHED CHROME": "CP",
  "POLISHED BRASS": "PB",
  "SATIN BRASS": "SB",
  "MATT BLACK": "MB",
  "MATTE BLACK": "MB",
  "OIL RUBBED BRONZE": "ORB",
};

/**
 * The BHMA equivalent of one of our finish codes on one material, or null.
 *
 * Null is the answer in four different situations, and all four are correct:
 * the finish code has no exact equivalent, the material names no A156.18 base, the
 * material names two, or this finish is not offered over that base.
 */
export function bhmaFinish(code: string, material: string | undefined): BhmaFinish | null {
  const base = bhmaBase(material);
  if (!base) return null;
  const key = code.trim().toUpperCase();
  const row = FINISH_TO_BHMA[FINISH_ALIASES[key] ?? key];
  return row?.[base] ?? null;
}

/**
 * Every BHMA equivalent a product can claim, deduplicated, in catalogue order.
 *
 * Takes the raw `finishes` array rather than expanded trade names, because the codes are
 * what the table is keyed on — and splits the dotted code-lists the catalogue contains
 * (`PB.AB.AC.CP.SN`) the same way normaliseFinishes does.
 */
export function bhmaFinishesFor(product: {
  finishes?: readonly string[];
  material?: string;
}): BhmaFinish[] {
  const out = new Map<string, BhmaFinish>();
  for (const entry of product.finishes ?? []) {
    for (const part of entry.split(/[.,/]|\s+or\s+/i)) {
      const match = bhmaFinish(part.trim(), product.material);
      if (match) out.set(match.bhma, match);
    }
  }
  return [...out.values()];
}
