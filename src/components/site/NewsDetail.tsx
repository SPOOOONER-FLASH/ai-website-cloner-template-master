import { articleFaqHeading, articleFaqItems, articleFaqLocale } from "@/lib/article-faq";
import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { newsKindLabels, formatNewsDate, getNewsBySlug, getPublishedNews } from "@/data/news";
import { getGuideBySlug, getPublishedGuides } from "@/data/guides";
import { CREDENTIAL_TRANSLATIONS, authorHref, authorPath, authorPortrait } from "@/data/authors";
import { getDownloadsByIds, formatDownloadSize } from "@/data/downloads";
import { getProductByModel, isPublished, publishedProducts } from "@/data/products";
import { firstMentions, rowHeaderHref } from "@/lib/article-products";
import { Breadcrumbs } from "./Breadcrumbs";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { NewsVisual } from "./NewsVisual";
import type { Locale } from "@/data/site";
import { articleBlocks } from "@/lib/article-layout";
import { ArticleBody } from "./ArticleBody";
import { MasterKeyHierarchyFigure, hasMasterKeyFigure } from "./MasterKeyHierarchyFigure";
import { ArticleContents } from "./ArticleContents";
import reading from "./ArticleReading.module.css";
import { ArticleBuyerBlock } from "./ArticleBuyerBlock";
import { articleRoute } from "@/data/article-routes";
import editorial from "./GuideEditorial.module.css";
import guide from "./GuidePage.module.css";
import { GuideCover } from "./GuideCover";
import { GuideReading } from "./GuideReading";
import { GuideSectionBars } from "./GuideSectionBars";
import { GuideModelRail } from "./GuideModelRail";
import { toHydeBrandedProductImageSrc } from "@/data/product-image-branding";
import { dict, t as tr, tx } from "@/lib/i18n";

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
    pressEnquiries: "Press inquiries",
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
  const t = dict(COPY, locale);
  const portrait = authorPortrait(article.author?.name);
  const sectionLabel = dict(SECTION_LABEL[section], locale) ?? SECTION_LABEL[section].en;
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
  /* English, never Spanish, for the fields that have no Portuguese yet. */
  const pickText = (en?: string, esText?: string, ptText?: string) =>
    en === undefined ? undefined : tx(locale, en, { es: esText, pt: ptText });
  /*
    `tr` (i18n `t`) reads the `…Es` / `…Pt` fields AND the overlay sidecar
    (content/i18n/<code>/{news,guides}.json). Until 2026-09-26 this read a `{ en, es, pt }`
    dict, which for the seven overlay locales mapped the English body through ui.json —
    i.e. printed it in English: 2,662 English lines on every locale's guides, although
    every guide body had been translated in the sidecar.
  */
  const title = tr(article, "title", locale) || article.title;
  const summary = tr(article, "summary", locale) || article.summary;
  const localeBody = tr(article, "body", locale);
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
  // The master key guide carries a hierarchy chart after its levels table (en/es/pt only).
  const levelsTable = blocks.findIndex((block) => block.kind === "table");
  const figure =
    article.slug === "master-key-hierarchy-planning-2026" && hasMasterKeyFigure(locale) && levelsTable >= 0
      ? { afterIndex: levelsTable, node: <MasterKeyHierarchyFigure locale={locale} /> }
      : undefined;
  const overview = tx(locale, "Overview", { es: "Resumen", pt: "Visão geral" });
  /* Only where this locale has its own: see readingAids in types.ts. */
  const aids = locale === "en" || locale === "es" || locale === "pt" ? article.readingAids?.[locale] : undefined;

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
  const [seeSection, seeSlug] = article.seeAlso?.split("/") ?? [];
  const seeAlso = seeSection === "guides" ? getGuideBySlug(seeSlug) : seeSection === "news" ? getNewsBySlug(seeSlug) : undefined;
  const related = (article.relatedModels ?? [])
    .map((model) => getProductByModel(model))
    .filter((product) => product !== undefined)
    .filter(isPublished);
  const route = articleRoute(section, article.slug);
  /* Model numbers in the prose and table row headers link to their product pages (article-products.ts). */
  const modelIndex = new Map(publishedProducts.map((p) => [p.model, `${base}/products/${p.categoryPath[0]}/${p.slug}/`] as const));
  const relatedModels = new Set(related.map((p) => p.model));
  /* The guide cover links to the product it is a photograph of — matched by image file name, never
     guessed. File name, not path: covers use the branded /images/products-hyde/ copy of /images/products/. */
  const fileName = (src?: string) => src?.split("/").pop();
  const cover = fileName(article.heroImage.src);
  const coverOf = cover ? [...related, ...publishedProducts].find((p) => [p.heroImage, ...p.gallery].some((img) => fileName(img.src) === cover)) : undefined;
  const coverProduct = coverOf && { href: `${base}/products/${coverOf.categoryPath[0]}/${coverOf.slug}/`, model: coverOf.model };
  const mentions = firstMentions(blocks, modelIndex);
  const rowHref = (cell: string) => rowHeaderHref(cell, modelIndex, relatedModels);
  const buyerHeading = tx(locale, "Related products", { es: "Productos relacionados", pt: "Produtos relacionados" });
  if (related.length) contents.push({ id: "article-products", text: buyerHeading, level: 2 });

  /*
    GUIDES, 2026-10-12 — the layout of the preview the client approved (「就用这个指南和产品页
    效果……方便大家观看，易于阅读理解 逻辑通畅 干净整洁有条理」): the guide's number and its
    facts on a cover, the section bars, the photograph, then contents | text | the models the
    current section names, and an ink previous/next pair. News keeps the press layout below.
    Every word is the article's own; the numbers are counted from it.
  */
  /* Reading time from the English text, which every locale translates paragraph for paragraph. */
  const minutes = Math.max(1, Math.round(article.body.join(" ").split(/\s+/).length / 230));
  /* Section shapes and the models each section names, from the blocks themselves. */
  const sectionText = new Map<string, string>([["article-overview", ""]]);
  let current = "article-overview";
  blocks.forEach((block) => {
    if (block.kind === "heading") {
      current = block.id;
      sectionText.set(current, "");
      return;
    }
    const text = block.kind === "table" ? [block.headers, ...block.rows].flat().join(" ") : block.text;
    sectionText.set(current, `${sectionText.get(current) ?? ""} ${text}`);
  });
  const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
  const names = (text: string) => related.filter((p) => new RegExp(`(^|[^\\w-])${escape(p.model)}(?![\\w-])`).test(text)).map((p) => p.model);
  const level2 = contents.filter((item) => item.level === 2 && sectionText.has(item.id));
  const longest = Math.max(1, ...level2.map((item) => (sectionText.get(item.id) ?? "").length));
  const productHref = (p: (typeof related)[number]) => `${base}/products/${p.categoryPath[0]}/${p.slug}/`;
  const thumb = (p: (typeof related)[number]) => (
    <MediaPlaceholder src={p.heroImage.src} ratio="1 / 1" label={`${p.model} ${tr(p, "name", locale)}`} sizes="64px" hiddenFromAssistiveTech />
  );
  /* The cover both layouts share (row 87, client 2026-10-13: 「指南的页头设计我很喜欢 这个要普及」):
     the article's place in its series as a figure, the facts, title, ruled summary, byline and
     the photographed models. News passes its kind as the first fact. */
  const coverSection = (position: number, total: number, numberLabel: string, kind?: string) => (
      <section className={`col-content ${guide.cover}`}>
        <div aria-hidden={position < 0}>
          {position >= 0 ? (
            <>
              <span className={`${guide.mask} ${guide.number}`}><span>{String(position + 1).padStart(2, "0")}</span></span>
              <span className={guide.numberLabel}>
                {numberLabel.replace("{n}", String(position + 1)).replace("{total}", String(total))}
              </span>
            </>
          ) : null}
        </div>
        <div className="min-w-0">
          <p className={guide.meta}>
            {kind ? <span>{kind}</span> : null}
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt, locale)}</time>
            {article.updatedAt && article.updatedAt > article.publishedAt ? (
              <span>
                {tx(locale, "Updated", { es: "Actualizado", pt: "Atualizado" })} <time dateTime={article.updatedAt}>{formatNewsDate(article.updatedAt, locale)}</time>
              </span>
            ) : null}
            <span>{tx(locale, "{n} min read", { es: "{n} min de lectura", pt: "{n} min de leitura" }).replace("{n}", String(minutes))}</span>
            <span>{tx(locale, "{n} sections", { es: "{n} secciones", pt: "{n} seções" }).replace("{n}", String(level2.length))}</span>
            {related.length ? <span>{tx(locale, "{n} models", { es: "{n} modelos", pt: "{n} modelos" }).replace("{n}", String(related.length))}</span> : null}
          </p>
          <h1 className={`mt-24 text-h1 text-ink ${editorial.articleTitle}`}>{title}</h1>
          <p className={`max-w-[72ch] text-h4 text-ink-secondary ${guide.ruled}`}>{summary}</p>
          {/*
            THE BYLINE, visible because the structured data names a Person. The credential
            shown is the one held; a real photograph of the person named, or nothing.
          */}
          {article.author ? (
            <div className="mt-24 flex items-start gap-12">
              {portrait ? (
                <img src={portrait.src} alt={article.author?.name ?? ""} width={portrait.width} height={portrait.height} loading="lazy" className="h-48 w-48 flex-none rounded-[2px] object-cover" />
              ) : null}
              <p className="text-c2 text-ink-secondary">
                <span className="text-ink">
                  {authorPath(article.author) ? (
                    <Link href={authorHref(article.author, locale)!} rel="author" className="short-marker">{article.author.name}</Link>
                  ) : article.author.url ? (
                    <a href={article.author.url} rel="author noopener noreferrer" target="_blank" className="short-marker">{article.author.name}</a>
                  ) : (
                    article.author.name
                  )}
                </span>
                <span className="mt-4 block">{tx(locale, article.author.role, { es: article.author.roleEs, pt: article.author.rolePt })}</span>
                {article.author.credential ? (
                  <span className="block text-ink-secondary">{tx(locale, article.author.credential, CREDENTIAL_TRANSLATIONS[article.author.credential])}</span>
                ) : null}
              </p>
            </div>
          ) : null}
          {related.length ? (
            <div className={guide.models} data-link-list="article-rail" aria-label={t.mentioned} role="list">
              {related.map((p) => (
                <Link key={p.slug} href={productHref(p)} role="listitem" title={`${p.model} — ${tr(p, "name", locale)}`}>
                  {thumb(p)}
                  <span>{p.model}</span>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>
  );

  if (section === "guides") {
    const ordered = getPublishedGuides().slice().sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug));
    const position = ordered.findIndex((g) => g.slug === article.slug);
    const prev = position > 0 ? ordered[position - 1] : undefined;
    const next = position >= 0 && position < ordered.length - 1 ? ordered[position + 1] : undefined;
    const neighbourImage = (g?: NewsArticle) => (g?.heroImage.src ? toHydeBrandedProductImageSrc(g.heroImage.src) : undefined);

    return (
      <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
        <GuideReading
          targetId="article-overview"
          minutes={minutes}
          labels={{ left: tx(locale, "About {n} min left", { es: "Quedan unos {n} min", pt: "Faltam cerca de {n} min" }), nearly: tx(locale, "Nearly done", { es: "Casi terminado", pt: "Quase no fim" }) }}
        />
        <div className="layout space-y-48 lg:space-y-64">
          <section className="col-content grid w-full grid-cols gap-x gap-y-32">
            <div className="col-span-full">
              <Breadcrumbs items={[{ label: t.home, href: `${base}/` }, { label: sectionLabel, href: `${base}/${section}/` }, { label: title }]} />
            </div>
          </section>

          {coverSection(position, ordered.length, tx(locale, "Guide {n} of {total}", { es: "Guía {n} de {total}", pt: "Guia {n} de {total}" }))}

          {level2.length > 1 ? (
            <section className="col-content">
              <GuideSectionBars
                label={tx(locale, "Sections of this guide", { es: "Secciones de esta guía", pt: "Seções deste guia" })}
                items={level2.map((item) => ({ id: item.id, text: item.text, share: (sectionText.get(item.id) ?? "").length / longest }))}
              />
            </section>
          ) : null}

          <section className="col-content">
            <GuideCover article={article} locale={locale} product={coverProduct} />
          </section>

          <section className="col-content grid w-full grid-cols gap-x">
            <div className="col-span-full min-w-0 lg:col-span-4 xl:col-span-5">
              <ArticleContents items={contents} locale={locale} />
            </div>
            <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5 xl:col-span-13 xl:col-start-7">
              <ArticleBody blocks={blocks} locale={locale} figure={figure} mentions={mentions} rowHref={rowHref} aids={aids} />

              {/* The question-and-answer block, after the argument it restates; ArticleFaqJsonLd emits the same items. */}
              {faq.length ? (
                <section className={reading.faq} aria-labelledby="article-faq" lang={faqLocale === locale ? undefined : faqLocale}>
                  <h2 id="article-faq" className="text-h3 text-ink">{articleFaqHeading(faqLocale)}</h2>
                  {faq.map((item) => <details key={item.question}><summary><h3>{item.question}</h3></summary><p>{item.answer}</p></details>)}
                </section>
              ) : null}

              <ArticleBuyerBlock section={section} slug={article.slug} related={related} route={route} locale={locale} />

              {article.attachment ? (
                <a href={article.attachment.url} className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover" download>
                  <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
                    {article.attachment.format.toUpperCase()} · {Math.round(article.attachment.sizeBytes / 1024)} KB
                  </span>
                  <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">
                    {pickText(article.attachment.title, article.attachment.titleEs, article.attachment.titlePt)}
                  </span>
                  {article.attachment.note ? (
                    <span className="mt-8 block text-c2 text-ink-secondary">{pickText(article.attachment.note, article.attachment.noteEs, article.attachment.notePt)}</span>
                  ) : null}
                </a>
              ) : null}

              {article.tool ? (
                <Link href={`${base}${article.tool.href}`} className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover">
                  <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">{pickText("Tool", "Herramienta", "Ferramenta")}</span>
                  <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">
                    {pickText(article.tool.title, article.tool.titleEs, article.tool.titlePt)}
                  </span>
                </Link>
              ) : null}

              {seeAlso ? (
                <Link href={`${base}/${seeSection}/${seeAlso.slug}/`} className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover">
                  <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">{tx(locale, "Read next", { es: "Siga leyendo", pt: "Continue lendo" })}</span>
                  <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">{tr(seeAlso, "title", locale) || seeAlso.title}</span>
                </Link>
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
                  <h2 className="text-h3 text-ink">{tx(locale, "Downloads", { es: "Descargas", pt: "Downloads" })}</h2>
                  <ul className="mt-16 divide-y divide-line border-y border-line">
                    {attachments.map((file) => (
                      <li key={file.id}>
                        <a href={file.url} download={file.format === "html" ? undefined : true} className="group short-marker-surface flex items-baseline justify-between gap-16 py-16 text-c1 text-brand hover:text-brand-hover">
                          <span className="short-marker short-marker-group">{file.title}</span>
                          <span className="whitespace-nowrap text-c2 text-ink-secondary">{file.format.toUpperCase()}, {formatDownloadSize(file.sizeBytes)}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <p className={guide.end}>
                ■ {tx(locale, "End of guide.", { es: "Fin de la guía.", pt: "Fim do guia." })}{" "}
                {article.updatedAt ? (
                  <>
                    {tx(locale, "Updated", { es: "Actualizado", pt: "Atualizado" })} <time dateTime={article.updatedAt}>{formatNewsDate(article.updatedAt, locale)}</time>.
                  </>
                ) : null}
              </p>
            </div>
            {related.length ? (
              <aside className="max-xl:hidden xl:col-span-5 xl:col-start-20">
                <GuideModelRail
                  title={t.mentioned}
                  note={tx(locale, "drawn in ink where this section names them", { es: "en negro donde esta sección los nombra", pt: "a preto onde esta seção os nomeia" })}
                  models={related.map((p) => ({ model: p.model, href: productHref(p), thumb: thumb(p) }))}
                  sections={[...sectionText.entries()].map(([id, text]) => ({ id, models: names(text) }))}
                  action={{ href: `${base}/contact/`, label: tx(locale, "Ask which one fits", { es: "Pregunte cuál encaja", pt: "Pergunte qual serve" }) }}
                />
              </aside>
            ) : null}
          </section>
        </div>

        {prev || next ? (
          <nav className={`mt-96 lg:mt-136 ${guide.prevNext}`} aria-label={tx(locale, "More guides", { es: "Más guías", pt: "Mais guias" })}>
            {([[tx(locale, "Previous guide", { es: "Guía anterior", pt: "Guia anterior" }), prev], [tx(locale, "Next guide", { es: "Guía siguiente", pt: "Próximo guia" }), next]] as const).map(([label, g]) =>
              g ? (
                <Link key={g.slug} href={`${base}/guides/${g.slug}/`} className={guide.pn}>
                  {neighbourImage(g) ? (
                    // eslint-disable-next-line @next/next/no-img-element -- a dimmed backdrop under the link text
                    <img src={neighbourImage(g)} alt="" loading="lazy" decoding="async" />
                  ) : null}
                  <span className={guide.pnLabel}>{label}</span>
                  <span className={guide.pnTitle}>{(tr(g, "title", locale) || g.title).split(": ")[0]}</span>
                  <span className={guide.pnSummary}>{tr(g, "summary", locale) || g.summary}</span>
                </Link>
              ) : (
                <span key={label} />
              ),
            )}
          </nav>
        ) : null}
      </main>
    );
  }

  const newsOrdered = getPublishedNews().slice().sort((a, b) => a.publishedAt.localeCompare(b.publishedAt) || a.slug.localeCompare(b.slug));
  const newsPosition = newsOrdered.findIndex((a) => a.slug === article.slug);
  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-64">
      <GuideReading
        targetId="article-overview"
        minutes={minutes}
        labels={{ left: tx(locale, "About {n} min left", { es: "Quedan unos {n} min", pt: "Faltam cerca de {n} min" }), nearly: tx(locale, "Nearly done", { es: "Casi terminado", pt: "Quase no fim" }) }}
      />
      <div className="layout space-y-48 lg:space-y-64">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <div className="col-span-full">
            <Breadcrumbs items={[{ label: t.home, href: `${base}/` }, { label: sectionLabel, href: `${base}/${section}/` }, { label: title }]} />
          </div>
        </section>

        {coverSection(newsPosition, newsOrdered.length, tx(locale, "Article {n} of {total}", { es: "Artículo {n} de {total}", pt: "Artigo {n} de {total}" }), section === "news" ? newsKindLabels(locale)[article.kind] : undefined)}

        {level2.length > 1 ? (
          <section className="col-content">
            <GuideSectionBars
              label={tx(locale, "Sections of this article", { es: "Secciones de este artículo", pt: "Seções deste artigo" })}
              items={level2.map((item) => ({ id: item.id, text: item.text, share: (sectionText.get(item.id) ?? "").length / longest }))}
            />
          </section>
        ) : null}

        <section className="col-content">
          <NewsVisual article={article} locale={locale} />
        </section>

        <section className="col-content grid w-full grid-cols gap-x">
          <div className="col-span-full min-w-0 lg:col-span-4 xl:col-span-5">
            <ArticleContents items={contents} locale={locale} />
          </div>
          <div className="col-span-full min-w-0 lg:col-span-8 lg:col-start-5 xl:col-span-13 xl:col-start-7">
            {/* Since 2026-10-13 news reads like a guide (client: 新闻页也用上指南页的阅读辅助): the same
                blocks through the same ArticleBody, the contents beside them, the models on the right. */}
            <ArticleBody blocks={blocks} locale={locale} figure={figure} mentions={mentions} rowHref={rowHref} aids={aids} />

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
                className="mt-64 border-t border-line pt-32"
                aria-labelledby="article-faq"
                /* Marked in the language it is actually in, so a screen reader switches
                   voice and a search engine is not told English is Portuguese. */
                lang={faqLocale === locale ? undefined : faqLocale}
              >
                <h2 id="article-faq" className="text-h3 text-ink">
                  {articleFaqHeading(faqLocale)}
                </h2>
                {faq.map((item) => (
                  <section key={item.question} className="mt-32">
                    <h3 className="text-c1 font-semibold text-ink">{item.question}</h3>
                    <p className="mt-12 text-c1 text-ink-secondary">{item.answer}</p>
                  </section>
                ))}
              </section>
            ) : null}

            <ArticleBuyerBlock section={section} slug={article.slug} related={related} route={route} locale={locale} />

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
                <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">
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

            {/*
              A tool page that does what the article explains (2026-09-27). Same row style as
              the take-away file: the reader who has just followed the arithmetic is the one
              most likely to want it done for their own door.
            */}
            {article.tool ? (
              <Link
                href={`${base}${article.tool.href}`}
                className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover"
              >
                <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
                  {pickText("Tool", "Herramienta", "Ferramenta")}
                </span>
                <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">
                  {pickText(article.tool.title, article.tool.titleEs, article.tool.titlePt)}
                </span>
              </Link>
            ) : null}

            {seeAlso ? (
              <Link
                href={`${base}/${seeSection}/${seeAlso.slug}/`}
                className="mt-48 block border-t border-ink pt-16 hover:text-brand-hover"
              >
                <span className="text-c2 uppercase tracking-[0.08em] text-ink-secondary">
                  {tx(locale, "Read next", { es: "Siga leyendo", pt: "Continue lendo" })}
                </span>
                <span className="short-marker short-marker-arrow relative mt-8 block ps-12 text-c1 text-brand">
                  {tr(seeAlso, "title", locale) || seeAlso.title}
                </span>
              </Link>
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
                        /* An HTML sheet (the printable master-key plan) opens to print; files download. */
                        download={file.format === "html" ? undefined : true}
                        className="group short-marker-surface flex items-baseline justify-between gap-16 py-16 text-c1 text-brand hover:text-brand-hover"
                      >
                        <span className="short-marker short-marker-group">{file.title}</span>
                        <span className="whitespace-nowrap text-c2 text-ink-secondary">
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
          {related.length ? (
            <aside className="max-xl:hidden xl:col-span-5 xl:col-start-20">
              <GuideModelRail
                title={t.mentioned}
                note={tx(locale, "drawn in ink where this section names them", { es: "en negro donde esta sección los nombra", pt: "a preto onde esta seção os nomeia" })}
                models={related.map((p) => ({ model: p.model, href: productHref(p), thumb: thumb(p) }))}
                sections={[...sectionText.entries()].map(([id, text]) => ({ id, models: names(text) }))}
                action={{ href: `${base}/contact/`, label: tx(locale, "Ask which one fits", { es: "Pregunte cuál encaja", pt: "Pergunte qual serve" }) }}
              />
            </aside>
          ) : null}
        </section>
      </div>
    </main>
  );
}
