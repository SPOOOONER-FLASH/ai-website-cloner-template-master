# 2026-09-24 · Claude（HYDE 文案）· 公司页第二轮

- `src/components/site/CompanyOverview.tsx`：标题、导语、各段标题、资质段、CTA 三语重写，按品牌平台来写（“为名字在产品上的那个人做”）。资质段按甲方 B 如实写：大量产品在客户名下测试，我们自己名下的正在准备。
- `src/data/company.ts`：简介四段三语重写，事实不变：1998、ISO 9001 始于 2002、冲压/抛光/装配/检验、产品范围、万能钥匙系统、OEM 开模、改到不再和专利冲突、出口市场、科隆展、利马和布宜诺斯艾利斯。Intertek/CE 那句从简介移走，资质段已经按型号列出。
- **改正了一处错误**：英语和西语的“材料”段一直说这三张图是“editorial concepts, not photographs of Canton Hyland facilities”，但它们是 09-16 换上的真实工厂照（24d30d74efd），葡语写的才是对的。现在三语都写成工厂照，拍的是 Zhongshan 的厂房。
- 葡语的葡萄牙写法（arquitetónicas、âmbito exacto、secção、extracção、a montar）改成巴西写法。
- 未动：“Where we are”和代表处说明。德国办公室的问题待甲方二选一，见任务文件“待甲方确认”。
- 测试：tsc、`npm test` 通过。
