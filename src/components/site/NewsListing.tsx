import { getPublishedNews } from "@/data/news";
import { NewsCard } from "./NewsCard";

/**
 * The newsroom listing.
 *
 * It is expected to render its empty state for now — the client has not written a
 * release yet, and seeding the page with plausible-looking announcements would put
 * checkable, quotable claims on a public site. The empty state says what the page is
 * for and gives a way to reach someone, which is more use to a journalist than three
 * invented items.
 */
export function NewsListing() {
  const articles = getPublishedNews();

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-32">
          <h1 className="col-span-full text-h1 text-ink lg:col-span-5 xl:col-span-11">
            News + Press
          </h1>
          <div className="col-span-full lg:col-span-6 lg:col-start-7 xl:col-span-11 xl:col-start-14">
            <p className="text-c1 text-ink">
              Company announcements, certification news and technical notes from Canton
              Hyland.
            </p>
          </div>
        </section>

        <section className="col-content">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-x gap-y-48 sm:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <NewsCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="border border-line p-32 lg:p-48">
              <p className="text-h3 text-ink">No releases published yet.</p>
              <p className="mt-16 max-w-[60ch] text-c1 text-ink-secondary">
                This is where Canton Hyland publishes company announcements and technical
                notes. Press enquiries and requests for product imagery are answered
                directly in the meantime.
              </p>
              <a
                href="/contact/"
                className="short-marker short-marker-compact mt-24 text-c1 text-brand hover:text-brand-hover"
              >
                Contact us
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
