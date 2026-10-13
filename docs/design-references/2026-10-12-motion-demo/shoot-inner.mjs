// Full-page screenshots of live inner pages, for the inner-page design review.
import { chromium } from "playwright-core";
const pages = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const url of pages) {
    await page.goto(url, { waitUntil: "load", timeout: 120000 });
    await page.waitForTimeout(2000);
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(800);
    const name = url.split("/").filter(Boolean).pop();
    await page.screenshot({ path: `qa/live-${tag}-${name}.jpg`, quality: 60, fullPage: true });
    console.log(tag, name, await page.evaluate(() => document.body.scrollHeight));
  }
  await page.close();
}
await browser.close();
