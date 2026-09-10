#!/usr/bin/env node
/**
 * Renders the client-facing Markdown documents as Word files under docs/hyde/.
 *
 * ---------------------------------------------------------------------------
 * WHY
 *
 * Client instruction, 2026-09-10: 「CLIENT-RUNBOOK.md 不要 md，给我看的一律 word，doc」
 * and 「以后 client book 放到 hyde 里，用 word 格式」.
 *
 * The reason is not preference. The runbook is read on a phone, on a server console, and
 * next to a browser — Markdown renders as raw asterisks and backticks in every one of
 * those places, and a runbook whose commands are surrounded by punctuation the reader is
 * unsure whether to type is a runbook that produces exactly the failure it exists to
 * prevent. On 2026-09-10 the client pasted a placeholder path verbatim because the
 * document did not make it obvious it was a placeholder.
 *
 * ---------------------------------------------------------------------------
 * WHY A CONVERTER AND NOT A HAND-WRITTEN WORD FILE
 *
 * AGENTS.md's generator rule: a deliverable that is hand-made goes stale silently and no
 * later session can tell whether it is current. The Markdown stays the source of truth —
 * it is what diffs, what reviews, and what the other agent reads — and the Word file is
 * built from it. Change the Markdown, re-run this, the Word file follows.
 *
 * Commands are the thing this file is careful about: every fenced block becomes a shaded,
 * monospaced, single-paragraph-per-line box, so what the reader must copy is unambiguous
 * and carries no Markdown punctuation.
 *
 *   node scripts/build-client-docx.mjs            # build all
 *   node scripts/build-client-docx.mjs --list     # show what it would build
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

const OUT_DIR = "docs/hyde";

/** Source → output basename and title. */
const DOCUMENTS = [
  {
    source: "docs/collaboration/CLIENT-RUNBOOK.md",
    out: "HYDE-操作手册-CLIENT-RUNBOOK.docx",
    title: "HYDE 操作手册",
    subtitle: "Spooner 的服务器 / Cloudflare / Search Console 操作指南",
  },
  {
    source: "docs/hyde/2026-09-10-xiaohongshu-recommendations.md",
    out: "HYDE-小红书优化建议汇总.docx",
    title: "小红书优化建议汇总",
    subtitle: "每一条建议：做完了没有，以及为什么",
  },
];

/* ------------------------------------------------------------------ layout */

const MONO = "Consolas";
const BODY = "Microsoft YaHei";
/* Content width for US Letter with 1" margins, in DXA. */
const CONTENT_WIDTH = 12240 - 1440 * 2;

const HEADINGS = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

/**
 * Inline Markdown → TextRun[].
 *
 * Handles **bold**, `code` and ~~strike~~ only. Anything more (links, nested emphasis)
 * is deliberately not parsed: this is a runbook, and a half-parsed link that drops its
 * URL is worse than a literal one the reader can still read.
 */
function runs(text, base = {}) {
  const out = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) {
      out.push(new TextRun({ text: text.slice(last, match.index), font: BODY, ...base }));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      out.push(new TextRun({ text: token.slice(2, -2), bold: true, font: BODY, ...base }));
    } else {
      out.push(
        new TextRun({
          text: token.slice(1, -1),
          font: MONO,
          shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
          ...base,
        }),
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) {
    out.push(new TextRun({ text: text.slice(last), font: BODY, ...base }));
  }
  return out.length ? out : [new TextRun({ text: "", font: BODY })];
}

/** A fenced code block: one shaded monospaced paragraph per line, nothing else. */
function codeBlock(lines) {
  return lines.map(
    (line, index) =>
      new Paragraph({
        children: [new TextRun({ text: line || " ", font: MONO, size: 20 })],
        shading: { type: ShadingType.CLEAR, fill: "F5F5F5" },
        spacing: { before: index === 0 ? 120 : 0, after: index === lines.length - 1 ? 120 : 0 },
        indent: { left: 240 },
      }),
  );
}

/** A GitHub-style table. Column widths are equal and must sum to the table width. */
function table(rows) {
  const columns = Math.max(...rows.map((r) => r.length));
  const width = Math.floor(CONTENT_WIDTH / columns);
  const columnWidths = Array.from({ length: columns }, () => width);

  return new Table({
    columnWidths,
    width: { size: columnWidths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: rows.map(
      (cells, rowIndex) =>
        new TableRow({
          tableHeader: rowIndex === 0,
          children: Array.from({ length: columns }, (_, i) => {
            const text = cells[i] ?? "";
            return new TableCell({
              width: { size: width, type: WidthType.DXA },
              shading:
                rowIndex === 0
                  ? { type: ShadingType.CLEAR, fill: "EDEDED" }
                  : undefined,
              margins: { top: 60, bottom: 60, left: 100, right: 100 },
              children: [
                new Paragraph({
                  children: runs(text.replace(/\\\|/g, "|"), rowIndex === 0 ? { bold: true } : {}),
                  spacing: { before: 0, after: 0 },
                }),
              ],
            });
          }),
        }),
    ),
  });
}

/** Split a Markdown table row, honouring escaped pipes. */
const splitRow = (line) =>
  line
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((c) => c.trim());

/* ------------------------------------------------------------------ parse */

function convert(markdown) {
  const lines = markdown.split(/\r?\n/);
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    /* Fenced code */
    if (/^```/.test(line)) {
      const block = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i])) {
        block.push(lines[i]);
        i += 1;
      }
      i += 1;
      children.push(...codeBlock(block));
      continue;
    }

    /* Table: a header row followed by a separator row */
    if (/^\|/.test(line) && /^\|[\s:|-]+\|?\s*$/.test(lines[i + 1] ?? "")) {
      const rows = [splitRow(line)];
      i += 2;
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      children.push(table(rows));
      children.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      continue;
    }

    /* Horizontal rule → a bottom-bordered empty paragraph, never a table */
    if (/^\s*---+\s*$/.test(line)) {
      children.push(
        new Paragraph({
          text: "",
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
          spacing: { before: 160, after: 160 },
        }),
      );
      i += 1;
      continue;
    }

    /* Heading */
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      children.push(
        new Paragraph({
          heading: HEADINGS[heading[1].length],
          children: runs(heading[2]),
          spacing: { before: 240, after: 120 },
        }),
      );
      i += 1;
      continue;
    }

    /* Blockquote — shaded so a warning reads as a warning on paper */
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      children.push(
        new Paragraph({
          children: runs(quote.join(" ")),
          shading: { type: ShadingType.CLEAR, fill: "FFF8E1" },
          indent: { left: 240 },
          spacing: { before: 120, after: 120 },
          border: { left: { style: BorderStyle.SINGLE, size: 12, color: "E0A800" } },
        }),
      );
      continue;
    }

    /* List item */
    const bullet = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (bullet) {
      children.push(
        new Paragraph({
          children: runs(bullet[2]),
          bullet: { level: Math.min(2, Math.floor(bullet[1].length / 2)) },
          spacing: { before: 40, after: 40 },
        }),
      );
      i += 1;
      continue;
    }
    const numbered = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (numbered) {
      children.push(
        new Paragraph({
          children: runs(`${numbered[2]}. ${numbered[3]}`),
          indent: { left: 360 + numbered[1].length * 180 },
          spacing: { before: 40, after: 40 },
        }),
      );
      i += 1;
      continue;
    }

    /* Blank */
    if (!line.trim()) {
      i += 1;
      continue;
    }

    children.push(
      new Paragraph({ children: runs(line), spacing: { before: 60, after: 60 } }),
    );
    i += 1;
  }

  return children;
}

/* ------------------------------------------------------------------ build */

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

if (process.argv.includes("--list")) {
  for (const doc of DOCUMENTS) {
    console.log(`${existsSync(doc.source) ? "✔" : "×"} ${doc.source} → ${OUT_DIR}/${doc.out}`);
  }
  process.exit(0);
}

for (const doc of DOCUMENTS) {
  if (!existsSync(doc.source)) {
    console.log(`× skipped, no source: ${doc.source}`);
    continue;
  }

  const body = convert(readFileSync(doc.source, "utf8"));
  const document = new Document({
    creator: "Canton Hyland",
    title: doc.title,
    description: doc.subtitle,
    sections: [
      {
        properties: {
          /* US Letter, not the A4 default. */
          page: { size: { width: 12240, height: 15840 }, margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } },
        },
        children: [
          new Paragraph({
            children: [new TextRun({ text: doc.title, bold: true, size: 40, font: BODY })],
            alignment: AlignmentType.LEFT,
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [new TextRun({ text: doc.subtitle, size: 22, color: "666666", font: BODY })],
            spacing: { after: 60 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `由 ${basename(doc.source)} 自动生成 · ${new Date().toISOString().slice(0, 10)} · 改内容请改 Markdown 再重新生成`,
                size: 18,
                color: "999999",
                font: BODY,
              }),
            ],
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" } },
            spacing: { after: 240 },
          }),
          ...body,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(document);
  const target = `${OUT_DIR}/${doc.out}`;
  try {
    writeFileSync(target, buffer);
    console.log(`✔ ${target}  (${Math.round(buffer.length / 1024)} KB)`);
  } catch (error) {
    /*
      Windows locks a .docx while Word has it open, and the client reads these documents
      while we are still editing them — so a locked target is the normal case, not an
      error worth failing the build over. Write a dated sibling instead and say so. The
      alternative, telling the reader to close the file and re-run, loses the document
      they asked for over a file handle.
    */
    if (error.code !== "EBUSY" && error.code !== "EPERM") throw error;
    const stamped = target.replace(/.docx$/, `-${new Date().toISOString().slice(0, 10)}.docx`);
    writeFileSync(stamped, buffer);
    console.log(`⚠ ${target} 正在被 Word 打开，改写到 ${stamped}`);
  }
}
