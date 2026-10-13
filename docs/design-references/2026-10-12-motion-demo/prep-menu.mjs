// Data for the mega-menu preview (menu.html), revised plan of 2026-10-13. Every count is taken with
// the expression the live page that shows it uses, and every string is read from the source file that
// prints it on the live site today; the only strings typed here are the plan's new copy (four group
// headings and the Glossary detail). Anything missing throws instead of falling back.
// Images: none inside the shelves (plan §2, "Rejected"). The wordmark is the live header's artwork
// (HydeLockup in icons.tsx), copied into public/img/menu/; the 307 page underneath uses prep-inner.mjs's images, checked here.
import fs from "node:fs";
import path from "node:path";

const DEMO = import.meta.dirname;
const SITE = path.resolve(DEMO, "../../..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const json = (p) => JSON.parse(read(p));
/** First capture group of `re` in `file`; throws if the live source no longer says it. */
const grab = (file, re) => {
  const m = read(file).match(re);
  if (!m) throw new Error(`${file}: expected ${re}. The live source changed, update the preview`);
  return m[1];
};
const must = (cond, msg) => { if (!cond) throw new Error(msg); };
const LIVE = "https://cantonlock.com";
const TODAY = new Date().toISOString().slice(0, 10);

// ------------------------------------------------------------ images
const MARK = "public/images/brand/hyde/hyde-logo-horizontal-black.svg";
must(fs.existsSync(path.join(SITE, MARK)), `${MARK} missing`);
fs.mkdirSync(path.join(DEMO, "public/img/menu"), { recursive: true });
fs.copyFileSync(path.join(SITE, MARK), path.join(DEMO, "public/img/menu/hyde-logo-horizontal-black.svg"));
must(fs.existsSync(path.join(DEMO, "public/img/inner/307-panic-exit-device.webp")),
  "public/img/inner/307-panic-exit-device.webp missing: run prep-inner.mjs first (the page under the menu)");

// ------------------------------------------------------------ products: onHydeCatalogue + isPublished
const products = fs.readdirSync(path.join(SITE, "content/products")).filter((f) => f.endsWith(".json"))
  .map((f) => json(`content/products/${f}`))
  .filter((p) => (!p.sites || p.sites.includes("hyde")) && p.heroImage?.src);
const categories = json("content/categories.json").categories;

// The proposed MENU_GROUPS (src/data/categories.ts in stage 2), in door-schedule order.
const MENU_GROUPS = [
  ["Exit devices and closers", ["panic-exit-devices", "door-closers", "floor-springs-and-pivots"]],
  ["Locks and cylinders", ["lock-cases", "lock-cylinders", "knob-locks", "deadbolts", "night-latches-rim-locks", "sliding-hook-locks"]],
  ["Handles and glass-door fittings", ["lever-handles", "stainless-steel-handles", "grip-handle-sets", "glass-door-accessories"]],
  ["Hinges and accessories", ["brass-steel-hinges", "hardware-accessories", "bathroom-accessories", "care-grab-bars"]],
];

// getMenuCategories(): published top-level categories, children with at least one product.
const families = new Map(categories.map((c) => {
  const inCat = products.filter((p) => p.categoryPath?.[0] === c.slug);
  const children = (c.children ?? []).filter((k) => inCat.some((p) => p.categoryPath[1] === k.slug))
    .map((k) => ({ slug: k.slug, label: k.name, href: `${LIVE}/collections/${c.slug}-${k.slug}/` }));
  return [c.slug, { slug: c.slug, label: c.name, count: inCat.length, href: `${LIVE}/products/${c.slug}/`, children }];
}).filter(([, f]) => f.count > 0));

const grouped = MENU_GROUPS.flatMap(([, slugs]) => slugs);
for (const slug of families.keys()) must(grouped.filter((s) => s === slug).length === 1,
  `top-level category "${slug}" must appear in exactly one MENU_GROUPS group`);
for (const slug of grouped) must(families.has(slug), `MENU_GROUPS names "${slug}", which has no published products`);
const groups = MENU_GROUPS.map(([title, slugs]) => ({ title, families: slugs.map((s) => families.get(s)) }));
const sum = groups.flatMap((g) => g.families).reduce((n, f) => n + f.count, 0);
must(sum === products.length, `family counts sum to ${sum}, published total is ${products.length}`);

// ------------------------------------------------------------ Resources counts, as each index page renders them
// getPublishedGuides() / getPublishedNews(): not draft, publishedAt <= today.
const published = (dir) => fs.readdirSync(path.join(SITE, dir)).filter((f) => f.endsWith(".json"))
  .map((f) => json(`${dir}/${f}`)).filter((a) => !a.draft && a.publishedAt <= TODAY).length;
grab("src/components/site/GuideListing.tsx", /(getPublishedGuides\(\))/);
grab("src/components/site/NewsListing.tsx", /(getPublishedNews\(\))/);
// ProjectListing maps `projects`, which is the generated array with overlays applied 1:1.
grab("src/components/site/ProjectListing.tsx", /(projects\.map\()/);
const projectItems = grab("src/data/generated/projects.ts", /export const projects = \[([^\]]*)\]/).split(",").filter((s) => s.trim());
must(projectItems.length === fs.readdirSync(path.join(SITE, "content/projects")).filter((f) => f.endsWith(".json")).length,
  "generated/projects.ts is out of step with content/projects");
// The glossary page prints HARDWARE_TERMS.length; count the array's own `id:` entries.
grab("src/app/(en)/glossary/page.tsx", /These \{(HARDWARE_TERMS\.length)\} terms/);
const terms = read("src/data/hardware-terms.ts");
const termsArray = terms.slice(terms.indexOf("export const HARDWARE_TERMS"), terms.indexOf("\n];", terms.indexOf("export const HARDWARE_TERMS")));
const counts = {
  "/projects": projectItems.length,
  "/guides": published("content/guides"),
  "/news": published("content/news"),
  "/glossary": termsArray.match(/^ {4}id: "/gm)?.length ?? 0,
};
for (const [k, n] of Object.entries(counts)) must(n > 0, `count for ${k} is 0`);

// The Resources ledger names the newest published guide: one checkable line, and the one that shows
// the reference library is still being written. Same draft/date rule as the counts above.
const newestGuide = fs.readdirSync(path.join(SITE, "content/guides")).filter((f) => f.endsWith(".json"))
  .map((f) => json(`content/guides/${f}`)).filter((a) => !a.draft && a.publishedAt <= TODAY)
  .sort((x, y) => y.publishedAt.localeCompare(x.publishedAt))[0];
must(newestGuide?.title && newestGuide.slug, "no published guide");

// ------------------------------------------------------------ strings, from the files that print them
const nav = Object.fromEntries(json("content/navigation.json").header.map((l) => [l.href, l.label]));
const header = "src/components/site/SiteHeader.tsx";
const enBlock = (name) => grab(header, new RegExp(`const ${name} = \\{\\s*en: ([\\[{][\\s\\S]*?[\\]}]),\\s*es:`));
const shelfItems = (name) => [...enBlock(name).matchAll(/label: "([^"]+)", detail: "([^"]+)", href: "([^"]+)"/g)]
  .map(([, label, detail, href]) => ({ label, detail, href: `${LIVE}${href}/` }));
const resourceDetail = Object.fromEntries([...enBlock("resourceDetails").matchAll(/"(\/\w+)": "([^"]+)"/g)].map(([, k, v]) => [k, v]));
const settings = json("content/site-settings.json");
const experience = "src/components/site/menu-experience.ts";

const company = shelfItems("companyShelfLinks");
const buy = shelfItems("buyShelfLinks");
must(company.length === 4 && buy.length === 3, `expected 4 company and 3 buy items, got ${company.length}/${buy.length}`);
must(settings.legalName && settings.contact?.city && settings.contact?.province && settings.contact?.email, "site-settings: legalName / contact incomplete");

// Events detail as bauEntryDetails("en").compactDates builds it: en-GB short-month range.
const event = json("content/bau-2027.json").event;
const range = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", calendar: "gregory", timeZone: "UTC" })
  .formatRange(new Date(`${event.startDate}T00:00:00Z`), new Date(`${event.endDate}T00:00:00Z`));
const bauCopy = "src/data/bau-entry.ts";

// The drawer's concierge block is unchanged by the plan; shown so the drawer reads in place.
const conciergeEn = grab(experience, /const concierge[\s\S]*?en: \{([\s\S]*?)groups: \[/);
const concierge = {
  title: conciergeEn.match(/title: "([^"]+)"/)[1],
  routes: [...conciergeEn.matchAll(/label: "([^"]+)",\s*detail: "([^"]+)",\s*href: "([^"]+)"/g)]
    .map(([, label, detail, href]) => ({ label, detail, href: `${LIVE}${href}` })),
};
must(concierge.routes.length === 4, `expected 4 concierge routes, got ${concierge.routes.length}`);

const data = {
  generatedBy: "docs/design-references/2026-10-12-motion-demo/prep-menu.mjs",
  snapshot: TODAY,
  labels: {
    products: nav["/products"], finder: nav["/product-finder"], company: nav["/company"],
    guides: nav["/guides"], news: nav["/news"],
    resources: grab(header, /tx\(locale, "(Resources)"/), buy: grab(header, /tx\(locale, "(Buy it now)"/),
    drawerFamilies: grab("src/components/site/SiteMenuDrawer.tsx", /say\("(All product families)"/),
  },
  products: {
    total: products.length,
    recordsLabel: grab("src/lib/site-facts.ts", /models: "([^"]+)"/),
    noModel: grab("src/components/site/ConfiguratorTeaser.tsx", /eyebrow: "([^"]+)"/),
    tools: [
      { label: grab(experience, /label: "(Configurator)", href: "\/configurator\/"/), href: `${LIVE}/configurator/` },
      { label: grab(header, /tx\(locale, "(Configurator Studio)"/), href: `${LIVE}/configurator/studio/` },
    ],
    groups,
  },
  company: {
    legalName: settings.legalName,
    town: `${settings.contact.city}, ${settings.contact.province}`,
    items: company,
    bau: {
      endDate: event.endDate, year: event.startDate.slice(0, 4), venue: event.venue, dates: range,
      hall: `${grab(bauCopy, /hall: "(Hall)"/)} ${event.hall}`, stand: `${grab(bauCopy, /stand: "(Stand)"/)} ${event.stand}`,
    },
  },
  resources: {
    latest: {
      label: "Newest guide", title: newestGuide.title, href: `${LIVE}/guides/${newestGuide.slug}/`,
      date: new Date(`${newestGuide.publishedAt}T00:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
    },
    items: [
      ...["/projects", "/guides", "/news"].map((h) => ({ label: nav[h], detail: resourceDetail[h], count: counts[h], href: `${LIVE}${h}/` })),
      // New detail string proposed by the plan (§6); label and route are live (drawer config).
      { label: grab(experience, /label: "(Glossary)", href: "\/glossary\/"/), detail: "The terms on our specification tables, defined",
        count: counts["/glossary"], href: `${LIVE}/glossary/` },
    ],
  },
  buy: {
    promise: grab(experience, /exportPromise: "([^"]+)"/),
    email: settings.contact.email,
    items: buy,
    alibaba: { label: settings.alibaba.label, href: settings.alibaba.storefront },
  },
  drawer: { concierge },
};
for (const it of data.resources.items) must(it.label && it.detail, `resource item incomplete: ${JSON.stringify(it)}`);

fs.writeFileSync(path.join(DEMO, "src/menu.json"), `${JSON.stringify(data, null, 2)}\n`);
const subs = groups.flatMap((g) => g.families).reduce((n, f) => n + f.children.length, 0);
console.log(`menu: ${products.length} published, ${families.size} families (${groups.map((g) => g.families.map((f) => f.count).join("+")).join(" | ")}), ${subs} sub-links, resources ${Object.values(counts).join("/")}, BAU ${range}`);
