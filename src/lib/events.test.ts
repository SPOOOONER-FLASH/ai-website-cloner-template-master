import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type EventFixture = {
  slug: string;
  startDate?: string;
  endDate?: string;
  status: string;
  published: boolean;
  sourceUrl?: string;
  relatedHref?: string;
  relatedLabel?: string;
};

test("published exhibition dates match the current organiser schedules", () => {
  const data = JSON.parse(readFileSync("content/events.json", "utf8")) as {
    events: EventFixture[];
  };
  const bySlug = new Map(data.events.map((event) => [event.slug, event]));

  assert.deepEqual(
    [bySlug.get("canton-fair-autumn-2026")?.startDate, bySlug.get("canton-fair-autumn-2026")?.endDate],
    ["2026-10-15", "2026-10-19"],
  );
  assert.deepEqual(
    [bySlug.get("bau-munich-2027")?.startDate, bySlug.get("bau-munich-2027")?.endDate],
    ["2027-01-11", "2027-01-15"],
  );
  assert.deepEqual(
    [bySlug.get("feicon-brazil-2027")?.startDate, bySlug.get("feicon-brazil-2027")?.endDate],
    ["2027-04-06", "2027-04-09"],
  );
  assert.deepEqual(
    [bySlug.get("tool-japan-2026")?.startDate, bySlug.get("tool-japan-2026")?.endDate],
    ["2026-10-07", "2026-10-09"],
  );
  assert.equal(bySlug.get("tool-japan-2026")?.published, true);
  assert.equal(bySlug.get("tool-japan-2026")?.sourceUrl, "https://www.tooljapan.jp/en-gb.html");

  assert.deepEqual(
    [
      bySlug.get("expo-nacional-ferretera-guadalajara-2026")?.startDate,
      bySlug.get("expo-nacional-ferretera-guadalajara-2026")?.endDate,
    ],
    ["2026-09-03", "2026-09-05"],
  );
  assert.equal(
    bySlug.get("expo-nacional-ferretera-guadalajara-2026")?.sourceUrl,
    "https://www.expoferretera.com.mx/es-mx/expositores.html",
  );
  assert.deepEqual(
    [
      bySlug.get("expo-ferretera-argentina-2027")?.startDate,
      bySlug.get("expo-ferretera-argentina-2027")?.endDate,
    ],
    ["2027-10-20", "2027-10-23"],
  );
  assert.equal(
    bySlug.get("expo-ferretera-argentina-2027")?.sourceUrl,
    "https://expoferretera.ar.messefrankfurt.com/buenosaires/es.html",
  );
});

test("public events have organiser sources and do not claim an unverified exhibition stand", () => {
  const data = JSON.parse(readFileSync("content/events.json", "utf8")) as {
    events: EventFixture[];
  };

  for (const event of data.events.filter((item) => item.published)) {
    assert.match(event.sourceUrl ?? "", /^https:\/\//);
    assert.match(event.relatedHref ?? "", /^\//);
    assert.ok(event.relatedLabel?.trim());
    assert.notEqual(event.status, "exhibiting");
  }
});
