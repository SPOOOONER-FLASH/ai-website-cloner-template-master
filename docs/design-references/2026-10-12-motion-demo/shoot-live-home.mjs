// Homepage checks on a running site: the opening curtain at three moments, then the factory
// story at each step. Default target is the worktree dev server.
import { chromium } from "playwright-core";
const [base = "http://localhost:3006"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(base + "/", { waitUntil: "commit", timeout: 240000 });
for (const t of [300, 700, 1100, 1700]) {
  await page.waitForTimeout(t === 300 ? 300 : 400);
  await page.screenshot({ path: `qa/live-intro-${t}.jpg`, quality: 60 });
}
await page.waitForLoadState("load");
const intro = await page.evaluate(() => { const el = document.querySelector("[class*=HomeIntro]"); return el ? getComputedStyle(el).visibility : "none"; });
const sec = await page.evaluate(() => { const el = document.querySelector("#factory-story-heading").closest("section"); return [el.offsetTop, el.offsetHeight]; });
const steps = 5;
for (let k = 0; k <= steps; k++) {
  const y = sec[0] + (sec[1] - 900) * (k / steps) - 1;
  await page.evaluate((y) => window.scrollTo(0, y), Math.max(sec[0], y));
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `qa/live-story-${k}.jpg`, quality: 60 });
}
const states = await page.evaluate(() => [...document.querySelectorAll("[data-shot]")].map((s) => s.dataset.shot).join(","));
const p = await page.evaluate(() => document.querySelector("[data-stage]").style.getPropertyValue("--story-p"));
// second visit in the same session: no curtain
await page.goto(base + "/", { waitUntil: "load" });
const skip = await page.evaluate(() => document.documentElement.dataset.intro);
console.log(JSON.stringify({ intro, states, p, skip, errors: errors.slice(0, 5) }));
await browser.close();
