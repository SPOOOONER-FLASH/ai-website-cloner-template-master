/**
 * 把仓库里的一份 markdown 生成成 Word 文档,放到客户桌面。默认源是客户操作手册。
 *
 * 为什么是生成器而不是直接写 .docx:
 * 客户 2026-09-21 要求 runbook 改成 Word 并放在 Desktop\hyde\。但只存在于桌面的
 * 文件不在 git 里,下一个 session 读不到,一次上下文压缩之后就等于没有。所以
 * **权威源仍然是仓库里的 markdown**,Word 是它的一份导出。改内容改 md,然后跑这个。
 *
 * 2026-09-22 起 --src 可换源文件,因为交给客户的不只有操作手册,还有数据复盘报告。
 * 输出文件名跟着源文件名走。
 *
 * 用法:
 *   npm run runbook:docx                  操作手册 → %USERPROFILE%\Desktop\hyde\00-先看这里-人工待办\
 *                                         （其他文档按 scripts/lib/desktop-hyde.mjs 分文件夹）
 *   node scripts/build-client-runbook-docx.mjs --src docs/research/某份.md
 *   node scripts/build-client-runbook-docx.mjs --out "D:\\某处"
 *
 * 依赖 docx(已在 devDependencies 里),不需要 pandoc,不需要装任何新东西。
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { DESKTOP_HYDE, folderFor } from "./lib/desktop-hyde.mjs";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  ImageRun,
} from "docx";

/*
  `![说明](路径)` 嵌入 PNG / JPG（2026-10-18：广交会动线图要在手机上的 Word 里直接看到）。
  路径相对于 markdown 文件所在目录；宽度缩到 600 px，按原图比例算高度。
*/
function imageSize(buf) {
  if (buf.readUInt32BE(0) === 0x89504e47) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  for (let o = 2; o < buf.length; ) {
    const marker = buf.readUInt16BE(o);
    const len = buf.readUInt16BE(o + 2);
    if (marker >= 0xffc0 && marker <= 0xffc3) return { w: buf.readUInt16BE(o + 7), h: buf.readUInt16BE(o + 5) };
    o += 2 + len;
  }
  throw new Error("unreadable image size");
}

const argSrc = process.argv.indexOf("--src");
const SOURCE = argSrc !== -1 ? process.argv[argSrc + 1] : "docs/collaboration/CLIENT-RUNBOOK.md";
const argOut = process.argv.indexOf("--out");
// Without --out, each document goes to its folder in Desktop\hyde (scripts/lib/desktop-hyde.mjs).
const OUT_DIR =
  argOut !== -1 ? process.argv[argOut + 1] : join(DESKTOP_HYDE, folderFor(`${basename(SOURCE, ".md")}.docx`));
const OUT_FILE = join(OUT_DIR, `${basename(SOURCE, ".md")}.docx`);
// --large: 14 pt body for hand-offs read by colleagues who are not developers (client, 2026-10-10).
const LARGE = process.argv.includes("--large");
const CODE_SIZE = LARGE ? 24 : 18;

const HEADINGS = [
  HeadingLevel.HEADING_1,
  HeadingLevel.HEADING_2,
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_4,
];

/** 行内 **粗体** 和 `代码`。故意只支持这两种 —— runbook 里就用了这些。 */
function inline(text, { code = false } = {}) {
  if (code) return [new TextRun({ text, font: "Consolas", size: CODE_SIZE })];
  const runs = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) runs.push(new TextRun(text.slice(last, m.index)));
    const token = m[0];
    if (token.startsWith("**")) runs.push(new TextRun({ text: token.slice(2, -2), bold: true }));
    else runs.push(new TextRun({ text: token.slice(1, -1), font: "Consolas", size: CODE_SIZE }));
    last = m.index + token.length;
  }
  if (last < text.length) runs.push(new TextRun(text.slice(last)));
  return runs.length ? runs : [new TextRun(text)];
}

const splitRow = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((c) => c.trim());

function convert(markdown) {
  const lines = markdown.split(/\r?\n/);
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // 代码块
    if (line.trimStart().startsWith("```")) {
      i++;
      const body = [];
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) body.push(lines[i++]);
      i++; // 收尾的 ```
      for (const codeLine of body) {
        out.push(
          new Paragraph({
            children: inline(codeLine || " ", { code: true }),
            shading: { fill: "F4F4F4" },
            spacing: { before: 0, after: 0 },
          }),
        );
      }
      out.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      continue;
    }

    // 表格:一行 | … |,下一行是 | --- |
    if (line.trim().startsWith("|") && /^\s*\|[\s:-]+\|/.test(lines[i + 1] ?? "")) {
      const header = splitRow(line);
      i += 2;
      const body = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) body.push(splitRow(lines[i++]));
      const toRow = (cells, bold) =>
        new TableRow({
          children: cells.map(
            (c) =>
              new TableCell({
                children: [
                  new Paragraph({
                    children: bold
                      ? [new TextRun({ text: c, bold: true })]
                      : inline(c),
                  }),
                ],
              }),
          ),
        });
      out.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [toRow(header, true), ...body.map((r) => toRow(r, false))],
        }),
      );
      out.push(new Paragraph({ text: "", spacing: { after: 120 } }));
      continue;
    }

    // 图片
    const image = line.match(/^\s*!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (image) {
      const file = join(SOURCE.replace(/[\\/][^\\/]*$/, ""), image[2]);
      const data = readFileSync(file);
      const { w, h } = imageSize(data);
      const width = Math.min(600, w);
      out.push(
        new Paragraph({
          children: [
            new ImageRun({
              type: /\.png$/i.test(file) ? "png" : "jpg",
              data,
              transformation: { width, height: Math.round((h * width) / w) },
              altText: { title: image[1], description: image[1], name: image[1] },
            }),
          ],
          spacing: { after: 120 },
        }),
      );
      i++;
      continue;
    }

    // 标题
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      out.push(
        new Paragraph({
          children: inline(heading[2]),
          heading: HEADINGS[heading[1].length - 1],
          spacing: { before: 240, after: 120 },
        }),
      );
      i++;
      continue;
    }

    // 无序列表
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    if (bullet) {
      out.push(new Paragraph({ children: inline(bullet[1]), bullet: { level: 0 } }));
      i++;
      continue;
    }

    // 有序列表
    const numbered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (numbered) {
      out.push(
        new Paragraph({ children: inline(numbered[1]), numbering: { reference: "steps", level: 0 } }),
      );
      i++;
      continue;
    }

    // 水平线
    if (/^\s*---+\s*$/.test(line)) {
      out.push(new Paragraph({ text: "", border: { bottom: { style: "single", size: 6 } } }));
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    out.push(new Paragraph({ children: inline(line), spacing: { after: 120 } }));
    i++;
  }
  return out;
}

if (!existsSync(SOURCE)) {
  console.error(`找不到 ${SOURCE}`);
  process.exit(1);
}

const markdown = readFileSync(SOURCE, "utf8");
const doc = new Document({
  ...(LARGE ? { styles: { default: { document: { run: { size: 28 } } } } } : {}),
  numbering: {
    config: [
      {
        reference: "steps",
        levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.START }],
      },
    ],
  },
  sections: [
    {
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `由 ${SOURCE} 生成 — 不要直接改这个 Word 文件,改会在下次生成时被覆盖。`,
              italics: true,
              size: 18,
              color: "888888",
            }),
          ],
          spacing: { after: 240 },
        }),
        ...convert(markdown),
      ],
    },
  ],
});

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

try {
  writeFileSync(OUT_FILE, await Packer.toBuffer(doc));
} catch (error) {
  // Word 把打开着的文档独占锁住。这在这里是常态而不是异常 —— 客户桌面上那一份
  // 多半就开着。原始堆栈对他和对下一个 session 都没用,所以说人话。
  if (error?.code === "EBUSY" || error?.code === "EPERM") {
    console.error(`写不进 ${OUT_FILE}`);
    console.error("这个文件正在 Word 里开着。关掉 Word 再跑一次就行,内容没有丢。");
    process.exit(1);
  }
  throw error;
}

console.log(`docx: ${OUT_FILE}`);
console.log(`  源: ${SOURCE}(${markdown.split(/\r?\n/).length} 行)`);
