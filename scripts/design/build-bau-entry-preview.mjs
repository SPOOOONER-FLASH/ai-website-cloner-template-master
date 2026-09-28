import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const directory = path.join(repo, "docs/design-references/bau-2027-entry-preview");
const outputArg = process.argv.indexOf("--out");
const output = outputArg >= 0
  ? path.resolve(process.argv[outputArg + 1])
  : path.join(directory, "hyde-bau-options.html");
const assets = {
  logo: "public/images/brand/hyde/hyde-logo-horizontal-black.svg",
  hero: "public/images/editorial/responsive/home-panic-exit-bars-800w.webp",
  lever: "public/images/editorial/responsive/hyde-real-lever-set-dark-800w.webp",
  product307: "public/images/responsive/products/307-panic-exit-device-640w.webp",
  product311: "public/images/responsive/products/311-panic-exit-device-640w.webp",
};

let html = fs.readFileSync(path.join(directory, "preview.template.html"), "utf8");
const evidence = [];
for (const [key, relative] of Object.entries(assets)) {
  const bytes = fs.readFileSync(path.join(repo, relative));
  const mime = relative.endsWith(".svg") ? "image/svg+xml" : "image/webp";
  html = html.replaceAll(`{{${key}}}`, `data:${mime};base64,${bytes.toString("base64")}`);
  evidence.push({
    key,
    source: relative,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    treatment: "Original existing rendition embedded unchanged; product images use contain.",
  });
}
if (/\{\{\w+\}\}/.test(html)) throw new Error("Unresolved preview template marker");
if (Buffer.byteLength(html) >= 1_000_000) throw new Error("Preview exceeds the 1 MB inline limit");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html);
fs.writeFileSync(path.join(directory, "provenance.json"), `${JSON.stringify({
  scope: "Preview only; no production source, forms, or exports changed.",
  visualReference: "FSB-inspired incumbent HYDE monochrome composition",
  eventSource: "Live EN/DE BAU pages reviewed on 2026-09-28; organiser allocation not independently checked.",
  date: "11–15 January 2027",
  stand: "Hall C4, Stand 523",
  assets: evidence,
}, null, 2)}\n`);
console.log(`Preview: ${output}`);
console.log(`Size: ${Buffer.byteLength(html)} bytes; ${evidence.length} unchanged real/source assets`);
