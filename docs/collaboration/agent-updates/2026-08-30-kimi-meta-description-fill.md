# kimi — 全站 meta description 补足（Bing「过短描述」清零）

| | |
|---|---|
| 范围 | 14 个页面源文件 + 3 个项目 JSON + Project 类型 + 两个类目页模板 |
| 结果 | 构建 938 页；审计 0 semantic / 0 quality；描述长度 min 121 / p50 150 / max 165 |
| 未动 | 任何可见正文（项目页可见 intro 仍是 summaryEs，未被改动）；`package.json` 未提交（其中 cc/cx 的 stahlock-cited-policy 测试注册仍属未暂存状态） |
| 风险 | 低：仅 meta description 与类目页描述回退逻辑；事实全部摘自站内已发布文案 |

## 背景

Bing 站长工具报「描述过短 ×17」（数据为 8/27 旧抓取）。本地复扫 `out/` 发现 25 个真实页面描述 < 120 字符，分两类：

1. **类目页回退裸 summary**：类目描述模板是 `{summary} {N} models manufactured in Guangdong, China and exported to over thirty markets.`，超过 165 字符预算时回退为裸 summary。en 有 2 个类目（knob-locks、panic-exit-devices）、es 有 6 个类目（西语 tail 更长，回退更多）中招。
2. **手工文案页**：company/contact/downloads/certifications/events/projects/argentina-ar4/es 首页等，描述本身就 74–118 字符。

## 改动

### 类目页（治本，修模板）

- `src/app/(en)/products/[category]/page.tsx`、`src/app/es/products/[category]/page.tsx`：
  回退链从 `full → summary` 改为 `full → compact → summary`。
  紧凑尾缀：en `{N} models made in Guangdong, China.` / es `{N} modelos fabricados en Guangdong, China.`
  保留「Guangdong 制造」这个站级事实，只是去掉出口市场从句。

### 手工页（逐条起草，事实仅取自站内已发布文案）

每条的增量事实来源：

- company（en/es）：ISO 9001 since 2002、OEM —— 出自 `src/data/company.ts` profile/stats（客户 2026-08-15 批准的英文简介 + 阿里店铺数字）。
- contact（en/es）：door type/finish/standard/quantity/destination —— 出自该页正文第二段原文。
- downloads：46 页目录、覆盖品类 —— 出自 contact 页「Current product catalogue」一节原文。
- certifications：Intertek 报告 + CE 符合性（panic exit devices）—— 出自 `src/data/company.ts` profile 第二段。
- events：buyer meeting —— 出自该页正文（"a planned visit or buyer meeting"）。
- projects 索引：每项研究列出确切型号 —— 出自 Project.productModels 的既定设计。
- argentina-ar4（en/es）：四个型号 AR4-110/140/101/1121 —— 出自页面 `models` 常量。
- es 首页：ISO 9001 desde 2002、OEM en Guangdong —— 同 company 来源。

### 项目详情页

- `content/projects/*.json`：改写 `seoDescription`（en，本就只用于元数据、不可见），新增 `seoDescriptionEs`。
- `src/data/types.ts`：Project 增加可选 `seoTitleEs`/`seoDescriptionEs`。
- `src/app/es/projects/[slug]/page.tsx`：描述取值改为 `seoDescriptionEs ?? summaryEs ?? summary`——**可见 intro（summaryEs）不动**，只改 SERP 文案。

## 验证

- lint / typecheck / 107 项单测 / build / test:export / predeploy-check 全绿。
- 复扫 `out/**/index.html`：描述 < 120 字符的页面只剩 /admin（无描述属设计）、/404、/_not-found。
- `audit-seo.mjs`：938 页，0 semantic issues，0 editorial quality warnings；description length min 121 / p50 150 / p90 162 / max 165。

## 后续

- Bing 面板的「描述过短 / 内容过少 / 相同标题」均基于 8/27 旧抓取，本次推送 + IndexNow 复提后等重抓再核对。
- Bing 站长工具里挂了两个多余 sitemap 变体（http:// 与 www 主机名），建议删掉，只留 `https://cantonlock.com/sitemap.xml`。
- 部署后记得清 Cloudflare 缓存（Edge TTL 2h）。
