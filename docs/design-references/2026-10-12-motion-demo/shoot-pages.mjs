// Screenshots of the product and guide previews from dist/ (file://), desktop and phone.
import { chromium } from "playwright-core";
import path from "node:path";
import { pathToFileURL } from "node:url";
const base = pathToFileURL(path.resolve(import.meta.dirname, "dist/index.html")).href;
const browser = await chromium.launch({ channel: "msedge" });
const errors = [];
for (const [w, h, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of ["product", "guide"]) {
    await page.goto(`${base}#/${route}`); await page.waitForTimeout(1600);
    const H = await page.evaluate(() => document.body.scrollHeight);
    const stops = tag === "d" ? 7 : 6;
    for (let k = 0; k < stops; k++) {
      const y = Math.round((H - h) * (k / (stops - 1)));
      await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(1400);
      await page.screenshot({ path: `qa/p-${tag}-${route}-${k}.jpg`, quality: 62 });
    }
    console.log(tag, route, H);
  }
  await page.close();
}
console.log(JSON.stringify({ errors }));
await browser.close();
