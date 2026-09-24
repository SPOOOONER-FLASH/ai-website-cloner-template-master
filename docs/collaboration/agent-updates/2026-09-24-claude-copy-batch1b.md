# 西葡改写第 1 批（二）：推杠文章、方轴指南；删掉一句不实的认证说法

- **Agent**: Claude（HYDE 文案，tmp/claude-copy） · **日期**: 2026-09-24

| 改动 | 说明 |
|---|---|
| **三语删掉不实说法** `news/push-bar-or-touch-bar-panic-exit-devices` 第 17 段 | 原文写 *We hold our own test documentation and can supply it for a tender*（我们持有自己名下的测试文件，可以提供给招标）。甲方 09-21 回复 Serraller 时写的是：CE 测试在客户名下，自己名下的还没做完。现改为教买家看测试报告**是谁名下的、写的是不是他要买的型号**，不说我们有，也不说没有。**对外怎么表述认证现状，仍待甲方定（F2）** |
| 推杠文章西语、葡语重写 | 西语：push bar 统一为 *barra de empuje*、touch bar 统一为 *barra de presión*（UNE-EN 1125 的叫法），不再混用 *barra de toque*；*coordinador* 统一为 *selector*；*dogging* 译为 *retención en abierto*；外侧执手改用产品名里的 *guarnición exterior*。葡语：清掉葡萄牙葡语用词（*libertados*、*solta-a*、*reparação*、*avaria*、*subtil*、*operário* 等）；*inativa* 统一为 *passiva*；*astrágalo* 改为 *mata-junta*；在 EN 1125 旁并列写巴西推杠标准 **ABNT NBR 11785**（已核实：装在 NBR 11742 防火门上的推杠须为 F 类）；修掉错字 *maiondo* |
| 方轴指南西语、葡语局部重写 | 西语：锁上接方轴的方孔改用行业词 *nuez*，不再用 *cuadradillo hembra*；加一句“有西班牙的防火门五金分销商全系列用 9 mm”（来自 Serraller 的询盘，不点名）。葡语：清掉 *contentor*、*cifra*、*À parte* 等葡萄牙葡语，修正 *outro têmpera* 的性数错误和 *Se pede* 缺主语 |
| `docs/copy/style-guides/pt-br.md` | 更正：NBR 11742 管紧急出口用防火门；推杠另有 NBR 11785 |

## 发现的脚本问题（已转交）

`normalize-regional-terms.mjs` 里 “estar a + infinitivo → gerúndio” 那条规则，会把 *está a maior parte* 里的 *maior* 当成动词不定式，改写成 *maiondo*。推杠文章里原来那处错字就是这样来的，本次已随重写修掉，全站再没有第二处。规则本身要加排除：*maior*、*melhor*、*pior* 以 -r 结尾但不是动词。

## 测试

`npm test` 通过；`normalize-regional-terms` 无改动；`normalize-us-spelling --check` 通过；`audit-translation-parity` 对这三篇没有新增数字不一致。
