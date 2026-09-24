import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/**
 * Every HYDE product has a Spanish summary that says something.
 *
 * On 2026-09-24 sixty HYDE records carried a summaryEs of four words or fewer ("Cerradura de
 * embutir.", "Mirilla.", "Un accesorio de baño."), mostly the category name with a full stop.
 * That line is what /es product cards and search results print under the model, so a buyer saw
 * the same three words on fourteen different lock cases. All sixty were rewritten from the spec
 * rows and summaryPt. This test keeps it that way, and also catches the regenerator failure
 * recorded in docs/collaboration/tasks/2026-09-24-copy-style-rewrite.md §二之二: a full re-run of
 * translate-products-es.mjs rewrites summaryEs back to half-sentences.
 */
type Product = { slug: string; model: string; sites?: string[]; summaryEs?: string };

const products: Product[] = readdirSync("content/products")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/products/${f}`, "utf8")) as Product)
  .filter((p) => !p.sites || p.sites.includes("hyde"));

const words = (s?: string) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;

test("no HYDE product has a Spanish summary of four words or fewer", () => {
  const short = products.filter((p) => words(p.summaryEs) <= 4);
  assert.equal(
    short.length,
    0,
    `Rewrite these from the spec rows (not with translate-products-es.mjs):\n${short
      .slice(0, 15)
      .map((p) => `  ${p.model} (${p.slug}): "${p.summaryEs ?? ""}"`)
      .join("\n")}`,
  );
});
