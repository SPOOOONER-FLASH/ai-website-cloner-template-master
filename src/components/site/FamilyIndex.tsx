import Link from "next/link";
import type { Locale } from "@/data/site";
import { dict } from "@/lib/i18n";
import { homeFamilies } from "@/lib/home-families";
import { getResponsiveEditorialImageProps } from "./editorial-images";
import { FamilyFollow } from "./FamilyFollow";
import styles from "./HomeMotion.module.css";

/**
 * "The range, family by family": eight large rows, each a link to its category with the
 * model count. On a desktop the lead product follows the pointer (FamilyFollow); on touch
 * screens it is a thumbnail in the row. From the 2026-10-12 motion demo (design 4's index),
 * which the client picked for the live homepage.
 */
const copy = {
  en: {
    eyebrow: "The range",
    title: "The range, family by family",
    body: "Eight families from one factory catalog, with the number of models on this site in each.",
    models: "models",
  },
  es: {
    eyebrow: "La gama",
    title: "La gama, familia por familia",
    body: "Ocho familias de un mismo catálogo de fábrica, con el número de modelos de cada una en este sitio.",
    models: "modelos",
  },
  pt: {
    eyebrow: "A linha",
    title: "A linha, família por família",
    body: "Oito famílias de um mesmo catálogo de fábrica, com o número de modelos de cada uma neste site.",
    models: "modelos",
  },
};

export function FamilyIndex({ locale = "en" }: { locale?: Locale }) {
  const text = dict(copy, locale);
  const families = homeFamilies(locale);
  const images = families.map((f) => getResponsiveEditorialImageProps(f.lead.src, "72px"));

  return (
    <section className="layout mt-96 lg:mt-136" aria-labelledby="family-index-heading">
      <div className="col-content grid w-full grid-cols gap-x">
        <div className="col-span-full lg:col-span-6 xl:col-span-12">
          <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">{text.eyebrow}</p>
          <h2 id="family-index-heading" className="mt-8 text-h2 text-ink">{text.title}</h2>
          <p className="mt-16 text-c1 text-ink-secondary">{text.body}</p>
        </div>
        <ul className="col-span-full mt-40 border-t border-frame">
          {families.map((f, i) => (
            <li key={f.key} data-family={i}>
              <Link href={f.href} className={styles.familyRow}>
                <span className={`${styles.familyName} font-semibold text-ink`}>{f.name}</span>
                <span className="flex shrink-0 items-center gap-16">
                  {/* eslint-disable-next-line @next/next/no-img-element -- responsive editorial props, as MediaPlaceholder renders them */}
                  <img
                    {...images[i]}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={72}
                    height={54}
                    className={`${styles.thumb} h-54 w-72 object-contain`}
                  />
                  <span className="text-c2 tabular-nums text-ink-secondary">
                    {f.count} {text.models}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <FamilyFollow
        items={families.map((f) => ({
          ...getResponsiveEditorialImageProps(f.lead.src, "320px"),
          alt: `${f.lead.model} ${f.lead.name}`,
          model: f.lead.model,
        }))}
      />
    </section>
  );
}
