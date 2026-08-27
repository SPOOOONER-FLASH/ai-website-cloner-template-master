/**
 * Extracts the client's own product copy from F:\网站资料\产品描述 into a reviewable
 * JSON file, so a later pass can fill spec tables from it.
 *
 * WHY THIS EXISTS. Thirteen Word files written by the client in 2019 and 2022 hold the
 * material, size and finish for whole product families — exactly the data 106 spec
 * tables are still missing. There is no Word on this machine and the local python is a
 * Store stub, so both formats are read here directly:
 *
 *   .docx  a zip; inflate word/document.xml and strip tags.
 *   .doc   OLE2. Word 97 stores its text as UTF-16LE inside the container, so the whole
 *          file is decoded that way and the runs that read as prose are kept. Everything
 *          else — stream names, font tables, the piece table — fails the filter. Crude,
 *          but it either yields legible text or yields nothing; it cannot invent a
 *          plausible wrong value. (Decoding these as CP936 gives confident mojibake,
 *          which is the failure mode worth avoiding.)
 *
 * ⚠ CERTIFICATION LINES ARE DISCARDED, NOT EXTRACTED. The 2022 panic-device file carries
 * "Quality standard: CE certificate, Fire rated EN1125" against every model. Only two
 * test reports are ours and neither covers those models — see the certificates block in
 * src/data/company.ts. Importing that line would re-publish the exact claim removed from
 * the site today, so `certificationLines` collects them separately for the client to
 * confirm and nothing merges them into product data.
 *
 *   node scripts/read-drive-descriptions.mjs [--write]
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import path from "node:path";

const DIR = "F:/网站资料/产品描述";
const OUT = "docs/research/legacy/drive-descriptions.json";
const write = process.argv.includes("--write");

/** A claim the site may not repeat without a certificate naming that exact model. */
const CERTIFICATION = /(EN\s?11\d\d|CE\s+certif|BHMA|ANSI|fire\s*rated|UL\b)/i;

/** word/document.xml out of a .docx, without a zip dependency. */
function readDocx(file) {
  const buf = readFileSync(file);
  const signature = Buffer.from("PK\x03\x04");
  let i = 0;
  while ((i = buf.indexOf(signature, i)) >= 0) {
    const method = buf.readUInt16LE(i + 8);
    const compressed = buf.readUInt32LE(i + 18);
    const nameLength = buf.readUInt16LE(i + 26);
    const extraLength = buf.readUInt16LE(i + 28);
    const name = buf.slice(i + 30, i + 30 + nameLength).toString();
    const start = i + 30 + nameLength + extraLength;
    if (name === "word/document.xml" && compressed > 0) {
      const raw = buf.slice(start, start + compressed);
      const xml = (method === 8 ? inflateRawSync(raw) : raw).toString("utf8");
      return xml
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&");
    }
    i = start + (compressed || 1);
  }
  return "";
}

/**
 * Legacy .doc. Word 97 stores its text as UTF-16LE inside the OLE container, so the whole
 * file is decoded that way and the runs that read as prose are kept; stream names, the
 * font table and the piece table all fail the filter.
 *
 * Decoding these as CP936 instead yields confident mojibake — pages of "鄥燆鵒h" — which is
 * the failure mode worth avoiding, because it looks like data.
 */
function readDoc(file) {
  const decoded = new TextDecoder("utf-16le", { fatal: false }).decode(readFileSync(file));
  const runs = decoded.match(/[一-鿿　-〿＀-￯A-Za-z0-9 ,.:;()-*×/'"%]{6,}/g) ?? [];
  return runs
    .map((run) => run.trim())
    .filter((run) => !FURNITURE.test(run))
    // The wide-character halves of ASCII runs decode into these blocks: "愀氀椀".
    .filter((run) => !/[぀-ヿ䀀-䷿]/.test(run))
    .filter((run) => /[一-鿿]/.test(run) || /[A-Za-z]{4,}/.test(run))
    .join("\n");
}

/** OLE stream names, font names and Word's own labels — never product copy. */
const FURNITURE =
  /^(Root|Entry|SummaryInformation|DocumentSummaryInformation|WordDocument|Administrator|Normal|dotm|Office|KSO|Data|1Table|ObjectPool|Times New Roman|Arial|Calibri|Wingdings|Cambria|MS Mincho)|默认段落字体|专业版|ProductBuildVer/;

const files = readdirSync(DIR).filter((f) => /\.docx?$/i.test(f) && !f.startsWith("~"));
const documents = [];
const certificationLines = [];

for (const file of files) {
  const full = path.join(DIR, file);
  const text = (file.toLowerCase().endsWith(".docx") ? readDocx(full) : readDoc(full))
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const kept = [];
  for (const line of text) {
    if (CERTIFICATION.test(line)) {
      certificationLines.push({ file, line });
      continue;
    }
    kept.push(line);
  }

  // "MODEL:9084E" / "型号：9084E" starts a record; everything until the next one is its.
  const records = [];
  let current = null;
  for (const line of kept) {
    const model = /^(?:MODEL|Model|型号)\s*[:：]\s*(.+)$/.exec(line);
    if (model) {
      current = { model: model[1].trim(), lines: [] };
      records.push(current);
      continue;
    }
    if (current) current.lines.push(line);
    }

  documents.push({ file, lineCount: kept.length, records });
  console.log(`${file.padEnd(28)} ${String(kept.length).padStart(4)} lines, ${records.length} models`);
}

console.log(`\ncertification lines held back: ${certificationLines.length}`);
console.log(`models found in total       : ${documents.reduce((n, d) => n + d.records.length, 0)}`);

if (write) {
  writeFileSync(OUT, `${JSON.stringify({ documents, certificationLines }, null, 2)}\n`);
  console.log(`\nwritten to ${OUT}`);
} else {
  console.log("\nReport only. Re-run with --write.");
}
