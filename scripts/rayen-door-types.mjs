/**
 * Which door a model can actually be fitted to, derived from its model number.
 *
 * WHY THIS IS DERIVED AND NOT TYPED IN
 * Client, 2026-09-14, in his own words:
 *
 *   「T代表木门金属门 G代表用在玻璃门」
 *   「文件名称如果T（G）的这种，玻璃门和木门2种能用」
 *   「没有的你看图片，如果是玻璃的就只能安装玻璃门，如果是木门的只能用在木门」
 *
 * That is a rule about the model number, so it belongs in code rather than in 194 records
 * typed one at a time. Every RAYEN pull handle and lever carried an empty `doorTypes`
 * before this, which meant the door-type facet on /product-finder/ offered nothing and the
 * buyer's most basic question — will this go on my door — had no answer on the page.
 *
 * WHERE THE PAIR EXISTS, IT IS ALREADY TWO RECORDS
 * A design shipped as both T2690 and G2690 is two models with two different drawings, two
 * projections and two fixings; the client's 「T（G）」 is how the SUPPLIER names the pack that
 * holds both, not a third variant. So this returns one door type set per record and the
 * pairing is carried by `styleFamily`, which already links them in both directions.
 *
 * WHAT IT DELIBERATELY REFUSES TO GUESS
 * Grab bars, paper holders, hooks and shower fittings are not door hardware and get nothing
 * — an empty facet is honest, "wooden door" on a towel rail is not. TSG / USG models get
 * nothing either: they carry no drawing and a single photograph, so the prefix is the only
 * evidence and it is not one of the two the client defined.
 */

const GLASS = ["Glass Door"];
const SOLID = ["Wooden Door", "Metal Door"];

/** Categories whose products are not fitted to a door leaf at all. */
const NOT_DOOR_HARDWARE = new Set([
  "bathroom-accessories",
  "care-grab-bars",
  "hardware-accessories",
]);

export function doorTypesFor({ model, categoryPath = [], nameZh = "" }) {
  if (NOT_DOOR_HARDWARE.has(categoryPath[0])) return [];

  /*
    Floor springs and pivots say it in their own spec table: a model measured in 玻璃厚度
    is a glass-door unit, one measured in 门厚 is not. The Chinese name carries the same
    fact — 无框玻璃门偏轴液动器 names the door it goes in.
  */
  if (categoryPath[0] === "floor-springs-and-pivots") {
    return /玻璃/.test(nameZh) ? GLASS : SOLID;
  }

  const code = String(model ?? "").toUpperCase();
  /* TSG / USG first: they start with T and U but are neither of the client's two cases. */
  if (/^(TSG|USG|MUL|UL|MTR)/.test(code)) return /^(UL|MUL|MTR)/.test(code) ? SOLID : [];
  if (/^G\d/.test(code)) return GLASS;
  if (/^T\d/.test(code)) return SOLID;
  return [];
}
