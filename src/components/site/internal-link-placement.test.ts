import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

/**
 * Every section of the English site has a visible place to be reached from.
 *
 * Client, 2026-09-28: 「https://cantonlock.com/product-studies/ 别的地方都看不见……必须确保每条
 * 内链都有显眼可达的位置……有没有相关的审查捕捉机制」. /product-studies/ was linked from one
 * page (/products/), the configurator from two and the BAU column from one; `seo:graph` passed,
 * because a page with ONE inbound link is not an orphan. Nothing caught "hidden but reachable".
 *
 * Two places, because they serve two readers:
 *
 *   1. The menu drawer (menu-experience.ts, English concierge): what a BUYER opens. It lists
 *      every section, grouped Products / Knowledge / Evidence / Buying.
 *   2. The server-rendered chrome (content/navigation.json, SiteHeader.tsx, SiteFooter.tsx):
 *      what a CRAWLER sees. The drawer mounts only while open, so it is in no exported HTML.
 *
 * A new route under src/app/(en)/ fails here until it is placed in both, or listed in
 * EXEMPT with the reason it is reached some other way. `npm run seo:placement` measures the
 * same thing on the built out/ — how many pages actually link to each section.
 */
const root = process.cwd();
const read = (...parts: string[]) => fs.readFileSync(path.join(root, ...parts), "utf8");

/** Reached from somewhere more specific than site chrome; each says where. */
const EXEMPT: Record<string, string> = {
  "/collections": "sub-category pages, linked from every category page and the drawer's family list",
  "/compare": "one comparison per category, linked from each category page",
  "/video": "one watch page per product video, linked from that product page",
  "/privacy": "legal page, linked from every footer and under every form, not a drawer section",
  "/sitemap-index.xml": "XML for search engines (lists the ten sitemaps), not a page a reader visits",
  "/stories/9014": "draft, noindex and out of the sitemap until the owner approves it (2026-09-30); placed in the drawer and footer on release",
};

/** The English sections: each top-level folder, or its first nested page when it has no index. */
function englishSections(): string[] {
  const base = path.join(root, "src", "app", "(en)");
  const sections: string[] = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("[") || entry.name.startsWith("(")) continue;
    const dir = path.join(base, entry.name);
    if (fs.existsSync(path.join(dir, "page.tsx"))) {
      sections.push(`/${entry.name}`);
      continue;
    }
    const nested = fs
      .readdirSync(dir, { withFileTypes: true })
      .find((child) => child.isDirectory() && !child.name.startsWith("[") && fs.existsSync(path.join(dir, child.name, "page.tsx")));
    sections.push(nested ? `/${entry.name}/${nested.name}` : `/${entry.name}`);
  }
  return sections.sort();
}

function englishBlock(source: string): string {
  const start = source.indexOf("  en: {");
  return source.slice(start, source.indexOf("\n  es: {", start));
}

const linked = (source: string, section: string) => new RegExp(`["'\`]${section}/?["'\`]`).test(source);

test("every English section is in the menu drawer", () => {
  const menu = englishBlock(read("src", "components", "site", "menu-experience.ts"));
  const missing = englishSections().filter((section) => !EXEMPT[section] && !linked(menu, section));
  assert.deepEqual(missing, [], "add these to the English concierge groups in menu-experience.ts");
});

test("every English section is linked from the server-rendered header or footer", () => {
  /* The header nav and its Resources shelf (SiteHeader.tsx), and the footer. */
  const chrome = [read("content", "navigation.json"), read("src", "components", "site", "SiteHeader.tsx"), read("src", "components", "site", "SiteFooter.tsx")].join("\n");
  const missing = englishSections().filter((section) => !EXEMPT[section] && !linked(chrome, section));
  assert.deepEqual(missing, [], "add these to the footer REFERENCE_LINKS or the header nav — the drawer alone is invisible to crawlers");
});

test("exemptions name real sections", () => {
  const sections = new Set(englishSections());
  for (const section of Object.keys(EXEMPT)) assert.ok(sections.has(section), `${section} is exempt but no longer exists`);
});
