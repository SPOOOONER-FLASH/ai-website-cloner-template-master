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

/*
  The configurator is a listing too.

  Added 2026-09-08 after the client reported that "back to previous results" from a
  product page dropped them into the category listing instead of the configuration they
  had built. Two things were wrong and both are now covered: the configurator's result
  links did not record a return position (fixed in Configurator.tsx), and this module
  rejected /configurator as a listing URL so the position was discarded even once it was
  offered.

  The Spanish mirror is asserted alongside the English one because that is exactly the
  kind of pair where one gets fixed and the other is noticed months later by a buyer.
*/
test("a configuration is a place worth returning to, in both locales", () => {
  for (const [listing, product] of [
    [
      "/configurator/?category=hardware-accessories&subCategory=door-stoppers&material=Stainless+Steel",
      "/products/hardware-accessories/ds01-door-stopper/",
    ],
    [
      "/es/configurator/?category=hardware-accessories&material=Stainless+Steel",
      "/es/products/hardware-accessories/ds01-door-stopper/",
    ],
  ] as const) {
    const storage = new MemoryStorage();
    rememberCatalogueReturn(storage, { listingUrl: listing, productHref: product, scrollY: 620 });

    const remembered = readCatalogueReturn(storage, product);
    assert.ok(remembered, `${listing} should be remembered, not discarded`);
    assert.equal(
      remembered.listingUrl,
      listing,
      "the answers live in the query string — dropping it returns an empty configurator",
    );
    assert.equal(remembered.scrollY, 620);
  }
});

test("the product finder is remembered in Spanish as well as English", () => {
  const storage = new MemoryStorage();
  const listing = "/es/product-finder/?category=deadbolts";
  const product = "/es/products/deadbolts/d102-ac-deadbolts/";
  rememberCatalogueReturn(storage, { listingUrl: listing, productHref: product, scrollY: 40 });
  assert.equal(readCatalogueReturn(storage, product)?.listingUrl, listing);
});
