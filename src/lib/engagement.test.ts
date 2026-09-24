import assert from "node:assert/strict";
import test from "node:test";
import { linkIntent, newDepths, pageType, readStyle } from "./engagement.ts";

test("page type ignores the language prefix", () => {
  assert.equal(pageType("/"), "home");
  assert.equal(pageType("/pt/"), "home");
  assert.equal(pageType("/news/master-key-systems-how-many-levels-you-need/"), "article");
  assert.equal(pageType("/es/guides/euro-cylinder-size-chart-2026/"), "article");
  assert.equal(pageType("/guides/"), "guide-index");
  assert.equal(pageType("/products/lock-cases/lc04-85-60-lock-case/"), "product");
  assert.equal(pageType("/products/lock-cases/"), "category");
  assert.equal(pageType("/es/contact/"), "contact");
});

test("read style separates the skimmer from the reader", () => {
  // The client's two visitors: whole article in seconds, and line by line.
  assert.equal(readStyle({ seconds: 18, depth: 92, secondsAt75: 12 }), "skim");
  assert.equal(readStyle({ seconds: 240, depth: 80, secondsAt75: 150 }), "read");
  assert.equal(readStyle({ seconds: 6, depth: 10 }), "bounce");
  assert.equal(readStyle({ seconds: 40, depth: 60 }), "browse");
});

test("each depth is reported once", () => {
  assert.deepEqual(newDepths(55, new Set()), [25, 50]);
  assert.deepEqual(newDepths(80, new Set([25, 50])), [75]);
  assert.deepEqual(newDepths(80, new Set([25, 50, 75])), []);
});

test("links are classified by what they mean commercially", () => {
  const from = "/news/push-bar-or-touch-bar-panic-exit-devices/";
  assert.deepEqual(linkIntent("/products/panic-exit-devices/311-panic-exit-device/", from), {
    name: "select_item",
    params: { item_id: "311-panic-exit-device", item_list_name: "article" },
  });
  assert.equal(linkIntent("mailto:tec@cantonlock.com", from)?.params.method, "email");
  assert.equal(linkIntent("https://wa.me/8613800000000", from)?.params.method, "whatsapp");
  assert.equal(linkIntent("/es/contact/", from)?.params.method, "form");
  assert.equal(linkIntent("/configurator/", from)?.name, "configurator_open");
  assert.equal(linkIntent("/guides/", from), null);
  assert.equal(linkIntent("https://example.com/products/a/b/", from), null);
});
