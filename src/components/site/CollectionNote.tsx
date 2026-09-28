import type { Locale } from "@/data/site";
import { noteFor } from "@/lib/configurator";
import { tx } from "@/lib/i18n";

/**
 * One paragraph under an H2 that says what the sub-category IS, on the collection pages.
 *
 * The definitions already exist — OPTION_NOTES in src/lib/configurator.ts, written for the
 * configurator's choices — and the collection pages had nothing but a count and a list:
 * thirteen of them carried no H2 and scored 38–41 on the citability audit (2026-09-28),
 * the lowest of any indexable page type. A crawler quoting "indicators" got "2 indicators
 * from the Canton Hyland hardware accessories range" and nothing that says what one is.
 */
export function CollectionNote({ slug, name, locale = "en" }: { slug: string; name: string; locale?: Locale }) {
  const note = noteFor(slug, locale);
  if (!note) return null;
  return (
    <section className="layout mt-64 lg:mt-96" aria-labelledby="collection-note-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-7 xl:col-span-14">
          <h2 id="collection-note-heading" className="drawer-eyebrow">
            {tx(locale, "What {name} are", { es: "Qué son {name}", pt: "O que são {name}" }).replace("{name}", name.toLowerCase())}
          </h2>
          <p className="mt-16 max-w-[70ch] text-c1 text-ink">{note}</p>
        </div>
      </div>
    </section>
  );
}
