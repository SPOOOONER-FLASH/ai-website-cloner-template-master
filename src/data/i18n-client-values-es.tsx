"use client";

import { registerRecordLocaleTables } from "./i18n-record-locale-tables.ts";

/**
 * The client copy of the ES tables a product card reads, registered at module evaluation
 * the same way src/data/generated/i18n-client/<code>.tsx registers an overlay locale.
 * Rendered by src/app/es/layout.tsx only, so this chunk is downloaded on /es/ pages and
 * nowhere else (2026-09-30; see src/lib/i18n-client.ts for what it replaced).
 */
registerRecordLocaleTables("es");

export function I18nClientValues() {
  return null;
}
