// Screenshots of the demo at fixed scroll points, in a real (headless) Edge so animations run.
import { chromium } from "playwright-core";
const [w = 1440, h = 900, tag = "d"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: +w, height: +h } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto("http://localhost:3005/");
  await page.evaluate(() => {});
await page.waitForTimeout(3600);
await page.screenshot({ path: `qa/${tag}-00-hero.jpg`, quality: 70 });
const total = await page.evaluate(() => document.documentElement.scrollHeight);
const ids = ["section.entries", ".facts", ".statement", "#export", "#export .families-board", "#range", "#factory", ".anatomy", ".rail-sec", ".timeline", "#contact"];
let n = 1;
for (const sel of ids) {
  await page.evaluate((s) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60); }, sel);
  await page.waitForTimeout(2400);
  await page.screenshot({ path: `qa/${tag}-${String(n++).padStart(2, "0")}.jpg`, quality: 70 });
}
// factory story: step through the sticky section
const f = await page.evaluate(() => { const el = document.querySelector("#factory"); return [el.offsetTop, el.offsetHeight]; });
for (const k of [0.45, 0.7, 0.95]) {
  await page.evaluate((y) => window.scrollTo(0, y), f[0] + f[1] * k - 900);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `qa/${tag}-story-${k}.jpg`, quality: 70 });
}
// timeline: halfway through its pinned runway
const t = await page.evaluate(() => { const el = document.querySelector(".timeline"); return [el.offsetTop, el.offsetHeight]; });
await page.evaluate((y) => window.scrollTo(0, y), t[0] + (t[1] - 900) * 0.6);
await page.waitForTimeout(1500);
await page.screenshot({ path: `qa/${tag}-timeline-mid.jpg`, quality: 70 });
// family index hover
await page.evaluate(() => window.scrollTo(0, document.querySelector("#range").offsetTop));
await page.waitForTimeout(800);
const li = await page.$$(".index-list li");
if (li[3]) { const b = await li[3].boundingBox(); await page.mouse.move(b.x + 300, b.y + b.height / 2); await page.waitForTimeout(900); }
await page.screenshot({ path: `qa/${tag}-index-hover.jpg`, quality: 70 });
console.log(JSON.stringify({ total, errors }));
await browser.close();
