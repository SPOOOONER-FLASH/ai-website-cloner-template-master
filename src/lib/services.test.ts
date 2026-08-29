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
  assert.equal(navigation.footer.some((link) => link.href === "/services"), true);
  assert.match(sitemap, /entry\("\/services"/);
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
