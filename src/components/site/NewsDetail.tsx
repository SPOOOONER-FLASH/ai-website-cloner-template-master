import { articleFaqHeading, articleFaqItems, articleFaqLocale } from "@/lib/article-faq";
import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { newsKindLabels, formatNewsDate } from "@/data/news";
import { getDownloadsByIds, formatDownloadSize } from "@/data/downloads";
import { getProductByModel, isPublished } from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { NewsVisual } from "./NewsVisual";
import type { Locale } from "@/data/site";
import { articleBlocks } from "@/lib/article-layout";
import { ArticleBody } from "./ArticleBody";
import { DataTable } from "./DataTable";
import { InlineText } from "./InlineText";
import { ArticleContents } from "./ArticleContents";
import reading from "./ArticleReading.module.css";
import { GuideArticleIntro } from "./GuideArticleIntro";
import editorial from "./GuideEditorial.module.css";

/**
 * A single release, laid out on FSB's press skeleton: breadcrumb → title → back link →
 * a two-column band carrying the dateline and contact on the left and the one editorial
 * image on the right → body → press kit → boilerplate.
 *
 * The image is deliberately NOT a full-bleed hero. FSB runs press images at 800×450
 * inside the text band, and the reason holds here: a company announcement is a document,
 * and giving it the same visual weight as a product launch page overstates it.
 */
/**
 * Every string this page shows, in both locales.
 *
 * The Spanish mirror renders THIS component with locale="es" rather than a translated
 * copy of it. A second implementation drifts the first time the layout changes, and the
 * drift is only visible to somebody reading Spanish — which is to say, to nobody working
 * on this repository.
 */
const COPY = {
  en: {
    home: "Home",
    news: "News + Press",
    back: "← Back to all news",
    pressEnquiries: "Press enquiries",
    contact: "Contact us",
    mentioned: "Products mentioned",
    pressKit: "Press kit",
    aboutTitle: "About Canton Hyland",
    about:
      " — Canton Hyland manufactures panic exit devices, locks and architectural door hardware for commercial and institutional projects, supplying specifiers and distributors internationally.",
  },
  es: {
    home: "Inicio",
    news: "Noticias y prensa",
    back: "← Volver a todas las noticias",
    pressEnquiries: "Consultas de prensa",
    contact: "Contacto",
    mentioned: "Productos mencionados",
    pressKit: "Dossier de prensa",
    aboutTitle: "Sobre Canton Hyland",
    about:
      " — Canton Hyland fabrica dispositivos antipánico, cerraduras y herrajes arquitectónicos para obra comercial e institucional, y suministra a prescriptores y distribuidores en todo el mundo.",
  },
  pt: {
    home: "Início",
    news: "Notícias e imprensa",
    back: "← Voltar a todas as notícias",
    pressEnquiries: "Contatos de imprensa",
    contact: "Contato",
    mentioned: "Produtos mencionados",
    pressKit: "Kit de imprensa",
    aboutTitle: "Sobre a Canton Hyland",
    about:
      " — a Canton Hyland fabrica barras antipânico, fechaduras e ferragens arquitetónicas para obra comercial e institucional, e fornece prescritores e distribuidores em todo o mundo.",
  },
} as const;

/*
  section 决定这张卡/这一页属于哪个栏目，默认 news。

  2026-09-21 新开 /guides/ 时加的。甲方的决定是现有 35 篇一篇都不搬 ——
  它们的 URL 正在被引用（那天的 Clarity 读数里 33 条引用全部落在 /news/ 下的
  八个页面上）。所以两个栏目共用这些组件，只有路径不同。

  没有为 guides 复制一套组件：形状完全相同，复制一份只会让下一次改版式的人
  改两处，而其中一处一定会被忘掉。
*/
const SECTION_LABEL = {
  news: { en: "News + Press", es: "Noticias y prensa", pt: "Notícias e imprensa" },
  guides: { en: "Guides", es: "Guías", pt: "Guias" },
} as const;

export function NewsDetail({
  article,
  locale = "en",
  section = "news",
}: {
  article: NewsArticle;
  locale?: Locale;
  section?: "news" | "guides";
}) {
  const t = COPY[locale];
  const sectionLabel = SECTION_LABEL[section][locale] ?? SECTION_LABEL[section].en;
  const base = locale === "en" ? "" : `/${locale}`;
  /*
    Falls back to the English field when a translation is missing rather than rendering
    an empty heading. An untranslated article reads as English on a Spanish or Portuguese
    page, which is visibly incomplete — and visibly incomplete is the state that gets
    fixed. English, never the other translation: see src/lib/localised.ts.

    The body is taken only when it is COMPLETE. A half-translated article rendered as a
    mix of two languages looks like a rendering bug rather than a gap, so the length has
    to match paragraph for paragraph or the whole English body is used.
  */
  /* One place that knows this page only has Spanish for the author, product and attachment
     strings. Portuguese falls back to English until those fields exist, which is the rule
     in src/lib/localised.ts and not an oversight. */
  const es = locale === "es";
  /* English, never Spanish, for the fields that have no Portuguese yet. */
  const pickText = (en?: string, esText?: string, ptText?: string) =>
    (locale === "es" ? esText : locale === "pt" ? ptText : undefined) ?? en;
  const titleFor = { en: article.title, es: article.titleEs, pt: article.titlePt };
  const summaryFor = { en: article.summary, es: article.summaryEs, pt: article.summaryPt };
  const bodyFor = { en: article.body, es: article.bodyEs, pt: article.bodyPt };
  const title = titleFor[locale] || article.title;
  const summary = summaryFor[locale] || article.summary;
  const localeBody = bodyFor[locale];
  /*
    A translated body is used whenever one exists — NOT only when its paragraph count
    matches the English.

    The equal-length rule (same as ProjectDetail) was meant to stop a half-translated page
    reading as a rendering bug. What it did in practice, found 2026-09-22: two news
    articles and two guides whose complete Spanish and Portuguese translations split one
    paragraph differently from the English were served in ENGLISH on /es/ and /pt/, live;
    and the English-only expansion of 20 more articles (client: translations deferred)
    would have done the same to 40 pages. A complete Spanish article that is shorter than
    the new English one is the right thing to show a Spanish reader; an English article
    under a Spanish title is not. The drift is still reported — `npm run copy:parity`
    lists every body whose paragraph count differs — so the translation batch can find it.
  */
  const body = localeBody?.length ? localeBody : article.body;
  const blocks = articleBlocks(body);
  const overview = { en: "Overview", es: "Resumen", pt: "Visão geral" }[locale];

  const attachments = getDownloadsByIds(article.attachmentIds ?? []);
  /*
    Articles name models in their relatedModels list, and some of those models have no
    photograph yet — 301 and 302 are cited by three of the exit-device articles. Linking
    a reader from an article into a withheld page is the same defect as listing it in a
    category, so the same rule applies: resolve the model, then drop it if it is not
    published. The article's own prose still names the model; only the link goes.
  */
  const faq = articleFaqItems(article, locale);
  /* The heading goes in the language of the questions, not of the page — see the note on
     articleFaqLocale. A translated heading over untranslated pairs reads as a bug. */
  const faqLocale = articleFaqLocale(article, locale);
  const contents = [{ id: "article-overview", text: overview, level: 2 }, ...blocks.filter(block => block.kind === "heading").map(block => ({ id: block.id, text: block.text, level: block.level })), ...(faq.length ? [{ id: "article-faq", text: articleFaqHeading(faqLocale), level: 2 }] : [])];
  const related = (article.relatedModels ?? [])
    .map((model) => getProductByModel(model))
    .filter((product) => product !== undefined)
    .filter(isPublished);

  return (
    <main className={section === "guides" ? "isolate mt-48 flex-grow justify-self-start lg:mt-64" : "isolate mt-48 flex-grow justify-self-start lg:mt-192"}>
      <div className={section === "guides" ? "layout space-y-48 lg:space-y-64" : "layout space-y-96 lg:space-y-136"}>
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: t.home, href: `${base}/` },
                { label: sectionLabel, href: `${base}/${section}/` },
                { label: title },
              ]}
            />
          </div>

          <h1 className={`col-span-full mt-16 text-h1 text-ink xl:col-span-18 ${section === "guides" ? editorial.articleTitle : ""}`}>
            {title}
          </h1>

          <p className="col-span-full max-w-[72ch] text-h4 text-ink-secondary xl:col-span-16">
            {summary}
          </p>

          <div className="col-span-full">
            <Link
              href={`${base}/${section}/`}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              {section === "guides" ? { en: "← Back to all guides", es: "← Volver a todas las guías", pt: "← Voltar a todos os guias" }[locale] : t.back}
            </Link>
          </div>
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          {/* Left column: the dateline, the contact route, and any linked products. */}
          <div className="col-span-full lg:col-span-4 xl:col-span-8">
            {section === "news" && <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
              {newsKindLabels(locale)[article.kind]}
            </p>}
            <time
              dateTime={article.publishedAt}
              className={section === "guides" ? "block text-c2 text-ink-secondary" : "mt-8 block text-h3 text-ink"}
            >
              {formatNewsDate(article.publishedAt, locale)}
            </time>

            {/*
              THE BYLINE.

              Visible because the structured data names a Person, and markup that asserts
              an author the page never shows is the same drift the FAQ answers are
              guarded against. The credential shown is the one held; nothing here claims
              engineering authority, and where a factory engineer reviews a piece a
              reviewer line can be added beside this — empty until a real name exists.
            */}
            {article.author ? (
              <p className="mt-16 text-c2 text-ink-secondary">
                <span className="text-ink">
                  {article.author.url ? (
                    <a
                      href={article.author.url}
                      rel="author noopener noreferrer"
                      target="_blank"
                      className="short-marker"
                    >
                      {article.author.name}
                    </a>
                  ) : (
                    article.author.name
                  )}
                </span>
                <span className="mt-4 block">
                  {(es && article.author.roleEs) || (locale === "pt" && article.author.rolePt) || article.author.role}
                </span>
                {article.author.credential ? (
                  <span className="block text-ink-tertiary">{article.author.credential}</span>
                ) : null}
              </p>
            ) : null}

            {section === "news" && <div className="mt-32 border-t border-line pt-16">
              <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
                {t.pressEnquiries}
              </p>
              {/*
                No named press officer. The client has not nominated one, and putting an
                invented name on a page journalists are meant to act on is worse than
                pointing at the enquiry form.
              */}
              <p className="mt-8 text-c1 text-ink">Canton Hyland</p>
              <Link
                href={`${base}/contact/`}
                className="short-marker short-marker-compact mt-8 text-c1 text-brand hover:text-brand-hover"
              >
                {t.contact}
              </Link>
            </div>}

            {related.length > 0 ? (
              <div className="mt-32 border-t border-line pt-16">
                <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
                  {t.mentioned}
                </p>
                <ul className="mt-8 space-y-8">
                  {related.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`${base}/products/${product.categoryPath[0]}/${product.slug}/`}
                        className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
                      >
                        {product.model} — {(es ? product.nameEs : locale === "pt" ? product.namePt : undefined) ?? product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Right column: the single editorial image, at press width. */}
          <div className="col-span-full lg:col-span-8 lg:col-start-5 xl:col-span-14 xl:col-start-10">
          {section === "guides" ? <GuideArticleIntro article={article} locale={locale} contents={contents} /> : <NewsVisual article={article} locale={locale} />}
          </div>
        </section>

        <section className="col-content grid w-full grid-cols gap-x">
          {section === "guides" && <div className="col-span-full min-w-0 lg:col-span-4 xl:col-span-8"><ArticleContents items={contents} locale={locale} /></div>}
          <div className="col-span-full lg:col-span-8 lg:col-start-5 xl:col-span-14 xl:col-start-10">
            {/*
              News renders the same blocks as guides, in news styling.

              Until 2026-09-23 news printed `body` paragraph by paragraph as plain strings,
              so the headings and tables the 35 expanded articles carry — 273 `##` and 288
              table rows — reached the live page as literal `##` and `| a | b |`. The block
              parser already ran for news (`blocks` above); its output was just unused.
            */}
            {section === "guides" ? <ArticleBody blocks={blocks} locale={locale} /> : blocks.map((block, index) => {
              if (block.kind === "heading") {
                return block.level === 2 ? (
                  <h2 key={block.id} id={block.id} className="mt-48 text-h3 text-ink">
                    {block.text}
                  </h2>
                ) : (
                  <h3 key={block.id} id={block.id} className="mt-32 text-c1 font-semibold text-ink">
                    {block.text}
                  </h3>
                );
              }
              if (block.kind === "table") {
                const numeric = block.headers.map((_, column) =>
                  block.rows.every((row) => /^-?\d+(?:\.\d+)?$/.test(row[column])),
                );
                return (
                  <div key={index} className="mt-24">
                    <DataTable
                      locale={locale}
                      caption={block.caption || { en: "Reference table", es: "Tabla de consulta", pt: "Tabela de consulta" }[locale]}
                      columns={block.headers.map((label, column) => ({ label, sort: numeric[column] ? "number" : "text" }))}
                      rows={block.rows.map((row) =>
                        row.map((text, column) => ({ text, value: numeric[column] ? Number(text) : undefined })),
                      )}
                    />
                  </div>
                );
              }
              return (
                <p
                  key={index}
                  className={
                    // FSB sets the lede in bold and lets the rest run as body copy.
                    index === 0
                      ? "text-c1 font-semibold text-ink"
                      : "mt-24 text-c1 text-ink-secondary"
                  }
                >
                  <InlineText text={block.text} />
                </p>
              );
            })}

            {/*
              The question-and-answer block.

              Placed after the argument rather than before it, because it is a restatement,
              not a summary: every answer here is something the paragraphs above have
              already established. Put first it would give away the conclusions and make
              the article look like a FAQ page with an essay attached.

              Each pair is one <section> with the question as its heading, so a retrieval
              system reading the DOM gets the pair as a unit rather than having to guess
              which paragraph answers which heading. `ArticleFaqJsonLd` emits the same
              items as FAQPage markup — same source, so the two cannot drift.
            */}
            {faq.length ? (
              <section
                className={section === "guides" ? reading.faq : "mt-64 border-t border-line pt-32"}
                aria-labelledby="article-faq"
                /* Marked in the language it is actually in, so a screen reader switches
                   voice and a search engine is not told English is Portuguese. */
                lang={faqLocale === locale ? undefined : faqLocale}
              >
                <h2 id="article-faq" className="text-h3 text-ink">
                  {articleFaqHeading(faqLocale)}
                </h2>
                {section === "guides" ? faq.map((item) => <details key={item.question}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>) : faq.map((item) => (
                  <section key={item.question} className="mt-32">
                    <h3 className="text-c1 font-semibold text-ink">{item.question}</h3>
                    <p className="mt-12 text-c1 text-ink-secondary">{item.answer}</p>
                  </section>
                ))}
              </section>
            ) : null}

            {/*
              The take-away file, immediately after the argument for taking it away.
              Styled as a specification row rather than a button: this is a working
              document, and a download that announces itself like an advertisement gets
              read as one.
            */}
            {article.attachment ? (
              <a
                href={article.attachment.url}
                className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover"
                download
              >
                <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
                  {article.attachment.format.toUpperCase()} ·{" "}
                  {Math.round(article.attachment.sizeBytes / 1024)} KB
                </span>
                <span className="short-marker short-marker-arrow relative mt-8 block pl-12 text-c1 text-brand">
                  {pickText(
                    article.attachment.title,
                    article.attachment.titleEs,
                    article.attachment.titlePt,
                  )}
                </span>
                {article.attachment.note ? (
                  <span className="mt-8 block text-c2 text-ink-secondary">
                    {pickText(
                      article.attachment.note,
                      article.attachment.noteEs,
                      article.attachment.notePt,
                    )}
                  </span>
                ) : null}
              </a>
            ) : null}

            {article.gallery && article.gallery.length > 0 ? (
              <div className="mt-48 space-y-48">
                {article.gallery.map((image, index) => (
                  <MediaPlaceholder key={index} {...image} />
                ))}
              </div>
            ) : null}

            {attachments.length > 0 ? (
              <div className="mt-48 border-t border-line pt-24">
                <h2 className="text-h3 text-ink">{t.pressKit}</h2>
                <ul className="mt-16 divide-y divide-line border-y border-line">
                  {attachments.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.url}
                        download
                        className="group short-marker-surface flex items-baseline justify-between gap-16 py-16 text-c1 text-brand hover:text-brand-hover"
                      >
                        <span className="short-marker short-marker-group">{file.title}</span>
                        <span className="whitespace-nowrap text-c2 text-ink-tertiary">
                          {file.format.toUpperCase()}, {formatDownloadSize(file.sizeBytes)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Standing boilerplate, the paragraph a journalist pastes at the end. */}
            <div className="mt-48 border-t border-line pt-24">
              <p className="text-c1 text-ink-secondary">
                <strong className="font-semibold text-ink">{t.aboutTitle}</strong>
                {t.about}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
