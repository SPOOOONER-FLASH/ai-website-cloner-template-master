import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { JsonLd, breadcrumbSchema, itemListSchema } from "@/components/site/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ProductIndexList } from "@/components/site/ProductIndexList";
import { getTopLevelCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

/**
 * The Spanish mirror of /collections/<category>-<sub>/.
 *
 * The sub-category names it renders did not exist in Spanish until 2026-09-03 — the
 * fifteen top-level ranges had `nameEs`, their 21 children had none. That gap was
 * invisible while nothing displayed a sub-category name in Spanish, and it is the whole
 * content of this page: the heading, the title and the description are all that name.
 * scripts/add-subcategory-es-names.mjs filled it, using trade terms rather than literal
 * translations — see the note there on why "mirilla" and not "visor de puerta".
 *
 * Scope matches the English side exactly: only sub-categories the catalogue declares AND
 * that hold published products.
 */

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

interface Collection {
  slug: string;
  category: { slug: string; name: string; image: { src: string; label: string } };
  child: { slug: string; name: string };
}

function collections(): Collection[] {
  const out: Collection[] = [];
  for (const category of getTopLevelCategories()) {
    for (const child of category.children ?? []) {
      const count = publishedProducts.filter(
        (p) => p.categoryPath[0] === category.slug && p.categoryPath[1] === child.slug,
      ).length;
      if (!count) continue;
      out.push({
        slug: `${category.slug}-${child.slug}`,
        category: {
          slug: category.slug,
          name: category.nameEs ?? category.name,
          image: { src: category.image.src ?? "", label: category.image.label },
        },
        child: { slug: child.slug, name: child.nameEs ?? child.name },
      });
    }
  }
  return out;
}

function find(slug: string): Collection | undefined {
  return collections().find((c) => c.slug === slug);
}

function productsIn(collection: Collection) {
  return publishedProducts.filter(
    (p) =>
      p.categoryPath[0] === collection.category.slug &&
      p.categoryPath[1] === collection.child.slug,
  );
}

export function generateStaticParams() {
  return collections().map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = find(slug);
  if (!collection) return {};

  const count = productsIn(collection).length;
  const name = collection.child.name;

  /*
    46-character budget, same as everywhere else. Spanish names run longer than the
    English ones — "Cerraduras cilíndricas de servicio pesado" is 41 characters before any
    qualifier — so the bare name is the common outcome here rather than the exception.
  */
  const withRole = `${name} — Fabricante`;
  const title = withRole.length <= 46 ? withRole : name;

  return pageMetadata({
    enPath: `/collections/${collection.slug}`,
    locale: "es",
    title,
    description: `${count} ${name.toLowerCase()} de la gama ${collection.category.name.toLowerCase()} de Canton Hyland, fabricados en Guangdong, China. Plazo desde 30 días.`,
    image: collection.category.image.src,
    imageAlt: collection.category.image.label,
  });
}

export default async function ColeccionPage({ params }: CollectionPageProps) {
  const { collection: slug } = await params;
  const collection = find(slug);
  if (!collection) notFound();

  const items = productsIn(collection);
  const url = absoluteUrl(`/es/collections/${collection.slug}/`);

  return (
    <>
      <JsonLd
        data={itemListSchema(
          collection.child.name,
          items.map((p) => absoluteUrl(`/es/products/${p.categoryPath[0]}/${p.slug}/`)),
        )}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: absoluteUrl("/es/") },
          { name: "Productos", url: absoluteUrl("/es/products/") },
          {
            name: collection.category.name,
            url: absoluteUrl(`/es/products/${collection.category.slug}/`),
          },
          { name: collection.child.name, url },
        ])}
      />
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
        <section className="layout" aria-labelledby="collection-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: "Inicio", href: "/es/" },
                  { label: "Productos", href: "/es/products/" },
                  {
                    label: collection.category.name,
                    href: `/es/products/${collection.category.slug}/`,
                  },
                  { label: collection.child.name },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-10">
              <p className="text-c1 text-ink-secondary">{collection.category.name}</p>
              <h1 id="collection-title" className="mt-8 text-h1 text-ink">
                {collection.child.name}
              </h1>
            </div>
            <div className="col-span-full mt-24 xl:col-span-12 xl:col-start-13">
              <p className="text-lead text-ink">
                {items.length} {collection.child.name.toLowerCase()} de la gama{" "}
                {collection.category.name.toLowerCase()} de Canton Hyland.
              </p>
              <p className="mt-24 text-c1 text-ink-secondary">
                Fabricación en Zhongshan, Guangdong. El plazo de producción parte de 30
                días desde la confirmación del pedido, y producimos bajo la marca de
                nuestros clientes.
              </p>
              <Link
                href={`/es/products/${collection.category.slug}/`}
                className="short-marker short-marker-compact mt-24 inline-block text-c1 text-brand hover:text-brand-hover"
              >
                Ver toda la gama {collection.category.name.toLowerCase()}
              </Link>
            </div>
          </div>
        </section>

        <section
          className="layout mt-64 md:mt-144 lg:mt-288"
          aria-label={collection.child.name}
        >
          <div className="col-content grid w-full grid-cols gap-x">
            <ProductIndexList
              products={items}
              label={`${items.length} ${collection.child.name.toLowerCase()}`}
              locale="es"
            />
          </div>
        </section>
      </main>
    </>
  );
}
