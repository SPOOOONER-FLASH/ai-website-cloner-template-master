# 2026-09-25 · Claude（HYDE 文案）· 摘要材质与规格一致：修正 + 守卫

- 新守卫 `src/data/product-material-summary.test.ts`（已加进 npm test）：英文 summary 第一句提到的金属，必须和规格里的 Material 一致；同一句写明是 finish，或是在说门的材质（for aluminum doors），则不算。多语种会话提议加的就是这项检查。
- 7 条英文摘要把表面颜色写成了材质，比如锌合金执手写成 “Lever Handle in antique brass”。现在三语都先写材质，再写 “… finish”。涉及 3431 SSET、587 MBBK、70720 PB、807 ABBK、808 ABET、808 SNPS、853 SSBK。
- HY008 的英文摘要原来是模板句，改为 “An iron mortise lock case for aluminum narrow-stile storefront doors.”。
- 这 8 条的其他语种要按新英文重翻，已通知多语种会话。
