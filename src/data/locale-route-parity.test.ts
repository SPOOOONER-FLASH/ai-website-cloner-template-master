import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { hasPortugueseMirror, hasSpanishMirror } from "../lib/spanish-mirror.ts";

const APP = path.join(process.cwd(), "src/app");

/**
 * A nav item with no mirror does not degrade — it EJECTS.
 *
 * ---------------------------------------------------------------------------
 * THE DEFECT THIS EXISTS FOR
 *
 * Client, 2026-09-17: 「点选葡萄牙语，选择产品配置器和首页又变成了英文」 — pick
 * Portuguese, click the configurator, and the home page is English again.
 *
 * That is not two bugs. `localisedHref` returns the bare English path when a route has no
 * mirror, which is the honest answer for one link and a trapdoor for a session: the reader
 * lands on an English page, and from there every header link, every breadcrumb and every
 * card is English too. One missing route costs the language for the rest of the visit.
 *
 * Five routes were in that state — product-finder, configurator, downloads, projects and
 * product-studies — and four of them are in the header.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS ASSERTED
 *
 * Two things, and the second is the one that bites.
 *
 *   1. A route that exists on disk under src/app/<locale> must be declared a mirror, or
 *      hreflang and the footer will not know it is there.
 *   2. A route DECLARED a mirror must exist on disk, or every link to it is a 404.
 *
 * Spanish is checked the same way, because the two trees drift in opposite directions and
 * only checking the newer one means finding the Spanish version of this in six months.
 */
function routesUnder(dir: string): string[] {
  const root = path.join(APP, dir);
  if (!fs.existsSync(root)) return [];
  const found: string[] = [];
  const walk = (current: string, prefix: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      /* [slug] is one route, not one per value; (group) is not a URL segment at all. */
      if (entry.name.startsWith("[") || entry.name.startsWith("(")) continue;
      const route = `${prefix}/${entry.name}`;
      if (fs.existsSync(path.join(current, entry.name, "page.tsx"))) found.push(route);
      walk(path.join(current, entry.name), route);
    }
  };
  walk(root, "");
  return found.sort();
}

/** Routes the mirror predicates are asked about — the top segment is what they key on. */
function topLevel(routes: string[]): string[] {
  return [...new Set(routes.map((route) => `/${route.split("/")[1]}`))].sort();
}

test("every Portuguese route on disk is declared a Portuguese mirror", () => {
  const undeclared = topLevel(routesUnder("pt")).filter((route) => {
    /* A Portuguese-only page has no English path to mirror — see LOCALE_ONLY_ROUTES. */
    if (!fs.existsSync(path.join(APP, "(en)", route)) && !fs.existsSync(path.join(APP, route))) {
      return false;
    }
    return !hasPortugueseMirror(route);
  });

  assert.deepEqual(
    undeclared,
    [],
    "add these to PORTUGUESE_MIRROR_PREFIXES in src/lib/spanish-mirror.ts — " +
      "until they are listed, hreflang and the footer do not know the page exists",
  );
});

test("every declared Portuguese mirror exists on disk", () => {
  const onDisk = new Set(topLevel(routesUnder("pt")));
  const englishRoutes = topLevel([...routesUnder("(en)"), ...routesUnder("")]);

  const missing = englishRoutes.filter(
    (route) => hasPortugueseMirror(route) && !onDisk.has(route),
  );

  assert.deepEqual(
    missing,
    [],
    "these are declared Portuguese mirrors and have no src/app/pt route — every link to " +
      "them is a 404",
  );
});

test("every declared Spanish mirror exists on disk", () => {
  const onDisk = new Set(topLevel(routesUnder("es")));
  const englishRoutes = topLevel([...routesUnder("(en)"), ...routesUnder("")]);

  const missing = englishRoutes.filter(
    (route) => hasSpanishMirror(route) && !onDisk.has(route),
  );

  assert.deepEqual(missing, [], "declared Spanish mirrors with no src/app/es route");
});

/**
 * A localised page must not link out of its own tree when the mirror exists.
 *
 * This is the same defect as above seen from the other end. The routes can all exist and
 * the reader still be ejected, because the LINK points at the English path: on 2026-09-17
 * the Portuguese header offered "Procurar produto", "Configurador", "Aplicações",
 * "Notícias + Imprensa" and "Descarregáveis" — five Portuguese labels, five English
 * destinations, in the one component every page renders.
 *
 * The rule is narrow on purpose. It fires only when the link target HAS a mirror in that
 * locale, so /events/ — which exists in English only — stays linkable from
 * every tree, exactly as they are today.
 */
function localeHrefLeaks(locale: "es" | "pt", source: string, file: string): string[] {
  const hasMirror = locale === "es" ? hasSpanishMirror : hasPortugueseMirror;
  const leaks: string[] = [];
  for (const match of source.matchAll(/href[=:]\s*["'`](\/[^"'`\s]*)/g)) {
    const href = match[1];
    /*
      A dot means a file, not a route: /downloads/ is a page AND the directory the export
      catalogue PDF sits in, and `/downloads/canton-hyland-product-catalogue-2026.pdf` is
      the same asset in every language. Linking it from /pt/ is correct.
    */
    if (href.includes(".")) continue;
    const segment = href.split("/")[1] ?? "";
    if (!/^[a-z0-9-]+$/.test(segment)) continue;
    if (segment === locale) continue;
    const route = `/${segment}`;
    if (!hasMirror(route)) continue;
    leaks.push(`${file}: ${href} should start /${locale}${route}/`);
  }
  return leaks;
}

function filesUnder(dir: string): string[] {
  const root = path.join(APP, dir);
  if (!fs.existsSync(root)) return [];
  const found: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts")) found.push(full);
    }
  };
  walk(root);
  return found;
}

/**
 * The locale blocks of a shared component, by indentation.
 *
 * `menu-experience.ts` holds all three languages in one file, so the whole file cannot be
 * scanned — the English block would report every English href. The blocks are two-space
 * `en:` / `es:` / `pt:` keys, and the block ends where the brace depth returns to zero.
 */
function localeBlock(source: string, locale: string): string {
  const lines = source.split("\n");
  const start = lines.findIndex((line) => new RegExp(`^  ${locale}: \{`).test(line));
  if (start === -1) return "";
  let depth = 1;
  const block: string[] = [];
  for (const line of lines.slice(start + 1)) {
    depth += (line.match(/[{[]/g) ?? []).length - (line.match(/[}\]]/g) ?? []).length;
    if (depth <= 0) break;
    block.push(line);
  }
  return block.join("\n");
}

const SHARED_WITH_LOCALE_BLOCKS = ["src/components/site/menu-experience.ts"];

/**
 * Single-locale data modules, scanned whole.
 *
 * The home page of each tree is assembled from one of these, and on 2026-09-17 the
 * Portuguese one sent "Ver aplicações" and both application cards to /projects/ — the
 * English tree — from the first screen of the Portuguese home page.
 */
const LOCALE_DATA = { es: ["src/data/home-es.ts"], pt: ["src/data/home-pt.ts"] } as const;

for (const locale of ["es", "pt"] as const) {
  test(`${locale} pages link inside the ${locale} tree`, () => {
    const leaks: string[] = [];

    for (const file of filesUnder(locale)) {
      leaks.push(
        ...localeHrefLeaks(locale, fs.readFileSync(file, "utf8"), path.relative(process.cwd(), file)),
      );
    }

    for (const file of LOCALE_DATA[locale]) {
      leaks.push(...localeHrefLeaks(locale, fs.readFileSync(file, "utf8"), file));
    }

    for (const shared of SHARED_WITH_LOCALE_BLOCKS) {
      const block = localeBlock(fs.readFileSync(shared, "utf8"), locale);
      leaks.push(...localeHrefLeaks(locale, block, `${shared} (${locale} block)`));
    }

    assert.deepEqual(
      leaks,
      [],
      `these links drop the reader out of /${locale}/ and into English for the rest of ` +
        `the visit — the mirror exists, the link just does not use it`,
    );
  });
}
