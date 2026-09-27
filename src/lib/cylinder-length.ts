/**
 * Euro cylinder sizing, as a function rather than a paragraph.
 *
 * Client instruction, 2026-09-27: turn what the site already knows into tool pages (the
 * QuickCreator articles on tool pages and Product-Led SEO). Every rule here is one the
 * site had already published in content/guides/door-thickness-to-cylinder-length-2026.json
 * and euro-cylinder-size-chart-2026.json — nothing new is claimed by the calculator:
 *
 *   · each half is measured from the fixing-screw center to the outer face of the
 *     escutcheon or rose on that side;
 *   · half-lengths run 27.5, 30, 35, 40 … in 5mm steps, and 27.5 is the shortest there is;
 *   · always round UP — a long half can be corrected with a rose, a short half cannot;
 *   · more than about 3mm proud is a grip for a snapping attack.
 *
 * The overall lengths are the nine the catalog publishes (the length is the leading
 * number of the model code). The per-model split is NOT published, so the result names an
 * overall length and a split to ask for, never a model's split.
 */

export const MIN_HALF_MM = 27.5;
export const MAX_PROUD_MM = 3;

/** The overall lengths the HYDE catalog publishes, in mm. Kept in step by cylinder-length.test.ts. */
export const PUBLISHED_LENGTHS_MM = [45, 47, 54, 56, 60, 65, 70, 80, 90] as const;

export interface CylinderInput {
  /** Leaf thickness at the lock edge, mm. */
  doorMm: number;
  /** Escutcheon or rose depth on the outside face, mm. */
  outsideTrimMm: number;
  /** Escutcheon or rose depth on the inside face, mm. */
  insideTrimMm: number;
  /**
   * Distance from the outside face of the leaf to the cylinder center, mm. Omit for a
   * lock case centered in the leaf, which is most mortise cases in most doors.
   */
  centerFromOutsideMm?: number;
}

export interface HalfResult {
  /** Face-to-datum distance the half has to cover. */
  calculatedMm: number;
  /** The standard half-length it rounds up to. */
  halfMm: number;
  /** How far that half stands proud of the escutcheon face. */
  proudMm: number;
}

export interface CylinderResult {
  outside: HalfResult;
  inside: HalfResult;
  /** Sum of the two standard halves. */
  totalMm: number;
  /** The shortest published overall length that is not shorter than totalMm, or null above 90. */
  publishedMm: number | null;
  /** True when the two halves differ, so the split has a direction that must be stated. */
  asymmetric: boolean;
}

/** Round a required half up the 27.5 / 30 / 35 … ladder. */
export function roundUpHalf(requiredMm: number): number {
  if (requiredMm <= MIN_HALF_MM) return MIN_HALF_MM;
  return Math.ceil(requiredMm / 5 - 1e-9) * 5;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function half(calculatedMm: number): HalfResult {
  const halfMm = roundUpHalf(calculatedMm);
  return { calculatedMm: round1(calculatedMm), halfMm, proudMm: round1(halfMm - calculatedMm) };
}

export function sizeCylinder(input: CylinderInput): CylinderResult {
  const { doorMm, outsideTrimMm, insideTrimMm } = input;
  const center = input.centerFromOutsideMm ?? doorMm / 2;
  const outside = half(center + outsideTrimMm);
  const inside = half(doorMm - center + insideTrimMm);
  const totalMm = outside.halfMm + inside.halfMm;
  const publishedMm = PUBLISHED_LENGTHS_MM.find((l) => l >= totalMm) ?? null;
  return { outside, inside, totalMm, publishedMm, asymmetric: outside.halfMm !== inside.halfMm };
}

/** Whether an input is physically usable: a leaf, non-negative trims, a center inside the leaf. */
export function validCylinderInput(input: CylinderInput): boolean {
  const { doorMm, outsideTrimMm, insideTrimMm, centerFromOutsideMm } = input;
  if (!(doorMm > 0 && doorMm <= 200)) return false;
  if (!(outsideTrimMm >= 0 && outsideTrimMm <= 50 && insideTrimMm >= 0 && insideTrimMm <= 50)) return false;
  if (centerFromOutsideMm !== undefined && !(centerFromOutsideMm > 0 && centerFromOutsideMm < doorMm)) return false;
  return true;
}
