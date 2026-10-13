// Screenshots of live-site pages (default: worktree dev server) at fixed scroll stops,
// desktop and phone, plus a horizontal-overflow check. Usage: node shoot-live-pages.mjs <path>... [--base URL] [--tag t]
import { chromium } from "playwright-core";
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args.splice(i, 2)[1] : d; };
const base = opt("--base", "http://localhost:3006");
const tag = opt("--tag", "lp");
const browser = await chromium.launch({ channel: "msedge" });
const out = [];
for (const [w, h, dev] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of args) {
    await page.goto(base + path, { waitUntil: "load", timeout: 300000 });
    await page.waitForTimeout(1500);
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    const stops = dev === "d" ? 8 : 6;
    const name = path.split("/").filter(Boolean).pop();
    for (let k = 0; k < stops; k++) {
      await page.evaluate((y) => window.scrollTo(0, y), Math.round((H - h) * (k / (stops - 1))));
      await page.waitForTimeout(900);
      await page.screenshot({ path: `qa/${tag}-${dev}-${name}-${k}.jpg`, quality: 60 });
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    out.push({ dev, name, H, overflow });
  }
  out.push({ dev, errors: errors.slice(0, 3) });
  await page.close();
}
console.log(JSON.stringify(out));
await browser.close();
