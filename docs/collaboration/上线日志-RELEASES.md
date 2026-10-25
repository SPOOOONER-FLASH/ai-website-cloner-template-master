# HYDE 上线日志（cantonlock.com）

> 自动生成：`node scripts/build-release-log.mjs`（每次 `npm run ship` 也会更新）。不要手改。

每一版 = 一次真正上线的发布。版本号 `v年.月.日.当天第几版`；**Hotfix** = 这一版只带修复，**Update** = 带新内容或改版。
「改动」是上一版之后、这一版构建时进入主线的全部源码提交。

**线上现在是哪一版**：打开 https://cantonlock.com/release.json （看 `version`）。服务器在发布后 5 分钟内拉取；Cloudflare purge 之前，不带参数的页面可能还是旧版。

最近 30 天共 70 版。

## 2026-10-19

### v2026.10.19.3 · Update · 10/19 20:27

发布提交 `948bb90afece`，构建源码 `a78b924e0a58`

- 四个工具页上线源码：HS 编码查询、表面处理代码对照、万能钥匙方案、开门方向判断（十种语言，带产品推荐） `656c90204dd5`
- 每周 SEO 复盘第 ②③④ 步脚本；SEO 帖子结论；操作手册加「查人工处置、导出外链」 `7b018b5671cb`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.19.2 · Update · 10/19 03:59

发布提交 `c54cf6ff6c17`，构建源码 `250bc65319c2`

- 第 1 周 5 篇新文章的封面补白到 16:9（发布被 audit-image-fit 拦下：方形产品图在宽框里被裁掉 44%） `2180670084bf`
- 闭门器安装方式指南补上 JU-051、JU-088：标准臂与滑轨臂实例（十种语言） `cc4080ab0d12`
- 新指南：印度门五金 HSN 编码——8301、8302 全部八位税目与归类逻辑（十种语言） `a311b40bae23`
- 第 1 周文章 5 篇上齐十种语言：天地插销选型、钥匙系统表（附模板）、缎面铬 vs 缎面镍、防火门球锁执手科普、钥匙齿形唯一 `affe249add37`
- apply-image-audit：换了主图时提示重出响应式图（deploy:prep 会拦没有 320–840w 变体的主图） `af61ce03f79b`
- （另有 5 个只改文档的提交，未列出）

### v2026.10.19.1 · Update · 10/19 00:19

发布提交 `6157aea1ef17`，构建源码 `e35b030fe3d6`

- 6068 新主图补响应式尺寸与图片配置（发布被 generate-editorial-srcsets 检查拦下） `c018806244ac`
- 产品页撤下审计不通过的 225 张图（168 个型号）；两张主图换成实拍；编辑图交 Codex `6e37b38b5526`
- docs：广交会动线加远高/惠恩（阀门 9.1、水泵 6.1、净水 2.2）、目录清单、采购方 5 问 `2f1694629ac3`
- docs：广交会 3 小时动线图 + 拍摄指南（机位、视频、审美五问）；runbook docx 生成器支持嵌图 `c92a967ceee5`
- 雷茵站联系邮箱改为 tec@cantonlock.com（甲方 2026-10-17 指示） `84dc07d6d0bd`
- HYDE 品牌包生成器：5 种组合 × 墨/白，SVG/PDF/PNG 全尺寸 + 头像 favicon + 规范 PDF `9e5319ebdc0a`
- HYDE 锁架两款配色简模：黑配白 HYDE、白配黑 HYDE `c460ba45d4af`
- cantonlock.com 屏蔽中国搜索/AI 爬虫：robots 分组 + nginx 403 + Cloudflare 操作说明 `9a111afdbe2e`
- BAU 展位定稿为甲方选定的横带款，套用搭建方图纸尺寸 `82167f73dac9`
- BAU 展位按搭建方图纸重做：1.95–2.95 m 图片带，420×370 模数共 48 张，加大拉手和天地轴 `18bc854be6de`
- BAU 展位：展板上方三面墙横带 + 柜台正面（按搭建方效果图建模），墨色/白色两版 1:10 生产文件 `b136f40ef8de`
- BAU 展位方向 E「单品主视觉楣头」（参考 BAFB）：墨色楣头 5 格单品大图 + 型号 + 规格标签；对比总图改 5 格 `e85aa1d93f72`
- BAU 展位：展板保留挂墙，四个方向（杂志大片/墨色画廊/工程图纸/产品目录）的展位建模场景预览 `0af67c44bf8b`
- BAU 展位喷绘第四版：撤工厂照片，按品类排满官网实拍产品小图（阿里热卖、四柱锁体、不锈钢执手、巴西逃生锁、阿根廷锁体、新品） `53f04e94d352`
- BAU 展位喷绘第三版：参照头部品牌做法，楣头改为一句大字主张；调研报告 `9e028e5d1b98`
- BAU 展位喷绘第二版：工厂实拍栏（冲压/抛光/装配）、扫码二维码、底边事实与联系方式 `7964f89b323c`
- BAU 2027 C4.523 墙面喷绘：方案图 + 后墙/侧墙 1:10 生产文件（15 cm 出血） `89d8bad25704`
- 计算器带尺寸进询盘、check 修红、十语目录数修正、七语镜像补齐（界面 74 句 / 037 PS / 按段补丁） `8b72e68cec9b`
- （另有 5 个只改文档的提交，未列出）

## 2026-10-14

### v2026.10.14.3 · Update · 10/14 04:17

发布提交 `7c32c4b59776`，构建源码 `90919c04edc2`

- 四个表单加 hCaptcha：Web3Forms 已强制验证码，未带 token 的询盘全部被拒 `2083674c9c9c`
- 发布不再依赖 GitHub：拉不到 GitHub 时构建本机已提交的 HEAD，照样先同步 GitLab 上线 `f0a42135e72c`
- 037 PS 新品补生成 SEO 标题与描述（发布被 titles:check 拦下） `4dc6ea7bb59f`
- 发布先同步 GitLab 再推 GitHub：GitHub 不通时不再卡住上线 `3916a2ea6aaa`
- 037 PS 上架（037 的通道款外侧球形执手）；撤回「看不到锁舌」这条判图理由 `fa7ad4e729ac`
- 菜单底栏：Buy on Alibaba / Contact 改成显眼按钮；社媒加 eBay `5cc0c8ce125d`
- 全站产品图审计：2,798 张逐张判定实拍/生成，963 张按对照清单核对，不通过 247；AI 出图标准给美工 `419f1e1f2d24`
- 上线版本号按版本日期续号：跨午夜提交的版本不再占用次日第 1 号（v2026.10.14.1 因此空缺） `f90532ac51f2`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.14.2 · Update · 10/14 02:27

发布提交 `583926419015`，构建源码 `1fd9acd4305e`

- 工厂激光切割机照片：撤掉 AI 2× 放大（字被改成乱码），改回原图 + 普通放大 `1f4a1bacc7f4`
- 上线日志按版本号的日期分组（提交跨过午夜时不再归错日） `4bb0d053caab`
- （另有 3 个只改文档的提交，未列出）

## 2026-10-13

### v2026.10.13.13 · Update · 10/14 00:17

发布提交 `6e9eb8130415`，构建源码 `727ac31be970`

- 308: three of the five held images go up after the side-by-side check `1d93389fa56f`
- 过短产品描述第二道兜底：补「广东制造、交期 30 天起」（十语已审措辞） `c612fa0baec5`
- Codex 图片规矩补充：产品可按实拍图渲染，须逐张与实拍图核对（甲方 10-13） `ffb17a9c66bc`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.13.12 · Update · 10/13 23:31

发布提交 `727ac31be970`，构建源码 `920f6e97a5a2`

- 308-S and 308-D: new photographs and video; old 308 retired with a 301 `59ab59ea1dee`
- 导出检查 check-article-routes：十语每篇文章页必须有买家区块和 /contact/# 报价链接 `15d89a8be0eb`
- Codex 图片规矩：允许实拍图合成场景/安装图（甲方 10-13），取图改为站内 public/images/products `3ef5c435212f`

### v2026.10.13.11 · Update · 10/13 22:33

发布提交 `e552b546c120`，构建源码 `fecab66d634e`

- 上线日志：每次 HYDE 发布有版本号（vYYYY.MM.DD.N），记录带上线的改动，线上 /release.json 可查 `333033d4d086`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.13.10 · Update · 10/13 20:43

发布提交 `68fe33e76db4`，构建源码 `8949d6ff5bca`

- 首页开场段西/葡「价格表」链接改指英文页，解开 audit-dead-links 发布阻断 `96446fb3bf18`
- 首页 1998 Hyland 标志补 2x srcSet，解开 static-export-performance 发布阻断 `58a249668835`
- Events, FAQ, menu labels, homepage chapter with the 1998-2026 mark, guide cover on news `3186fdcf7e66`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.13.9 · Update · 10/13 19:45

发布提交 `0c58dddea2ce`，构建源码 `58dd7fc8e7d9`

- Company: factory photographs drift lightly on scroll `fc70ac9fa551`
- Long reads: key-points table and margin figures (readingAids) `6aa8a1e848b2`
- News articles read like guides: contents, progress, model rail `77befac2e1e2`
- （另有 4 个只改文档的提交，未列出）

### v2026.10.13.8 · Update · 10/13 10:01

发布提交 `e73a0b545415`，构建源码 `b518ecc6eef9`

- 十语 AI 引用检查：新增 /<语种>/llms.txt，robots 放行，根 llms.txt 链接 `adbaa53286f6`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.13.7 · Update · 10/13 09:15

发布提交 `7f29e128b50d`，构建源码 `36b7fb6142b5`

- llms.txt 加「Guías en español」：46 篇西语指南的 /es/ URL 与西语摘要 `7812bd68be9f`
- 新指南（西语优先）：从中国进口门五金到墨西哥——进口商登记、报关行、报关单、税号与 NOM 标签（十种语言） `df59dce1e6de`
- 新指南：逃生装置锁闭方式——明装、明装天地杆、暗装天地杆、插芯式（十种语言） `f4613a7ca494`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.13.6 · Update · 10/13 08:49

发布提交 `36b7fb6142b5`，构建源码 `c815e28653c0`

- Header: every shelf opens with a ruled ledger; Resources items carry counts `f6eafa34171f`
- 新指南：防火门年检中最常不合格的五金项（十种语言） `0938747851da`

### v2026.10.13.5 · Update · 10/13 05:11

发布提交 `c815e28653c0`，构建源码 `70894f541645`

- 发布：清除 194 个含下线保密内容的保留旧 chunk `70894f541645`
- 门表文章：新增空白门表模板（xlsx）和「换锁前要量什么」一节（十种语言） `1d87c265aa7f`
- 认证指南新增「如何核验门五金证书」一节（十种语言） `0b3772d0a8d1`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.13.4 · Update · 10/13 04:31

发布提交 `6a4774cf45f9`，构建源码 `2c7e7dffb704`

- ISO 9001 改为冲压厂的 ISO 9001:2015 证书（号 69125Q0026****，至 2028-10-29），删去 since 2002（十种语言） `6a88912d4a8a`
- 删去文章里涉及工厂内部流程的句子（老板 10-13） `6954ce56f98f`
- Codex 补图清单：阿里爆品 29+14、新上 42、阿根廷/巴西专栏（生成器 + 文档） `4a59d64ce1c9`
- 公司页加 12 张冲压厂车间实拍（去字样、3:2），十种语言配图说明 `7a3cf8dd9af0`
- 下架 4 篇涉及开模与下单流程的文章（老板 10-13） `6251198d82c7`
- Flyer: sixteen faces, 109 products, fire-door accessories page added `113460fff0da`
- （另有 5 个只改文档的提交，未列出）

### v2026.10.13.3 · Update · 10/13 01:01

发布提交 `bae0acf70535`，构建源码 `a733bfd85b14`

- Factory story photos: review fixes (claims match the frame; translations; records) `616c365d07b4`
- Factory story: the client-confirmed polishing and assembly photos (steps 4-5) `897601a3281f`

### v2026.10.13.2 · Update · 10/13 00:46

发布提交 `a733bfd85b14`，构建源码 `844915095811`

- Factory story: preload stage photos a screen and a half early `383725116ce5`
- Guides: headings from capitals to sentence case in seven languages (#66) `59e4e244cba5`
- Guide page: cover, section bars, contents | text | model rail, reading progress, prev/next `71dd20c77f84`

### v2026.10.13.1 · Update · 10/13 00:19

发布提交 `844915095811`，构建源码 `2fc7e61f2ecf`

- 巴西专栏加回 BR6-SM（带微动开关）：沿棱线重修，独立复核通过 `c33bd9829602`
- Product page: stage gallery, buy-box, section nav, chapters (approved preview) `1f20fa20a44a`

## 2026-10-12

### v2026.10.12.14 · Update · 10/12 23:53

发布提交 `2fc7e61f2ecf`，构建源码 `66dcac4ea63b`

- Homepage: opening curtain, smooth scroll, five-step factory story as in the demo `835ff5ea9f94`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.12.13 · Update · 10/12 18:08

发布提交 `ee8055a5b939`，构建源码 `929f90f144d6`

- 指南封面图链到对应产品；robots.txt 去掉 RSS；Ahrefs 日俄标题 `77c6c76aaa0e`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.12.12 · Update · 10/12 17:37

发布提交 `fe4e1c479cb5`，构建源码 `01afc4b78a28`

- 阶段 4：产品 JSON-LD 加 @id，文章 JSON-LD 用 mentions 只按 @id 指向相关产品；llms.txt 每篇文章附型号 `809961d15ea1`
- 阶段 3：文章正文首次提到的型号、表格行首型号链接到产品页（只匹配已发布型号，纯数字型号只在表格且属本文相关时链接） `bc75937c4f48`
- 阶段 2：按区块统计文章里的产品与询价点击（十语页面类型、item_list_name/placement、source_article）；修正 3 个无法解析的 relatedModels 并加测试 `46d0783cabee`
- Flyer: drop bathroom, floor springs, closers; add Alibaba flagship models `c402d73955bc`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.12.11 · Update · 10/12 14:45

发布提交 `b0fdf6f4a29e`，构建源码 `5c584718bd38`

- 询价表单：从 #model=… 片段进来时滚到表单（否则停在上一页的滚动位置，落在页脚附近） `988ea856abdf`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.12.10 · Update · 10/12 14:24

发布提交 `18d929ecfb19`，构建源码 `fe9b27090e19`

- 文章买家区块复核修正：下一步链接本地化、无障碍标签、门开孔路由；出口装置对比与 UL 305 两篇十语去掉已删的防火时长；规格书重出 `df38faab13b0`
- 文章买家区块：下一步链接走 localisedHref（价格单只有英文版，/fr/request/price-list/ 会 404） `586041d7b467`
- 指南/新闻推产品：ArticleBuyerBlock、报价链接改片段并去 nofollow、29 条文章路由；删除无证书支撑的产品认证说法（#166 #167） `7bd89795ed25`

### v2026.10.12.9 · Update · 10/12 13:42

发布提交 `dd314d5459b3`，构建源码 `07f62285a5f8`

- 巴西逃生锁专栏上线：36 张去字 + HYDE 水印照片、首页巴西模块 srcset、背景刷白 `c94bc0b74522`
- 巴西专栏上线准备：去 noindex、sitemap、全语种菜单与首页模块；去字脚本支持 --root/--specs；构建流程改为 retouched → webp → 水印 → --publish `1f6a877d8cbd`
- 传单：逃生推杆按甲方目录页选型、撤三款老锁体（#55）；ISO 问题记录（#56） `637e3e6297e5`
- 产品 meta description 过短：生成器补产品自己的 summary 首句（十语，#162） `9cb095fa7bc2`
- 指南：finish-code-reference 补 BHMA 652（十语）；欧标锁芯尺寸表十语 SEO 标题/描述（#163 #164） `705cefd58ce9`
- 地图加波兰、捷克、北欧四国；中山标「Zhongshan (Canton)」（#54） `d2574600dfc7`
- 首页：工厂故事换图改合成层并按文字切换、工厂图 2× 清晰化；地图按国家细分；移除 BAU、地图挪到数据条后（#51–#53） `b5223aa5e5a8`
- 巴西专栏：补 Saga（官方商店 4 件 → BR5-S、BR5-TK），共 40 个型号 `891501a5ab75`
- 巴西专栏：合成页（A 多图 + 选型器 + 表格），en/pt，noindex 未上线 `6800245879b3`
- 巴西逃生锁专栏：三套设计方案预览（A 型录 / B 门型 / C 专题），未上线 `d733e8a4591e`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.12.8 · Update · 10/12 08:06

发布提交 `07a7136601d8`，构建源码 `6550cdf25db5`

- 首页 AR-5 四格补 srcset（r43 被 static-export-performance 拦下） `f8cc37a1666f`
- 首页移除 Columns 栏目（客户：移除 colums） `5745b4b8924e`
- 清理首页撤下模块的数据与测试（#50） `572218d8b740`
- 首页阿根廷模块：照片位换成 AR-5 一排，标题改为阿根廷集合（客户：四个框上面加多一栏给 ar-5） `889e74cc0424`
- home-families：注明改 lead 后要跑的两个图片生成器（r41 教训） `dcdcaf45438a`

### v2026.10.12.7 · Update · 10/12 05:40

发布提交 `1eae32833297`，构建源码 `a6278bed0128`

- 首页品类索引的 8 张产品图补 srcset（r41 被 static-export-performance 拦下） `5faad45dc2a1`
- 工厂故事加回激光切割；首页撤下工厂故事之后的旧模块（#49） `6171e12708da`
- 首页加入三段：品类索引、出口地图、工厂故事（十语）（#48） `ad526cc50581`
- HYDE 动效四合一演示页（独立 Vite 项目，不进正式站）（#47） `d48b4732a48e`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.12.6 · Update · 10/12 04:57

发布提交 `9c580cd6606c`，构建源码 `087349bb14ed`

- 301：改名产品的 /video/ 观看页、旧 sitemap 文件名；页头 logo 链接加 aria-label `6223f9f45f4d`
- 首页轮播：逃生锁说明写回 306-D（客户：实拍合成）；葡语首页加巴西防火门一页 `f42d7b3bb93a`
- 阿根廷入口：葡语菜单也加（客户：「都加……对所有人展示」） `ea921e4b82d1`
- 阿根廷集合加首页与菜单入口（客户：首页根本看不到） `82d257b19620`
- （另有 1 个只改文档的提交，未列出）

### v2026.10.12.5 · Update · 10/12 04:29

发布提交 `087349bb14ed`，构建源码 `d64f447ea093`

- 首页轮播：换逃生锁大图（客户 10-12），加 AR-4、阿根廷集合两页 `979d66ccb85a`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.12.4 · Update · 10/12 03:34

发布提交 `8d863f50248f`，构建源码 `416dd88cec8c`

- 手册待办表更新（删 6 条）；新增 Ahrefs/Semrush 只看这几样；桌面整理跳过正在打开的文件和 Word 锁文件 `566c55408bd1`
- 阿根廷集合上线：去掉 OFFLINE/noindex，加入 sitemap，AR-4 页加入口 `d740408d9b21`
- Add unified-light egress hero review and source artifacts `a45b5f0d43e0`

### v2026.10.12.3 · Update · 10/12 03:18

发布提交 `416dd88cec8c`，构建源码 `3ead954fa4f6`

- 手册全量清理：旧条目合成 9 行表（做完回编号即删），已完成的移进 archive；桌面整理脚本也归档 00 文件夹里已完成的人工操作 `171a8df24fbe`
- 七语种：10-11 新上的 8829 BL、D104 SS、SH02 补译名、摘要、规格与标题描述（消除 3×7 重复标题）；引用能力审查按 。！？ 断句 `ce57bbe153a4`
- 阿根廷集合：51 张图去冲压品牌字（Candex/INDUSTRIA ARGENTINA/PICCOLO），重打 HYDE 水印 `25422cf0dc4c`
- 传单改单侧 6 面（12 面、80 款）；所有指示牌英文大中文小（#44、#45） `7060d2978b8b`
- 旧地址 hyde-ar4-101 补上 301；跳转生成器遇到过时导出时报错，不再静默跳过 `ab203bd0b091`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.12.2 · Update · 10/12 00:35

发布提交 `f752570b14a2`，构建源码 `4c1c1d5ad709`

- 规格书重生成：AR4-111 改名后补齐 `ad17be238d82`
- 7240 改名 AR4-101 → AR4-111（安全锁），旧地址 301，七语种同步 `0071ea58c9b4`
- 目录改墨白、招牌英文为主、传单改三折带折叠预览（#41–#43） `0214de4a20ec`
- 阿根廷集合：美式拼写；只登记英文+西语（PARTIAL_ROUTES）；站点地图；修图源优先；任务与授权记录 `0173ebed5b9f`

### v2026.10.12.1 · Update · 10/12 00:21

发布提交 `4c1c1d5ad709`，构建源码 `d928256ef6c3`

- 阿根廷集合页先下线（甲方 10-12：照片仍有冲压字样），notFound `8e2e4d7a3d10`
- （另有 1 个只改文档的提交，未列出）

## 2026-10-11

### v2026.10.11.1 · Update · 10/11 22:56

发布提交 `dd072f404d22`，构建源码 `99432814dae1`

- Argentina 预览页只在 en/es：列入 PARTIAL_ROUTES（解 r34 hreflang 拦截） `41108d53c905`
- GitLab 镜像脚本；Argentina 预览页 noindex（解 r34 拦截） `4978b5c9b904`
- 广交会物料改墨白两色；中文全称已确认（#39①、#40） `6bb1c0c04afd`
- 广交会物料：HYDE 标志精修与规范、风琴折传单、厂内标识（#38） `ca5d4d51a79c`
- 文章修订戳补齐（r34 被 stamp --check 拦下） `80a362d5a806`
- HYDE 新品三款：SH02 弹簧合页芯、D104 SS 呆锁钥匙芯与旋钮、8829 BL 磁吸插芯执手锁（#157） `8d872a44ccf2`
- 阿根廷产品集合（预览，未上线）：Candex 45 + Elabora 10，HYDE 水印，规格表 `638f1ffa46b4`
- Add calibrated outdoor egress hero preview and Blender scene `920c44f2459c`
- 改深链交给同事：大字分步说明 + 每站编号打勾清单 + LinkedIn（#155） `a1e386d5d6d7`
- （另有 9 个只改文档的提交，未列出）

## 2026-10-10

### v2026.10.10.2 · Update · 10/10 04:13

发布提交 `ddc4d19868d2`，构建源码 `94331c4b51b`

- 产品查找器结果卡片补传 locale：韩/西等语种点卡片不再跳到英文页 `94331c4b51b1`
- （另有 2 个只改文档的提交，未列出）

### v2026.10.10.1 · Update · 10/10 00:26

发布提交 `98fd1ab5720e`，构建源码 `501ff278c8b`

- Correct B homepage to an outdoor escape destination `12be639a3b5e`
- AR4：材质/表面处理九语翻译，方块图片 alt 本地化，AR4-140 图片说明去掉 slim `69ddfe4e86aa`
- AR-4 方块：悬停蒙版停在 40%（文字对比度达标），删掉未生效的 xl:text-h3 `ca1764f62a62`
- （另有 2 个只改文档的提交，未列出）

## 2026-10-09

### v2026.10.09.2 · Update · 10/09 21:41

发布提交 `bd1e79eb46c3`，构建源码 `cd9affff11c`

- Keep the approved hero provenance sidecar LF on Windows `76038948d6d9`
- i18n：七语种跟上 09-28 后的指南/新闻改动（#146 描述、计数 588→613 等段落、2 个标题） `c11497fc26c4`
- i18n：DV06 门镜七语种规格补 30–50mm (160°) 门厚与 160° 视角（跟英文） `d0bf09413dfc`
- i18n：E1 三篇指南七语种 seoTitle/seoDescription 按 r21 新英文重译（西葡对照组不动） `85bbad798366`
- Use approved B architecture for the homepage hero `cfe14122de71`
- 产品大脑登录页 /admin/brain/：GitHub 登录，数据只在私有仓库 `8cd99f5c9f69`
- 规格书重新生成：AR-4 四款上线 + 全部换新公司法定名称 `29498aea80da`
- chunk-push-release：按完整 stderr 判断被抢先推送 `93001854864c`
- 66 篇指南与文章的搜索描述改写：≤ 155、答案在前、事实核对（#146） `67774c4672de`
- 文章开头答案在前，第 4 批 9 篇，#37 完成（缺口 24 → 0） `5ec480974f9b`
- 锁芯计算器印出算式：外侧 中心 + 饰板 = 计算值 → 标准半长（#149） `4c7248c60ab5`
- 锁芯计算器：偏心起点取门厚一半；读屏只播一句结果（#149 前半） `5b73e7a0ce24`
- 文章开头答案在前，第 3 批 5 篇（#37） `6f7bf618dbfd`
- 文章开头答案在前，第 2 批 5 篇（#37） `78c119725aad`
- 七语种漏英文：品类规格区间标题、术语表词条名、OEM & ODM（#144） `f6f385df7f7e`
- 文章开头答案在前，第 1 批 5 篇（#37） `039454e16efc`
- SEO/AEO/SXO/AIO 全量审查；页脚 The 9014 lever 七语补译（#36） `fd334a7e3247`
- 桌面 hyde 按文件夹整理：本地数据库存档、待做计划、人工代做清单 `6858833f6f63`
- AR-4 module: Elabora-style category tiles replace the four product cards `5516c47cfd92`
- Name the four AR-4 models after their market families; AR4-101 from drawing 7240 `591b088a6563`
- （另有 5 个只改文档的提交，未列出）

### v2026.10.09.1 · Update · 10/09 02:49

发布提交 `2488d9d2a9d8`，构建源码 `3e5cefdf291`

- /video/ 观看页 noindex + canton-withheld（站点地图外须声明不收录） `180ff9dcf9b2`
- 饰面代码两页互相指向：新增 seeAlso（#34） `cee95849e6ef`
- 万能钥匙文章补「每把钥匙开几扇门」表和可打印的空白分级表（#33） `813f9473f807`
- 反链深链：目录帖按型号对到产品页（69/139）+ 甲方手动步骤 `7a509d732041`
- 饰面代码指南 seoTitle/Description 让位给主页 news/finish-codes-us26d-626-630 `6ad07ffda679`
- 站点地图拿掉 /video/ 观看页（甲方 10-09 选 A） `c4df59fb81ee`
- 曝光平台期分析（10-09 数据）+ 两个品类标题加 China Manufacturer `cd22f16e32c4`
- 目录两个版本：电子版 92 页上官网下载，印刷版 64 页给广交会 `222ad4b3803a`
- catalogue: both editions from one renderer — electronic 94 pages, print 68 `7e5affab41b3`
- catalogue: merge finish variants into one card; full-book plan; option A/B samples `84fe49c2e61f`
- （另有 6 个只改文档的提交，未列出）

## 2026-10-08

### v2026.10.08.2 · Update · 10/08 04:36

发布提交 `d5a4354e997c`，构建源码 `9aaee5aeef2`

- #136 分享标题（og:title / twitter:title）同样经过 fitTitle，与页面标题一致 `7544e75de1fe`
- #136 标题超过 70 字符时省掉「 | Canton Hyland」（甲方 10-08 同意） `43f2b698bf1a`
- 更正视频诊断：「视频不在观看页面上」= 视频不是页面主要内容，产品页本就不算，接受现状、不做观看页 `07a3cf93662c`
- catalogue: four sample pages (cover, factory, opener, product grid), print + screen `0ebc55470b1f`
- catalogue: vector QR codes to each family's page `e67d1dc8f402`
- catalogue: family heroes (cut-outs only), and five products the plate builder missed `05b8b0cb593b`
- Search Console 10-08 导出：五类都不是错误；新增可重跑的核对脚本 `e9d6f04486b5`
- catalogue: correct the fallback-font comment — Archivo does cover ≤ ≥ `a549762a01b2`
- catalogue: design system, Archivo fonts, 200-dpi placement guard `7f19b2d65bc1`
- DORA 报价定稿：按老板改价；删除首购减 200 `d1dcbce85061`
- （另有 5 个只改文档的提交，未列出）

### v2026.10.08.1 · Update · 10/08 02:35

发布提交 `6227cf391489`，构建源码 `175b891a2fb`

- #131 收尾：HTML 体积回归测试（三类页 ≤ 460 KB、全站 ≤ 640 KB），工程目标标完成 `ba1c3444efae`
- #131 HTML 过大：查找器、配置器的产品数据改为 /data/<语言>/finder.json，品类网格只带卡片字段 `7927966cacb3`
- DORA 报价：锁体首图换成实物照片（黑色圆头面板） `959444e41df2`
- 报价 DORA：首购立减 200 美元版本；报价表允许负数行显示 `7a4da8cc6809`
- 报价 肯尼亚：加锁体实拍图与图纸尺寸 `d8d953b0cc61`
- 报价：DORA v4 执手（家德乐黑色 19.5，亚镍备选）；南非锁体询盘草稿 `913eb5f750d4`
- 报价 DORA v3：合页按 2.5 进价，加执手行（单价待老板填） `fcf6aa3ad88b`
- 报价 DORA Doors v2：按客户 Hardware Order 数量、30/70、30 天、EXW；去球拉手，加门吸；合页 SS201 无有效进价暂 TBC `194a975e5160`
- 报价：DORA Doors（伊拉克）草稿 HY20261006；build-quotation 支持无目录型号的外采行（无 slug 不挂链接）；报价抬头同步网站：新法定名、tec@ 邮箱 `c3dbd0084603`
- 10-05 读数：Bing 站点扫描 / GSC 单页 / Clarity 十话题核实与分派（HTML 过大 100 页、标题 >70 全站 1,039 页、HS 编码为 E1 基线、alt 已修）；同步 LATEST、DATA-DASHBOARDS、工程目标 #131–135、TODO-MASTER 第 14 项、agent-update、甲方手动操作 docx `c919844bd3ab`
- 图片 alt：饰面切换小图、配置器缩略图补描述性 alt（型号+饰面 / 卡片标题），并 aria-hidden 避免读屏重复（Bing 2026-10-05 扫描 94 页报 alt 缺失） `9101603709af`
- Replace legacy logo on 309-D home hero with HYDE mark `eddbd995b510`
- Refine BAU notification band with frosted glass material `de35375459e8`
- Add compact Language navigation with rightward reveal `fb8d3bbe4989`
- Add four distinct HYDE navigation proposals `cd5fea87e5ec`
- Replace inaccurate home exit hero with 309-D double-door image `3a85cb22c212`
- Add three interactive HYDE homepage motion proposals `e3db1356df6f`
- Retain reproducible navigation proposal export and verified preview `5ddbedb5e4d2`
- （另有 12 个只改文档的提交，未列出）

## 2026-10-03

### v2026.10.03.1 · Update · 10/03 16:31

发布提交 `2b93f729ab86`，构建源码 `d2561423707`

- Remove HYDE mailbox and prioritize catalog downloads `7f3394e06df8`
- （另有 2 个只改文档的提交，未列出）

## 2026-10-02

### v2026.10.02.1 · Update · 10/02 06:07

发布提交 `4e83433aa510`，构建源码 `732012b01ec`

- LinkedIn 公司主页 hyde-cantonlock 加入页脚社交与结构化数据 sameAs；Clarity 九个话题各扩到 15 条提问 `be204adf4a51`
- （另有 3 个只改文档的提交，未列出）

## 2026-10-01

### v2026.10.01.1 · Update · 10/01 08:44

发布提交 `f1852e3082a2`，构建源码 `44080de40e5`

- BAU 2027 官方展商横幅上架（英、德各一张 300×250，在展位介绍旁，链到官方展商目录） `4d178d4fd6e7`
- chunk-push-release 推 main 不再用 --force；main 上已有别的发布就停下；goal #126、#127 完成 `87a997a89f68`
- DV06 门镜补 160°：视角 160/180/200，门厚增 30–50mm（160°） `b867d8873616`
- Aribell 门镜报价单；报价规矩补一条：图片不得藏在打印区外 `7497a90e25ab`
- Add traceable HYDE native-photo studies and motion trial `387c311f261a`
- Add HYDE BAU entry design previews `9cfd82fb1dd9`
- （另有 7 个只改文档的提交，未列出）

## 2026-09-30

### v2026.09.30.4 · Update · 09/30 08:57

发布提交 `56d9c79d4920`，构建源码 `21841481ec`

- i18n: bring the glass-door article overlays up to its 09-30 English `6f329f4ace51`
- 玻璃门文章七语种补译第 1、21、29 段（跟上 79f5207bc69 的英文更正），解除 r23 发布阻塞 `93e5bc92ff51`
- feat: 9014 story shows the two set plates on white `968f45569eb1`
- fix: align 9014 real-photo set plates on white `ff7737bf5246`
- 送审包、防火门两篇指南摘要改成答案在前（W39 两个 0% 话题，第一步） `e7b8a9f55b18`
- 重建搜索索引（合并 origin/main 后） `7982c21ce51f`
- 玻璃门指南：JU 系列不是地弹簧；三段"我们不公布"已被 09-29 发布推翻 `79f5207bc691`
- 被 AI 引用最多的指南补上型号链接（W39 P1）：前 10 篇 8 篇可一跳到产品 `4e234be89daf`
- fix: translate the /products category model count on overlay locales `d75c224c486a`
- feat: /products lists all 17 categories in 5 groups with real thumbnails `7cedd0523baa`
- 第 39 周周报：计分卡、环比同比、九条洞察、实验看板、四周 OKR、看板缺口；报数口径改为真人会话 `5dc7a2d3739a`
- feat: home 9014 block as one framed landscape card (FSB 1138 layout) `2183e89eb352`
- feat: 9014 story on the English home page; studio row moves to /products `e2f82973ce48`
- revert: keep the live /products page (owner prefers it, 2026-09-30) `c15915b1948d`
- feat: draft /products in FSB's products-page grammar (English) `5ebf031e042f`
- feat: draft 9014 story page in FSB 1138's page grammar (/stories/9014/, noindex) `05faa501e9c7`
- scripts: md-to-docx.py — owner-readable .docx from a markdown doc `e591bf213250`
- film: ONE TAKE — closing shots of LC07, 19-130MM and 027 show the whole product `e32b93276ec5`
- film: ONE TAKE — BH21 closing shot shows the whole holder `0cbbacf98e05`
- film: ONE TAKE — black ABS reads black, housing-top inset, right-aligned lockup `c2fb2d18633e`
- film: ONE TAKE — ten single-take product films from published dimensions `3b24cf9e75e9`
- film: HYDE 9014 macro film from the factory drawing (FSB 1138 hero reverse) `fb0773e07caa`
- （另有 17 个只改文档的提交，未列出）

### v2026.09.30.3 · Update · 09/30 06:28

发布提交 `2f44011b7710`，构建源码 `d3adf1a9284`

- 三篇指南按本周搜索数据换英文标题（HS 编码、161/86 开孔、玻璃门），goal #122–#125 重开 `be90da18c141`
- 周检查点：抽屉一屏看全、BAU 横条手机 CLS、重复/过短标题、09-30 看板数据入库 `d3ceb3755f1a`
- （另有 3 个只改文档的提交，未列出）

### v2026.09.30.2 · Update · 09/30 03:27

发布提交 `33d91e7090d8`，构建源码 `6ed3b7a0684`

- 网站内容无改动（重新构建）

### v2026.09.30.1 · Update · 09/30 02:50

发布提交 `6e8af2fe42e0`，构建源码 `6ed3b7a0684`

- Header: centre the wordmark between nav and controls at xl `1544e9c2975a`
- Product titles keep whole fit ranges (task 2026-09-30-title-range-facts) `e1d9ae797a14`
- 首页锁芯、执手套装卡片加 600w 图片档（手机省约 30 KB） `5da59c68afea`
- docs: 撤回静态资源缓存头一步——线上已带 1 年 / 1 天缓存头，Cloudflare 全部 HIT `5f2a3233916c`
- 首页性能：西/葡术语表移出全站客户端包、页头页脚关预取、Clarity 延后（标签排队 + GA4 编号）、静态资源缓存头 `429f523f111b`
- （另有 5 个只改文档的提交，未列出）

## 2026-09-29

### v2026.09.29.5 · Update · 09/29 10:10

发布提交 `a53308b4b113`，构建源码 `af62b978d6`

- 配置器工作室上架：十语言、导航栏/侧边栏/首页展示，保留原配置器 `289f0616e017`
- 配置器工作室：FSB 式专属页 + 产品页表面处理/功能切换 `0cd70ab5f203`
- i18n-client：重建七语种客户端包（12 个地弹簧规格标签） `9bda8c6e7847`
- i18n：28 条地弹簧等七语种 seoTitle/seoDescription 由 build-product-titles --write 生成 `58f1348ea7c5`
- i18n：28 条地弹簧/顶轴/玻璃门顶夹七语种补译（名称、摘要、规格 + 12 个规格标签）；untranslatable 认型号代码 `6dab8fa36e8a`
- fix: keep compact homepage offers clear of hero actions `0dba9b4ca5e8`
- （另有 5 个只改文档的提交，未列出）

### v2026.09.29.4 · Update · 09/29 06:19

发布提交 `edf18289e16d`，构建源码 `d2f54fc2976`

- 311 overlays: restore the sourceHash that matches the ABS English `f77990f9f45f`
- i18n：七语种产品摘要补材质（57 条，跟英文 13482f6ea9a），公司全称描述刷新 sourceHash，共 105 条×7 `c577856cf317`
- 推杆对比指南跟上"铝合金锁体 + 铁推杆"（311 除外，仍为 ABS） `a1ec79702358`
- 311 恢复 ABS 配铝（甲方 09-29：「311 的是 abs 不动」） `984509e1af06`
- i18n：审校工程会话七语种逃生推杆改写（29 条），译文无误，刷新 sourceHash `ae1464b7b2c5`
- （另有 1 个只改文档的提交，未列出）

### v2026.09.29.3 · Update · 09/29 05:31

发布提交 `659599d1ed6a`，构建源码 `67bf9e3751e`

- Regenerate client i18n bundles after the push-bar material change `66006593f476`
- 逃生推杆材质统一为铝合金锁体 + 铁推杆（29 个产品） `329a12c80b49`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.29.2 · Update · 09/29 01:30

发布提交 `8de4215bb6bb`，构建源码 `a4207a6949c`

- 盖上 21 篇文章的修订日期；发布第二次失败的原因 `d127564ba26a`
- 散文里的 lingueta 逐句理完；侧边栏首次点击预热；标题白名单补 muelle `2223f1dca8db`
- 地弹簧上架 HYDE：28 条枢轴组合，目录数 588 → 616 `1e4eed657a7c`
- （另有 1 个只改文档的提交，未列出）

### v2026.09.29.1 · Update · 09/29 00:27

发布提交 `e9a8b0810156`，构建源码 `3addc6b5aa7`

- seo-audit: sitemap lastmod may match dateModified `a8d292bab8df`
- 地弹簧 24 条：英文 summary 写的是另一种产品；补齐西语 `6212ffc4b273`
- 巴西葡语：trinco 是斜舌不是方舌，改 351 行 / 207 条记录 `77a2f393327a`
- 公司英文全称统一为 Canton Hyland Hardware & Building Material Co., Ltd.（931 处，含七语覆盖层与 OG 图）；runbook ④ 写清在网页索引报告 `43822915118c`
- i18n：五篇指南摘要首句七语种重译（解 r17 i18n-lint 28 条），七篇 seoTitle 刷新 sourceHash `00e1f6afb461`
- Stamp revisions for the five guides edited in 149bd21e187 `934f0b77af65`
- 7 篇指南补 relatedModels（只写正文点名讨论的型号），分类页选型区块可自动挂文章 `ac2ef3d8a3f9`
- 作者页：领英移到人头与履历旁边 `91dfdc1ed5e7`
- GEO 学习报告（桌面 Word 生成器）、LinkedIn 起步稿、基线题库补 8 题、runbook 新增四件 `140a6bde0264`
- GEO：零品牌词题库与季度记录表；文章开头审计生成器；5 篇指南摘要首句改为直接答案（三语） `1dc45d207072`
- feed 的 <language> 去掉没人决定过的地区码；runbook 换成实测命令 `44b4c7ab034e`
- （另有 6 个只改文档的提交，未列出）

## 2026-09-28

### v2026.09.28.8 · Update · 09/28 22:11

发布提交 `bdb5523d7159`，构建源码 `d443a245335`

- Restore original AR4 showcase below the BAU homepage entries `e2784711682e`
- Withdraw BAU token patch superseded by mainline `c6d40e4af6e0`
- internal-link-placement：/sitemap-index.xml 列入豁免（给搜索引擎的 XML，不是页面） `81e96cdf656a`
- Bing 两条 High 报错：新增 /sitemap-index.xml（一次提交覆盖十个 sitemap）；runbook 第一屏写重新提交与重新检查步骤 `ecd3643a82c6`
- 西葡子类页补挂 CollectionNote + CollectionFacts（es/pt 走独立路由，上一批漏了定义块） `b5049e3f6387`
- SEO/GEO 第二批：「怎么选」板块挂七语种（文案改模板）、子类页逐型号规格 + 问答、视频页问答 `5e7b223c5bf9`
- rayen.css：Tailwind 扫描排除 out/、out-rayen/、tmp/（仅构建卫生，不改样式） `28b4dd2a8ae9`
- Tailwind 扫描排除 tmp/：ship 的旁路检出是独立 git 根，扫描它的 4.6 万页导出让 PostCSS 子进程超时、next build 失败 `1d3bc4ad1333`
- 品类页导语六处补「制造商 / 批发」用语（商业词覆盖 9/15 → 15/15）；作者头像 alt 改为人名 `bed37a326e85`
- 合并后七语种补译 97 键（隐私政策、主钥匙层级图、BAU 表单、Choosing 板块文案）+ SEO 批次更新文档 `582879098167`
- 合并修正：两个测试文件各补回被截掉的最后一行 `28b36d18a921`
- 全栈 SEO/GEO 第一批：品类页「买家怎么指定」板块（FAQPage）、子类页定义、视频页规格表、术语表 DefinedTermSet、范围解析 bug、审计误报 `721db0c57ebf`
- 七语种短标题兜底 + 11 篇英文标题收到 60 字符内 `ce809002491a`
- seo:indexnow:release: 16 GB heap `ce614b691290`
- Keep delayed contact prompts clear of desktop hero actions `090cc5612efd`
- （另有 6 个只改文档的提交，未列出）

### v2026.09.28.7 · Update · 09/28 08:29

发布提交 `974fd5bcae6d`，构建源码 `2a6e4fa2c21`

- Add BAU 2027 homepage showcase and navigation entry `a5fe7ac38ab4`
- Add HYDE BAU entry design previews `77a61616eb06`
- （另有 1 个只改文档的提交，未列出）

### v2026.09.28.6 · Update · 09/28 06:47

发布提交 `2aa61283e53a`，构建源码 `d36e2d988e`

- 规格 PDF 十语种：283 款 × 10 = 2,830 份 `2735612fa820`
- 铜合页说明、主钥匙层级图、规格 PDF 链接：十语种 `90c1dd681ac0`
- 链接改用站内链接样式；层级图加宽、西葡术语与正文一致；美式拼写 `39df13d27dab`
- BauColumn：duration-300 改用动效令牌，修复主线 motion:check `aff1c184432b`
- 每款产品单页规格 PDF：283 款生成，缺口报告 `fa47e0bae3b0`
- 主钥匙指南：层级示意图（英西葡） `4229bf40682e`
- 合页品类页：copper hinge 说明（英西葡） `51f3879af423`

### v2026.09.28.5 · Update · 09/28 06:35

发布提交 `d36e2d988efe`，构建源码 `584283422f`

- 页头小岛 批次3：SiteHeader 改服务端渲染，交互各自成岛（单独发布） `f4c267e1cd6b`
- docs(privacy): list the language-notice dismissal key `782346947d35`
- 作者照片进署名与 Person 结构化数据 `c8f7a3fc2599`
- 十个语种各一条 RSS；此前只有英文，es/pt 路由并不存在 `5c1047500577`
- 页脚小岛 批次2：SiteFooter 改服务端渲染，只把依赖当前网址的两块拆成客户端小岛 `5765a13b8a40`
- skills-lock: 卸载 69 个未用 skill（甲方 2026-09-28 确认） `3787d4bad852`
- 长尾：产品页回链引用它的横评、场景词不超出记录的适用门型、AI 引流页缺数据清单 `63dbf3ab5055`
- docs(privacy): list the first-touch source in /privacy and /de/privacy `3b99b544cad2`
- （另有 4 个只改文档的提交，未列出）

### v2026.09.28.4 · Update · 09/28 06:08

发布提交 `b606a19697ba`，构建源码 `731d868c4a2`

- 撤回 BauColumn 改动：main 已有更完整的同一修复 `48ddfacf26c8`
- 作者页 /company/johnson-liu/（十语种）、文章修改日期自动盖章 `2ae224e0ee47`
- release: retry next build up to twice on native crash 0xC0000409 `c763bf6bda7c`
- BAU 2027 版式 B 打磨：主匙系统卡改为与实拍卡同框的排版方块（首句大字 + 细线 + 箭头，其余作说明，不用任何图片）；德语日期按钮改为等宽格、不折行（侧栏 <1512px 单列，≥1512 与手机两列）；卡片悬停过渡改用动效令牌并尊重减少动效。手机顺序经核对已是 标题→产品→表单→事实→简介 `5000b0e6d4a2`
- 精简 skills：删除克隆模板遗留的 skill 与各平台规则副本 `d1823be37609`
- BAU 专栏：564 卡片说明首字母大写 `41bc9c2074c1`
- 308-S / 308-D 标题按单扇/双扇定性（positioning 覆盖） `86367c614e55`
- Measure product baselines against one common horizon `6caec7704049`
- 308-S/308-D 三语摘要按甲方答复（单无锁体、双有锁体）；runbook 第一屏复查归档 `efd058d976d1`
- QuickCreator SEO/GEO：分类页选型区块、AI 搜索爬虫、询盘首次来源、GEO 基线 `1647b3d8ff01`
- Google Discover 第二轮：西语/葡语 RSS、文章 og 作者与栏目 `ad1a48d1eda1`
- 按浏览器语言提示的一行横幅，挂在全部 10 个 locale `446e925d6723`
- Add product image consistency audit (fill, centering, baseline) `e31c209b41da`
- 首页小岛 批次1：WelcomeIntro 与 SiteFacts 改服务端渲染，只把交互拆成客户端小岛 `68998945f207`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.28.3 · Update · 09/28 05:18

发布提交 `02d8236a7d06`，构建源码 `ad350d0e6cf`

- 德国联络地址改为 Brohl-Lützing，替换 Remagen `0a0908157065`
- docs(legal): record the client's address answer and EU representative status `d3faf2f94fb7`
- feat(legal): /privacy and /de/privacy, linked from footer and every form `c8de083d7ee8`
- fix(ci): check PDF reader layout without Python `92a81c5b62c9`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.28.2 · Update · 09/28 04:05

发布提交 `fc00f7227e4e`，构建源码 `c5bf2b10720`

- next build: cap workers at 12 (NEXT_BUILD_CPUS overrides) `69921f1ad2ee`
- 七语种首页入口与英西葡一致：去掉桌面 lg:mt-192（408951d37ea 只改了 en/es/pt，fr/de/ja 等首页首屏比英文低 144px） `b5bcb762a721`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.28.1 · Update · 09/28 02:19

发布提交 `b67a73bbca9d`，构建源码 `fd5b1e3fd01`

- 菜单列全部栏目 + 内链摆位审查（测试 + seo:placement） `7b93e04c6cac`
- Fix HYDE desktop entrances and withhold unreliable handle diagrams `408951d37ead`
- （另有 1 个只改文档的提交，未列出）

## 2026-09-27

### v2026.09.27.7 · Update · 09/27 23:36

发布提交 `121e397e6efb`，构建源码 `c480bf25fbc`

- BAU 2027 专栏上线源码：/bau-2027/ 与 /de/bau-2027/（版式 B） `42ebcd6e243e`
- BAU 2027 专栏三个版式预览（A 事实卡优先 / B 产品优先 / C 预约优先），EN + DE 桌面各一张、DE 手机 390px 各一张；文字原样取自 content/bau-2027.json，图片只用五个型号的现成实拍主图 `1bd4bb6922ef`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.27.6 · Update · 09/27 23:15

发布提交 `e0ffe9af8795`，构建源码 `671b8020f8d`

- Google Discover：82 张 1200×675 分享图（真实头图，不生成）、/feed.xml RSS、全引擎 max-image-preview:large、手机文章页不弹促销 `0ace1fb20636`
- 手机端：导航条「Buy it now」固定右侧、只当前页加粗；面包屑单行统一 ›、不再折行；删重复返回链接 `93df22716c53`
- BAU 2027：活动条目改为确定参展（C4.523）；专栏 EN/DE 文案与预约表单文字；任务分工文件 `2f039942a3fe`
- 联系人：tec@ 为 Spooner、hyde@ 为 Monica Lee；WhatsApp +1 703 967 7493 上联系页（10 语种）、页脚、手机菜单 `9a2094b4d1b9`

### v2026.09.27.5 · Update · 09/27 22:51

发布提交 `d733616467fe`，构建源码 `0a299fb13b4`

- 首页轮播：悬停暂停只在说明区、只认鼠标（大图占满首屏、手机点一下就永久停）；切换加定时兜底 `70c96990724c`
- （另有 3 个只改文档的提交，未列出）

### v2026.09.27.4 · Update · 09/27 21:43

发布提交 `baa82d3b5a0f`，构建源码 `60fecfee1de`

- L016/L025/L026 specSources 备注去长破折号（normalize-product-dashes，测试要求） `a70ea31fb4c9`
- 七语种标题：L016/L025/L026 材质已清空（待工厂确认），标题与描述不再写「锌合金」（21 条） `8c155e006f4c`
- 菜单：关闭后焦点回退与 Esc 不再依赖 requestAnimationFrame（0 帧环境实测） `b5f370fef08c`
- 三条记录的材质与自己的图纸说明矛盾：清空而不是猜；工厂待填表加第四节 `56e92744123c`
- 页头：1376–1599px 紧凑导航条也用 Resources 下拉（1440 笔记本看得到）；平板/手机保持独立链接 `066df969d43d`
- 更正：摘要按记录 material 字段补回材质（57 条三语；图纸类 14 条存疑不补）；葡语 em inox em aço inoxidável 重复 17 处 `13482f6ea9a9`

### v2026.09.27.3 · Update · 09/27 21:20

发布提交 `d07288940d81`，构建源码 `c0fa19785c5`

- useOverlayPresence：打开时同一次渲染就挂载，不再等 requestAnimationFrame；入场淡入仍等一帧、另有 50ms 定时兜底。线上浏览器面板里 rAF 不触发时菜单抽屉 aria-expanded=true 却不出现（后台标签、内嵌视图同样可能） `c0fa19785c5a`
- 规则：所有 HYDE 发布部署交给 johns 机器上的工程会话（甲方 09-28，4090/64G；86132 16G/C 盘 20G） `4207f5fbf1ca`
- 分批推送大发布：out/ 按目录分批推临时分支，最后在当前 main 上一个小提交快进，中途不上线半套站点 `afe60824f65a`
- （另有 2 个只改文档的提交，未列出）

### v2026.09.27.2 · Update · 09/27 20:49

发布提交 `c11fb7f4d59c`，构建源码 `1dd053acc18`

- 主图一致性：46 张 HYDE 主图按品类中位数重新摆放（主体占比、底边留白、水平居中，垂直偏移 ≤0.10），只裁切缩放真实照片、不改产品、不生成；去掉原图角落旧 Hyland 标志；审计 54→13（余下为 STAHLOCK 559、AR4 灰底、说明图 9007、散放配件等有意跳过） `02f1ea41f724`
- 产品主图一致性审计：521 张按品类测主体占比、基线、居中、底色，列出 54 张交视觉会话 `d2f16de2cdb0`
- HowTo 结构化数据：fitting-a-euro-cylinder 6 步（取自正文，仅英文页）+ 守卫测试 `dcf700eb9612`
- 型号未确认的 13 条记录：「Reference available on request」改为如实的「Model code to be confirmed」（10 语种） `f0a2ae9f758e`
- WebSite.inLanguage 列全部 10 语种；llms.txt 删掉无法核实的「over thirty markets」 `d17538fc2f21`
- 8/31–9/28 HYDE 指令核查与月度工作总结：459 条网站指令逐条打勾，Word 在 Desktop\hyde `a42e70bfb87b`
- 浮层动效统一：菜单抽屉、语言面板、促销卡片接入 useOverlayPresence（中速入场、快速退场），此前菜单无任何动效、语言面板与促销卡片关闭时一帧消失；轮播自动播放时说明区 aria-live 改为 off `66af62aae326`
- 月度指令核查的两个生成器：提取甲方消息（本机 Claude/Codex 会话）+ 合并核查行出月报 md `786d9b694dca`
- 死链检查：本地 0；新增线上检查 seo:deadlinks:live，1,242 页全 200、外链无死链 `32f703316cc3`
- 页头：Applications / Guides / News 合并为「Resources」下拉（10 语种），顶栏 7 项 → 5 项 `e4bfb248d7ee`
- 页头：fr/de/ru 导航比栏宽，桌面改用紧凑导航条，不再压 logo；加运行时守卫 `a8f9fc0b55ee`
- IndexNow 只比 head + main：页头页脚改动不再把全站算作变化；3d9ab7aec9c 实推 6,329 条 `57fbe356aecf`
- （另有 4 个只改文档的提交，未列出）

### v2026.09.27.1 · Update · 09/27 14:03

发布提交 `3d9ab7aec9cf`，构建源码 `9fbb19322d7`

- release-site：子进程输出上限提到 256 MB；46,188 个暂存文件的清单被默认 1 MB 截断成 "o"，误判为 out/ 以外的文件而中止发布 `9fbb19322d7b`
- 合 origin/main：ansi-grade-1 文章 seoDescription 七语种译文（文案会话）补 sourceHash，看板过期归零 `3a9043946345`
- 产品标题生成器重跑：177 条产品名/摘要改后七语种 497 条 seoTitle/seoDescription 重新生成（titles:check） `cb8a7a0ded59`
- 合 origin/main 后七语种补译：计算器页 41 键、177 条改过英文的产品、6 篇文章 seoTitle、8 条无主图产品规格哈希 `92d0975e6e8c`
- 七语种页面英文残留：文章问答读旁挂译文、术语表/配置器释义走 tx、附件与作者字段进提取器 `7faa51d331fc`
- 七语种页面英文残留第二轮：服务端字典注册、包装函数与函数值文案可翻、67 个无主图产品、数据文件字段进提取器 `dcc67ff59a2b`
- ansi-grade-1-vs-en-1125 seoDescription 只讲等级对比（10 语种），按国家选标准留给 en-1125-or-ansi `6254e12fdea2`
- 计算器组件文字改走 dict()，七语可翻译；重新生成 ui-keys.json `69a7cf7c3ad2`
- /euro-cylinder-calculator title 只占 calculator，不再和 length-and-split 抢词；7 语种 title/description 补译 `5823546b3c6c`
- 5 对文章 seoTitle 分流（文案会话建议）：6 篇 × 10 语种改主词，≥0.7 重叠 5 对 → 1 对 `426f7d4063bc`
- 文章主词重叠审计生成器 + 五对 seoTitle 分工建议（交工程会话） `af7803319c65`
- 产品页：按钮下补“询价请提供什么”一行，三语 `5634567999db`
- 公司页：三语补“适合谁”一句（进口商/分销商/品牌，300–5,000 件起，样品费从首单扣回，引自 FAQ） `d1a77eb75b34`
- 产品摘要去模板化：100 条“manufactured by Canton Hyland”样板清零，24 条不锈钢执手按规格重写；加重复审计生成器 `1b982b3976ec`
- 测试名美式拼写：labelled → labeled（main 上 us-spelling 测试转红） `f090c7e4e976`
- 工具页：欧式锁芯长度计算器（/euro-cylinder-calculator，三语 + 7 语种路由） `e753119a9e7e`
- 产品页加「Projects + Applications」：链回用到该型号的应用案例（18 页 × 10 语种） `aab9044b0989`
- IndexNow --last-release：只推内容真变的页，未 purge 则拒绝；09-27 实推 3,954 条 `5c2f95465744`
- 规格值：MM→mm、首字母小写改大写（64 条 / 109 值） `9ab2b6caedc6`
- IndexNow 读 robots.txt 声明的全部 sitemap：/sitemap.xml 改为只放英文后，只提交了 881/7010 个网址 `8d013bdd89b3`
- （另有 5 个只改文档的提交，未列出）

## 2026-09-26

### v2026.09.26.3 · Update · 09/26 01:34

发布提交 `c57f1a6b88f6`，构建源码 `09f1652b440`

- 产品页特性条目读本语种：七个新语种此前一律显示西语 featuresEs（侧车里有各自的 features），改用 i18n t() `ce48bd0d2a79`
- /sitemap.xml 只放英文网址（14 MB → 约 1/10），各语种 sitemap 已由 robots.txt 声明；audit-seo 读全部声明的 sitemap `2f5d959c29d7`
- 七语种审计加第 6 项：直接量导出页面上的英文句子占比（及格 ≤ 2%，西语 0.5%）。字段齐全、看板 100% 的构建里，法语页面仍有 27%–45% 的句子是英文 `7c5c36ed728e`
- 文章页正文读七语种侧车：NewsDetail 的标题/摘要/正文改用 i18n t()，此前七个新语种的指南与新闻正文全部渲染成英文（侧车里早已有译文） `0277886454f3`
- 七语种 M8：阿土俄日韩五种母语审校（直接改 overlay，报告在 docs/collaboration/reviews/）；overlay 守门 lint；每语种 /<code>/sitemap.xml `d7ab3420785b`
- （另有 1 个只改文档的提交，未列出）

### v2026.09.26.2 · Hotfix · 09/26 01:12

发布提交 `09f1652b4406`，构建源码 `3f1d378ef11`

- 七语种：文章 100%（指南 45 篇、新闻 37 篇、案例 5 篇 × 7）；客户端字典按语种拆 chunk；/model-lookup 17 MB chunk 修掉；术语表 16 新键 `2cf7664723f8`

### v2026.09.26.1 · Update · 09/26 00:16

发布提交 `3f1d378ef11a`，构建源码 `a99d5d58a76`

- 修页头排版：1376–1599px 宽度下导航条贴左、页头变两行（七语种 M1 的 display:block 覆盖了 .layout 网格） `8df3e702b893`
- 七语种锁体标题带上中心距与背距（译名取自各语种 glossary.specLabels） `71490f6047b7`
- 页头语言切换：手机上只显示当前语种代码，十个代码不再压在 logo 上 `5bc255b22904`
- 七语种：译文记英文源哈希，英文改了自动只重译变过的字段；指南 44 篇七语种齐；14 条产品与 5 篇指南的改动字段重译 `ac7d9485525b`
- 装柜指南摘要：高柜多 15% 改 13%（76.4/67.7 m³），三语 `73c63e5d4b08`
- 门叶数量统一为 de dos hojas / de duas folhas（含七处复合值）；葡语补上大小写折叠 `73de868825db`
- 指南三处：删去“整条推杠线 EN 1125 认证并 CE”无据说法，forend 计数 6→8，B117 写全称，三语 `ef0b927b5833`
- 按文案会话的四项裁定改术语表；顺带统一同概念的另两个葡语键 `4ab47d48198e`
- 七语种：指南 44 篇 fr/ko/tr/ru/ar 全部合入（de/ja 30）；HY-0SS 锁舌护板七语种补齐 `939b59f9c83c`
- 删六个死键；Electroplating 三条记录统一成一个词；审计加近似键检查 `4c882908aeca`
- 七语种：指南第二批（fr/ko/tr/ar 30，ru 20，ja 18，de 10）；术语表删两个死键 `41368600df7a`
- 计数随移类更新：五金配件 71、锁体 57、推杠 47；推杠指南改写顺序器所在类目，三语 `9522d3c38757`
- DS05、AR4-1121 标题随规格修正重跑（ф→Ø、背距补单位）；目标清单 #57 `4e3abe0717d2`
- DSL02、DC01、HY-0SS 改名改 slug、301、移类（文案会话定名后） `3f729ee48509`
- 英文规格值修四处；N 不是多余的代号；还原文案字段做成脚本 `e75b239637a7`
- 七语种产品 seoTitle / seoDescription：生成器扩到 fr de ja ko tr ru ar（3,647 条） `7f441723dbfa`
- 命名测试：HY-0SS 改名后在移类前登记为不同部件类型 `ad6e349a0765`
- DSL02/DC01 改名 Door Coordinator，HY-0SS 改名 Latch Guard（三语、中文术语、西葡摘要） `eb3d35199ca5`
- DS011 门吸移到 hardware-accessories/door-stoppers（原在 door-flush-bolts，文案会话 09-25 发现）；标题重生成 `705b16c0624f`
- 站内搜索：door hardware 与 ironmongery 互通（甲方 09-25：美国与英联邦市场都要） `cdd5fa1cebb7`
- 七语种：新闻 37 篇七语种全部合入；指南首批（fr/ru 10，ko/tr/ar 20） `c47dbe2d0769`
- （另有 6 个只改文档的提交，未列出）

## 2026-09-25

### v2026.09.25.4 · Update · 09/25 18:29

发布提交 `d14e90813834`，构建源码 `e17e0462021`

- 视频观看页 /video/<slug>/：Google 只从主体是视频的页面编视频索引（97 个视频「不在观看页面上」） `8f5618eaac7e`
- 8826 SNBK 卖点：the knobs 改为 the levers `b65e691a656a`
- 七语种：47 条改动产品按字段重译（摘要 17 / 卖点 29 / 模板描述 8）；新闻 37 篇六语种齐；i18n-batch 加 --slugs `d11bb26b9679`
- search-index: rebuild (HYDE) `db3a67913685`
- 模板描述里的类目名改成产品通用名（8 条） `117812159024`
- 英文源缺陷：17 条摘要重写，删掉两条无据认证，特性去标题并保持三语对齐 `ea927737fec8`
- 七语种：合并加材质一致性校验（摘要提到别的金属却不提本品材质即拒绝）；42 条丢了材质的摘要重译；新闻第二批 `5bb486ae24f9`
- Cloudflare 报告处理：security.txt 上线、改名视频 18 条 301、手册 ⑥、AI 抓取数据进看板 `ea1b3550713f`
- 七语种：33 条产品摘要按改正后的英文重译；案例 5 篇（ja/ko/tr/ru/ar）；新闻首批（每语种 10–20 篇） `85d024a03a69`
- 英文页面同时写 door hardware 和 ironmongery：首页、产品页导语、服务页各一处 `16ce1cc72f4e`
- 摘要材质守卫：8 条摘要按规格改正（表面颜色不再冒充材质），加测试 `00a53f3e6d9a`
- 七语种全栈镜像 M1–M4：fr/de/ja/ko/tr/ru/ar 由 7 页落地站升为与 /es 同形的完整站点（746 页 × 7），术语表、界面、品类、问答、521 条产品七语种合入 `33c0c790afc0`
- 门孔图生成器两种拼写都认：美式拼写第二批（e834ca7c4df）后画 0 张 `40150338333b`
- （另有 3 个只改文档的提交，未列出）
