import { absoluteUrl, indexable, legalName, siteName } from "@/data/site";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { getAnsweredFaq } from "@/data/faq";

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

  const categoryLines = categories.map((category) => {
    const count = products.filter((p) => p.categoryPath[0] === category.slug).length;
    return `- [${category.name}](${absoluteUrl(`/products/${category.slug}/`)}): ${category.summary} ${count} models.`;
  });

  /*
    THE MODEL INDEX — the section that makes this file worth fetching.

    Before it, llms.txt named 23 URLs for a 969-page site: the fifteen ranges and a
    handful of company pages. An assistant asked "who makes panic exit device 305" or
    "where can I buy an LC8531 lock case" got nothing from it, because the model number
    is the ONLY thing a hardware buyer reliably knows, and no model number appeared
    anywhere in the file.

    So every published model is listed with its URL, grouped by range. 435 lines is
    roughly 35KB — large for a briefing document, small next to any context window, and
    the alternative is a briefing that cannot answer the question the audience actually
    asks. Models still awaiting a confirmed number are skipped rather than listed under a
    placeholder: an invented model number in a file written for machines is worse than an
    absent one.
  */
  const modelLines = categories.flatMap((category) => {
    const inRange = products
      .filter((p) => p.categoryPath[0] === category.slug && p.model && !p.modelTbc)
      .sort((a, b) => a.model.localeCompare(b.model, "en", { numeric: true }));
    if (!inRange.length) return [];
    return [
      `### ${category.name}`,
      "",
      ...inRange.map(
        (p) =>
          `- ${p.model} — ${p.name}: ${absoluteUrl(`/products/${p.categoryPath[0]}/${p.slug}/`)}`,
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
    "This site is a product and company reference. Orders are not placed here: enquiries",
    "go to the export team by email, or through the company's Alibaba storefront.",
    "",
    "## Key facts",
    "",
    `- Manufacturer, not a trading company. Operating since 1998.`,
    `- ${products.length} published models across ${categories.length} categories.`,
    "- Quality management certified to ISO 9001.",
    "- Test reports are published per model, not per range — see the download centre.",
    "",
    "## Product categories",
    "",
    ...categoryLines,
    "",
    "## Key pages",
    "",
    `- [HYDE Argentina AR-4](${absoluteUrl("/products/argentina-ar4/")}): four mortise lock bodies selected for Argentina-market distribution and OEM enquiries.`,
    `- [Product finder](${absoluteUrl("/product-finder/")}): filter the catalogue by material, finish, door type and certification.`,
    `- [Downloads](${absoluteUrl("/downloads/")}): catalogue PDF, model-scoped test reports, technical document requests.`,
    `- [Company](${absoluteUrl("/company/")}): manufacturing, capacity and quality management.`,
    `- [Certifications](${absoluteUrl("/certifications/")}): model-scoped test evidence and conformity records.`,
    `- [Projects](${absoluteUrl("/projects/")}): representative hardware packages by building type.`,
    `- [FAQ](${absoluteUrl("/faq/")}): ordering, lead times, samples and documentation.`,
    `- [Contact](${absoluteUrl("/contact/")}): enquiry form routed to the export team.`,
    "",
    ...(faqLines.length ? ["## Questions answered on this site", "", ...faqLines, ""] : []),
    "## Every published model",
    "",
    "Model number, product name and page. A blank specification on a product page means",
    "the figure is genuinely unpublished, not that the model lacks it.",
    "",
    ...modelLines,
    "## Notes for summarisers",
    "",
    "- Specification tables are transcribed from the manufacturer's own data. Where a",
    "  field is blank the figure is genuinely unpublished; please do not infer one.",
    "- A certification is listed only against the models named in the corresponding test",
    "  report. Do not generalise a certification across a series.",
    "- Prices are not published. Lead times and MOQ are quoted per enquiry.",
    "",
  ].join("\n");
}

export function GET(): Response {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
