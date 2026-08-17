/**
 * One-off migration: TypeScript data literals -> JSON content files.
 *
 * Why: the site is moving to a headless CMS (Decap). Decap edits FILES in the git repo,
 * so the catalogue has to live as data files rather than as TypeScript literals. The
 * TypeScript modules stay — they keep the types and the lookup helpers — but they now
 * read from JSON instead of embedding the records.
 *
 * Safe to re-run: it regenerates the JSON from whatever the .ts modules currently export.
 * Run it BEFORE switching the modules over to reading JSON, not after.
 *
 *   node scripts/migrate-to-content.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = "content";

const { products } = await import("../src/data/products.ts");
const { categories } = await import("../src/data/categories.ts");
const { projects } = await import("../src/data/projects.ts");
const { downloads } = await import("../src/data/downloads.ts");

/** Stable key order so re-running produces no spurious diffs. */
const stable = (value) => JSON.stringify(value, null, 2) + "\n";

await mkdir(join(OUT, "products"), { recursive: true });
for (const product of products) {
  // One file per product: this is what makes the CMS list view work, and it keeps
  // each edit to a single-file diff that is readable in a pull request.
  await writeFile(join(OUT, "products", `${product.slug}.json`), stable(product));
}

await mkdir(join(OUT, "projects"), { recursive: true });
for (const project of projects) {
  await writeFile(join(OUT, "projects", `${project.slug}.json`), stable(project));
}

// Categories and downloads are single ordered lists, not per-item pages, so they stay
// as one file each — reordering categories is a common edit and a list is easier to reorder.
await writeFile(join(OUT, "categories.json"), stable(categories));
await writeFile(join(OUT, "downloads.json"), stable(downloads));

console.log(`products   -> ${products.length} files in ${OUT}/products/`);
console.log(`projects   -> ${projects.length} files in ${OUT}/projects/`);
console.log(`categories -> ${categories.length} top-level in ${OUT}/categories.json`);
console.log(`downloads  -> ${downloads.length} in ${OUT}/downloads.json`);
