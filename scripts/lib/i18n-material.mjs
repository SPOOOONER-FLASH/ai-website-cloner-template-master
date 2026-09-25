/**
 * Does a translated summary name a metal the product is not made of?
 *
 * Release session, 2026-09-25: B024's English summary called a brass hinge stainless, and
 * seven translations followed it. The English side is now guarded by
 * src/data/product-material-summary.test.ts; this is the same rule for the overlays, run by
 * scripts/i18n-merge.mjs on every product item that carries `material`.
 *
 * Deliberately narrow: only stainless / brass / zinc / aluminium, only when the record's
 * material is exactly one of them, and only when the text names a DIFFERENT class and never
 * the right one. "Zinc alloy lever in antique brass finish" mentions brass legitimately, and
 * mentions zinc too, so it passes; "Stainless steel hinge" on a brass record does not.
 */
const CLASSES = {
  stainless: { en: /stainless/i, fr: /inox/i, de: /edelstahl/i, ja: /ステンレス/, ko: /스테인리스/, tr: /paslanmaz/i, ru: /нержаве/i, ar: /مقاوم للصدأ/ },
  brass: { en: /brass/i, fr: /laiton/i, de: /messing/i, ja: /真鍮/, ko: /황동/, tr: /pirinç/i, ru: /латун/i, ar: /نحاس(?!\s*أحمر)/ } /* نحاس أحمر is copper */,
  zinc: { en: /zinc|zamak/i, fr: /zinc|zamak/i, de: /zink|zamak/i, ja: /亜鉛|ザマック/, ko: /아연|자막/, tr: /çinko|zamak/i, ru: /цинк|замак/i, ar: /زنك|زاماك/ },
  aluminium: { en: /alumin/i, fr: /alumin/i, de: /alumin/i, ja: /アルミ/, ko: /알루미늄/, tr: /alümin/i, ru: /алюмин/i, ar: /ألومنيوم|ألمنيوم/ },
};

export function materialClasses(material) {
  return Object.entries(CLASSES).filter(([, re]) => re.en.test(material ?? "")).map(([name]) => name);
}

/** A reason string when `text` contradicts `material` in `locale`, otherwise null. */
export function materialConflict(locale, material, text) {
  const own = materialClasses(material);
  if (own.length !== 1 || typeof text !== "string") return null;
  const [cls] = own;
  const ownRe = CLASSES[cls][locale];
  if (!ownRe || ownRe.test(text)) return null;
  for (const [name, res] of Object.entries(CLASSES)) {
    if (name === cls || !res[locale]) continue;
    if (res[locale].test(text)) return `names ${name} but material is "${material}" (${cls})`;
  }
  return null;
}
