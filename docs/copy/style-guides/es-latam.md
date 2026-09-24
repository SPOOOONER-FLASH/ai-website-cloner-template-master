# 西语市场补充：拉美和西班牙的 B 端采购都读得懂

**本文件只是补充。** 称呼（usted，产品页不用人称）、句法、单位（小数用逗号）、术语，以 `docs/collaboration/2026-09-24-voice-en-es-pt.md` 和 `src/data/es-glossary.ts` 为准；地区用语由 `scripts/normalize-regional-terms.mjs` 统一，并由测试守住。
B 端方向和真实买家，见 [README](README.md)。

## 1. 读者

进口商、五金批发商（distribuidor）、门厂、防火门安装商（instalador de puertas cortafuego）。
**西班牙也是读者**：巴塞罗那的 Serraller 是看了网站以后下单的，Search Console 里西班牙有 60 次展示。所以规则是：

> **写拉美中性西语，但每个关键词都要让西班牙读者一眼看懂。** 两边说法不同的零件，在每篇文章或每个产品页**第一次出现**时写成“通用词（西班牙说法）”，之后只用通用词。

## 2. D1：锁舌、死舌、执手用哪个词（甲方 09-24 定：按西班牙皇家学院词典）

| 零件 | 用 | 为什么两边都读得懂 | 不用 |
|---|---|---|---|
| latch bolt（斜舌） | **pestillo** | RAE（西班牙皇家学院词典）对 pestillo 的释义就是“靠钥匙或弹簧伸出、进入锁扣的锁舌”，西班牙、墨西哥、阿根廷、秘鲁都这么用；阿根廷 Kallay 的筛选项写 *pestillo reversible*（可换向锁舌）。需要强调弹簧斜舌时写 *pestillo de resbalón* | **picaporte**：墨西哥指锁舌，**阿根廷指执手**，西班牙多指门拉手或锁舌总成，三地理解各不相同 |
| deadbolt（方舌） | **cerrojo** | 各地通用；Kallay、Trabex、Phillips 都这么写 | 把 pestillo 当作 deadbolt 用 |
| lever handle（执手） | **manija**，第一次出现写 **manija (manilla)** | 拉美通用 manija；西班牙说 manilla，Serraller 的询盘里就写 *Manilla 9080E* | 正文只写 manilla（拉美读者会以为是手环或表针） |
| fire door（防火门） | **puerta cortafuego**，第一次出现写 **puerta cortafuego (cortafuegos)** | 拉美写 cortafuego，西班牙写 cortafuegos，两种都认得 | — |
| door coordinator（顺序器） | **selector de cierre**，第一次出现写 **selector de cierre (coordinador de hoja)** | Serraller 写 *coordinador hoja* | — |
| panic exit device（逃生推杠） | **barra antipánico** | 两边通用 | — |

**执行边界**：picaporte 改成 pestillo，要改 `normalize-regional-terms.mjs` 里 `resbalón → picaporte` 这条规则，还要逐处读上下文，把原来当作 deadbolt 用的 pestillo 改成 cerrojo。**这个脚本归工程会话**，先发消息商量，不直接改。
“通用词（西班牙说法）”这种括注，测试会不会误判为西班牙用词回潮，也要先和工程会话对好。

## 3. B 端文章和产品页怎么写

| 写 | 例 |
|---|---|
| 先写兼容尺寸 | `Eje cuadrado de 9 mm; bajo pedido, 8 mm.`（9 mm 方轴，可按要求做 8 mm。）只写工厂确认过的规格。Serraller 就是先问这个 |
| 写清贴牌能做什么 | 说明书的语种、标签位置、包装：**只写甲方确认过可以做的项** |
| 如实写认证现状 | 不写“认证齐全”。现状怎么对外说，要甲方先定措辞 |
| 写成套配置 | 双开防火门要推杠、执手、顺序器、闭门器一起配，文章里直接链到这几个型号 |
| 写交易路径 | 走阿里巴巴平台还是直接交易，**甲方确认后再写** |

## 4. 不写

家里防盗、守护家人、*tranquilidad para su familia* 这类话 · 感叹号 · *líder del mercado* · vos 和 tú · 没有测过的认证。
