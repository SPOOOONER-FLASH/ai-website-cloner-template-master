import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const runtime = process.env.BAU_PREVIEW_PLAYWRIGHT;
if (!runtime) throw new Error("Set BAU_PREVIEW_PLAYWRIGHT to the already installed Playwright package.");
const require = createRequire(import.meta.url);
const { chromium } = require(runtime);
const output = path.resolve("tmp/codex-bau-visual-review/preview-qa");
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: "chrome" });
const records = [];
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1056, height: 2100 }, deviceScaleFactor: 1 });
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(process.argv[2] ?? "http://127.0.0.1:8768/", { waitUntil: "networkidle" });
  const frame = page.frames().find(item => item !== page.mainFrame());
  if (!frame) throw new Error("Missing visualization sandbox");
  await frame.locator(".viz-carousel-controls").waitFor();
  await frame.evaluate(() => document.fonts.ready);
  for (const mode of ["desktop", "phone", "narrow"]) {
    await page.setViewportSize({ width: mode === "narrow" ? 352 : 1056, height: 2100 });
    await frame.locator(`button[data-device="${mode === "phone" ? "phone" : "desktop"}"]`).click();
    for (let index = 0; index < 4; index += 1) {
      await frame.locator(".viz-carousel-picker summary").click();
      await frame.locator(".viz-carousel-options button").nth(index).click();
      const record = await frame.evaluate(() => {
        const root = document.getElementById("hyde-bau-options");
        const variant = root.querySelector("[data-variant]:not([hidden])");
        const mock = variant.querySelector(".hyde-page");
        const bounds = mock.getBoundingClientRect();
        const allBounds = [...mock.querySelectorAll("*")].filter(item => item.getClientRects().length).map(item => ({ item, rect:item.getBoundingClientRect() }));
        const overflow = allBounds.filter(({ rect }) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1).map(({ item }) => ({ tag:item.tagName, class:item.className }));
        return {
          name:variant.dataset.variant,
          device:root.dataset.device,
          width:Math.round(bounds.width),
          contentHeight:Math.round(bounds.height),
          stageHeight:Math.round(variant.querySelector(".preview-stage").getBoundingClientRect().height),
          overflow,
          brokenImages:[...mock.querySelectorAll("img")].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.alt),
          eventLinks:[...mock.querySelectorAll('a[href*="bau-2027"]')].map(link => link.href),
          productFit:[...mock.querySelectorAll(".product-composition img,.shelf-item img,.source-card > img")].map(image => getComputedStyle(image).objectFit),
        };
      });
      record.mode = mode;
      records.push(record);
      if (record.overflow.length || record.brokenImages.length || record.productFit.some(fit => fit !== "contain")) {
        throw new Error(`Layout/asset failure: ${JSON.stringify(record)}`);
      }
      if (!record.eventLinks.includes("https://cantonlock.com/bau-2027/") || !record.eventLinks.includes("https://cantonlock.com/de/bau-2027/")) {
        throw new Error(`Missing EN/DE meeting link in ${record.name}`);
      }
      const mock = frame.locator("[data-variant]:not([hidden]) .hyde-page");
      await frame.evaluate(() => scrollTo(0, 0));
      await page.evaluate(() => scrollTo(0, 0));
      await mock.screenshot({ path:path.join(output, `${mode}-${index + 1}.png`) });
      const toggle = mock.locator("[data-menu-toggle]");
      await toggle.click();
      await toggle.evaluate(element => new Promise(resolve => requestAnimationFrame(() => resolve(element.getAttribute("aria-expanded")))));
      if (await toggle.getAttribute("aria-expanded") !== "true") throw new Error(`Menu did not open: ${mode} ${index + 1}`);
      await toggle.click();
      await toggle.evaluate(element => new Promise(resolve => requestAnimationFrame(() => resolve(element.getAttribute("aria-expanded")))));
      if (await toggle.getAttribute("aria-expanded") !== "false") throw new Error(`Menu did not close: ${mode} ${index + 1}`);
    }
  }
  if (errors.length) throw new Error(`Browser errors: ${errors.join("; ")}`);
  fs.writeFileSync(path.join(output, "results.json"), `${JSON.stringify({ records, errors }, null, 2)}\n`);
  console.log(JSON.stringify({ variants:4, states:records.length, errors, overflow:0, brokenImages:0, screenshots:output, sizes:records.map(({ mode, name, width, contentHeight, stageHeight }) => ({ mode, name, width, contentHeight, stageHeight })) }, null, 2));
} finally {
  await browser.close();
}
