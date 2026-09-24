#!/usr/bin/env node
/**
 * 把 guide 文章里的查表数据从散文段落改写成 Markdown 管道表。
 *
 * 为什么：docs/collaboration/agent-updates/2026-09-21-codex-article-rendering-contract.md
 * 定的渲染合同是「一张表 = body 数组里的一个字符串，用换行分隔的 Markdown 行」。
 * 渲染器不会从技术散文里猜出列来 —— 写成散文的查表数据，读者得逐句读完才能查到
 * 自己那一行，而这正是这批文章存在的理由。Codex 点名了两篇尺寸表文章；实际上
 * 我自己后写的五篇也有同样的问题（EN 1154 梯级、EN 1670 梯级、HS 子目、
 * 铰链数量规则、玻璃厚度区间），一并改掉。
 *
 * 为什么是脚本而不是手改：同一张表要在 body / bodyEs / bodyPt 三处保持一致，
 * 手改三遍是三次出错机会。脚本里一张表写一次，三语各给一份译文，替换点用
 * 段落开头的唯一前缀定位而不是下标 —— 下标会被任何一次插入段落改掉。
 *
 * 幂等：已经是表的段落（以 `|` 开头）不会被再次处理。`--check` 只报告、不写入。
 */
import { readFileSync, writeFileSync } from "node:fs";

const check = process.argv.includes("--check");

/** 一个替换：从以 prefix 开头的段落起，连续 count 段，换成 entries。 */
function replaceRun(body, prefix, count, entries) {
  const at = body.findIndex((p) => p.startsWith(prefix));
  if (at === -1) return null;
  return [...body.slice(0, at), ...entries, ...body.slice(at + count)];
}

const t = (rows) => rows.join("\n");

/* ------------------------------------------------------------------ *
 * 每条 edit：{ file, locale-key, prefix, count, replacement[] }
 * replacement 里第一项通常是引导句，第二项是表。
 * ------------------------------------------------------------------ */
const EDITS = [
  /* --- EN 1154 闭门器力量等级 -------------------------------------- */
  {
    file: "door-closer-power-size-2026",
    ops: {
      body: {
        prefix: "Size 1 suits leaves to about 750mm",
        count: 1,
        insert: [
          t([
            "| EN 1154 power size | Max leaf width | Imperial | Max leaf mass |",
            "| --- | --- | --- | --- |",
            "| 1 | 750mm | 29-1/2\" | 20 kg |",
            "| 2 | 850mm | 33-1/2\" | 40 kg |",
            "| 3 | 950mm | 37-3/8\" | 60 kg |",
            "| 4 | 1100mm | 43-1/4\" | 80 kg |",
            "| 5 | 1250mm | 49-1/4\" | 100 kg |",
            "| 6 | 1400mm | 55-1/8\" | 120 kg |",
            "| 7 | 1600mm | 63\" | 160 kg |",
          ]),
        ],
      },
      bodyEs: {
        prefix: "La potencia 1 vale para hojas",
        count: 1,
        insert: [
          t([
            "| Potencia EN 1154 | Ancho máx. de hoja | Masa máx. de hoja |",
            "| --- | --- | --- |",
            "| 1 | 750 mm | 20 kg |",
            "| 2 | 850 mm | 40 kg |",
            "| 3 | 950 mm | 60 kg |",
            "| 4 | 1100 mm | 80 kg |",
            "| 5 | 1250 mm | 100 kg |",
            "| 6 | 1400 mm | 120 kg |",
            "| 7 | 1600 mm | 160 kg |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "A potência 1 serve folhas",
        count: 1,
        insert: [
          t([
            "| Potência EN 1154 | Largura máx. de folha | Massa máx. de folha |",
            "| --- | --- | --- |",
            "| 1 | 750 mm | 20 kg |",
            "| 2 | 850 mm | 40 kg |",
            "| 3 | 950 mm | 60 kg |",
            "| 4 | 1100 mm | 80 kg |",
            "| 5 | 1250 mm | 100 kg |",
            "| 6 | 1400 mm | 120 kg |",
            "| 7 | 1600 mm | 160 kg |",
          ]),
        ],
      },
    },
  },

  /* --- 铰链数量 ----------------------------------------------------- */
  {
    file: "hinge-grades-and-count-2026",
    ops: {
      body: {
        prefix: "Up to about 1524mm (60\") of leaf height",
        count: 1,
        insert: [
          t([
            "| Leaf height up to | Imperial | Hinges |",
            "| --- | --- | --- |",
            "| 1524mm | 60\" | 2 |",
            "| 2286mm | 90\" | 3 |",
            "| 3048mm | 120\" | 4 |",
            "| each further 762mm or part of it | 30\" | one more |",
          ]),
        ],
      },
      bodyEs: {
        prefix: "Hasta unos 1524 mm de altura de hoja",
        count: 1,
        insert: [
          t([
            "| Altura de hoja hasta | Bisagras |",
            "| --- | --- |",
            "| 1524 mm | 2 |",
            "| 2286 mm | 3 |",
            "| 3048 mm | 4 |",
            "| cada 762 mm adicionales o fracción | una más |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "Até cerca de 1524 mm de altura de folha",
        count: 1,
        insert: [
          t([
            "| Altura de folha até | Dobradiças |",
            "| --- | --- |",
            "| 1524 mm | 2 |",
            "| 2286 mm | 3 |",
            "| 3048 mm | 4 |",
            "| a cada 762 mm adicionais ou fração | mais uma |",
          ]),
        ],
      },
    },
  },

  /* --- EN 1670 腐蚀等级 --------------------------------------------- */
  {
    file: "corrosion-resistance-en-1670-2026",
    ops: {
      body: {
        prefix: "Grade 0 — no defined corrosion resistance",
        count: 6,
        insert: [
          t([
            "| EN 1670 grade | Resistance | Neutral salt spray |",
            "| --- | --- | --- |",
            "| 0 | none defined | — |",
            "| 1 | mild | 24 hours |",
            "| 2 | moderate | 48 hours |",
            "| 3 | high | 96 hours |",
            "| 4 | very high | 240 hours |",
            "| 5 | very high | 480 hours |",
          ]),
          "Grade 0 is not a failure. It is a declaration that the property was not claimed, and on an internal door in a dry building it is the honest and correct grade.",
        ],
      },
      bodyEs: {
        prefix: "Grado 0 — sin resistencia a la corrosión definida",
        count: 6,
        insert: [
          t([
            "| Grado EN 1670 | Resistencia | Niebla salina neutra |",
            "| --- | --- | --- |",
            "| 0 | sin definir | — |",
            "| 1 | baja | 24 horas |",
            "| 2 | moderada | 48 horas |",
            "| 3 | alta | 96 horas |",
            "| 4 | muy alta | 240 horas |",
            "| 5 | muy alta | 480 horas |",
          ]),
          "El grado 0 no es un suspenso. Es una declaración de que la propiedad no se reivindica, y en una puerta interior de un edificio seco es el grado honesto y correcto.",
        ],
      },
      bodyPt: {
        prefix: "Grau 0 — sem resistência à corrosão definida",
        count: 6,
        insert: [
          t([
            "| Grau EN 1670 | Resistência | Névoa salina neutra |",
            "| --- | --- | --- |",
            "| 0 | sem definir | — |",
            "| 1 | baixa | 24 horas |",
            "| 2 | moderada | 48 horas |",
            "| 3 | alta | 96 horas |",
            "| 4 | muito alta | 240 horas |",
            "| 5 | muito alta | 480 horas |",
          ]),
          "O grau 0 não é uma reprovação. É uma declaração de que a propriedade não é reivindicada, e numa porta interna de um edifício seco é o grau honesto e correto.",
        ],
      },
    },
  },

  /* --- HS 子目 ------------------------------------------------------ */
  {
    file: "door-hardware-hs-codes-2026",
    ops: {
      body: {
        prefix: "8301.10 — padlocks.",
        count: 7,
        insert: [
          t([
            "| Subheading | Covers |",
            "| --- | --- |",
            "| 8301.10 | padlocks |",
            "| 8301.20 | locks of a kind used for motor vehicles |",
            "| 8301.30 | locks of a kind used for furniture |",
            "| 8301.40 | other locks — mortise, cylindrical, rim, deadbolts, cylinders, night latches |",
            "| 8301.50 | clasps and frames with clasps, incorporating locks |",
            "| 8301.60 | parts |",
            "| 8301.70 | keys presented separately |",
          ]),
        ],
      },
      bodyEs: {
        prefix: "8301.10 — candados.",
        count: 7,
        insert: [
          t([
            "| Subpartida | Cubre |",
            "| --- | --- |",
            "| 8301.10 | candados |",
            "| 8301.20 | cerraduras para vehículos automóviles |",
            "| 8301.30 | cerraduras para muebles |",
            "| 8301.40 | las demás cerraduras — embutir, cilíndricas, sobreponer, cerrojos, cilindros, picaportes |",
            "| 8301.50 | cierres y monturas cierre con cerradura incorporada |",
            "| 8301.60 | partes |",
            "| 8301.70 | llaves presentadas aisladamente |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "8301.10 — cadeados.",
        count: 7,
        insert: [
          t([
            "| Subposição | Cobre |",
            "| --- | --- |",
            "| 8301.10 | cadeados |",
            "| 8301.20 | fechaduras para veículos automóveis |",
            "| 8301.30 | fechaduras para móveis |",
            "| 8301.40 | outras fechaduras — embutir, cilíndricas, sobrepor, trancas, cilindros, trincos |",
            "| 8301.50 | fechos e armações com fecho, com fechadura incorporada |",
            "| 8301.60 | partes |",
            "| 8301.70 | chaves apresentadas isoladamente |",
          ]),
        ],
      },
    },
  },
  {
    file: "door-hardware-hs-codes-2026",
    ops: {
      body: {
        prefix: "8302.10 — hinges.",
        count: 8,
        insert: [
          t([
            "| Subheading | Covers |",
            "| --- | --- |",
            "| 8302.10 | hinges |",
            "| 8302.20 | castors |",
            "| 8302.30 | other mountings and fittings for motor vehicles |",
            "| 8302.41 | other mountings and fittings suitable for buildings — handles, pull handles, push plates, flush bolts, door stops, exit device trim |",
            "| 8302.42 | other, suitable for furniture |",
            "| 8302.49 | other |",
            "| 8302.50 | hat-racks, hat pegs, brackets and similar fixtures |",
            "| 8302.60 | automatic door closers |",
          ]),
        ],
      },
      bodyEs: {
        prefix: "8302.10 — bisagras de cualquier clase.",
        count: 8,
        insert: [
          t([
            "| Subpartida | Cubre |",
            "| --- | --- |",
            "| 8302.10 | bisagras de cualquier clase |",
            "| 8302.20 | ruedas |",
            "| 8302.30 | las demás guarniciones y herrajes para vehículos automóviles |",
            "| 8302.41 | las demás guarniciones y herrajes para edificios — manillas, tiradores, placas de empuje, pestillos, topes, guarniciones de barra antipánico |",
            "| 8302.42 | los demás, para muebles |",
            "| 8302.49 | los demás |",
            "| 8302.50 | cuelgasombreros, perchas, soportes y similares |",
            "| 8302.60 | cierrapuertas automáticos |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "8302.10 — dobradiças de qualquer tipo.",
        count: 8,
        insert: [
          t([
            "| Subposição | Cobre |",
            "| --- | --- |",
            "| 8302.10 | dobradiças de qualquer tipo |",
            "| 8302.20 | rodízios |",
            "| 8302.30 | outras guarnições e ferragens para veículos automóveis |",
            "| 8302.41 | outras guarnições e ferragens para edifícios — maçanetas, puxadores, placas de empurrar, ferrolhos, batentes, guarnições de barra antipânico |",
            "| 8302.42 | outras, para móveis |",
            "| 8302.49 | outras |",
            "| 8302.50 | cabides, ganchos, suportes e semelhantes |",
            "| 8302.60 | molas de porta automáticas |",
          ]),
        ],
      },
    },
  },

  /* --- 玻璃厚度 ----------------------------------------------------- */
  {
    file: "glass-door-thickness-and-cutouts-2026",
    ops: {
      body: {
        prefix: "8mm (about 5/16\") on a fitting specified",
        count: 4,
        insert: [
          t([
            "| Glass thickness accepted | Imperial | Fitting type |",
            "| --- | --- | --- |",
            "| 8mm | 5/16\" | specified for a single thickness |",
            "| 8 to 10mm | 5/16\" to 3/8\" | adjustable |",
            "| 8 to 12mm | 5/16\" to 1/2\" | adjustable |",
            "| 10 to 12mm | 3/8\" to 1/2\" | heavier fittings |",
            "| 10 to 14mm | 3/8\" to 9/16\" | heavier fittings |",
            "| 12mm, cut-out R6 | 1/2\", 1/4\" radius | one model, cut-out radius stated |",
          ]),
        ],
      },
      bodyEs: {
        prefix: "8 mm en un herraje indicado para un espesor único.",
        count: 4,
        insert: [
          t([
            "| Espesor de vidrio admitido | Tipo de herraje |",
            "| --- | --- |",
            "| 8 mm | indicado para un espesor único |",
            "| 8 a 10 mm | regulable |",
            "| 8 a 12 mm | regulable |",
            "| 10 a 12 mm | herrajes más pesados |",
            "| 10 a 14 mm | herrajes más pesados |",
            "| 12 mm, vaciado R6 | un modelo, con radio de vaciado indicado |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "8 mm numa ferragem indicada para uma espessura única.",
        count: 4,
        insert: [
          t([
            "| Espessura de vidro aceite | Tipo de ferragem |",
            "| --- | --- |",
            "| 8 mm | indicada para uma espessura única |",
            "| 8 a 10 mm | regulável |",
            "| 8 a 12 mm | regulável |",
            "| 10 a 12 mm | ferragens mais pesadas |",
            "| 10 a 14 mm | ferragens mais pesadas |",
            "| 12 mm, recorte R6 | um modelo, com raio de recorte indicado |",
          ]),
        ],
      },
    },
  },

  /* --- 欧标锁芯九个长度 --------------------------------------------- */
  {
    file: "euro-cylinder-size-chart-2026",
    ops: {
      bodyEs: {
        prefix: "45 mm — 3 modelos.",
        count: 1,
        insert: [
          t([
            "| Longitud total | Modelos publicados | Repartos de la escala de 5 mm |",
            "| --- | --- | --- |",
            "| 45 mm | 3 | ninguno por encima del mínimo de 27,5 — medio cilindro o cuerpo solo con pomo |",
            "| 47 mm | 1 | — |",
            "| 54 mm | 2 | — |",
            "| 56 mm | 1 | — |",
            "| 60 mm | 5 | 30/30 |",
            "| 65 mm | 2 | 30/35 |",
            "| 70 mm | 19 | 30/40, 35/35 |",
            "| 80 mm | 6 | 30/50, 35/45, 40/40 |",
            "| 90 mm | 4 | 35/55, 40/50, 45/45 |",
          ]),
          "70 mm es con diferencia la longitud más fabricada: 19 de los 45 modelos.",
        ],
      },
      bodyPt: {
        prefix: "45 mm — 3 modelos.",
        count: 1,
        insert: [
          t([
            "| Comprimento total | Modelos publicados | Repartições da escala de 5 mm |",
            "| --- | --- | --- |",
            "| 45 mm | 3 | nenhuma acima do mínimo de 27,5 — meio cilindro ou corpo só com botão |",
            "| 47 mm | 1 | — |",
            "| 54 mm | 2 | — |",
            "| 56 mm | 1 | — |",
            "| 60 mm | 5 | 30/30 |",
            "| 65 mm | 2 | 30/35 |",
            "| 70 mm | 19 | 30/40, 35/35 |",
            "| 80 mm | 6 | 30/50, 35/45, 40/40 |",
            "| 90 mm | 4 | 35/55, 40/50, 45/45 |",
          ]),
          "70 mm é de longe o comprimento mais fabricado: 19 dos 45 modelos.",
        ],
      },
    },
  },
  {
    file: "backset-door-thickness-chart-2026",
    ops: {
      bodyEs: {
        prefix: "Ajustable 60/70 mm — 100 registros.",
        count: 2,
        insert: [
          t([
            "| Distancia al eje | Registros | Nota |",
            "| --- | --- | --- |",
            "| Ajustable 60/70 mm | 100 | la configuración más publicada; el ajuste es físico en la caja, así que un número de pieza cubre las dos |",
            "| Fija 60 mm | 16 | — |",
            "| Fija 70 mm | 5 | — |",
            "| Fija 50 mm | 6 | — |",
            "| Fija 45 mm | 4 | — |",
            "| Fija 30 mm | 4 | perfil estrecho y puerta de vidrio, donde no cabe nada más largo |",
          ]),
          "La caja ajustable 60/70 existe porque esas dos distancias cubren la mayor parte del parque de puertas de madera y metal de los mercados a los que enviamos.",
        ],
      },
      bodyPt: {
        prefix: "Ajustável 60/70 mm — 100 registros.",
        count: 2,
        insert: [
          t([
            "| Distância ao eixo | Registros | Nota |",
            "| --- | --- | --- |",
            "| Ajustável 60/70 mm | 100 | a configuração mais publicada; o ajuste é físico na caixa, então um código cobre as duas |",
            "| Fixa 60 mm | 16 | — |",
            "| Fixa 70 mm | 5 | — |",
            "| Fixa 50 mm | 6 | — |",
            "| Fixa 45 mm | 4 | — |",
            "| Fixa 30 mm | 4 | perfil estreito e porta de vidro, onde não cabe nada mais longo |",
          ]),
          "A caixa ajustável 60/70 existe porque essas duas distâncias cobrem a maior parte do parque de portas de madeira e metal dos mercados para onde enviamos.",
        ],
      },
    },
  },
  {
    file: "backset-door-thickness-chart-2026",
    ops: {
      bodyEs: {
        prefix: "De 35 a 45 mm ajustable — 106 registros.",
        count: 2,
        insert: [
          t([
            "| Rango de espesor de puerta | Registros | Nota |",
            "| --- | --- | --- |",
            "| De 35 a 45 mm ajustable | 106 | el rango estándar; cubre la gran mayoría de puertas interiores y de entrada de los mercados de este catálogo |",
            "| De 35 a 50 mm | 34 | — |",
            "| De 35 a 55 mm estándar, 30 a 60 mm bajo pedido | 22 | — |",
            "| De 8 a 12 mm | 7 | herrajes de vidrio — la cifra describe vidrio templado, no una hoja de puerta |",
          ]),
        ],
      },
      bodyPt: {
        prefix: "De 35 a 45 mm ajustável — 106 registros.",
        count: 2,
        insert: [
          t([
            "| Faixa de espessura de porta | Registros | Nota |",
            "| --- | --- | --- |",
            "| De 35 a 45 mm ajustável | 106 | a faixa padrão; cobre a grande maioria das portas internas e de entrada dos mercados deste catálogo |",
            "| De 35 a 50 mm | 34 | — |",
            "| De 35 a 55 mm padrão, 30 a 60 mm sob pedido | 22 | — |",
            "| De 8 a 12 mm | 7 | ferragens de vidro — a cifra descreve vidro temperado, não uma folha de porta |",
          ]),
        ],
      },
    },
  },
  {
    file: "euro-cylinder-size-chart-2026",
    ops: {
      body: {
        prefix: "45mm (1-3/4\") — 3 models.",
        count: 1,
        insert: [
          t([
            "| Overall length | Imperial | Models we publish | Splits from the 5mm ladder |",
            "| --- | --- | --- | --- |",
            "| 45mm | 1-3/4\" | 3 | none above the 27.5 minimum — half cylinder or thumbturn-only body |",
            "| 47mm | 1-7/8\" | 1 | — |",
            "| 54mm | 2-1/8\" | 2 | — |",
            "| 56mm | 2-3/16\" | 1 | — |",
            "| 60mm | 2-3/8\" | 5 | 30/30 |",
            "| 65mm | 2-9/16\" | 2 | 30/35 |",
            "| 70mm | 2-3/4\" | 19 | 30/40, 35/35 |",
            "| 80mm | 3-1/8\" | 6 | 30/50, 35/45, 40/40 |",
            "| 90mm | 3-9/16\" | 4 | 35/55, 40/50, 45/45 |",
          ]),
          "70mm is the single most common length we make, at 19 of the 45 models.",
        ],
      },
    },
  },

  /* --- 距心与门厚 --------------------------------------------------- */
  {
    file: "backset-door-thickness-chart-2026",
    ops: {
      body: {
        prefix: "Adjustable 60/70mm (2-3/8\" / 2-3/4\") — 100 records.",
        count: 2,
        insert: [
          t([
            "| Backset | Imperial | Records | Note |",
            "| --- | --- | --- | --- |",
            "| Adjustable 60/70mm | 2-3/8\" / 2-3/4\" | 100 | the commonest configuration we publish; the adjustment is physical in the case, so one part number covers both |",
            "| Fixed 60mm | 2-3/8\" | 16 | — |",
            "| Fixed 70mm | 2-3/4\" | 5 | — |",
            "| Fixed 50mm | 1-15/16\" | 6 | — |",
            "| Fixed 45mm | 1-3/4\" | 4 | — |",
            "| Fixed 30mm | 1-3/16\" | 4 | narrow-stile and glass door, where there is no room for anything longer |",
          ]),
          "The adjustable 60/70 case exists because those two backsets cover most of the timber and metal door stock in the markets we ship to.",
        ],
      },
    },
  },
  {
    file: "backset-door-thickness-chart-2026",
    ops: {
      body: {
        prefix: "35 to 45mm (1-3/8\" to 1-3/4\") adjustable — 106 records.",
        count: 2,
        insert: [
          t([
            "| Door thickness range | Imperial | Records | Note |",
            "| --- | --- | --- | --- |",
            "| 35 to 45mm adjustable | 1-3/8\" to 1-3/4\" | 106 | the standard range; covers the great majority of interior and entrance doors in the markets this catalog serves |",
            "| 35 to 50mm | 1-3/8\" to 1-15/16\" | 34 | — |",
            "| 35 to 55mm standard, 30 to 60mm on request | 1-3/8\" to 2-3/16\" (1-3/16\" to 2-3/8\") | 22 | — |",
            "| 8 to 12mm | 5/16\" to 1/2\" | 7 | glass door fittings — the number describes toughened glass, not a door leaf |",
          ]),
        ],
      },
    },
  },
];

let changed = 0;
const stale = [];

for (const edit of EDITS) {
  const path = `content/guides/${edit.file}.json`;
  const article = JSON.parse(readFileSync(path, "utf8"));
  let touched = false;

  for (const [key, op] of Object.entries(edit.ops)) {
    const body = article[key];
    if (!Array.isArray(body)) continue;
    // 已经是表了 —— 幂等退出。
    if (body.some((p) => p.startsWith("|") && p.includes("\n| --- "))) {
      const already = body.findIndex((p) => p.startsWith(op.prefix));
      if (already === -1) continue;
    }
    const next = replaceRun(body, op.prefix, op.count, op.insert);
    if (!next) continue;
    article[key] = next;
    touched = true;
  }

  if (touched) {
    changed += 1;
    if (!check) writeFileSync(path, `${JSON.stringify(article, null, 2)}\n`);
    else stale.push(edit.file);
  }
}

if (check && stale.length) {
  console.error(`guide-tables: ${stale.length} 处查表数据还是散文，没有改成管道表：`);
  for (const f of [...new Set(stale)]) console.error(`  ${f}`);
  process.exit(1);
}

console.log(
  changed ? `guide-tables: 改写了 ${changed} 处` : "guide-tables: 每张查表都已经是管道表",
);
