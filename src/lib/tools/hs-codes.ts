/**
 * Door hardware → HS code (tool page /door-hardware-hs-code-finder/, 2026-10-19).
 *
 * Every code here is copied from a guide this site already publishes, and nowhere else:
 *   six digits   content/guides/door-hardware-hs-codes-2026.json (subheading tables)
 *   India        content/guides/india-hsn-codes-door-hardware-2026.json (eight-digit tables)
 * An item a guide does not place is not in this list; an India line the India guide does not
 * give is null and the page says to ask a broker. Six digits are international; anything
 * longer is national and the importer's responsibility — the guide's own rule.
 *
 * `categories` are catalogue category paths whose products the tool recommends for the item.
 */
export interface HsItem {
  id: string;
  /** English label; the page translates it. */
  label: string;
  hs: string;
  india: string | null;
  /** English, from the guides; optional. */
  note?: string;
  categories: string[];
}

export const HS_ITEMS: readonly HsItem[] = [
  {
    id: "lock-case",
    label: "Mortise lock case (lock body)",
    hs: "8301.40",
    india: "8301 40 90",
    note: "Ask your broker whether a case shipped without its cylinder is declared as a lock or as a part (8301.60).",
    categories: ["lock-cases"],
  },
  {
    id: "cylinder",
    label: "Lock cylinder",
    hs: "8301.40",
    india: "8301 40 90 or 8301 60 00",
    note: "Practice varies on whether a cylinder shipped on its own is a lock or a part of one. Ask before the first shipment.",
    categories: ["lock-cylinders"],
  },
  {
    id: "lockset",
    label: "Cylindrical or tubular lockset (knob or lever that locks)",
    hs: "8301.40",
    india: "8301 40 90",
    categories: ["knob-locks"],
  },
  { id: "deadbolt", label: "Deadbolt", hs: "8301.40", india: "8301 40 90", categories: ["deadbolts"] },
  {
    id: "rim-lock",
    label: "Rim lock or night latch",
    hs: "8301.40",
    india: "8301 40 90",
    categories: ["night-latches-rim-locks"],
  },
  { id: "padlock", label: "Padlock", hs: "8301.10", india: "8301 10 00", categories: [] },
  {
    id: "keys",
    label: "Keys or key blanks shipped without their locks",
    hs: "8301.70",
    india: "8301 70 00",
    note: "Keys supplied with the lock they operate travel under the lock's own code.",
    categories: [],
  },
  {
    id: "hinge",
    label: "Door hinge",
    hs: "8302.10",
    india: "8302 10 10 (steel and stainless steel), 8302 10 20 (brass), 8302 10 90 (zinc alloy, aluminum and other)",
    note: "The material on the invoice must match the eight-digit item.",
    categories: ["brass-steel-hinges"],
  },
  {
    id: "handle",
    label: "Lever or pull handle sold without a lock",
    hs: "8302.41",
    india: "8302 41 10",
    note: "A handle that locks is a lock (8301.40). A handle for furniture is 8302.42.",
    categories: ["stainless-steel-handles", "glass-door-accessories/glass-door-handles"],
  },
  {
    id: "flush-bolt",
    label: "Flush bolt",
    hs: "8302.41",
    india: "8302 41 10",
    note: "In India a flush bolt is not a tower bolt (8302 41 20).",
    categories: ["hardware-accessories/door-flush-bolts"],
  },
  {
    id: "door-stop",
    label: "Door stop",
    hs: "8302.41",
    india: "8302 41 10",
    categories: ["hardware-accessories/door-stoppers"],
  },
  {
    id: "exit-trim",
    label: "Exit device trim",
    hs: "8302.41",
    india: null,
    categories: ["panic-exit-devices/exterior-trim"],
  },
  {
    id: "closer",
    label: "Door closer",
    hs: "8302.60",
    india: "8302 60 00",
    note: "A closer has its own subheading: it is neither a lock (8301) nor a building fitting (8302.41). The arm and brackets in the same box go with the closer.",
    categories: ["door-closers"],
  },
];

/** True when a product's category path falls under one of the item's categories. */
export function inCategories(categoryPath: readonly string[], categories: readonly string[]): boolean {
  const path = categoryPath.join("/");
  return categories.some((c) => path === c || path.startsWith(`${c}/`));
}
