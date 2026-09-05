import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { NEWS_KIND_LABEL, NEWS_KIND_LABEL_ES, formatNewsDate } from "@/data/news";
import { getDownloadsByIds, formatDownloadSize } from "@/data/downloads";
import { getProductByModel } from "@/data/products";
import { Breadcrumbs } from "./Breadcrumbs";
import { MediaPlaceholder } from "./MediaPlaceholder";

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
} as const;

export function NewsDetail({
  article,
  locale = "en",
}: {
  article: NewsArticle;
  locale?: "en" | "es";
}) {
  const t = COPY[locale];
  const base = locale === "es" ? "/es" : "";
  const es = locale === "es";
  /*
    Falls back to the English field when a translation is missing rather than rendering
    an empty heading. An untranslated article reads as English on a Spanish page, which is
    visibly incomplete — and visibly incomplete is the state that gets fixed.
  */
  const title = (es && article.titleEs) || article.title;
  const summary = (es && article.summaryEs) || article.summary;
  const body = (es && article.bodyEs?.length === article.body.length && article.bodyEs) || article.body;

  const attachments = getDownloadsByIds(article.attachmentIds ?? []);
  const related = (article.relatedModels ?? [])
    .map((model) => getProductByModel(model))
    .filter((product) => product !== undefined);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: t.home, href: `${base}/` },
                { label: t.news, href: `${base}/news/` },
                { label: title },
              ]}
            />
          </div>

          <h1 className="col-span-full mt-16 text-h1 text-ink xl:col-span-18">
            {title}
          </h1>

          <p className="col-span-full max-w-[72ch] text-h4 text-ink-secondary xl:col-span-16">
            {summary}
          </p>

          <div className="col-span-full">
            <Link
              href={`${base}/news/`}
              className="short-marker short-marker-compact text-c1 text-brand hover:text-brand-hover"
            >
              {t.back}
            </Link>
          </div>
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          {/* Left column: the dateline, the contact route, and any linked products. */}
          <div className="col-span-full lg:col-span-4 xl:col-span-8">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
              {(es ? NEWS_KIND_LABEL_ES : NEWS_KIND_LABEL)[article.kind]}
            </p>
            <time
              dateTime={article.publishedAt}
              className="mt-8 block text-h3 text-ink"
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
                  {(es && article.author.roleEs) || article.author.role}
                </span>
                {article.author.credential ? (
                  <span className="block text-ink-tertiary">{article.author.credential}</span>
                ) : null}
              </p>
            ) : null}

            <div className="mt-32 border-t border-line pt-16">
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
            </div>

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
                        {product.model} — {(es && product.nameEs) || product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {/* Right column: the single editorial image, at press width. */}
          <div className="col-span-full lg:col-span-8 lg:col-start-5 xl:col-span-14 xl:col-start-10">
            <MediaPlaceholder {...article.heroImage} className="aspect-[16/9]" />
          </div>
        </section>

        <section className="col-content grid w-full grid-cols gap-x">
          <div className="col-span-full lg:col-span-8 lg:col-start-5 xl:col-span-14 xl:col-start-10">
            {body.map((paragraph, index) => (
              <p
                key={index}
                className={
                  // FSB sets the lede in bold and lets the rest run as body copy.
                  index === 0
                    ? "text-c1 font-semibold text-ink"
                    : "mt-24 text-c1 text-ink-secondary"
                }
              >
                {paragraph}
              </p>
            ))}

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
