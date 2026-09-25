import type { MarketLocale } from "../market-locales.ts";
import type { MarketCopy } from "./types.ts";
import { frCopy } from "./fr.ts";
import { deCopy } from "./de.ts";
import { jaCopy } from "./ja.ts";
import { koCopy } from "./ko.ts";
import { trCopy } from "./tr.ts";
import { ruCopy } from "./ru.ts";
import { arCopy } from "./ar.ts";

/**
 * One object per market locale. `Record<MarketLocale, …>` so that adding a code to
 * `marketLocales` without its copy file is a compile error, not an English page.
 */
export const marketCopy: Record<MarketLocale, MarketCopy> = {
  fr: frCopy,
  de: deCopy,
  ja: jaCopy,
  ko: koCopy,
  tr: trCopy,
  ru: ruCopy,
  ar: arCopy,
};
