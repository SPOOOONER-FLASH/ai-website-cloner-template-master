import { FINISH_NAMES_ES, MATERIAL_NAMES_ES, SPEC_LABELS_ES, SPEC_VALUES_ES } from "./es-glossary.ts";
import { FINISH_NAMES_PT, MATERIAL_NAMES_PT, SPEC_LABELS_PT, SPEC_VALUES_PT } from "./pt-glossary.ts";
import { registerRecordLocaleSpecLabels } from "../lib/i18n-client.ts";
import { registerRecordLocaleValues } from "../lib/i18n-client-values.ts";

/**
 * Registers the Spanish or Portuguese tables a product card reads into the client-side
 * i18n registry. Called from two places on purpose — src/data/i18n-client-values-<code>.tsx
 * (the "use client" module, evaluated in the browser and in SSR) and the locale's layout
 * (the server-component graph, which Next evaluates as a separate module instance; a
 * server-rendered card read an empty registry on the overlay locales on 2026-09-27).
 *
 * The table order mirrors VALUE_TABLES in src/lib/spanish-product.ts, the server reading of
 * the same glossary. Only these two layouts import this file, so an English or overlay page
 * never downloads the glossaries (2026-09-30).
 */
export function registerRecordLocaleTables(locale: "es" | "pt"): void {
  if (locale === "es") {
    registerRecordLocaleValues("es", [SPEC_VALUES_ES, MATERIAL_NAMES_ES, FINISH_NAMES_ES]);
    registerRecordLocaleSpecLabels("es", SPEC_LABELS_ES);
  } else {
    registerRecordLocaleValues("pt", [SPEC_VALUES_PT, MATERIAL_NAMES_PT, FINISH_NAMES_PT]);
    registerRecordLocaleSpecLabels("pt", SPEC_LABELS_PT);
  }
}
