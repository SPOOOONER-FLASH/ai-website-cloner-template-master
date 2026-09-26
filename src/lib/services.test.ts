import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("the service hub is crawlable and reachable without crowding the header", () => {
  // Copy moved into the component on 2026-09-24 so Spanish and Portuguese are one edit.
  const page = readFileSync("src/components/site/ServicesView.tsx", "utf8");
  const navigation = JSON.parse(readFileSync("content/navigation.json", "utf8")) as {
    header: Array<{ href: string }>;
    footer: Array<{ href: string }>;
  };
  const sitemap = readFileSync("src/lib/site-sitemap.ts", "utf8");

  // OEM / private label leads (client steer 2026-09-24), in the copy and the metadata.
  // 2026-09-25 the title took "custom" and "bespoke ironmongery" (client: 开模定制 is the specialty,
  // ironmongery the trade's name); OEM stays in the title, private-label moved to the description.
  const meta = readFileSync("src/app/(en)/services/page.tsx", "utf8");
  assert.match(page, /private-label brand/i);
  assert.match(meta, /title: "OEM & Custom Door Hardware/);
  assert.match(meta, /description:\s*"OEM, private-label and custom/);
  assert.equal(navigation.header.some((link) => link.href === "/services"), false);
  assert.match(sitemap, /entry\("\/services"/);

  /*
    2026-08-31: the footer's "How to buy" column was cut to the four buying routes
    (Contact, FAQ, Alibaba, the mailbox) per the approved design in
    docs/superpowers/specs/2026-08-31-hyde-sales-imagery-watermark-footer-design.md,
    which took /services out of content/navigation.json's footer array.

    This test's job is unchanged — Services must stay reachable by a crawler and by a
    person, and must not be pushed into the top nav — so it now checks the two routes
    that actually carry it: the site menu drawer, and the desktop Company shelf.
  */
  const drawer = readFileSync("src/components/site/menu-experience.ts", "utf8");
  const header = readFileSync("src/components/site/SiteHeader.tsx", "utf8");
  assert.match(drawer, /href: "\/services\/"/);
  assert.match(header, /href: "\/services"/);
});

test("service copy routes buyers to existing inquiry and selection tools", () => {
  const page = readFileSync("src/components/site/ServicesView.tsx", "utf8");

  // Through localisedHref, so a Spanish or Portuguese page stays in its own tree.
  assert.match(page, /href\("\/contact"\)/);
  assert.match(page, /href\("\/product-finder"\)/);
  assert.match(page, /href\("\/downloads"\)/);
});

test("the service brief is written plainly and the whole panel opens an inquiry", () => {
  const page = readFileSync("src/components/site/ServicesView.tsx", "utf8");

  // Wording rewritten for OEM buyers by the copy session (2026-09-24); the intent is kept:
  // four plain items, and the whole panel is one link to the contact form.
  assert.doesNotMatch(page, /The first useful package/);
  assert.match(page, /We need four things from you/);
  assert.match(page, /Send your brief/);
  assert.match(page, /<Link[\s\S]*?href=\{href\("\/contact"\)\}[\s\S]*?c\.briefHeading[\s\S]*?<\/Link>/);
});
