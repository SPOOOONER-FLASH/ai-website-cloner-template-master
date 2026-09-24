# HYDE 三语文案：B 端方向、转化和逐篇改写（2026-09-24，Claude）

甲方 09-24：
- 「老板说的“让买家睡得安稳”是让买家认为我们工厂专业、资深，OEM 质量好、价格合适……不是消费端晚上不会进贼」
- 「我们实际上是 B2B……主要是做 OEM 贴牌」
- 「D2 交给你，开始逐篇改写，西语葡语，把文档改过来，由你负责而不是 codex，codex 以后只负责生图和视觉」

方向和真实买家：[`docs/copy/style-guides/README.md`](../../copy/style-guides/README.md)。分工：AGENTS.md「Who owns what」和 `2026-09-24-division-of-labour.md`（09-24 已改）。

## 一、对今早“ChatGPT 为什么把人送到具体产品页”那份分析的意见

**同意**它的四条：先补被 AI 引流的产品页；继续写横评；补齐 7 个采购问题的答案；每次发布后跑 IndexNow（这条归工程会话）。
**再加五条**，全部来自 Serraller 和 SAGA 真实问过的问题：

| # | 做什么 | 为什么 | 缺什么 |
|---|---|---|---|
| A | **一页 OEM / 贴牌说明**（英西葡三语）：能换什么（标签、说明书语种、包装、颜色、方轴 8 或 9 mm），不能换什么，起订量，打样流程 | Serraller 第一封信问的全是这些；这页是询盘前的最后一步 | 甲方给清单：哪些能定制、起订量、打样周期 |
| B | **如实写认证现状** | 他问“有没有有效的 CE”。答得含糊，比坦白说“测试报告在客户名下，我们自己名下的正在做”更伤信任 | **甲方定对外措辞**，这一条不能由我起草了就上线 |
| C | **写明交易路径**：阿里巴巴平台或直接交易 | Serraller 是阿里巴巴老客户，平台担保能降低第一单的风险 | 甲方确认可以公开写 |
| D | **双开防火门成套配置**文章（推杠 + 执手 + 顺序器 + 闭门器），三语，直接链到型号 | Serraller 的 7 项订单就是这一套 | 无，用现有型号就能写 |
| E | **葡语 NBR 11742 / AVCB 解释文**：讲清验收查什么，不声称我们的产品符合 | SAGA 的日常工作就围绕这两个词 | 无 |

## 二、逐篇改写（西语、葡语）

**顺序**：先改和真实买家相关的，再按 Search Console 的机会清单改。每批 3 篇，改完推送一批。

| 批次 | 文章 | 为什么先改 |
|---|---|---|
| 1 | `news/door-coordinator-double-fire-door`、`news/push-bar-or-touch-bar-panic-exit-devices`、`guides/spindle-sizes-and-length-2026` | Serraller 订的正是推杠和顺序器，问的正是方轴尺寸 |
| 2 | `guides/en-1125-vs-en-179-2026`、`guides/fire-door-hardware-what-must-be-rated-2026`、`news/trim-handle-or-panic-bar` | 西班牙和巴西的防火门买家 |
| 3 | `news/master-key-systems-how-many-levels-you-need`、`news/mortise-lock-backset-and-centre-distance-guide`、`guides/mortise-lock-case-comparison-2026` | 机会清单第一名（243 次展示），以及被 AI 引用的 LC04 相关页 |
| 之后 | 其余文章按机会清单，每周重排一次 | |

**每篇的改法**：

1. 读英文，弄清每段在说什么。
2. 西语和葡语**按意思重写，不逐句翻译**。按市场补充：先写兼容尺寸，写成套配置，不写消费端的话；西语第一次出现的关键零件加西班牙说法括注（等 D1 定了再批量做）。
3. **不动** `seoTitle*` / `seoDescription*`（归工程会话）、型号、数字、标准编号。
4. 验收：`npm test`（包括地区用语、美式拼写、文章数量和型号的测试）、`node scripts/audit-copy-register.mjs`、`npm run copy:parity`，然后提交，用 `npm run ship` 推送。

## 二之二、产品摘要（西语）：下一项，以及一条已确认的风险

- **约 160 条 HYDE 产品的 `summaryEs` 只有两三个词**，例如 *Cerradura de embutir.*（插芯锁。）。事实依据用 `content/products` 里的 `summaryPt`（E 盘会话 09-24 已补齐 198 条）和英文规格行。
- **已确认：重新生成会覆盖人工改过的文案。** 西语规格表会话 09-24 用 `translate-products-es.mjs --only` 只跑 22 条，生成器照样改写了 039 的 `summaryEs` 和 22 条葡语 SEO 字段。全量重跑会把 **240 条 `summaryEs`** 打回半句话（我修的那 18 条就是这种）。在生成器改成“不覆盖已有值”之前，任何重新生成都要先备份 `summary*` 和 SEO 字段。
- **补完后加一条测试**：`summaryEs` 只等于品类名或远短于英文 `summary` 时失败。在全部补完之前，先按“数量不许增加”执行。
- **待命名轮处理**：卫浴配件里有 21 个产品的名称都叫 *Bathroom Accessories*，互相区分不开。名称会影响标题生成器，需要和工程会话一起定，不在本轮改。

## 三、甲方 09-24 的答复（已定，照此执行）

| # | 甲方原话 | 怎么执行 |
|---|---|---|
| A | 「给客人开发新的模具产品根据客人要求，与其他产品专利有冲突的可以改成没有专利冲突的产品，里面配件或者外观做改变。这个才是最大的生产能力」 | OEM 页和首页服务栏的核心卖点是**按客户的图纸或样品开新模具**，如果设计碰到别人的专利，就改配件或外观，改到不冲突为止。首页三语已写（09-24）。**措辞要求**：写“改到不再和那项专利冲突”，不写“保证不侵权”，因为法律结论不由我们下 |
| B | 「如实，但是 ANSI、CE 还要其他的都准备去做」 | 如实写：现有测试报告出具在客户名下，我们自己名下的 CE、ANSI 等测试正在准备。推杠文章第 17 段已改为教买家核对报告名下和型号（09-24）；认证页的正式表述待写（见下方待办 B） |
| C | 「写明可以走阿里巴巴平台下单，也可以直接交易」 | 在联系页和询盘页写明两种方式都可以 |
| D、E | 「DE 你自己把握」 | D：双开防火门整套配置文章；E：葡语巴西防火门和推杠标准解释文。按本文件第一节的做法写 |
| D1 | 「D1 用西班牙皇家学院词典」（09-24） | **已定**：锁舌 = **pestillo**（RAE 第 2 义项：由钥匙或弹簧推出、进入锁扣的锁舌），死舌 = **cerrojo**，执手 = **manija**（西班牙页面第一次出现括注 manilla）。**不再用 picaporte**。规则脚本 `normalize-regional-terms.mjs` 归工程会话，规格标签 Latch → Picaporte 的术语表键归西语规格表会话，已发消息请他们改。文章正文由 Claude 按上下文逐处改，原来当 deadbolt 用的 pestillo 改为 cerrojo |

## 四、没做完的，按顺序（每做完一项就从这里划掉）

| # | 事项 | 状态 |
|---|---|---|
| 0 | **急**：文章里登记的 6 句目录数量已过期（西语规格表会话 09-24 补齐规格数据后连带变化），`article-catalogue-claims` 测试为红。why-the-catalogue（123→114）、mortise-lock-backset（175→180、28/18→34/22）、dimensional-interchangeability FAQ（257 个锁：backset 106→111 等），三语一起改。**mortise-lock-case-comparison 不能只改句子**：同时具备两个尺寸的锁体从 27 变成 32，表格要补 5 行，窄框锁体从 9 变成 12 | 09-24 完成（生成器 `scripts/build-lock-case-tables.mjs`） |
| 0b | D1 手改（进度：规格会话已把 `specsEs` 的 229 处和术语表的 29 处改完，`9e2bdf2a6a0`；**HYDE 产品 `summaryEs` 37 处已改，还剩 0 处**，Claude 09-24）。还没改的：文章正文里的 picaporte 逐处改成 pestillo（原来当 deadbolt 用的 pestillo 改成 cerrojo）；另外还有 `src/data/hardware-terms.ts` 约第 306、312、327 行，原句用 resbalón 和 pestillo 对比，要改成 pestillo 和 cerrojo 对比，否则意思会反过来；以及 `src/data/es-features.ts` 第 996 行。改完告诉工程会话，由他们加 picaporte → pestillo 规则和守卫 | 09-24 完成：文章西语正文 picaporte 清零（42 个文件；原来指插销的 pestillo 改为 pasador，指方舌的改为 cerrojo，再把 picaporte 改为 pestillo）。hardware-terms.ts 和 es-features.ts 另见第 0d 项 |
| 0d | `src/data/hardware-terms.ts` 约第 306、312、327 行（原句拿 resbalón 和 pestillo 作对比）和 `src/data/es-features.ts` 第 996 行，按 D1 改 | 09-24 完成：术语页、卖点对照表、83 个产品的 featuresEs、capability、finish-codes、首页图片说明全部改完；src 中只剩规则脚本和葡语术语表注释里的 picaporte |
| 0c | **先问巴西买家：葡语斜舌和方舌分别叫 trinco 还是 lingueta**。术语表表头、术语表第 630 行、Papaiz 和已上线的文章四处互相矛盾，详见 `pt-br.md` 第 5 节。确认后在术语表层面统一，全部葡语一次改完 | 待问 |
| 1 | 栏目文案第一轮：产品页、首页卡片、产品查找、配置器，三语，按 `docs/copy/style-guides/section-voice.md` | 09-24 完成 |
| 2 | OEM / 服务页（`src/app/(en)/services` 及西葡）：按 A 重写，写开新模具和绕开专利冲突，另写打样流程 | 09-24 完成（三语；起订量和样品条款引用 FAQ 里已有的数字：多数型号 300–5,000 件，样品收费、从首单扣回、有库存的几天内发出；西葡路由已由工程会话建好） |
| 3 | 认证页（`certifications` 三语）：按 B 如实写，现有报告在客户名下、自有名下的 CE 和 ANSI 正在准备 | 09-24 完成（去掉“三份记录属于 Canton Hyland”的无法核实说法；CELAB 证书在谁名下待甲方确认） |
| 4 | 联系页和询盘页（三语）：按 C 写明可以走阿里巴巴平台或直接交易 | 09-24 完成（联系页三语加“阿里巴巴或直接下单”，链接用 site-settings 里的店铺地址） |
| 5 | 文章 D：双开防火门整套配置（推杠、执手、顺序器、闭门器），三语 | 09-24 完成：`news/double-fire-exit-door-hardware-set`，六条线按顺序定、五处互相矛盾的对照表、贴牌商按“一个门洞”下单。SEO 字段是草稿，归工程会话改 |
| 6 | 文章 E：葡语巴西 NBR 11742 / NBR 11785 解释文 | 09-24 完成：`news/brazil-nbr-11742-nbr-11785-fire-door-hardware`，葡语为主、三语。标准事实只用两家以上巴西厂商公开写过的（P 级、C/F/H、推杆长度 ≥ 50%、2018 版双扇要顺序器、AVCB 常见五类不合格）；写明我们名下没有 NBR 11785 测试。避开 trinco/lingueta（见 0c） |
| 7 | 栏目文案第二轮：公司页、服务页其余部分、联系页、FAQ、下载页、资质页，三语；另加各品类页导语 `src/data/category-positioning.json`（品牌平台第八节第 2 步） | 进行中：公司页、FAQ 09-24 完成（FAQ：删掉 RAYEN 才有的地弹簧和未经核实的“三十多个出口市场”，补上专利改型（A）和自己名下测试的现状（B）；标题、导语、简介四段、资质段；EN/ES 把真实工厂照误称为“editorial concepts”的说明已改正；葡语的葡萄牙写法已改成巴西写法）。其余待做 |
| 8 | 文章改写第 2 批和第 3 批（见第二节） | 待做 |
| 9 | 约 160 条太短的西语产品摘要，外加一条守卫测试。数字对照 `summaryPt`（E 盘会话 09-24 第二轮，`80457982db7`，每个数字都能在该产品页的实拍图或尺寸图上找到）。**误归到指示器类的 14 条（锁舌、插销、门镜），材质字段写的 Zinc Alloy 很可能是错的：西语不要写 zamak** | 待做 |
| 10 | 雷茵“品质与认证”栏目的改写建议已写进 section-voice.md 第五节，交给雷茵会话去改；本会话不改雷茵 | 已转交 |
| 11 | 四个参考页的 H1 前面加买家会搜的词（/finishes、/glossary、/model-lookup、/documents，三语），工程会话 09-24 提出 | 09-24 完成：搜索词在前，原句保留（Finish codes / Códigos de acabado / Códigos de acabamento 等）；葡语 model-lookup 顺带改成巴西说法 |


## 待甲方确认（文案）

- **德国**：09-01 的决定写在 `src/data/representatives.ts`，说海外没有子公司，Remagen 只是“联系点”，不是办公室。09-24 甲方又说“德国有办公室、有常驻公司”，首页和服务页已按这句写成“在德国有办公室”。请甲方二选一：(a) Remagen 可以写成我们的办公室，公司页的“Where we are”改为 Office；(b) 仍然只写联系点，那么首页和服务页的“德国办公室”改成“在德国有联系人”。定之前公司页不改。

## 边界

- 雷茵那一侧不动。`content/products` 是两站共用的，改了要在 agent-update 里公告。
- 不编造任何尺寸、材质、认证或年份。
- 新文章用 1000×1000 的正方形产品图做首图时，要在 `src/data/news-visuals.json` 登记取景框（格式照现有条目），发布前跑 `node scripts/audit-image-fit.mjs --check`。否则新闻宽画幅会裁掉 44%，HYDE 发布会被拦下（工程会话 09-24）。
