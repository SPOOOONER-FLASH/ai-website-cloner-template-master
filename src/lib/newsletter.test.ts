import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("newsletter signup stays compatible with the static export and requires consent", () => {
  const form = readFileSync("src/components/site/NewsletterForm.tsx", "utf8");

  assert.match(form, /https:\/\/api\.web3forms\.com\/submit/);
  assert.match(form, /name="consent"/);
  assert.match(form, /type="checkbox"/);
  assert.match(form, /required/);
  assert.doesNotMatch(form, /server action|use server/i);
});

test("newsletter has a crawlable route and the footer links directly to it", () => {
  const page = readFileSync("src/app/(en)/newsletter/page.tsx", "utf8");
  const footer = readFileSync("src/components/site/SiteFooter.tsx", "utf8");
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");

  assert.match(page, /NewsletterForm/);
  assert.match(page, /pageMetadata/);
  assert.match(footer, /"\/newsletter"/);
  assert.match(sitemap, /entry\("\/newsletter"/);
});
