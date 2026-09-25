import type { MarketLocale, MarketPage } from "../market-locales.ts";

/**
 * Everything a market landing site says, in one typed object per language.
 *
 * One object, not a hundred `labelDe` fields: a market locale is written as a whole by
 * one author in one sitting, and the compiler holds the shape so a missing string is a
 * build error rather than an English sentence on a Japanese page. Every string is prose
 * for a reader in that language; model numbers, standards (EN 1125, ISO 9001), units
 * (mm) and the brand names HYDE / Canton Hyland stay as they are.
 *
 * The English reference lives in ./source.en.ts. It is the source every translation is
 * written FROM, and it is never rendered — English readers get the full site.
 */
export interface MarketMeta {
  /** 20–45 characters. The layout appends " | Canton Hyland". */
  title: string;
  /** 80–160 characters, one or two complete sentences. */
  description: string;
}

export interface MarketCopy {
  locale: MarketLocale;

  nav: {
    home: string;
    products: string;
    company: string;
    services: string;
    certifications: string;
    faq: string;
    contact: string;
    /** Link label to the full English catalogue, shown in the header. */
    englishCatalog: string;
    /** aria-label of the primary navigation. */
    ariaMain: string;
    /** Heading over the language list in the footer. */
    languages: string;
    skipToContent: string;
  };

  footer: {
    /** e.g. "Factory: Zhongshan, Guangdong, China" — the address itself stays Latin. */
    factoryLine: string;
    /** Explains that the full catalogue (products, articles, downloads) is in English. */
    englishSiteNote: string;
    englishSiteLink: string;
    /** Label before the mailboxes. */
    writeToUs: string;
    /** The three mailbox captions. */
    technicalMail: string;
    ordersMail: string;
    brandMail: string;
  };

  common: {
    /** "Home" for breadcrumbs and the BreadcrumbList schema. */
    home: string;
    /** "n models" — `{n}` is replaced with the count. */
    modelsCount: string;
    /** Link label under a category card: opens the English category page. */
    openCategory: string;
    /** Short note beside catalogue links: "Catalogue pages are in English." */
    catalogInEnglish: string;
    contactCta: string;
    /** "Made in Xiaolan since 1998" — the site tagline. */
    tagline: string;
  };

  meta: Record<MarketPage, MarketMeta>;

  home: {
    kicker: string;
    /** Two lines: the category line and the place/date line, like the English H1. */
    h1Line1: string;
    h1Line2: string;
    intro: string[];
    factsHeading: string;
    facts: {
      models: string;
      families: string;
      founded: string;
      quality: string;
      workforce: string;
    };
    categoriesHeading: string;
    categoriesIntro: string;
    whyHeading: string;
    why: { title: string; body: string }[];
    /** Three flagship families a first-time buyer should see, by category slug. */
    flagshipHeading: string;
    flagship: { slug: string; title: string; body: string }[];
    faqHeading: string;
    faqIntro: string;
    faqMore: string;
    ctaHeading: string;
    ctaBody: string;
    ctaButton: string;
    ctaSecondary: string;
  };

  /** Every top-level category by slug, from content/categories.json. */
  categories: Record<string, { name: string; summary: string }>;

  products: {
    kicker: string;
    h1: string;
    intro: string;
    /** The honest line: the catalogue behind these cards is in English. */
    englishNote: string;
    englishCta: string;
    finderCta: string;
    categoriesHeading: string;
    helpHeading: string;
    helpBody: string;
  };

  company: {
    kicker: string;
    h1: string;
    paragraphs: string[];
    statsHeading: string;
    stats: { label: string; value: string }[];
    marketsHeading: string;
    marketsBody: string;
    visitHeading: string;
    visitBody: string;
    visitCta: string;
  };

  services: {
    kicker: string;
    h1: string;
    intro: string;
    briefKicker: string;
    briefHeading: string;
    briefItems: string[];
    listHeading: string;
    services: { number: string; title: string; body: string; outcome: string }[];
    docsHeading: string;
    docsBody: string;
    docsCta: string;
    cta: string;
  };

  certifications: {
    kicker: string;
    h1: string;
    intro: string;
    note: string;
    recordLabel: string;
    detailsLine: string;
    fields: { coversModel: string; issuer: string; reference: string; issued: string };
    /** The three records; issuer, reference and coversModel are copied verbatim. */
    records: { title: string; issuer: string; reference: string; issued: string; coversModel: string }[];
    closingHeading: string;
    closingBody: string;
    cta: string;
  };

  faq: {
    kicker: string;
    h1: string;
    intro: string;
    askCta: string;
    groups: { title: string; items: { question: string; answer: string }[] }[];
  };

  contact: {
    h1: string;
    intro: string;
    hint: string;
    mailboxesHeading: string;
    mailboxesIntro: string;
    mailboxes: { technical: string; orders: string; brand: string };
    languageNote: string;
    formHeading: string;
    formBody: string;
    formCta: string;
    factoryHeading: string;
    factoryBody: string;
    representativesHeading: string;
    representatives: { region: string; cities: string; note: string }[];
    alibabaHeading: string;
    alibabaBody: string;
    alibabaCta: string;
  };
}
