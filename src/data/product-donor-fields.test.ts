import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

/*
  A record cloned for its SHAPE must not keep its donor's VALUES.

  scripts/add-photographed-models.mjs builds a new record by cloning an existing one in
  the same category, so that every key the build expects is present. Until 2026-09-23 it
  emptied only the fields somebody had remembered. In `stainless-steel-handles` the donor
  is model 600, a concealed sliding-door pull, and eight lever handles — seven older ones
  and 9088 SS — shipped with 600's door types ("Sliding Door", "Pocket Door"), 600's
  series, 600's Chinese name 隐藏式推拉门拉手 and 600's feature provenance. The finder
  filed all eight under sliding doors.

  These checks are phrased as properties a real record has, not as a list of the eight
  models, so they also catch the next category whose donor happens to be unusual.
*/

type Product = {
  model: string;
  name?: string;
  summary?: string;
  series?: string;
  nameZh?: string | null;
  doorTypes?: string[];
  categoryPath?: string[];
};

const DIR = join(process.cwd(), "content", "products");
const products: Product[] = readdirSync(DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")) as Product);

test("a product is only filed under sliding doors if it says it is a sliding-door product", () => {
  const wrong = products
    .filter((p) => (p.doorTypes ?? []).some((d) => /sliding|pocket/i.test(d)))
    .filter((p) => !/slid|pocket|concealed|flush pull/i.test(`${p.name ?? ""} ${p.summary ?? ""}`))
    .map((p) => p.model);
  assert.deepEqual(wrong, [], `filed under sliding doors without being one: ${wrong.join(", ")}`);
});

test("the sliding-door pull's series is only on sliding-door pulls", () => {
  /*
    Not a general "series must name the model" rule. That was the first version, and it
    failed on "Hyland 300", which is a real family series shared by 305/306/309/314/317/320.
    A series is sometimes a family and sometimes one product; only the family knows. So
    this pins the one inheritance that is known to have happened.
  */
  const wrong = products
    .filter((p) => p.series === "Hyland 600")
    .filter((p) => !/slid/i.test(p.name ?? ""))
    .map((p) => p.model);
  assert.deepEqual(wrong, [], `carries model 600's series: ${wrong.join(", ")}`);
});

test("the concealed sliding-door pull's Chinese name is only on sliding-door pulls", () => {
  const wrong = products
    .filter((p) => p.nameZh === "隐藏式推拉门拉手")
    .filter((p) => !/slid/i.test(p.name ?? ""))
    .map((p) => p.model);
  assert.deepEqual(wrong, []);
});
