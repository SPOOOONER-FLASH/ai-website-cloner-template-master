# claude — 商业意图词内置：量出来的结论是「关键词不是瓶颈，甲方的商务数据才是」

| | |
|---|---|
| 范围 | 新增 `docs/research/commercial-keywords.json`、`scripts/audit-keyword-coverage.mjs` |
| 测试 | lint 通过；对已构建的 15 个类目页实测 |
| 未碰 | 任何页面文案、标题 —— 这一轮只做度量，不改copy |

## 结论

```
15 个类目页里，自有文案带商业词的：11/15
15 个类目页里，自有文案带交易词的：  0/15
```

**一个都没有。** 没有任何一个类目页在自己的正文里出现
MOQ / lead time / sample / wholesale / bulk / quote / minimum order。

## 我第一版脚本给了个好看的假数字，记录在此

第一版报告「15/15 全都有商业词和交易词」，看起来这件事已经解决了。
**15 个不同的页面分数完全相同（3/7 和 2/8），这不是覆盖率，这是页头页脚。**

它数到的是 `manufacturer / factory / price / catalogue / stainless steel / export` ——
导航、阿里区块和页脚，941 个页面（含 404）上全都有。
**一个出现在每个页面上的词，不能让任何一个页面因它排上去。**

已改为先求 15 个页面的交集当作 chrome 扣除，每个页面只计**它说了而兄弟页面没说**的词。
扣完之后交易词从 2/8 变成 0/8。

## 这个缺口不能靠写关键词补 —— 这是本轮最重要的一句

交易词缺失和买家题库里那 5 条空 FAQ **是同一个缺口**：
MOQ、交期、样品、付款方式、OEM。

在没有数字的页面上写「MOQ」就是关键词堆砌，而且违反内容纪律 ——
采购商会照着下单。**所以正确的动作不是改文案，是拿到甲方那五个数字。**
拿到之后，这五个词会自然出现在它们该出现的地方，不需要专门"做 SEO"。

## 引荐文字数据说了什么（GSC 2026-08-31 导出）

**前四名是 english / home / 两条裸 URL** —— 全是导航词，不带任何主题。
描述性锚文本从第 5 名才开始，且几乎全是**单数**词头：

| 锚文本 | 排名 | 类目 |
|---|---|---|
| lock cylinder | 5 | 锁芯 —— **外链权重最高的类目** |
| knob lock series | 7 | 球形锁 |
| lever handle | 8 | 执手 |
| deadbolts | 10 | 单锁舌（唯一一个复数锚文本，也是唯一与页面名完全一致的） |
| stainless steel handle | 12 | 不锈钢拉手 |
| lock case | 13 | 锁体 |
| panic exit device | 14 | **旗舰线只排到第 14** |
| door closer | 15 | 闭门器 |
| sliding hook lock | 16 | 钩锁（只有 3 个产品，却有描述性锚文本） |
| grip handle set | 17 | 大拉手 |

**5 个类目没有任何人用描述性词链接过**：night-latches-rim-locks（22 个产品）、
bathroom-accessories（45 个，我们第三大类目）、brass-steel-hinges、
glass-door-accessories、hardware-accessories。

## 关于单复数：不要为它改标题

我们的类目名是复数，锚文本几乎都是单数。**Google 把单复数做词干归并，
`lever handle` 和 `Lever Handles` 对它不是两个查询。**
为这个去改已上线的标题是浪费，而且会和 Kimi 刚加的
「— Manufacturer & Supplier」限定词打架（那个限定词是对的，已在 15 个类目页全部生效）。

锚文本清单真正的用处是**告诉我们哪些类目根本没有外链权重**，见上面那 5 个。

## 两个值得单独看的错配

1. **deadbolts** 有第 10 名的锚文本，却是我们最薄的类目（7 条记录）。
   外链指向一个近乎空的页面。
2. **sliding-hook-locks** 只有 3 个产品，却有描述性锚文本，
   且买家题库审计里它是唯一一个 10 个问题全答不了的类目。

## 用法

```bash
node scripts/audit-keyword-coverage.mjs            # 全表
node scripts/audit-keyword-coverage.mjs --missing  # 只看缺的
```

读的是 `out/` 的**渲染后 HTML 并剥掉标签** —— meta 和 JSON-LD 不算数。
这个区分是刻意的：结构化数据告诉爬虫这个页面**是什么**，
正文才是答案引擎**能引用**的东西。
