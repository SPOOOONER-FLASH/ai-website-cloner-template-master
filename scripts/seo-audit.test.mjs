import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { auditBuild } from "./lib/seo-audit.mjs";

const ORIGIN = "https://example.test";

function writeFile(root, relativePath, contents) {
  const target = join(root, relativePath);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
}

function publicDocument({
  route,
  lang,
  alternates = [],
  canonical = `${ORIGIN}${route}`,
  ogUrl = canonical,
  jsonLd = [],
  noindex = true,
  heading,
  visibleText = "",
  title: suppliedTitle,
  description: suppliedDescription,
}) {
  const title = suppliedTitle
    ?? (lang === "es" ? "Herrajes arquitectónicos para proyectos" : "Architectural hardware for projects");
  const visibleHeading = heading ?? title;
  const description = suppliedDescription
    ?? (lang === "es"
      ? "Herrajes arquitectónicos documentados para entradas, rutas de evacuación y programas de puertas comerciales."
      : "Documented architectural hardware for entrances, egress routes, and commercial door schedules.");
  const links = alternates
    .map(({ language, href }, index) => index % 2
      ? `<link hrefLang="${language}" href="${href}" rel="alternate">`
      : `<link href="${href}" rel="alternate" hreflang="${language}">`)
    .join("");
  const scripts = jsonLd
    .map((payload) => `<script type="application/ld+json">${typeof payload === "string" ? payload : JSON.stringify(payload)}</script>`)
    .join("");

  return `<!doctype html><html lang="${lang}"><head>
    <title>${title}</title>
    <meta content="${description}" name="description">
    ${noindex ? '<meta content="noindex,nofollow" name="robots">' : ""}
    <link href="${canonical}" rel="canonical">
    ${links}
    <meta content="${title}" property="og:title">
    <meta property="og:description" content="${description}">
    <meta content="${ogUrl}" property="og:url">
    <meta content="${ORIGIN}/card.png" property="og:image">
    <meta content="${title}" name="twitter:title">
    <meta name="twitter:description" content="${description}">
    ${scripts}
  </head><body><main><h1>${visibleHeading}</h1><p>${visibleText}</p></main>
    <a href="${lang === "es" ? "/" : "/es/"}" hrefLang="${lang === "es" ? "en" : "es"}">Language switch</a>
  </body></html>`;
}

function globalSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${ORIGIN}/#organization`,
      name: "Example Hardware",
      url: `${ORIGIN}/`,
      logo: `${ORIGIN}/logo.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      name: "Example Hardware",
      url: `${ORIGIN}/`,
      publisher: { "@id": `${ORIGIN}/#organization` },
    },
  ];
}

function writeValidStagingFixture(root, mutate = () => {}) {
  const state = {
    home: {
      route: "/",
      lang: "en",
      alternates: [
        { language: "en", href: `${ORIGIN}/` },
        { language: "es", href: `${ORIGIN}/es/` },
        { language: "x-default", href: `${ORIGIN}/` },
      ],
      jsonLd: globalSchemas(),
    },
    spanish: {
      route: "/es/",
      lang: "es",
      alternates: [
        { language: "en", href: `${ORIGIN}/` },
        { language: "es", href: `${ORIGIN}/es/` },
        { language: "x-default", href: `${ORIGIN}/` },
      ],
      jsonLd: globalSchemas(),
    },
    product: {
      route: "/products/lock/",
      lang: "en",
      heading: "Mortise Lock",
      visibleText: "Commercial mortise lock case.",
      jsonLd: [
        ...globalSchemas(),
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Mortise Lock 100",
          description: "Commercial mortise lock case.",
          url: `${ORIGIN}/products/lock/`,
          brand: { "@type": "Brand", name: "Example Hardware" },
          manufacturer: { "@id": `${ORIGIN}/#organization` },
          category: "Lock cases",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
            { "@type": "ListItem", position: 2, name: "Lock", item: `${ORIGIN}/products/lock/` },
          ],
        },
      ],
    },
    news: {
      route: "/news/door-hardware-guide/",
      lang: "en",
      heading: "Door Hardware Guide",
      visibleText: "A documented guide to commercial door hardware.",
      jsonLd: [
        ...globalSchemas(),
        {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: "Door Hardware Guide",
          description: "A documented guide to commercial door hardware.",
          url: `${ORIGIN}/news/door-hardware-guide/`,
          mainEntityOfPage: { "@type": "WebPage", "@id": `${ORIGIN}/news/door-hardware-guide/` },
          datePublished: "2026-08-20",
          publisher: { "@id": `${ORIGIN}/#organization` },
        },
      ],
    },
    robots: "User-Agent: *\nDisallow: /\n",
    sitemap: '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
  };

  mutate(state);
  writeFile(root, "index.html", publicDocument(state.home));
  writeFile(root, "es/index.html", publicDocument(state.spanish));
  writeFile(root, "products/lock/index.html", publicDocument(state.product));
  writeFile(root, "news/door-hardware-guide/index.html", publicDocument(state.news));
  writeFile(root, "admin/index.html", '<!doctype html><html lang="zh-CN"><head><meta name="robots" content="noindex,nofollow"></head><body>CMS</body></html>');
  writeFile(root, "status/index.html", '<!doctype html><html lang="en"><head><meta name="robots" content="noindex,nofollow"></head><body><h1>Status</h1></body></html>');
  writeFile(root, "404.html", '<!doctype html><html lang="en"><head><meta name="robots" content="noindex"></head><body><h1>404</h1></body></html>');
  writeFile(root, "robots.txt", state.robots);
  writeFile(root, "sitemap.xml", state.sitemap);
}

function withFixture(mutate, assertion) {
  const root = mkdtempSync(join(tmpdir(), "hyde-seo-audit-"));
  try {
    writeValidStagingFixture(root, mutate);
    assertion(auditBuild({ outDir: root }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

function withIndexableFixture(mutate, assertion) {
  withFixture((state) => {
    state.home.noindex = false;
    state.spanish.noindex = false;
    state.product.noindex = false;
    state.news.noindex = false;
    state.robots = [
      "User-Agent: *",
      "Allow: /",
      "Disallow: /admin/",
      `Sitemap: ${ORIGIN}/sitemap.xml`,
      "",
    ].join("\n");
    state.sitemap = `<?xml version="1.0"?><urlset>
      <url><loc>${ORIGIN}/</loc></url>
      <url><loc>${ORIGIN}/es/</loc></url>
      <url><loc>${ORIGIN}/products/lock/</loc></url>
      <url><loc>${ORIGIN}/news/door-hardware-guide/</loc><lastmod>2026-08-20T00:00:00.000Z</lastmod></url>
    </urlset>`;
    mutate(state);
  }, assertion);
}

function issueCodes(result) {
  return result.semanticIssues.map((issue) => issue.code);
}

test("accepts a valid staging export and ignores hrefLang on ordinary anchors", () => {
  withFixture(() => {}, (result) => {
    assert.deepEqual(result.semanticIssues, []);
    assert.equal(result.pages.find((page) => page.route === "/")?.alternates.length, 3);
  });
});

test("reports copy that exceeds the 62-character title and 165-character description budgets", () => {
  withFixture((state) => {
    state.home.title = "T".repeat(63);
    state.home.description = "D".repeat(166);
  }, (result) => {
    const homeWarnings = result.qualityWarnings.filter(({ route }) => route === "/");
    assert.ok(homeWarnings.some(({ code }) => code === "title-length"));
    assert.ok(homeWarnings.some(({ code }) => code === "description-length"));
  });
});

test("reports route, social, language, and reciprocal alternate mismatches", () => {
  withFixture((state) => {
    state.product.canonical = `${ORIGIN}/products/`;
    state.product.ogUrl = `${ORIGIN}/`;
    state.spanish.lang = "en";
    state.spanish.alternates = state.spanish.alternates.filter(({ language }) => language !== "en");
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("canonical-path-mismatch"));
    assert.ok(codes.includes("og-url-mismatch"));
    assert.ok(codes.includes("html-lang-mismatch"));
    assert.ok(codes.includes("hreflang-not-reciprocal"));
  });
});

test("reports a built bilingual pair when both pages lose every alternate link", () => {
  withFixture((state) => {
    state.home.alternates = [];
    state.spanish.alternates = [];
  }, (result) => {
    assert.ok(issueCodes(result).includes("hreflang-pair-missing"));
  });
});

test("reports a bilingual pair when both pages retain only self alternates", () => {
  withFixture((state) => {
    state.home.alternates = state.home.alternates.filter(({ language }) => language === "en");
    state.spanish.alternates = state.spanish.alternates.filter(({ language }) => language === "es");
  }, (result) => {
    assert.ok(issueCodes(result).includes("hreflang-counterpart-missing"));
  });
});

test("reports malformed, unsafe, and route-inconsistent JSON-LD", () => {
  withFixture((state) => {
    state.product.jsonLd[2].url = `${ORIGIN}/`;
    state.product.jsonLd[3].itemListElement[1].item = `${ORIGIN}/products/missing/`;
    state.product.jsonLd.push('{"@context":"https://schema.org","@type":"Thing","name":"<unsafe"}');
    state.product.jsonLd.push("{broken");
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("jsonld-product-url-mismatch"));
    assert.ok(codes.includes("jsonld-breadcrumb-current-url-mismatch"));
    assert.ok(codes.includes("jsonld-internal-url-target-missing"));
    assert.ok(codes.includes("jsonld-unsafe-less-than"));
    assert.ok(codes.includes("jsonld-invalid"));
  });
});

test("reports structured data that does not match visible page content", () => {
  withFixture((state) => {
    state.product.jsonLd[2].name = "Unrelated Product 999";
    state.product.jsonLd[2].description = "A description that visitors cannot see.";
    state.product.jsonLd.push({
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: "Invisible press headline",
      description: "Invisible press summary",
      url: `${ORIGIN}/products/lock/`,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${ORIGIN}/products/lock/` },
      datePublished: "2026-08-25",
      publisher: { "@id": `${ORIGIN}/#organization` },
    });
    state.product.jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [{
        "@type": "Question",
        name: "Invisible question?",
        acceptedAnswer: { "@type": "Answer", text: "Invisible answer." },
      }],
    });
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("jsonld-product-name-not-visible"));
    assert.ok(codes.includes("jsonld-product-description-not-visible"));
    assert.ok(codes.includes("jsonld-news-headline-not-visible"));
    assert.ok(codes.includes("jsonld-news-description-not-visible"));
    assert.ok(codes.includes("jsonld-faq-question-not-visible"));
    assert.ok(codes.includes("jsonld-faq-answer-not-visible"));
  });
});

test("reports malformed nested FAQ Question and Answer nodes", () => {
  withFixture((state) => {
    state.product.visibleText = [
      "Commercial mortise lock case.",
      "Wrong type question Visible answer one.",
      "Visible answer two.",
      "Missing answer question",
      "Wrong answer type question Visible answer three.",
      "Missing answer text question",
    ].join(" ");
    state.product.jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        null,
        {
          "@type": "Thing",
          name: "Wrong type question",
          acceptedAnswer: { "@type": "Answer", text: "Visible answer one." },
        },
        {
          "@type": "Question",
          name: "   ",
          acceptedAnswer: { "@type": "Answer", text: "Visible answer two." },
        },
        {
          "@type": "Question",
          name: "Missing answer question",
        },
        {
          "@type": "Question",
          name: "Wrong answer type question",
          acceptedAnswer: { "@type": "Thing", text: "Visible answer three." },
        },
        {
          "@type": "Question",
          name: "Missing answer text question",
          acceptedAnswer: { "@type": "Answer", text: "   " },
        },
      ],
    });
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("jsonld-faq-question-type-invalid"));
    assert.ok(codes.includes("jsonld-faq-question-name-missing"));
    assert.ok(codes.includes("jsonld-faq-answer-missing"));
    assert.ok(codes.includes("jsonld-faq-answer-type-invalid"));
    assert.ok(codes.includes("jsonld-faq-answer-text-missing"));
  });
});

test("reports malformed BreadcrumbList and ItemList child records", () => {
  withFixture((state) => {
    state.product.jsonLd[3].itemListElement = [
      { "@type": "Thing", position: 0, name: "   ", item: "" },
      { "@type": "ListItem", position: 3, name: "Lock", item: `${ORIGIN}/products/lock/` },
    ];
    state.product.jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        { "@type": "Thing", position: 1, url: "" },
        { "@type": "ListItem", position: 3, url: `${ORIGIN}/products/lock/` },
      ],
    });
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("jsonld-list-item-type-invalid"));
    assert.ok(codes.includes("jsonld-list-item-position-invalid"));
    assert.ok(codes.includes("jsonld-breadcrumb-item-name-missing"));
    assert.ok(codes.includes("jsonld-breadcrumb-item-url-missing"));
    assert.ok(codes.includes("jsonld-item-list-url-missing"));
  });
});

test("accepts JSON-LD graph nodes that inherit the graph context", () => {
  withFixture((state) => {
    state.home.jsonLd = [{
      "@context": "https://schema.org",
      "@graph": globalSchemas().map((schema) => {
        const node = { ...schema };
        delete node["@context"];
        return node;
      }),
    }];
  }, (result) => {
    assert.equal(issueCodes(result).includes("jsonld-context-missing"), false);
  });
});

test("requires staging robots, noindex pages, and an empty sitemap to agree", () => {
  withFixture((state) => {
    state.home.noindex = false;
    state.sitemap = `<?xml version="1.0"?><urlset><url><loc>${ORIGIN}/</loc></url></urlset>`;
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("staging-page-indexable"));
    assert.ok(codes.includes("staging-sitemap-not-empty"));
  });
});

test("accepts an indexable export only when robots, public pages, and sitemap agree", () => {
  withIndexableFixture(() => {}, (result) => {
    assert.deepEqual(result.semanticIssues, []);
    assert.equal(result.summary.releaseState, "indexable");
  });
});

test("reports sitemap lastmod on a page without a tracked content date", () => {
  withIndexableFixture((state) => {
    state.sitemap = state.sitemap.replace(
      `<url><loc>${ORIGIN}/products/lock/</loc></url>`,
      `<url><loc>${ORIGIN}/products/lock/</loc><lastmod>2026-08-20</lastmod></url>`,
    );
  }, (result) => {
    assert.ok(issueCodes(result).includes("sitemap-lastmod-untracked"));
  });
});

test("reports sitemap lastmod that differs from NewsArticle datePublished", () => {
  withIndexableFixture((state) => {
    state.sitemap = state.sitemap.replace(
      "<lastmod>2026-08-20T00:00:00.000Z</lastmod>",
      "<lastmod>2026-08-21T00:00:00.000Z</lastmod>",
    );
  }, (result) => {
    assert.ok(issueCodes(result).includes("sitemap-lastmod-mismatch"));
  });
});

test("reports malformed sitemap lastmod values", () => {
  withIndexableFixture((state) => {
    state.sitemap = state.sitemap.replace(
      "<lastmod>2026-08-20T00:00:00.000Z</lastmod>",
      "<lastmod>not-a-date</lastmod>",
    );
  }, (result) => {
    assert.ok(issueCodes(result).includes("sitemap-lastmod-invalid"));
  });
});

test("machine-readable results omit local paths and full extracted page content", () => {
  withFixture(() => {}, (result) => {
    const page = result.pages.find((candidate) => candidate.route === "/");
    assert.ok(page);
    assert.equal("file" in page, false);
    assert.equal("html" in page, false);
    assert.equal("visibleText" in page, false);
    assert.equal("h1Texts" in page, false);
    assert.equal("jsonLd" in page, false);
    assert.ok(Array.isArray(page.jsonLdTypes));
  });
});

test("reports blocked render assets and public pages omitted from an indexable sitemap", () => {
  withIndexableFixture((state) => {
    state.robots = state.robots.replace("Disallow: /admin/", "Disallow: /_next/\nDisallow: /admin/");
    state.sitemap = state.sitemap.replace(`<url><loc>${ORIGIN}/products/lock/</loc></url>`, "");
  }, (result) => {
    const codes = issueCodes(result);
    assert.ok(codes.includes("render-assets-disallowed"));
    assert.ok(codes.includes("sitemap-missing-page"));
  });
});

test("reports an indexable sitemap URL that has no exported canonical page", () => {
  withIndexableFixture((state) => {
    state.sitemap = state.sitemap.replace(
      "</urlset>",
      `<url><loc>${ORIGIN}/retired-page/</loc></url></urlset>`,
    );
  }, (result) => {
    assert.ok(issueCodes(result).includes("sitemap-url-target-missing"));
  });
});

test("the committed export satisfies the semantic SEO contract", () => {
  const result = auditBuild({ outDir: join(process.cwd(), "out") });
  assert.deepEqual(
    result.semanticIssues,
    [],
    result.semanticIssues.map((issue) => `${issue.route}: ${issue.code} — ${issue.detail}`).join("\n"),
  );

  assert.equal(
    result.pages.find((page) => page.route === "/es/")?.title,
    "Cerraduras y herrajes arquitectónicos | Canton Hyland",
  );
});
