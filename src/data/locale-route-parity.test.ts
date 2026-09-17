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
