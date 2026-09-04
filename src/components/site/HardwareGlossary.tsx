import Link from "next/link";
import { categories } from "@/data/categories";
import { OPTION_NOTES, OPTION_NOTES_ES } from "@/lib/configurator";

/**
 * The trade definitions, rendered on the server.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS AS WELL AS THE CARDS
 *
 * The configurator carries the same sentences on its option cards, and those are the ones
 * a reader uses. But the configurator is loaded with `ssr: false` — it has to be, or its
 * Suspense boundary never resolves under `output: "export"` — so none of that writing is
 * in the HTML. Before this component the built /configurator/ page was 293 characters of
 * main content, which is why the GEO audit scored it 35 with 0.0 quotable figures: the
 * worst page on the site was the one with the best writing on it, invisible.
 *
 * So the definitions are also rendered here, statically, by the server. Same constant,
 * one place to edit, two audiences: the cards answer a reader who is choosing, this
 * answers the reader — or the answer engine — who arrived asking what a rim lock is.
 *
 * ---------------------------------------------------------------------------
 * WHY IT IS NOT DUPLICATE CONTENT
 *
 * It is the only server-rendered copy of these sentences. The card version exists solely
 * in the browser, so a crawler sees each definition exactly once on this page. Each entry
 * also links to the category it defines, which turns a glossary into a set of internal
 * links from a defined term to the products that are it — the click path a reader who
 * just learned the word actually wants.
 */

const COPY = {
  en: {
    title: "What these terms mean",
    intro:
      "Every choice the configurator offers, defined. These are the trade's own definitions — what the part is and where it goes — not claims about any particular model.",
    seeAll: "See the models",
  },
  es: {
    title: "Qué significan estos términos",
    intro:
      "Todas las opciones que ofrece el configurador, definidas. Son las definiciones del oficio — qué es la pieza y dónde va — y no afirmaciones sobre ningún modelo concreto.",
    seeAll: "Ver los modelos",
  },
} as const;

export function HardwareGlossary({ locale = "en" }: { locale?: "en" | "es" }) {
  const t = COPY[locale];
  const notes = locale === "es" ? OPTION_NOTES_ES : OPTION_NOTES;
  const base = locale === "es" ? "/es" : "";

  /*
    Ordered by the taxonomy, not by the object's key order, so the list reads down the
    catalogue the way the navigation does: each family, then the types inside it. A
    definition with no matching category — none today, but the constant outlives any one
    taxonomy — would simply not be listed rather than appear detached from everything.
  */
  const entries: { slug: string; name: string; note: string; href: string; child: boolean }[] = [];
  for (const category of categories) {
    const note = notes[category.slug];
    if (note) {
      entries.push({
        slug: category.slug,
        name: (locale === "es" ? category.nameEs : undefined) ?? category.name,
        note,
        href: `${base}/products/${category.slug}/`,
        child: false,
      });
    }
    for (const sub of category.children ?? []) {
      const subNote = notes[sub.slug];
      if (!subNote) continue;
      entries.push({
        slug: sub.slug,
        name: (locale === "es" ? sub.nameEs : undefined) ?? sub.name,
        note: subNote,
        href: `${base}/products/${category.slug}/`,
        child: true,
      });
    }
  }

  return (
    <section className="layout mt-96" aria-labelledby="glossary-title">
      <div className="col-content grid w-full grid-cols gap-x gap-y-32">
        <div className="col-span-full xl:col-span-10">
          <h2 id="glossary-title" className="text-h2 text-ink">
            {t.title}
          </h2>
          <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">{t.intro}</p>
        </div>

        {/*
          A description list, because that is what this is: a term and its definition. The
          markup is the meaning here — an assistant extracting a definition from a <dl>
          knows which half is which, and from a stack of <div>s it has to guess.
        */}
        <dl className="col-span-full grid grid-cols-1 gap-x gap-y-32 md:grid-cols-2 xl:col-span-20 xl:grid-cols-3">
          {entries.map((entry) => (
            <div key={entry.slug} className="border-t border-line pt-16">
              <dt className="text-c1 text-ink">
                <Link
                  href={entry.href}
                  className="short-marker short-marker-compact text-brand hover:text-brand-hover"
                >
                  {entry.name}
                </Link>
              </dt>
              <dd className="mt-8 text-c2 text-ink-secondary">{entry.note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
