import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  Products and application packages link both ways (client, 2026-09-27: 「把案例和产品关联起来」).
  A project names its products by model; ProductDetail finds its projects by resolving those
  same models. A model that resolves to nothing, or to an unpublished page, breaks both
  directions at once — the project loses a card and the product loses its backlink.
*/
const read = (dir: string) =>
  readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(`${dir}/${f}`, "utf8")));

test("every product a project names is a published product page", () => {
  const products = read("content/products") as Array<{ model: string; published?: boolean }>;
  for (const project of read("content/projects") as Array<{ slug: string; productModels: string[] }>) {
    for (const model of project.productModels) {
      const product = products.find((p) => p.model === model);
      assert.ok(product, `${project.slug}: no product with model "${model}"`);
      assert.notEqual(product.published, false, `${project.slug}: "${model}" is unpublished`);
    }
  }
});

test("the product page renders its application packages, labeled as representative", () => {
  const page = readFileSync("src/components/site/ProductDetail.tsx", "utf8");
  assert.match(page, /project\.productModels\.some/);
  assert.match(page, /getProductByModel\(model\)/);
  assert.match(page, /\{t\.representative\}/);
  assert.match(page, /\/projects\/\$\{project\.slug\}\//);
});
