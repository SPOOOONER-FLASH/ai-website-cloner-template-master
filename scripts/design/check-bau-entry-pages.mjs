#!/usr/bin/env node
/** Verify the shipped BAU entrances in static HTML and a real browser; never submit a form. */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.BAU_QA_PLAYWRIGHT || "playwright");
const base = (process.argv[2] || "http://127.0.0.1:8769").replace(/\/$/, "");
const output = path.resolve(process.argv[3] || "tmp/codex-bau-entry-qa");
const locales = ["en", "es", "pt", "fr", "de", "ja", "ko", "tr", "ru", "ar"];
const event = JSON.parse(await readFile("content/bau-2027.json", "utf8")).event;
const home = (locale) => locale === "en" ? "/" : `/${locale}/`;
const sections = ["[data-bau-info-band]", "[data-bau-showcase]"];
await mkdir(output, { recursive: true });

// Initial HTML must carry both working destinations, without hydration or a menu action.
for (const locale of locales) {
  const response = await fetch(`${base}${home(locale)}`);
  assert.equal(response.status, 200, `${locale} homepage status`);
  const html = await response.text();
  for (const marker of ["data-bau-info-band", "data-bau-showcase"]) {
    const block = html.match(new RegExp(`<section\\b[^>]*${marker}[^>]*>[\\s\\S]*?<\\/section>`))?.[0];
    assert.ok(block, `${locale}: ${marker} present in initial HTML`);
    assert.match(block, /<a\b[^>]*href="\/bau-2027\/"/, `${locale}: English entrance`);
    assert.match(block, /<a\b[^>]*href="\/de\/bau-2027\/"/, `${locale}: German entrance`);
    assert.ok(block.includes(event.hall) && block.includes(event.stand), `${locale}: published stand`);
  }
}
for (const route of ["/bau-2027/", "/de/bau-2027/"]) {
  const response = await fetch(`${base}${route}`);
  assert.equal(response.status, 200, `${route} status`);
  const html = await response.text();
  assert.match(html, /id="bau-form"/, `${route} booking form retained`);
  assert.match(html, /<form\b/, `${route} form markup retained`);
}

const cases = [
  ["en", 1440], ["en", 1024], ["en", 390], ["en", 320],
  ["de", 1440], ["de", 390], ["de", 320],
  ...locales.filter((locale) => !["en", "de"].includes(locale)).map((locale) => [locale, 390]),
];
const screenshots = new Set(["en-1440", "en-390", "de-390"]);
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const results = [];
try {
  for (const [locale, width] of cases) {
    const context = await browser.newContext({ viewport: { width, height: 1100 } });
    // These checks use the local export. Third-party analytics are outside the tested path.
    await context.route("**/*", async (route) => {
      const url = route.request().url();
      if (/^https?:/.test(url) && !url.startsWith(base)) await route.abort();
      else await route.continue();
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.url().startsWith(base) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    const response = await page.goto(`${base}${home(locale)}`, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    await page.evaluate(() => document.fonts.ready);
    for (const selector of sections) {
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await section.locator("img").evaluateAll((images) => Promise.all(images.map((img) => img.complete ? null : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }))));
      const inspection = await section.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const descendants = [...element.querySelectorAll("*")];
        return {
          height: Math.round(box.height),
          overflow: descendants.filter((item) => {
            const rect = item.getBoundingClientRect();
            return rect.width && (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1);
          }).map((item) => item.tagName),
          links: [...element.querySelectorAll("a")].map((link) => ({
            href: link.getAttribute("href"), language: link.getAttribute("hreflang"),
            height: link.getBoundingClientRect().height,
          })),
          images: [...element.querySelectorAll("img")].map((img) => ({
            complete: img.complete && img.naturalWidth > 0,
            fit: getComputedStyle(img).objectFit,
            source: img.currentSrc,
            renderedWidth: Math.round(img.getBoundingClientRect().width),
          })),
        };
      });
      assert.deepEqual(inspection.overflow, [], `${locale}/${width}: ${selector} overflow`);
      assert.ok(inspection.links.every((link) => link.height >= 44), `${locale}/${width}: touch targets`);
      assert.ok(inspection.images.every((img) => img.complete && img.fit === "contain"), `${locale}/${width}: complete product photos`);
      const expectedPrimary = locale === "de" ? "/de/bau-2027/" : "/bau-2027/";
      assert.equal(inspection.links[0].href, expectedPrimary, `${locale}: primary destination`);
      results.push({ locale, width, selector, ...inspection });
      if (screenshots.has(`${locale}-${width}`)) {
        const label = selector.includes("info-band") ? "band" : "showcase";
        await section.screenshot({ path: path.join(output, `${locale}-${width}-${label}.png`) });
      }
    }
    await page.locator(sections[0]).locator("a").first().focus();
    const focus = await page.locator(sections[0]).locator("a").first().evaluate((element) => getComputedStyle(element).outlineStyle);
    assert.notEqual(focus, "none", `${locale}/${width}: visible keyboard focus`);
    await page.evaluate(() => window.scrollTo(0, 1600));
    const sticky = await page.locator(".sticky.top-0").first().boundingBox();
    assert.ok(Math.abs(sticky.y) <= 1, `${locale}/${width}: navigation remains sticky`);
    const band = await page.locator(sections[0]).boundingBox();
    assert.ok(band.y + band.height < 0, `${locale}/${width}: information band scrolls away`);
    assert.deepEqual(errors, [], `${locale}/${width}: browser errors`);
    await context.close();
  }
  // Follow both actual entrances. No meeting request is sent during verification.
  for (const language of ["en", "de"]) {
    const page = await browser.newPage();
    await page.goto(`${base}${home(language)}`);
    await page.locator(sections[0]).locator("a").first().click();
    await page.waitForURL(`**${language === "de" ? "/de" : ""}/bau-2027/`);
    assert.equal(await page.locator("#bau-form").count(), 1, `${language}: booking arrival`);
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(path.join(output, "results.json"), JSON.stringify(results, null, 2) + "\n");
}
console.log(`BAU entry QA passed: 10 initial HTML homepages, EN/DE forms, ${cases.length} browser states, real links and preserved sticky navigation.`);
