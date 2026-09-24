# 四个数据看板：在哪、谁看、怎么共享（所有会话必读）

> 甲方 2026-09-24：「clarity ga4 那四个数据看板集群，所有 chat 都看得见，共享」
> 「数据看板集群本身和分析的结果也要共享通知所有人」。

**会话登录不了看板，所以共享靠 git**：甲方导出 CSV → 任何会话跑一条命令 → 原始数据、报告和结论进仓库 →
每个会话开工时读 `docs/research/analytics/LATEST.md`。做 SEO、文案、产品页、多语种之前，先读本期结论。

## 四个看板

| 看板 | 账号 / ID | 回答什么问题 | 导出什么 |
|---|---|---|---|
| Google Search Console | cantonlock.com | Google 上谁看见了我们、点没点、搜的什么词；AI 概览里出现几次 | 效果 → 近 3 个月 → 导出（查询、网页、国家、设备）；「生成式 AI 功能」同样导出 |
| Bing Webmaster | cantonlock.com | Bing 搜索词和页面；**ChatGPT / Copilot 引用了我们哪一页**（ChatGPT 用 Bing 的索引） | 关键字报告、页面流量、AI 表现（AIPageStats、AISearchQueries） |
| Microsoft Clarity | 项目 hyde（`y8utyrgvv0`） | 真人怎么看页面：滚动深度、死点击、怒点、JS 错误、录像；AI 爬虫与机器人流量 | 仪表板 → 导出；Bot / AI 可见性两页各导出一次 |
| GA4 | 账号「hyde数据看板」/ 媒体资源 cantonlock（`G-RBTE7KF82P`） | 来源、国家、语言、着陆页、事件（询盘 `generate_lead`、阅读深度等） | 报告 → 各页右上角分享 → 下载 CSV |

GTM（`GTM-MQHHPGJL`）是装载器，不是看板；GA4 和 Clarity 由网站代码直接加载，GTM 里不要再加这两个。

## 怎么更新（每周一次，建议周一）

1. 甲方：把四个看板的 CSV 导进一个文件夹，比如 `Downloads\SEOGEO 1001`。
2. 任何会话：
   ```bash
   node scripts/build-analytics-report.mjs "C:/Users/johns/Downloads/SEOGEO 1001" --date 2026-10-01
   node scripts/build-query-corpus.mjs "C:/Users/johns/Downloads/SEOGEO 1001"
   ```
   前一条把原始 CSV 复制进 `docs/research/analytics/<日期>/raw/`，生成 `REPORT.md`（第一张表就是
   「被看见没被点击」的机会清单），并更新 `LATEST.md`；后一条更新买家查询语料。
3. 同一会话：在下面「本期结论」写三到六条结论（带日期、带数字出处），提交，`npm run ship`，
   然后**通知所有会话**（Claude Desktop 里用 SendMessage 发给每个活跃会话，一句话 + 本文件路径）。

以后如果甲方愿意，可以换成 API 自动拉取（Clarity 数据导出令牌、GSC / GA4 服务账号）。那需要甲方自己在
各后台生成凭据、放在本机 `.env` 里，**永远不进 git**。在此之前，CSV 这条路已经够用。

## 本期结论（数据 2026-06-24 → 09-22，写于 2026-09-24）

1. **GA4 的「用户数」大部分不是买家。** 中国 1,884、新加坡 1,396 个活跃用户（广州、深圳、珠海、新加坡），
   英语会话的互动率只有 6.9%。真正有意义的来源很少：Google 自然搜索 49 次会话、ChatGPT 31 次、
   **BAU 慕尼黑展商页 51 次会话、互动 49 次**，是所有来源里质量最高的一个。报数字时用「感兴趣的会话」，不用「用户数」。
2. **Google 上最大的浪费是被看见不被点击**：主钥匙文章 243 次展示 0 点击（09-24 已改标题），
   合页、闭门器、夜锁三个品类页各 36–79 次展示 0 点击（09-24 已改标题）。10-08 前后复查。
3. **AI 引用集中在「A vs B」和查表类文章**：Bing 记录 ChatGPT 类引用最多的是推杠 vs 触杆（44 次）、
   美标表面代码（20 次）。继续写对比文和查表文，是被 AI 引用的最短路径。
4. **展示量按国家**：美国 721、印度 153、菲律宾 92、英国 71、越南 69、巴西 65、西班牙 60、澳大利亚 54、
   墨西哥 39；德国 28、沙特 21、土耳其 19、阿联酋 17、法国 17、日本 16、韩国 14。多语种顺序据此排
   （`docs/collaboration/2026-09-24-language-expansion-prep.md`）。
5. **询盘事件 09-22 起才有**：之前表单用 fetch 提交，GA4 看不到，所以这期数据里没有询盘。`generate_lead` 甲方 09-22 已标为关键事件。
   09-24 起加了阅读深度、阅读方式（skim / read）、产品点击、联系点击事件（CLIENT-RUNBOOK ③ 登记维度后下期可见），
   Clarity 录像可按 `read_style` 标签筛选。
6. **旧站 URL 仍在 Google 里有展示**（`index.php?m=home&c=View&a=index&aid=1605` 71 次，
   `tid=131` 63 次）。09-24 实测：都 301 到对应新页（aid=1605 → 316-S，tid=131 → 合页品类，tid=89 → 公司，tid=91 → 联系）。

| 期 | 报告 | 结论写于 |
|---|---|---|
| 2026-09-22 | [REPORT](../research/analytics/2026-09-22/REPORT.md) | 2026-09-24 |
