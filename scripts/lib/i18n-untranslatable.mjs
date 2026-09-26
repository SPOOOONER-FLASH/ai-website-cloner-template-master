/**
 * Strings that have nothing to translate: a brand or legal name, or a value made only of
 * figures, units and codes ("80 kg", "4\" × 3\"", "EN 1125", "SS304"). Without an overlay
 * entry the page prints the English, which for these keys is the right text in every
 * language — so the merge accepts them unchanged, the pruner drops any entry for them, and
 * the tracker leaves them out of the denominator. One rule, three scripts.
 */
export const BRAND = /^(HYDE|STAHLOCK|Canton Hyland(?: Hardware\s*\(Group\) Co\.,? Ltd\.?)?|cantonlock\.com)$/u;
/* Tokens that are not words to translate: SI and trade units, standards bodies, alloy codes. */
export const UNIT_WORDS = /\b(mm|cm|m|kg|g|N·?m|Nm|N|kN|dB|°C|inch|inches|EN|DIN|ANSI|BHMA|UL|CE|ISO|SS|SUS|AISI|PVD|OEM|ODM|MOQ|PC|PCS|CTN|USD|RMB|HRC|IP\d+)\b/g;
export const untranslatable = (en) => BRAND.test(en.trim()) || !/\p{L}/u.test(en.replace(UNIT_WORDS, ""));

/*
  Ordinary words that some languages spell exactly as English does — "Aluminium" in French
  and German, "Nylon" nearly everywhere. The merge accepts them unchanged and the board leaves
  them out of the denominator; the pruner does NOT touch them, because in Japanese or Arabic
  they are real translations.
*/
export const COGNATES = /^(Aluminium|Aluminum|Nylon|Chrome|Zamak|Inox|Polyamide|Nickel)$/iu;
export const cognate = (en) => COGNATES.test(en.trim());
