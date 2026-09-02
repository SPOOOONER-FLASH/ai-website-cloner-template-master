# 2026-09-02 · Claude · 两份待补清单合并成一份可填写的工作表

## 范围

甲方要求：`DATA_GAP_SHEET.html` 和 `BUYER_QUESTION_COVERAGE.md` 合并成**一个**文件 ——
既能被 agent 读取提取，又能让不懂英文/网络/AI 的美工同事双击打开直接填写。

两份文档在问同一个人同一批事实。「Backset on 32/45 records」和买家问
"what backset do you have" 是一个事实，不是两个。合并按事实去重，一件事只问一次。

## 产出

| 文件 | 作用 |
|---|---|
| `docs/research/SUPPLIER_WORKBOOK.html` | **唯一交付物**。216 个填写框，双击即用 |
| `scripts/build-supplier-workbook.mjs` | 生成器，`npm run content:workbook` |
| `scripts/lib/question-coverage.mjs` | 判定逻辑，审计脚本与工作表共用，杜绝漂移 |
| `docs/research/buyer-questions.zh.json` | 136 条待答问题的中文问法 + 归属（supplier/tech/field） |

删除：`docs/research/DATA_GAP_SHEET.html` · `docs/research/BUYER_QUESTION_COVERAGE.md` ·
`scripts/build-data-gap-sheet.mjs`。`audit-question-coverage.mjs` 保留但去掉 `--markdown`
（数字现在只打印，不再写文件）。

## 工作表结构

一、全公司只填一次（10 项，含甲方 2026-09-01 指定的价值排序）·
二、8 个无出处的表面代码 · 三、分品类问答（136 条待答问题，按品类分组，
每条旁边显示本品类现有覆盖 X/Y）· 四、9 个零规格型号 · 五、48 个「按需询问」·
附录 A 全站字段覆盖率（只读）· 附录 B 技术侧的活（含 38 条外链改深链）。

给不懂技术的人用的部分：全中文（除型号）· 自动存 localStorage · 进度条 ·
「只看重点」过滤（81 项）· 【复制全部】→ 粘微信 · 【导出文件】→ .txt · 可打印 A4。

## 导出格式（agent 读回用）

```
=== 第一部分 · 全公司只填一次 ===

[A1] 装箱数据
  → 每箱 50 只 / 毛重 12kg / 45×35×30cm
```

id 稳定（`A1` / `C-<品类>-<n>` / `D-<型号>-mat` / `E-<型号>`），可直接映射回
`content/products/*.json`。

## 生成器自带的完整性检查

- 题库里任何 `state !== full` 的问题缺中文译文 → 报错退出并列出缺哪条。
- 通用问题标了 `supplier` 却没进第一部分 → 报错退出。

所以题库加题时不会悄悄漏掉，只会构建失败。

## 顺带查出来的事：那两份文件早就不在 origin/main 上了

`git rm` 的时候发现三个文件都不在 HEAD 里。追下去：提交 `2e48cf87a4`
（「报价单：抬头集中到 _company.json，新增巴西玻璃门五金报价」）把
`DATA_GAP_SHEET.html`（193 行）· `BUYER_QUESTION_COVERAGE.md`（281 行）·
`build-data-gap-sheet.mjs`（216 行）一起删掉了 —— 一个报价单的提交，
顺手删了美工填写表和它的生成器，提交信息里一个字没提。

它们只在我本机磁盘上还在，所以我读得到；**别的 agent 早就读不到了**，
而 `HANDOFF.md` 一直在链接它们。这和上周 CAD 任务书指向 gitignore 的
`tmp/` 是同一类事故：文档指着一条别人没有的路径。

两条教训写在这里，不是写在 chat 里：
1. `git add` 只加明确路径 —— 批量 add 会把无关的删除一起带进提交。
2. HANDOFF 里的链接要能被 `git cat-file -e origin/main:<path>` 验证。

现在这份工作表和它的生成器都在这个提交里，可以验。

## 顺带修的一个真 bug

`src/data/search-suggestions.test.ts` 和 `scripts/enrich-product-specs.mjs` 读
`content/products` 时没有过滤 `.json`，目录下出现任何子目录都会 EISDIR 崩掉。
仓库里其他读取方（`subcategory-integrity.test.ts` / `catalogue-taxonomy.test.ts` /
`build-legacy-redirects.mjs`）本来就过滤了。已补齐。

触发它的是 `content/products/tmp/claude-quotation/preview2/` —— 三层空目录，
claude 前缀、我的，是某次 `mkdir -p` 相对路径搞错留下的，已删（空目录，无内容丢失）。

## 测试

`npm run lint` · `npm run typecheck` · `npm test`（151 通过）全绿。
**没有跑 build**：`out/` 是脏的，发布接力棒不在我手上；本次改动也不影响构建产物
（唯一的 `src/` 改动是一个测试文件）。

## 没碰的东西

工作树里 Codex 的在制品（events、category page、`translate-products-es.mjs` 的
尺寸规则扩展）· `out/` · `content/products/*.json` 本身。

## 下一步

1. 把 `SUPPLIER_WORKBOOK.html` 发给甲方转美工同事。填回来的文本我可以直接解析。
2. 数据回来后重跑 `npm run content:workbook`，表会自动变短。
3. 仍待办：tid 映射要人上服务器改 nginx · CAD 图纸提取（Codex/Kimi）· 西语长尾 274 行。
