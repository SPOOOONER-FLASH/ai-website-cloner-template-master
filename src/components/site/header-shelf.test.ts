import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const componentRoot = join(process.cwd(), "src", "components", "site");
const header = readFileSync(join(componentRoot, "SiteHeader.tsx"), "utf8");
const drawer = readFileSync(join(componentRoot, "SiteMenuDrawer.tsx"), "utf8");
const menuConfig = readFileSync(join(componentRoot, "menu-experience.ts"), "utf8");
const footer = readFileSync(join(componentRoot, "SiteFooter.tsx"), "utf8");
const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");
const navigation = JSON.parse(
  readFileSync(join(process.cwd(), "content", "navigation.json"), "utf8"),
) as {
  footer: Array<{ label: string; labelEs: string; href: string }>;
};

test("desktop navigation exposes the two architectural shelves accessibly", () => {
  assert.match(header, /aria-controls="company-shelf"/);
  assert.match(header, /aria-controls="buy-shelf"/);
  assert.match(header, /aria-expanded={openShelf === "company"}/);
  assert.match(header, /aria-expanded={openShelf === "buy"}/);
  assert.match(header, /Company overview/);
  assert.match(header, /Services/);
  assert.match(header, /Events/);
  assert.match(header, /Certificates/);
  assert.match(header, /Price list/);
  assert.match(header, /siteSettings\.alibaba\.storefront/);
});

test("shelves animate as full-width layers without moving page content", () => {
  assert.match(css, /\.header-shelf\s*{[\s\S]*grid-template-rows:\s*0fr/);
  assert.match(css, /\.header-shelf-open\s*{[\s\S]*grid-template-rows:\s*1fr/);
  assert.match(css, /\.header-shelf\s*{[\s\S]*position:\s*absolute/);
  assert.match(css, /\.header-shelf\s*{[\s\S]*pointer-events:\s*none/);
  assert.match(css, /\.header-shelf-open\s*{[\s\S]*pointer-events:\s*auto/);
});

test("Alibaba is the only permanently emphasized hard-shadow shelf action", () => {
  assert.match(header, /className="alibaba-hard-cta"/);
  assert.match(drawer, /className="alibaba-hard-cta/);
  assert.match(css, /\.alibaba-hard-cta\s*{[\s\S]*background-color:\s*var\(--color-ink\)/);
  assert.match(css, /\.alibaba-hard-cta\s*{[\s\S]*box-shadow:\s*0\.9rem 0\.9rem 0 var\(--color-shadow-hard\)/);
  assert.match(css, /\.alibaba-hard-cta:active\s*{[\s\S]*box-shadow:\s*0\.2rem 0\.2rem 0 var\(--color-shadow-hard\)/);
});

test("mobile drawer mirrors the expanded company and buying routes", () => {
  for (const route of ["/news/", "/services/", "/events/", "/certifications/"]) {
    assert.match(menuConfig, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(drawer, /Buy it now/);
  assert.match(drawer, /Comprar ahora/);
  assert.match(drawer, /Price list/);
  assert.match(drawer, /Lista de precios/);
});

test("footer exposes only the four direct buying destinations", () => {
  assert.deepEqual(
    navigation.footer,
    [
      { label: "Contact", labelEs: "Contacto", href: "/contact" },
      { label: "FAQ", labelEs: "Preguntas frecuentes", href: "/faq" },
    ],
  );
  assert.match(footer, /siteSettings\.alibaba\.label/);
  /*
    The footer still publishes the address. It renders through <EmailLink> rather than a
    bare anchor since 2026-09-04 — the component wraps the link in Cloudflare's
    `<!--email_off-->` directive so the edge stops rewriting it into
    `/cdn-cgi/l/email-protection`, which Bing was reporting as a 404 and which hid the
    address from every crawler that does not run JavaScript.

    Asserted on the component and the address, not on the `mailto:` string: the point of
    this line is that the footer offers a direct email route, and pinning the exact anchor
    markup would fail again the next time that route is implemented differently while
    still being there.
  */
  assert.match(footer, /<EmailLink/);
  assert.match(footer, /address=\{siteSettings\.contact\.email\}/);

  /*
    The legal row is plain text, not buttons.

    This previously asserted `alibaba-hard-cta ... styles.alibabaCta` on Imprint, Contact
    and Privacy Notice. That is the black hard-shadow storefront CTA, and it rendered the
    legal row as three black slabs sitting next to a plain "Data preferences" — the
    lowest-priority links on the page reading as its primary action. The client rejected
    it on sight, 2026-08-31, and asked for the same marker treatment as the text beside it.

    The class itself is not going away: it belongs to the one Alibaba button in the
    header, which is what it was built for. The assertion below pins it out of the footer
    so the styling cannot drift back.
  */
  assert.doesNotMatch(footer, /alibaba-hard-cta/);
  assert.match(footer, /short-marker short-marker-compact[^\n]*text-brand/);
});

test("removing footer shortcuts does not remove their destination pages", () => {
  for (const route of [
    "downloads",
    "company",
    "certifications",
    "projects",
    "services",
    "events",
  ]) {
    assert.equal(
      existsSync(join(process.cwd(), "src", "app", "(en)", route, "page.tsx")),
      true,
      `expected /${route}/ page to remain available`,
    );
  }
  assert.equal(
    existsSync(join(process.cwd(), "src", "app", "(en)", "request", "price-list", "page.tsx")),
    true,
    "expected /request/price-list/ page to remain available",
  );
});
