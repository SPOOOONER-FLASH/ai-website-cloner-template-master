# SEO 复盘清单 · 2026-09-20 → 2026-10-17（28 天）

由 `scripts/build-seo-opportunities.mjs` 从 `docs\research\analytics\2026-10-19\raw/cantonlock.com-Performance-on-Search-2026-10-19 (1).xlsx` 生成。第 ① 步（总数周环比）见 `node scripts/build-weekly-kpis.mjs`。

## ② 有曝光、点击少：先改标题和描述（15）

排名已在前 15 名、28 天曝光 ≥ 100、点击率 < 1%。

| 网页 | 曝光 | 点击 | 点击率 | 排名 |
|---|---|---|---|---|
| /guides/door-hardware-hs-codes-2026/ | 2156 | 3 | 0.14% | 4.3 |
| /news/finish-codes-us26d-626-630/ | 1965 | 5 | 0.25% | 5.5 |
| /news/handing-left-right-and-universal/ | 487 | 4 | 0.82% | 7.1 |
| /guides/door-preparation-161-and-86-2026/ | 473 | 3 | 0.63% | 5.0 |
| /products/hardware-accessories/fb001-ac-door-flush-bolt/ | 362 | 0 | 0.00% | 9.3 |
| /guides/copper-or-brass-hinges-2026/ | 356 | 2 | 0.56% | 6.5 |
| /guides/door-closer-mounting-positions-2026/ | 353 | 2 | 0.57% | 6.8 |
| /guides/corrosion-resistance-en-1670-2026/ | 335 | 1 | 0.30% | 4.0 |
| /es/guides/door-hardware-hs-codes-2026/ | 311 | 0 | 0.00% | 3.1 |
| /guides/key-blanks-and-restricted-profiles-2026/ | 306 | 2 | 0.65% | 7.1 |
| /guides/cylindrical-and-tubular-lock-comparison-2026/ | 286 | 0 | 0.00% | 8.2 |
| /news/push-bar-or-touch-bar-panic-exit-devices/ | 285 | 1 | 0.35% | 7.6 |
| /guides/en-1125-vs-en-179-2026/ | 270 | 2 | 0.74% | 8.5 |
| /guides/finish-code-reference-2026/ | 204 | 0 | 0.00% | 6.8 |
| /de/news/fitting-a-euro-cylinder/ | 176 | 1 | 0.57% | 9.8 |

## ③ 排第 8–20 名的查询词：补内容、补内链（14）

28 天曝光 ≥ 20。对应网页在 GSC 里点这个词 →「网页」查看。

| 查询词 | 曝光 | 点击 | 排名 |
|---|---|---|---|
| fb001 | 360 | 0 | 9.3 |
| 630 finish | 137 | 0 | 8.9 |
| door closer | 99 | 0 | 10.7 |
| master key plan | 68 | 0 | 15.9 |
| copper hinges | 42 | 0 | 8.2 |
| door hardware spec section | 35 | 0 | 9.5 |
| door closer mounting options | 28 | 0 | 18.5 |
| piyano menteşe | 26 | 0 | 8.3 |
| finish 630 | 24 | 0 | 7.5 |
| stainless steel 201 vs 304 vs 316 | 24 | 0 | 7.7 |
| copper door hinges | 24 | 0 | 10.8 |
| great grand master key | 22 | 0 | 15.9 |
| stainless steel tubular knob lock | 21 | 0 | 9.6 |
| us26d | 21 | 0 | 11.5 |

## ④ 这段时间上线了什么（87 版）

每版明细见 `docs/collaboration/上线日志-RELEASES.md`。看数据变化时，对照变化前 1–2 周这里改了什么。

| 日期 | 版数 | 改动条数 | 举例 |
|---|---|---|---|
| 2026-10-14 | 2 | 10 | 四个表单加 hCaptcha：Web3Forms 已强制验证码，未带 token…；发布不再依赖 GitHub：拉不到 GitHub 时构建本机已提交的 HEAD，… |
| 2026-10-13 | 13 | 35 | 308: three of the five held images go up…；过短产品描述第二道兜底：补「广东制造、交期 30 天起」（十语已审措辞） |
| 2026-10-12 | 14 | 47 | Homepage: opening curtain, smooth scroll…；指南封面图链到对应产品；robots.txt 去掉 RSS；Ahrefs 日俄标… |
| 2026-10-11 | 1 | 9 | Argentina 预览页只在 en/es：列入 PARTIAL_ROUTES（…；GitLab 镜像脚本；Argentina 预览页 noindex（解 r34 … |
| 2026-10-10 | 2 | 4 | 产品查找器结果卡片补传 locale：韩/西等语种点卡片不再跳到英文页；Correct B homepage to an outdoor escape … |
| 2026-10-09 | 2 | 30 | Keep the approved hero provenance sideca…；i18n：七语种跟上 09-28 后的指南/新闻改动（#146 描述、计数 58… |
| 2026-10-08 | 2 | 28 | #136 分享标题（og:title / twitter:title）同样经过 …；#136 标题超过 70 字符时省掉「 / Canton Hyland」（甲方 … |
| 2026-10-03 | 1 | 1 | Remove HYDE mailbox and prioritize catal… |
| 2026-10-02 | 1 | 1 | LinkedIn 公司主页 hyde-cantonlock 加入页脚社交与结构化… |
| 2026-10-01 | 1 | 6 | BAU 2027 官方展商横幅上架（英、德各一张 300×250，在展位介绍旁，…；chunk-push-release 推 main 不再用 --force；ma… |
| 2026-09-30 | 4 | 30 | i18n: bring the glass-door article overl…；玻璃门文章七语种补译第 1、21、29 段（跟上 79f5207bc69 的英文… |
| 2026-09-29 | 5 | 27 | 配置器工作室上架：十语言、导航栏/侧边栏/首页展示，保留原配置器；配置器工作室：FSB 式专属页 + 产品页表面处理/功能切换 |
| 2026-09-28 | 8 | 54 | Restore original AR4 showcase below the …；Withdraw BAU token patch superseded by m… |
| 2026-09-27 | 7 | 48 | BAU 2027 专栏上线源码：/bau-2027/ 与 /de/bau-202…；BAU 2027 专栏三个版式预览（A 事实卡优先 / B 产品优先 / C 预… |
| 2026-09-26 | 3 | 27 | 产品页特性条目读本语种：七个新语种此前一律显示西语 featuresEs（侧车里…；/sitemap.xml 只放英文网址（14 MB → 约 1/10），各语种 … |
| 2026-09-25 | 4 | 28 | 视频观看页 /video/<slug>/：Google 只从主体是视频的页面编视…；8826 SNBK 卖点：the knobs 改为 the levers |
| 2026-09-24 | 17 | 128 | 网站内容无改动（重新构建）；Piano Hinge：model/slug 按 modelTbc 惯例改名（旧… |
