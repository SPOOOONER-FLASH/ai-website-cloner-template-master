import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

/*
  Reading aids (types.ts readingAids) restate an article; they never add to it. So every margin
  figure's heading is a heading of that language's body, every figure value is written in that
  body, and every key-points row has as many cells as the table has headers.
*/
const BODY = { en: "body", es: "bodyEs", pt: "bodyPt" } as const;
for (const dir of ["content/news", "content/guides"]) {
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const article = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
    if (!article.readingAids) continue;
    test(`${file}: reading aids restate the body`, () => {
      for (const [locale, aids] of Object.entries(article.readingAids) as [keyof typeof BODY, { keyPoints?: { headers: string[]; rows: string[][] }; figures?: { heading: string; value: string }[] }][]) {
        const body: string[] = article[BODY[locale]] ?? [];
        assert.ok(body.length, `${locale}: no body for these aids`);
        const headings = new Set(body.filter((p) => p.startsWith("## ")).map((p) => p.slice(3).trim()));
        const text = body.join(" ");
        for (const f of aids.figures ?? []) {
          assert.ok(headings.has(f.heading), `${locale}: no heading "${f.heading}"`);
          assert.ok(text.includes(f.value), `${locale}: "${f.value}" is not in the body`);
        }
        for (const row of aids.keyPoints?.rows ?? []) assert.equal(row.length, aids.keyPoints!.headers.length, `${locale}: row ${row[0]}`);
      }
    });
  }
}
