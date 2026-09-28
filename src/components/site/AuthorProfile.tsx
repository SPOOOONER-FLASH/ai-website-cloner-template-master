import Link from "next/link";
import type { Thing, WithContext } from "schema-dts";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/site/JsonLd";
import { CREDENTIAL_TRANSLATIONS, authorPath, getAuthorArticles, getAuthorBySlug } from "@/data/authors";
import { formatNewsDate } from "@/data/news";
import { absoluteUrl, siteUrl, type Locale } from "@/data/site";
import type { ArticleAuthor } from "@/data/types";
import { dict, fill, t, tx } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { localisedHref } from "@/lib/spanish-mirror";

/**
 * An author's profile page, /company/<slug>/ in all ten languages (client 2026-09-28).
 *
 * Everything on it already exists elsewhere: the name, role and credential from the
 * articles' `author` block, the list from the published guides and news. Nothing is
 * written about the person that the byline does not already say — an invented biography
 * is the same class of error as an invented dimension.
 */
const COPY = {
  en: {
    eyebrow: "Author",
    intro: "Writes the door hardware guides and factory news published on this site.",
    linkedin: "LinkedIn profile",
    description: "Door hardware guides and factory news by {name}.",
    guides: "Guides",
    news: "News",
    home: "Home",
    company: "Company",
  },
  es: {
    eyebrow: "Autor",
    intro: "Escribe las guías de herrajes para puertas y las noticias de fábrica publicadas en este sitio.",
    linkedin: "Perfil de LinkedIn",
    description: "Guías de herrajes para puertas y noticias de fábrica de {name}.",
    guides: "Guías",
    news: "Noticias",
    home: "Inicio",
    company: "Empresa",
  },
  pt: {
    eyebrow: "Autor",
    intro: "Escreve os guias de ferragens para portas e as notícias de fábrica publicados neste site.",
    linkedin: "Perfil no LinkedIn",
    description: "Guias de ferragens para portas e notícias de fábrica por {name}.",
    guides: "Guias",
    news: "Notícias",
    home: "Início",
    company: "Empresa",
  },
} as const;

export function authorRole(author: ArticleAuthor, locale: Locale): string {
  return tx(locale, author.role, { es: author.roleEs, pt: author.rolePt });
}

export function authorCredential(author: ArticleAuthor, locale: Locale): string | undefined {
  if (!author.credential) return undefined;
  return tx(locale, author.credential, CREDENTIAL_TRANSLATIONS[author.credential]);
}

export function authorMetadata(locale: Locale, slug: string): Metadata {
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  const text = dict(COPY, locale);
  return pageMetadata({
    enPath: `/company/${slug}`,
    locale,
    title: `${author.name} — ${authorRole(author, locale)}`,
    description: fill(text.description, { name: author.name }),
  });
}

/** ProfilePage + Person. The Person @id is the one every Article's `author` points at. */
export function authorProfileSchema(author: ArticleAuthor, locale: Locale): WithContext<Thing> {
  const enPath = authorPath(author)!;
  const url = absoluteUrl(localisedHref(`${enPath}/`, locale));
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    inLanguage: locale === "pt" ? "pt-BR" : locale,
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}${enPath}/#person`,
      name: author.name,
      url,
      jobTitle: authorRole(author, locale),
      worksFor: { "@id": `${siteUrl}/#organization` },
      ...(author.url ? { sameAs: [author.url] } : {}),
      ...(author.credential
        ? {
            hasCredential: {
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "degree",
              name: authorCredential(author, locale),
            },
          }
        : {}),
    },
  } as WithContext<Thing>;
}

export function AuthorProfile({ locale, slug }: { locale: Locale; slug: string }) {
  const author = getAuthorBySlug(slug);
  if (!author) return null;
  const text = dict(COPY, locale);
  const credential = authorCredential(author, locale);
  const articles = getAuthorArticles(author.name, locale);
  const groups = (["guides", "news"] as const)
    .map((section) => ({ section, items: articles.filter((a) => a.section === section) }))
    .filter((g) => g.items.length);

  return (
    <main className="isolate mt-48 flex-grow justify-self-start lg:mt-192">
      <JsonLd data={authorProfileSchema(author, locale)} />
      <div className="layout space-y-96 lg:space-y-136">
        <section className="col-content grid w-full grid-cols gap-x gap-y-48">
          <div className="col-span-full">
            <Breadcrumbs
              items={[
                { label: text.home, href: localisedHref("/", locale) },
                { label: text.company, href: localisedHref("/company/", locale) },
                { label: author.name },
              ]}
            />
          </div>
          <div className="col-span-full lg:col-span-6 xl:col-span-12">
            <p className="text-c2 font-semibold uppercase tracking-[0.08em] text-ink-secondary">{text.eyebrow}</p>
            <h1 className="mt-16 text-h1 text-ink">{author.name}</h1>
            <p className="mt-24 text-c1 text-ink">{authorRole(author, locale)}</p>
            {credential ? <p className="mt-8 text-c1 text-ink-secondary">{credential}</p> : null}
            <p className="mt-24 text-c1 text-ink">{text.intro}</p>
            {author.url ? (
              <p className="mt-24 text-c2">
                <a href={author.url} rel="me noopener noreferrer" target="_blank" className="short-marker">
                  {text.linkedin}
                </a>
              </p>
            ) : null}
          </div>
        </section>

        {groups.map(({ section, items }) => (
          <section key={section} className="col-content grid w-full grid-cols gap-x gap-y-24">
            <h2 className="col-span-full text-h3 text-ink">
              {section === "guides" ? text.guides : text.news} ({items.length})
            </h2>
            <ul className="col-span-full divide-y divide-line border-y border-line">
              {items.map(({ article }) => (
                <li key={article.slug} className="flex flex-col gap-4 py-16 sm:flex-row sm:items-baseline sm:justify-between sm:gap-24">
                  <Link
                    href={localisedHref(`/${section}/${article.slug}/`, locale)}
                    className="short-marker text-c1 text-ink hover:text-brand-hover"
                  >
                    {t(article, "title", locale)}
                  </Link>
                  <time dateTime={article.publishedAt} className="flex-none text-c2 text-ink-secondary">
                    {formatNewsDate(article.publishedAt, locale)}
                  </time>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
