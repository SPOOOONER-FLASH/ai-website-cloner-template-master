#!/usr/bin/env node
/**
 * Reads an .xlsx into rows of strings, with no dependency.
 *
 * WHY THIS EXISTS. The client sends Search Console exports and quotation workbooks as
 * .xlsx, and reading them has so far meant either adding a spreadsheet library to a site
 * that does not otherwise need one, or opening them by hand and retyping figures into a
 * report — which is exactly the "paste the output instead of writing the generator"
 * failure this repository's rules warn about. An .xlsx is a zip of XML; Node ships the
 * unzip. Sixty lines is cheaper than a dependency and cheaper than retyping.
 *
 * WHAT IT HANDLES, and the two things that break a naive reader:
 *
 *   SHARED STRINGS. Text is not stored in the cell. The cell holds an index into
 *   xl/sharedStrings.xml, marked `t="s"`, and a reader that ignores that returns integers
 *   where the labels should be — which looks like data rather than like a bug.
 *
 *   EMPTY CELLS ARE ABSENT. A row with nothing in column B jumps from `<c r="A7">` to
 *   `<c r="C7">`. Reading cells in document order silently shifts every value one column
 *   left from that point on, so columns are placed by the `r` reference, not by counting.
 *
 * Usage:
 *   node scripts/read-xlsx.mjs <file.xlsx> [--sheet 2] [--rows 40] [--json]
 */

import { readFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i > -1 ? args[i + 1] : fallback;
};

if (!file) {
  console.error("Usage: node scripts/read-xlsx.mjs <file.xlsx> [--sheet N] [--rows N] [--json]");
  process.exit(1);
}

/** The zip entries, by name. */
function unzip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0; i -= 1) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error("not a zip file");

  const count = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  const files = {};

  for (let k = 0; k < count; k += 1) {
    const nameLen = buffer.readUInt16LE(offset + 28);
    const extraLen = buffer.readUInt16LE(offset + 30);
    const commentLen = buffer.readUInt16LE(offset + 32);
    const localHeader = buffer.readUInt32LE(offset + 42);
    const name = buffer.toString("utf8", offset + 46, offset + 46 + nameLen);
    const method = buffer.readUInt16LE(offset + 10);
    const compressed = buffer.readUInt32LE(offset + 20);

    const lNameLen = buffer.readUInt16LE(localHeader + 26);
    const lExtraLen = buffer.readUInt16LE(localHeader + 28);
    const start = localHeader + 30 + lNameLen + lExtraLen;
    const raw = buffer.subarray(start, start + compressed);

    files[name] = method === 0 ? raw : inflateRawSync(raw);
    offset += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

const decode = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

/** "AA" -> 26. Column letters are base-26 with no zero. */
const columnIndex = (ref) => {
  const letters = ref.match(/^[A-Z]+/)?.[0] ?? "A";
  let n = 0;
  for (const c of letters) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
};

const files = unzip(readFileSync(file));

const sharedXml = files["xl/sharedStrings.xml"]?.toString("utf8") ?? "";
/* One <si> may hold several <t> runs (mixed formatting); they concatenate into one string. */
const shared = [...sharedXml.matchAll(/<si>([\s\S]*?)<\/si>/g)].map((si) =>
  decode([...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")),
);

const sheetNames = Object.keys(files)
  .filter((f) => /^xl\/worksheets\/sheet\d+\.xml$/.test(f))
  .sort();

const wanted = flag("sheet");
const sheets = wanted ? [sheetNames[Number(wanted) - 1]].filter(Boolean) : sheetNames;
const limit = Number(flag("rows", 40));
const out = {};

for (const sheet of sheets) {
  const xml = files[sheet].toString("utf8");
  const rows = [...xml.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map((row) => {
    const cells = [];
    for (const cell of row[1].matchAll(/<c\s([^>]*?)\/?>(?:([\s\S]*?)<\/c>)?/g)) {
      const attrs = cell[1];
      const ref = attrs.match(/r="([A-Z]+\d+)"/)?.[1] ?? "A1";
      const type = attrs.match(/t="(\w+)"/)?.[1];
      const body = cell[2] ?? "";
      const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      const inline = body.match(/<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>/)?.[1];

      let value = "";
      if (type === "s" && v !== undefined) value = shared[Number(v)] ?? "";
      else if (type === "inlineStr") value = decode(inline ?? "");
      else if (v !== undefined) value = v;

      cells[columnIndex(ref)] = value;
    }
    /* Absent cells stay as holes; fill them so a row is a plain array of strings. */
    return Array.from(cells, (c) => c ?? "");
  });
  out[sheet] = rows;
}

if (args.includes("--json")) {
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

for (const [sheet, rows] of Object.entries(out)) {
  console.log(`\n--- ${sheet} (${rows.length} rows) ---`);
  for (const row of rows.slice(0, limit)) console.log("  " + row.join(" | "));
  if (rows.length > limit) console.log(`  … ${rows.length - limit} more rows`);
}
