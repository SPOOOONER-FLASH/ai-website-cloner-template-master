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

  const name = category.nameEs ?? category.name;
  const summary = category.summaryEs ?? category.summary;
  const count = getProductsByCategory(category.slug).length;
  // "Plazo desde 30 días" (confirmado por el cliente 2026-09-01) responde a la primera
  // pregunta de cualquier comprador, y el snippet es donde la lee. Sustituye a la
  // cláusula de mercados: ambas no caben en 165 caracteres, y una fecha de entrega pesa
  // más que un recuento de mercados para quien decide si escribe o no.
  const tail = `${count} modelos fabricados en Guangdong, China. Plazo desde 30 días.`;
  const compactTail = `${count} modelos fabricados en Guangdong. Plazo desde 30 días.`;
  const leadOnlyTail = `${count} modelos. Plazo desde 30 días.`;
  const bareTail = `${count} modelos fabricados en Guangdong, China.`;
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
    The layout appends " | Canton Hyland" (16 chars). Spanish category names run long —
    "Cerraduras de gancho para correderas" alone is 36 — so the qualifier only survives
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
    locale: "es",
    title,
    description,
    image: category.image.src,
    imageAlt: category.image.labelEs ?? category.image.label,
  });
}

export default async function CategoriaPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;
  const category = getTopLevelCategories().find((item) => item.slug === slug);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);
  const name = category.nameEs ?? category.name;
  const summary = category.summaryEs ?? category.summary;
  const sourcing = categorySourcingLine(category.slug, "es");
  const categoryUrl = absoluteUrl(`/es/products/${category.slug}/`);
  const options =
    category.children?.map((child) => ({ slug: child.slug, name: child.nameEs ?? child.name })) ??
    [];

  return (
    <>
      <JsonLd
        data={itemListSchema(
          name,
          products.map((p) => absoluteUrl(`/es/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      {/*
        The breadcrumb stays inside Spanish. An earlier /es page pointed its middle
        segment at the English /products/, which tells a crawler the Spanish tree hangs
        off the English one.
      */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          { name, url: categoryUrl },
        ])}
      />

      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="category-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Inicio", href: "/es/" },
                  { label: "Productos", href: "/es/products/" },
                  { label: name },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">Colección Canton</p>
              <h1 id="category-title" className="mt-8 text-h1 text-ink">
                {name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">{summary}</p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Aquí solo se publican fichas verificadas. El resto del catálogo histórico
                se está preparando para su publicación estructurada.
              </p>
              {sourcing ? (
                <p className="mt-24 text-c1 text-ink-secondary">{sourcing}</p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="layout mt-64 md:mt-144 lg:mt-288" aria-label={`Catálogo — ${name}`}>
          <div className="col-content grid w-full grid-cols gap-x">
            <CategoryFilter products={products} options={options} locale="es" />
            <ProductIndexList
              products={products}
              label={`${products.length} ${name.toLowerCase()}`}
              locale="es"
            />
          </div>
        </section>
        <SpecMatrix
          products={products}
          categorySlug={category.slug}
          locale="es"
          showCompareLink
        />
      </main>
    </>
  );
}
