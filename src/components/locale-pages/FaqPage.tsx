import type { Metadata } from "next";
import { ArrowLink } from "@/components/site/ArrowLink";
import { FaqExplorer } from "@/components/site/FaqExplorer";
import { FaqJsonLd } from "@/components/site/JsonLd";
import styles from "@/components/site/FaqPage.module.css";
import { getAnsweredFaq } from "@/data/faq";
import type { Locale } from "@/data/locales";
import { tx } from "@/lib/i18n";
import { localeMetadata, prefixer } from "./shared";

export function faqMetadata(locale: Locale): Metadata {
  return localeMetadata(
    locale,
    "/faq",
    "Frequently asked questions",
    "Ordering, samples, lead times, finishes, master key systems, certification and export questions for Canton Hyland door hardware.",
  );
}

/**
 * The FAQ, every locale including English (2026-10-13, from the preview the client approved:
 * 「内页预览：Events 页、FAQ 页……没问题 请上架」). The count of answers is the page's figure,
 * as the model number is the product page's; the search, index and answers are FaqExplorer.
 *
 * Questions the client has not answered yet do not render. Half a page of real answers is worth
 * more than a full page where a third of them are invented.
 */
export function FaqPage({ locale }: { locale: Locale }) {
  const p = prefixer(locale);
  const groups = getAnsweredFaq(locale);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <main className="isolate flex-grow justify-self-start">
      <FaqJsonLd locale={locale} />
      <section className={`layout ${styles.hero}`} aria-labelledby="faq-title">
        <div className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full xl:col-span-7">
            <h1 id="faq-title" className="text-h3 text-ink">{tx(locale, "Frequently asked questions")}</h1>
          </div>
          <div className="col-span-full min-w-0 xl:col-span-16 xl:col-start-9">
            <p className={styles.figure}>
              <span className={styles.mask}><span>{total}<small> {tx(locale, "answers", { es: "respuestas", pt: "respostas" })}</small></span></span>
            </p>
            <p className="mt-24 max-w-[46ch] text-lead text-ink">
              {tx(locale, "If the answer you need is not here, ask us directly — we would rather reply than have you guess.", {
                es: "Si la respuesta que necesita no está aquí, pregúntenos directamente: preferimos contestar a que tenga que adivinar.",
                pt: "Se a resposta de que você precisa não estiver aqui, pergunte diretamente: preferimos responder a deixar você adivinhando.",
              })}
            </p>
            <div className="mt-32 flex flex-wrap gap-x-32 gap-y-16">
              <ArrowLink href={p("/contact")}>{tx(locale, "Ask a question", { es: "Hacer una pregunta", pt: "Fazer uma pergunta" })}</ArrowLink>
              {locale === "en" ? (
                <ArrowLink href="/request/price-list/">Request the price list</ArrowLink>
              ) : (
                <ArrowLink href={p("/products")}>{tx(locale, "Browse the catalog", { es: "Ver el catálogo", pt: "Ver o catálogo" })}</ArrowLink>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className={`layout ${styles.body}`}>
        <FaqExplorer
          groups={groups}
          labels={{
            search: tx(locale, "Search the answers", { es: "Buscar en las respuestas", pt: "Buscar nas respostas" }),
            placeholder: tx(locale, "MOQ, sample, EN 1125…", { es: "MOQ, muestra, EN 1125…", pt: "MOQ, amostra, EN 1125…" }),
            count: tx(locale, "{shown} of {total}", { es: "{shown} de {total}", pt: "{shown} de {total}" }),
            none: tx(locale, "Nothing matches “{q}”.", { es: "Nada coincide con «{q}».", pt: "Nada corresponde a “{q}”." }),
            ask: tx(locale, "Ask the export team", { es: "Pregunte al equipo de exportación", pt: "Pergunte à equipe de exportação" }),
            askHref: p("/contact"),
          }}
        />
      </section>
    </main>
  );
}
