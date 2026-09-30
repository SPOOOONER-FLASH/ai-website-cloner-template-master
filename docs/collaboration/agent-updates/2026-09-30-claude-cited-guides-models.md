# 2026-09-30 · Claude（文案）· 被 AI 引用最多的指南：一跳到产品

**起因**：W39 周报 P1（工程会话 09-30）。AI 只引用指南，不引用产品页。被引用最多的 10 篇，每篇都要能从文章一跳到具体型号。

## 做了什么

- 新增生成器 `scripts/audit-cited-guides-models.mjs`：
  - 默认读最新一期 Bing AIPageStats 导出，英西葡的引用按同一篇文章合并。
  - 按 `NewsDetail.tsx` 的规则判断每个型号能否显示：必须是 HYDE 记录，而且有照片。
  - 输出 `docs/copy/cited-guides-models.md`。
- 修改前：前 10 篇里 7 篇没有任何型号链接，而且这 7 篇正文一个型号都没点名。
- 修改后：还有 2 篇没有链接，都是有意暂缓（见下）。
- 新补 5 篇。每篇在最相关的段落后加一句，按产品页已公布的规格点名，再写入 `relatedModels`，文章的“Products mentioned”栏因此有了链接。三语和七语覆盖层都在同一位置插入，`sourceHash` 已更新；改动前这 5 篇在七个语种都是最新的。

| 指南 | 型号 | 依据的规格行 |
|---|---|---|
| strike-plates-and-keeps | 575 ABET、564 | Strike：57 mm 弧形唇，70 mm 可订；角形锁扣板，也有平板 |
| chrome-finish-differences | 70722 DC、65SN | Finish：Satin nickel (US15)；CP、SC |
| master-key-hierarchy-planning | 578 SSET、3431 SSET | Keying：可与我们的 deadbolt 同钥，或做主钥 |
| universal-vs-handed-hardware | 575 ABET、70722 DC | Handing：可完全换向；不分左右 |
| key-blanks-and-restricted-profiles | 65SN、70BK | Size / Material / Finish；钥匙槽形逐单确认（原文第 37 段） |

## 没动的

- `door-hardware-hs-codes-2026` 和 `door-preparation-161-and-86-2026` 在标题实验 E1 中，10-14 读数。读数前正文和修订日期都不动。这两篇正文目前也没点名型号，读数后再补。候选：161/86 用 5870（背距 60/70 mm）和 072（背距 65 mm、中心距 72 mm）。
- 三篇 E1 指南的西葡 seoTitle/seoDescription 没碰。
- 任务 #29 两个 0% 话题（送审文件、消防合规）：等工程会话导出这两个话题的提问原文（A5）。

## 测试

- `npm run content` 已跑，5 篇的修订戳已更新。
- `npm test` 通过。
- `i18n-lint` 通过。
- `stamp-article-revisions --check` 通过。
- `us-spelling` 通过。

## 请工程会话考虑

型号链接现在放在文章头部左栏。周报说的是“文末”，要不要在文末再放一份，属于版式，归工程会话或 Codex 决定。
