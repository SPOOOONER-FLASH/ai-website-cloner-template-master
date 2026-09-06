import Link from "next/link";
import { ArrowLink } from "./ArrowLink";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { EditorialAtlas } from "./EditorialAtlas";
import { getProductsArchitecture, type ProductsLocale } from "./products-architecture";
import styles from "./EditorialCatalogue.module.css";

interface ProductsEditorialOverviewProps {
  locale: ProductsLocale;
  totalProducts: number;
  categoryCounts: Readonly<Record<string, number>>;
}

export function ProductsEditorialOverview({ locale, totalProducts, categoryCounts }: ProductsEditorialOverviewProps) {
  const architecture = getProductsArchitecture(locale);
  const [rangeChapter, applicationChapter, technicalChapter] = architecture.story;
  const es = locale === "es";
  const prefix = es ? "/es" : "";

  return <div className={styles.page}>
    <section aria-labelledby="products-overview-title">
      <Breadcrumbs items={[{ label: es ? "Inicio" : "Home", href: `${prefix}/` }, { label: es ? "Productos" : "Products" }]} />
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
          <span><strong>{rangeChapter.title}</strong>{es ? "Fotografías de nuestro catálogo." : "Original photographs from our catalogue."}</span>
          <span><strong>{es ? "Familias" : "Families"}</strong>{architecture.rangeMeta}</span>
          <span><strong>{es ? "El siguiente paso" : "Next step"}</strong>{totalProducts} {es ? "modelos publicados. Seleccione un producto para verlo." : "published models. Select a product to explore."}</span>
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
          <span className={styles.count}>{categoryCounts[family.slug] ?? 0} {es ? "modelos" : "models"}</span>
          <span className={styles.indexDetail}>{family.description}</span>
        </Link></li>)}
      </ol>
    </section>

    <section className={styles.chapter} aria-labelledby="engineering-system-title">
      <div className={styles.chapterHead}>
        <h2 id="engineering-system-title" className={styles.heading}>{es ? "Cada pieza, en contexto." : "Every part, in context."}</h2>
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
            <MediaPlaceholder src="/images/editorial/hyde-real-lever-plate.webp" ratio="3 / 2" label={es ? "Manija 9001 del catálogo" : "9001 catalogue lever handle"} sizes="30vw" />
          </div></Link>
          <figcaption><strong className={styles.caption}>{rangeChapter.title}</strong><span className={styles.detail}>{rangeChapter.description}</span></figcaption>
        </figure>
        <figure>
          <Link href={applicationChapter.href}><MediaPlaceholder src={applicationChapter.image} ratio="1 / 1" label={applicationChapter.alt} sizes="(max-width: 767px) 100vw, 45vw" className={styles.storyImage} /></Link>
          <figcaption><strong className={styles.caption}>{applicationChapter.title}</strong><span className={styles.detail}>{applicationChapter.description}</span>
            <span className={styles.detail}>{es ? "Detalle de mecanismo del catálogo." : "Mechanism detail from the catalogue."}</span>
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
