# claude — 西语规格表英文残留清零 + tid 映射线上复核

| | |
|---|---|
| 范围 | `src/data/es-glossary.ts`、`scripts/translate-products-es.mjs`、184 个 `content/products/*.json` |
| 结果 | 未译规格行 274 → **0**；受影响页面 129 → **0** |
| 测试 | lint ✅ typecheck ✅ `npm test` 114/114 ✅ |
| **未跑** | `npm run build` / `deploy:prep` —— **`out/` baton 不在我手上**，见下 |
| 未触碰 | `out/`、`src/app/es/**`、`content/promo.json`、任何图片资产 |

## 1. 西语覆盖清零

352 个未命中词条分两类处理，比例大致一半一半：

| 手段 | 吃掉 | 说明 |
|---|---|---|
| 术语表新增 305 条 | 长尾实词 | 拉美外贸西语，复用既有译名（entrada / manija / zamak / cerradura de sobreponer） |
| `NUMERIC_RULES` 新增 11 条 | 纯尺寸串 | `4"x3"x2.0MM`、`280*215*100mm`、`8in/10in/12in`、`Ø42mm`、`180 Degrees` 等 |

尺寸走规则而不是逐条列词条：同一个铰链尺寸目录里写了 11 种写法，逐条列等于写一百条不含
一个西语单词的条目，而且下一版目录照样漏。

**顺带修掉的三个真问题**

1. **小数点不一致。** 老规则输出 `2.5 mm`，手写词条输出 `2,5 mm`，同一张规格表两种写法。
   统一走 `DIM()` 输出逗号（拉美买家占多数：哥伦比亚 / 厄瓜多尔 / 秘鲁 / 阿根廷）。
2. **括号规则漏英文。** `/^([\d.]+)\s*mm\s*(\(.+\))$/` 假设括号里永远是英寸对照，
   于是 `1.0 mm (also available in 0.8 mm)`、`900mm (adjustable)` 原样印在西语页上，
   而且 **不计入未译统计**——是隐性漏报，不是已知缺口。收紧后暴露出 8 条，已逐条补译。
3. **不可见空白。** `110 mm (L) × 66 mm (W)` 里的空格是 U+202F 窄不换行空格，
   精确匹配的术语表看不出差别，只会报「未命中」。在入口统一归一化
   （U+00A0 / U+2007 / U+202F / U+2009 → 普通空格），而不是为每个变体加一条词条。

`--all` 开关：不加只列前 25 条，加了列全部。之前只能看到前 25 条，长尾是盲的。

⚠ 复核入口：`node scripts/translate-products-es.mjs`（不加 `--write`）现在应报 **0**。
非零就是甲方又加了新词，不是回归。

## 2. tid 映射：**已经上线了，HANDOFF 的待办是过期的**

kimi 在 2026-08-30 就部署并验证过（见 `2026-08-30-kimi-nginx-tid-www-deployed.md`）。
2026-08-31 我从外网重测：

```
Index.php?m=home&c=Lists&a=index&tid=97  → 301 /products/lock-cases/   ✅
index.php?m=home&c=Lists&a=index&tid=97  → 301 /products/lock-cases/   ✅
index.php?tid=101                        → 301 /products/knob-locks/   ✅
index.php?tid=100（未映射）               → 301 /products/             ✅ 回落
www.cantonlock.com/company/              → 301 裸域                    ✅
```

456 条内链的那条已经落在类目页上。HANDOFF 第五节已删掉该待办。

**留了一个观察项，不是结论**：`/plus/list.php?tid=97`、`/plus/view.php?aid=1569`
现在是硬 404 —— nginx 只在 `location ~* ^/index\.php$` 里用了 map。DedeCMS 站通常
两种 URL 形态都存在。仓库和 GSC 记录里目前只见到 `Index.php?...&c=Lists&...` 一种，
**所以我没有据此改配置**。哪位能从 GSC / Bing 导出里确认 `/plus/` 形态是否被索引过：
有就在服务器上多加一个 location，没有就把这条划掉。

## 3. ⚠ `out/` 有别人在构建，我没有碰

开工时工作树是干净的。写完产品 JSON 后 `git status` 里冒出约 2300 个 `out/` 改动，
`out/404.html` 的 mtime 是 3 分钟前，而我全程没有跑过任何构建。
按 AGENTS.md 的 baton 规则，**构建权在那位手上**，所以我：

- 只跑了 lint / typecheck / test，**没跑 `npm run check` 的 build 段**，也没跑 `deploy:prep`
  （两者都会写 `out/`，会和正在进行的构建对撞）
- 只 `git add` 了明确的源码路径，没有 `out/` 的任何一个文件

**给 baton 持有者**：我的源码已提交在 main 上。你的构建把它一起带上即可，不需要我再动。
如果你的构建早于我这次提交，重跑一次再提交 `out/`。
上线后记得 purge Cloudflare —— 西语规格表 426 页全部变了。
