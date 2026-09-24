# HYDE 西语文风指南：一种西语，墨西哥、阿根廷、秘鲁都读得顺

来源：[README](README.md)（Truper、Phillips、Kallay、Trabex、Fratelli Currao、Cantol、Forte，另有 Helvex、Easy 作对照）。
检查：`node scripts/audit-copy-locale.mjs`。

## 0. 为什么是“中性拉美西语”

`/es/` 只有一套页面，要同时服务三个国家。本地品牌各写各的国家：阿根廷用 vos，墨西哥和秘鲁的零售文案用 tú，同一个零件三国叫法也不全一样。
所以规则是：**三国都通用的词优先；只在一国通用的词不用；各国意思不同的词，第一次出现写成“通用词（地区词）”。**

现有西语的问题不在拉美三国之间，而是**整体偏西班牙西语**：manilla 215 处、picaporte 85 处、cortafuegos 21 处。

## 1. 读者，和我们对他承诺什么

读者是进口商、五金批发商（ferretería mayorista）、建筑商的采购。
本地品牌用 *tranquilidad*（安心）向终端家庭承诺“家里安全”；我们对采购商承诺的是**订单上的尺寸、材质和文件都不会出错**。
这个词可以用，但对象要换：例如写 `tranquilidad en el pedido`（下单安心），不要写成“守护您的家人”。

## 2. 称呼：usted，或不用人称

- 直接对读者说话时用 **usted**：`Envíenos su cuadro de puertas.`（请把门表发给我们。）三国的企业文案都接受 usted。现有文章已经在用（65 处），保持即可。
- 不用 **vos**（podés、explorá）：墨西哥和秘鲁的读者会觉得这是一条阿根廷本地广告。
- 不用 **tú**：阿根廷读者会觉得像外国零售商。
- 技术规格用**不带人称的写法**，学 Truper：`Para puertas de 35 a 50 mm de espesor.`（适用门厚 35 至 50 mm。）

## 3. 数字和单位

- 毫米为主。**门厚**要附英寸，写在括号里，照顾墨西哥的习惯（Truper 就这样写）：`hasta 50 mm (1.97 pulg.)`。换算保留两位小数，不写成近似的分数。
- **小数分隔符要统一**。现在逗号 99 处、小数点 56 处混用。墨西哥的习惯是小数点，阿根廷是逗号，秘鲁两种都有 → **待甲方定，见计划的决定 D2**。
- 产地直说，学 Truper：写明**在中国自有工厂生产、按什么标准检验**，不回避，也不渲染。

## 4. 产品描述模板（学 Phillips 和 Truper：按部件写材质，规格优先）

```
[Tipo], [dimensión clave] y [dimensión clave]. [Otras medidas publicadas].
• [Pieza]: [material] — solo si está publicado.
• Para [aplicación / espesor de puerta] — solo si está verificado.
```

LC07：

> Cerradura de embutir, distancia entre ejes de 85 mm y entrada de 45 mm.
> Frente de 240 × 23 mm; caja de 173 mm de alto y 72 mm de fondo. Salida del pestillo 26 mm; salida del cerrojo 18.5 mm.

（18.5 还是 18,5，按决定 D2 统一。）目录里没给材质，所以不写。

## 5. 文章结构

和英语版一样：结论句在前，二级标题用买家会问的问题，结尾告诉读者要发什么给我们。
**不照英文逐句翻译**：先弄清英文那句在说什么，再按西语的习惯写。句子可以更长，但结论还是放第一句。

## 6. 术语表（统一用这一列）

| 零件 | 用 | 不用 / 仅作括注 | 依据 |
|---|---|---|---|
| lever handle | **manija** | manilla（西班牙、智利）；picaporte（在阿根廷指执手） | Forte、Cantol 用 manija；阿根廷的用法本次没抓到原文，列入第 6 节末尾的待确认 |
| knob | **pomo (perilla)** | — | Forte 用 pomo，Cantol 用 perilla |
| latch bolt | **pestillo** | picaporte | Kallay 的筛选项写 pestillo reversible |
| deadbolt | **cerrojo** | pestillo（指死舌时） | Kallay、Trabex、Phillips、Cantol 都这么叫 |
| mortise lock | **cerradura de embutir** | — | Cantol、Forte、Phillips |
| rim lock | **cerradura de sobreponer** | — | Truper、Cantol、Forte |
| faceplate | **frente** | — | Kallay 的筛选项写 material frente |
| finish | **acabado** | terminación（阿根廷用法，可括注） | Cantol、Forte；Currao 用 terminaciones |
| escutcheon | **escudo (bocallave)** | — | Currao 的产品线叫 Plaquetas y Bocallaves |
| door closer | **cierrapuertas** | — | Kallay、Trabex |
| panic exit device | **barra antipánico** | — | Trabex |
| fire door | **puerta cortafuego** | cortafuegos | |
| hardware | **herrajes** | — | 三国通用 |
| spec sheet | **ficha técnica** | — | Truper |

**还不能定、要找当地买家确认的**（先保持现状，不批量替换）：

| 零件 | 现在的写法 | 问题 |
|---|---|---|
| backset | entrada（130 处）/ distancia al eje（60 处） | 两种并存，要选一个，但本次调研没抓到这三国写 backset 的原文 |
| strike | cerradero（88 处）/ hembra（10 处） | 本次语料里三国都没出现这个零件的叫法 |
| lever handle（阿根廷） | manija | 阿根廷口语里 picaporte 指执手；manija 在阿根廷是否同样通用，本次没抓到原文 |

## 7. 不写

感叹号（Phillips 零售文案会用）· vos 和 tú · “líder del mercado” · “la más alta calidad”· 生活方式散文（Helvex）· 编出来的材质或尺寸。
