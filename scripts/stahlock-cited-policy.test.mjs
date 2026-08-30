import assert from "node:assert/strict";
import test from "node:test";

import {
  canonicalLabel,
  certificationClaim,
  conflictingCanonicalGroups,
} from "./stahlock-cited-policy.mjs";

test("certification filtering uses whole claims rather than substrings", () => {
  for (const safe of ["Surface", "Centre distance", "Office", "Sequence selector", "UL listed later"])
    assert.equal(certificationClaim(safe), safe === "UL listed later");

  for (const claim of ["CE", "CE marked", "EN 1125", "ANSI/BHMA", "Fire-rated", "UL listed"])
    assert.equal(certificationClaim(claim), true);
});

test("known Stahlock aliases collapse to the site's canonical labels", () => {
  assert.equal(canonicalLabel("Door Thickness"), "Door thickness");
  assert.equal(canonicalLabel("Center distance"), "Centre distance");
  assert.equal(canonicalLabel("Lock Body Material"), "Material");
  assert.equal(canonicalLabel("Opening Angle"), "Opening Angle");
});

test("different values for the same canonical field are held for review", () => {
  const rows = [
    { cantonlock_slug: "sample", label: "Bearing", stahlock_value: "Pair" },
    { cantonlock_slug: "sample", label: "Bearing", stahlock_value: "Non Bearing" },
    { cantonlock_slug: "sample", label: "Door Thickness", stahlock_value: "35-45mm" },
    { cantonlock_slug: "sample", label: "Door thickness", stahlock_value: "35-45mm" },
  ];

  assert.deepEqual([...conflictingCanonicalGroups(rows)], ["sample\u0000bearing"]);
});
