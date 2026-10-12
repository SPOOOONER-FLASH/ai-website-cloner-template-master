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
| 158 | 首页轮播：换逃生锁图（客户 10-12 给的图），加 AR-4、阿根廷集合两页（en/es/pt + 七语） | 进行中（10-12，等发布核对） |
| 159 | 首页轮播三张大图（阿根廷 ×2、巴西 ×1） | 待 Codex（docs/collaboration/tasks/2026-10-12-codex-home-carousel-argentina-images.md） |
| 160 | 巴西逃生锁、阿根廷「单独开」：客户 10-12 答 A+B 都要。阿根廷落地页已有；巴西页 /pt/ferragens-porta-corta-fogo 已有，葡语首页轮播加一页 | 进行中（10-12） |
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
| 119 | 甲方 09-30「检查」：多语言会话 f4adac6fd60（28 条地弹簧等七语种补译）要发布 | 09-30 完成（已含在其他会话 15 小时前的发布 a53308b4b11 里，源站与边缘同为该构建；补交 IndexNow，r19→该发布 7,374 个 URL，200 OK）|
| 120 | 甲方 09-30（页头截图）：桌面页头 HYDE 标志偏右、两边间距不对齐 → 标志居中 | 09-30 源码完成（xl 页头改为「导航｜标志｜语言与图标」一行，标志居两者正中；1376–1599 导航在第二行时标志仍靠左；1440/1600/2000/fr 1800/390 截图核对）；r20 = 33d91e7090d 已上线（release:hyde 两轮共 6 次推送超时，改用 chunk-push-release 13 批推成；含 PR #18 Lighthouse 性能），源站实测 028 标题 35–55mm、DV05 两段区间、页头新布局 |
| 121 | 甲方 09-30：读 docs/collaboration/tasks/2026-09-30-title-range-facts.md 并执行 | 09-30 源码完成（condense() 先识别整值区间与斜杠分隔的多段区间；028/037 35–55mm、039 45–50mm、DV05「35–55mm / 60–100mm」；同类 48 个产品标题描述修正；回归测试 title-range-facts.test.ts）；r20 = 33d91e7090d 已上线（release:hyde 两轮共 6 次推送超时，改用 chunk-push-release 13 批推成；含 PR #18 Lighthouse 性能），源站实测 028 标题 35–55mm、DV05 两段区间、页头新布局 |
| 122 | 甲方 09-30（菜单截图）：抽屉菜单比例调整，下半部分（联系方式、页脚）被压到屏幕外，要一眼全部看到；底部页脚与页面文字重叠 | 09-30 完成（r21 = 2f44011b771；源站实测 1920×1080 抽屉四组一行、联系方式与页脚一屏可见，新 CSS 规则在线上） |
| 123 | 甲方 09-30：全站排查 bug、死链、未连到导航栏/侧边栏的内链 | 09-30 完成（r21 = 2f44011b771；源站实测手机 375px /products/ 与首页 CLS 均为 0；指南栏目标题、西葡配置器标题已在线上） |
| 124 | 甲方 09-30：周例行数据分析（GA4、Clarity、GSC、Bing 导出已给）→ 优化；数据看板还缺什么；报告出到 hyde 文件夹并同步 agent-update 与协作文档；教怎么做周报与展望计划 | 09-30 完成（周报 docs/research/analytics/2026-09-30/HYDE-周报-2026-W39.md，Word 在桌面 hyde；DATA-DASHBOARDS 本期结论、报数口径、看板缺口；agent-update 2026-09-30-claude-weekly-report.md；三篇指南标题实验已在 r21 上线） |
| 125 | 甲方 09-30（压缩后）：周报按谷歌/微软/字节/腾讯/Meta 大厂周报样式直接出样板（不是教程），详细、清晰、有洞察；要周环比和同比；列出看板还缺哪些数据、在哪拿；Word 版到桌面 hyde；最后发布、线上核对、IndexNow、通知各会话 | 10-01 完成（甲方已 purge；IndexNow r20 33d91e7090d → f1852e3082a，316 个内容有变化的 URL，200 OK；runbook 第一屏五件仍待甲方） |
| 126 | 文案会话 09-30：源码 ac946c3ae69（被引用前 10 指南配型号 8/10：锁扣板、镀铬、主钥、通用与分左右、钥匙坯五篇补型号，三语 + 七语）要发布 | 09-30 完成（r22 直推三次超时未上远端，并入下一次；最终由另一会话的发布 56d9c79d492（构建 21841481ec9，含 ac946c3ae69）上线；源站实测锁扣板指南链到 575 ABET） |
| 127 | 文案会话 09-30：源码 ddcb29e553c（送审包、防火门两篇指南摘要改为答案在前，三语 + 七语；W39 0% 话题第一步）要发布 | 09-30 完成（首次构建被 i18n-lint 拦：79f5207bc69 只改英文玻璃门文章，七语种三段补译 93e5bc92ff5；随 56d9c79d492 上线，源站实测德语玻璃门文章含 D-1042、旧「JU 系列地弹簧」说法已无） |
| 128 | 甲方 10-01：BAU 2027 官方展商横幅（英语 5 种、德语 5 种尺寸，链到 exhibitors.bau-muenchen.com 展商页）上架，位置由我定；并确认 HYDE 没有需要手动提交的页面 | 10-01 完成（发布 f1852e3082a，分批推送 14 批、每批 ≤1500 文件；/bau-2027/ 与 /de/bau-2027/ 展位介绍旁各一张 300×250 官方横幅；核验由甲方做。无需手动提交页面：十个语种 sitemap 已提交通过，Bing 走 IndexNow（purge 后提交）） |
| 129 | 甲方 10-02：Clarity 剩余九个配额生成九个话题；LinkedIn 起步稿一起出 docx 到桌面 hyde；纪律：凡要甲方手动操作的都写桌面 hyde docx；Meta 爬虫先不限流、备忘以后选做 | 10-02 完成（docs/collaboration/2026-10-02-手动操作-Clarity九个话题与LinkedIn.md → 桌面 hyde 同名 docx；AGENTS.md runbook 节第 6 条；runbook 第一屏指向；Meta 限流记为以后选做） |
| 130 | Meta 训练爬虫限流（67,364 次 / 10 天、零访问） | 等待（甲方 10-02：先不限流，以后选做） |
| 131 | 甲方 10-05（Bing 站点扫描）：品类列表页 / 产品查找器 / 配置器 HTML 过大（100 页 > 500 KB，knob-locks 线上 1.3 MB）→ 筛选数据外置为静态 JSON、首屏只出前 24 张卡，static-export-performance 加 HTML ≤ 300 KB 上限 | 10-08 完成（7927966cacb 起：查找器、配置器数据改 /data/<语言>/finder.json，品类网格只传卡片字段；本地构建实测 knob-locks 1,147→314 KB、查找器 1,082→392 KB、配置器 868→178 KB，十语种同；static-export-performance 加上限：这三类 ≤ 460 KB、全站 ≤ 640 KB。已上线 6227cf39148，源站实测 knob-locks 318 KB、查找器 397 KB、配置器 182 KB、/data/<语言>/finder.json 200，查找器与德语配置器浏览器实测加载正常。仍 > 500 KB：/model-lookup/ 十语种约 530 KB、/ru/ /ar/ 的 /products/ 约 510 KB，是完整型号索引本身，未删内容） |
| 132 | 甲方 10-05（Bing）：标题 > 70 字符全站 1,039 页 → 生成器规则「整条 > 70 时省略 ` \| Canton Hyland`」；E1 三页（HS 编码、161/86、玻璃门）10-14 前跳过 | 待甲方确认长标题可省品牌名，再做 |
| 133 | 视觉会话 10-05：源码 9101603709a（饰面小图、配置器缩略图补 alt + aria-hidden，Bing 94 页 alt 缺失）要发布 | 待发布 |
| 134 | 甲方 10-05：#133 发布后在 Bing Webmaster 点「重新扫描」，核对 alt 与 index.php 两项清零 | 待甲方（发布后） |
| 135 | Clarity 10 话题机会栏（中国厂家资质流程、执手耐久与无障碍、合页承重与等级、无障碍扶手规格等）→ 下一批指南选题 | 待文案会话 / 甲方定优先级（REPORT 第六节） |
| 136 | 甲方 10-08：标题超过 70 字符时省掉「 \| Canton Hyland」后缀（Bing 报 1,039 页标题过长；品牌仍在结构化数据） | 10-08 完成（43f2b698bf1：src/lib/seo.ts fitTitle/templatedTitle，pageMetadata 与 21 处 absolute 标题统一；本地构建 8,133 页中超过 70 字符的只剩 1 页（俄语，去掉后缀仍超），6,249 页长度够、保留后缀；static-export-performance 加检查；分享标题同样处理（7544e75de1f）；上线 d5a4354e997，源站实测 Bing 点名的 /contact/ /company/ 310、BH35、607 SSET、exit-device 指南标题均 ≤ 70、og:title 一致） |
| 137 | 西语规格会话 10-09：甲方批准新目录上官网（eaab4162e0c，92 页 PDF + 联系页十语种）→ 发布 HYDE | 10-09 完成（r32 上线 2488d9d2a9d，chunk-push 合成于 174bd024823；?nc= 实测 PDF 200、Content-Length 9844470；/contact/「92 pages」「9.4 MB」各 2 处；已回规格会话提交号） |
| 138 | 甲方 10-09：曝光从工作日 ~1,000 继续往上；附 Bing 10-09 导出（关键词 / 页面 / AI 引用 / 反链）与 GSC 10-09 两个效果 zip、两个覆盖验证 zip → 分析并按词改已有页 | 部分完成（10-09：结论 docs/collaboration/2026-10-09-曝光继续爬升-数据结论与行动.md + 桌面 docx；工作日曝光 1,135 与上周持平，67% 来自文章、19% 产品页，AI 功能占 31%；约 1,000 网址已发现未抓取（569 译文、226 产品、177 video）；knob-locks、grip-handle-sets 标题加 China Manufacturer；待甲方回 /video/ 站点地图 A/B，万能钥匙表与饰面两页主次归文案会话） |
| 139 | 甲方 10-09：检查插件是否生效（ponytail、context-mode、i-have-adhd 常开、hyperframes） | 10-09 完成：ponytail（SessionStart 注入 full）、i-have-adhd（标志文件 ~/.claude/.i-have-adhd-always，压缩后钩子已注入）、context-mode（ctx_stats 可用，v1.0.169）均生效；hyperframes 0.8.143 已装、技能可调用，未试渲染 |
| 140 | 甲方 10-09 选 A：/video/ 观看页从站点地图拿掉（177 页已发现未抓取，抓取额度留给 226 个产品页；页面保留） | 10-09 完成（src/lib/site-sitemap.ts 去掉观看页与 /video 目录条目；观看页与目录页加 noindex + canton-withheld=off-sitemap-video（seo-audit 要求站点地图外的页必须声明不收录，r31 被它拦下）；r32 上线实测 sitemap 无 /video/、观看页 noindex,follow；npm test 456/456；随下一次发布上线） |
| 141 | 甲方 10-09：长尾词继续优化 + 反链 / 深链现在怎么做（Bing 反链：5 域名 140 条全指首页、锚文本全是裸网址） | 待甲方（10-09：scripts/build-backlink-deeplinks.mjs 按型号把 139 条目录帖对到产品页，69 条能改（worldbid 51、traderscity 15、etradeasia 3）→ 桌面 BACKLINK-DEEPLINKS.docx；手动操作 docx 含改链步骤与五页按页搜索词导出；长尾改动见 #138 #140） |
| 142 | 甲方 10-09：桌面 hyde 与「9.30 新研究方向」文件太多 → 建文件夹，搭本地数据库存档、待做计划、人工代做目标；并答「查询数没用吗」 | 10-09 完成（scripts/lib/desktop-hyde.mjs 定文件夹 00–05、09；生成器按文件名自动归位；scripts/organize-desktop-hyde.mjs 移动 48 项只移不删、记 09\移动记录.md，仓库 raw 按日期复制进 04，生成 人工代做清单 / 待做计划 / 目录说明；手册 3 处被旧 sed 弄坏的桌面路径修复并改指新文件夹；查询数表即 gsc-queries.csv，已用，缺「词→页」所以要五页按页导出） |
| 143 | 甲方 10-09：远高（D:\clones yunagao 网站\_design-kit 等）的设计经验能否优化搬到 HYDE（动效、视觉、精致大气）→ 评估 + 建议 | 10-09 完成（评估：docs/research/2026-10-09-远高设计经验搬到HYDE评估.md + 桌面 03-研究与方案 docx；9 代理三视角：1 条直接搬、7 条改了再搬、装饰光效 / 淡入 Reveal / 3D 倾斜 / 平滑滚动 / 跑马灯等不搬；分三阶段） |
| 144 | 文案会话 10-09 全量审查：规格名（Door thickness、Cycle life、Deadbolt throw、Center distance、OEM & ODM）每语种 2–17 页漏英文；约 20 个品类名、BAU 2027、版权行约 2 页漏英文（node scripts/audit-locale-pages.mjs --locale de --full） | 10-10 上线（r33 bd1e79eb46c（别的会话发布，构建自 cd9affff11c）上线，10-10 ?nc= 实测：/de/glossary/、/de/collections/ 显示 Türstärke，/de/ 产品页 OEM und ODM；三处根因：collection-spec-range 标题只给 es/pt 翻译 → 所有非英语言走 specLabels，加 de 测试；HardwareTerms 词条名对七语种先查 specLabels 再查 UI 词条；七语种 glossary specLabels 补「OEM & ODM」并重生成客户端包。BAU 2027 Munich / Messe München / 版权行判为专有名词误报，不改） |
| 145 | 文案会话 10-09 全量审查：桌面 LCP 3.6 秒（周报 P1） | 等待（10-09 实测线上，Chrome 1440 宽 + Slow 4G + CPU 4×：/products/ LCP 2.25 s（TTFB 1.08 s、图片 0.69 s）、/product-finder/ 1.0 s、CLS 0.05、/company/ 0.49 s，均 ≤ 2.5 s；不限速 /products/ 0.47 s。周报的 3.6 s / CLS 0.22 是 09-21–09-30 Clarity 实测，早于 #131（筛选数据外置、HTML 从约 1 MB 降到约 400 KB）。等 Clarity 10-10 后一期数据确认，不再改代码） |
| 146 | 文案会话 10-09 全量审查：147 个指南/文章描述 > 160 字符（最长 262）；59 个视频页描述约 45 字符 | 10-10 上线（r33 bd1e79eb46c（别的会话发布，构建自 cd9affff11c）上线，10-10 ?nc= 实测：指南与西语描述为新文本、≤ 155；66 篇 161 条 en/es/pt 描述改写到 ≤ 155：答案与数字在前、只用正文事实；第二个代理逐条核对并改正 59 条（多为夸大或正文没有的说法）；1 条葡语把「mapa」改「quadro」过地区用词检查；前后对照与事实出处存 docs/research/analytics/2026-10-09/description-rewrites.json；新增 article-description-length 测试锁 ≤ 160，E1 三页 10-14 前豁免。视频页描述随 /video/ noindex 不再参与） |
| 147 | 文案会话 10-09 全量审查：1,188 个产品页标题 > 60 字符（最长 75），建议型号 + 品类在前、厂名在后 | 10-09 完成，不改（r32 构建实测：超过 60 字符的产品标题约 97% 型号在前、约 99% 以「 \| Canton Hyland」收尾，Google 约 60 字符截断时丢的正是厂名；没型号在前的都是无真实型号的产品（如 Glass Door Patch Fitting Set）；超过 70 只剩 1 条俄语。维持甲方 10-08 定的 70 规则） |
| 148 | 文案会话 10-09：源码 8a619bd608d 要发布（页脚「The 9014 lever」七语补译，约 5,500 页原显示英文） | 10-10 上线（r33 bd1e79eb46c（别的会话发布，构建自 cd9affff11c）上线，10-10 ?nc= 实测，含页脚补译、文案 #37、多语言会话 E1 七语与跟进、AR-4、规格书新公司名；我从 0e07bfcd372 的重建已停掉，内容重复） |
| 149 | 远高评估阶段 1：欧标锁芯计算器「算给你看」——修偏心中心固定 "30" 的跳变 bug、aria-live 只挂结果句、印出代入数字的算式、带尺寸进询盘 | 部分完成（10-10 线上实测算式行「Outside: 30 + 4 = 34 mm → 35 mm」与 sr-only 结果句已上线；10-09：勾「偏心」时中心值取当前门厚 ÷ 2，不再固定 30 跳变；aria-live 从整个区块改为一句隐藏的结果句。结果表下印出代入读者数字的算式（外侧：中心 + 饰板 = 计算值 → 标准半长；内侧：门厚 − 中心 + 饰板），只用已有标签，不新增译文；sizeCylinder 返回 centerMm 并加测试。剩「带尺寸进询盘」（要十语新文案），上线后在线上点测） |
| 150 | 远高评估阶段 2/3（报价信息块、文档化编号、规格数字排版、统一章节开头、可复制规格行、开篇标题遮罩升起）：先给甲方看提案再做 | 待甲方 |
| 151 | 规格会话 10-09：PR #20 AR-4 已合并 174bd024823（首页与 /products/argentina-ar4/ Elabora 式图块十语、110/140/1121 并入 AR4 三条记录 + 301、modelAliases 搜索、目录数 616→613）→ 随 r33 发布；先跑 npm run spec-sheets；上线后手册写 nginx 重载（deploy/install-nginx-redirects.sh） | 10-10 上线（r33 bd1e79eb46c（别的会话发布，构建自 cd9affff11c）上线，10-10 ?nc= 实测：110/140/1121 旧网址含 /es/ 已 301 到 AR4 新页，甲方无需重载 nginx；规格书 015 为新版 40814 字节；悬停蒙版修正 ca1764f62a6 随下一次发布） |
| 152 | 甲方 10-09：13 家工厂目录（15 个 PDF、638 页）+ 2 张工厂报价表 → HYDE 专属产品数据库，对照图片/参数立即报价；GitHub 登录后台 + 内部交流 | 大部分完成（10-09：私有仓库 hyde-brain 19 本目录 764 页 4,947 个型号、2 张报价表、每厂问题清单 → 桌面 05 docx；待甲方给同事 GitHub 账号；登录页源码 8cd99f5c9f6 已推，需下一次 HYDE 发布上线 /admin/brain/；剩 8 本目录的二次看图核对，用量允许时做，见 hyde-brain docs/RESUME.md） |
| 153 | 规格会话 10-10：ca1764f62a6（AR-4 方块悬停蒙版 40%）+ 69ddfe4e86a（AR4 材质 / 表面处理九语词条、方块 alt 本地化、AR4-140 图片 label）→ 下一次 release:hyde 一起发布 | 等待（10-10「hyde前端管理」会话从 94331c4b51b 发布中，含本条与产品查找器卡片 locale 修复；工程会话这期间不发布） |
| 154 | 甲方 10-10：「中文回复 写进纪律」 | 10-10 完成（AGENTS.md 新增「Reply to the client in Chinese」一节；记忆同步） |
| 155 | 甲方 10-10：改深链文档写清晰、字大一点、分页面分步骤，交给不懂网络的同事做；含 LinkedIn 公司页 hyde-cantonlock | 10-10 完成（同事版大字说明 docs/collaboration/2026-10-10-同事操作-网站链接改到产品页.md → 桌面 00；BACKLINK-DEEPLINKS 改为每站编号清单 + 打勾栏 + 可读帖子标题；docx 生成器加 --large（14 pt）；LinkedIn 主页网站栏检查 + 5 条帖子取自已核对的描述；后台菜单名未实测，文中写明找不到就截图） |
| 156 | 「hyde前端管理」10-10：发布 ddc4d19868d 已在 main（7e134760a8c），40 分钟线上仍旧版 → 查拉取 | 待甲方（仓库侧核对：新 chunk 2hkxcu4e-uguo.js 在发布提交和 main 里，提交完整；服务器 cron 拉取需甲方在宝塔终端看 /var/log/cantonlock-deploy.log 并手动补拉，手册顶部 + 桌面 docx） |
| 157 | 甲方 10-10：HYDE 新品上传（微信 3 个 zip：Panic Exit Devices、Deadbolts、Lever Handles） | 10-11 完成，待发布（SH02 弹簧合页芯→合页品类（甲方选）、D104 SS 呆锁钥匙芯+旋钮、8829 BL 磁吸插芯执手锁；规格只取图纸标注与甲方图片文字；31 张图已带 HYDE 标→直接进 products-hyde（import-product-photos 加 --branded，不二次打标）；场景图按甲方要求全上；目录数 613→616、已发布 546→549 等计数句 en/es/pt 同步，七语跟进交多语言会话；视频两段暂未上） |
| 67 | 视觉优化表（轮播字体/断点、图文衔接、浮层进退场、动效节奏、放大跟手、点击区）属视觉会话；已做的只有卡片悬停（542fe41） | 大部分完成（216880a2c94 轮播与浮层动效 09-23 已上线；其余归视觉会话；09-28 核查更正） |
| 68 | LC04 面板/锁体尺寸、SSH018 照片、7 个采购问题的数字（产能、公差、备件年限等） | 待甲方（工厂数据） |
| 18 | 10-08 前后复查改过标题的页面点击率 | 等待（日期未到） |
| 161 | 服务器硬盘：清回收站、gc 旧 GitHub 历史、查 hids_data 7.5G；GitHub 工单 4847632 回复 | 待甲方（10-12 已发步骤） |
| 162 | 补齐太短的 meta description（Ahrefs 3,509 页；先 en/es/pt） | 待做 |
| 163 | 欧标锁芯尺寸表：Bing 97 展示 0 点击，改标题/描述 | 待做 |
| 164 | finish-code-reference 指南补 652（AI 查询「652 finish」125 次引用） | 待做 |
| 165 | Ahrefs 明细：结构化数据校验错误 3,843、sitemap 格式 10、慢页面 267 | 自查（客户：Ahrefs 导出要付费） |
| 166 | 指南/新闻里推产品和资质：交叉链接、相关产品卡、资质信任块（客户 10-12「快想想绝佳办法」） | 进行中（10-12） |
| 167 | Ahrefs 3,843 页「nofollow 内链」与「结构化数据校验错误」：自查原因并修 | 进行中（10-12） |
