# HYDE 待做计划

生成：`node scripts/organize-desktop-hyde.mjs`，来源是工程目标清单（docs/collaboration/tasks/2026-09-24-hyde-engineering-goal.md），2026-10-12 更新。只列没完成的。

## 等你（甲方）（16）

| # | 事项 | 现状 |
|---|---|---|
| 15 | GA4 登记自定义维度 | 待甲方（手册 ②） |
| 16 | 隐私政策页内容 | 待甲方 |
| 17 | 路由收敛为 `[locale]`、构建产物不进 git | 待甲方 |
| 24 | 葡语 trinco / lingueta 用法相反：术语表 Deadbolt=Trinco、Latch=Lingueta，文章里 trinco 指斜舌。要一个像 D1 的决定 | 待甲方 |
| 61 | 甲方在 Search Console 视频索引报告点「验证修正」，观看页被抓取后复查已编入索引数 | 待甲方 |
| 63 | 甲方在 Bing 提交 10 个 sitemap 并重扫（手册 ⑦） | 待甲方（sitemap 已上线，可以提交） |
| 69 | 磁性门锁舌（magnetic door latch）上官网：工厂确认能做后，给实拍照片 + 尺寸（锁舌中心距/面板/锁体长度、通道/隐私功能、表面）即可建品类页；现在不建，不编图不编参数 | 待甲方（工厂能否做 + 实物资料） |
| 107 | 甲方 09-28（Search Console 截图）：/ar/feed.xml 无法抓取，其余 7 个 feed 成功 | 待甲方（线上 /ar/feed.xml 实测 200、82 条、XML 完整；源于 d36e2d988ef 才上线 feed，Google 读取时尚未上线或缓存为旧 404 → 甲方 Purge Everything 后在 Search Console 重新提交） |
| 111 | 文案会话转交：甲方给出 LinkedIn 公司主页网址后，加进 siteSettings.social（进 sameAs） | 待甲方（网址未给） |
| 132 | 甲方 10-05（Bing）：标题 > 70 字符全站 1,039 页 → 生成器规则「整条 > 70 时省略 ` \| Canton Hyland`」；E1 三页（HS 编码、161/86、玻璃门）10-14 前跳过 | 待甲方确认长标题可省品牌名，再做 |
| 134 | 甲方 10-05：#133 发布后在 Bing Webmaster 点「重新扫描」，核对 alt 与 index.php 两项清零 | 待甲方（发布后） |
| 141 | 甲方 10-09：长尾词继续优化 + 反链 / 深链现在怎么做（Bing 反链：5 域名 140 条全指首页、锚文本全是裸网址） | 待甲方（10-09：scripts/build-backlink-deeplinks.mjs 按型号把 139 条目录帖对到产品页，69 条能改（worldbid 51、traderscity 15、etradeasia 3）→ 桌面 BACKLINK-DEEPLINKS.docx；手动操作 docx 含改链步骤与五页 |
| 150 | 远高评估阶段 2/3（报价信息块、文档化编号、规格数字排版、统一章节开头、可复制规格行、开篇标题遮罩升起）：先给甲方看提案再做 | 待甲方 |
| 156 | 「hyde前端管理」10-10：发布 ddc4d19868d 已在 main（7e134760a8c），40 分钟线上仍旧版 → 查拉取 | 待甲方（仓库侧核对：新 chunk 2hkxcu4e-uguo.js 在发布提交和 main 里，提交完整；服务器 cron 拉取需甲方在宝塔终端看 /var/log/cantonlock-deploy.log 并手动补拉，手册顶部 + 桌面 docx） |
| 68 | LC04 面板/锁体尺寸、SSH018 照片、7 个采购问题的数字（产能、公差、备件年限等） | 待甲方（工厂数据） |
| 161 | 服务器硬盘：清回收站、gc 旧 GitHub 历史、查 hids_data 7.5G；GitHub 工单 4847632 回复 | 待甲方（10-12 已发步骤） |

## 等别的会话或日期（10）

| # | 事项 | 现状 |
|---|---|---|
| 13 | 10 个产品名字太长放不下长尾词 | 等待（改名归文案/规格会话） |
| 45 | 七语种产品标题：生成器扩 fr/de/ja/ko/tr/ru/ar，结果合并写入 content/i18n/<code>/products.json 的 seoTitle / seoDescription（以 slug 为键，不加后缀字段，不覆盖同文件其他字段） | 等待（多语言会话术语表 M2 和 categories.json 就位后通知） |
| 57 | 英文规格值错误（BH01 500m、DS05 ф、DV05/06 多 N、AR4-1121 背距、Electroplatingbhgh、LC9045 疑似写反） | 等待（已转规格会话；LC9045 问工厂） |
| 84 | 核查遗留：每周复测（Clarity 排名 / GSC 摘要）记录进 agent-updates；10-08 前后复查标题点击率 | 等待（日期：首次 10-03 周五） |
| 130 | Meta 训练爬虫限流（67,364 次 / 10 天、零访问） | 等待（甲方 10-02：先不限流，以后选做） |
| 133 | 视觉会话 10-05：源码 9101603709a（饰面小图、配置器缩略图补 alt + aria-hidden，Bing 94 页 alt 缺失）要发布 | 待发布 |
| 135 | Clarity 10 话题机会栏（中国厂家资质流程、执手耐久与无障碍、合页承重与等级、无障碍扶手规格等）→ 下一批指南选题 | 待文案会话 / 甲方定优先级（REPORT 第六节） |
| 145 | 文案会话 10-09 全量审查：桌面 LCP 3.6 秒（周报 P1） | 等待（10-09 实测线上，Chrome 1440 宽 + Slow 4G + CPU 4×：/products/ LCP 2.25 s（TTFB 1.08 s、图片 0.69 s）、/product-finder/ 1.0 s、CLS 0.05、/company/ 0.49 s，均 ≤ 2.5 s；不限速 /prod |
| 153 | 规格会话 10-10：ca1764f62a6（AR-4 方块悬停蒙版 40%）+ 69ddfe4e86a（AR4 材质 / 表面处理九语词条、方块 alt 本地化、AR4-140 图片 label）→ 下一次 release:hyde 一起发布 | 等待（10-10「hyde前端管理」会话从 94331c4b51b 发布中，含本条与产品查找器卡片 locale 修复；工程会话这期间不发布） |
| 18 | 10-08 前后复查改过标题的页面点击率 | 等待（日期未到） |

## 我在做 / 做了一部分（2）

| # | 事项 | 现状 |
|---|---|---|
| 158 | 首页轮播：换逃生锁图（客户 10-12 给的图），加 AR-4、阿根廷集合两页（en/es/pt + 七语） | 进行中（10-12，等发布核对） |
| 160 | 巴西逃生锁、阿根廷「单独开」：客户 10-12 答 A+B 都要。阿根廷落地页已有；巴西页 /pt/ferragens-porta-corta-fogo 已有，葡语首页轮播加一页 | 进行中（10-12） |

## 其他未完成（1）

| # | 事项 | 现状 |
|---|---|---|
| 159 | 首页轮播三张大图（阿根廷 ×2、巴西 ×1） | 待 Codex（docs/collaboration/tasks/2026-10-12-codex-home-carousel-argentina-images.md） |
