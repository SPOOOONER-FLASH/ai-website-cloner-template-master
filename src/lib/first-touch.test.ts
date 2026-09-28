import assert from "node:assert/strict";
import test from "node:test";

import { AI_SOURCES, classifyFirstTouch, FIRST_TOUCH_KEY, readFirstTouch, rememberFirstTouch } from "./first-touch.ts";

const HOST = "cantonlock.com";

test("assistant referrers and ChatGPT's utm tag are both recognized", () => {
  assert.equal(classifyFirstTouch("https://chatgpt.com/", "", HOST), "chatgpt");
  assert.equal(classifyFirstTouch("", "?utm_source=chatgpt.com", HOST), "chatgpt");
  assert.equal(classifyFirstTouch("https://www.perplexity.ai/search/x", "", HOST), "perplexity");
  assert.equal(classifyFirstTouch("https://gemini.google.com/app", "", HOST), "gemini");
  assert.ok(AI_SOURCES.has("chatgpt"));
});

test("search engines, direct, internal and unknown referrers", () => {
  assert.equal(classifyFirstTouch("https://www.google.com.ar/", "", HOST), "google");
  assert.equal(classifyFirstTouch("https://www.bing.com/", "", HOST), "bing");
  assert.equal(classifyFirstTouch("", "", HOST), "direct");
  assert.equal(classifyFirstTouch("https://cantonlock.com/products/", "", HOST), "internal");
  assert.equal(classifyFirstTouch("https://example.org/page", "", HOST), "referral");
  assert.equal(classifyFirstTouch("not a url", "", HOST), "other");
});

test("a free-text utm_source is kept short and stripped of anything but a label", () => {
  assert.equal(classifyFirstTouch("", "?utm_source=Trade Show<QR>", HOST), "tradeshowqr");
});

test("the first page of a session wins; later pages do not overwrite it", () => {
  const data = new Map<string, string>();
  const store = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
  assert.equal(rememberFirstTouch(store, "https://chatgpt.com/", "", HOST), "chatgpt");
  assert.equal(rememberFirstTouch(store, "https://cantonlock.com/contact/", "", HOST), "chatgpt");
  assert.equal(data.get(FIRST_TOUCH_KEY), "chatgpt");
  assert.equal(readFirstTouch(store), "chatgpt");
});

test("blocked storage returns an empty label instead of throwing", () => {
  const broken = { getItem: () => { throw new Error("denied"); }, setItem: () => { throw new Error("denied"); } };
  assert.equal(rememberFirstTouch(broken, "", "", HOST), "");
  assert.equal(readFirstTouch(broken), "");
  assert.equal(readFirstTouch(undefined), "");
});
