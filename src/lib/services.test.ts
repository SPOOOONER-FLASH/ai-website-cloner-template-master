import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("the service hub is crawlable and reachable without crowding the header", () => {
  const page = readFileSync("src/app/(en)/services/page.tsx", "utf8");
  const navigation = JSON.parse(readFileSync("content/navigation.json", "utf8")) as {
    header: Array<{ href: string }>;
    footer: Array<{ href: string }>;
  };
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");

  assert.match(page, /Product selection|hardware schedule/i);
  assert.match(page, /OEM|private-label/i);
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
  const drawer = readFileSync("src/components/site/SiteMenuDrawer.tsx", "utf8");
  const header = readFileSync("src/components/site/SiteHeader.tsx", "utf8");
  assert.match(drawer, /href: "\/services\/"/);
  assert.match(header, /href: "\/services"/);
});

test("service copy routes buyers to existing enquiry and selection tools", () => {
  const page = readFileSync("src/app/(en)/services/page.tsx", "utf8");

  assert.match(page, /href="\/contact"/);
  assert.match(page, /href="\/product-finder"/);
  assert.match(page, /href="\/downloads"/);
});

test("the service brief is written plainly and the whole panel opens an enquiry", () => {
  const page = readFileSync("src/app/(en)/services/page.tsx", "utf8");

  assert.doesNotMatch(page, /The first useful package/);
  assert.match(page, /Prepare your enquiry/);
  assert.match(page, /Start with these four details/);
  assert.match(page, /Send this brief/);
  assert.match(
    page,
    /<Link[\s\S]*?href="\/contact"[\s\S]*?Start with these four details[\s\S]*?<\/Link>/,
  );
});
