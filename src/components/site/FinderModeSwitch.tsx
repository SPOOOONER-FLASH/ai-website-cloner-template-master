import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The switch between the two ways into the same catalogue.
 *
 * ---------------------------------------------------------------------------
 * WHY TWO MODES AND NOT ONE TOOL
 *
 * The Catalogue is a filter: every facet visible, independent, results underneath. It is
 * the right tool for somebody who already has the vocabulary — they want the eleven satin
 * stainless mortise locks and they want them now.
 *
 * The Configurator asks one question at a time and derives each question's options from
 * what is still in play, so no answer can lead to nothing. It is the right tool for
 * somebody who cannot answer "material?" cold, which — from the Clarity sessions — is
 * most people arriving on a category page for the first time.
 *
 * Merging them would produce a filter with a wizard bolted on, worse at both jobs. Hiding
 * one behind the other means most readers never learn it exists. So: two routes, one
 * control, present on both.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS IS TWO LINKS AND NOT A TAB WIDGET
 *
 * The site is a static export. A client-side tab would leave one mode with no URL — and
 * a mode with no URL cannot be linked to in an email, cannot be indexed, and cannot be
 * the page a buyer returns to. Both routes already exist and rank independently; this
 * component only makes the pair reachable from either side.
 *
 * The active side renders as a link marked `aria-current="page"`, not as a disabled
 * control. A visible control that does nothing when pressed is exactly the dead click
 * Clarity flagged in the footer, and the fix there was the same: mark where you are
 * rather than offering a press that goes nowhere.
 */

const COPY = {
  en: {
    label: "How to browse the catalogue",
    catalogue: "Catalogue",
    catalogueHint: "Search and filter all models",
    configurator: "Configurator",
    configuratorHint: "Answer a few questions",
  },
  es: {
    label: "Cómo recorrer el catálogo",
    catalogue: "Catálogo",
    catalogueHint: "Buscar y filtrar todos los modelos",
    configurator: "Configurador",
    configuratorHint: "Responda unas preguntas",
  },
} as const;

export function FinderModeSwitch({
  active,
  locale = "en",
  className,
}: {
  active: "catalogue" | "configurator";
  locale?: "en" | "es";
  className?: string;
}) {
  const t = COPY[locale];
  const base = locale === "es" ? "/es" : "";

  const items = [
    { key: "catalogue" as const, href: `${base}/product-finder/`, label: t.catalogue, hint: t.catalogueHint },
    { key: "configurator" as const, href: `${base}/configurator/`, label: t.configurator, hint: t.configuratorHint },
  ];

  return (
    <nav aria-label={t.label} className={cn("finder-mode", className)}>
      {items.map((item) =>
        item.key === active ? (
          /*
            Still a link, so its address is visible in the status bar and it can be copied
            — a reader who wants to send somebody "the configurator" is usually already
            standing on it.
          */
          <Link key={item.key} href={item.href} aria-current="page" className="finder-mode-item">
            {item.label}
          </Link>
        ) : (
          <Link key={item.key} href={item.href} className="finder-mode-item" title={item.hint}>
            {item.label}
          </Link>
        ),
      )}
    </nav>
  );
}
