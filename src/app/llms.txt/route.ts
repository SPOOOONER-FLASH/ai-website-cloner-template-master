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
    `- [Product finder](${absoluteUrl("/product-finder/")}): filter the catalogue by material, finish, door type and certification.`,
    `- [Downloads](${absoluteUrl("/downloads/")}): catalogue PDF, model-scoped test reports, technical document requests.`,
    `- [Company](${absoluteUrl("/company/")}): manufacturing, capacity and quality management.`,
    `- [Projects](${absoluteUrl("/projects/")}): representative hardware packages by building type.`,
    `- [FAQ](${absoluteUrl("/faq/")}): ordering, lead times, samples and documentation.`,
    `- [Contact](${absoluteUrl("/contact/")}): enquiry form routed to the export team.`,
    "",
    ...(faqLines.length ? ["## Questions answered on this site", "", ...faqLines, ""] : []),
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
