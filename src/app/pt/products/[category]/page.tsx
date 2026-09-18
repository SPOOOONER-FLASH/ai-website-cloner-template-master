import type { Metadata } from "next";
import { SpecMatrix } from "@/components/site/SpecMatrix";
import { categorySourcingLine } from "@/data/category-sourcing";
import { notFound } from "next/navigation";
import { CategoryFilter } from "@/components/site/CategoryFilter";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

/**
 * Only the canonical slugs. The English route additionally enumerates legacy aliases so
 * it can 301 them; those old URLs never existed under /es, so mirroring them here would
 * publish redirects for paths nothing has ever linked.
 */
export function generateStaticParams() {
  return getTopLevelCategories().map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) return {};

  const name = category.namePt ?? category.name;
  const summary = category.summaryPt ?? category.summary;
  const count = getProductsByCategory(category.slug).length;
  // "Prazo a partir de 30 dias" (confirmed by the client 2026-09-01) answers the first
  // question any buyer has, and the snippet is where they read it. It replaces the markets
  // clause: both do not fit in 165 characters, and a delivery date weighs more than a
  // market count for somebody deciding whether to write at all.
  const tail = `${count} modelos fabricados em Guangdong, China. Prazo a partir de 30 dias.`;
  const compactTail = `${count} modelos fabricados em Guangdong. Prazo a partir de 30 dias.`;
  const leadOnlyTail = `${count} modelos. Prazo a partir de 30 dias.`;
  const bareTail = `${count} modelos fabricados em Guangdong, China.`;
  const full = `${summary} ${tail}`;
  const compact = `${summary} ${compactTail}`;
  const leadOnly = `${summary} ${leadOnlyTail}`;
  const bare = `${summary} ${bareTail}`;
  const description =
    full.length <= 165
      ? full
      : compact.length <= 165
        ? compact
        : leadOnly.length <= 165
          ? leadOnly
          : bare.length <= 165
            ? bare
            : summary;

  /*
    The layout appends " | Canton Hyland" (16 chars). Portuguese category names run long —
    "Fechaduras de gancho para correr" alone is 32 — so the qualifier only survives
    when the final title stays inside the ~62-char budget; otherwise the name carries
    the title alone. Seven category titles were over budget before this. Names that
    overflow with the full qualifier fall back to the short "— Fabricante" form.
  */
  const qualified = `${name} — Fabricante y proveedor`;
  const qualifiedShort = `${name} — Fabricante`;
  const titleBudget = 62 - " | Canton Hyland".length;
  const title =
    qualified.length <= titleBudget
      ? qualified
      : qualifiedShort.length <= titleBudget
        ? qualifiedShort
        : name;

  return pageMetadata({
    enPath: `/products/${slug}`,
    locale: "pt",
    title,
    description,
    image: category.image.src,
    imageAlt: category.image.labelPt ?? category.image.label,
  });
}

export default async function CategoriaPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const name = category.namePt ?? category.name;
  const summary = category.summaryPt ?? category.summary;
  const sourcing = categorySourcingLine(category.slug, "es");
  const categoryUrl = absoluteUrl(`/pt/products/${category.slug}/`);
  const options =
    category.children?.map((child) => ({ slug: child.slug, name: child.namePt ?? child.name })) ??
    [];

  return (
    <>
      <JsonLd
        data={itemListSchema(
          name,
          products.map((p) => absoluteUrl(`/pt/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      {/*
        The breadcrumb stays inside Spanish. An earlier /es page pointed its middle
        segment at the English /products/, which tells a crawler the Spanish tree hangs
        off the English one.
      */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", url: absoluteUrl("/pt/") },
          { name: "Produtos", url: absoluteUrl("/pt/products/") },
          { name, url: categoryUrl },
        ])}
      />

      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="category-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Início", href: "/pt/" },
                  { label: "Produtos", href: "/pt/products/" },
                  { label: name },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Coleção Canton</p>
              <h1 id="category-title" className="mt-8 text-h1 text-ink">
                {name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">{summary}</p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Aqui só publicamos fichas verificadas. O resto do catálogo histórico
                está sendo preparado para publicação estruturada.
              </p>
              {sourcing ? (
                <p className="mt-24 text-c1 text-ink-secondary">{sourcing}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={`Catálogo — ${name}`}>
          <div className="col-content grid w-full grid-cols gap-x">
            <CategoryFilter products={products} options={options} locale="pt" />
            <ProductIndexList
              products={products}
              label={`${products.length} ${name.toLowerCase()}`}
              locale="pt"
            />
          </div>
        </section>
        <SpecMatrix
          products={products}
          categorySlug={category.slug}
          locale="pt"
          showCompareLink
        />
      </main>
    </>
  );
}
