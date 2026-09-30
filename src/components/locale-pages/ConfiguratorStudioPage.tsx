import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ConfiguratorStudio, type StudioData, type StudioLabels } from "@/components/site/ConfiguratorStudio";
import { FinderModeSwitch } from "@/components/site/FinderModeSwitch";
import { JsonLd, breadcrumbSchema } from "@/components/site/JsonLd";
import { findCategoryByPath } from "@/data/categories";
import type { Locale } from "@/data/locales";
import { publishedProducts } from "@/data/products";
import { absoluteUrl } from "@/data/site";
import { t as tr, tx } from "@/lib/i18n";
import { finishCode, functionCode } from "@/lib/order-code";
import { variantFamilies } from "@/lib/product-variants";
import { localeMetadata, prefixer } from "./shared";

/**
 * The configurator studio — FSB's product-finder layout, applied to what we actually have.
 *
 * FSB configures one handle on a large stage: the part in the middle, the choices in a
 * column beside it, the article number assembling at the top as each choice lands. The
 * client asked for that page (2026-09-29: 「切换有动画效果专属的一页，主要是动画效果和设计
 * layout ui ux」) and, having seen it, for it to go live beside the guided configurator
 * rather than instead of it (「暂时不要取代原来的」).
 *
 * FSB renders every combination from CAD. We have no CAD and never draw an imagined metal
 * part, so the stage here only ever shows a photograph of the exact SKU selected: each
 * finish and function is a real record (src/lib/product-variants.ts), and switching one
 * cross-fades to that record's own photograph. The families are those whose order codes
 * parse cleanly; the rest of the catalogue stays in the guided configurator and the finder.
 *
 * One component for all ten locales. Every label the client component prints is resolved
 * here, on the server, so the browser bundle carries no translation tables and the
 * overlay locales get their sentences from content/i18n/<code>/ui.json like every page.
 */

const TITLE = "Configurator Studio";
const DESCRIPTION =
  "Choose a range and a model, then switch finish and function. Every picture is a photograph of the exact model, and the order code assembles as you choose.";

export function configuratorStudioMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/configurator/studio",
    "Configurator Studio — Finish and Function",
    "Choose a lock or handle range, then switch finish and function and watch the order code assemble. Every image is a photograph of the exact model.",
  );
}

export function ConfiguratorStudioPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const families = variantFamilies(publishedProducts);

  const codes = new Set<string>();
  const fns = new Set<string>();
  for (const family of families) {
    for (const member of family.members) {
      member.finish.split("+").filter(Boolean).forEach((code) => codes.add(code));
      if (member.fn) fns.add(member.fn);
    }
  }
  const named = (entry: { name: string | null; nameEs: string | null; namePt: string | null } | undefined, code: string) =>
    entry?.name ? tx(locale, entry.name, { es: entry.nameEs ?? undefined, pt: entry.namePt ?? undefined }) : code;
  const categoryName = (path: string[]) => {
    const category = findCategoryByPath(path);
    return category ? tr(category, "name", locale) : path[path.length - 1];
  };

  const data: StudioData = {
    ranges: [...new Set(families.map((f) => f.categoryPath[0]))].map((slug) => ({
      slug,
      name: categoryName([slug]),
    })),
    families: families.map((f) => ({
      key: f.key,
      base: f.base,
      categoryPath: f.categoryPath,
      name: tr(publishedProducts.find((product) => product.slug === f.members[0].slug) ?? { name: f.name }, "name", locale),
      subName: f.categoryPath.length > 1 ? categoryName(f.categoryPath) : null,
      members: f.members.map((m) => ({
        slug: m.slug,
        model: m.model,
        finish: m.finish,
        fn: m.fn,
        /* variantFamilies only admits records with a photograph, so `src` is never empty here. */
        heroImage: { src: m.heroImage.src ?? "", ratio: m.heroImage.ratio, label: tr(m.heroImage, "label", locale) },
      })),
    })),
    finishNames: Object.fromEntries([...codes].map((c) => [c, named(finishCode(c), c)])),
    functionNames: Object.fromEntries([...fns].map((c) => [c, named(functionCode(c), c)])),
  };

  const labels: StudioLabels = {
    range: tx(locale, "Range", { es: "Gama", pt: "Linha" }),
    model: tx(locale, "Model", { es: "Modelo", pt: "Modelo" }),
    finish: tx(locale, "Finish", { es: "Acabado", pt: "Acabamento" }),
    fn: tx(locale, "Function", { es: "Función", pt: "Função" }),
    orderCode: tx(locale, "Order code", { es: "Código de pedido", pt: "Código de pedido" }),
    configuration: tx(locale, "Configuration", { es: "Configuración", pt: "Configuração" }),
    reset: tx(locale, "Reset", { es: "Restablecer", pt: "Redefinir" }),
    quote: tx(locale, "Request a quote for {model}", { es: "Solicitar cotización de {model}", pt: "Pedir orçamento de {model}" }),
    productPage: tx(locale, "Product page", { es: "Ficha del producto", pt: "Ficha do produto" }),
    note: tx(
      locale,
      "Every image here is a photograph of the model named under it. A finish or function missing from a range is one the factory does not list for that model; ask us if you need it.",
      {
        es: "Cada imagen es una fotografía del modelo que se indica debajo. Si a una gama le falta un acabado o una función, es porque la fábrica no la lista para ese modelo; consúltenos si la necesita.",
        pt: "Cada imagem é uma fotografia do modelo indicado abaixo dela. Se falta um acabamento ou uma função numa linha, é porque a fábrica não a lista para esse modelo; consulte-nos se precisar.",
      },
    ),
  };

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tx(locale, "Home"), url: absoluteUrl(p("/")) },
          { name: tx(locale, "Products"), url: absoluteUrl(p("/products")) },
          { name: tx(locale, "Configurator"), url: absoluteUrl(p("/configurator")) },
          { name: tx(locale, TITLE), url: absoluteUrl(p("/configurator/studio")) },
        ])}
      />
      <main className="isolate flex-grow">
        <section className="layout mt-48 lg:mt-96" aria-labelledby="studio-title">
          <div className="col-content grid w-full grid-cols gap-x gap-y-24">
            <div className="col-span-full">
              <Breadcrumbs
                items={[
                  { label: tx(locale, "Home"), href: p("/") },
                  { label: tx(locale, "Products"), href: p("/products") },
                  { label: tx(locale, "Configurator"), href: p("/configurator") },
                  { label: tx(locale, TITLE) },
                ]}
              />
            </div>
            <div className="col-span-full mt-24 xl:col-span-12">
              <h1 id="studio-title" className="text-h1 text-ink">
                {tx(locale, TITLE)}
              </h1>
            </div>
            <div className="col-span-full xl:col-span-10 xl:col-start-15">
              <p className="text-lead text-ink-secondary">
                {tx(locale, DESCRIPTION, {
                  es: "Elija una gama y un modelo, y cambie el acabado y la función. Cada imagen es una fotografía del modelo exacto, y el código de pedido se forma mientras elige.",
                  pt: "Escolha uma linha e um modelo, depois troque acabamento e função. Cada imagem é uma fotografia do modelo exato, e o código de pedido se forma à medida que escolhe.",
                })}
              </p>
              <FinderModeSwitch active="studio" locale={locale} className="mt-24" />
            </div>
          </div>
        </section>

        <section className="mt-48 lg:mt-64" aria-label={tx(locale, TITLE)}>
          <ConfiguratorStudio data={data} labels={labels} base={locale === "en" ? "" : `/${locale}`} />
        </section>
      </main>
    </>
  );
}
