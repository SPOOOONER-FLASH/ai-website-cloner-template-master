/** Canonical labels shared by the importer and its tests. */
const LABEL_ALIASES = {
  "Door Thickness": "Door thickness",
  "Center distance": "Centre distance",
  "Centre Distance": "Centre distance",
  "Lock Body Material": "Material",
  "Out case material": "Material",
  "Body Material": "Material",
  "Latch Bolt": "Latch",
  "Finish Options": "Finish",
  "Cylinder Options": "Cylinder",
  "Key Options": "Key options",
  Keys: "Key options",
  "Latch Options": "Latch options",
  Usage: "Application",
  "Suitable Doors": "Application",
  "Door Compatibility": "Application",
  "Model Size": "Size",
  "Door Handing": "Handing",
  Handing: "Handing",
  "Inner structure": "Chassis",
};

export const canonicalLabel = (label) => LABEL_ALIASES[label] ?? label;

/**
 * Certification and standard claims need model-specific documents. Word boundaries on
 * both sides are intentional: `CE\b` alone also matches ordinary words such as Surface.
 */
const CERTIFICATION =
  /\b(?:standard|certif(?:icate|ication)?|EN\s?1\d{3,4}|ANSI|BHMA|CE|fire[\s-]?rated|UL)\b/i;

export const certificationClaim = (value = "") => CERTIFICATION.test(value);

export const canonicalGroupKey = (row) =>
  `${row.cantonlock_slug}\u0000${canonicalLabel(row.label).trim().toLowerCase()}`;

/** Hold a whole field group when its exact source rows disagree. */
export function conflictingCanonicalGroups(rows) {
  const valuesByGroup = new Map();
  for (const row of rows) {
    const key = canonicalGroupKey(row);
    if (!valuesByGroup.has(key)) valuesByGroup.set(key, new Set());
    valuesByGroup.get(key).add(row.stahlock_value.trim().toLowerCase());
  }

  return new Set(
    [...valuesByGroup.entries()]
      .filter(([, values]) => values.size > 1)
      .map(([key]) => key),
  );
}
