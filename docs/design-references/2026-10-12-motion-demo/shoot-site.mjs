// Screenshots of the three homepage sections on a running site (default: the dev server).
import { chromium } from "playwright-core";
const [base = "http://localhost:3006", w = 1440, h = 900, tag = "s"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/", { waitUntil: "load", timeout: 240000 });
await page.waitForTimeout(2500);
for (const [sel, name] of [["#family-index-heading", "family"], ["#export-map-heading", "map"], ["#factory-story-heading", "story"]]) {
  await page.evaluate((s) => { const el = document.querySelector(s)?.closest("section"); if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 40); }, sel);
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `qa/${tag}-${name}.jpg`, quality: 70 });
}
// family hover, story mid-scroll, map bars
await page.evaluate(() => document.querySelector("#family-index-heading").closest("section").scrollIntoView());
await page.waitForTimeout(600);
const li = await page.$$("[data-family]");
if (li[2]) { const b = await li[2].boundingBox(); await page.mouse.move(b.x + 280, b.y + b.height / 2); await page.mouse.move(b.x + 300, b.y + b.height / 2); await page.waitForTimeout(900); }
await page.screenshot({ path: `qa/${tag}-family-hover.jpg`, quality: 70 });
const s = await page.evaluate(() => { const el = document.querySelector("#factory-story-heading").closest("section"); return [el.offsetTop, el.offsetHeight]; });
await page.evaluate((y) => window.scrollTo(0, y), s[0] + s[1] * 0.62 - 450);
await page.waitForTimeout(1800);
await page.screenshot({ path: `qa/${tag}-story-mid.jpg`, quality: 70 });
await page.evaluate(() => { const el = document.querySelector("#export-map-heading").closest("section"); window.scrollTo(0, el.offsetTop + el.offsetHeight - 900); });
await page.waitForTimeout(2200);
await page.screenshot({ path: `qa/${tag}-map-bars.jpg`, quality: 70 });
console.log(JSON.stringify({ errors }));
await browser.close();
