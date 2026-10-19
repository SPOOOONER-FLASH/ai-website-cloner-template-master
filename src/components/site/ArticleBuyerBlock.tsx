import Link from "next/link";
import type { Product } from "@/data/types";
import type { Locale } from "@/data/site";
import { getTopLevelCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import type { ArticleRoute, ArticleNext } from "@/data/article-routes";
import { lower } from "@/components/locale-pages/shared";
import { contactHref } from "@/lib/inquiry-prefill";
import { localisedHref } from "@/lib/spanish-mirror";
import { t as tr, tx } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";

/**
 * The step after the argument: the products the article is about, a quote link that
 * already knows the models, and one curated next page (2026-10-12).
 *
 * Why it exists: Bing's AI report of 2026-10-12 counted 2,330 Copilot citations of our
 * guides and news and 28 of product pages. The readers land on the articles; until now the
 * only way on to a product was a small list in the left rail.
 *
 * What it must not become: an advertisement. Cards show only what ProductCard renders from
 * the record; there is no badge, price, certificate line or animation, and the rows use the
 * same specification-row style as the article's own take-away file. A buyer reading a
 * technical guide is checking whether we know the subject; the block answers "and here is
 * the part", not "buy now".
 */
const MAX_CARDS = 3;

/* localisedHref, not a bare prefix: /request/price-list/ exists in English only, and a /fr/ link to it 404s. */
function nextLink(next: ArticleNext, locale: Locale): { href: string; label: string; detail?: string } {
  const to = (path: string) => localisedHref(path, locale);
  if (next.kind === "compare" || next.kind === "category") {
    const category = getTopLevelCategories().find((c) => c.slug === next.category);
    if (!category) throw new Error(`Article route points at unknown category "${next.category}"`);
    const name = lower(tr(category, "name", locale) || category.name, locale);
    if (next.kind === "compare") {
      return { href: to(`/compare/${next.category}/`), label: tx(locale, "Compare {name}", { es: "Comparar {name}", pt: "Comparar {name}" }).replace("{name}", name) };
    }
    const count = String(getProductsByCategory(next.category).length);
    return {
      href: to(`/products/${next.category}/`),
      label: tx(locale, "See all {count} {name}", { es: "Ver los {count} {name}", pt: "Ver os {count} {name}" }).replace("{count}", count).replace("{name}", name),
    };
  }
  if (next.kind === "finishes") return { href: to("/finishes/"), label: tx(locale, "Finish codes", { es: "Códigos de acabado", pt: "Códigos de acabamento" }) };
  if (next.kind === "price-list") return { href: to("/request/price-list/"), label: tx(locale, "Price list", { es: "Lista de precios", pt: "Lista de preços" }) };
  if (next.kind === "documents") return { href: to("/documents/"), label: tx(locale, "Documents", { es: "Documentos", pt: "Documentos" }) };
  return {
    href: to("/certifications/"),
    label: tx(locale, "Certificates", { es: "Certificados", pt: "Certificados" }),
    detail: tx(locale, "Verified model-scoped reports", { es: "Informes verificados por modelo", pt: "Relatórios verificados por modelo" }),
  };
}

export function ArticleBuyerBlock({
  section,
  slug,
  related,
  route,
  locale,
}: {
  section: "news" | "guides";
  slug: string;
  related: Product[];
  route?: ArticleRoute;
  locale: Locale;
}) {
  const base = locale === "en" ? "" : `/${locale}`;
  const cards = related.slice(0, MAX_CARDS);
  const rest = related.slice(MAX_CARDS);
  const from = `${section}/${slug}`;
  const quote = related.length
    ? contactHref(base, {
        model: cards.map((p) => p.model).join(", "),
        product: related.length === 1 ? tr(related[0], "name", locale) || related[0].name : undefined,
        from,
      })
    : contactHref(base, { from });
  const next = route?.next ? nextLink(route.next, locale) : undefined;
  const heading = tx(locale, "Related products", { es: "Productos relacionados", pt: "Produtos relacionados" });

  return (
    <section id="article-products" data-link-list="article-products" className="mt-64" aria-labelledby={related.length ? "article-products-heading" : undefined}>
      {related.length ? (
        <>
          <h2 id="article-products-heading" className="text-h3 text-ink">{heading}</h2>
          <div className="mt-24 grid grid-cols-1 gap-24 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((product) => (
              <ProductCard key={product.slug} product={product} locale={locale} />
            ))}
          </div>
          {rest.length ? (
            <ul className="mt-24 space-y-8">
              {rest.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`${base}/products/${product.categoryPath[0]}/${product.slug}/`}
                    className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                  >
                    {product.model} — {tr(product, "name", locale) || product.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : null}

      <Link href={quote} className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover">
        <span className="short-marker short-marker-arrow relative block ps-12 text-c1 text-brand">
          {related.length
            ? tx(locale, "Request a quote", { es: "Solicitar cotización", pt: "Pedir orçamento" })
            : tx(locale, "Ask a question", { es: "Hacer una consulta", pt: "Fazer uma consulta" })}
        </span>
      </Link>

      {next ? (
        <Link href={next.href} className="mt-32 block border-t border-line pt-16 hover:text-brand-hover">
          <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
            {tx(locale, "Next step", { es: "El siguiente paso", pt: "O próximo passo" })}
          </span>
          <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">{next.label}</span>
          {next.detail ? <span className="mt-8 block text-c2 text-ink-secondary">{next.detail}</span> : null}
        </Link>
      ) : null}
    </section>
  );
}
