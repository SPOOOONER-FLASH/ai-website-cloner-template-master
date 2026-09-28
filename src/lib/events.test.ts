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

  /*
    A stand is claimed only with evidence written here. 2026-09-28, client: BAU 2027 is
    confirmed — Messe München placement proposal for Hall C4, Stand 523 (row stand, 29.25 m²)
    accepted and the admission invoice paid by bank transfer; exhibitor passes being ordered
    (BAU 2027 Ausstellerservice session). Any other event saying "exhibiting" still fails.
  */
  const VERIFIED_STANDS: Record<string, string> = { "bau-munich-2027": "Hall C4, Stand 523" };

  for (const event of data.events.filter((item) => item.published)) {
    assert.match(event.sourceUrl ?? "", /^https:\/\//);
    assert.match(event.relatedHref ?? "", /^\//);
    assert.ok(event.relatedLabel?.trim());
    if (event.status === "exhibiting") {
      const stand = VERIFIED_STANDS[event.slug];
      assert.ok(stand, `${event.slug} claims a stand that is not verified`);
      assert.ok(event.statusLabel?.includes(stand), `${event.slug} must name its verified stand`);
    }
  }
});
