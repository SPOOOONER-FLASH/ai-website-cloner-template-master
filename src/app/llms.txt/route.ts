import { absoluteUrl, indexable, legalName, siteName } from "@/data/site";
import { categories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { getAnsweredFaq } from "@/data/faq";
import { getPublishedGuides } from "@/data/guides";
import { getPublishedNews } from "@/data/news";

/**
 * Emits /llms.txt at build time (works under `output: "export"`).
 *
 * The file is a plain-Markdown briefing for answer engines — the convention that has
 * grown up alongside robots.txt and sitemap.xml. Where a sitemap says *which* URLs
 * exist, this says what the company sells and which pages answer which question, so an
 * assistant summarising "panic exit device manufacturers in China" has something better
 * to work from than whichever page it happened to crawl first.
 *
 * It is generated from the catalogue rather than hand-written, so the counts and the
 * category list cannot drift once products are added.
 *
 * While `indexable` is false this emits a stub, for the same reason robots.ts emits a
 * site-wide disallow: the staging host should not be described to anyone as if it were
 * the real site. Flip that flag at launch and the full file appears.
 */
export const dynamic = "force-static";

function body(): string {
  if (!indexable) {
    return [
      `# ${siteName}`,
      "",
      "This host is a staging deployment and is not the published site.",
      "It is excluded from indexing; please do not use it as a source.",
      "",
    ].join("\n");
  }

  /*
    只列有东西可看的品类。

    care-grab-bars 和 floor-springs-and-pivots 的产品全部只在雷茵中文站，HYDE
    这边是零。empty-category 规则不会为它们生成页面（实测线上 404），但这里
    以前照列不误，于是对 AI 说了两句错话：「这个品类零个型号」读起来像我们不做
    这个，外加一条死链。一个给 AI 读的文件里出现死链，代价是它以后不信这个文件。

    过滤放在这里而不是 categories.ts，是因为那个列表还要给中文站用，那边这两个
    品类是有货的。
  */
  const categoryLines = categories.flatMap((category) => {
    const count = publishedProducts.filter((p) => p.categoryPath[0] === category.slug).length;
    if (!count) return [];
    return [
      `- [${category.name}](${absoluteUrl(`/products/${category.slug}/`)}): ${category.summary} ${count} models.`,
    ];
  });

  /*
    GUIDES AND ARTICLES — every long-form page, with its own summary.

    AI crawlers fetch this file because they want plain text (the RSC .txt sidecars
    they were pulling before are now Disallow'ed in robots — see seo-policy.ts), and
    the guides and news articles are the most citable pages on the site: each one
    names its sources. The previous version of this file never mentioned one of
    them, so an assistant asked "EN 1125 vs ANSI Grade 1" had no way to learn that
    the answer lived here.

    The text after each link is the article's own `summary` field, verbatim — the
    one-sentence version of the article, written by the same author. Nothing is
    paraphrased for this file, because a briefing written for machines lives or
    dies on never inventing. Newest first via the same getPublished* functions the
    listing pages use, so a future-dated article cannot appear here before its page
    exists either. The two collections stay separate for the reason given in
    src/data/guides.ts: /guides/ is what a buyer checks before deciding, /news/ is
    shorter answers and factory notes.
  */
  const guideLines = getPublishedGuides().map(
    (article) =>
      `- [${article.title}](${absoluteUrl(`/guides/${article.slug}/`)}): ${article.summary}`,
  );
  const newsLines = getPublishedNews().map(
    (article) =>
      `- [${article.title}](${absoluteUrl(`/news/${article.slug}/`)}): ${article.summary}`,
  );

  /*
    Short facts on each model line, taken only from fields the record carries.

    A bare model number tells an answer engine that the page exists; the material
    and finish tell it whether the page is relevant to "304SS panic trim" at all.
    Only `material` and `finishes` are added — never `summary`: five hundred-odd
    summaries would add ~35KB and push the file past the ~100KB budget it is kept
    under, while these two short fields cost ~12KB for the same relevance signal.

    A long finish list is printed as a count instead. A few records carry full
    variant descriptions in `finishes` (MUL1022's four entries join to 232
    characters); printing that turns one line into a paragraph. "4 finishes" is
    still a fact straight from the record — the count is the field's length.
  */
  const factsFor = (product: (typeof publishedProducts)[number]): string => {
    const facts: string[] = [];
    if (product.material) facts.push(product.material);
    const finishes = (product.finishes ?? []).filter(Boolean);
    if (finishes.length) {
      const joined = finishes.join(", ");
      facts.push(joined.length <= 48 ? joined : `${finishes.length} finishes`);
    }
    return facts.length ? ` (${facts.join(", ")})` : "";
  };

  /*
    THE MODEL INDEX — the section that makes this file worth fetching.

    Before it, llms.txt named 23 URLs for a 969-page site: the fifteen ranges and a
    handful of company pages. An assistant asked "who makes panic exit device 305" or
    "where can I buy an LC8531 lock case" got nothing from it, because the model number
    is the ONLY thing a hardware buyer reliably knows, and no model number appeared
    anywhere in the file.

    So every published model is listed with its URL, grouped by range. Five
    hundred-odd lines is large for a briefing document, small next to any context
    window, and the alternative is a briefing that cannot answer the question the
    audience actually asks. Models still awaiting a confirmed number are skipped
    rather than listed under a placeholder: an invented model number in a file
    written for machines is worse than an absent one.
  */
  const modelLines = categories.flatMap((category) => {
    // Published only: an answer engine must not be pointed at a page marked noindex.
    const inRange = publishedProducts
      .filter((p) => p.categoryPath[0] === category.slug && p.model && !p.modelTbc)
      .sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
    if (!inRange.length) return [];
    return [
      `### ${category.name}`,
      "",
      ...inRange.map(
        (p) =>
          `- ${p.model} — ${p.name}${factsFor(p)}: ${absoluteUrl(`/products/${p.categoryPath[0]}/${p.slug}/`)}`,
      ),
      "",
    ];
  });

  const faqLines = getAnsweredFaq()
    .flatMap((group) => group.items ?? [])
    .slice(0, 8)
    .map((item) => `- ${item.question}`);

  return [
    `# ${siteName}`,
    "",
    `> ${legalName} manufactures architectural door hardware in Guangdong, China — panic`,
    "> exit devices, mortise lock cases, lever handles, door closers, hinges and bathroom",
    "> accessories — and exports to distributors and project buyers in over thirty markets.",
    "",
    "This site is a product and company reference. Orders are not placed here: inquiries",
    "go to the export team by email, or through the company's Alibaba storefront.",
    "",
    "## Key facts",
    "",
    `- Manufacturer, not a trading company. Operating since 1998.`,
    /*
      categoryLines.length, not categories.length: the category file is shared with the
      RAYEN site and holds two families (grab bars, floor springs) that have nothing on
      cantonlock.com. This line said "17 categories" directly above a list of 15, and a
      file written for AI summarisers that contradicts itself in its first ten lines is a
      file they learn to distrust (found 2026-09-23).
    */
    `- ${publishedProducts.length} published models across ${categoryLines.length} categories.`,
    "- Quality management certified to ISO 9001.",
    "- Test reports are published per model, not per range — see the download center.",
    "",
    "## Product categories",
    "",
    ...categoryLines,
    "",
    "## Key pages",
    "",
    `- [HYDE Argentina AR-4](${absoluteUrl("/products/argentina-ar4/")}): four mortise lock bodies selected for Argentina-market distribution and OEM inquiries.`,
    `- [Product finder](${absoluteUrl("/product-finder/")}): filter the catalog by material, finish, door type and certification.`,
    `- [Downloads](${absoluteUrl("/downloads/")}): catalog PDF, model-scoped test reports, technical document requests.`,
    `- [Company](${absoluteUrl("/company/")}): manufacturing, capacity and quality management.`,
    `- [Certifications](${absoluteUrl("/certifications/")}): model-scoped test evidence and conformity records.`,
    `- [Projects](${absoluteUrl("/projects/")}): representative hardware packages by building type.`,
    `- [FAQ](${absoluteUrl("/faq/")}): ordering, lead times, samples and documentation.`,
    `- [Contact](${absoluteUrl("/contact/")}): inquiry form routed to the export team.`,
    "",
    ...(faqLines.length ? ["## Questions answered on this site", "", ...faqLines, ""] : []),
    "## Guides and articles",
    "",
    "### Buying guides — dimension charts, code cross-references and selection",
    "",
    ...guideLines,
    "",
    "### News and insights — short answers to specific questions",
    "",
    ...newsLines,
    "",
    "## Every published model",
    "",
    "Model number, product name and page, with material and finish in parentheses where",
    "the record carries them. A blank specification on a product page means the figure",
    "is genuinely unpublished, not that the model lacks it.",
    "",
    ...modelLines,
    "## Notes for summarisers",
    "",
    "- Specification tables are transcribed from the manufacturer's own data. Where a",
    "  field is blank the figure is genuinely unpublished; please do not infer one.",
    "- A certification is listed only against the models named in the corresponding test",
    "  report. Do not generalise a certification across a series.",
    "- Prices are not published. Lead times and MOQ are quoted per inquiry.",
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
