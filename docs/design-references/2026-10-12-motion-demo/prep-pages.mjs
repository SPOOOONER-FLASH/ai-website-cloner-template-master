// Data for the inner-page previews (Events, FAQ): read from content/ exactly as the site reads it,
// English only. Nothing is typed here; the logo is the live header artwork.
import fs from "node:fs";
import path from "node:path";

const SITE = path.resolve(import.meta.dirname, "../../..");
const OUT = path.resolve(import.meta.dirname, "public/img/pages");
const read = (p) => JSON.parse(fs.readFileSync(path.join(SITE, p), "utf8"));
fs.mkdirSync(OUT, { recursive: true });
const logo = path.join(SITE, "public/images/brand/hyde/hyde-logo-horizontal-black.svg");
if (!fs.existsSync(logo)) throw new Error("missing header logo");
fs.copyFileSync(logo, path.join(OUT, "hyde-logo.svg"));

const events = read("content/events.json").events.filter((e) => e.published)
  .sort((a, b) => a.startDate.localeCompare(b.startDate))
  .map(({ slug, name, market, city, venue, startDate, endDate, status, statusLabel, summary, sourceUrl, relatedHref, relatedLabel }) =>
    ({ slug, name, market, city, venue, startDate, endDate, status, statusLabel, summary, sourceUrl, relatedHref, relatedLabel }));
if (!events.some((e) => e.status === "exhibiting")) throw new Error("no exhibiting event to lead with");

const faq = read("content/faq.json").groups.map((g) => ({
  title: g.title,
  items: g.items.map((i) => ({ q: i.question, a: i.answer })),
}));
if (!faq.length || faq.some((g) => !g.items.length)) throw new Error("faq group without items");

fs.writeFileSync(path.join(import.meta.dirname, "src/pages.json"), `${JSON.stringify({ events, faq }, null, 2)}\n`);
console.log(`pages: ${events.length} events, ${faq.reduce((n, g) => n + g.items.length, 0)} questions in ${faq.length} groups`);
