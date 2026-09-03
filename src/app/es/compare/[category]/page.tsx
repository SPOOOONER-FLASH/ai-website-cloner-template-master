import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The Spanish mirror of /compare/<category>/.
 *
 * WHY IT EXISTS. The English comparison pages shipped first and the Spanish half was left
 * for later, which in practice meant a Spanish-speaking buyer comparing two models had
 * nowhere to go while an English-speaking one had fifteen pages. Spanish is not a
 * courtesy translation here — Argentina, Mexico and Spain are named markets, and the AR-4
 * range exists because of one of them.
 *
 * SpecMatrix already renders in Spanish: it takes a locale, reads `specsEs` positionally
 * against `specs`, and links to the /es/ product routes. So the page itself is the only
 * thing that was missing.
 */

interface ComparePageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) return {};

  const name = category.nameEs ?? category.name;
  const count = getProductsByCategory(category.slug).length;

  /*
    Same 46-character budget as the English side — the brand suffix costs 16 of the 62 a
    title gets. Spanish runs longer than English almost everywhere, so the fallback is
    reached more often here, and the informative half is the range name.
  */
  const withQualifier = `Comparar ${name} — Especificaciones`;

  return pageMetadata({
    enPath: `/compare/${category.slug}`,
    locale: "es",
    title: withQualifier.length <= 46 ? withQualifier : `Comparar ${name}`,
    description: `${count} ${name.toLowerCase()} comparados en las especificaciones que los distinguen. Plazo desde 30 días, fabricación en Guangdong, China.`,
    image: category.image.src,
    imageAlt: category.image.label,
  });
}

export default async function CompararPage({ params }: ComparePageProps) {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  /* A table of one or two rows is not a comparison; send those to the listing instead. */
  if (products.length < 3) notFound();

  const name = category.nameEs ?? category.name;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          { name, url: absoluteUrl(`/es/products/${category.slug}/`) },
          { name: "Comparar", url: absoluteUrl(`/es/compare/${category.slug}/`) },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="compare-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Inicio", href: "/es/" },
                  { label: "Productos", href: "/es/products/" },
                  { label: name, href: `/es/products/${category.slug}/` },
                  { label: "Comparar" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Colección Canton</p>
              <h1 id="compare-title" className="mt-8 text-h1 text-ink">
                Comparar {name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                Las especificaciones que distinguen los {products.length} modelos de esta
                gama, en una sola tabla.
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Una celda vacía significa que aún no publicamos ese dato para ese modelo,
                no que el modelo carezca de él — consúltelo al equipo de exportación y lo
                confirmamos contra el plano de producción.
              </p>
              <Link
                href={`/es/products/${category.slug}/`}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                Ver los {products.length} {name.toLowerCase()}
              </Link>
            </div>
          </div>
        </section>

        <SpecMatrix products={products} categorySlug={category.slug} locale="es" />
      </main>
    </>
  );
}
