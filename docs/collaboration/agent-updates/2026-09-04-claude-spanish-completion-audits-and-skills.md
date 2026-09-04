# 2026-09-04 · Claude · 西语补齐、死链与 Bing 复核、skills 正式安装

**Agent:** Claude
**Scope:** `src/app/es/**`(6 新), `content/faq.json`, `src/data/{faq,representatives}.ts`,
`src/components/site/JsonLd.tsx`, `src/app/(en)/contact/page.tsx`,
`scripts/{add-faq-es,audit-dead-links,verify-bing-findings}.mjs`(新),
`src/lib/{spanish-mirror,seo-policy.test}.ts`, `.gitignore`, `out/`
**Commits:** `a485f09646` · `e273abc986` · `5aae04512a` · `9472bfcef9`

---

## 一、nginx：我上一版手册漏了一步，已更正

甲方执行 `nginx -t` 与 `nginx -s reload` **完全正确**，输出也对，三条新 301
依然返回 200。原因是 **nginx 读的不是仓库里的文件**，而是
`/www/server/panel/vhost/nginx/extension/cantonlock.com/10-taxonomy-redirects.conf`
—— `git pull` 不碰这个路径，reload 重新读的还是旧文件，**而且会报告成功**。

线上实测印证：旧的 aid 跳转与 door-hinges 跳转都是 301（那两份是 8 月手动放上
去的），只有新增的三条产品迁移是 200。

`deploy/install-nginx-redirects.sh` 把这件事收成一条命令（备份 → 复制 →
`nginx -t` → 通过才 reload → 在 127.0.0.1 带 Host 头验证）。测试失败自动还原
且不重载。**仍待甲方执行。**

## 二、西语补齐

| 页面 | 数量 | 备注 |
|---|---|---|
| `/es/compare/` | 15 | SpecMatrix 本就支持西语，缺的只是页面 |
| `/es/collections/` | 19 | 需先补 21 个子类西语名 |
| `/es/configurator/` | 1 | 与英文同日上线 |
| `/es/faq/` | 1 | **这批里最重要的一页** |
| `/es/downloads/` | 1 | |
| `/es/certifications/` | 1 | |

### FAQ 为什么排第一

在所有还只有英文的页面里，FAQ 是买家做成生意之前必须先看到的：起订量、交期、
样品、付款方式、OEM。那五个商务答案是从甲方那里磨了两周才拿到的，只放一种语言
等于浪费。

翻译用真外贸术语而非英文直译 —— `pedido mínimo`、`plazo de producción`、
`carta de crédito irrevocable a la vista`、`factura proforma`、`flete`、
`derechos pagados (DDP)`、`despacho de aduana`、`utillaje y molde`、
`planilla de herrajes`、`llave de obra`、`planos acotados`、`licitación`。

**incoterm 保持国际写法**（EXW/FOB/DDP/DAP/T/T/L/C），那是 proforma 上的形式。
**数字是搬运不是翻译** —— 300–5.000 件、30 天、ISO 9001 自 2002、435 型号、
15 族、三十多个市场，每一个都是甲方拍过板的，翻译时四舍五入就是另一个承诺。

没有译文的问题**回退英文而不是消失**，否则以后加新问题时西语页会悄悄变短。
JSON-LD 与页面用同一个函数取数，SEO 审计正是查这一条。

### 子类西语名：一个此前不可见的缺口

15 个顶级类目有 `nameEs`，**21 个子类一个都没有**。没有任何地方用西语渲染子类名
所以一直没被发现 —— 而子类页的标题、h1 和描述全都是那个名字。术语错比留英文更糟：
页面在它本该回答的搜索里找不到，却看起来像翻译过了。

### 顺手解掉三个「等西语存在了才能开」的开关

SpecMatrix 的 `showCompareLink` 原本 `!es`、顶栏 shelf 西语子类原本指 `?type=`
过滤、ProductDetail 的 `compareHref` 原本 `!es`。这三个在西语页不存在时都是对的
（链到 404 比不链更糟），西语页一上线它们就变成在藏真页面。

⚠ **入链是这批唯一的真风险，已量过**：ES 子类页 493 条、ES FAQ 495 条、
ES 对比页从 1 条升到 8 条。

## 三、办公室地址下架，邮箱按区域分配

Lehe Road 办公室不再公布。同一个镇公布两个地址会引出「哪个才是这家公司」，
而对进口商来说**工厂才是那个答案** —— 那是他能去、能审的地方。

**JSON-LD 跟着改了**：Organization 的 PostalAddress 原本发办公室地址。页面不再
提那条街、结构化数据却还在声明它 —— 那是网站没有做出的声明，且正是答案引擎会
引用、买家却无法核实的形状。现在发工厂地址。

邮箱按**职能**分而非按级别：`lock@` 订单与报价、`tec@` 图纸与规格、`hyde@` OEM
与其他。一个邮箱管所有事，意味着每一份图纸请求都排在每一条询价后面。北美两个
联系点 → `spoonerlau@gmail.com`（客户经理直接读）。

> 一句留给甲方的判断：gmail 地址挂在「北美客户经理」上，对采购方而言不如
> `@cantonlock.com` 显得稳。技术上没有任何问题，纯粹是观感，甲方定。

## 四、两个新审计

### 死链（已接进 `test:export`，硬门禁）

前两个审计各查一半：`audit-seo` 查每页自己的元数据，`audit-seo-geo` 查链接图谱的
形状。**没有一个在问最简单的那个问题 —— 这条链接通向哪里吗。**

在 `output: "export"` 下这个问题有真牙齿：每条路由都是磁盘上的目录，指向被改名、
被下架或从未构建的页面就是硬 404，没有服务端路由接得住。这个站已经有三种方式
可以踩中：150 个产品下架、三个产品换类目、往 spanish-mirror 加一个页面还不存在的
路由（那会让全站每页的 hreflang 都指向 404）。

查内链、图片、srcset、样式表、脚本、hreflang、canonical，以及 **JSON-LD 里的
URL** —— 那里的 404 对访客不可见，对这份标记服务的机器却高度可见。

**结果：1019 页、74,611 条内链、19,095 个资源引用，全部可达。**

### Bing 七条逐条复核

Bing 那份报告是 2026-09-01 的爬取快照，而 Bing 不会按需重爬 —— 它的面板会在成因
消失后继续显示那些数字好几周。**这正是「我们修好了」变成一场争论的方式。**

| 发现 | 严重度 | 当时 | 现在 | |
|---|---|---|---|---|
| img 缺 ALT | Low | 4 | **0** | CLOSED |
| 描述过短 | Moderate | 26 | **0** | CLOSED |
| 标题重复 | Moderate | 32 | **0** | CLOSED |
| 标题过短 | Moderate | 22 | **0** | CLOSED |
| 内容过薄 | Moderate | 18 | **0** | CLOSED |
| 缺 h1 | **High** | 4 | **0** | CLOSED |
| 缺高质量入链 | Moderate | 1 | — | **站外，动不了** |

阈值用 Bing 自己的（标题 15、描述 25、正文约 300 词），不是我编的。
noindex 跳转桩排除在外 —— 它们按设计没有 h1，算进去等于报告一个我们故意制造的
缺陷，去追那个数字意味着撤销上一次为 Bing 做的修复。

第七条**如实报告而不是藏起来**：101 条外链来自 4 个域名，95 条指向首页。杠杆在
把那些 listing 改指它们描述的产品页 —— `docs/research/BACKLINK_DEEPLINKS.md`。

## 五、skills 正式安装

最初 22 个是手工拷贝的，能用但**没有更新路径**。改用官方
`npx skills add` 装四个仓库共 **73 个**：impeccable(1)、taste-skill(13)、
ui-ux-pro-max(7)、marketingskills(50)。装进 `.agents/skills/`，同一条命令重跑
即更新。

⚠ 安装器还在 `.claude/skills/` 和 `.continue/skills/` 各放软链接，那个目录**没有**
被忽略 —— 73 条指向 git 不携带的目录的软链接，交给另外两个 agent 就是 73 条断链，
**而断链看起来像文件丢了、不像 skill 没装**。已加进 `.gitignore`。
`skills-lock.json` 反过来提交了：它记录来源仓库与内容哈希，是可复现的凭证。

open-design **没有装**并说明了原因：它不是 skill 包，是 MCP 服务器加桌面应用，
装它会改变整个会话的工具面。

## 一处刻意的测试覆盖

`seo-policy.test.ts` 原本断言 `/faq`、`/downloads`、`/certifications` **不得**有
西语镜像。甲方指示「西班牙语的你全都先翻译」，那几条锁的是一个已被刻意推翻的
决定，按 AGENTS.md 在同一次提交里改掉并写明理由。

**`/news` 仍保持 false** —— 八篇技术长文是真翻译不是数据渲染，一篇机器翻译的
EN 1125 文章比英文原文更糟。这是唯一还没做的西语页，等甲方定夺。

## 数字

1019 页 · 858 公开 · 150 页故意下架 · 176 个测试通过 ·
语义问题 0 · 编辑告警 0 · 图谱审计 0 error 0 warning · 死链 0 · Bing 页面类 6/6 关闭

## 待甲方

1. **执行 `deploy/install-nginx-redirects.sh`** —— 六条 301 仍未生效
2. **purge Cloudflare**
3. `/news` 八篇技术长文要不要译成西语
4. 北美邮箱要不要换成 `@cantonlock.com`
