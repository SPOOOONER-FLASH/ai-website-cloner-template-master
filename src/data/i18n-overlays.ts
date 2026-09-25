import type { OverlayLocale } from "./locales.ts";

import frUi from "../../content/i18n/fr/ui.json" with { type: "json" };
import frProducts from "../../content/i18n/fr/products.json" with { type: "json" };
import frCategories from "../../content/i18n/fr/categories.json" with { type: "json" };
import frNews from "../../content/i18n/fr/news.json" with { type: "json" };
import frGuides from "../../content/i18n/fr/guides.json" with { type: "json" };
import frProjects from "../../content/i18n/fr/projects.json" with { type: "json" };
import frFaq from "../../content/i18n/fr/faq.json" with { type: "json" };
import frGlossary from "../../content/i18n/fr/glossary.json" with { type: "json" };

import deUi from "../../content/i18n/de/ui.json" with { type: "json" };
import deProducts from "../../content/i18n/de/products.json" with { type: "json" };
import deCategories from "../../content/i18n/de/categories.json" with { type: "json" };
import deNews from "../../content/i18n/de/news.json" with { type: "json" };
import deGuides from "../../content/i18n/de/guides.json" with { type: "json" };
import deProjects from "../../content/i18n/de/projects.json" with { type: "json" };
import deFaq from "../../content/i18n/de/faq.json" with { type: "json" };
import deGlossary from "../../content/i18n/de/glossary.json" with { type: "json" };

import jaUi from "../../content/i18n/ja/ui.json" with { type: "json" };
import jaProducts from "../../content/i18n/ja/products.json" with { type: "json" };
import jaCategories from "../../content/i18n/ja/categories.json" with { type: "json" };
import jaNews from "../../content/i18n/ja/news.json" with { type: "json" };
import jaGuides from "../../content/i18n/ja/guides.json" with { type: "json" };
import jaProjects from "../../content/i18n/ja/projects.json" with { type: "json" };
import jaFaq from "../../content/i18n/ja/faq.json" with { type: "json" };
import jaGlossary from "../../content/i18n/ja/glossary.json" with { type: "json" };

import koUi from "../../content/i18n/ko/ui.json" with { type: "json" };
import koProducts from "../../content/i18n/ko/products.json" with { type: "json" };
import koCategories from "../../content/i18n/ko/categories.json" with { type: "json" };
import koNews from "../../content/i18n/ko/news.json" with { type: "json" };
import koGuides from "../../content/i18n/ko/guides.json" with { type: "json" };
import koProjects from "../../content/i18n/ko/projects.json" with { type: "json" };
import koFaq from "../../content/i18n/ko/faq.json" with { type: "json" };
import koGlossary from "../../content/i18n/ko/glossary.json" with { type: "json" };

import trUi from "../../content/i18n/tr/ui.json" with { type: "json" };
import trProducts from "../../content/i18n/tr/products.json" with { type: "json" };
import trCategories from "../../content/i18n/tr/categories.json" with { type: "json" };
import trNews from "../../content/i18n/tr/news.json" with { type: "json" };
import trGuides from "../../content/i18n/tr/guides.json" with { type: "json" };
import trProjects from "../../content/i18n/tr/projects.json" with { type: "json" };
import trFaq from "../../content/i18n/tr/faq.json" with { type: "json" };
import trGlossary from "../../content/i18n/tr/glossary.json" with { type: "json" };

import ruUi from "../../content/i18n/ru/ui.json" with { type: "json" };
import ruProducts from "../../content/i18n/ru/products.json" with { type: "json" };
import ruCategories from "../../content/i18n/ru/categories.json" with { type: "json" };
import ruNews from "../../content/i18n/ru/news.json" with { type: "json" };
import ruGuides from "../../content/i18n/ru/guides.json" with { type: "json" };
import ruProjects from "../../content/i18n/ru/projects.json" with { type: "json" };
import ruFaq from "../../content/i18n/ru/faq.json" with { type: "json" };
import ruGlossary from "../../content/i18n/ru/glossary.json" with { type: "json" };

import arUi from "../../content/i18n/ar/ui.json" with { type: "json" };
import arProducts from "../../content/i18n/ar/products.json" with { type: "json" };
import arCategories from "../../content/i18n/ar/categories.json" with { type: "json" };
import arNews from "../../content/i18n/ar/news.json" with { type: "json" };
import arGuides from "../../content/i18n/ar/guides.json" with { type: "json" };
import arProjects from "../../content/i18n/ar/projects.json" with { type: "json" };
import arFaq from "../../content/i18n/ar/faq.json" with { type: "json" };
import arGlossary from "../../content/i18n/ar/glossary.json" with { type: "json" };

/**
 * The translation overlays, one bundle per overlay locale, read from content/i18n/<code>/.
 *
 * ---------------------------------------------------------------------------
 * WHY THE TRANSLATIONS ARE NOT ON THE RECORDS
 *
 * Spanish and Portuguese live on the records as `nameEs` / `namePt`: 29 suffixed fields
 * across the types, written one locale at a time over a month. Seven more locales that
 * way is 200 suffixed fields on every product JSON and a type that no editor can read.
 * The overlay keeps each language in its own directory, keyed by the record's slug, and
 * src/lib/i18n.ts stitches them onto the record at build time.
 *
 * Statically imported, all seven, so the build can tree-shake nothing and the export is
 * deterministic — the same reason `content/products` is generated into a module rather
 * than read from disk at render time. `with { type: "json" }` so `node --test` can load
 * this module too; a bare JSON import is refused there (see src/data/locales.ts).
 */
export type Translated = Record<string, unknown>;

export interface GlossaryOverlay {
  specLabels: Record<string, string>;
  specValues: Record<string, string>;
  finishNames: Record<string, string>;
  materialNames: Record<string, string>;
  categoryNames: Record<string, string>;
  productNames: Record<string, string>;
  /**
   * Trade vocabulary the writers must reuse in copy and articles — keyed by the English
   * term. Client, 2026-09-25: "ironmongery" (the trade's own name for door hardware) and
   * "customize" (tooling a part for one market) are core words; each locale carries its own
   * industry wording (tasks/2026-09-25-ironmongery-customize-brief.md §3.5).
   */
  terms?: Record<string, string>;
}

export interface OverlayBundle {
  /** English sentence → translated sentence. */
  ui: Record<string, string>;
  products: Record<string, Translated>;
  categories: Record<string, Translated>;
  news: Record<string, Translated>;
  guides: Record<string, Translated>;
  projects: Record<string, Translated>;
  /** English question → { question, answer }. */
  faq: Record<string, { question: string; answer: string }>;
  glossary: GlossaryOverlay;
}

const bundle = (
  ui: unknown,
  products: unknown,
  categories: unknown,
  news: unknown,
  guides: unknown,
  projects: unknown,
  faq: unknown,
  glossary: unknown,
): OverlayBundle => ({
  ui: ui as OverlayBundle["ui"],
  products: products as OverlayBundle["products"],
  categories: categories as OverlayBundle["categories"],
  news: news as OverlayBundle["news"],
  guides: guides as OverlayBundle["guides"],
  projects: projects as OverlayBundle["projects"],
  faq: faq as OverlayBundle["faq"],
  glossary: glossary as GlossaryOverlay,
});

export const overlays: Record<OverlayLocale, OverlayBundle> = {
  fr: bundle(frUi, frProducts, frCategories, frNews, frGuides, frProjects, frFaq, frGlossary),
  de: bundle(deUi, deProducts, deCategories, deNews, deGuides, deProjects, deFaq, deGlossary),
  ja: bundle(jaUi, jaProducts, jaCategories, jaNews, jaGuides, jaProjects, jaFaq, jaGlossary),
  ko: bundle(koUi, koProducts, koCategories, koNews, koGuides, koProjects, koFaq, koGlossary),
  tr: bundle(trUi, trProducts, trCategories, trNews, trGuides, trProjects, trFaq, trGlossary),
  ru: bundle(ruUi, ruProducts, ruCategories, ruNews, ruGuides, ruProjects, ruFaq, ruGlossary),
  ar: bundle(arUi, arProducts, arCategories, arNews, arGuides, arProjects, arFaq, arGlossary),
};
