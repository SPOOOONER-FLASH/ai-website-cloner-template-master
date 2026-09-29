#!/usr/bin/env node
/**
 * Local contact interaction QA. This NEVER sends an inquiry.
 * The pre-hydration fetch mock is backed by CDP blocking external HTTP requests.
 * Reported payload evidence contains field names only, never values/access keys.
 *
 * node scripts/audit-hyde-inquiry-feedback.mjs --base http://127.0.0.1:8766
 * Requires Chrome + Node 22+. JSON/screenshots default to ignored tmp/.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const LOOPBACK = new Set(["127.0.0.1", "localhost", "[::1]"]);
const VIEWPORTS = [{ width: 390, height: 844 }, { width: 1440, height: 900 }];
const FORM_SELECTOR = 'main form:has(input[name="name"]):has(textarea[name="message"])';

export function optionsFromArgs(args) {
  const options = {
    base: "http://127.0.0.1:8766/",
    out: "tmp/codex-inquiry-browser",
    chrome: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  };
  for (let i = 0; i < args.length; i += 1) {
    const flag = args[i];
    if (flag === "--help") {
      console.log("Usage: node scripts/audit-hyde-inquiry-feedback.mjs [--base http://127.0.0.1:8766] [--out DIR] [--chrome PATH]. Localhost only; no emails sent.");
      return null;
    }
    const value = args[++i];
    if (!value || value.startsWith("--")) throw new Error("Missing value for " + flag);
    if (!["--base", "--out", "--chrome"].includes(flag)) throw new Error("Unknown option: " + flag);
    options[flag.slice(2)] = value;
  }
  const base = new URL(options.base);
  if (base.protocol !== "http:" || !LOOPBACK.has(base.hostname) || base.username || base.password) {
    throw new Error("LOCALHOST ONLY: use http://127.0.0.1, http://localhost, or http://[::1]. Public sites are never tested or submitted to.");
  }
  if (base.pathname !== "/" || base.search || base.hash) throw new Error("Base must be the local server root without a path, query, or fragment");
  options.base = base.href;
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
    if (!message.id) { onEvent(message.method, message.params ?? {}); return; }
    const request = pending.get(message.id);
    if (!request) return;
    clearTimeout(request.timer);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(request.method + ": " + message.error.message));
    else request.resolve(message.result);
  });
  socket.addEventListener("close", () => {
    for (const request of pending.values()) {
      clearTimeout(request.timer);
      request.reject(new Error("DevTools closed during " + request.method));
    }
    pending.clear();
  });
  return {
    socket,
    send(method, params = {}, timeout = 20000) {
      const id = nextId++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { pending.delete(id); reject(new Error(method + " timed out")); }, timeout);
        pending.set(id, { resolve, reject, timer, method });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function evaluate(client, fn, argument) {
  const expression = "(" + fn.toString() + ")(" + JSON.stringify(argument ?? null) + ")";
  const result = await client.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(client, fn, description, argument) {
  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    if (await evaluate(client, fn, argument)) return;
    await delay(100);
  }
  throw new Error("Timed out waiting for " + description);
}

/** Executed in the fresh browser document, before any application code. */
function installMock(mode) {
  const nativeFetch = globalThis.fetch.bind(globalThis);
  const allowed = new Set(["127.0.0.1", "localhost", "[::1]"]);
  globalThis.__hydeInquiryQa = { mode, calls: [], invalidFields: [] };
  addEventListener("invalid", event => {
    if (event.target?.name) globalThis.__hydeInquiryQa.invalidFields.push(event.target.name);
  }, true);
  globalThis.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" || input instanceof URL ? input : input.url, location.href);
    if (url.hostname === "api.web3forms.com") {
      const fieldNames = init.body instanceof FormData ? [...new Set(init.body.keys())].sort() : [];
      globalThis.__hydeInquiryQa.calls.push({ method: init.method || "GET", fieldNames, mocked: true });
      await new Promise(resolve => setTimeout(resolve, 150));
      return new Response(JSON.stringify({ success: mode === "success" }), {
        status: mode === "success" ? 200 : 400, headers: { "content-type": "application/json" },
      });
    }
    if (url.protocol !== "http:" || !allowed.has(url.hostname)) throw new TypeError("External fetch blocked by local inquiry QA");
    return nativeFetch(input, init);
  };
}

function feedbackMetrics(selector) {
  const form = document.querySelector(selector);
  const heading = document.getElementById("inquiry-success-heading");
  const panel = heading?.closest("section");
  const canvas = panel?.querySelector("canvas");
  const box = panel?.getBoundingClientRect();
  const fallback = form?.querySelector("textarea[readonly]");
  const status = form?.querySelector('[role="status"]');
  let paintedPixels = 0;
  if (canvas?.width && canvas?.height) {
    const pixels = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 16) if (pixels[i] > 0) paintedPixels += 1;
  }
  return {
    headingPresent: !!heading, headingFocused: !!heading && document.activeElement === heading,
    formPresent: !!form, nameFocused: document.activeElement?.name === "name",
    fieldsReset: !!form && [...form.querySelectorAll('input[name="name"], input[name="email"], textarea[name="message"]')].every(field => !field.value),
    canvasPresent: !!canvas, canvasDecorative: canvas?.getAttribute("aria-hidden") === "true", paintedPixels,
    panelInViewport: !!box && box.top >= 0 && box.top < innerHeight && box.left >= 0 && box.right <= innerWidth + 1,
    errorDisplayed: status?.textContent.includes("We could not send this from the website.") || false,
    fallbackPresent: !!fallback, fallbackPreserved: fallback?.value.includes("Local automated feedback verification. Do not deliver.") || false,
    messagePreserved: form?.elements.namedItem("message")?.value === "Local automated feedback verification. Do not deliver.",
    mailtoFallbackPresent: !!form?.querySelector('a[href^="mailto:"][href*="body="]'),
    scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    viewportWidth: innerWidth, calls: globalThis.__hydeInquiryQa.calls,
  };
}

async function screenshot(client, options, filename) {
  const result = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false, fromSurface: true });
  await writeFile(path.join(options.out, filename), Buffer.from(result.data, "base64"));
  return filename;
}

async function inspectScenario(port, options, viewport, mode) {
  const response = await fetch("http://127.0.0.1:" + port + "/json/new?about%3Ablank", { method: "PUT" });
  if (!response.ok) throw new Error("DevTools target returned " + response.status);
  const target = await response.json();
  const guards = { externalRequestsBlocked: 0, web3FormsNetworkRequests: 0, interceptionErrors: [] };
  let client;
  client = await connect(target.webSocketDebuggerUrl, (method, params) => {
    if (method !== "Fetch.requestPaused") return;
    const url = new URL(params.request.url);
    const local = url.protocol === "http:" && LOOPBACK.has(url.hostname);
    if (!local) guards.externalRequestsBlocked += 1;
    if (url.hostname === "api.web3forms.com") guards.web3FormsNetworkRequests += 1;
    client.send(local ? "Fetch.continueRequest" : "Fetch.failRequest", local
      ? { requestId: params.requestId }
      : { requestId: params.requestId, errorReason: "BlockedByClient" })
      .catch(error => guards.interceptionErrors.push(error.message));
  });
  const result = { mode, viewport, checks: {}, failures: [], networkGuards: guards };
  const requireCheck = (condition, message) => { if (!condition) result.failures.push(message); };
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Fetch.enable", { patterns: [{ urlPattern: "http://*", requestStage: "Request" }, { urlPattern: "https://*", requestStage: "Request" }] });
    await client.send("Page.addScriptToEvaluateOnNewDocument", { source: "(" + installMock.toString() + ")(" + JSON.stringify(mode) + ");" });
    await client.send("Emulation.setDeviceMetricsOverride", { ...viewport, deviceScaleFactor: 1, mobile: viewport.width < 744, screenWidth: viewport.width, screenHeight: viewport.height });
    await client.send("Emulation.setTouchEmulationEnabled", { enabled: viewport.width < 744 });
    await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "no-preference" }] });
    const navigation = await client.send("Page.navigate", { url: new URL("contact/", options.base).href });
    if (navigation.errorText) throw new Error("Navigation failed: " + navigation.errorText);
    await waitFor(client, selector => {
      const form = document.querySelector(selector);
      return document.readyState === "complete" && form && Object.keys(form).some(key => key.startsWith("__reactProps$") && typeof form[key]?.onSubmit === "function");
    }, "hydrated contact form", FORM_SELECTOR);
    await evaluate(client, () => document.fonts.ready.then(() => true));
    result.checks.nativeValidation = await evaluate(client, selector => {
      const form = document.querySelector(selector);
      form.requestSubmit();
      return { valid: form.checkValidity(), invalidFieldNames: [...new Set(globalThis.__hydeInquiryQa.invalidFields)].sort(), mockedRequestCount: globalThis.__hydeInquiryQa.calls.length, focusedField: document.activeElement?.name || null };
    }, FORM_SELECTOR);
    const validation = result.checks.nativeValidation;
    requireCheck(!validation.valid, "Blank form passed native required validation");
    requireCheck(["name", "email", "message"].every(name => validation.invalidFieldNames.includes(name)), "A required field was not rejected");
    requireCheck(validation.mockedRequestCount === 0, "Blank form reached the submission adapter");
    requireCheck(validation.focusedField === "name", "Blank-form validation did not focus the name field");
    result.checks.validInput = await evaluate(client, selector => {
      const form = document.querySelector(selector);
      const values = { name: "QA browser test", email: "qa@example.invalid", message: "Local automated feedback verification. Do not deliver." };
      for (const [name, value] of Object.entries(values)) {
        const field = form.elements.namedItem(name);
        const prototype = field instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
        Object.getOwnPropertyDescriptor(prototype, "value").set.call(field, value);
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
      }
      const valid = form.checkValidity();
      if (valid) form.requestSubmit();
      return { valid };
    }, FORM_SELECTOR);
    requireCheck(result.checks.validInput.valid, "Synthetic valid input failed browser validation");
    if (mode === "success") {
      await waitFor(client, () => !!document.getElementById("inquiry-success-heading"), "mock-success panel");
      await delay(600);
      const metrics = await evaluate(client, feedbackMetrics, FORM_SELECTOR);
      result.checks.success = metrics;
      requireCheck(metrics.headingFocused && !metrics.formPresent, "Success did not replace the form and focus its heading");
      requireCheck(metrics.canvasPresent && metrics.canvasDecorative && metrics.paintedPixels > 0, "Decorative confetti did not paint");
      requireCheck(metrics.panelInViewport, "Success panel is outside the viewport");
      requireCheck(metrics.scrollWidth <= viewport.width + 1, "Success causes horizontal overflow");
      result.screenshot = await screenshot(client, options, "success-" + viewport.width + ".png");
      await evaluate(client, () => [...document.querySelectorAll('section[aria-labelledby="inquiry-success-heading"] button')].find(button => button.textContent.includes("Stop celebration")).click());
      await delay(50);
      result.checks.stopCelebration = { cleared: (await evaluate(client, feedbackMetrics, FORM_SELECTOR)).paintedPixels === 0 };
      requireCheck(result.checks.stopCelebration.cleared, "Stop celebration did not clear the canvas");
      await evaluate(client, () => [...document.querySelectorAll('section[aria-labelledby="inquiry-success-heading"] button')].find(button => button.textContent.includes("Send another inquiry")).click());
      await waitFor(client, selector => !!document.querySelector(selector) && document.activeElement?.name === "name", "restored focused form", FORM_SELECTOR);
      const restored = await evaluate(client, feedbackMetrics, FORM_SELECTOR);
      result.checks.sendAnother = { formPresent: restored.formPresent, nameFocused: restored.nameFocused, noSuccessPanel: !restored.headingPresent, fieldsReset: restored.fieldsReset };
      requireCheck(Object.values(result.checks.sendAnother).every(Boolean), "Send another did not restore a cleared, focused form");
    } else {
      await waitFor(client, selector => !!document.querySelector(selector)?.querySelector("textarea[readonly]"), "mock-error fallback", FORM_SELECTOR);
      await evaluate(client, selector => document.querySelector(selector).querySelector('[role="status"]').scrollIntoView({ block: "center", behavior: "instant" }), FORM_SELECTOR);
      const metrics = await evaluate(client, feedbackMetrics, FORM_SELECTOR);
      result.checks.error = metrics;
      requireCheck(metrics.formPresent && !metrics.headingPresent && metrics.errorDisplayed, "Failed submission presented an incorrect status");
      requireCheck(metrics.fallbackPresent && metrics.fallbackPreserved && metrics.messagePreserved && metrics.mailtoFallbackPresent, "Failed submission lost the inquiry or email fallback");
      requireCheck(metrics.scrollWidth <= viewport.width + 1, "Failure causes horizontal overflow");
      result.screenshot = await screenshot(client, options, "error-" + viewport.width + ".png");
    }
    const calls = await evaluate(client, () => globalThis.__hydeInquiryQa.calls);
    result.mockedSubmissions = calls;
    requireCheck(calls.length === 1 && calls[0].method === "POST" && calls[0].mocked, "Expected exactly one mocked POST");
    requireCheck(guards.web3FormsNetworkRequests === 0, "Injected fetch mock was bypassed");
    requireCheck(guards.interceptionErrors.length === 0, "A network-interception command failed");
  } catch (error) {
    result.failures.push(error.message);
    await screenshot(client, options, "failed-" + mode + "-" + viewport.width + ".png").catch(() => {});
  } finally {
    client.socket.close();
    await fetch("http://127.0.0.1:" + port + "/json/close/" + target.id).catch(() => {});
  }
  return result;
}

async function main() {
  const options = optionsFromArgs(process.argv.slice(2));
  if (!options) return;
  if (!existsSync(options.chrome)) throw new Error("Chrome not found: " + options.chrome);
  await mkdir(options.out, { recursive: true });
  const profile = await mkdtemp(path.join(options.out, ".chrome-profile-" + process.pid + "-"));
  const portFile = path.join(profile, "DevToolsActivePort");
  const chrome = spawn(options.chrome, ["--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--disable-background-networking", "--remote-debugging-port=0", "--user-data-dir=" + profile, "about:blank"], { windowsHide: true, stdio: "ignore" });
  let launchError;
  chrome.once("error", error => { launchError = error; });
  const results = [];
  try {
    for (let attempt = 0; attempt < 100 && !existsSync(portFile); attempt += 1) {
      if (launchError) throw launchError;
      if (chrome.exitCode !== null) throw new Error("Chrome exited with " + chrome.exitCode + " before opening DevTools");
      await delay(100);
    }
    if (!existsSync(portFile)) throw new Error("Chrome did not open DevTools within 10 seconds");
    const port = Number((await readFile(portFile, "utf8")).split(/\r?\n/)[0]);
    for (const viewport of VIEWPORTS) {
      for (const mode of ["success", "error"]) {
        const result = await inspectScenario(port, options, viewport, mode);
        results.push(result);
        console.log(JSON.stringify({ mode, width: viewport.width, mockedPosts: result.mockedSubmissions?.length, web3FormsNetworkRequests: result.networkGuards.web3FormsNetworkRequests, failures: result.failures }));
        await writeFile(path.join(options.out, "audit.json"), JSON.stringify({ generatedAt: new Date().toISOString(), base: options.base, delivery: "No emails sent. Web3Forms fetch mocked; external HTTP blocked.", results }, null, 2) + "\n");
      }
    }
    const browser = await (await fetch("http://127.0.0.1:" + port + "/json/version")).json();
    const client = await connect(browser.webSocketDebuggerUrl, () => {});
    await client.send("Browser.close", {}, 2000).catch(() => {});
    client.socket.close();
  } finally {
    chrome.kill();
    const relativeProfile = path.relative(options.out, profile);
    // Remove only this fresh process-owned profile verified to be inside output dir.
    if (path.dirname(relativeProfile) === "." && path.basename(relativeProfile).startsWith(".chrome-profile-" + process.pid + "-")) {
      await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }).catch(error => console.error("Chrome profile retained: " + error.message));
    }
  }
  const failed = results.filter(result => result.failures.length > 0).length;
  console.log(JSON.stringify({ scenarios: results.length, failed, evidence: path.join(options.out, "audit.json") }));
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
