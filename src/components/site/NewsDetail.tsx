import Link from "next/link";
import type { NewsArticle } from "@/data/types";
import { NEWS_KIND_LABEL, formatNewsDate } from "@/data/news";
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
export function NewsDetail({ article }: { article: NewsArticle }) {
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
                { label: "Home", href: "/" },
                { label: "News + Press", href: "/news/" },
                { label: article.title },
              ]}
            />
          </div>

          <h1 className="col-span-full mt-16 text-h1 text-ink xl:col-span-18">
            {article.title}
          </h1>

          <div className="col-span-full">
            <Link
              href="/news/"
              className="text-c1 text-brand underline-offset-4 hover:text-brand-hover hover:underline"
            >
              &larr; Back to all news
            </Link>
          </div>
        </section>

        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          {/* Left column: the dateline, the contact route, and any linked products. */}
          <div className="col-span-full lg:col-span-4 xl:col-span-8">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
              {NEWS_KIND_LABEL[article.kind]}
            </p>
            <time
              dateTime={article.publishedAt}
              className="mt-8 block text-h3 text-ink"
            >
              {formatNewsDate(article.publishedAt)}
            </time>

            <div className="mt-32 border-t border-line pt-16">
              <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
                Press enquiries
              </p>
              {/*
                No named press officer. The client has not nominated one, and putting an
                invented name on a page journalists are meant to act on is worse than
                pointing at the enquiry form.
              */}
              <p className="mt-8 text-c1 text-ink">Canton Hyland</p>
              <Link
                href="/contact/"
                className="mt-8 inline-block text-c1 text-brand underline-offset-4 hover:text-brand-hover hover:underline"
              >
                Contact us
              </Link>
            </div>

            {related.length > 0 ? (
              <div className="mt-32 border-t border-line pt-16">
                <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">
                  Products mentioned
                </p>
                <ul className="mt-8 space-y-8">
                  {related.map((product) => (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.categoryPath[0]}/${product.slug}/`}
                        className="text-c1 text-brand underline-offset-4 hover:text-brand-hover hover:underline"
                      >
                        {product.model} — {product.name}
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
            {article.body.map((paragraph, index) => (
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
                <h2 className="text-h3 text-ink">Press kit</h2>
                <ul className="mt-16 divide-y divide-line border-y border-line">
                  {attachments.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.url}
                        download
                        className="flex items-baseline justify-between gap-16 py-16 text-c1 text-brand underline-offset-4 hover:text-brand-hover hover:underline"
                      >
                        <span>{file.title}</span>
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
                <strong className="font-semibold text-ink">About Canton Hyland</strong>{" "}
                — Canton Hyland manufactures panic exit devices, locks and architectural
                door hardware for commercial and institutional projects, supplying
                specifiers and distributors internationally.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
