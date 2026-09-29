#!/usr/bin/env node
/**
 * Measure the live RSS feeds, one per locale. `npm run seo:feeds`
 *
 * WHY THIS IS A SCRIPT AND NOT A TABLE IN A DOCUMENT
 *
 * On 2026-09-28 the client's to-do list said "submit /es/feed.xml and /pt/feed.xml to
 * Search Console". Both were 404 at the time. Submitting them would have produced two
 * failure rows he would later have had to delete — so the runbook grew a table of
 * measured statuses and an instruction to wait. Hours later a release landed, all ten
 * turned 200, and that table became wrong in the direction that costs the most: it told a
 * busy person not to do something he could now do.
 *
 * A number pasted into a document cannot say when it was taken. This re-runs in seconds,
 * so the runbook carries the command instead of the conclusion.
 *
 * "200" is not the same as "correct", so each feed is checked for:
 *   - status 200
 *   - <language> is the locale's own BCP 47 tag, not the English one
 *   - atom:link rel="self" points at THIS feed, not at /feed.xml. This is the one that
 *     nearly shipped wrong: localisedHref("/feed.xml", "fr") returns "/feed.xml", so the
 *     obvious implementation makes all ten feeds claim to be the English feed, and a
 *     search engine that believes rel="self" treats nine of them as duplicates of it.
 *   - the first <item><link> sits under /<locale>/, so a reader who finds the article in
 *     Discover is offered the page in their own language rather than the English one
 *   - every item carries an <enclosure>, which is what lets Discover run the large card
 *
 * Exits 1 on any failure. `--json` prints machine-readable output.
 */
import { readFileSync } from "node:fs";

const JSON_OUT = process.argv.includes("--json");
const ORIGIN = process.argv.find((a) => a.startsWith("--origin="))?.slice(9) ?? "https://cantonlock.com";

/*
  The locale LIST is read from the source; the expected `<language>` is stated here.

  Those are two different decisions and only one of them belongs in the source. The list
  must come from `locales`, because a hand-typed list is what left 645 Portuguese pages
  unreachable from the language panel in September — a new locale does not announce itself
  to an old list. If the literal ever stops being one this throws, which is correct: a
  checker that quietly falls back to a stale list of nine is worse than one that stops.

  The expected value, on the other hand, must NOT be imported from article-feed.ts. A
  checker that reads its expectation from the code it is checking agrees with that code by
  construction and can never fail. So the rule is restated: the bare language code, with
  pt-BR as the one documented exception for the Brazilian tree. That independence is what
  caught seven feeds declaring fr-FR / de-DE / ja-JP on 2026-09-28.
*/
function localeTags() {
  const src = readFileSync("src/data/locales.ts", "utf8");
  const block = /export const locales = \[([^\]]*)\]/.exec(src);
  if (!block) throw new Error("`locales` is no longer a plain array literal in src/data/locales.ts — update scripts/verify-live-feeds.mjs");
  const codes = [...block[1].matchAll(/"([a-z-]+)"/g)].map(([, code]) => code);
  if (codes.length < 2) throw new Error("`locales` parsed to fewer than two entries — the regex no longer matches");
  return codes.map((code) => ({ code, tag: code === "pt" ? "pt-BR" : code }));
}

/** The feed path for a locale. English is at the root; every other locale is prefixed. */
const feedPath = (code) => (code === "en" ? "/feed.xml" : `/${code}/feed.xml`);

async function measure({ code, tag }) {
  const url = `${ORIGIN}${feedPath(code)}`;
  const problems = [];
  let res;
  try {
    res = await fetch(url, { redirect: "manual" });
  } catch (err) {
    return { code, url, status: 0, problems: [`unreachable: ${err.message}`] };
  }
  if (res.status !== 200) return { code, url, status: res.status, problems: [`status ${res.status}, expected 200`] };

  const xml = await res.text();
  const language = /<language>([^<]*)<\/language>/.exec(xml)?.[1];
  const self = /<atom:link href="([^"]+)" rel="self"/.exec(xml)?.[1];
  const items = [...xml.matchAll(/<item>/g)].length;
  const firstLink = [...xml.matchAll(/<link>([^<]+)<\/link>/g)][1]?.[1];
  const enclosures = [...xml.matchAll(/<enclosure /g)].length;

  if (language !== tag) problems.push(`<language> is ${language ?? "absent"}, expected ${tag}`);
  if (self !== url) problems.push(`rel="self" is ${self ?? "absent"}, expected ${url}`);
  if (!items) problems.push("no <item> elements");
  /* The English tree has no prefix, so there is nothing to assert about its item links. */
  if (code !== "en" && firstLink && !firstLink.startsWith(`${ORIGIN}/${code}/`)) {
    problems.push(`first item links to ${firstLink}, which is not under /${code}/`);
  }
  if (items && enclosures < items) problems.push(`${items - enclosures} of ${items} items have no <enclosure>`);

  return { code, url, status: 200, language, self, items, enclosures, firstLink, problems };
}

const results = [];
for (const locale of localeTags()) results.push(await measure(locale));

const failed = results.filter((r) => r.problems.length);

if (JSON_OUT) {
  console.log(JSON.stringify({ origin: ORIGIN, measuredAt: new Date().toISOString(), results }, null, 2));
} else {
  console.log(`RSS feeds on ${ORIGIN} — ${new Date().toISOString().slice(0, 16).replace("T", " ")}Z\n`);
  console.log("locale  status  language  items  enclosures  rel=self");
  for (const r of results) {
    const mark = r.problems.length ? "✗" : "✓";
    console.log(
      `${mark} ${r.code.padEnd(4)}  ${String(r.status).padEnd(6)}  ${(r.language ?? "-").padEnd(8)}  ${String(r.items ?? "-").padEnd(5)}  ${String(r.enclosures ?? "-").padEnd(10)}  ${r.self ?? "-"}`,
    );
  }
  for (const r of failed) for (const p of r.problems) console.log(`\n✗ ${r.url}\n  ${p}`);
  console.log(
    failed.length
      ? `\n❌ ${failed.length} of ${results.length} feeds have a problem`
      : `\n✅ all ${results.length} feeds are live and correct`,
  );
}

process.exit(failed.length ? 1 : 0);
