import type { Locale } from "@/data/site";
import { tx } from "../lib/i18n-client.ts";
/**
 * What the search panel offers before anyone types.
 *
 * An empty search box is a dead end: the visitor has to already know a model number or a
 * category name to get anything back, and most arrivals know neither — they know "the
 * push bar for a fire door". These entries are the standing answer to "what is here".
 *
 * SELECTION IS FROM DATA, NOT TASTE. Categories are the six the catalogue actually goes
 * deep on, counted 2026-08-31 over content/products (67 knob locks, 45 lock cases, 42
 * panic exit devices, 40 lever handles, 35 stainless handles, 22 night latches), with
 * panic exit devices lifted to the front because it is the client's flagship line.
 * Products are the best-documented model in each of five categories — every one has a
 * hero image and 9–22 spec rows, so a visitor who follows the suggestion lands on a page
 * that answers questions rather than on a stub.
 *
 * Re-derive rather than guess when the catalogue changes; the picks are asserted in
 * search-suggestions.test.ts, which fails if a suggested page stops being well documented.
 *
 * Plain literals rather than an import from @/data/products: this ships to the browser
 * inside the search dialog, and the catalogue is 435 records.
 */

export interface SearchSuggestion {
  label: string;
  labelEs: string;
  labelPt: string;
  href: string;
}

export const suggestedCategories: SearchSuggestion[] = [
  {
    label: "Panic Exit Devices",
    labelEs: "Barras antipánico",
    labelPt: "Barras antipânico",
    href: "/products/panic-exit-devices/",
  },
  { label: "Lock Cases", labelEs: "Cerraduras de embutir", labelPt: "Fechaduras de embutir", href: "/products/lock-cases/" },
  { label: "Knob Locks", labelEs: "Cerraduras de pomo", labelPt: "Fechaduras de pomo", href: "/products/knob-locks/" },
  { label: "Lever Handles", labelEs: "Manijas de palanca", labelPt: "Maçanetas de alavanca", href: "/products/lever-handles/" },
  {
    label: "Stainless Steel Handles",
    labelEs: "Manijas de acero inoxidable",
    labelPt: "Maçanetas em inox",
    href: "/products/stainless-steel-handles/",
  },
  {
    label: "Night Latches & Rim Locks",
    labelEs: "Cerraduras de sobreponer",
    labelPt: "Fechaduras de sobrepor",
    href: "/products/night-latches-rim-locks/",
  },
];

export const suggestedProducts: SearchSuggestion[] = [
  {
    label: "316-D Panic Exit Device",
    labelEs: "Barra antipánico 316-D",
    labelPt: "Barra antipânico 316-D",
    href: "/products/panic-exit-devices/316-d-panic-exit-device/",
  },
  {
    label: "HY007-S Lock Case",
    labelEs: "Caja de cerradura HY007-S",
    labelPt: "Caixa de fechadura HY007-S",
    href: "/products/lock-cases/hy007-s-lock-case/",
  },
  {
    /*
      EH02, not EH01. EH01 is the better-known model and has the same 18 spec rows, but
      its heroImage carries a label and no `src` — it is one of the 75 records counted as
      "no image", and the only one of the 75 that actually has photographs on disk
      (eight, numbered from -2, with no base file). Designating which of the eight leads
      is an editorial call, so it is reported rather than guessed here; swap back once a
      hero is set.
    */
    label: "EH02 Lever Handle",
    labelEs: "Manija de palanca EH02",
    labelPt: "Maçaneta de alavanca EH02",
    href: "/products/lever-handles/eh02-lever-handle/",
  },
  {
    label: "5870 ACET Cylindrical Lock",
    labelEs: "Cerradura cilíndrica 5870 ACET",
    labelPt: "Fechadura cilíndrica 5870 ACET",
    href: "/products/knob-locks/5870-acet-heavy-duty-cylindrical-lock/",
  },
  {
    label: "564 MB Night Latch",
    labelEs: "Cerradura de sobreponer 564 MB",
    labelPt: "Fechadura de sobrepor 564 MB",
    href: "/products/night-latches-rim-locks/564-mb-night-latch-and-rim-lock/",
  },
];

/**
 * The mirrors serve the same pages under their own prefix.
 *
 * Search is reached from the header on every page, so a suggestion that drops the prefix
 * takes the reader out of their language from anywhere on the site — the same trapdoor as
 * a nav item with no mirror.
 */
export function suggestionHref(suggestion: SearchSuggestion, locale: Locale): string {
  return locale === "en" ? suggestion.href : `/${locale}${suggestion.href}`;
}

/** English, never Spanish, where a Portuguese label is missing — see src/lib/localised.ts. */
export function suggestionLabel(suggestion: SearchSuggestion, locale: Locale): string {
  return tx(locale, suggestion.label, { es: suggestion.labelEs, pt: suggestion.labelPt });
}
