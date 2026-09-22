# 2026-09-22 Claude — SEO/GEO 两个月复盘：生成器 + 报告

**Agent:** Claude
**Scope:** `scripts/build-seo-geo-report.mjs`(新)、`docs/research/SEO-GEO-DIGEST-2026-09-22.md`(新)、`docs/research/SEO-GEO-REVIEW-2026-09-22.md`(新)、`scripts/build-client-runbook-docx.mjs`(泛化)、`package.json`。未动 `content/`、`out/`、`out-rayen/`。

## 做了什么

客户给了 `SEOGEO 922` 目录:33 个文件(30 CSV + 1 PDF + 2 ZIP),解开后 **42 张 CSV 表**,归成 **14 份可分析报告**,覆盖 Search Console / Bing / Clarity / GA4 四个平台。

按 AGENTS.md「写生成器,不要写输出」,先写 `scripts/build-seo-geo-report.mjs`:
读导出目录 → 写 `docs/research/SEO-GEO-DIGEST-<日期>.md`。**数字全部可重跑**,
下次导出再跑一遍就能直接对比。分析不在脚本里,脚本只负责取准数字。

然后基于摘要写 `SEO-GEO-REVIEW-2026-09-22.md`:每份报告一段 insight + reflection,
最后是 7/26–9/22 的总结。

## 头条数字(上线 8/31,前后各 22 天对称窗口)

| | 上线前 | 上线后 | 倍数 |
|---|---|---|---|
| GSC 展示 | 272(12.4/天) | **1,520(76.0/天)** | **×6.1** |
| GSC 点击 | 17 | 35 | ×2.3 |
| AI Overview 展示 | 31 | **175** | **×6.2** |

逐周展示 82 →(上线)→ 256 → 541 → **723**,三周连涨未见顶。最近 7 天日均 90.4,
是上线前 7 天的 **7.7 倍**。

GEO 侧:Clarity 权威份额 **32.11%**(184 引用 vs 其他域名 389);Bing AI 引用
**191 次 / 34 个页面**;ChatGPT 带来 **31 次会话**,是 Bing 自然搜索的 2.5 倍;
OpenAI 抓取/引流比 **4:1**。

## 报告里最该被记住的三条

**1. 关键事件数全站 = 0。** GA4 没配任何转化,`form_start` 有 26 次、11 个用户,
但没有下文。**我们把流量做上去了,没有在测量成交。** 报告里所有「哪个渠道更好」
的结论都只能用互动时长和感兴趣会话占比做代理,这一点在报告里写明了,没有假装
我们知道。这是目前最大的窟窿,半小时能修。

**2. 展示 ×6.1 而点击只 ×2.3,差距全在搜索结果页那两行字上。** 型号查询
(fb005 / bh28 / 564mb / fb001.c / d102…)排 3–8 名**全部零点击**;
`patch fitting` 排第 1 名零点击;`master keying system chart` 153 次展示零点击 ——
那个查询要的是一张图表,而我们那篇文章里没有图表。**这不是排名问题,是标题问题。**

**3. 首页被算成两个页面。** `www.cantonlock.com/`(31 点击/206 展示)和
`cantonlock.com/`(19/101)各自独立排名。合并是一次配置,不花内容成本,
但它作用在已有的 1,520 次展示上。

## 一条对我自己的批评

GA4 的「3,657 用户」是**被污染的**:新加坡 1,396 个用户平均互动 **0.15 秒**,
中国 1,884 个里也有大量机器。真实受众是美国 139 个用户、平均互动 182 秒。
我此前一直拿 GA4 总量做背景判断。今后任何 GA4 数字在剔除机器流量前不该进决策。

## 顺带

`build-client-runbook-docx.mjs` 加了 `--src`,输出文件名跟源文件走 ——
交给客户的不只有操作手册了。已生成两份到 `Desktop\hyde\`。

新 npm 脚本:`seo:digest`、`report:docx`。

## 测试

```
npm test        353 passed, exit 0
eslint 两个脚本  exit 0
seo:digest      42 CSV / 84 张表,生成 712 行摘要
```

## 下一步(报告里的四件事,按顺序)

1. GA4 配关键事件 —— 先把尺子装上
2. 改标题模板 + 合并 www/非 www —— 作用在已有展示上,不产出新内容
3. 下一批内容写「A vs B」而不是「什么是 A」(被引最多的一篇占全部引用 23%)
4. **第二批 20 篇 guides 已写完但未部署**(`/guides/qualifying-a-hardware-supplier-2026/` 目前 404),发出去后两周重跑 `seo:digest` 对比 SoA
