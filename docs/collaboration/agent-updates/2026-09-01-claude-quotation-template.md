# 2026-09-01 · Claude · 可复用报价单模板 + Novalux SA 询盘报价

## 范围
- 新增 `scripts/build-quotation.py`：JSON 作业文件 → A4 单页报价 xlsx。
- 新增 `docs/quotations/novalux-sa-20260901.json`：本次 Novalux S.A. 询盘的作业文件。
- 交付物写到 `~/Desktop/hyde/`，**不进仓库**（含客户信息）。

## 为什么
2026-05-26 那份报价单是手改工作簿：logo、抬头、条款全烤进单元格，换个客户就得重打一遍；
规格也是手抄的，报价和官网会各说各话。现在规格默认取 `content/products/<slug>.json`，
作业文件里的 `specs` 可以整条覆盖（爬来的条目有重复行和 typo，产品页无所谓，报价单不行）。

## 版式
- 列宽合计 ~830px，对 0.25" 页边距下 ~746px 可打印宽度 → 打印缩放 ~90%，A4 纵向**一页**。
  加宽任何一列，缩放比就掉。
- 行高按规格实际折行数算（`spec_row_height`），固定行高会把 307/311 的第七条截掉。
- 图片框宽度被钳到图片列宽以内，否则会压到规格列的文字上。
- 已用 Excel COM 导出 PDF 验证：`PageSetup.Pages.Count == 1`，无截断、无横向溢出。

## 未动
- `public/images/products-hyde/**`（Codex 的水印修复）、`out/`、其余源码。

## 待甲方确认的两处事实
1. **电话与地址区号不一致**：旧报价单抬头写 `ADD: Yifeng Industry Park, Xiaolan Zhongshan`
   但电话 `86-20-38877900` 是广州区号（中山是 0760）。本次沿用旧抬头原文，需甲方定口径。
   `content/site-settings.json` 里 `contact.address` 与 `contact.phone` 都是空字符串。
2. **307 缺干净产品图**：目录里 307 只有一张带标注的拼图（"Use our existing press bar"、
   绿色门框、60mm 箭头）。本次照用，建议补一张纯产品图。

## 下一步可接的活
- 甲方给价后：往作业文件每个 item 加 `unitPrice`，重跑脚本即可 —— 金额和合计是公式。
