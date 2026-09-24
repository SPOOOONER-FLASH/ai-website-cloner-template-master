# 2026-09-24 · Claude · 甲方决定 D1：西语锁具术语按 RAE，picaporte 退役

甲方 09-24 决定（经文案会话转达）：西语锁具术语以西班牙皇家语言学院词典为准。
`latch bolt` = **pestillo**（RAE 义项 2：由钥匙或弹簧带动、伸出锁体进入锁口的那个件），
`deadbolt` = **cerrojo**。`picaporte` 退役——在阿根廷它指的是执手。

我这一侧：`src/data/es-glossary.ts` 的键，以及重新生成 `specsEs`。
文章正文归文案会话手工处理，归一化规则归工程会话。

## 结果

| | 之前 | 之后 |
|---|---|---|
| `es-glossary.ts` 里的 picaporte | 29 处 | **0** |
| HYDE 记录 `specsEs` 里的 picaporte | 229 行 | **0** |
| `summaryEs` | 37 条 | 37 条（**没碰**，文案车道） |
| `seoTitleEs` / `seoDescriptionEs` | 19 条 | 19 条（**没碰**，工程车道） |

按文案会话的要求，只重新生成了 `specsEs`；跑完把 `summary*` 与 SEO 字段从 HEAD 还原，
最终 diff 只有 `label` 和 `value` 两种行。

## `Bolts` 那个问题：查过了，标签不动，两条值要动

文案会话问「`Bolts`: `Pestillos` 那些行是不是指 deadbolt，改之前先确认」。四条记录用了这个标签：

| 记录 | 英文值 | 处理 |
|---|---|---|
| LC04 85*60 | Four round bolts | 泛指，不动 |
| LC14 85×50mm | Four round bolts | 泛指，不动 |
| 6068 | Three square **deadbolts**, plus latch | 值要改 |
| 9088 SS | **Latch** and square **deadbolt** | 值要改 |

**标签 `Bolts` = `Pestillos` 保留**：RAE 的 pestillo 是「由钥匙**或**弹簧带动」的那个件，
本来就同时涵盖弹簧舌和方舌，作为泛指标签是正确的。要改的是那两条把两个件混在一句里的**值**：

    "Three square deadbolts, plus latch"      Tres pestillos cuadrados, más picaporte
                                           →  Tres cerrojos cuadrados, más pestillo
    "Latch and square deadbolt"               Picaporte y cerrojo cuadrado
                                           →  Pestillo y cerrojo cuadrado
    "60mm / 70mm adjustable, latch and deadbolt both"
                                              60 / 70 mm regulable, picaporte y pestillo
                                           →  60 / 70 mm regulable, pestillo y cerrojo

这三条必须**在**全局 picaporte→pestillo **之前**改，否则两个词会塌成同一个，
行里就再也分不出哪个件是哪个。`Deadbolt: "Cerrojo"` 本来就是对的，没动。

## 跑这一次抓到了我自己今天埋的三个雷

重新生成之后读 `label` 的 diff，发现有三处不是术语改名，是**我今天新加的键在覆盖审校已有的写法**：

| 键 | 我写的（凭英文直译） | 记录里审校已有的 | 采用 |
|---|---|---|---|
| `Case size` | Medidas de la caja de cerradura | **Medidas del cuerpo** | 审校的 |
| `Max door weight` | Peso máximo de puerta | **Peso máximo de hoja** | 审校的 |
| `Supplied with` | Se suministra con | **Incluye** | 审校的 |

今天早些时候我收割**值**的时候是从记录里取的，但加**标签**的时候只查了术语表、没查记录，
于是凭英文直译了。这正是我这两天一直在提醒别人的那件事，换个字段又犯一次。三条都已改成审校的写法。

**教训写在这里：加一个标签键之前，先看记录的 `specsEs` 里那一行现在写的是什么。**
术语表里没有，不等于页面上没有。

## main 上有一条既有失败，不是我的

    ✗ scripts/build-longtail-report.mjs 用了英式拼写

最后改动是 `3074eb903c9 长尾词成果汇报：生成器 + 首期报告`，不在我的改动集里。已告知。

## 没加测试，避免和工程会话重复

AGENTS.md 说甲方决定应由测试锁定，但归一化规则归工程会话，他们会在
`normalize-regional-terms.mjs` 里加 picaporte→pestillo 并由 `regional-terms.test.ts` 守。
我再加一个断言只会重复。**已把 `summaryEs` 37 条、SEO 19 条的数字发给对应车道**，
提醒他们的规则要覆盖这些字段和文章正文。

## 测试

`spec-table-parity`、`regional-terms`、`portuguese-brazilian`、`product-dashes`、
`hardware-terms` 通过；`us-spelling` 因上面那条既有失败而红。
