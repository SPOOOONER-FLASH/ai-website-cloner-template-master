# Claude — 从甲方自己写的 Word 描述补 1082 行规格

| | |
|---|---|
| 范围 | `scripts/read-drive-descriptions.mjs`、`scripts/apply-family-specs.mjs`（均新增）、`content/products/*.json`(142) |
| 结果 | 只有 1 行规格的产品 **106 → 65**；4 行以上 **84 → 231** |

## 数据来源

`F:\网站资料\产品描述` 里 13 个 Word，甲方 2019/2022 年自己写的，中英对照。
每个系列都写了买家真正会问的数字：轴距、适装门厚、开合寿命、锁体材质、锁芯类型。

**本机没有 Word，python 是商店占位程序**，所以两种格式都直接解：
`.docx` 是 zip，解 `word/document.xml`；`.doc` 是 Word 97，文本以 **UTF-16LE** 存在 OLE 容器里。

⚠ 用 CP936 解 `.doc` 会得到**自信满满的乱码**（满屏「鄥燆鵒h」）——这是最该避开的失败模式，
因为它看起来像数据。UTF-16LE 才是对的。

## 三件故意不做的事

1. **不导认证。** 逃生锁那份文件每个型号都跟着 "Quality standard: CE certificate,
   Fire rated EN1125"。今天刚从站上撤掉这类声明，导回来等于白干。脚本把这些行
   单独收进 `certificationLines`，不并入产品数据。
2. **不补空值。** 呆锁、大档盖球锁、建筑锁三份文件里 "Backset" 只有标题没有数值，
   就不写。
3. **不写 Finish。** 表面处理逐型号不同，系列文件没写。

## 应用范围

| 系列 | 产品数 |
|---|---|
| lever-handles | 40 |
| knob-locks/tubular-locks | 26 |
| knob-locks/heavy-duty-cylindrical-locks | 24 |
| night-latches-rim-locks | 22 |
| knob-locks/light-duty-cylindrical-locks | 12 |
| grip-handle-sets | 11 |
| deadbolts | 7 |

系列级数据不是对单个型号的猜测，是甲方对该系列每个型号的公开表述。
按前缀匹配，长前缀优先，子分类不会被父分类盖掉。

## 验证

`npm run check` 全绿（49 + 23 测试，473 页，0 semantic issue）。
