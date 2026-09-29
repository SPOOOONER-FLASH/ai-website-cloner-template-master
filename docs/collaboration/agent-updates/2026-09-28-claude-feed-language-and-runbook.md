# Claude · 2026-09-28 · feed `<language>` 修正、`seo:feeds` 实测脚本、runbook 归档

**Scope**: `src/lib/article-feed.ts`, `src/data/discover-readiness.test.ts`,
`scripts/verify-live-feeds.mjs`（新）, `package.json`,
`docs/collaboration/CLIENT-RUNBOOK.md`, `docs/collaboration/archive/`。
HYDE lane only；未碰 RAYEN，未碰 `out/`。

## 起因

甲方给了个人 LinkedIn（`linkedin.com/in/leiboliu`）并说 Search Console 已填完。
查下来：**那个网址早在 `/guides` 开栏（`d5603ed9349`）就在 82 条文章的 `author.url` 里**，
作者页 `rel="me"` 链接、`Person.sameAs` 线上都已生效，无需改动。

顺手实测线上，发现**十条 feed 已经全部 200**（有人发布了），于是把 runbook 第一屏那句
「`/es/feed.xml` 是 404，先别提交」处理掉 —— 它在上线之后就变成了一句叫甲方别做已经能做的事的话，
正是 09-17 那条规矩针对的东西。

## 发现的缺陷：七条 feed 的 `<language>` 带了没人决定过的地区码

写实测脚本时查出来的。09-28 上线的七条 overlay feed 声明的是 `fr-FR` / `de-DE` /
`ja-JP` / `ko-KR` / `tr-TR` / `ru-RU`，因为那次扩写从手边最近的 map 取了值 —— `LOCALE_TAG`。

`LOCALE_TAG` 是给 `<html lang>` 和 `toLocaleDateString` 用的，那里**要**地区码：`en-GB`
决定了 29/09/2026 而不是 09/29/2026。但 feed 的 `<language>` 是一句**关于受众的声明**。
`fr-FR` 等于说这条 feed 是给法国的，把比利时、瑞士、加拿大、西非全排除在外 —— 加起来
比法国本身的门五金市场大；`de-DE` 对奥地利和瑞士同理。站点原有的三条 feed 一直写的是裸码
`en` / `es`，`pt-BR` 是唯一一个有据可依的例外（那棵树是为巴西写的）。

**这是一个值意外跨用途搬家的例子**：日期格式用的值跑去做了市场声明，而两边都没人察觉。

- 已改为裸码，`pt-BR` 保留。
- `src/data/discover-readiness.test.ts` 加一条测试锁住：只有巴西那条能带地区码，
  且 `article-feed.ts` 不得再 import `LOCALE_TAG`。
- **线上六条仍是旧值，等下一次 `release:hyde`。** 不影响 Search Console 的收录行
  （sitemap 行不看 `<language>`），是个纯粹的受众声明问题。

## 新增 `npm run seo:feeds`（`scripts/verify-live-feeds.mjs`）

对线上十条 feed 逐条实测：200、`<language>`、`rel="self"` 指向自己而非英文那条、
条目数、首条链接是否在本语种前缀下、每条是否带 `<enclosure>`。任一项失败 exit 1。

两个刻意的设计，写在脚本头部：

- **语种清单从 `src/data/locales.ts` 读**，不手打 —— 九月 645 个葡语页面失联就是手打清单
  造成的，新语种不会去通知旧清单。
- **期望值不从 `article-feed.ts` 读**。一个从被测代码里取期望值的检查器永远不会失败。
  规则在脚本里重新声明一遍，正是这个独立性抓到了上面七条。

这同时替掉了 runbook 里那张手打的状态表 —— 数字进脚本，文档只写命令。

## runbook

- 「等我通知后提交 9 条 RSS」整节 → `archive/2026-09-28-runbook-rss-search-console.md`，
  带「这是记录不要照做」抬头。保留的理由写在抬头里：输入框只填后半截那个坑会再遇到；
  以及那次 404 实测本身是「先验证现状再写指令」的一个具体案例。
- 第一屏换成：现状 + 唯一需要甲方动手的分支（某行显示「无法获取」时等一天再截图）。
- 删掉已经空掉的「已经不用做了（09-28 复查）」标题。
- 「还欠我的东西」加两条：**审稿人真实姓名职位**（甲方说正在要，`reviewedBy` 与署名行
  等它；不编），**LinkedIn 公司主页网址**（个人主页不能拿去当 Organization 的 `sameAs`，
  那是假身份声明 —— `JsonLd.tsx` 里本来就写着这条）。
- 239 行 → 171 行。`npm run runbook:docx` 已在同一个提交里重新生成。

## 测试

`npm test` 435 passed（32 秒，全量，未挑子集）；`npm run lint` 0 errors；
`npm run typecheck` clean。`npm run seo:feeds` 对线上跑出 6/10 失败 —— 这是预期的，
就是上面等发布的那六条。

## 给别的会话

- **本次未发布。** 六条 feed 的 `<language>` 要等下一次 `release:hyde` 才会更新。
  发布后跑一次 `npm run seo:feeds`，应当 10/10 通过。
- `src/lib/article-feed.ts` 我动了 `CHANNEL` 的推导那几行，标题与描述未动。

---

## 追加（同日）：领英移到人头与履历旁边

甲方：「领英加在人头那边吧 履历那儿」。`AuthorProfile.tsx` 原来把领英链接排在介绍段之后，
现在移到学位那一行的紧下面，和照片、姓名、职位、学位同一块。

理由写进了代码注释：这四样回答的是同一个问题 —— 这人是不是这家工厂的真人 —— 而问这个
问题的买家是在核对，不是在读。唯一可核验的那条链接排在一段散文之后，等于把它挪出了被核对
的那一块。十个语种共用这个组件，`ui.json` 里七种 overlay 的「LinkedIn profile」译文早已齐全。

**未做浏览器验证**：本机 `npm run dev` 的 postcss loader 在 `globals.css` 上超时崩溃
（application-code 136ms，崩的是 CSS 管线），与本次改动无关。已验证的是 lint 0 errors、
typecheck clean、`npm test` 443 passed；改动本身是同级 JSX 节点的顺序调整。
**下次发布后请看一眼 `/company/johnson-liu/`**，和那六条 feed 的 `<language>` 一起确认。

## runbook 合并说明

合并 origin/main 时 `CLIENT-RUNBOOK.md` 冲突：文案会话同日在第一屏加了 Bing 重新检查，
以及公司名、LinkedIn 公司主页、AI 可见度摸底、GSC 导出四件。两边都保留，我那节改成
「不用做了：十条 RSS 已上线并验证」并移到三节「现在要做的」之后 —— 第一屏只放要动手的事。

**「还欠我的东西」里我原本写的「LinkedIn 公司主页网址」和文案会话的第 ② 件是同一件事**，
已改成指向 ②，只留归属那一句（个人主页已在作者页生效，不能拿去当 Organization 的 sameAs）。
一件事一个地方。`SHIPLOG.md` 的冲突取远端，由 `ship` 重新生成。
