/* Run against the static export: node scripts/verify-guides-editorial.mjs <playwright-core path> [base URL]. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(process.argv[2] ? pathToFileURL(resolve(process.argv[2], 'index.mjs')).href : 'playwright-core');
const base = process.argv[3] || 'http://127.0.0.1:4197';
const output = 'tmp/codex-guides-editorial-qa';
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const report = [];
  try {
    for (const locale of ['en', 'es', 'pt']) {
      const prefix = locale === 'en' ? '' : '/' + locale;
      await page.setViewportSize({ width: 1440, height: 1050 });
      await page.goto(base + prefix + '/guides/', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#guide-library article').count(), 40);
      assert.equal(await page.locator('main img[src*="guides-reference-desk"]').count(), 0);
      assert.equal(await page.locator('main a[href*="/guides/"]').evaluateAll((links, prefix) => links.every(link => link.getAttribute('href').startsWith(prefix + '/guides/')), prefix), true);
      await page.screenshot({ path: output + '/' + locale + '-desktop.png' });
      await page.locator('#guide-library input').fill('LC04');
      const modelCount = await page.locator('#guide-library article').count();
      assert.ok(modelCount > 0 && modelCount < 40);
      await page.locator('#guide-library input').fill('no-such-guide-xyz');
      assert.equal(await page.locator('#guide-library article').count(), 0);
      await page.locator('#guide-library input').fill('');
      await page.locator('#guide-library [role="group"] button').nth(2).click();
      assert.equal(await page.locator('#guide-library article').count(), 6);
      await page.locator('#guide-library [role="group"] button').first().click();
      assert.equal(await page.locator('#guide-library article').count(), 40);
      for (const width of [768, 390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        await page.evaluate(() => scrollTo(0, 0));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), locale + ' overflow at ' + width);
        if (width === 390) {
          await page.screenshot({ path: output + '/' + locale + '-mobile.png' });
          await page.locator('#guide-library').scrollIntoViewIfNeeded();
          await page.screenshot({ path: output + '/' + locale + '-mobile-library.png' });
        }
      }
      await page.goto(base + prefix + '/guides/euro-cylinder-size-chart-2026/', { waitUntil: 'networkidle' });
      await page.setViewportSize({ width: 390, height: 844 });
      assert.ok(await page.locator('table').count() > 0);
      assert.ok(await page.locator('details').count() >= 6);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), locale + ' article overflow');
      assert.equal(await page.locator('nav[aria-label] a[href^="#"]').evaluateAll(links => links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))), true);
      await page.screenshot({ path: output + '/' + locale + '-article-mobile.png' });
      await page.setViewportSize({ width: 1440, height: 1050 });
      await page.screenshot({ path: output + '/' + locale + '-article-desktop.png' });
      await page.goto(base + prefix + '/guides/corrosion-resistance-en-1670-2026/', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('main img[src*="guides-reference-desk"]').count(), 0);
      report.push({ locale, articles: 40, materialArticles: 6, modelResults: modelCount, widths: [1440, 768, 390, 320], articleNavigation: 'passed' });
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(output + '/report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
