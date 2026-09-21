import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { mmToImperial, specValueFor, withImperial } from "./imperial.ts";

/*
  英文页面的公制值要配英制括号。见 src/lib/imperial.ts 顶部的长注释。

  这里测的是三件事，每一件都对应一个真会犯的错：

    1. 算得对不对 —— 一个错的英寸比没有英寸糟糕得多，它会被照着下单
    2. 只给英文 —— 西语葡语补英寸是噪音，而且会被 audit:pt:spanish 之类的
       审计当成外语混入
    3. 幂等 —— 这个函数在每次渲染时都跑，而且构建是反复的
*/

test("换算到最接近的 1/16 英寸，按美国五金规格书的写法", () => {
  assert.equal(mmToImperial(25.4), '1"');
  assert.equal(mmToImperial(65), '2-9/16"');
  assert.equal(mmToImperial(70), '2-3/4"');
  assert.equal(mmToImperial(45), '1-3/4"');
  assert.equal(mmToImperial(60), '2-3/8"');
  assert.equal(mmToImperial(1110), '43-11/16"');
  // 约分：8/16 要写成 1/2，不是 8/16
  assert.equal(mmToImperial(12.7), '1/2"');
  // 小于 1/32" 的值没有可写的英制，返回 null 而不是 0"
  assert.equal(mmToImperial(0.5), null);
  assert.equal(mmToImperial(0), null);
  assert.equal(mmToImperial(Number.NaN), null);
});

test("成对尺寸换算成一个括号，不是两个", () => {
  /*
    板尺寸是一个事实。拆成两个括号会读成两个不相干的数，而买家是照着
    「长 × 宽」下单的。
  */
  assert.equal(withImperial("300 × 75mm"), '300 × 75mm (11-13/16" × 2-15/16")');
});

test("合页代号一律不碰 —— 它是混合单位", () => {
  /*
    6*3*3mm 按合页的行业约定是 6 英寸 × 3 英寸 × 3 毫米，前两段不是毫米。
    2026-09-11 核对过：4x3x3.0-4BB 算出 101.6 × 76.2 毫米，即 4" × 3"。
    把 6*3 当毫米换算会产出 1/4" × 1/8"，错二十四倍，而买家会照着开孔。
  */
  assert.equal(withImperial("6*3*3mm"), "6*3*3mm");
  assert.equal(withImperial("4x3x3.0mm"), "4x3x3.0mm");
  assert.equal(withImperial("5 × 4 × 3mm"), "5 × 4 × 3mm");
  // 两段的板尺寸仍然换算 —— 那是真的两个毫米值
  assert.equal(withImperial("300 × 75mm"), '300 × 75mm (11-13/16" × 2-15/16")');
});

test("直径符号跟着走", () => {
  assert.match(withImperial("Ø32mm"), /Ø1-1\/4"/);
});

test("前缀和多值都保留原样，只在后面追加", () => {
  assert.equal(withImperial("Up to 80mm"), 'Up to 80mm (3-1/8")');
  const many = withImperial("45 / 50 / 55mm");
  assert.match(many, /1-3\/4"/);
  assert.match(many, /1-15\/16"/);
  assert.match(many, /2-3\/16"/);
});

test("没有毫米的值一个字都不动", () => {
  for (const value of ["Zinc alloy", "Satin Nickel (SN)", "180 Degrees", "Wooden Door"]) {
    assert.equal(withImperial(value), value);
  }
});

test("已经带英寸的值不再套一层", () => {
  const already = '2-3/8" (60mm)';
  assert.equal(withImperial(already), already);
});

test("幂等：跑两次和跑一次结果相同", () => {
  const once = withImperial("65mm");
  assert.equal(withImperial(once), once);
});

test("只有英文加括号", () => {
  assert.equal(specValueFor("65mm", "en"), '65mm (2-9/16")');
  assert.equal(specValueFor("65mm", "es"), "65mm");
  assert.equal(specValueFor("65mm", "pt"), "65mm");
});

test("整个目录跑一遍，不抛异常且不产生 0 英寸", () => {
  /*
    对真实目录跑，不是对固定样本 —— 要守的东西就是目录本身。
    2026-09-21 实测 891 条规格行含毫米，写法有七八种。
  */
  const dir = "content/products";
  let converted = 0;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const product = JSON.parse(readFileSync(`${dir}/${file}`, "utf8")) as {
      specs?: { label: string; value: string }[];
    };
    for (const spec of product.specs ?? []) {
      const out = specValueFor(spec.value, "en");
      assert.doesNotMatch(out, /\(0"\)|\(\)/, `${file} ${spec.label}: ${out}`);
      assert.ok(out.startsWith(spec.value), `${file} ${spec.label}: 原值必须完整保留`);
      if (out !== spec.value) converted += 1;
    }
  }
  assert.ok(converted > 500, `期望换算数百条，实际 ${converted}`);
});

test("范围整组换算，两端都给", () => {
  /*
    第一版产出的是 `2.0-3.5mm (1/8")` —— 只有紧跟 mm 的那个数被匹配到，
    读起来像整个范围等于 1/8"。一个范围塌成单值比没有换算更糟：
    买家会以为 2.0mm 和 3.5mm 都是 1/8"。
  */
  assert.equal(withImperial("2.0-3.5mm"), '2.0-3.5mm (1/16" to 1/8")');
  assert.equal(withImperial("35 to 45mm"), '35 to 45mm (1-3/8" to 1-3/4")');
  assert.equal(withImperial("38–45mm"), '38–45mm (1-1/2" to 1-3/4")');
  // 两端换算后相同的，只写一个，不写 "1/8 到 1/8"
  assert.match(withImperial("3.0-3.2mm"), /\(1\/8"\)$/);
});

test("目录里不存在被塌成单值的范围", () => {
  const dir = "content/products";
  const bad: string[] = [];
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
    const product = JSON.parse(readFileSync(`${dir}/${file}`, "utf8")) as {
      specs?: { label: string; value: string }[];
    };
    for (const spec of product.specs ?? []) {
      const out = specValueFor(spec.value, "en");
      const isRange = /\d\s*(?:-|–|—|to|a)\s*\d+(?:\.\d+)?\s?mm/i.test(spec.value);
      const hasBracket = out !== spec.value;
      if (isRange && hasBracket && !/ to /.test(out) && !/\(\S+\)$/.test(out)) {
        bad.push(`${file} ${spec.label}: ${out}`);
      }
    }
  }
  assert.deepEqual(bad, [], "范围值必须换算成范围，不能塌成单值");
});
