# Claude — 2026-09-16 — 十篇文章、内容目标、nginx 全查

## 做了什么

| | |
|---|---|
| nginx | 全查了一遍，**没有要修的**；顺手把「两条命令」变成一条，并给自检加了旧 index.php 的落点比对 |
| 推杠那篇 | 补上被 AI 引用却一个字都没写的行业叫法 |
| 新文章 | **10 篇**，英西双语，全部已提交 |
| 文档 | `2026-09-16-content-programme.md`（目标与选题，数字现算）+ 四份 Word |
| 新测试 | `src/data/news-publish-date.test.ts` |

## ⚠ 给 Codex 的一条：构建交还给你，原因在这里

我今天下午 `npm run deploy:prep` 成功跑完一次。改完发布日期再跑第二次时，`test:export`
失败了：

```
6 image(s) are cropped through their subject.
   44%  ansi-grade-1-vs-en-1125-exit-devices  [news hero + card]  file 1000×1000
   44%  door-stop-holder-or-flush-bolt
   44%  reading-door-hardware-model-numbers
   44%  trim-handle-or-panic-bar
   44%  what-oem-actually-changes
   44%  why-the-catalogue-is-this-wide
```

这六条在工作树里是**未提交的修改**，hero 被改成了 `products-hyde/` 的 1000×1000 方板。
两次运行之间我没碰过它们 —— 这是你正在做的活（NOW.md 里那行
「Catalogue-inspired real-photo framing」）。

**我没有动它们，也没有提交它们。** 我把 `out/` 和 `out-rayen/` 恢复到了 HEAD，
接力棒还给你。

修法是现成的：把这六个 slug 加进 `scripts/build-framed-heroes.mjs` 的 `TARGETS`，
跑一次。1000×1000 的方板补白到 16:9 是无损的，而 `object-cover` 会切掉 44% 的宽度 ——
也就是差不多半个产品。我今天新写的十篇 hero 全部走的是这条路。

**我的十篇已经在 main 上，等你下一次构建带上去。** 不需要为它们单独做什么。

## 一、nginx：查完了，没有要修的

甲方：「提交四五次 nginx 了，每次重复同样内容，想一次性搞完。」

逐条打了请求，不是看配置猜的：旧 `index.php` 九种形状 **9/9**，随机抽 40 条产品旧网址
**40/40** 且落点都是最终页；www→主域、http→https、大写 `Index.php`、404、
HTML/JS/图片三档缓存、brotli/gzip、HSTS —— 全部正常。

重复感一半改不掉（这两份配置跟着产品目录变），一半是我造成的：我让他粘两条命令，
第二条就有机会跑在旧代码上。**旧对照表躺十一天正是这么来的。** 三处改动：

- `install-nginx-redirects.sh` 自己 pull，现在一条命令（`--no-pull` 可跳过）
- 两个文件本来就一样时明说「什么都没变」
- 自检加了旧 `index.php` 三条，并且比对**落点**不只看状态码

⚠ 最后一条是关键：原来四条自检全是类目重定向，那份最容易旧的文件一条都没有。
它每次都报 `All redirects live`，而那十一天里它是错的。

## 二、推杠那篇：被引用的关键词，一个都没写

Bing 生成式引用报告：这篇被 `mechanical advantages box-style exit devi…` 引用 6 次、
份额 50%。而全文里 `mechanical` 0 次、`box` 0 次、`leverage` 0 次。

**模型是按意思匹配到第 3、4 段的枢转臂和通长外壳的。** 补了词，没补主张：
box-style、机械增益（臂是杠杆）、rim / mortise / 竖杆（SVR、CVR）四种闩接方式、dogging。

刻意没写 EN 1125 的操作力数值 —— 目录里没有这个数，编一个正是这篇结尾 EN 1205
那个故事在骂的事。

## 三、十篇文章

选题不是猜的：`north-america-longtail.json` 里 31 个我们答得了的词，有 9 个在 24 篇文章里
一次都没被写过；叠上 Search Console 三个月真实出现过的查询。

**长尾五篇**：表面代号（US26D/626/630）、UL 305 是 listing 不是 grade、夜锁 564/1073、
卫生间指示锁、推杠长度 650–1110mm。

**优品推荐五篇**（甲方点名的 30 个型号）：圆筒锁 12 个、锁芯 6 个长度、执手 5 个、
不锈钢 3 个、插芯 2 个（564/1073 归到夜锁那篇，互相引用）。

刻意写进去的「我们不知道」：9210 有 4 个变体 0 行规格；锁芯 60 和 90 各有变体 0 行规格；
锁芯的 DK/KT/IK 是甲方还没确认的六个订货代号之一。**这三段最可能被引用。**

长尾词未覆盖数 **9 → 4**，而且这个数字是 `npm run brief:content` 现算的。

## 四、一个我自己犯的静默 bug，已加测试

十篇文章第一次写的 `publishedAt` 是完整 ISO 时间戳。`getPublishedNews` 用的是
**字符串比较** `publishedAt <= todayIso`，而 `todayIso` 只有十个字符：

```
"2026-09-16T09:00:00+08:00" <= "2026-09-16"   // 永远是 false
```

**每一层都报成功**：JSON 合法、类型接受、`npm test` 313/313 全过、构建完成、
`seo:deadlinks` 审了 1370 个页面没意见。十篇文章根本不在里面，
唯一的发现方式是去 `out/` 里找文件。

和九月那个 `gallery` / `images` 字段名 bug 是同一个形状。
`src/data/news-publish-date.test.ts` 钉住格式；我把时间戳临时改回去验证过它真的会红。

## 没碰的

- Codex 未提交的 `NewsVisual.tsx` / `news-visuals.json` / 六篇 news hero
- `out/` `out-rayen/`（已恢复到 HEAD）
- 架构（甲方 2026-09-15 定）

## 甲方那边还欠的

6 个订货代号、5 个尺寸、308-S/308-D 是否共用锁体，以及新增一条：
**`Brass Piano Hinge` 这条记录自相矛盾**（型号写黄铜、材质写不锈钢 304、
宽度写成 `1"1-1/4 "2 "、3"`）。中英文都有真实搜索曝光，我们真的做这个产品，
但拿一条自己打架的记录写文章正是这个站最不该做的事。**问清楚我立刻能写第十一篇。**

---

## 补记 2026-09-16 晚：构建其实已经上线了，以及两张小红书卡片的对照审计

**上面那段「构建交还给 Codex」已经过时了** —— 合并 origin/main 之后，
`out/news/<十篇>/index.html` 和 `out/es/news/<十篇>/index.html` 全都在，线上实测 200，
sitemap 里也有。另一个会话在构建里带上了它们。**十篇已经上线。**
第十一篇（钢琴铰链）晚于那次构建，等下一次。

顺带确认了一件事：Codex 未提交的改动里包含 `scripts/audit-image-fit.mjs` 的一个补丁 ——
`NewsVisual` 用的是审核过的取景框，不走 `object-cover`，所以那六篇「44% 裁切」
不是缺陷，是我的审计还不认识他们的新系统。**我没动是对的。**

### 甲方发来两张卡片（环形山 CRATER），我拿它们对着站点查了一遍

不是同意或不同意，是查。

**第二处·页面（联系路径）**

| 卡片说的 | 我们的实际情况 |
|---|---|
| 表单压到 3–5 项 | `InquiryForm` 有 **9 个可见字段**（姓名、邮箱、公司、国家、产品、型号、用途、数量、留言）+ 同意勾选。**只有 2 个是必填**（姓名、邮箱） |
| 邮箱别藏在页脚 | ✅ 产品页有 3 处 `mailto:`，不只在页脚 |
| 要有询价入口 | ✅ 顶部就有 Buy it now / Price list / Contact |
| — | ⚠ **全站 0 个 `wa.me` 和 0 个 `tel:`**。阿里巴巴来的买家很多是先开 WhatsApp |

⚠ **必填只有 2 项，但屏幕上摆了 9 个框。** 买家看到的是 9 个，不是 2 个 ——
卡片说的「直接关掉」针对的是视觉负担而不是校验规则。这是 Codex 的组件（`src/components`），
我没有动，留给设计判断。

**第三处·信任**

| 卡片说的 | 我们的实际情况 |
|---|---|
| 认证编号、检测报告 | 有编号（Intertek 130722068GZU-001 等），但三份都是 `publish: false`（发证方限制转发），**只在一篇文章的正文里出现过，产品页上没有** |
| 产线与工厂实拍 | ❌ **一张都没有**。`company.ts` 里明写着那些编辑图是 representative，不是 Canton Hyland 设施的纪实照片 |
| 交付周期与售后条款 | 586 条记录里 `Minimum order` 只有 **6 条**、`Packing` **6 条**，没有任何一条写质保或交期。FAQ 里有一次全局回答 |

⚠ **工厂实拍是三条里最缺的一条，而且不是代码问题** —— 要甲方拍。
这也正好接上 `AGENTS.md` 那条：允许修正甲方自己的实拍照片（角度、裁切、透视、色彩），
不允许生成想象出来的产品。**工厂照片是唯一一类我们既缺、又完全可以合法处理的素材。**
