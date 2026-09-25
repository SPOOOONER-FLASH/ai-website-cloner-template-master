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
| 14 | 服务器装跳转规则（ANSI 网址 301） | 待甲方（手册 ③） |
| 15 | GA4 登记自定义维度 | 待甲方（手册 ②） |
| 16 | 隐私政策页内容 | 待甲方 |
| 17 | 路由收敛为 `[locale]`、构建产物不进 git | 待甲方 |
| 19 | /services 元数据改为 OEM / 私人品牌领头（Hyde 文案 09-24 请求） | 09-24 完成（标题「OEM & Private-Label Door Hardware Manufacturer in China」） |
| 20 | 西葡 services 路由（/es/services、/pt/services：hreflang、前缀、locale-route-parity），建好通知 Hyde 文案写西葡文案 | 09-24 完成（/es/services、/pt/services 上线待发布；镜像、菜单、测试已改；西葡标题 OEM / marca propia 领头） |
| 21 | 8827、8828 是空壳重复页（无规格，主图与 8827 SSET / 8828 SSET 相同）：301 到 SSET 款 | 09-24 完成（并入 SSET，两张装门图随迁，productMerges 301；计数句交文案会话） |
| 22 | HY006 应用字段写着「KFC 锁体」，他人商标，删掉 | 09-24 完成（三语去商标名，保留用途） |
| 23 | 559 画集 5 张带 STAHLOCK 水印的图（已撤下）是否可用 | 待甲方 |
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
| 41 | 甲方回复 ④：G-X7EMRX2V2X 删（手册 ④ 写了后台步骤，甲方操作后实测只剩一个资源）；GTM 改为 load 后加载 | 待甲方（删除）；GTM 见 #42 |
| 42 | GTM 改为页面 load 后加载（官方代码原样保留在 head，hoist 正则兼容），发布后实测 HTML 有代码、gtm.js 下载、dataLayer 有 gtm.js 事件 | 09-24 完成（069a44f1ae8 上线；无头 Chrome 实测：gtm.js 在 window load 同一刻请求，GTM-MQHHPGJL 生效，dataLayer 有 gtm.js / gtm.dom / gtm.load；G-RBTE7KF82P page_view 1 次） |
| 43 | 甲方要 copper hinge 搜索导到黄铜合页：材质字段为 Brass 的合页（B024、B025）描述加三语「买家常叫 copper hinge」，不写纯铜；「fix the door」不再当功能进描述（7 条） | 09-25 完成 |
| 44 | HYDE 发布（#43 + 发布会话 b795cc38ac9 邮箱统一 tec@、6fd3c2025d7 首页对齐），上线后实测 | 09-25 完成（77895fcdd16 上线；piano-hinge、铜合页指南 EN/ES、B024 描述、tec@ 实测正确） |
| 18 | 10-08 前后复查改过标题的页面点击率 | 等待（日期未到） |
