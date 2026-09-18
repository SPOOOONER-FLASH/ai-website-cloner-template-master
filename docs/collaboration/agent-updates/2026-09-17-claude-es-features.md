# 西语特性列表 0 / 216 → 216 / 216，巴西葡语守卫扩到全树

**agent**: Claude · **日期**: 2026-09-17 · 接 `2026-09-17-claude-pt-zero-english.md`

## 一、那 545 行项目符号，西语页面从上线起一次都没显示过

不是「回退成英文」，是**整块不渲染**：

```tsx
{!es && product.features?.length ? …}
```

一个为两种语言写的判断，答案只有「是西语」和「不是西语」两种。所以西语页面上
**没有这一块**，没人看得见缺了什么 —— 直到葡语在 09-17 补到 216/216，
旁边多出一个数字，0 才变得刺眼。

**一个没人数得出来的回退，就是一个会永久存在的回退。** 这是这一条的全部教训。

## 二、做法：和葡语同一套，逐条译，整条记录才写

| 文件 | 内容 |
|---|---|
| `src/data/es-features.ts` | 545 行西语译文，沿用葡语表的分节与注释结构 |
| `scripts/translate-product-features-es.mjs` | 葡语脚本的姊妹版，`npm run translate:features:es` |
| `src/data/types.ts` | `featuresEs?: string[]` |
| `ProductDetail` | 三种语言各取各的列表 |

规则不变：**一条记录的每一行都能解析时才写**。四条西语加两条英文的列表看起来做完了，
其实没有。结果 **216 / 216**。

术语按 `es-glossary.ts` 定死，写进文件头：
picaporte（latch）/ pestillo（deadbolt）/ cerradero（strike）/ cuadradillo（spindle）/
entrada（backset）/ guarnición（trim）/ roseta / pomo / manilla /
llave igual / amaestramiento / taladro pasante / zamak / botón giratorio。

**数字是搬过去的，不是翻译的**：60mm (2-3/8”) 一个字符都不动。
只有小数点和千分位跟着语言走 —— 200,000 写成 200.000，18.5mm 写成 18,5 mm，
因为那是同一个数的本地读法。

验证（构建产物，同一个型号三种语言）:

```
ES | es-bullet: true  | pt-bullet: false | en-bullet: false
PT | es-bullet: false | pt-bullet: true  | en-bullet: false
EN | es-bullet: false | pt-bullet: false | en-bullet: true
```

## 三、巴西葡语：从一个文件的守卫扩到全树

`hardware-terms.test.ts` 那条只管术语表。新增
`src/data/portuguese-brazilian.test.ts`，扫的是**确定是葡语的文本**：

1. 整份都是葡语的文件（`src/app/pt/**`、`src/data/pt-*.ts`、`home-pt.ts`）；
2. 其他任何文件里 `pt: { … }` 区块的内容，和 `*Pt` 字段的**值**，
   源码与 `content/**.json` 一视同仁。

扫出十条并已修：`de facto`、`projecto`、`directamente`×3、`Contacto(s)`×3、
`actual`，外加同一句里的前置代词（`actualiza-se` → `é atualizado`、
`refaz-se` → `se refaz`、`escreva-nos` → `escreva para nós`）。

### 两个差点让这条守卫作废的坑，都写进注释了

**`projecto?s?` 会匹配英文的 "project"** —— 第一版报了二十个英文标识符。
必须是 `projectos?`。

**按「行」取文本会把隔壁的西语一起吃掉** —— `labelEs: "Contacto"` 被报成欧葡，
而那是正确的西班牙语。所以 `*Pt` 字段取的是**值**，不是行。

一条误报的代价不是误报本身，是下一个会话删掉这条守卫。

反证过：把 `home-pt.ts` 里一个 `equipe` 改回 `equipa`，测试立刻红，并打印
`src/data/home-pt.ts:216  "equipa" → equipe`。

## 数字

- `npm test` **335 / 335**（新增 1 条）
- typecheck 干净，lint 0 error
- `deploy:prep` 全绿；葡语两项审计仍然是 **0 英文 / 0 西语**（690 页）

## 还剩

- 甲方 2026-09-17 明确：**PageSpeed 那三条架构层面的先不动。**
- 甲方那边还欠：六个订单代码、307/311/305/035 的 Plate size 与 Plate thickness、
  308-S/308-D 是否共用锁体、执手拉手的固定孔径与孔中心距（519 个已发布型号里只有 6 条有）。
- 服务器那条跳转命令还没跑，见 `CLIENT-RUNBOOK.md` 第一屏。
