# HYDE 工程会话目标清单（2026-09-24 起）

> 甲方 09-24：「设定目标 hook 持续工作直到所有项目和修改优化项目完成」。
> 本会话（HYDE工程交接配置）的 Stop hook 读这张表：最后一列是「待做」的行没清完就继续干。
> 需要甲方或别的会话先动的行写「待甲方」「等待」，不算待做。做完一行改成「09-24 完成」并提交。

| # | 事项 | 状态 |
|---|---|---|
| 1 | HYDE 发布本轮积压（picaporte、计数、9 条新尺寸标题、zh-terms），上线后实测 | 09-24 完成（996a209b6df 上线，L001 Pestillo、LC05 85/60 标题实测） |
| 2 | 比较页（/compare/*）标题带长尾词：夜锁比较页 70 次展示、排名 9.7、0 点击 | 09-24 完成（「25 Night Latches & Rim Locks Compared Side by Side」，西葡「Comparativa/Comparativo de N …」） |
| 3 | GSC 机会清单里的其余页面：/contact/（98 展示）、背距与中心距文章（31 展示）的搜索标题和描述 | 09-24 完成（联系页三语标题带「工厂在中国」；背距文章标题带 85mm vs 72mm） |
| 4 | 219 张无 alt 的图片（指南、新闻列表页的封面图） | 09-24 完成（指南缩略图用产品图 label 作 alt；新闻卡片的装饰 logo 本来就对，审计不再误报 aria-hidden 图） |
| 5 | 术语表页 12 处「Read more / Leer más」空锚文本改成有内容的链接文字 | 09-24 完成（「More on backset」「Más sobre …」「Mais sobre …」） |
| 6 | 标题生成器加 `--only <models>`，只重写指定型号 | 09-24 完成（--write --only LC04,140） |
| 7 | 标题生成器去掉「Door Hinge for Doors」这类场景和名字重复 | 09-24 完成（短场景不再截成光秃的 Doors；7 条标题更正） |
| 8 | 复查 306-D / 306-S 西葡重复标题是否已消除（seo:graph） | 09-24 完成（最新构建 seo:graph：无重复标题、无孤立页、全部从首页可达） |
| 9 | 多语种准备：RTL 扫描脚本，数出全站物理方向类名（阿拉伯语工程量） | 09-24 完成（89 处、21 个文件，docs/research/RTL-READINESS.md，可重跑） |
| 10 | 查询语料脚本加国家筛选，单列德国、法国、沙特、阿联酋、土耳其的查询 | 09-24 完成（GSC 查询表不带国家列，改为导出时按国家筛选；步骤写进 DATA-DASHBOARDS.md，脚本 --out 分文件） |
| 11 | 发给 Hyde 文案：finishes / glossary / model-lookup / documents 的 H1 不含搜索词，给出建议写法 | 09-24 完成（建议已发 Hyde 文案，由其改页面文字） |
| 12 | 同句出现 pestillo/cerrojo（葡语 trinco/lingueta）就报错的规则 + picaporte → pestillo | 09-24 完成（规则启用，13 处自动转换，0 冲突；葡语见 #24） |
| 13 | 10 个产品名字太长放不下长尾词 | 等待（改名归文案/规格会话） |
| 14 | 服务器装跳转规则（ANSI 网址 301） | 09-25 完成（cron 自动安装跳转规则，见 #58；09-28 核查更正） |
| 15 | GA4 登记自定义维度 | 待甲方（手册 ②） |
| 16 | 隐私政策页内容 | 待甲方 |
| 17 | 路由收敛为 `[locale]`、构建产物不进 git | 待甲方 |
| 19 | /services 元数据改为 OEM / 私人品牌领头（Hyde 文案 09-24 请求） | 09-24 完成（标题「OEM & Private-Label Door Hardware Manufacturer in China」） |
| 20 | 西葡 services 路由（/es/services、/pt/services：hreflang、前缀、locale-route-parity），建好通知 Hyde 文案写西葡文案 | 09-24 完成（/es/services、/pt/services 上线待发布；镜像、菜单、测试已改；西葡标题 OEM / marca propia 领头） |
| 21 | 8827、8828 是空壳重复页（无规格，主图与 8827 SSET / 8828 SSET 相同）：301 到 SSET 款 | 09-24 完成（并入 SSET，两张装门图随迁，productMerges 301；计数句交文案会话） |
| 22 | HY006 应用字段写着「KFC 锁体」，他人商标，删掉 | 09-24 完成（三语去商标名，保留用途） |
| 23 | 559 画集 5 张带 STAHLOCK 水印的图（已撤下）是否可用 | 已改方向（甲方：STAHLOCK 是子品牌，其图片不用、不动；09-28 核查更正） |
| 24 | 葡语 trinco / lingueta 用法相反：术语表 Deadbolt=Trinco、Latch=Lingueta，文章里 trinco 指斜舌。要一个像 D1 的决定 | 待甲方 |
| 25 | HYDE 发布本轮（services 三语、8827/8828 合并、picaporte、alt、锚文本、比较页标题），上线后实测 | 09-24 完成（336102c786c 上线；/es/services、/pt/services 与 hreflang、比较页与联系页新标题实测） |
| 26 | 新文章 double-fire-exit-door-hardware-set 的三语 SEO 字段（Hyde 文案草稿） | 09-24 完成（标题带「with Panic Bars」买家原话，描述收进 150） |
| 27 | 新文章 brazil-nbr-11742-nbr-11785 的 SEO 标题；两篇新文章首图登记取景框（发布被图片适配检查拦下） | 09-24 完成（标题带 NBR 11785 / barra antipânico / AVCB；news-visuals 两条） |
| 28 | HYDE 发布（参考页 H1、两篇新文章），上线后实测 | 09-24 完成（baa9b0c904a 上线，两篇新文章标题实测；/finishes 新 H1 在构建里，线上等 purge） |
| 29 | 公司页三语元数据：去破折号、带「Xiaolan, China, Since 1998」、葡语改巴西拼法（Hyde 文案提醒检查不实说法：元数据里没有） | 09-24 完成 |
| 30 | 锁体横评新增西葡版的三语 SEO（英文描述还写着旧的 27） | 09-24 完成（描述不写个数，只写范围；标题带 Chart / tabla / tabela） |
| 31 | es-glossary「Four round bolts」→ cerrojos（D1 漏改） | 09-24 完成（规格会话 1c18a2be714，三处：cerrojos / cerrojo de gancho / salida del cerrojo） |
| 32 | HYDE 发布（公司页元数据、锁体横评西葡版），上线后实测 | 09-24 完成（7d342751363 上线） |
| 33 | 西葡标题描述的小数改逗号、单位小写（生成器读英文规格行，16 处 2.5mm） | 09-24 完成 |
| 34 | HYDE 发布（#33 与之后的推送），上线后实测 | 09-24 完成（1bc10632f01 上线） |
| 35 | 推杠横评、筒式锁横评新增西葡版的三语 SEO 定稿（英文描述也超长且写了会过期的个数） | 09-24 完成（去个数、留范围，全部进长度预算；图片适配检查通过） |
| 36 | HYDE 发布（#35、三篇横评西葡页），上线后实测 | 09-24 完成（e5d0020d0e6 上线；/es/guides/exit-device-comparison-2026/ 源站 200，Cloudflare 缓存着旧 404，等 purge） |
| 37 | 改名同时移类的一跳 301（productMerges.toCategory；rename-product-slug --category-path） | 09-24 完成（f68ed6e509d） |
| 38 | 卫浴 54 条：改 slug + 301、BH15/16/17 移 latches、扶手和淋浴凳移 care-grab-bars、重跑标题、care-grab-bars 类目的 HYDE 封面和三语标题 | 09-24 完成 |
| 39 | HYDE 发布（#38 + 发布会话的动效令牌、对比度两个提交），上线后实测 | 09-24 完成（6ee2cf87ba0 上线；care-grab-bars 类目页、bh01/bh56/bh17 三语 200，标题正确；旧网址等甲方装 nginx，Next 跳转页按设计被 prune 掉） |
| 40 | GA4 是否双计（发布会话报告）：实测 page_view 只 1 次；第二资源 G-X7EMRX2V2X 来自 GA 后台的代码目标，已写进手册 ④ 问甲方 | 09-24 完成 |
| 41 | 甲方回复 ④：G-X7EMRX2V2X 删（手册 ④ 写了后台步骤，甲方操作后实测只剩一个资源）；GTM 改为 load 后加载 | 09-25 实测已不再发往 G-X7EMRX2V2X（page_view 只发 G-RBTE7KF82P），甲方似已删除 |
| 42 | GTM 改为页面 load 后加载（官方代码原样保留在 head，hoist 正则兼容），发布后实测 HTML 有代码、gtm.js 下载、dataLayer 有 gtm.js 事件 | 09-24 完成（069a44f1ae8 上线；无头 Chrome 实测：gtm.js 在 window load 同一刻请求，GTM-MQHHPGJL 生效，dataLayer 有 gtm.js / gtm.dom / gtm.load；G-RBTE7KF82P page_view 1 次） |
| 43 | 甲方要 copper hinge 搜索导到黄铜合页：材质字段为 Brass 的合页（B024、B025）描述加三语「买家常叫 copper hinge」，不写纯铜；「fix the door」不再当功能进描述（7 条） | 09-25 完成 |
| 44 | HYDE 发布（#43 + 发布会话 b795cc38ac9 邮箱统一 tec@、6fd3c2025d7 首页对齐），上线后实测 | 09-25 完成（77895fcdd16 上线；piano-hinge、铜合页指南 EN/ES、B024 描述、tec@ 实测正确） |
| 45 | 七语种产品标题：生成器扩 fr/de/ja/ko/tr/ru/ar，结果合并写入 content/i18n/<code>/products.json 的 seoTitle / seoDescription（以 slug 为键，不加后缀字段，不覆盖同文件其他字段） | 等待（多语言会话术语表 M2 和 categories.json 就位后通知） |
| 46 | GTM 安装检测报未检测到（09-25 甲方截图）：改回 Google 原样代码（含换行、立即执行），发布后请甲方在 GTM 里重新点 Test | 09-25 完成（632155768cd 上线：head 里是 Google 原样代码，gtm.js 2.6s 请求、早于 load；等甲方 purge 后在 GTM 点 Test 确认） |
| 47 | ironmongery / 开模定制（brief 2026-09-25 第 3 项）：首页描述、服务页标题描述、产品目录总页标题描述带 architectural / bespoke ironmongery 与 custom tooling；英文 only，不塞进每个品类标题 | 09-25 完成（源码） |
| 48 | 定制指南（文案会话写）的三语 seoTitle / seoDescription：custom door hardware / bespoke ironmongery | 09-25 完成（EN Custom Door Hardware & Bespoke Ironmongery: Tooling Guide；ES/PT 定稿；头图沿用 311 文章的取景框） |
| 49 | HYDE 发布（#47） + #48 指南，上线后实测 | 09-25 完成（0e8f7649e2f 上线：定制指南三语、服务页、产品目录页、首页描述实测正确；第八次发布构建进程崩溃 0xC0000409，未重发，因为剩下的门孔图修复不影响 HYDE 页面） |
| 50 | GTM「Test」一直报未检测到：查明是 Cloudflare Bot Fight Mode 对 Google 服务器出 403 质询页（translate.goog 实测），与代码无关；手册 ⑤ 写了用 Preview 验证 | 09-25 完成 |
| 51 | Cloudflare Security Insights / AI 抓取报告（甲方 09-25）：security.txt 上线、改名视频 18 条 301、mail CNAME 不代理（网易企业邮箱）、MFA 与 Archive 写进手册 ⑥、AI 抓取数据进看板 | 09-25 完成（源码；随下一次发布上线） |
| 52 | 七语种产品 seoTitle / seoDescription（#45）：多语言会话 M1–M4 已给出 glossary 与 categories | 09-25 完成（3,647 条：7 语 × 521；只写 seoTitle / seoDescription；--check 覆盖七语种） |
| 53 | 视频不在观看页面上（97 个，09-24 验证失败）：建 /video/<slug>/ 观看页与 /video/ 目录，VideoObject 和 sitemap 视频条目移到观看页 | 09-25 完成（源码） |
| 54 | HYDE 发布（#51 #53，排在发布会话的 M1 之后），上线后实测观看页与视频跳转 | 09-25 完成（/video/ 线上 200；09-28 核查更正） |
| 55 | DS011 移门吸子类 | 09-25 完成 |
| 56 | DSL02、DC01（闭门顺序器）、HY-0SS（锁舌护板）改名、改 slug、301、移类、重跑标题 | 09-25 完成（3f729ee4850；09-28 核查更正） |
| 57 | 英文规格值错误（BH01 500m、DS05 ф、DV05/06 多 N、AR4-1121 背距、Electroplatingbhgh、LC9045 疑似写反） | 等待（已转规格会话；LC9045 问工厂） |
| 58 | cron 自动安装跳转规则实测：09-25 推送 18 条视频跳转后，未经人工，/videos/products/026-panic-exit-device.mp4 已 301 到 -trim | 09-25 完成 |
| 59 | HY-0SS 七语种译文（多语言会话本地已合入，排在指南第二批之后推送）推上来后，重跑 hy-0ss-latch-guard 的七语种标题 | 完成（七语种 seoTitle 已在 content/i18n/*/products.json；09-28 核查更正） |
| 60 | 首页排版崩（甲方 09-25）：M1 的 compactNavigation display:block 覆盖 .layout 网格，1376–1599px 导航无边距；改 grid | 09-26 完成（线上实测） |
| 61 | 甲方在 Search Console 视频索引报告点「验证修正」，观看页被抓取后复查已编入索引数 | 待甲方 |
| 62 | Bing SEO 报告（09-26）：5 篇指南「不在 sitemap」实际在（14 MB sitemap 读不完）→ /sitemap.xml 只放英文，语种 sitemap 各自一份；audit-seo 改读 robots.txt 声明的全部 sitemap；2 个 index.php 缺 description 实为 301；修 M8 留下的 3 个测试 | 09-26 完成（c57f1a6b88f 上线实测：/sitemap.xml 1.55 MB、881 个网址、含那 5 篇指南；9 个语种 sitemap 各 681 个网址、内容各自独立；robots.txt 列出 10 个） |
| 63 | 甲方在 Bing 提交 10 个 sitemap 并重扫（手册 ⑦） | 待甲方（sitemap 已上线，可以提交） |
| 64 | IndexNow 每次发布后只推「内容真变了」的页：`npm run seo:indexnow -- --last-release`，先核对线上已是新构建（未 purge 就拒绝）；09-27 首推 3,954 条 → 200 | 09-27 完成 |
| 65 | 产品页 ↔ 应用案例互链（甲方 09-27 转来的「案例和产品关联」）：案例页已列产品，产品页还没有反向链接；十语种都要有，文案用已有译文 | 09-27 完成（18 个产品页 × 10 语种，本地实测；待下次 release:hyde） |
| 66 | Zuperior Hardware（Dan，info@zuperiorhardware.com）询 magnetic door latch：官网没有这个品类；起草英文回信给甲方（价格留空由老板定，不编参数） | 09-27 完成（草稿在对话里交甲方） |
| 69 | 磁性门锁舌（magnetic door latch）上官网：工厂确认能做后，给实拍照片 + 尺寸（锁舌中心距/面板/锁体长度、通道/隐私功能、表面）即可建品类页；现在不建，不编图不编参数 | 待甲方（工厂能否做 + 实物资料） |
| 70 | 文案会话 09-27（docs/copy/guide-keyword-split.md）：5 对文章 seoTitle 同词分流 → 6 篇 × 10 语种改主词（功能开头 / 认报价钢种 / 总长 vs 分段 / 读锁体型号 / 按项目国家 vs 等级对比） | 09-27 完成 |
| 71 | /euro-cylinder-calculator（文案会话新建，10 语种）title/description 目前写在页面 metadata；接手时按 seoTitle 规则审一遍，避免和 euro-cylinder-size-chart、length-and-split 抢词 | 09-27 完成（主词只占 calculator；7 语种 title/description 已译，正文待文案/多语言会话） |
| 72 | 文案会话 09-27：ansi-grade-1-vs-en-1125 的 seoDescription 只讲等级对比，「按国家/项目市场选标准」留给 en-1125-or-ansi（10 语种） | 09-27 完成 |
| 73 | 3d9ab7aec9c 发布后：IndexNow 改为只比 head+main（页头改动不再算全站），实推 6,329 条 200；产品页案例区块、计算器与文章新 title 线上实测生效 | 09-27 完成 |
| 74 | 页头乱（甲方 09-27 截图，法语约 1530px）：左侧导航「Acheter maintenant」压到中间 HYDE logo 上；长语种导航要在撞 logo 前收进菜单 | 09-27 完成（fr/de/ru 固定紧凑导航 + 运行时守卫） |
| 75 | 死链检查（甲方 09-27）：跑 seo:deadlinks + 线上抽查，修掉发现的 | 09-27 完成（本地 0；线上 1,242 页全 200、外链 595/600 正常，5 条社媒本机连不上未判定；新增 seo:deadlinks:live） |
| 76 | 甲方 09-27：Applications / Guides / News 合并成一个导航栏目（新名），鼠标移上去向下弹出这三项，10 语种 | 09-27 完成（Resources 下拉；本地实测） |
| 77 | 甲方 09-27「推送上线」：#74 页头、#76 Resources 下拉等源码已推，需 release:hyde（本机构建崩溃，请发布会话发布），上线后线上实测 + IndexNow | 09-28 完成（c11fb7f4d59 线上实测：Resources、/fr/ 页头、inLanguage 10 语种、HowTo、Model code to be confirmed、llms.txt；IndexNow 250 条 200） |
| 78 | 甲方 09-27：9 月 HYDE 全部指令核查（所有会话 + 远端 md），逐条打勾/说明原因，出月度工作总结 docx 供下载 | 09-28 完成（Desktop\hyde\HYDE-月度工作总结-2026-08-31_2026-09-28.docx；459 条网站指令，330 完成） |
| 79 | 核查遗留（工程线）：目标清单 #14 #54 #56 #59 #67 #23 状态与实际不符 → 改正；runbook ④⑤ 已完成移出第一屏并出 Word | 09-28 完成（6 行更正；runbook ③④⑤ 存档，⑥⑦ 前提已满足；Word 已重出） |
| 80 | 核查遗留：JSON-LD WebSite.inLanguage 只列 en/es（实为 10 语种）；llms.txt「over thirty markets」与 FAQ 矛盾 | 09-28 完成（inLanguage 列 10 语种；llms.txt 改为甲方给的出口地区） |
| 81 | 核查遗留：无型号产品仍显示「Reference/Available on request」（如 stainless-steel-lever-handle-lock），改成如实说明缺什么、怎么问 | 09-28 完成（13 条型号未确认记录改为「Model code to be confirmed」，10 语种） |
| 82 | 核查遗留：HowTo 结构化数据（安装/测量类文章，如 fitting-a-euro-cylinder） | 09-28 完成（只有 fitting-a-euro-cylinder 正文是逐步操作；6 步取自正文，仅英文页；Google 2023 起不展示 HowTo 富摘要，主要给 AI 引擎） |
| 83 | 核查遗留：产品图一致性审计脚本（主体占比、基线），列出不合规图交视觉会话 | 09-28 完成（521 张测量、54 张列出：docs/research/product-plate-audit.md；修图归视觉会话） |
| 84 | 核查遗留：每周复测（Clarity 排名 / GSC 摘要）记录进 agent-updates；10-08 前后复查标题点击率 | 等待（日期：首次 10-03 周五） |
| 85 | 甲方 09-28：r8 改由本机（John）推送，按目录分批推临时分支再快进 main（GitHub 408 超时，发布会话 5 次失败）；先试本机构建 | 09-28 完成（本机构建未崩，8,869 页；整体推送一次成功 c11fb7f4d59，分批脚本备用） |
| 86 | 甲方 09-28：所有发布部署交给本会话（johns 机器 4090/64G），写进 AGENTS.md 与 NOW.md；「继续推送部署 r9」 | 09-28 完成（规则已写入；r9：r8 之后 origin/main 无网站源码改动，其他会话一推源码即发） |
| 87 | r9：发布会话菜单抽屉修复 c0fa19785c5（rAF 不触发时抽屉不出现）；上线实测汉堡菜单、Esc、焦点回退、语言面板 | 09-28 完成（r9 = d07288940d8；0 帧环境抽屉 177ms 打开；关闭/Esc 问题转 #89） |
| 88 | 1376–1599px 紧凑导航条也用 Resources 下拉（发布会话 09-28 发现 1440 宽看不到；平板/手机保持三链接）→ r10 | 09-28 完成（r10 = baa82d3b5a0 线上 1440 宽导航条显示 Resources） |
| 89 | r9 线上实测（rAF 不触发环境）：抽屉已能打开；但关闭后焦点不回菜单按钮（closeMenu 等 rAF），Esc 在焦点未进抽屉时无效 → 定时兜底 + 文档级 Esc → r11 | 09-28 完成（r10 线上 0 帧环境：两种 Esc 都关闭、焦点回退；语言面板开关正常） |
| 90 | 甲方 09-28：日韩网址段 /ja/ → /jp/、/ko/ → /kr/（lang/hreflang 仍 ja/ko）；旧网址 301、sitemap/robots/hreflang/IndexNow 跟改 | 09-28 已改方向：甲方「怎么拿 SEO/GEO 就怎么办」→ 保持 /ja/ /ko/ 及其余语言代码不变（Google 靠 hreflang 与 lang 定语言和地区，子目录名不影响；日韩已开始收录，改名要整批 301、换来的只有排名波动）。改名改动未提交即撤回 |
| 91 | 甲方 09-28：首页轮播图不轮播了 | 09-28 完成（r11 = d733616467f 线上英文首页 Playwright 实测：不动鼠标与鼠标停在大图上都轮播） |
| 92 | 甲方 09-28：联系人 tec@ = Spooner、hyde@ = Monica Lee；WhatsApp +1 703 967 7493 上站（联系页、页脚、菜单） | 09-28 源码完成（site-settings：mailboxOwners、whatsapp；联系页 4 份实现 + 页脚 + 手机菜单）；r12 = e0ffe9af879 已推，源站实测联系页有 Monica Lee、WhatsApp；边缘缓存待甲方 purge |
| 93 | 甲方 09-28：手机端导航栏与面包屑「很乱没有逻辑」→ 实测 375px 后重整 | 09-28 源码完成（导航条 CTA 固定右侧、仅当前页加粗；面包屑单行统一 ›；删重复返回链接）；r12 = e0ffe9af879 已推 |
| 94 | 甲方 09-28：BAU 2027 专栏，EN 与 DE（C4 馆 523 号展位，2027-01-11 至 15，慕尼黑）；活动页「计划考察」改为已确认参展；/de/events 404 | 已改方向（甲方 09-28 追加：「2. 以后的文字不管了」，BAU 专栏不做） |
| 95 | 甲方 09-28：英文首页首图不轮播 → r11（70c96990724）上线后英文页专门复测 | 09-28 完成（同 #91，英文页线上复测通过） |
| 96 | 甲方 09-28：Google Discover（截图）——RSS 供抓取；robots max-image-preview:large；文章大图 ≥1200px 16:9 ≤500KB；作者与品牌清晰（E-E-A-T）；手机体验（#93） | 09-28 源码完成（82 张 1200×675 分享图接 og/JSON-LD；/feed.xml；全引擎 max-image-preview；手机文章页不弹促销）；r12 = e0ffe9af879 已推，源站实测 /feed.xml 82 条、首页 RSS link、max-image-preview；IndexNow 等 purge 后补跑 |
| 97 | 甲方 09-28 选定版式 B：建 /bau-2027/ 与 /de/bau-2027/（文字读 content/bau-2027.json，预约表单走现有询盘提交、主题 form.subject、收件 tec@；Event 结构化数据、sitemap、en/de hreflang；德语也放表单——甲方确认，隐私页未有，DSGVO 风险已告知）；上线后 events.json 的 relatedHref 改 /bau-2027/ | 09-28 源码完成（PARTIAL_ROUTES 只给 en+de；BauColumn + BauMeetingForm；Event JSON-LD；sitemap；events.json 已指向 /bau-2027/；本地 1440/390 实测版式与顺序、hreflang en/de/x-default）；r13 = 121e397e6ef 已推，导出含 /bau-2027/、/de/bau-2027/、Event JSON-LD、sitemap 4 条；fr 等无此页 |
| 98 | 甲方 09-28（菜单截图）：抽屉底部邮箱与 WhatsApp 粘连；菜单信息不够清晰 → 把所有内链栏目按逻辑放进菜单 | 09-28 源码完成（抽屉四组 Products/Knowledge/Evidence/Buying 列全部 24 个栏目；邮箱与 WhatsApp 分两行；7 语 ui.json 补 3 个标签）；r14 = b67a73bbca9 已推（第一次构建 0xC0000409 崩溃，重试成功），seo:placement 在发布包上 en/es/pt/de/fr 零弱链 |
| 99 | 甲方 09-28：/product-studies/ 等栏目在别处看不见 → 全站内链审查：每个栏目都要有显眼可达的位置、多处出现、互相串联；要有审查捕捉脚本和测试 | 09-28 源码完成（页脚补 Configurator、Hardware in focus、FAQ、Price list、BAU；internal-link-placement.test.ts 进 npm test；npm run seo:placement 在 out/ 上实测，r13 上正好抓出这 4 个弱链栏目）；r14 = b67a73bbca9 已推（第一次构建 0xC0000409 崩溃，重试成功），seo:placement 在发布包上 en/es/pt/de/fr 零弱链 |
| 100 | 甲方 09-28：HYDE 的 chat 放进一个 project 怎么填写 | 09-28 已在对话中回答 |
| 101 | 发布会话 09-28：源码 b5bcb762a72（七语首页去掉桌面 lg:mt-192，十语首屏一致）要发布 | 09-28 完成（r15 = fc00f7227e4；31 worker 构建连崩两次 0xC0000409 → next.config cpus 上限 12（69921f1ad2e），可用 NEXT_BUILD_CPUS 覆盖；源站 /fr/ 已无 lg:mt-192）|
| 102 | 文案会话 09-28：源码 c25b0f2f64e（308-S 单扇无锁体 / 308-D 双扇带锁体，三语摘要；runbook 归档）要发布；标题生成器是否随定性调整 | 09-28 源码完成（308-S/308-D 各加 positioning：原标题里的 "Cold Rooms" 只是子品类场景词，资料里没有；改为单扇无锁体 / 双扇带锁体，三语标题与描述重生成）；r16 = b606a19697b 已推 |
| 103 | 文案会话 09-28：源码 bc0ecd87349（BAU 564 卡片 "Zinc alloy" 首字母大写）要发布 | 09-28 完成（r16 = b606a19697b，从最新 main 构建：含 c25b0f2f64e、bc0ecd87349、5000b0e6d4a、308 标题和云端合并的 5 个 PR） |
| 104 | 发布会话 09-28：源码 5000b0e6d4a（BAU 版式 B 打磨：主匙卡排版、德语日期格不换行、悬停动效令牌）要发布；上线后实测 /de/bau-2027/ 1440、1600 日期不换行，390 主匙卡不溢出 | 09-28 完成（r16 = b606a19697b，从最新 main 构建：含 c25b0f2f64e、bc0ecd87349、5000b0e6d4a、308 标题和云端合并的 5 个 PR）；源站 Playwright 实测 /de/bau-2027/ 1440、1600、390：5 个日期格高度均为 35px，无换行，主匙卡无溢出，页面无横向滚动 |
| 105 | 04:57 有会话在共享工作区自行发布 HYDE（02d8236a7d0）→ 发布脚本在 johns 以外的机器上拒绝 --site hyde；NOW.md 置顶广播 | 09-28 完成（release-site.mjs：--site hyde 且用户名不是 johns 即退出 2，HYDE_RELEASE_OVERRIDE 仅供甲方；NOW.md 置顶；发布会话确认不是它跑的）|
| 106 | 甲方 09-28：删掉发布脚本的「非 johns 机器拒绝 --site hyde」拦截（影响云端），由甲方自己把控 | 09-28 完成（release-site.mjs 拦截删除，NOW.md 置顶广播撤下；#105 的拦截作废）|
| 107 | 甲方 09-28（Search Console 截图）：/ar/feed.xml 无法抓取，其余 7 个 feed 成功 | 待甲方（线上 /ar/feed.xml 实测 200、82 条、XML 完整；源于 d36e2d988ef 才上线 feed，Google 读取时尚未上线或缓存为旧 404 → 甲方 Purge Everything 后在 Search Console 重新提交）|
| 108 | seo:indexnow:release 在 d36e2d988ef→2aa61283e53 的比较中 4 GB 堆溢出 | 09-28 完成（npm 命令加 --max-old-space-size=16384，实测跑通到构建号检查；等甲方 purge 后提交）|
| 109 | 多语言 SEO 会话 09-28：七语种产品标题 420 条 <30 字符（只剩「型号 + 品类名」）→ 生成器兜底补材质与供应商词到 ≥40；英文 5 篇 guides 标题 61–62 收到 60 内 | 09-28 源码完成（七语种短标题兜底：补译好的品类名（名字已含则用父类）+「工厂直供」，上限内才补；<30（日韩 <16）从 420 条降到 24 条，剩下的是品类名已在名字里的日语箱錠等；只改 seoTitle，843 行；英文实际 11 篇 >60，全部收到 ≤60）|
| 110 | 文案会话 09-28：源码 149bd21e187（5 篇指南首句直接给答案、7 篇 relatedModels、GEO 基准 45 题、runbook 第一屏）要发布 | 09-29 完成（r17 = e9a8b081015；前三次被拦：修订戳缺、七语种摘要过期（多语言会话 00e1f6afb46 重译）、seo-audit 的 sitemap lastmod 只比 datePublished（已改为也认 dateModified）；源站实测 legalName 为新全称） |
| 111 | 文案会话转交：甲方给出 LinkedIn 公司主页网址后，加进 siteSettings.social（进 sameAs） | 待甲方（网址未给） |
| 112 | 文案会话转交：公司英文法定名统一后 JSON-LD legalName 同步 | 09-29 完成（甲方定为 Canton Hyland Hardware & Building Material Co., Ltd.；legalName 读 content/site-settings.json，文案会话 43822915118 已改，JSON-LD 自动跟随）|
| 113 | 文案会话 09-29：源码 bbaacbc0372（公司英文全称统一、GEO 第一轮整理、runbook）要发布 | 09-29 完成（r17 = e9a8b081015；前三次被拦：修订戳缺、七语种摘要过期（多语言会话 00e1f6afb46 重译）、seo-audit 的 sitemap lastmod 只比 datePublished（已改为也认 dateModified）；源站实测 legalName 为新全称） |
| 114 | 甲方 09-29：已 purge、/ar/feed.xml 重新提交已通过 → 补交 r17 IndexNow | 09-29 完成（r16→r17 共 7,364 个 URL，200 OK）|
| 115 | 甲方 09-29：所有逃生锁推杆产品材质一律改为「铝合金锁体 + 铁推杆」（Aluminium Alloy body + iron bar），替换塑料等旧材质 | 09-29 源码完成（29 个推杆：material、三语规格 Material 行（无则补）、313 推杆材质→铁、316 删 ABS 外壳行、17 条三语摘要、302 卖点、七语种规格对齐 + 17 条摘要译文；BAU 307、新闻 316-D 句子；目录统计 112→108；不含 Trim/锁体/防撬扣 18 个）；r18 = 659599d1ed6 已上线（前两次构建原生崩溃自动重跑；一次因七语种前端词典未重生成被拦，已补）；源站抽查 313 / de 307 / es 311 均为新材质、无 ABS。待甲方：外把手/锁体/防撬扣是否也改（311 已定为 ABS 不动，见 #116） |
| 116 | 甲方 09-29：「311 的是 ABS，不动」→ 311 恢复原材质（英西葡 + 七语种），开模文章保持原样 | 09-29 源码完成（311 英西葡与七语种 specs/summary 从 329a12c80b4~1 还原，标题描述重生成；开模两篇不矛盾、保持原样）；09-29 完成（r19 = edf18289e16；源站实测 311 英文、德文为 ABS，307 为铝合金锁体） |
| 117 | 多语言会话 ae1464b7b2c（七语种推杆审校、刷新 sourceHash）+ 文案会话 4edd34d3ca3（推杆对比指南三语 + 七语、新闻 316-D 七语）要发布 | 09-29 完成（r19 = edf18289e16；源站实测 311 英文、德文为 ABS，307 为铝合金锁体） |
| 118 | 甲方 09-29：已 purge → 提交 r19 的 IndexNow（r17→r19） | 09-29 完成（e9a8b081015→r19，1,489 个 URL，200 OK）|
| 67 | 视觉优化表（轮播字体/断点、图文衔接、浮层进退场、动效节奏、放大跟手、点击区）属视觉会话；已做的只有卡片悬停（542fe41） | 大部分完成（216880a2c94 轮播与浮层动效 09-23 已上线；其余归视觉会话；09-28 核查更正） |
| 68 | LC04 面板/锁体尺寸、SSH018 照片、7 个采购问题的数字（产能、公差、备件年限等） | 待甲方（工厂数据） |
| 18 | 10-08 前后复查改过标题的页面点击率 | 等待（日期未到） |
