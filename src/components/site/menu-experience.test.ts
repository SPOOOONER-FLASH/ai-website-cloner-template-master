import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import {
  MENU_VARIANT,
  getMenuExperience,
  type MenuVariant,
} from "./menu-experience.ts";

const root = process.cwd();

test("RFQ Concierge is live while Specify Source Company remains switchable", () => {
  assert.equal(MENU_VARIANT, "rfq-concierge");

  const backup: MenuVariant = "specify-source-company";
  const backupMenu = getMenuExperience("en", backup);
  assert.equal(backupMenu.kind, backup);
  assert.deepEqual(
    backupMenu.groups.map((group) => group.title),
    ["Specify", "Source", "Company"],
  );
});

test("RFQ Concierge routes three buyer states to truthful existing tools", () => {
  const english = getMenuExperience("en", "rfq-concierge");
  const spanish = getMenuExperience("es", "rfq-concierge");

  assert.equal(english.kind, "rfq-concierge");
  assert.equal(spanish.kind, "rfq-concierge");
  assert.deepEqual(
    english.primary.map((item) => item.href),
    ["/product-finder/", "/configurator/", "/contact/"],
  );
  assert.deepEqual(
    spanish.primary.map((item) => item.href),
    ["/es/product-finder/", "/es/configurator/", "/es/contact/"],
  );
  assert.doesNotMatch(JSON.stringify([english, spanish]), /search by number/i);
  assert.match(english.primary[0].detail, /browse and filter published models/i);
});

test("menu variants keep the real bilingual discovery and evidence routes", () => {
  for (const locale of ["en", "es"] as const) {
    for (const variant of ["rfq-concierge", "specify-source-company"] as const) {
      const menu = getMenuExperience(locale, variant);
      const hrefs = menu.groups.flatMap((group) => group.links.map((link) => link.href));
      const prefix = locale === "es" ? "/es" : "";

      assert.ok(hrefs.includes(`${prefix}/products/`));
      assert.ok(hrefs.includes(`${prefix}/projects/`));
      assert.ok(hrefs.includes(`${prefix}/news/`));
      assert.ok(hrefs.includes(`${prefix}/company/`));
      assert.ok(hrefs.includes(`${prefix}/downloads/`));
      assert.ok(hrefs.includes(`${prefix}/certifications/`));
      assert.ok(hrefs.includes("/services/"));
      assert.doesNotMatch(hrefs.join("\n"), /\/es\/services\//);
    }
  }
});

test("the drawer renders one selected variant inside a focus-safe dialog", () => {
  const drawer = readFileSync(join(root, "src", "components", "site", "SiteMenuDrawer.tsx"), "utf8");
  const header = readFileSync(join(root, "src", "components", "site", "SiteHeader.tsx"), "utf8");

  assert.match(drawer, /getMenuExperience\(locale, MENU_VARIANT\)/);
  assert.match(drawer, /experience\.kind === "rfq-concierge"/);
  assert.doesNotMatch(drawer, /display:\s*none|aria-hidden=\{MENU_VARIANT/);
  assert.match(drawer, /id="site-menu-dialog"/);
  assert.match(drawer, /closeButtonRef\.current\?\.focus\(\)/);
  assert.match(drawer, /event\.key === "Tab"/);
  assert.match(drawer, /event\.key === "Escape"/);
  assert.match(header, /aria-controls="site-menu-dialog"/);
  assert.match(header, /menuTriggerRef\.current\?\.focus\(\)/);
});
