import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "./json-ld.ts";

test("serializeJsonLd neutralizes a closing script sequence without changing parsed data", () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Thing",
    name: "Door schedule </script><script>alert(1)</script>",
  };

  const serialized = serializeJsonLd(data);

  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});
