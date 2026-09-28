# 2026-09-28 · Claude（云端线程）· 铜合页说明、主钥匙层级图、规格 PDF；HowTo 核对

来源：甲方 09-28 清单「合页品类页的 copper hinge 说明、主钥匙文章的真实层级图表、每款产品单页规格 PDF、HowTo 结构化数据」。

**铜合页说明**：`/products/brass-steel-hinges/`（及 es/pt）summary 下加一段「Looking for a copper hinge?」，链到 copper-or-brass-hinges-2026 指南。黄铜型号从 `material` 读出（今天是 B024、B025），不手写。`src/data/category-notes.ts` + `CategoryNote.tsx`；`category-notes.test.ts` 核对「其余合页是不锈钢/铁/锌合金」且不出现 pure copper。简报表「合页品类页描述：待写」可改为已做。

**主钥匙层级图**：`MasterKeyHierarchyFigure.tsx`，插在指南第一张表（层级表）之后。只画正文说过的东西：GGMK（虚线，可选）→ GMK → 两个楼层 MK → 房门；一扇交叉钥匙门、一扇不上任何主钥匙的门、一个预留组。无平台、销位、容量数字，图注写明「示意」。`ArticleBody` 加了可选 `figure` 参数。

**规格 PDF**：`npm run spec-sheets`（`scripts/build_spec_sheets.py`，复用 build_catalogue.py 的筛选与版式）。283 款生成，305 款不生成，原因与每份 PDF 缺什么都在 `docs/research/spec-sheet-gaps.md`：220 款规格行不足 3 行、67 款无照片、13 款型号未确认、5 款无目录裁切图。已生成的 PDF 里：全部缺「每个表面处理的订货代码」，216 份缺孔位，160 份缺表面代码，33 份缺外形尺寸，均在 PDF 上印成「Confirm on order」。产品页（en/es/pt）有下载链接；`spec-sheets.test.ts` 保证清单与文件一致。PDF 只有英文。

**HowTo**：09-28 #82 已上线（fitting-a-euro-cylinder）。重新检索 82 篇，仍只有这一篇是逐步写法，没有新增。

**给多语种会话**：七语种的铜合页说明、层级图、PDF 链接目前不渲染（不放英文进译文页）。要开：在 `category-notes.ts`、`MasterKeyHierarchyFigure.tsx` 的 LABELS、`ProductSpecSheetLink.tsx` 的 LABEL 加语种即可。

**风险**：生成器把当天日期印进 PDF，重跑会改动全部 283 个文件（约 7.6 MB），只在产品数据变了时再跑。`npm run check` 结果见 PR。out/ 未动，发布归 johns 机器。
