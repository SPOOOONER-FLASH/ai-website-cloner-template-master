#!/usr/bin/env node
/**
 * The handwriting version of the master key plan sheet.
 *
 * MIWA ship two formats and say what each is for: Excel with dropdowns for typing, PDF
 * "手書き用" — for filling in by hand. The second one is not a lesser copy of the first.
 * A specifier walking a building with a clipboard is not opening a spreadsheet, and a
 * contractor without Excel is not a contractor we should lose.
 *
 * This repository has no PDF library and adding one to emit a form would be a dependency
 * nobody asked for. A print stylesheet does the same job: the buyer prints it, or uses
 * their browser's "save as PDF", and gets the same sheet. It also stays readable on a
 * phone, which a PDF of a wide table does not.
 *
 * Same payload as the workbook, so the two cannot drift: run build-master-key-sheet.mjs
 * first and both read what it wrote.
 *
 * Usage:  node scripts/build-master-key-print-sheet.mjs [payload.json] [out.html]
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const payloadPath = process.argv[2] ?? "docs/collaboration/master-key-plan.json";
const out = process.argv[3] ?? "public/downloads/master-key-plan-sheet.html";
const payload = JSON.parse(readFileSync(payloadPath, "utf8"));

const esc = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Rows of empty boxes. Twenty-eight fits one sheet of A4 at this type size. */
const BLANK_ROWS = 28;

const columns = payload.columns;

const systemFields = [
  ["Project / building", "Name we should put on the keying chart"],
  ["Levels you think you need", "Most buildings need three. Say if you are unsure"],
  ["Keyway", "Every cylinder in one system shares it, and it cannot be changed later"],
  ["Spare keys per level", "Including the ones the building owner keeps"],
  ["Contact for the chart", "Who approves it before any cylinder is pinned"],
];

const head = columns.map((column) => `<th>${esc(column.label)}</th>`).join("");
const help = columns
  .map((column) => `<td class="help">${esc(column.help ?? "")}</td>`)
  .join("");

const blank = Array.from(
  { length: BLANK_ROWS },
  () => `<tr>${columns.map(() => "<td></td>").join("")}</tr>`,
).join("\n      ");

const exampleRows = payload.example.rows
  .map(
    (record) =>
      `<tr class="example">${columns
        .map((column) => `<td>${esc(record[column.key] ?? "")}</td>`)
        .join("")}</tr>`,
  )
  .join("\n      ");

const exampleSystem = Object.entries(payload.example.system)
  .map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`)
  .join("\n      ");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(payload.meta.title)} — Canton Hyland</title>
<meta name="description" content="Door schedule input sheet for a master key system. Print in landscape, fill in one line per door, and send it back."/>
<!--
  A canonical and a robots tag, because this file lands in out/ and the SEO audit walks
  every .html there as a page — it has no way to know this one is a form. noindex keeps it
  out of the index where it belongs; the canonical stops the audit reporting a page with
  no canonical, which would be a real finding on any other file in that directory.
-->
<meta name="robots" content="noindex, follow"/>
<link rel="canonical" href="https://cantonlock.com/downloads/master-key-plan-sheet.html"/>
<style>
  /*
    Print first. This page exists to leave the screen, so the print rules are the real
    design and the screen rules are the preview of it. Landscape because the table has ten
    columns and a portrait A4 would set them at a width nobody can write in.
  */
  @page { size: A4 landscape; margin: 12mm; }

  :root { --ink: #16150f; --muted: #6b6b6b; --rule: #c9c5bb; --fill: #f7f5f1; }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 24px;
    font: 12px/1.45 "Helvetica Neue", Arial, sans-serif;
    color: var(--ink); background: #fff;
  }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 28px 0 8px; }
  .sub { color: var(--muted); margin: 0 0 18px; font-size: 11px; }
  .intro li { margin-bottom: 6px; max-width: 62em; }

  dl.system { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin: 0 0 8px; }
  dl.system div { display: grid; grid-template-columns: 15em 1fr; align-items: end; }
  dl.system dt { color: var(--muted); font-size: 11px; }
  dl.system dd { margin: 0; border-bottom: 1px solid var(--rule); min-height: 20px; }

  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  th, td { border: 1px solid var(--rule); padding: 5px 6px; vertical-align: top; }
  th { background: var(--fill); text-align: left; font-size: 11px; }
  td { height: 26px; }
  td.help { color: var(--muted); font-size: 9px; height: auto; background: #fcfbf9; }
  tr.example td { background: var(--fill); font-size: 11px; }

  .note { color: var(--muted); font-size: 10px; margin-top: 8px; max-width: 70em; }
  .page-break { break-before: page; }

  @media print {
    body { padding: 0; font-size: 10px; }
    a { text-decoration: none; color: inherit; }
    /* A form that reprints its own instructions on every sheet wastes the sheet. */
    .screen-only { display: none; }
  }
</style>
</head>
<body>

<h1>${esc(payload.meta.title)}</h1>
<p class="sub">Canton Hyland Hardware (Group) Co., Ltd. · cantonlock.com${esc(payload.meta.article)}</p>

<ul class="intro">
  ${payload.intro.map((line) => `<li>${esc(line)}</li>`).join("\n  ")}
  <li class="screen-only"><strong>Printing:</strong> use landscape. Your browser's “Save as PDF” produces the same sheet if you would rather send it back by email.</li>
</ul>

<h2>About the system as a whole</h2>
<dl class="system">
  ${systemFields
    .map(([label, hint]) => `<div><dt>${esc(label)}<br><span style="font-size:9px">${esc(hint)}</span></dt><dd></dd></div>`)
    .join("\n  ")}
</dl>

<h2>Door schedule — one line per door</h2>
<table>
  <thead><tr>${head}</tr></thead>
  <tbody>
    <tr>${help}</tr>
    ${blank}
  </tbody>
</table>
<p class="note">Fill in what you know and leave the rest. We would rather have the schedule with gaps than wait for a complete one.</p>

<div class="page-break"></div>
<h2>Worked example — copy this pattern</h2>
<p class="sub">A small three-level building. Three levels is what most buildings need; showing five here would quietly recommend five.</p>
<dl class="system">
  ${exampleSystem}
</dl>
<table>
  <thead><tr>${head}</tr></thead>
  <tbody>
    ${exampleRows}
  </tbody>
</table>
<p class="note">
  Two rows above are the ones buyers most often get wrong. G-04 is opened by the grand master ONLY —
  say so explicitly, because a door left blank gets the floor master by default. 2-07 counts the
  contractor's keys in the key column; keys nobody counted are the usual reason a chart has to be redrawn.
</p>

</body>
</html>
`;

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`print sheet -> ${out}`);
console.log(`  ${columns.length} columns · ${BLANK_ROWS} blank rows · ${payload.example.rows.length} example rows`);
