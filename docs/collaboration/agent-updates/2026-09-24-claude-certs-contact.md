# 2026-09-24 · Claude（HYDE 文案）· 资质页、联系页第二轮

- 资质页（`src/app/{(en),es,pt}/certifications/page.tsx`）：
  - H1 改为“Certificates and test reports. What is tested, and in whose name.”，西语、葡语同一结构。
  - 小字、每条记录的说明、结尾段改成直说。报告为什么不公开扫描件，原因写明：发证方限制复制，所以按型号整份发送。
  - 导语是 09-24 第一轮写的，这次没动。
- 联系页（三语）：H1 “Contact the factory. Talk to the people who make it.”；导语写明工程师亲自读邮件，语言是英语或西语；第二段改成“告诉我们门型、表面处理、标准、数量和目的市场，第一封回信就能帮上忙”。
- 测试：tsc、`npm test` 通过。页面 metadata 未动。
