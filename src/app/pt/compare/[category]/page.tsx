import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { SpecRangeList } from "@/components/site/SpecRangeList";
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

  const name = category.namePt ?? category.name;
  const count = getProductsByCategory(category.slug).length;

  /*
    Same 46-character budget as the English side — the brand suffix costs 16 of the 62 a
    title gets. Spanish runs longer than English almost everywhere, so the fallback is
    reached more often here, and the informative half is the range name.
  */
  const withQualifier = `Comparar ${name} — Especificações`;

  return pageMetadata({
    enPath: `/compare/${category.slug}`,
    locale: "pt",
    title: withQualifier.length <= 46 ? withQualifier : `Comparar ${name}`,
    description: `${count} ${name.toLowerCase()} comparados nas especificações que os distinguem. Prazo a partir de 30 dias, fabricação em Guangdong, China.`,
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

  const name = category.namePt ?? category.name;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
          { name, url: absoluteUrl(`/pt/products/${category.slug}/`) },
          { name: "Comparar", url: absoluteUrl(`/pt/compare/${category.slug}/`) },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="compare-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Início", href: "/pt/" },
                  { label: "Produtos", href: "/pt/products/" },
                  { label: name, href: `/pt/products/${category.slug}/` },
                  { label: "Comparar" },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Coleção Canton</p>
              <h1 id="compare-title" className="mt-8 text-h1 text-ink">
                Comparar {name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                As especificações que distinguem os {products.length} modelos desta linha,
                numa tabela só.
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Una celda vacía significa que aún no publicamos ese dato para ese modelo,
                e não que o modelo não o tenha — pergunte à equipe de exportação e
                confirmamos contra o desenho de produção. </p>
              <Link
                href={`/pt/products/${category.slug}/`}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                Ver os {products.length} {name.toLowerCase()}
              </Link>
            </div>
          </div>
        </section>

        {/*
          The figures this range actually spans, before the table of every figure.

          A comparison table is a grid; an answer engine quotes sentences. On
          2026-09-18 these pages scored 30 on `npm run seo:citability` with zero
          concrete facts, while the catalogue under them held backsets, centre
          distances and door thicknesses for every model. Every line below is
          counted from those records — see src/lib/collection-spec-range.ts.
        */}
        <SpecRangeList
          products={products}
          locale="pt"
          headingId="compare-range-heading"
          className="layout mt-48 lg:mt-64"
        />

        <SpecMatrix products={products} categorySlug={category.slug} locale="pt" />
      </main>
    </>
  );
}
