import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const componentRoot = join(process.cwd(), "src", "components", "site");
const header = readFileSync(join(componentRoot, "SiteHeader.tsx"), "utf8");
const drawer = readFileSync(join(componentRoot, "SiteMenuDrawer.tsx"), "utf8");
const css = readFileSync(join(process.cwd(), "src", "app", "globals.css"), "utf8");

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
    assert.match(drawer, new RegExp(route.replaceAll("/", "\\/")));
  }
  assert.match(drawer, /Buy it now/);
  assert.match(drawer, /Comprar ahora/);
  assert.match(drawer, /Price list/);
  assert.match(drawer, /Lista de precios/);
});
