/**
 * Split the supplier's image packs into one folder per model, with the Japanese removed.
 *
 * WHAT THE CLIENT ASKED FOR (WeChat, 2026-09-08)
 *   「这里面的日文帮忙去掉，一个型号一个文件，你上传网上也是一个一个对应，
 *     这种有门把手的表示此款式搭配有同风格的门把手我就放到一起」
 *
 * So there are two jobs, and the second one is the reason the first is not enough on its
 * own. The seven zips are grouped by DESIGN FAMILY — T（G）1130 holds five different
 * models (G1130, T1130, MUL1022, UL1022, ULS2572) because they share a styling, and the
 * lever handles are in there to show that the family has a matching 门把手. That grouping
 * is useful knowledge and it is the wrong shape for uploading: a listing is one model.
 * So this splits by model and writes the family relationships down separately, rather
 * than throwing them away.
 *
 * MODEL = the filename up to the first lowercase "x".
 *   G1130xD000ZHP      -> G1130
 *   G2750x14D004ZHP    -> G2750     (x14 is a finish code, not part of the model)
 *   MUL1022xL000ZKtrmP -> MUL1022
 *   T2973AxD900SZoW    -> T2973A
 * No model in this material contains a lowercase x, which is what makes the rule safe.
 *
 * REMOVING THE JAPANESE
 * Three of the hundred images carry Japanese as ARTWORK, and those are handled here with
 * exact pixel boxes measured from the files (see tmp probes in the 2026-09-08 update):
 *
 *   G1293xD900SZoW / T1216xD900SZXW — the 「断面形状」 line of a dimension drawing. It sits
 *     directly above its own English twin "section" on white, so deleting the Japanese
 *     line leaves a complete, correct label. Nothing is lost.
 *
 *   UNIFORT_01 — a marketing banner: three white captions plus a coating note. These sit
 *     on a photograph, so they are NOT flat-filled. The background there is made of
 *     vertical structures (door edges, handle shafts, the left edge of a push plate), and
 *     a black rectangle would cut every one of them in half. Instead each column is
 *     rebuilt by interpolating between the row above the box and the row below it, which
 *     is exactly right when the content runs vertically — the edges continue through.
 *
 * TWO THINGS ARE REMOVED FROM THAT BANNER THAT ARE NOT JAPANESE
 * The client confirmed the same day that this material is going onto the RAYEN 雷茵 site
 * (「都是上给雷茵的」), which changes what "clean" means for it:
 *   · UNION's own marks — the "UniFort II / Aniviral Type" lockup and the works stamp
 *     etched into the push plate. Same class of problem as the Hyland oval found in
 *     public/images/products/ on 2026-09-06, and the same reason it is easy to miss.
 *   · the antibacterial badge, icon included — it asserts a coating nobody here has had
 *     tested. Deleting only its Japanese caption would have left the claim standing with
 *     nothing to explain it.
 * Both are called out in the generated 说明.md so the client can overrule either one.
 *
 * A further six images have Japanese INSIDE THE PHOTOGRAPH — room signs, an accessible-
 * toilet plate, a "Staff Room" door. Those are not touched. Painting over a sign in a
 * real interior leaves a smear that a buyer reads as a doctored photo, which costs more
 * than the Japanese did. They are listed in the report for a person to decide on.
 *
 * Usage:
 *   node scripts/split-union-image-packs.mjs <source-dir> <output-dir>
 *   node scripts/split-union-image-packs.mjs <source-dir> <output-dir> --no-zip
 */

import { cpSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const [sourceRoot, outputRoot] = process.argv.slice(2);
const noZip = process.argv.includes("--no-zip");

if (!sourceRoot || !outputRoot) {
  console.error("用法: node scripts/split-union-image-packs.mjs <解压后的目录> <输出目录> [--no-zip]");
  process.exit(1);
}

/* ---------------------------------------------------------------- the edits */

/**
 * Erase a rectangle by filling it with the page background.
 * Only for artwork on a flat field — a drawing, a plain white plate.
 */
const flatFill = (box, colour) => ({ kind: "flat", box, colour });

/**
 * Rebuild a rectangle from the rows immediately above and below it.
 *
 * Written for UNIFORT_01, where every structure crossing the captions is vertical. Each
 * column is a straight blend from the pixel above the box to the pixel below it, so a
 * door edge entering the top of the box leaves the bottom in the right place. A flat fill
 * would have left three black bars with the handle line severed at each one.
 *
 * `gap` is how far OUTSIDE the box the two source rows are taken, and it is the whole
 * difference between this working and not. The first run sampled the immediately
 * adjacent rows and produced vertical white streaks down every patch: text and white
 * boxes are antialiased, so the row touching them is still half-lit, and that half-lit
 * row then got stretched the full height of the patch. Sample clear of the fringe.
 */
const verticalHeal = (box, gap = 8) => ({ kind: "vertical", box, gap });

const EDITS = {
  // 「断面形状」 above its own "section" twin. White drawing field.
  "G1293xD900SZoW.jpg": [flatFill({ left: 112, top: 252, width: 92, height: 26 }, "#ffffff")],
  "T1216xD900SZXW.jpg": [flatFill({ left: 120, top: 255, width: 76, height: 21 }, "#ffffff")],

  // The UniFort banner. Boxes measured off the file, not guessed:
  //   汚れ、傷、剥がれに強い     x 153..710  y 1499..1578
  //   ユニフォートから           x 153..550  y 1619..1699
  //   抗ウイルスタイプが誕生。   x 153..710  y 1740..1819
  //   抗菌・抗ウイルス / コーティング  (caption beside the icon)
  "UNIFORT_01.jpg": [
    verticalHeal({ left: 145, top: 1491, width: 574, height: 96 }),
    verticalHeal({ left: 145, top: 1611, width: 414, height: 97 }),
    verticalHeal({ left: 145, top: 1732, width: 574, height: 96 }),
    /*
      The antibacterial badge — the caption AND the pictogram beside it.

      Taking the icon was not in the brief, which said only 去日文, so it is called out in
      说明.md for the client to overrule. The reason for going further: that badge asserts
      an antimicrobial coating. On UNION's own banner it is a claim UNION can support; on
      a RAYEN product page it is a performance claim about a coating nobody here has had
      tested, and it is exactly the kind of unverifiable number AGENTS.md says costs more
      than the blank space it fills. Leaving the icon with its caption deleted would also
      have been the worst of both — an unexplained symbol still making the claim.

      Put it back the moment RAYEN has its own coating test report.
    */
    verticalHeal({ left: 255, top: 1936, width: 330, height: 104 }, 6),
    verticalHeal({ left: 132, top: 1912, width: 130, height: 140 }, 6),
    /*
      The supplier's own marks, removed because the client confirmed on 2026-09-08 that
      this material is going onto the RAYEN 雷茵 site — 「都是上给雷茵的」.

      Stripping only the Japanese would have left "UniFort II / Aniviral Type" across the
      top and the UNION works stamp on the push plate, published on a Chinese factory's
      own product page. That is the identical mistake as the Hyland oval found in
      public/images/products/ on 2026-09-06: a mark that does not look stolen because
      nobody recognises it, sitting on a page that claims the product as ours. A buyer who
      searches the words on the picture finds the actual manufacturer.

      "UniFort II"      y 346..417  x 153..611
      "Aniviral Type"   y 444..475  x 259..505
      UNION stamp       y  88..103  x 1084..1187  (etched into the plate in the photo)
    */
    verticalHeal({ left: 145, top: 338, width: 474, height: 88 }),
    verticalHeal({ left: 251, top: 436, width: 262, height: 48 }),
    verticalHeal({ left: 1076, top: 80, width: 120, height: 32 }),
  ],
};

/** Photographic Japanese, deliberately left alone. Reported, not edited. */
const SIGNAGE_IN_PHOTO = {
  "G2110xD504AHrP.jpg": "走廊多目的卫生间门上的日文无障碍标识牌",
  "G2110xD505GHrP.jpg": "玻璃门上的小字日文室名",
  "G2750xD508FHrP.jpg": "玻璃门上的 Staff Room 及其下方日文",
  "T1130xD500FHrP.jpg": "门上的日文室名牌",
  "G1130xD501FHrP.jpg": "门旁的日文标识牌",
  "UL1042xL500CHrP.jpg": "玻璃隔断上的小字标识",
};

/* ------------------------------------------------------------------ helpers */

/** Files that are not a model at all — a family banner, a mood shot. */
const SHARED_FOLDER = "_通用图";

/**
 * The model code: everything before the first lowercase "x".
 *
 * A filename with no "x" is not a model number. UNIFORT_01 is a banner showing six
 * different handles at once, and giving it its own folder made the delivery look like it
 * contained a model called UNIFORT_01. Those go to a shared folder instead.
 */
function modelOf(filename) {
  const stem = basename(filename).replace(/\.[^.]+$/, "");
  const cut = stem.indexOf("x");
  return cut > 0 ? stem.slice(0, cut) : SHARED_FOLDER;
}

async function applyEdits(sourcePath, targetPath, edits) {
  const image = sharp(sourcePath);
  const { width, height } = await image.metadata();
  const composites = [];

  for (const edit of edits) {
    const { left, top, width: w, height: h } = edit.box;
    if (left < 0 || top < 0 || left + w > width || top + h > height) {
      throw new Error(`${basename(sourcePath)} 的修补框超出图像范围`);
    }

    if (edit.kind === "flat") {
      const patch = await sharp({
        create: { width: w, height: h, channels: 3, background: edit.colour },
      })
        .png()
        .toBuffer();
      composites.push({ input: patch, left, top });
      continue;
    }

    // vertical heal: blend the row above into the row below, column by column.
    const gap = edit.gap ?? 8;
    const aboveY = Math.max(0, top - gap);
    const belowY = Math.min(height - 1, top + h + gap - 1);
    const above = await sharp(sourcePath)
      .extract({ left, top: aboveY, width: w, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });
    const below = await sharp(sourcePath)
      .extract({ left, top: belowY, width: w, height: 1 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const channels = above.info.channels;
    const patch = Buffer.alloc(w * h * channels);
    for (let y = 0; y < h; y++) {
      const t = h === 1 ? 0 : y / (h - 1);
      for (let x = 0; x < w; x++) {
        for (let c = 0; c < channels; c++) {
          const a = above.data[x * channels + c];
          const b = below.data[x * channels + c];
          patch[(y * w + x) * channels + c] = Math.round(a + (b - a) * t);
        }
      }
    }
    const patchPng = await sharp(patch, { raw: { width: w, height: h, channels } }).png().toBuffer();
    composites.push({ input: patchPng, left, top });
  }

  await image.composite(composites).jpeg({ quality: 92 }).toFile(targetPath);
}

/* --------------------------------------------------------------------- run */

const packs = readdirSync(sourceRoot).filter((entry) =>
  statSync(join(sourceRoot, entry)).isDirectory(),
);
if (!packs.length) {
  console.error(`${sourceRoot} 下没有找到解压后的目录`);
  process.exit(1);
}

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });

/** model -> { files: [...], packs: Set } */
const models = new Map();
const edited = [];
const foundSignage = [];

for (const pack of packs) {
  const packDir = join(sourceRoot, pack);
  for (const file of readdirSync(packDir).filter((f) => /\.(jpe?g|png)$/i.test(f))) {
    const model = modelOf(file);
    if (!models.has(model)) models.set(model, { files: [], packs: new Set() });
    const record = models.get(model);
    record.packs.add(pack);

    const targetDir = join(outputRoot, model);
    mkdirSync(targetDir, { recursive: true });
    const sourcePath = join(packDir, file);
    const targetPath = join(targetDir, file);

    if (EDITS[file]) {
      await applyEdits(sourcePath, targetPath, EDITS[file]);
      edited.push(`${model}/${file}`);
    } else {
      cpSync(sourcePath, targetPath);
    }
    if (SIGNAGE_IN_PHOTO[file]) foundSignage.push(`${model}/${file} — ${SIGNAGE_IN_PHOTO[file]}`);
    record.files.push(file);
  }
}

/* --------------------------------------------------- the family relationships */

const familyRows = packs
  .map((pack) => {
    const inPack = [...models]
      .filter(([, r]) => r.packs.has(pack))
      .map(([m]) => m)
      .sort();
    return `| ${pack} | ${inPack.join("、")} |`;
  })
  .join("\n");

const modelRows = [...models]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([model, r]) => `| ${model} | ${r.files.length} | ${[...r.packs].join("、")} |`)
  .join("\n");

writeFileSync(
  join(outputRoot, "说明.md"),
  `# 图片按型号拆分说明

生成时间：${new Date().toISOString().slice(0, 10)}
生成命令：\`node scripts/split-union-image-packs.mjs <解压目录> <输出目录>\`（可重跑）

## 怎么用

一个型号一个文件夹，也各自打包成一个 zip，上传时一个型号对应一个链接。

## 配套关系 —— 原来的 7 个压缩包是按「同一款式」分的

同一个压缩包里出现的型号，是同一个设计风格的一套。带 UL / MUL 开头的是配套的门把手
（レバーハンドル），也就是您说的「有门把手的表示此款式搭配有同风格的门把手」。
拆开之后这层关系就看不出来了，所以记在这里：

| 原压缩包（款式） | 包含的型号 |
|---|---|
${familyRows}

## 全部型号

共 ${models.size - (models.has(SHARED_FOLDER) ? 1 : 0)} 个型号。${SHARED_FOLDER} 不是型号 —— 那张是一整组拉手的合影，
不属于任何单个型号，所以单独放。

| 型号 | 图片数 | 来自 |
|---|---|---|
${modelRows}

## 日文处理

### 已去掉（${edited.length} 张）

${edited.map((f) => `- \`${f}\``).join("\n")}

- 两张尺寸图去掉的是「断面形状」那一行。它下面本来就有对应的英文 \`section\`，
  删掉日文之后标注仍然完整，没有丢信息。
- 宣传图去掉了三条白底日文字幕和「抗菌・抗ウイルス コーティング」那段文字。
  这张图的背景是照片不是纯色，所以没有直接涂黑 —— 涂黑会把穿过字幕的门缝、
  拉手竖线和门板边缘齐齐切断。用的是按列从字幕上边一行接到下边一行，
  竖向结构会自然接上。

### 没有动（${foundSignage.length} 张）

${foundSignage.map((f) => `- \`${f.split(" — ")[0]}\` — ${f.split(" — ")[1]}`).join("\n")}

（这几张是我把 100 张图排成联系表逐张看出来的，不是机器识别。门上那种很小的
室名牌有可能还有漏的，您过一遍如果发现还有，告诉我文件名我再处理。）

这几张的日文是**拍进照片里的实景标识牌**，不是后期加的字幕。涂掉会在门上留一块
擦过的痕迹 —— 买家一眼能看出照片被改过，那个代价比几个日文字大。需要的话可以：
①换一张同型号没有标识牌的场景图；②裁掉带标识牌的那部分；③交给美工手工修。
请告诉我用哪种。

### 有两处我超出了「去日文」，请您复核

1. **\`_通用图/UNIFORT_01.jpg\` 原本是 UNION 的品牌宣传图，我把 UNION 的标记也去掉了。**
   去掉的是左上角的 \`UniFort II\` / \`Aniviral Type\`（UniFort 是 UNION 的产品线名称），
   以及照片里那块推板上压着的 UNION 厂标。
   您只说了去日文，但您也说了这批图是上给雷茵的 —— 挂在雷茵自己的产品页上，
   画面里留着别家的品牌名和厂标，买家搜一下那几个字就找到真正的厂家了。
   这和 9 月 6 号在 \`public/images/products/\` 里发现的 Hyland 椭圆商标是同一类问题。
   如果雷茵是这批货的代工厂、可以带原厂标出图，告诉我，我把原图还回去。
2. **那张图左下角的抗菌图标我也去掉了**，这一条超出了您说的「去日文」，请您复核。
   理由：那个图标加旁边的日文说的是「抗菌・抗ウイルス コーティング」，是一条抗菌抗病毒
   涂层的性能声明。在 UNION 自己的宣传图上他们能背书，放到雷茵的产品页上就是一条
   没有检测报告支撑的性能声明。只删文字留图标更糟 —— 图标照样在做那个声明，
   还没人解释它。等雷茵自己有涂层检测报告了，随时可以放回去。
`,
  "utf8",
);

/* --------------------------------------------------------------------- zip */

let zipped = 0;
if (!noZip) {
  const zipDir = join(outputRoot, "_zip");
  mkdirSync(zipDir, { recursive: true });
  for (const model of models.keys()) {
    const src = join(outputRoot, model);
    const dest = join(zipDir, `${model}.zip`);
    execFileSync(
      "powershell",
      [
        "-NoProfile",
        "-Command",
        `Compress-Archive -Path '${src}\\*' -DestinationPath '${dest}' -Force`,
      ],
      { stdio: "pipe" },
    );
    zipped += 1;
  }
}

console.log(
  `${models.size} 个型号，${[...models.values()].reduce((n, r) => n + r.files.length, 0)} 张图。` +
    `去日文 ${edited.length} 张，实景标识牌未动 ${foundSignage.length} 张。` +
    (noZip ? "" : ` 已打包 ${zipped} 个 zip。`),
);
console.log(`输出：${outputRoot}`);
