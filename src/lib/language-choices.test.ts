import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { locales } from "../data/locales.ts";
import { soleLocaleOf } from "./spanish-mirror.ts";
import { languageChoices } from "./language-choices.ts";

/**
 * These tests exist because of one day, 2026-09-16 to 2026-09-17, in which 645 Portuguese
 * pages were live, correct, and unreachable.
 *
 * Everything that could pass, passed. The pages built. hreflang was reciprocal in all
 * three directions, because `mirrorsOf` is derived from the mirror lists. The sitemap
 * carried them. `npm test` was green at 313/313 and the dead-link audit cleared 1,370
 * pages — and not one of those checks looks at whether a reader can GET to a tree.
 *
 * The three places that decide that were all hand-written lists of two languages:
 *
 *   languageChoices()      the panel's language column — returned [en, es]
 *   triggerLabel()         the header affordance — returned the literal "ES | EN".
 *                          Retired 2026-09-17: the header renders one anchor per
 *                          language now, so the codes are links rather than a label.
 *   SiteFooter             the only server-rendered cross-tree anchor — EN ↔ ES only
 *
 * So the rule these tests hold is not "Portuguese must be present". It is that NOTHING
 * here may enumerate the locales by hand, because the next language will be added by
 * someone who does not know these three files exist.
 */

test("the panel offers every locale, on every kind of path", () => {
  for (const pathname of ["/", "/products/", "/es/products/", "/pt/products/", "/news/x/"]) {
    const codes = languageChoices(pathname, "en").map((choice) => choice.code);
    /* Ten locales since 2026-09-25 — the list itself is the only source. */
    assert.deepEqual(codes, [...locales], `${pathname} offered ${codes.join(", ")}`);
  }
});

test("exactly one choice is the current language, and it is the one asked for", () => {
  for (const locale of locales) {
    const choices = languageChoices(locale === "en" ? "/products/" : `/${locale}/products/`, locale);
    const current = choices.filter((choice) => choice.current);
    assert.equal(current.length, 1);
    assert.equal(current[0]!.code, locale);
  }
});

/*
  A link out of this menu may never 404. `samePage: false` is the honest branch — it sends
  the reader to that language's home and the panel says so — so the pairing is asserted
  rather than the destination: a link claiming to be the same page must carry the path.
*/
test("a link is either this page in that language, or that language's home", () => {
  for (const pathname of ["/", "/products/", "/downloads/", "/request/price-list/"]) {
    for (const choice of languageChoices(pathname, "en")) {
      if (choice.code === "en") continue;
      if (choice.samePage) {
        const expected = `/${choice.code}${pathname === "/" ? "" : pathname}`;
        assert.equal(choice.href, expected, `${pathname} → ${choice.href}`);
      } else {
        assert.equal(choice.href, `/${choice.code}`);
      }
    }
  }
});

/**
 * The source guard.
 *
 * `isSpanish = pathname.startsWith("/es/")` is the exact shape of the bug: a boolean
 * cannot express a third language, so every /pt/ page computed `locale = "en"` and the
 * header linked its own reader back out to the English tree. Grepping for it is crude and
 * it is the only check that would have caught this on 2026-09-16.
 */
test("no site chrome sniffs for Spanish instead of asking which locale it is in", () => {
  const files = [
    "SiteHeader.tsx",
    "SiteFooter.tsx",
    "SiteMenuDrawer.tsx",
    "LocalePicker.tsx",
    "HeroModule.tsx",
    "PromoDialog.tsx",
    "EditorialAtlas.tsx",
  ];
  const offenders: string[] = [];

  for (const file of files) {
    const source = fs.readFileSync(path.join(process.cwd(), "src/components/site", file), "utf8");
    /*
      Comments are blanked rather than skipped line by line: the notes recording THIS
      defect quote the code that caused it, and a line-prefix filter cannot see the
      middle of a block comment. Each comment character becomes a space, so the line
      numbers stay honest.
    */
    const code = source.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, (match) =>
      match.replace(/[^\n]/g, " "),
    );
    for (const [index, line] of code.split("\n").entries()) {
      if (/startsWith\(["'`]\/(es|pt)\b/.test(line) || /===\s*["'`]\/(es|pt)["'`]/.test(line)) {
        offenders.push(`${file}:${index + 1} ${line.trim()}`);
      }
    }
  }

  assert.deepEqual(offenders, [], "use localeFromPath() — see its note in src/data/locales.ts");
});

/**
 * A page that exists in one language only must not offer the others AT ITS OWN PATH.
 *
 * /pt/ferragens-porta-corta-fogo/ is a Brazilian fire-door page with no English original,
 * and on 2026-09-17 the footer's "English" link on it pointed at
 * /ferragens-porta-corta-fogo/ — a URL that has never existed. The dead-link audit caught
 * it, on the one page the SAGA Portas enquiry arrived through.
 */
test("a language-only page sends the other languages home, not to a path that never existed", () => {
  const choices = languageChoices("/pt/ferragens-porta-corta-fogo/", "pt");
  const pt = choices.find((choice) => choice.code === "pt")!;
  assert.equal(pt.current, true);

  for (const choice of choices.filter((c) => !c.current)) {
    assert.equal(choice.samePage, false, `${choice.code} claims this page exists in it`);
    assert.equal(choice.href, choice.code === "en" ? "/" : `/${choice.code}`);
  }
});

/**
 * And the list of those pages has to keep up with the routes.
 *
 * `LOCALE_ONLY_ROUTES` is hand-written, which is the thing this whole file exists to
 * distrust — so it is checked against the filesystem: every route under src/app/pt that
 * has no src/app counterpart must be declared, or the footer will link at a 404 again.
 */
test("every Portuguese-only route is declared as one", () => {
  const ptRoutes = fs
    .readdirSync(path.join(process.cwd(), "src/app/pt"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("[") && !entry.name.startsWith("("))
    .map((entry) => entry.name);

  const undeclared = ptRoutes.filter((route) => {
    const englishRoute = path.join(process.cwd(), "src/app", route);
    const englishGroupRoute = path.join(process.cwd(), "src/app/(en)", route);
    if (fs.existsSync(englishRoute) || fs.existsSync(englishGroupRoute)) return false;
    return soleLocaleOf(`/${route}`) !== "pt";
  });

  assert.deepEqual(
    undeclared,
    [],
    "add these to LOCALE_ONLY_ROUTES in src/lib/spanish-mirror.ts",
  );
});
