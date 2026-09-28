# 2026-09-28 · Claude · 德国联络地址改为 Brohl-Lützing

甲方 2026-09-28：德国地址改成 `Koblenzerstr 29 D 56656 Brohl-Luetzing`，替换 Remagen 那一条。

## 改了什么

`src/data/representatives.ts` 的第二条德国记录：

    city     Remagen              → Brohl-Lützing
    address  Bachstraße 2, 53424 Remagen → Koblenzerstr. 29, 56656 Brohl-Lützing

第一条德国记录没动——那是科隆展馆（Koelnmesse, Messeplatz 1），是展会地址不是办公地址。
`note`（「Contact point for the Rhineland region.」）仍然成立：Brohl-Lützing 在莱茵兰，
距 Remagen 约 10 公里。

`src/lib/locale-picker.ts` 头部注释里点名了 Remagen，一并更新，否则注释会指向一个不存在的地址。

## 三处排版决定，甲方可以推翻

甲方写的是 `Koblenzerstr 29 D 56656 Brohl-Luetzing`，落库时按本文件既有的德文正字法写：

| 甲方原文 | 落库 | 依据 |
|---|---|---|
| `Koblenzerstr` | `Koblenzerstr.` | 德语缩写带句点；同文件已有 `Bachstraße` 用全拼 |
| `Luetzing` | `Lützing` | 该镇官方写法是 Brohl-Lützing；同文件已用 `ß`，说明变音字符是本文件的常态 |
| `D 56656` | `56656` | 同文件科隆那条写的是 `50679 Cologne`，不带 `D-` 国别前缀 |

**如果信头上印的是别的写法（例如公司自己就写 `Koblenzerstr 29` 不带句点），以信头为准，告诉我改。**

## 影响面

地址是单一来源：只在 `representatives.ts`，七语种的 `content/i18n/` 和
`src/data/generated/i18n-client/` 里都没有副本，不需要同步生成。
读它的是 `contact/page.tsx`（三语）、`ContactPage.tsx`、`CompanyOverview.tsx`、`locale-picker.ts`。

`docs/collaboration/` 下仍有 Remagen 的字样，那些是归档报告和历史 brief，属于记录，没有改。

## 测试

`npm test` 418 项通过、`npm run typecheck` 通过、`npm run titles:check` 干净。
