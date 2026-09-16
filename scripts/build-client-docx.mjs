#!/usr/bin/env node
/**
 * Turns a collaboration Markdown document into the .docx the client asked for.
 *
 * ---------------------------------------------------------------------------
 * WHY A CONVERTER AND NOT A HAND-BUILT DOCUMENT
 *
 * Client instruction, 2026-09-15: 「我要 doc word 不是 md，你给 codex 和其他 agent 用 md 就行」.
 * So each of these documents now exists twice, and the two copies will disagree the first
 * time somebody edits one — the same failure AGENTS.md describes for a sheet pasted into
 * chat: correct on the day, unverifiable a week later.
 *
 * The first Word file was assembled by a one-off script in a scratchpad directory with the
 * text retyped into it. That is the version that goes stale. This reads the Markdown, so
 * the Markdown stays the source and the Word file is an export — re-runnable, and wrong
 * only if the Markdown is wrong.
 *
 * ---------------------------------------------------------------------------
 * WHAT IT UNDERSTANDS
 *
 * Only what these documents actually use: ATX headings, paragraphs, pipe tables, fenced
 * code, "-" bullets, "1." numbers, ">" quotes, "---" rules, and inline bold and code.
 * It is not a general Markdown implementation and should not become one — an unsupported
 * construct is better fixed by simplifying the Markdown, which both audiences read.
 *
 * Usage:
 *   node scripts/build-client-docx.mjs                 # every document in DOCUMENTS
 *   node scripts/build-client-docx.mjs --only=scene    # one, by substring of its path
 */
import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import {
  AlignmentType, BorderStyle, Document, HeadingLevel, LevelFormat, Packer, Paragraph,
  ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from "docx";

/** Chinese needs a CJK face; Microsoft YaHei is on every Windows the client uses. */
const FONT = "Microsoft YaHei";
const MONO = "Consolas";
/** Usable width inside A4 with 1in margins, in DXA (1440 = 1 inch). */
const PAGE_W = 9026;

const DOCUMENTS = [
  {
    md: "docs/collaboration/2026-09-15-catalogue-scene-style.md",
    docx: "docs/collaboration/2026-09-15-拍摄风格拆解.docx",
  },
  {
    md: "docs/collaboration/2026-09-15-scene-shortlist.md",
    docx: "docs/collaboration/2026-09-15-选品清单.docx",
  },
];

/* ---------------------------------------------------------------- inline runs ----- */

/**
 * Splits a line into runs on bold and inline-code markers.
 *
 * Markdown markers survive into the Word file if they are not removed here, and a client
 * reading a line still wrapped in asterisks learns only that the export is unfinished.
 */
function runs(text, base = {}) {
  const out = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`/g;
  let at = 0;
  let match;
  while ((match = pattern.exec(text))) {
    if (match.index > at) {
      out.push(new TextRun({ text: text.slice(at, match.index), font: FONT, ...base }));
    }
    if (match[1] !== undefined) {
      out.push(new TextRun({ text: match[1], font: FONT, ...base, bold: true }));
    } else {
      out.push(new TextRun({ text: match[2], font: MONO, ...base, size: (base.size ?? 20) - 2 }));
    }
    at = match.index + match[0].length;
  }
  if (at < text.length) out.push(new TextRun({ text: text.slice(at), font: FONT, ...base }));
  return out.length ? out : [new TextRun({ text: "", font: FONT, ...base })];
}

const para = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    children: runs(text, opts.run ?? { size: 20 }),
    ...opts.para,
  });

const HEADINGS = [
  HeadingLevel.TITLE,
  HeadingLevel.HEADING_1,
  HeadingLevel.HEADING_2,
  HeadingLevel.HEADING_3,
];

const heading = (text, depth) =>
  new Paragraph({
    heading: HEADINGS[Math.min(depth, HEADINGS.length) - 1],
    spacing: { before: depth <= 2 ? 320 : 240, after: 140 },
    children: runs(text, { bold: true }),
  });

const rule = () =>
  new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
    children: [new TextRun({ text: "", font: FONT })],
  });

/* -------------------------------------------------------------------- tables ------ */

const splitRow = (line) =>
  line.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((cell) => cell.trim());

const isDivider = (line) => /^\s*\|[\s:|-]+\|\s*$/.test(line);

/**
 * Column widths from the content, not an even split.
 *
 * An even split wraps a product name onto three lines beside a column holding one digit.
 * The measure counts a CJK character as two, because at the same point size it is about
 * twice as wide as a Latin one, and clamps so no column can collapse to nothing.
 */
function columnWidths(rows) {
  const width = (text) =>
    [...text].reduce((n, ch) => n + (/[　-鿿＀-￯]/.test(ch) ? 2 : 1), 0);
  const measures = rows[0].map((_, i) => Math.max(...rows.map((row) => width(row[i] ?? ""))));
  const total = measures.reduce((a, b) => a + b, 0) || 1;
  const raw = measures.map((m) => Math.max(700, Math.round((m / total) * PAGE_W)));
  const scale = PAGE_W / raw.reduce((a, b) => a + b, 0);
  const scaled = raw.map((w) => Math.round(w * scale));
  /* Rounding must not leave columnWidths disagreeing with the table width. */
  const drift = PAGE_W - scaled.reduce((a, b) => a + b, 0);
  scaled[scaled.indexOf(Math.max(...scaled))] += drift;
  return scaled;
}

function table(rows) {
  const widths = columnWidths(rows);
  return new Table({
    columnWidths: widths,
    width: { size: PAGE_W, type: WidthType.DXA },
    rows: rows.map(
      (cells, r) =>
        new TableRow({
          tableHeader: r === 0,
          children: widths.map(
            (w, c) =>
              new TableCell({
                width: { size: w, type: WidthType.DXA },
                /* CLEAR, never SOLID — SOLID renders as a black block. */
                shading: r === 0 ? { type: ShadingType.CLEAR, fill: "EFEFEF" } : undefined,
                children: [
                  new Paragraph({
                    spacing: { before: 60, after: 60 },
                    children: runs(cells[c] ?? "", { size: 18, bold: r === 0 }),
                  }),
                ],
              }),
          ),
        }),
    ),
  });
}

/* --------------------------------------------------------------------- parse ------ */

function convert(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (/^```/.test(line)) {
      const code = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i += 1;
      for (const row of code) {
        blocks.push(
          new Paragraph({
            spacing: { after: 0 },
            shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
            children: [new TextRun({ text: row || " ", font: MONO, size: 18 })],
          }),
        );
      }
      blocks.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }

    const atx = line.match(/^(#{1,4})\s+(.*)$/);
    if (atx) {
      blocks.push(heading(atx[2], atx[1].length));
      i += 1;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      blocks.push(rule());
      i += 1;
      continue;
    }

    if (/^\s*\|/.test(line) && isDivider(lines[i + 1] ?? "")) {
      const rows = [splitRow(line)];
      i += 2;
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(splitRow(lines[i++]));
      blocks.push(table(rows));
      blocks.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
      continue;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      blocks.push(
        new Paragraph({
          numbering: { reference: "dot", level: 0 },
          spacing: { after: 80 },
          children: runs(bullet[1], { size: 20 }),
        }),
      );
      i += 1;
      continue;
    }

    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      /* A numbered item's continuation lines are indented under it in the source. */
      let text = numbered[1];
      while (/^\s{3,}\S/.test(lines[i + 1] ?? "")) text += lines[++i].trim();
      blocks.push(
        new Paragraph({
          numbering: { reference: "num", level: 0 },
          spacing: { after: 80 },
          children: runs(text, { size: 20 }),
        }),
      );
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(
        new Paragraph({
          spacing: { before: 120, after: 160 },
          indent: { left: 360 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: "BBBBBB", space: 12 } },
          children: runs(quote.join(""), { size: 20, italics: true }),
        }),
      );
      continue;
    }

    /* A paragraph, rejoined across the source's hard wraps. */
    const body = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|```|---+\s*$|>\s?|\s*[-*]\s|\s*\d+\.\s|\s*\|)/.test(lines[i])
    ) {
      body.push(lines[i++].trim());
    }
    blocks.push(para(body.join("")));
  }

  return blocks;
}

/* ----------------------------------------------------------------------- emit ----- */

const only = (process.argv.find((arg) => arg.startsWith("--only=")) ?? "").split("=")[1];

for (const entry of DOCUMENTS) {
  if (only && !entry.md.includes(only)) continue;

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "dot",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 200 } } },
            },
          ],
        },
        {
          reference: "num",
          levels: [
            {
              level: 0,
              format: LevelFormat.DECIMAL,
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 360, hanging: 200 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
        children: convert(readFileSync(entry.md, "utf8")),
      },
    ],
  });

  writeFileSync(entry.docx, await Packer.toBuffer(doc));
  console.log(`  ${basename(entry.docx)}  <-  ${basename(entry.md)}`);
}
