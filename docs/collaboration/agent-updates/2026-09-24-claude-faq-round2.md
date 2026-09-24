# 2026-09-24 · Claude（HYDE 文案）· FAQ 第二轮

- `content/faq.json`，三语同步改：
  - “Do you export worldwide?”：原文写 floor springs（地弹簧只有 RAYEN 在卖）和 “more than thirty export markets”（未经核实，首页 09-24 已删）。改成甲方给的市场：欧洲、俄罗斯、南北美、土耳其、东南亚，并说明大量产品以客户品牌销售。
  - “Where are your products manufactured?”：补上中山和小榄（新华社：约占全国锁具出口三成）。
  - OEM：补专利改型（甲方 A），措辞是“改到不再冲突”，不说“保证不侵权”。英语 customers' 的撇号补上；葡语“envase”改成“acondicionamento”。
  - EN 1125：补一句自己名下测试的现状（甲方 B）。
  - 英式拼写 specialism、despatch 改为 specialty、dispatch。
- FAQ 里已有起订量（300–5,000 件）和交期（30 天起），服务页可以直接引用，不必再等甲方给数字。见任务文件。
- 测试：`npm test` 通过。

## 同一轮：服务页补数字

- `src/components/site/ServicesView.tsx` 三语：服务 01（开模）补“开模费和最小批量按零件报价；标准型号多数起订 300–5,000 件”；服务 04（样品）补“样品收费，从首个生产订单扣回；有库存的型号通常几天内发出”。数字全部来自 FAQ，没有新数字。
