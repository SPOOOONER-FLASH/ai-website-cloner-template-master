#!/usr/bin/env node
/**
 * Reproduce HYDE entrance spacing, viewport overflow, and critical-resource failures.
 * No dependencies, clicks, form submissions, or changes to the inspected site.
 *
 * node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:4173
 * node scripts/audit-hyde-desktop-rhythm.mjs --page home,contact --width 1440
 * Evidence is written under ignored tmp/ by default. Requires Chrome and Node 22+.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const PAGES = {
  home: "",
  "product-finder": "product-finder/",
  guides: "guides/",
  "product-studies": "product-studies/",
  contact: "contact/",
};
const VIEWPORTS = {
  390: { width: 390, height: 844 },
  1440: { width: 1440, height: 900 },
  1920: { width: 1920, height: 1080 },
};
const CRITICAL_TYPES = new Set(["Script", "Stylesheet", "Image"]);

function optionsFromArgs(args) {
  const options = {
    base: "https://cantonlock.com/",
    out: "tmp/codex-desktop-browser",
    chrome: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    settleMs: 800,
    pages: Object.keys(PAGES),
    viewports: Object.values(VIEWPORTS),
  };
  for (let i = 0; i < args.length; i += 1) {
    const flag = args[i];
    if (flag === "--help") {
      console.log("Usage: node scripts/audit-hyde-desktop-rhythm.mjs [--base URL] [--out DIR] [--page home,product-finder,guides,product-studies,contact] [--width 390,1440,1920 | WIDTHxHEIGHT] [--settle-ms 800] [--chrome PATH]");
      process.exit(0);
    }
    const value = args[++i];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${flag}`);
    if (flag === "--base" || flag === "--out" || flag === "--chrome") {
      options[flag.slice(2)] = value;
    } else if (flag === "--page") {
      options.pages = value.split(",");
      for (const page of options.pages) {
        if (!(page in PAGES)) throw new Error(`Unknown page: ${page}`);
      }
    } else if (flag === "--width") {
      options.viewports = value.split(",").map((viewport) => {
        if (VIEWPORTS[viewport]) return VIEWPORTS[viewport];
        const match = /^(\d{3,4})x(\d{3,4})$/.exec(viewport);
        if (!match) throw new Error(`Unknown viewport: ${viewport}; use 390, 1440, 1920, or WIDTHxHEIGHT`);
        return { width: Number(match[1]), height: Number(match[2]) };
      });
    } else if (flag === "--settle-ms") {
      options.settleMs = Number(value);
      if (!Number.isFinite(options.settleMs) || options.settleMs < 0 || options.settleMs > 30000) throw new Error("Settle wait must be between 0 and 30000 milliseconds");
    } else {
      throw new Error(`Unknown option: ${flag}`);
    }
  }
  const base = new URL(options.base);
  if (!["http:", "https:"].includes(base.protocol)) throw new Error("Base must be an HTTP(S) URL");
  options.base = base.href.endsWith("/") ? base.href : `${base.href}/`;
  options.out = path.resolve(options.out);
  return options;
}

async function connect(url, onEvent) {
  const socket = new WebSocket(url);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) {
      onEvent(message.method, message.params ?? {});
      return;
    }
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(`${request.method}: ${message.error.message}`));
    else request.resolve(message.result);
  });
  socket.addEventListener("close", () => {
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(new Error(`DevTools closed during ${request.method}`));
    }
    pending.clear();
  });
  return {
    socket,
    send(method, params = {}, timeout = 20000) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`${method} timed out after ${timeout}ms`));
        }, timeout);
        pending.set(id, { resolve, reject, timer, method });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

const metricsExpression = `(() => {
  const round = value => Math.round(value * 10) / 10;
  const rect = node => {
    if (!node) return null;
    const box = node.getBoundingClientRect();
    return { x: round(box.x), y: round(box.y), documentY: round(box.y + scrollY), width: round(box.width), height: round(box.height), bottom: round(box.bottom) };
  };
  const label = node => (node.innerText || node.getAttribute('aria-label') || node.value || '').replace(/\\s+/g, ' ').trim().slice(0, 140);
  const visible = node => {
    const box = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return !node.closest('[inert], [aria-hidden="true"]') && box.width > 0 && box.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && Number(style.opacity) !== 0;
  };
  const ctas = [...document.querySelectorAll('main a[href], main button, main input[type="submit"]')]
    .filter(visible)
    .filter(node => node.closest('section[aria-roledescription="carousel"]') || /contact|inquir|enquir|request|quote|send|browse|explore|discover|learn more|view products|product finder|talk to/i.test(label(node) + ' ' + (node.getAttribute('href') || '')))
    .map(node => {
      const box = rect(node);
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;
      const centerInViewport = centerX >= 0 && centerX <= innerWidth && centerY >= 0 && centerY <= innerHeight;
      const topNode = centerInViewport ? document.elementFromPoint(centerX, centerY) : null;
      const occluded = !!topNode && !node.contains(topNode) && !topNode.contains(node);
      return { label: label(node), href: node.getAttribute('href'), ...box, aboveFold: box.y >= 0 && box.bottom <= innerHeight, intersectsViewport: box.bottom > 0 && box.y < innerHeight, occluded, occludedBy: occluded ? { tag: topNode.tagName, className: String(topNode.className).slice(0, 180) } : null };
    });
  const viewportImages = [...document.images].filter(node => {
    const box = node.getBoundingClientRect();
    return box.bottom > 0 && box.top < innerHeight && box.right > 0 && box.left < innerWidth;
  });
  const hero = document.querySelector('section[aria-roledescription="carousel"]');
  const activeCaption = hero?.querySelector('.hero-caption-slide[data-active="true"]');
  return {
    url: location.href, title: document.title, readyState: document.readyState,
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth || 0),
    header: rect(document.querySelector('body .sticky.top-0') || document.querySelector('header')), main: rect(document.querySelector('main')),
    h1: rect(document.querySelector('h1')), h1Text: label(document.querySelector('h1') || document.createElement('span')),
    h1Count: document.querySelectorAll('h1').length,
    hero: hero ? { ...rect(hero), media: rect(hero.firstElementChild), activeCaption: rect(activeCaption), captionTitle: label(activeCaption?.querySelector('h2') || document.createElement('span')) } : null,
    floatingPromos: [...document.querySelectorAll('aside[aria-label]')].filter(node => getComputedStyle(node).position === 'fixed').map(node => ({ label: node.getAttribute('aria-label'), ...rect(node) })),
    aboveFoldCtas: ctas.filter(cta => cta.intersectsViewport).slice(0, 12),
    firstMainCtas: ctas.slice(0, 8),
    images: { total: document.images.length, viewport: viewportImages.length, loadedInViewport: viewportImages.filter(image => image.complete && image.naturalWidth > 0).length, unresolvedInViewport: viewportImages.filter(image => !image.complete || image.naturalWidth === 0).map(image => ({ src: image.currentSrc || image.src, complete: image.complete })).slice(0, 12) }
  };
})()`;

async function inspectScenario(port, options, page, viewport) {
  const url = new URL(PAGES[page], options.base).href;
  const origin = new URL(url).origin;
  const requests = new Map();
  const loading = new Set();
  const failedResources = [];
  const pageErrors = [];
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?about%3Ablank`, { method: "PUT" });
  if (!targetResponse.ok) throw new Error(`DevTools target returned ${targetResponse.status}`);
  const target = await targetResponse.json();
  const sameOriginCritical = (request) => request && CRITICAL_TYPES.has(request.type) && request.url.startsWith(`${origin}/`);
  const client = await connect(target.webSocketDebuggerUrl, (method, params) => {
    if (method === "Network.requestWillBeSent") {
      const request = { url: params.request.url, type: params.type };
      requests.set(params.requestId, request);
      if (sameOriginCritical(request)) loading.add(params.requestId);
    } else if (method === "Network.responseReceived") {
      const request = { url: params.response.url, type: params.type };
      if (sameOriginCritical(request) && params.response.status >= 400) {
        failedResources.push({ ...request, status: params.response.status });
      }
    } else if (method === "Network.loadingFailed") {
      loading.delete(params.requestId);
      const request = requests.get(params.requestId);
      if (sameOriginCritical(request)) {
        failedResources.push({ ...request, error: params.errorText, canceled: params.canceled ?? false });
      }
    } else if (method === "Network.loadingFinished") {
      loading.delete(params.requestId);
    } else if (method === "Runtime.exceptionThrown") {
      const exception = params.exceptionDetails;
      pageErrors.push({ message: (exception.exception?.description || exception.text).slice(0, 1200), url: exception.url, line: exception.lineNumber });
    }
  });
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Emulation.setDeviceMetricsOverride", { ...viewport, deviceScaleFactor: 1, mobile: viewport.width < 744, screenWidth: viewport.width, screenHeight: viewport.height });
    await client.send("Emulation.setTouchEmulationEnabled", { enabled: viewport.width < 744 });
    const navigation = await client.send("Page.navigate", { url });
    if (navigation.errorText) throw new Error(`Navigation failed: ${navigation.errorText}`);
    const deadline = Date.now() + 12000;
    while (Date.now() < deadline) {
      const ready = await evaluate(client, "document.readyState === 'complete' && !!document.querySelector('main')");
      if (ready && loading.size === 0) break;
      await delay(200);
    }
    await evaluate(client, `(async () => {
      await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 1600))]);
      const images = [...document.images].filter(image => {
        const box = image.getBoundingClientRect();
        return box.bottom > 0 && box.top < innerHeight;
      });
      await Promise.race([Promise.all(images.map(image => image.complete ? image.decode().catch(() => {}) : new Promise(resolve => { image.addEventListener('load', resolve, {once:true}); image.addEventListener('error', resolve, {once:true}); }))), new Promise(resolve => setTimeout(resolve, 2200))]);
      return true;
    })()`);
    await delay(options.settleMs);
    const metrics = await evaluate(client, metricsExpression);
    const filename = `${page}-${viewport.width}x${viewport.height}.png`;
    const screenshot = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
    await writeFile(path.join(options.out, filename), Buffer.from(screenshot.data, "base64"));
    const result = { page, requestedViewport: viewport, ...metrics, failedResources, pageErrors, pendingCriticalRequests: [...loading].map(id => requests.get(id)), screenshot: filename };
    result.hardFailures = [];
    if (metrics.viewport.width !== viewport.width) result.hardFailures.push("Viewport width differs from requested width");
    if (metrics.scrollWidth > viewport.width + 1) result.hardFailures.push(`Horizontal overflow: ${metrics.scrollWidth}px > ${viewport.width}px`);
    if (metrics.readyState !== "complete") result.hardFailures.push("Document did not finish loading within the bounded wait");
    if (!metrics.main) result.hardFailures.push("No main page content found");
    if (failedResources.some(resource => !resource.canceled)) result.hardFailures.push("Same-origin critical resource failure");
    if (pageErrors.length) result.hardFailures.push("Uncaught page exception");
    return result;
  } finally {
    client.socket.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => {});
  }
}

async function main() {
  const options = optionsFromArgs(process.argv.slice(2));
  if (!existsSync(options.chrome)) throw new Error(`Chrome not found: ${options.chrome}`);
  await mkdir(options.out, { recursive: true });
  const profile = await mkdtemp(path.join(options.out, `.chrome-profile-${process.pid}-`));
  const portFile = path.join(profile, "DevToolsActivePort");
  const chrome = spawn(options.chrome, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: "ignore" });
  let launchError;
  chrome.once("error", error => { launchError = error; });
  const results = [];
  try {
    for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt += 1) {
      if (launchError) throw launchError;
      if (chrome.exitCode !== null) throw new Error(`Chrome exited with ${chrome.exitCode} before opening DevTools`);
      await delay(100);
    }
    if (!existsSync(portFile)) throw new Error("Chrome did not open DevTools within 10 seconds");
    const port = Number((await readFile(portFile, "utf8")).split(/\r?\n/)[0]);
    for (const viewport of options.viewports) {
      for (const page of options.pages) {
        let result;
        try {
          result = await inspectScenario(port, options, page, viewport);
        } catch (error) {
          result = { page, requestedViewport: viewport, hardFailures: [error.message] };
        }
        results.push(result);
        console.log(JSON.stringify({ page, width: viewport.width, headerHeight: result.header?.height, mainY: result.main?.y, h1Y: result.h1?.y, scrollWidth: result.scrollWidth, visibleCtas: result.aboveFoldCtas?.map(cta => ({ label: cta.label, occluded: cta.occluded })), failures: result.hardFailures }));
        await writeFile(path.join(options.out, "audit.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), base: options.base, results }, null, 2)}\n`);
      }
    }
    const browserResponse = await fetch(`http://127.0.0.1:${port}/json/version`);
    const browser = await browserResponse.json();
    const client = await connect(browser.webSocketDebuggerUrl, () => {});
    await client.send("Browser.close", {}, 2000).catch(() => {});
    client.socket.close();
  } finally {
    chrome.kill();
    // Remove only this process's verified, fresh Chrome profile inside the evidence dir.
    const relativeProfile = path.relative(options.out, profile);
    if (path.dirname(relativeProfile) === "." && path.basename(relativeProfile).startsWith(`.chrome-profile-${process.pid}-`)) {
      await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(error => console.error(`Chrome profile retained: ${error.message}`));
    }
  }
  const failed = results.filter(result => result.hardFailures.length > 0).length;
  console.log(JSON.stringify({ scenarios: results.length, failed, evidence: path.join(options.out, "audit.json") }));
  if (failed) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
