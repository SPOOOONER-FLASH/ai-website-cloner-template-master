# Claude — 撤下不能发的认证材料 · CMS 接线

⚠ 本次是合规修复，不是优化。已上线的内容里有**不属于我们的证书**和**不存在的认证标记**。

## 逐份核对四份证书（我打开原图看了）

| 文件 | Applicant | Trade Mark | Manufacturer | 结论 |
|---|---|---|---|---|
| Intertek EN 1125 · KD070/30-290 | **CANTON HYLAND** | **HYLAND** | CANTON HYLAND | 是我们自己的 |
| Intertek EN 1154 地弹簧 · KD070/20-101 | **KALE KILIT VE KALIP SANAYI A.S**（伊斯坦布尔） | **KALE ARCO** | CANTON HYLAND | **是客户的，已删除** |
| Intertek 607 SS ET 耐久 | Rendered to CANTON HYLAND | — | — | 是我们自己的 |
| CELAB CE · EN 1125:2008 | CANTON HYLAND | — | — | 是我们自己的 |

**甲方微信说「EN1125 是 KALE 的型号」这一句不准确**：EN 1125 那份的 applicant、manufacturer、
trade mark 三栏都是 Canton Hyland / HYLAND，是我们自己的资质。KALE 的是**地弹簧那份 EN 1154**。
按微信原话把 EN 1125 一起撤掉会白白丢掉一份真资质，所以我按原件处理，没有照单执行。

## 做了什么

1. **KALE 那份彻底删除** —— 数据、下载条目、图片文件（客户机密，不该出现在我们站上）。
2. **另外三份停止公开下载，只保留文字记录**（标准 / 签发机构 / 报告编号 / 型号 / 日期）。
   原因是 Intertek 报告正文写着：*"Only the Client is authorized to permit copying or
   distribution of this report and then only in its entirety"*，以及用 Intertek 名称做广告
   需要其**书面批准**。我们之前公开的是 13 页报告里的**第 1 页**，两条都踩了。
   陈述"我们持有报告 130722068GZU-001"不是再分发，可以留。
   `CertificateRecord.publish` 改成 true 即可恢复，等拿到书面许可。
3. **首页那个 ANSI / BHMA / GRADE 3 徽标删了**。甲方明确说「BHMA 没有」，
   而首页一直在渲染这个认证标记——这是页面能做出的最强声明，背后什么都没有。
4. 产品 `ANSI Grade 3 Keyed Deadbolt` 改名为 `Keyed Deadbolt Lock Set`，
   清掉 certifications、seoTitle、seoDescription、图片 alt、分类页 alt、项目页引用。
   CMS 里"例如 ISO 9001、ANSI Grade 3"的填写提示也改了——那是在教编辑填不存在的认证。
5. FAQ 那条答案原本写"我们公开每一份报告"，现在已经不公开了，改为按型号索取。
6. ISO 9001 全部保留，甲方没有否认，2002 年至今。

⚠ **slug 仍是 `/products/deadbolts/ansi-grade-3-keyed-deadbolt-lock-set/`**。改 URL 需要
配套 nginx 301，只能在服务器上做，没有 301 就直接 404，比 URL 里留个词更糟。**待办**。

## 顺带修好了分类与下载的 CMS 接线

`src/data/{categories,downloads}.ts` 原本各自硬编码一份数组，编辑在 Decap 里保存
只改了 `content/*.json`，前台读的是数组——所以后台改了不生效。改成和 `faq.ts` 一样
直接 import JSON。

**两边已经漂移了**：`lock-cylinders` 与 `sliding-hook-locks` 两个分类的图片只存在于 TS 里，
JSON 里是空的。切换前已把 TS 的内容同步回 JSON，否则一切换这两张图就没了。

这个 bug 今天被我自己撞上：改 `content/categories.json` 里的 alt 文字，构建产物纹丝不动。

## 验证

`npm run check` 通过（23 测试 / 472 页 / 0 semantic issue）。
`grep -rl "ANSI\|BHMA" out/` 返回空。`out/images/certificates/` 已不存在。
