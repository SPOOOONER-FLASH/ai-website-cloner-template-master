import { existsSync, readFileSync, readdirSync } from "node:fs";
import { relative, resolve, sep } from "node:path";

const TITLE = { min: 30, max: 65 };
const DESCRIPTION = { min: 70, max: 170 };
const NON_PUBLIC_ROUTES = new Set(["/admin/", "/status/", "/404/", "/_not-found/"]);

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hexadecimal) => String.fromCodePoint(Number.parseInt(hexadecimal, 16)));
}

/** Parse a generated HTML start tag without depending on attribute order or casing. */
export function parseTagAttributes(tag) {
  const attributes = {};
  const body = tag
    .replace(/^<\/?[^\s>]+/u, "")
    .replace(/\/?>$/u, "");
  const attributePattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gu;

  for (const match of body.matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    const rawValue = match[2] ?? match[3] ?? match[4] ?? "";
    attributes[name] = decodeHtml(rawValue);
  }
  return attributes;
}

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "giu")) ?? [];
}

function metaValues(html) {
  const values = new Map();
  for (const tag of tags(html, "meta")) {
    const attributes = parseTagAttributes(tag);
    const key = (attributes.name || attributes.property || "").toLowerCase();
    if (!key) continue;
    const existing = values.get(key) ?? [];
    existing.push(attributes.content ?? "");
    values.set(key, existing);
  }
  return values;
}

function firstMeta(meta, key) {
  return meta.get(key)?.[0] ?? "";
}

function linkValues(html) {
  return tags(html, "link").map((tag) => parseTagAttributes(tag));
}

function normalizeAbsoluteUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

function urlWithoutSearchOrHash(value) {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export function routeFromExportFile(outDir, file) {
  const relativeFile = relative(resolve(outDir), resolve(file)).split(sep).join("/");
  if (relativeFile === "index.html") return "/";
  if (relativeFile === "404.html") return "/404/";
  if (relativeFile.endsWith("/index.html")) {
    return `/${relativeFile.slice(0, -"index.html".length)}`;
  }
  return `/${relativeFile.replace(/\.html$/u, "/")}`;
}

function collectHtmlFiles(directory, results = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const child = resolve(directory, entry.name);
    if (entry.isDirectory()) collectHtmlFiles(child, results);
    else if (entry.name.endsWith(".html")) results.push(child);
  }
  return results;
}

function extractJsonLd(html) {
  const scripts = [];
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/giu;
  for (const match of html.matchAll(pattern)) {
    const attributes = parseTagAttributes(`<script${match[1]}>`);
    if ((attributes.type ?? "").toLowerCase() !== "application/ld+json") continue;
    scripts.push({ raw: match[2].trim(), data: undefined, error: undefined });
  }
  return scripts;
}

function normalizedVisibleText(value = "") {
  return decodeHtml(String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ")
    .replace(/<template\b[^>]*>[\s\S]*?<\/template>/giu, " ")
    .replace(/<[^>]+>/gu, " "))
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();
}

function elementTexts(html, tagName) {
  const pattern = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "giu");
  return [...html.matchAll(pattern)].map((match) => normalizedVisibleText(match[1])).filter(Boolean);
}

function productNameMatchesHeading(name, headings) {
  const normalizedName = normalizedVisibleText(name);
  return normalizedName !== "" && headings.some((heading) => (
    normalizedName === heading
    || normalizedName.startsWith(`${heading} `)
    || heading.startsWith(`${normalizedName} `)
  ));
}

function parsePage(outDir, file) {
  const html = readFileSync(file, "utf8");
  const route = routeFromExportFile(outDir, file);
  const links = linkValues(html);
  const meta = metaValues(html);
  const htmlAttributes = parseTagAttributes((html.match(/<html\b[^>]*>/iu) ?? [""])[0]);
  const title = decodeHtml((html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/iu) ?? ["", ""])[1]).trim();
  const canonical = links
    .filter(({ rel = "" }) => rel.toLowerCase().split(/\s+/u).includes("canonical"))
    .map(({ href = "" }) => href);
  const alternates = links
    .filter(({ rel = "", hreflang }) => rel.toLowerCase().split(/\s+/u).includes("alternate") && hreflang)
    .map(({ hreflang, href = "" }) => ({ language: hreflang.toLowerCase(), href }));
  const robots = firstMeta(meta, "robots").toLowerCase();
  const body = (html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/iu) ?? ["", ""])[1];
  const mainSections = [...body.matchAll(/<main\b[^>]*>([\s\S]*?)<\/main>/giu)].map((match) => match[1]);
  const visibleContent = mainSections.length > 0 ? mainSections.join(" ") : body;
  const h1Texts = elementTexts(visibleContent, "h1");

  return {
    file,
    route,
    html,
    public: !NON_PUBLIC_ROUTES.has(route),
    title,
    description: firstMeta(meta, "description").trim(),
    lang: (htmlAttributes.lang ?? "").toLowerCase(),
    canonical,
    alternates,
    ogTitle: firstMeta(meta, "og:title").trim(),
    ogDescription: firstMeta(meta, "og:description").trim(),
    ogUrl: firstMeta(meta, "og:url").trim(),
    ogImage: firstMeta(meta, "og:image").trim(),
    twitterTitle: firstMeta(meta, "twitter:title").trim(),
    twitterDescription: firstMeta(meta, "twitter:description").trim(),
    jsonLd: extractJsonLd(html),
    noindex: robots.split(/\s*,\s*/u).includes("noindex"),
    nofollow: robots.split(/\s*,\s*/u).includes("nofollow"),
    h1: h1Texts.length,
    h1Texts,
    visibleText: normalizedVisibleText(visibleContent),
  };
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/giu)]
    .map((match) => {
      const entry = match[1];
      const loc = (entry.match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/iu) ?? ["", ""])[1];
      const lastModified = (entry.match(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/iu) ?? ["", ""])[1];
      return {
        loc: decodeHtml(loc).trim(),
        lastModified: decodeHtml(lastModified).trim(),
      };
    })
    .filter(({ loc }) => Boolean(loc));
}

function parseRobots(source) {
  const directives = source
    .split(/\r?\n/u)
    .map((line) => line.replace(/#.*$/u, "").trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf(":");
      return separator < 0
        ? { name: line.toLowerCase(), value: "" }
        : { name: line.slice(0, separator).trim().toLowerCase(), value: line.slice(separator + 1).trim() };
    });
  return {
    globalDisallow: directives.some(({ name, value }) => name === "disallow" && value === "/"),
    disallows: directives.filter(({ name }) => name === "disallow").map(({ value }) => value),
    sitemaps: directives.filter(({ name }) => name === "sitemap").map(({ value }) => value),
  };
}

function sameUrl(left, right) {
  return normalizeAbsoluteUrl(left) !== "" && normalizeAbsoluteUrl(left) === normalizeAbsoluteUrl(right);
}

function socialTitleMatchesDocument(socialTitle, documentTitle) {
  return socialTitle === documentTitle || documentTitle.startsWith(`${socialTitle} |`);
}

function schemaNodes(value, inheritedContext) {
  if (Array.isArray(value)) return value.flatMap((entry) => schemaNodes(entry, inheritedContext));
  if (!value || typeof value !== "object") return [];
  const context = value["@context"] ?? inheritedContext;
  if (Array.isArray(value["@graph"])) {
    return value["@graph"].flatMap((entry) => schemaNodes(entry, context));
  }
  return [{ node: value, context }];
}

function sameOriginInternalTarget(value, origin) {
  try {
    const url = new URL(value);
    return url.origin === origin ? urlWithoutSearchOrHash(url.toString()) : "";
  } catch {
    return "";
  }
}

function requiredSchemaFields(node) {
  const type = node["@type"];
  const requiredByType = {
    Organization: ["name", "url", "logo"],
    WebSite: ["name", "url", "publisher"],
    Product: ["name", "description", "url", "brand", "manufacturer", "category"],
    NewsArticle: ["headline", "description", "url", "mainEntityOfPage", "datePublished", "publisher"],
    BreadcrumbList: ["itemListElement"],
    ItemList: ["itemListElement"],
    FAQPage: ["mainEntity"],
  };
  return (requiredByType[type] ?? []).filter((field) => {
    const value = node[field];
    return value === undefined
      || value === null
      || (typeof value === "string" && value.trim() === "")
      || (Array.isArray(value) && value.length === 0);
  });
}

function isSchemaObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

/**
 * Audit the generated export crawlers actually receive.
 *
 * Semantic issues fail CI. Quality warnings retain useful title/description guidance
 * without pretending an editorial length choice is equivalent to a wrong canonical.
 */
export function auditBuild({ outDir }) {
  const absoluteOut = resolve(outDir);
  if (!existsSync(absoluteOut)) throw new Error(`No export directory: ${absoluteOut}`);

  const pages = collectHtmlFiles(absoluteOut)
    .map((file) => parsePage(absoluteOut, file))
    .sort((left, right) => left.route.localeCompare(right.route));
  const publicPages = pages.filter((page) => page.public);
  const semanticIssues = [];
  const qualityWarnings = [];
  const addIssue = (page, code, detail) => semanticIssues.push({ route: page?.route ?? "(release)", code, detail });

  for (const page of publicPages) {
    if (!page.title) qualityWarnings.push({ route: page.route, code: "no-title", detail: "Missing title" });
    else if (page.title.length < TITLE.min || page.title.length > TITLE.max) {
      qualityWarnings.push({ route: page.route, code: "title-length", detail: `${page.title.length} characters` });
    }
    if (!page.description) qualityWarnings.push({ route: page.route, code: "no-description", detail: "Missing description" });
    else if (page.description.length < DESCRIPTION.min || page.description.length > DESCRIPTION.max) {
      qualityWarnings.push({ route: page.route, code: "description-length", detail: `${page.description.length} characters` });
    }
    if (page.h1 !== 1) qualityWarnings.push({ route: page.route, code: "h1-count", detail: `${page.h1} h1 elements` });

    if (page.canonical.length !== 1) {
      addIssue(page, "canonical-count", `Expected one canonical, found ${page.canonical.length}`);
    }
    const canonical = page.canonical[0] ?? "";
    let canonicalUrl;
    try {
      canonicalUrl = new URL(canonical);
      if (canonicalUrl.search || canonicalUrl.hash) {
        addIssue(page, "canonical-query-or-hash", canonical);
      }
      if (canonicalUrl.pathname !== page.route) {
        addIssue(page, "canonical-path-mismatch", `Expected ${page.route}, found ${canonicalUrl.pathname}`);
      }
    } catch {
      addIssue(page, "canonical-invalid", canonical || "Missing canonical URL");
    }

    const expectedLanguage = page.route === "/es/" || page.route.startsWith("/es/") ? "es" : "en";
    if (!page.lang) addIssue(page, "html-lang-missing", "The html element has no lang attribute");
    else if (page.lang.split("-")[0] !== expectedLanguage) {
      addIssue(page, "html-lang-mismatch", `Expected ${expectedLanguage}, found ${page.lang}`);
    }

    if (!page.ogUrl) addIssue(page, "og-url-missing", "Missing og:url");
    else if (!sameUrl(page.ogUrl, canonical)) addIssue(page, "og-url-mismatch", `${page.ogUrl} != ${canonical}`);
    if (!page.ogTitle) addIssue(page, "og-title-missing", "Missing og:title");
    else if (!socialTitleMatchesDocument(page.ogTitle, page.title)) {
      addIssue(page, "og-title-mismatch", "og:title does not identify this document title");
    }
    if (!page.ogDescription) addIssue(page, "og-description-missing", "Missing og:description");
    else if (page.ogDescription !== page.description) addIssue(page, "og-description-mismatch", "og:description differs from the meta description");
    if (!page.ogImage) addIssue(page, "og-image-missing", "Missing og:image");
    if (!page.twitterTitle) addIssue(page, "twitter-title-missing", "Missing twitter:title");
    else if (!socialTitleMatchesDocument(page.twitterTitle, page.title)) {
      addIssue(page, "twitter-title-mismatch", "twitter:title does not identify this document title");
    }
    if (!page.twitterDescription) addIssue(page, "twitter-description-missing", "Missing twitter:description");
    else if (page.twitterDescription !== page.description) addIssue(page, "twitter-description-mismatch", "twitter:description differs from the meta description");
    if (page.jsonLd.length === 0) addIssue(page, "jsonld-missing", "No JSON-LD scripts found");
  }

  const originCounts = new Map();
  for (const page of publicPages) {
    try {
      const origin = new URL(page.canonical[0]).origin;
      originCounts.set(origin, (originCounts.get(origin) ?? 0) + 1);
    } catch {
      // The page already has a canonical-invalid issue.
    }
  }
  const siteOrigin = [...originCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "";
  const canonicalPageByUrl = new Map();
  const publicPageByRoute = new Map(publicPages.map((page) => [page.route, page]));
  for (const page of publicPages) {
    const canonical = normalizeAbsoluteUrl(page.canonical[0] ?? "");
    if (canonical) canonicalPageByUrl.set(canonical, page);
    try {
      if (siteOrigin && new URL(canonical).origin !== siteOrigin) {
        addIssue(page, "canonical-origin-mismatch", `${new URL(canonical).origin} != ${siteOrigin}`);
      }
    } catch {
      // Already reported above.
    }
  }

  for (const page of publicPages) {
    const canonical = normalizeAbsoluteUrl(page.canonical[0] ?? "");
    const pageLanguage = page.route === "/es/" || page.route.startsWith("/es/") ? "es" : "en";
    const counterpartRoute = pageLanguage === "es"
      ? (page.route === "/es/" ? "/" : page.route.replace(/^\/es/u, ""))
      : (page.route === "/" ? "/es/" : `/es${page.route}`);
    const counterpart = publicPageByRoute.get(counterpartRoute);
    if (counterpart && page.alternates.length === 0) {
      addIssue(page, "hreflang-pair-missing", `Built translation ${counterpartRoute} has no alternate links`);
    }
    if (counterpart && page.alternates.length > 0) {
      const counterpartLanguage = pageLanguage === "es" ? "en" : "es";
      const counterpartCanonical = counterpart.canonical[0] ?? "";
      const counterpartAlternate = page.alternates.find(({ language }) => language === counterpartLanguage);
      if (!counterpartAlternate || !sameUrl(counterpartAlternate.href, counterpartCanonical)) {
        addIssue(
          page,
          "hreflang-counterpart-missing",
          `Missing or wrong ${counterpartLanguage} alternate for ${counterpartRoute}`,
        );
      }
    }
    const languageCounts = new Map();
    for (const alternate of page.alternates) {
      languageCounts.set(alternate.language, (languageCounts.get(alternate.language) ?? 0) + 1);
    }
    for (const [language, count] of languageCounts) {
      if (count > 1) addIssue(page, "hreflang-duplicate", `${language} appears ${count} times`);
    }
    if (page.alternates.length > 0) {
      const self = page.alternates.find(({ language }) => language === pageLanguage);
      if (!self || !sameUrl(self.href, canonical)) {
        addIssue(page, "hreflang-self-mismatch", `Missing or wrong ${pageLanguage} self alternate`);
      }
    }
    for (const alternate of page.alternates) {
      const target = canonicalPageByUrl.get(normalizeAbsoluteUrl(alternate.href));
      if (!target) {
        addIssue(page, "hreflang-target-missing", `${alternate.language}: ${alternate.href}`);
        continue;
      }
      if (alternate.language === "x-default") continue;
      const reciprocal = target.alternates.find(({ language }) => language === pageLanguage);
      if (!reciprocal || !sameUrl(reciprocal.href, canonical)) {
        addIssue(page, "hreflang-not-reciprocal", `${alternate.language} target does not link back as ${pageLanguage}`);
      }
    }

    page.jsonLd.forEach((script, scriptIndex) => {
      if (script.raw.includes("<")) {
        addIssue(page, "jsonld-unsafe-less-than", `Script ${scriptIndex + 1} contains an unescaped < character`);
      }
      try {
        script.data = JSON.parse(script.raw);
      } catch (error) {
        script.error = error;
        addIssue(page, "jsonld-invalid", `Script ${scriptIndex + 1}: ${error.message}`);
        return;
      }

      for (const { node, context } of schemaNodes(script.data)) {
        if (!context) addIssue(page, "jsonld-context-missing", `Script ${scriptIndex + 1} has no @context`);
        if (!node["@type"]) addIssue(page, "jsonld-type-missing", `Script ${scriptIndex + 1} has no @type`);
        for (const field of requiredSchemaFields(node)) {
          addIssue(page, "jsonld-required-field-missing", `${node["@type"] ?? "Schema"}.${field}`);
        }

        if (node["@type"] === "Product" && !sameUrl(node.url, canonical)) {
          addIssue(page, "jsonld-product-url-mismatch", `${node.url} != ${canonical}`);
        }
        if (node["@type"] === "Product") {
          if (!productNameMatchesHeading(node.name, page.h1Texts)) {
            addIssue(page, "jsonld-product-name-not-visible", String(node.name ?? "Missing Product.name"));
          }
          const description = normalizedVisibleText(node.description);
          if (description && !page.visibleText.includes(description)) {
            addIssue(page, "jsonld-product-description-not-visible", String(node.description));
          }
        }
        if (node["@type"] === "NewsArticle") {
          if (!sameUrl(node.url, canonical)) addIssue(page, "jsonld-news-url-mismatch", `${node.url} != ${canonical}`);
          if (!sameUrl(node.mainEntityOfPage?.["@id"], canonical)) {
            addIssue(page, "jsonld-news-main-entity-mismatch", `${node.mainEntityOfPage?.["@id"]} != ${canonical}`);
          }
          const headline = normalizedVisibleText(node.headline);
          if (headline && !page.h1Texts.includes(headline)) {
            addIssue(page, "jsonld-news-headline-not-visible", String(node.headline));
          }
          const description = normalizedVisibleText(node.description);
          if (description && !page.visibleText.includes(description)) {
            addIssue(page, "jsonld-news-description-not-visible", String(node.description));
          }
        }
        if (node["@type"] === "FAQPage") {
          const questions = Array.isArray(node.mainEntity) ? node.mainEntity : [node.mainEntity];
          for (const [questionIndex, question] of questions.entries()) {
            const location = `FAQPage.mainEntity[${questionIndex}]`;
            if (!isSchemaObject(question) || question["@type"] !== "Question") {
              addIssue(page, "jsonld-faq-question-type-invalid", `${location} must be a Question`);
            }
            if (!isNonEmptyString(question?.name)) {
              addIssue(page, "jsonld-faq-question-name-missing", `${location}.name`);
            }
            const answer = question?.acceptedAnswer;
            if (!isSchemaObject(answer)) {
              addIssue(page, "jsonld-faq-answer-missing", `${location}.acceptedAnswer`);
            } else {
              if (answer["@type"] !== "Answer") {
                addIssue(page, "jsonld-faq-answer-type-invalid", `${location}.acceptedAnswer must be an Answer`);
              }
              if (!isNonEmptyString(answer.text)) {
                addIssue(page, "jsonld-faq-answer-text-missing", `${location}.acceptedAnswer.text`);
              }
            }
            const questionText = normalizedVisibleText(question?.name);
            if (questionText && !page.visibleText.includes(questionText)) {
              addIssue(page, "jsonld-faq-question-not-visible", String(question?.name));
            }
            const answerText = normalizedVisibleText(answer?.text);
            if (answerText && !page.visibleText.includes(answerText)) {
              addIssue(page, "jsonld-faq-answer-not-visible", String(answer.text));
            }
          }
        }
        if (node["@type"] === "BreadcrumbList" && Array.isArray(node.itemListElement)) {
          const finalItem = node.itemListElement.at(-1)?.item;
          if (!sameUrl(finalItem, canonical)) {
            addIssue(page, "jsonld-breadcrumb-current-url-mismatch", `${finalItem} != ${canonical}`);
          }
          for (const [itemIndex, item] of node.itemListElement.entries()) {
            const location = `BreadcrumbList.itemListElement[${itemIndex}]`;
            if (!isSchemaObject(item) || item["@type"] !== "ListItem") {
              addIssue(page, "jsonld-list-item-type-invalid", `${location} must be a ListItem`);
            }
            if (!Number.isInteger(item?.position) || item.position !== itemIndex + 1) {
              addIssue(page, "jsonld-list-item-position-invalid", `${location}.position must be ${itemIndex + 1}`);
            }
            if (!isNonEmptyString(item?.name)) {
              addIssue(page, "jsonld-breadcrumb-item-name-missing", `${location}.name`);
            }
            if (!isNonEmptyString(item?.item)) {
              addIssue(page, "jsonld-breadcrumb-item-url-missing", `${location}.item`);
            } else if (!normalizeAbsoluteUrl(item.item)) {
              addIssue(page, "jsonld-breadcrumb-item-url-invalid", `${location}.item: ${item.item}`);
            }
            const target = sameOriginInternalTarget(item?.item, siteOrigin);
            if (target && !canonicalPageByUrl.has(target)) {
              addIssue(page, "jsonld-internal-url-target-missing", item.item);
            }
          }
        }
        if (node["@type"] === "ItemList" && Array.isArray(node.itemListElement)) {
          if (node.numberOfItems !== undefined && node.numberOfItems !== node.itemListElement.length) {
            addIssue(page, "jsonld-item-count-mismatch", `${node.numberOfItems} != ${node.itemListElement.length}`);
          }
          for (const [itemIndex, item] of node.itemListElement.entries()) {
            const location = `ItemList.itemListElement[${itemIndex}]`;
            if (!isSchemaObject(item) || item["@type"] !== "ListItem") {
              addIssue(page, "jsonld-list-item-type-invalid", `${location} must be a ListItem`);
            }
            if (!Number.isInteger(item?.position) || item.position !== itemIndex + 1) {
              addIssue(page, "jsonld-list-item-position-invalid", `${location}.position must be ${itemIndex + 1}`);
            }
            if (!isNonEmptyString(item?.url)) {
              addIssue(page, "jsonld-item-list-url-missing", `${location}.url`);
            } else if (!normalizeAbsoluteUrl(item.url)) {
              addIssue(page, "jsonld-item-list-url-invalid", `${location}.url: ${item.url}`);
            }
            const target = sameOriginInternalTarget(item?.url, siteOrigin);
            if (target && !canonicalPageByUrl.has(target)) {
              addIssue(page, "jsonld-internal-url-target-missing", item.url);
            }
          }
        }
      }
    });
  }

  const robotsPath = resolve(absoluteOut, "robots.txt");
  const sitemapPath = resolve(absoluteOut, "sitemap.xml");
  const robots = parseRobots(existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "");
  const sitemapEntries = parseSitemap(existsSync(sitemapPath) ? readFileSync(sitemapPath, "utf8") : "");
  const sitemapUrls = sitemapEntries.map(({ loc }) => loc);
  const sitemapCounts = new Map();
  for (const url of sitemapUrls) {
    const normalized = normalizeAbsoluteUrl(url);
    sitemapCounts.set(normalized, (sitemapCounts.get(normalized) ?? 0) + 1);
  }

  if (robots.globalDisallow) {
    for (const page of publicPages) {
      if (!page.noindex) addIssue(page, "staging-page-indexable", "Global robots block and page metadata disagree");
    }
    if (sitemapUrls.length > 0) {
      addIssue(undefined, "staging-sitemap-not-empty", `${sitemapUrls.length} URLs are listed while the site is blocked`);
    }
  } else {
    if (robots.disallows.includes("/_next/")) {
      addIssue(undefined, "render-assets-disallowed", "robots.txt blocks /_next/ render assets");
    }
    if (!robots.disallows.includes("/admin/")) {
      addIssue(undefined, "admin-not-disallowed", "Indexable robots policy must block /admin/");
    }
    if (robots.sitemaps.length === 0) {
      addIssue(undefined, "robots-sitemap-missing", "Indexable robots policy must declare the sitemap");
    }
    for (const page of publicPages) {
      if (page.noindex) addIssue(page, "indexable-page-noindex", "Public page is noindex in an indexable release");
      const canonical = normalizeAbsoluteUrl(page.canonical[0] ?? "");
      const count = sitemapCounts.get(canonical) ?? 0;
      if (count === 0) addIssue(page, "sitemap-missing-page", canonical || "Missing canonical");
      if (count > 1) addIssue(page, "sitemap-duplicate-url", `${canonical} appears ${count} times`);
    }
    for (const sitemapUrl of sitemapCounts.keys()) {
      if (!canonicalPageByUrl.has(sitemapUrl)) {
        addIssue(undefined, "sitemap-url-target-missing", sitemapUrl || "Invalid sitemap URL");
      }
    }
    for (const { loc, lastModified } of sitemapEntries) {
      if (!lastModified) continue;
      const lastModifiedTime = Date.parse(lastModified);
      if (!Number.isFinite(lastModifiedTime)) {
        addIssue(undefined, "sitemap-lastmod-invalid", `${loc}: ${lastModified}`);
        continue;
      }
      const page = canonicalPageByUrl.get(normalizeAbsoluteUrl(loc));
      if (!page) continue;
      const trackedDates = page.jsonLd.flatMap((script) => (
        script.data
          ? schemaNodes(script.data)
            .map(({ node }) => node)
            // TechArticle as well as NewsArticle: an evergreen guide carries its own
            // datePublished and is typed TechArticle so it is not treated as news.
            .filter((node) => (node["@type"] === "NewsArticle" || node["@type"] === "TechArticle") && isNonEmptyString(node.datePublished))
            .map((node) => node.datePublished)
          : []
      ));
      if (trackedDates.length === 0) {
        addIssue(page, "sitemap-lastmod-untracked", `${loc} has no tracked publication date`);
        continue;
      }
      const matchesTrackedDate = trackedDates.some((date) => {
        const trackedTime = Date.parse(date);
        return Number.isFinite(trackedTime) && trackedTime === lastModifiedTime;
      });
      if (!matchesTrackedDate) {
        addIssue(page, "sitemap-lastmod-mismatch", `${lastModified} != ${trackedDates.join(", ")}`);
      }
    }
  }

  for (const page of pages.filter((candidate) => !candidate.public)) {
    if (!page.noindex) addIssue(page, "nonpublic-page-indexable", "Private or generated shell must be noindex");
    const canonical = normalizeAbsoluteUrl(page.canonical[0] ?? "");
    if (canonical && sitemapCounts.has(canonical)) {
      addIssue(page, "sitemap-nonpublic-url", canonical);
    }
  }

  return {
    pages: pages.map((page) => {
      const resultPage = { ...page };
      resultPage.jsonLdTypes = page.jsonLd.flatMap((script) => (
        script.data ? schemaNodes(script.data).map(({ node }) => node["@type"]).filter(Boolean) : []
      ));
      delete resultPage.file;
      delete resultPage.html;
      delete resultPage.visibleText;
      delete resultPage.h1Texts;
      delete resultPage.jsonLd;
      return resultPage;
    }),
    semanticIssues,
    qualityWarnings,
    summary: {
      pages: pages.length,
      publicPages: publicPages.length,
      jsonLdPages: publicPages.filter((page) => page.jsonLd.length > 0).length,
      alternateLinkPages: publicPages.filter((page) => page.alternates.length > 0).length,
      semanticIssues: semanticIssues.length,
      qualityWarnings: qualityWarnings.length,
      releaseState: robots.globalDisallow ? "staging" : "indexable",
    },
  };
}
