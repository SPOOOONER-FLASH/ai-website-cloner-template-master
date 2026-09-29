# Claude（HYDE 多语种线）· 2026-09-28 · 全栈 SEO / GEO 第一批

**范围**：甲方 09-28「全栈 seo geo aio aeo sxo 优化，出方案并执行；llms.txt、robots、alt、H1 H2；修死链、查 bug；长尾词」。
方案与基线表：`docs/collaboration/tasks/2026-09-28-seo-geo-full-stack.md`。只推源码；发布归 johns 机器的工程会话（AGENTS.md 09-28）。

## 基线先量（本地导出 7,694 页，九个审计生成器）

alt 缺失 0、h1 缺失 0、死链 0（787,148 内链 + 179,665 资源）、语义 SEO 错误 0、robots/llms.txt/IndexNow 齐全、11 种 JSON-LD。
外链 600 个去重：阿里巴巴、社媒、6 个展会站全部 200；LinkedIn 返回 999 是反爬不是死链。浏览器跑首页/品类/产品/配置器/查找器/型号查询/计算器/阿语页：控制台 0 错误、无 404。
**所以「补 alt 补 H1 修死链」这轮没有可修的。** 差的是可引用性（视频页 32 分、子类页 38–41）、品类页正文没有买家的商业词（4/15）和交易词（1/15）、买家问题 71 题未答。

## 改了什么（提交 721db0c57eb + 合并 59db7ae6c75）

1. 品类页「How buyers specify …」板块：`CategoryBuyingGuide.tsx` + `src/data/category-buying-guides.ts`（16 个品类，英西葡手写，买家搜索用语）+ `src/lib/category-facts.ts`（型号数、backset/门厚/中心距/行程/条长/循环/门宽/承重范围、材质/表面/功能清单，全部构建时算）。记录不够 3 条的句子整条不印。七语种 102 键七名写手合入。
2. 子类页 `CollectionNote.tsx`（H2 + OPTION_NOTES 定义）；视频页规格表 H2（197 页）；术语表 `definedTermSetSchema`（十语种）。
3. **bug**：`collection-spec-range.millimetres()` 对「35–55mm」「8-12mm」只取后一个数，子类页/品类页门厚范围一直少下限；`statedOn()` 七语种漏英文；`audit-seo-geo` 只读 /sitemap.xml 误报 5,456 页。
4. 测试：`src/lib/category-buying-guide.test.ts`（每品类有指南、十语种无残留占位符、尺寸型品类保留尺寸答案）。

## 与 QuickCreator 会话（1647b3d8ff0）的合并

对方同日在 en/es/pt 品类页挂了计算型「Choosing …」板块（`CategoryGuide.tsx` + `src/lib/category-guide.ts`，规格因子 + 先读文章 + 模板问答）。两块**互补不重复**：对方讲「范围内怎么选」，我讲「买家用什么词搜、尺寸怎么对、怎么下单」。
合并规则：同一页只留**一个 FAQPage**——`CategoryBuyingGuide withSchema={false}`，其问答通过 `CategoryGuide extraFaq` 并入对方的 FAQPage；es/pt 页补挂了我的板块。
**未做**：对方要求把 `CategoryGuide` 挂到七语种 `locale-pages/CategoryPage.tsx`。`category-guide.ts` 的 `copyFor()` 是 en/es/pt 三元、模板是函数值，七语种会直接印英文（本周刚清掉的那类洞）。要挂先把 `copyFor` 改成 `tx` 模板 + `fill()`（做法见 09-27 更新第 3 条），我下一批做。对方的 97 个新 ui 键（隐私政策、主钥匙层级图、BAU 表单、Choosing 文案）本次已切给七名写手翻译。

## 交接 / 待办

- **工程会话**：源码推完发「源码已推：<哈希>，要发布」；七语种短标题兜底已由其完成（ce809002491）。
- **甲方数据**（任务文件第四节）：GSC 最近 28 天导出、HS 编码、保修条款、每箱数量/毛重、备件政策、LinkedIn 公司页。
- 共享树里 `scripts/release-site.mjs`（+3 行）和 `PUSH-PENDING.md`（+4 行）有不知归属的本地改动，它们挡住了合并；工程会话确认不是它的。我把原文和 patch 存到 `tmp/claude-market/peer-edits/`，然后恢复到 origin 版本（origin 已含完整的 maxBuffer 修复）。谁认领谁去 tmp 里取。

## 测试

tsc 0；node --test：category-guide、category-buying-guide、collection-spec-range、us-spelling、i18n、first-touch 全过；i18n-lint 干净；scaffold --check、client-ui --check 通过。构建与九个审计在提交后重跑，结果写回任务文件。
