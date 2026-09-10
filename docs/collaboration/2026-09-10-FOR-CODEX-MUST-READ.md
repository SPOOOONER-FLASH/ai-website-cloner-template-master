# ⚠ 给 Codex：必读（2026-09-10）

甲方指定这份要你**一定要看**。四件事，前两件是你的工作被否掉了，第三件是你正在
让 `npm test` 变红，第四件是我改了目录结构你需要知道。

---

## 一、甲方老板当场否掉了 AI 生成的产品图（2026-09-10 凌晨）

微信原文，逐条：

> 这个柠手咋回事？这样在使用中不合规范，转动门时不合适
> 这个也变形
> 不清晰，你就美工把他的3个图放一起。
> **你也可以慢慢学习了解产品，修图，不一味靠AI，Ai解决不了这些问题**
> 还有产品审美，这个都是很重要的。要让买家一眼看到就是真正值得信任，可以下订单的
> **网页外观做得好，但是内容虚假，别人看到不可靠是不会把钱从自己口袋掏出来的**
> 你自己用自己的想法，你会不会去买一双你在网上看到没有细节，或者细节不对的鞋子。。
> 一看就是假货的鞋子你买不买？
> **金属比鞋子要求更高，金属错了无法改，无法安装，鞋子错了还成支撑还能对付穿**
> 自己带着这个想法做事，让买家看到你的专业和特殊还有技术性，你就可以接单了

### 这次被否的具体缺陷

1. **执手（柠手）形状不对** —— 「使用中不合规范，转动门时不合适」。
   这是**功能性错误**，不是审美问题：那个形状转不动门。
2. **变形** —— 生成的零件比例不对。
3. **不清晰**。

### 甲方给的替代方案，请照做

> **「不清晰，你就美工把他的 3 个图放一起。」**

**不要重新生成，把三张真实照片美工合成一张。** 这正是 `AGENTS.md` 里已经写死的
「允许做的事」：*Composing real photographs into an overview, at true relative scale,
on one field*。

### 这不是新规矩，是 2026-09-04 那条规矩的第二次触发

`AGENTS.md`「Never generate an imagined metal product. Ever.」整节就是上一次同样的
否决写下来的。这次的新信息是**具体缺陷类型**：执手轮廓错误会让门转不动。请把这一条
加进你自己的检查清单。

**发图前的那一问没变**：买家能拿着这张图去车间下单吗？需要任何前提，就不发。

---

## 二、`npm test` 现在因为你的三处未提交改动而红

我这边 233 条测试跑下来 **230 通过 / 3 失败**，三条都在你的工作里，我没有碰：

| 失败的测试 | 原因 | 怎么修 |
|---|---|---|
| `legacy underline utilities cannot recreate the double-line interaction` | `src/components/rayen/Chrome.tsx` 里有 `hover:underline` | 改成 `hover:short-marker short-marker-compact`。全仓库禁用 underline 系工具类，站点只有一个共享交互标记 |
| `all catalogue category tiles ship with a real cover image` | 新类目 `flip-up-grab-bars` 没有封面图 | 补一张封面图 |
| `every category and sub-category the configurator can offer has a definition` | `flip-up-grab-bars` 在配置器里会显示成裸 slug | 在类目定义里补说明文案 |

第三条还有个连带效果：那个类目**产品数是 0**，所以 `/compare/flip-up-grab-bars/`
是一个空的对比页，没有 h1 —— Bing 的「缺少 h1」报告里就有它。

---

## 三、我改了逃生器械类目里 16 个记录的名字和网址

**如果你有任何硬编码引用这些 slug 的地方，会断。**

| 旧 | 新 |
|---|---|
| `001/015/023-et/023-ps/026/027/028/030/033/035/037/039/9080e/x2-panic-exit-device` | 同前缀 + `-trim` |
| `72-panic-exit-device` | `072-panic-exit-device-lock-case`（型号也从 `72` 改为 `072`） |

**为什么改**：这 46 条记录里有 18 条的 `Type` 行说自己不是推杠 —— 16 个外执手、
1 个锁体。307 规格行点名的三件配件（015 执手、9080E 执手、072 锁体）全在这批里，
所以整套配套关系一直在目录里却看不见。

全部留了 301。`content/i18n/zh-terms.json` 里我补了 `逃生推杠外装置`、`逃生推杠锁体`
两个品名，以及 18 个规格标签的中文（其中 9 个是你新加的洁具/玻璃产品带出来的 ——
`content/**` 是我的区域且当时文件是干净的，就一次补齐了）。

`scripts/rename-product-slug.mjs` 有个 bug 我修了：`retarget()` 会把含旧 slug 的字符串
全部重写，而它作用在一个 slug 已设成新值的对象上，**新 slug 以旧 slug 为前缀时新值
自己也被重写**（`...-trim` → `...-trim-trim`）。你以后用这个脚本不会再中。

---

## 四、场景图清单有变化：072 找到了，配套关系可以画了

`2026-09-09-top20-image-brief.md` 里我写过「072 在目录里没有产品记录」——**那是我错了**。
它一直在，型号写作 `72`，名字叫 `Panic Exit Device`，有主图、4 张图库、1 个视频。

**所以第 1 组（307 全套）现在四件齐了**，全部是真实照片，不需要生成任何东西：

| 件 | 型号 | 素材 |
|---|---|---|
| 推杠 | 307 | 有图 + 视频 |
| 外执手 | 035（或 015 / 9080E） | 有图 |
| 锁芯 | 欧规，长度按门厚 | 有图 |
| **锁体** | **072**（中心距 72mm，backset 65mm，方轴 9×9×130mm，防火版两个葫芦孔） | **有图 + 视频** |

甲方 2026-09-09 补充：**311 有 72 和 92 两个中心距**，已写进 311 的规格行。

按甲方这次的指示，**这一组用真实照片合成，不要生成**。

---

## 五、我今天做的其他改动（避免你重复劳动）

| 改动 | 文件 |
|---|---|
| BHMA/US 表面码映射（517 条里 77 条拿到号），进产品 FAQ 与 FAQPage 结构化数据 | `src/lib/bhma-finish.ts` + 测试 + `scripts/audit-bhma-finishes.mjs` |
| 视频 `uploadDate` 加时区（Google 报了两个错，191 个视频 0 个被索引） | `src/lib/upload-date.ts` + 测试，接进 `JsonLd.tsx` 与 `sitemap.ts` |
| Bing 六项发现的复现审计 | `scripts/audit-bing-findings.mjs` |
| nginx 301 规则从 16 条重新生成到 48 条（**需要甲方在服务器上 reload**） | `deploy/nginx/taxonomy-redirects.conf`、`CLIENT-RUNBOOK.md` 第 1a 节 |
| 竞品认证对照（Von Duprin / Yale / Cal-Royal / Detex / Klacci） | `docs/research/competitor-certifications.json` + 生成器 |
| 北美 GTM 与买家视角对比（Trudoor / Precision / I Dig Hardware） | `docs/collaboration/2026-09-10-gtm-north-america.md` |

**下一个最该你做的**：第 1 组（307 全套）的实物合成图，以及 `flip-up-grab-bars`
的封面图 + 配置器定义（让测试回到全绿）。
