import Link from "next/link";
import { ArrowLink } from "./ArrowLink";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { EditorialAtlas } from "./EditorialAtlas";
import { getProductsArchitecture, type ProductsLocale } from "./products-architecture";
import styles from "./EditorialCatalogue.module.css";
import { localised } from "@/lib/localised";

interface ProductsEditorialOverviewProps {
  locale: ProductsLocale;
  totalProducts: number;
  categoryCounts: Readonly<Record<string, number>>;
}

/** Every string on this page, in all three locales. */
const COPY = {
  en: {
    home: "Home",
    products: "Products",
    photographs: "Original photographs from our catalog.",
    families: "Families",
    nextStep: "Next step",
    publishedModels: "published models. Select a product to explore.",
    models: "models",
    everyPart: "Every part, in context.",
    leverLabel: "9001 catalog lever handle",
    mechanismDetail: "Mechanism detail from the catalog.",
  },
  es: {
    home: "Inicio",
    products: "Productos",
    photographs: "Fotograf\u00edas de nuestro cat\u00e1logo.",
    families: "Familias",
    nextStep: "El siguiente paso",
    publishedModels: "modelos publicados. Seleccione un producto para verlo.",
    models: "modelos",
    everyPart: "Cada pieza, en contexto.",
    leverLabel: "Manija 9001 del cat\u00e1logo",
    mechanismDetail: "Detalle de mecanismo del cat\u00e1logo.",
  },
  pt: {
    home: "In\u00edcio",
    products: "Produtos",
    photographs: "Fotografias do nosso cat\u00e1logo.",
    families: "Fam\u00edlias",
    nextStep: "O pr\u00f3ximo passo",
    publishedModels: "modelos publicados. Selecione um produto para ver.",
    models: "modelos",
    everyPart: "Cada pe\u00e7a, em contexto.",
    leverLabel: "Ma\u00e7aneta 9001 do cat\u00e1logo",
    mechanismDetail: "Detalhe de mecanismo do cat\u00e1logo.",
  },
} as const;

export function ProductsEditorialOverview({ locale, totalProducts, categoryCounts }: ProductsEditorialOverviewProps) {
  const architecture = getProductsArchitecture(locale);
  const [rangeChapter, applicationChapter, technicalChapter] = architecture.story;
  const t = localised(COPY, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;

  return <div className={styles.page}>
    <section aria-labelledby="products-overview-title">
      <Breadcrumbs items={[{ label: t.home, href: `${prefix}/` }, { label: t.products }]} />
      <div className={styles.opening}>
        <h1 id="products-overview-title" className={styles.display}>{architecture.title}</h1>
        <div>
          <p className={styles.intro}>{architecture.intro}</p>
          <div className={styles.actions}><ArrowLink href={`${prefix}/product-finder/`}>{architecture.finder}</ArrowLink></div>
        </div>
      </div>
      <figure>
        <EditorialAtlas locale={locale} priority />
        <figcaption className={styles.legend}>
          <span><strong>{rangeChapter.title}</strong>{t.photographs}</span>
          <span><strong>{t.families}</strong>{architecture.rangeMeta}</span>
          <span><strong>{t.nextStep}</strong>{totalProducts} {t.publishedModels}</span>
        </figcaption>
      </figure>
    </section>

    <section className={styles.chapter} aria-labelledby="product-family-map-title">
      <div className={styles.chapterHead}>
        <h2 id="product-family-map-title" className={styles.heading}>{architecture.familiesHeading}</h2>
        <p className={styles.body}>{architecture.familiesBody}</p>
      </div>
      <ol className={styles.index}>
        {architecture.families.map((family) => <li key={family.slug}><Link href={family.href}>
          <span className={styles.indexLabel}>{family.label}</span>
          <span className={styles.count}>{categoryCounts[family.slug] ?? 0} {t.models}</span>
          <span className={styles.indexDetail}>{family.description}</span>
        </Link></li>)}
      </ol>
    </section>

    <section className={styles.chapter} aria-labelledby="engineering-system-title">
      <div className={styles.chapterHead}>
        <h2 id="engineering-system-title" className={styles.heading}>{t.everyPart}</h2>
        <p className={styles.body}>{architecture.brandBody}</p>
      </div>
      <ul className={styles.series}>
        {architecture.photographySeries.map((series) => <li key={series.image}><Link href={series.href}>
          <div className={styles.plate}>
            <MediaPlaceholder src={series.image} ratio="3 / 2" label={`${series.label} — ${series.detail}`} sizes="(min-width: 768px) 25vw, 50vw" />
          </div>
          <span className={styles.caption}>{series.label}</span>
          <span className={styles.detail}>{series.detail}</span>
        </Link></li>)}
      </ul>
      <div className={styles.brand}>
        <p className="text-h3">{architecture.brandLine}</p>
        <ArrowLink href={`${prefix}/configurator/`}>{architecture.configurator}</ArrowLink>
      </div>
    </section>

    <section className={styles.chapter} aria-labelledby="product-story-title">
      <div className={styles.chapterHead}>
        <h2 id="product-story-title" className={styles.heading}>{architecture.storyTitle}</h2>
        <p className={styles.body}>{architecture.storyBody}</p>
      </div>
      <div className={styles.story}>
        <figure>
          <Link href={`${prefix}/product-finder/`}><div className={styles.plate}>
            <MediaPlaceholder src="/images/editorial/hyde-real-lever-plate.webp" ratio="3 / 2" label={t.leverLabel} sizes="30vw" />
          </div></Link>
          <figcaption><strong className={styles.caption}>{rangeChapter.title}</strong><span className={styles.detail}>{rangeChapter.description}</span></figcaption>
        </figure>
        <figure>
          <Link href={applicationChapter.href}><MediaPlaceholder src={applicationChapter.image} ratio="1 / 1" label={applicationChapter.alt} sizes="(max-width: 767px) 100vw, 45vw" className={styles.storyImage} /></Link>
          <figcaption><strong className={styles.caption}>{applicationChapter.title}</strong><span className={styles.detail}>{applicationChapter.description}</span>
            <span className={styles.detail}>{t.mechanismDetail}</span>
          </figcaption>
        </figure>
        <figure>
          <Link href={technicalChapter.href}><div className={styles.plate}>
            <MediaPlaceholder src={technicalChapter.image} ratio="3 / 2" label={technicalChapter.alt} sizes="30vw" />
          </div></Link>
          <figcaption><strong className={styles.caption}>{technicalChapter.title}</strong><span className={styles.detail}>{technicalChapter.description}</span></figcaption>
        </figure>
      </div>
      <div className={styles.conversion}>
        <h3 className="max-w-[24ch] text-h2">{architecture.conversionTitle}</h3>
        <div className={styles.actions}>
          <Button href={`${prefix}/downloads/`} variant="secondary">{architecture.downloads}</Button>
          <Button href={`${prefix}/contact/`}>{architecture.contact}</Button>
        </div>
      </div>
    </section>
  </div>;
}
