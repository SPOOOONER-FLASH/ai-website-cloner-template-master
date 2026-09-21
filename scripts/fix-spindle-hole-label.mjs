#!/usr/bin/env node
/**
 * 把 15 个锁体的 `Spindle Hole` 规格行改成一个不暗示尺寸的标签。
 *
 * 问题：三语规格表里都有这么一行 ——
 *
 *   EN  Spindle Hole              : Copper Construction
 *   ES  Orificio del cuadradillo  : Construcción en cobre
 *   PT  Furo do quadrado          : Construção em cobre
 *
 * 标签是一个**孔**，值是一种**材料**。买家扫规格表看到「Spindle Hole」这一行，
 * 期待的是一个 mm 数字。按 AGENTS.md 的诚实规则，这比没有这一行更糟：
 * 缺的行会被追问，看起来填满的行会被直接采信。
 *
 * 改法：把标签移到「构造」，值去掉冗余的 Construction。
 *
 *   EN  Spindle hole construction            : Copper
 *   ES  Construcción del orificio del cuadradillo : Cobre
 *   PT  Construção do furo do quadrado       : Cobre
 *
 * 真实信息一个字没丢（方轴孔是铜的），尺寸暗示没了。
 *
 * **没有编造孔径。** 真实孔径这边不知道，AGENTS.md 明令禁止写不确定的尺寸 ——
 * 要那个数字得问工厂，那是另一件事。
 *
 * 幂等。`--check` 只报告、不写入，供 CI 使用。
 */
import { readFileSync, writeFileSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "content/products";

/** 每个 locale 的规格键 → [旧标签, 新标签, 旧值, 新值]。 */
const RENAMES = {
  specs: ["Spindle Hole", "Spindle hole construction", "Copper Construction", "Copper"],
  specsEs: [
    "Orificio del cuadradillo",
    "Construcción del orificio del cuadradillo",
    "Construcción en cobre",
    "Cobre",
  ],
  specsPt: [
    "Furo do quadrado",
    "Construção do furo do quadrado",
    "Construção em cobre",
    "Cobre",
  ],
};

const check = process.argv.includes("--check");
const touched = [];

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const path = join(DIR, file);
  const article = JSON.parse(readFileSync(path, "utf8"));
  let changed = 0;

  for (const [key, [oldLabel, newLabel, oldValue, newValue]] of Object.entries(RENAMES)) {
    const rows = article[key];
    if (!Array.isArray(rows)) continue;
    for (const row of rows) {
      if (row?.label !== oldLabel) continue;
      row.label = newLabel;
      // 只有值确实是那句材料说明时才改；别的值原样留着，交给人看。
      if (row.value === oldValue) row.value = newValue;
      changed += 1;
    }
  }

  if (changed) {
    touched.push(`${file} (${changed})`);
    if (!check) writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);
  }
}

if (check && touched.length) {
  console.error(`spindle-hole: ${touched.length} 个文件仍是会暗示尺寸的旧标签：`);
  for (const f of touched) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  touched.length
    ? `spindle-hole: 改了 ${touched.length} 个文件\n  ${touched.join("\n  ")}`
    : "spindle-hole: 没有需要改的行",
);
