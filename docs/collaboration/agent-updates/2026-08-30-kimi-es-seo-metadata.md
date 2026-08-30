# kimi — 西语 SEO 元数据生成 + es 类目页超长标题修复

| | |
|---|---|
| 范围 | `scripts/generate-product-seo.mjs`（+西语生成）、`src/data/types.ts`（+2 可选字段）、`src/app/es/products/[category]/[slug]/page.tsx`（用生成字段）、`src/app/es/products/[category]/page.tsx`（标题预算）、`content/products/*.json`（435 条回填）、`out/` |
| 结果 | 审计质量警告 **284 → 0**；短描述 382 → 17（剩的都是手工文案页）；重复标题 5 组 → 3 组（剩的全是 door-hinges 301 桩页，线上本来就 301） |
| 测试 | 104 单测 + 25 导出审计 + lint/typecheck 全绿；predeploy-check 通过 |
| 纪律 | 零虚构：每个字段来自产品已有数据；西语词全部走 `es-glossary.ts`，无词条则整句跳过 |

## 做了什么

**1. `generate-product-seo.mjs` 增加西语生成**（与英文同规则、同窗执行）
- 新增写入 `seoTitleEs` / `seoDescriptionEs`，词汇走 `es-glossary.ts`（文本解析，同 `translate-products-es.mjs`）
- 标题候选：`{model} {nameEs} — {材料es}` → `— {类目es}` → 裸头；**modelTbc 产品改用 `nameEs — model`**：
  它的 model 是英文描述符不是订货号，但它是唯一区分词——之前 4 个 modelTbc 产品共享 2 个重复标题
  （"Cerraduras de pomo" × 2、"Manijas de palanca" × 2）
- 描述：品牌+型号+名称+材料+表面处理+门型 + 西语版收尾（"Fabricado en Guangdong…"）；材料/门型小写化
- 效果：西语描述中位数 **59 → 151 字符**，无一条 <110

**2. es 产品页 `generateMetadata`** 优先读生成字段，旧逻辑留作回退

**3. es 类目页标题**：`{name} — Fabricante y proveedor` 仅当连同品牌后缀 ≤62 字符才保留，
否则只用类目名——修掉 7 条超长警告（西语类目名最长 36 字符，加修饰必爆）

## 关联 Bing 五项建议的处置

| Bing 建议 | 状态 |
|---|---|
| Set up IndexNow | ✅ 本次 930 条全量提交 200 OK（key 文件在线验证过） |
| Meta descriptions too short | ✅ 382 → 17，剩 `/contact/` `/es/` 等手工文案页（编辑活，不建议模板代写） |
| Identical titles | ✅ 真重复 2 组已消除；剩 3 组是 door-hinges 301 桩页，线上 301 无实际影响 |
| Page titles too short | ✅ 137 → 53，剩的是无材料记录的产品（数据空就是空，等 stahlock 映射或甲方数据后自动变长） |
| Inbound links | ➖ 站外事项：阿里店铺互链、行业目录收录，需甲方/运营动作 |
