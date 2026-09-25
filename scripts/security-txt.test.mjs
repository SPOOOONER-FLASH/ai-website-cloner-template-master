/*
  public/.well-known/security.txt (RFC 9116) — added 2026-09-25 after Cloudflare Security
  Insights flagged "Security.txt not configured". The RFC makes `Expires` mandatory and a file
  past its date is treated as absent, so this fails a month before it lapses: bump the date by
  a year in the same commit.
*/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("security.txt has a contact and has not come within 30 days of expiring", () => {
  const txt = readFileSync("public/.well-known/security.txt", "utf8");
  assert.match(txt, /^Contact: mailto:\S+@cantonlock\.com$/m);
  const expires = txt.match(/^Expires: (.+)$/m)?.[1];
  assert.ok(expires, "Expires is mandatory (RFC 9116)");
  const days = (Date.parse(expires) - Date.now()) / 86400000;
  assert.ok(days > 30, `security.txt expires in ${Math.round(days)} days — move Expires a year on`);
});
