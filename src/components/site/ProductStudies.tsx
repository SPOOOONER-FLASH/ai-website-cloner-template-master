import Link from "next/link";
import { publishedProducts } from "@/data/products";
import rawStudies from "@/data/generated/product-studies.json";
import studioStudies from "@/data/studio-studies.json";
import type { Locale } from "@/data/site";
import { localised } from "@/lib/localised";

/**
 * The generated studies, with the caption fields declared optional.
 *
 * TypeScript infers a JSON import's type from the file's current CONTENTS, so when the
 * bilingual mirror regenerated product-studies.json on 2026-09-14 without `captionEn` /
 * `captionEs`, the inferred type lost them and `tsc` began reporting "property does not
 * exist" — on main, blocking every deploy, for a component whose runtime behaviour was
 * never broken: the caption read has always had a hard-coded fallback behind `||`.
 *
 * Declaring them optional says what was true all along. When the generator starts writing
 * captions again the component uses them with no further change; while it does not, the
 * fallback answers, which is what the `||` was for.
 */
interface ProductStudy {
  id: string;
  itemId: string;
  slugs: string[];
  src: string;
  small: string;
  width: number;
  height: number;
  kind: string;
  captionEn?: string;
  captionEs?: string;
  captionPt?: string;
}

const studies = [...studioStudies, ...rawStudies] as ProductStudy[];

/** Every string on this page, in all three locales. */
const COPY = {
  en: {
    back: "Back to the catalogue",
    title: "Hardware in focus",
    intro:
      "Locks, cylinders and handles from our catalogue, presented in studio compositions. Open each model to explore its original photographs, dimensions and finish options.",
    explore: "Explore the gallery",
    material: "Material & finish",
    models: "Models & components",
    finder: "Product Finder",
    enlarge: "Enlarge image of",
    composition: "original-photo composition",
    viewSpecs: "View specifications",
    caption01:
      "307 with lock case 072 and handle 015. The 307 specification also lists handle 9080E. Cylinder length is selected for the door thickness.",
    captionModels:
      "Individual models for selection. Confirm compatibility and the complete configuration before ordering; the composition does not represent installation scale.",
    captionDefault: "Catalogue product photograph in a studio composition.",
    specifyTitle: "Specify your door configuration",
    specifyBody:
      "Share the models, door thickness and required finish to confirm the parts for your order.",
    contact: "Contact Canton Hyland",
  },
  es: {
    back: "Volver al catálogo",
    title: "Herrajes en detalle",
    intro:
      "Cerraduras, cilindros y manijas de nuestro catálogo, presentados en composiciones de estudio. Consulte cada modelo para ver sus fotografías originales, medidas y opciones de acabado.",
    explore: "Explorar la galería",
    material: "Material y acabado",
    models: "Modelos y componentes",
    finder: "Buscar productos",
    enlarge: "Ampliar imagen de",
    composition: "composición con fotografías originales",
    viewSpecs: "Ver especificaciones",
    caption01:
      "307 con caja de cerradura 072 y manija 015. La ficha del 307 también admite la manija 9080E. La longitud del cilindro se selecciona según el espesor de la puerta.",
    captionModels:
      "Modelos individuales para selección. Confirme la compatibilidad y la configuración completa antes de realizar el pedido; la composición no representa una escala de instalación.",
    captionDefault: "Fotografía del producto de nuestro catálogo en una composición de estudio.",
    specifyTitle: "Seleccione la configuración de su puerta",
    specifyBody:
      "Indique los modelos, el espesor de la puerta y el acabado requerido para confirmar las piezas de su pedido.",
    contact: "Consultar con Canton Hyland",
  },
  pt: {
    back: "Voltar ao catálogo",
    title: "Ferragens em detalhe",
    intro:
      "Fechaduras, cilindros e maçanetas do nosso catálogo, apresentados em composições de estúdio. Abra cada modelo para ver as fotografias originais, as medidas e as opções de acabamento.",
    explore: "Explorar a galeria",
    material: "Material e acabamento",
    models: "Modelos e componentes",
    finder: "Localizador de produtos",
    enlarge: "Ampliar imagem de",
    composition: "composição com fotografias originais",
    viewSpecs: "Ver especificações",
    caption01:
      "307 com caixa de fechadura 072 e maçaneta 015. A ficha do 307 também aceita a maçaneta 9080E. O comprimento do cilindro é escolhido conforme a espessura da porta.",
    captionModels:
      "Modelos individuais para seleção. Confirme a compatibilidade e a configuração completa antes de comprar; a composição não representa escala de instalação.",
    captionDefault: "Fotografia de produto do nosso catálogo numa composição de estúdio.",
    specifyTitle: "Defina a configuração da sua porta",
    specifyBody:
      "Informe os modelos, a espessura da porta e o acabamento necessário para confirmarmos as peças do seu pedido.",
    contact: "Falar com a Canton Hyland",
  },
} as const;

export function ProductStudies({ locale }: { locale: Locale }) {
  const es = locale === "es";
  /*
    Nineteen two-way ternaries lived here, which on a Portuguese page meant nineteen
    English strings. Grouped into one record read through `localised` so a fourth locale
    is one object and not nineteen edits.
  */
  const t = localised(COPY, locale);
  const prefix = locale === "en" ? "" : `/${locale}`;
  return (
    <main className="layout mt-32 flex-grow pb-96 lg:mt-48">
      <header className="col-content mb-32 w-full lg:mb-48">
        <Link href={`${prefix}/products/`} className="short-marker short-marker-compact text-c1 text-ink-secondary">
          {t.back}
        </Link>
        <h1 className="mt-24 max-w-[18ch] text-h1 text-ink">{t.title}</h1>
        <p className="mt-24 max-w-[66ch] text-c1 text-ink-secondary">
          {t.intro}
        </p>
        <nav aria-label={t.explore} className="mt-24 flex flex-wrap gap-x-32 gap-y-16 text-c1 text-ink">
          <a href="#material" className="short-marker short-marker-compact">{t.material}</a>
          <a href="#selection" className="short-marker short-marker-compact">{t.models}</a>
          <Link href={`${prefix}/product-finder/`} className="short-marker short-marker-compact">{t.finder}</Link>
        </nav>
      </header>
      <div className="col-content grid w-full grid-cols-1 gap-x-32 gap-y-64 lg:grid-cols-2 lg:gap-y-80">
        {studies.map((study, index) => {
          const models = study.slugs.map(slug => publishedProducts.find(p => p.slug === slug)).filter(p => p !== undefined);
          const shown = study.itemId === "01" ? models.filter(p => p.model !== "9080E") : models;
          const title = shown.map(p => p.model).join(" / ");
          /* Per-study caption where the data has one, else the shared default. No
             Portuguese captions exist in the data yet, so those fall back to English —
             which is visible, and is the rule in src/lib/localised.ts. */
          const caption =
            (es ? study.captionEs : locale === "pt" ? study.captionPt : study.captionEn) ||
            study.captionEn ||
            (study.itemId === "01"
            ? t.caption01
            : study.itemId === "00"
              ? t.captionModels
              : t.captionDefault);
          return (
            <figure key={study.id} id={index === 0 ? "material" : index === 2 ? "selection" : undefined} className={index === 2 ? "scroll-mt-128 lg:col-span-2" : "scroll-mt-128"}>
              <a href={study.src} target="_blank" rel="noreferrer" className="block focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`${t.enlarge} ${title}`}>
                {/* The composed images have their own responsive, static WebP exports. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={study.src} srcSet={`${study.small} 720w, ${study.src} 1440w`} sizes={index === 2 ? "(max-width: 768px) 100vw, 90vw" : "(max-width: 1024px) 100vw, 45vw"} width={study.width} height={study.height} alt={`${title} — ${t.composition}`} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} className="h-auto w-full" />
              </a>
              <figcaption className="mt-24 border-t border-line pt-16">
                <h2 className="text-h3 text-ink">{title}</h2>
                <p className="mt-12 max-w-[66ch] text-c1 text-ink-secondary">{caption}</p>
                <div className="mt-16 flex flex-wrap gap-x-24 gap-y-12">
                  {models.map(p => <Link key={p.slug} href={`${prefix}/products/${p.categoryPath[0]}/${p.slug}/`} className="short-marker short-marker-compact text-c1 text-ink">{p.model} · {t.viewSpecs}</Link>)}
                </div>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <section className="col-content mt-80 w-full border-t border-line pt-32">
        <h2 className="text-h3 text-ink">{t.specifyTitle}</h2>
        <p className="mt-16 max-w-[66ch] text-c1 text-ink-secondary">{t.specifyBody}</p>
        <Link href={`${prefix}/contact/`} className="short-marker short-marker-compact mt-24 inline-block text-c1 text-ink">{t.contact}</Link>
      </section>
    </main>
  );
}
