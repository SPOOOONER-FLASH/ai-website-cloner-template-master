import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { locales, overlayLocales } from "../data/locales.ts";
import { overlays } from "../data/i18n-overlays.ts";
import { dict, isEnglishFallback, specLabel, t, tx, withOverlays } from "./i18n.ts";

/**
 * The reading rule of src/lib/i18n.ts, held by tests: the reader's language where it
 * exists, English where it does not, never a third language — and the overlay files that
 * feed it kept in a shape the build can trust.
 */

test("tx: own text, then English, never another language", () => {
  assert.equal(tx("en", "Home", { es: "Inicio", pt: "Início" }), "Home");
  assert.equal(tx("es", "Home", { es: "Inicio", pt: "Início" }), "Inicio");
  assert.equal(tx("pt", "Home", { es: "Inicio" }), "Home");
  /* An overlay locale reads ui.json; a sentence not in it comes back in English. */
  assert.equal(tx("de", "A sentence nobody has translated yet"), "A sentence nobody has translated yet");
  const german = tx("de", "Frequently asked questions");
  assert.notEqual(german, "Preguntas frecuentes");
});

test("t: suffixed fields for es/pt, overlay for the seven, English otherwise", () => {
  const record = { name: "Lock case", nameEs: "Caja de cerradura", i18n: { de: { name: "Schlosskasten" } } };
  assert.equal(t(record, "name", "en"), "Lock case");
  assert.equal(t(record, "name", "es"), "Caja de cerradura");
  assert.equal(t(record, "name", "pt"), "Lock case");
  assert.equal(t(record, "name", "de"), "Schlosskasten");
  assert.equal(t(record, "name", "fr"), "Lock case");
  assert.equal(isEnglishFallback(record, "name", "pt"), true);
  assert.equal(isEnglishFallback(record, "name", "de"), false);
  assert.equal(isEnglishFallback(record, "name", "fr"), true);
});

test("dict: the locale's own object, or English mapped through the overlay with hrefs moved into the tree", () => {
  const copy = {
    en: { title: "Products", links: [{ label: "Contact", href: "/contact" }] },
    es: { title: "Productos", links: [{ label: "Contacto", href: "/es/contact" }] },
  };
  assert.equal(dict(copy, "es").title, "Productos");
  assert.equal(dict(copy, "pt").title, "Products");
  const de = dict(copy, "de");
  assert.equal(de.links[0]!.href, "/de/contact", "an href is moved into the reader's tree");
  assert.equal(typeof de.title, "string");
});

test("withOverlays attaches only the locales that have a translation for the key", () => {
  const [record] = withOverlays([{ slug: "does-not-exist", name: "x" }], "products", (r) => r.slug);
  assert.equal("i18n" in record!, false);
});

test("specLabel falls back to the English label", () => {
  assert.equal(specLabel("Backset", "en"), "Backset");
  assert.equal(specLabel("Backset", "es"), "Entrada");
  assert.equal(typeof specLabel("Backset", "ja"), "string");
});

const HAN = /\p{Script=Han}/u;
const HAN_RUN = /\p{Script=Han}{7,}/u;

for (const code of overlayLocales) {
  test(`${code}: overlay files are well-formed and in the right script`, () => {
    const dir = path.join(process.cwd(), "content/i18n", code);
    for (const name of ["ui", "products", "categories", "news", "guides", "projects", "faq", "glossary"]) {
      assert.ok(fs.existsSync(path.join(dir, `${name}.json`)), `${code}/${name}.json missing`);
    }
    const bundle = overlays[code];
    for (const section of ["specLabels", "specValues", "finishNames", "materialNames", "categoryNames", "productNames"] as const) {
      assert.equal(typeof bundle.glossary[section], "object", `${code}: glossary.${section}`);
    }
    const strings: string[] = [];
    const walk = (value: unknown) => {
      if (typeof value === "string") strings.push(value);
      else if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") Object.values(value).forEach(walk);
    };
    walk(bundle);
    for (const value of strings) {
      if (code === "ja") assert.ok(!HAN_RUN.test(value), `${code}: a 7+ kanji run with no kana: ${value.slice(0, 40)}`);
      else assert.ok(!HAN.test(value), `${code}: Han characters in "${value.slice(0, 40)}"`);
      assert.ok(!/[٠-٩۰-۹]/.test(value), `${code}: Eastern Arabic digits in "${value.slice(0, 40)}"`);
      assert.ok(!/[‎‏‪-‮⁦-⁩]/.test(value), `${code}: bidi control in "${value.slice(0, 40)}"`);
    }
    /* A ui.json value equal to its key is an untranslated line pretending to be one. */
    for (const [en, translated] of Object.entries(bundle.ui)) {
      assert.notEqual(translated.trim(), "", `${code}: empty translation for "${en.slice(0, 40)}"`);
    }
  });
}

test("every locale in the list has labels, tags and a direction", async () => {
  const { LANGUAGE_LABELS, LOCALE_DIR, LOCALE_TAG, OG_LOCALE } = await import("./i18n.ts");
  for (const code of locales) {
    assert.ok(LANGUAGE_LABELS[code] && LOCALE_TAG[code] && OG_LOCALE[code] && LOCALE_DIR[code], code);
  }
});
