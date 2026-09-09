import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

/*
  The built sitemap must be parseable XML.

  On 2026-09-08 it was not, and the cost was the whole file. Google reported
  「我们无法阅读您的 Sitemap 文件」 with a parse error at line 3740, and discovered
  0 pages and 0 videos out of 1,142 URLs — because ten product summaries contained a bare
  `&` ("Supports top & bottom bolt linkage", "solid brass/zinc & brass cylinder",
  "suitable for left & right usage") and an XML parser stops at the first one.

  The bare ampersands came from Next itself: its sitemap serialiser interpolates
  `<video:title>` and `<video:description>` straight into the markup with no escaping
  (node_modules/next/dist/build/webpack/loaders/metadata/resolve-route-data.js). URLs
  survive that because a URL cannot contain a raw `&`; prose cannot.

  So the escaping lives in src/app/sitemap.ts, and this asserts the result rather than the
  intention. It reads `out/sitemap.xml`, which is the file Google actually fetches — a test
  against the source data would have passed on the day this broke.
*/

const SITEMAP = "out/sitemap.xml";

/** Every `&` that does not begin a character entity. */
const BARE_AMPERSAND = /&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g;

/** XML 1.0 forbids these outright; they cannot be escaped, only removed. */
const FORBIDDEN_CONTROL = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

test("the built sitemap contains no unescaped ampersand", (t) => {
  if (!existsSync(SITEMAP)) {
    t.skip("out/sitemap.xml not built in this checkout");
    return;
  }
  const xml = readFileSync(SITEMAP, "utf8");
  const bare = [...xml.matchAll(BARE_AMPERSAND)].map((match) => {
    const line = xml.slice(0, match.index).split("\n").length;
    return `line ${line}: …${xml.slice(Math.max(0, match.index - 50), match.index + 30)}…`;
  });

  assert.deepEqual(
    bare.slice(0, 5),
    [],
    `${bare.length} unescaped & in the sitemap — an XML parser stops at the first one and ` +
      `Google discovers nothing from the entire file:\n  ${bare.slice(0, 5).join("\n  ")}`,
  );
});

test("the built sitemap has no characters XML cannot carry", (t) => {
  if (!existsSync(SITEMAP)) {
    t.skip("out/sitemap.xml not built in this checkout");
    return;
  }
  const xml = readFileSync(SITEMAP, "utf8");
  assert.equal(
    [...xml.matchAll(FORBIDDEN_CONTROL)].length,
    0,
    "a control character reached the sitemap; it has to be stripped at the source, not escaped",
  );
});

test("every element the sitemap opens, it closes", (t) => {
  if (!existsSync(SITEMAP)) {
    t.skip("out/sitemap.xml not built in this checkout");
    return;
  }
  const xml = readFileSync(SITEMAP, "utf8");
  /*
    A cheap well-formedness check for the containers that matter. Not a full parser —
    the point is to catch a truncated write or a half-emitted block, which is the other
    way this file goes silently unreadable.
  */
  for (const tag of ["url", "image:image", "video:video", "urlset"]) {
    const open = (xml.match(new RegExp(`<${tag}(?:\\s|>)`, "g")) ?? []).length;
    const close = (xml.match(new RegExp(`</${tag}>`, "g")) ?? []).length;
    assert.equal(open, close, `<${tag}> opened ${open} times and closed ${close}`);
  }
});
