import assert from "node:assert/strict";
import test from "node:test";

import {
  categoryViewFromParams,
  categoryViewToParams,
  consumeCatalogueReturn,
  readCatalogueReturn,
  rearmCatalogueReturn,
  rememberCatalogueReturn,
  type CatalogueStorage,
} from "./catalogue-return.ts";

class MemoryStorage implements CatalogueStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

const productHref = "/products/knob-locks/607-knob-lock/";
const listingUrl = "/products/knob-locks/?type=tubular-locks&page=3";

test("a category result remembers its page, filter, product and scroll position for this session", () => {
  const storage = new MemoryStorage();

  rememberCatalogueReturn(storage, {
    listingUrl,
    productHref,
    scrollY: 1840,
  });

  assert.deepEqual(readCatalogueReturn(storage, productHref), {
    version: 1,
    listingUrl,
    productHref,
    scrollY: 1840,
    pending: true,
  });
  assert.equal(
    readCatalogueReturn(storage, "/products/knob-locks/609-knob-lock/"),
    null,
    "a different detail page must not inherit another product's return target",
  );
});

test("a product detail URL cannot be recorded as if it were a catalogue listing", () => {
  const storage = new MemoryStorage();

  rememberCatalogueReturn(storage, {
    listingUrl: productHref,
    productHref: "/products/knob-locks/609-knob-lock/",
    scrollY: 900,
  });

  assert.equal(readCatalogueReturn(storage, "/products/knob-locks/609-knob-lock/"), null);
});

test("restoration is consumed once, while the detail return link can rearm it", () => {
  const storage = new MemoryStorage();
  rememberCatalogueReturn(storage, { listingUrl, productHref, scrollY: 1840 });

  assert.equal(consumeCatalogueReturn(storage, listingUrl)?.scrollY, 1840);
  assert.equal(consumeCatalogueReturn(storage, listingUrl), null);
  assert.equal(readCatalogueReturn(storage, productHref)?.pending, false);

  rearmCatalogueReturn(storage, productHref);
  assert.equal(consumeCatalogueReturn(storage, listingUrl)?.productHref, productHref);
});

test("category page state round-trips through the URL without deleting campaign parameters", () => {
  const parsed = categoryViewFromParams(
    new URLSearchParams("type=tubular-locks&page=3&utm_source=mail"),
    new Set(["mortise-locks", "tubular-locks"]),
  );
  assert.deepEqual(parsed, { active: "tubular-locks", page: 3 });

  const updated = categoryViewToParams(
    new URLSearchParams("promo=1&utm_source=mail&type=old&page=9"),
    { active: "mortise-locks", page: 2 },
  );
  assert.equal(updated.toString(), "promo=1&utm_source=mail&type=mortise-locks&page=2");

  const defaults = categoryViewToParams(updated, { active: "all", page: 1 });
  assert.equal(defaults.toString(), "promo=1&utm_source=mail");
});

test("invalid category state falls back to the first unfiltered page", () => {
  assert.deepEqual(
    categoryViewFromParams(
      new URLSearchParams("type=not-a-real-type&page=-4"),
      new Set(["mortise-locks"]),
    ),
    { active: "all", page: 1 },
  );
});
