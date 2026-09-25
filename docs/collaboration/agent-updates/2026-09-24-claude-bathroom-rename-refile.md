# 卫浴 54 条：改 slug、移类、标题（Claude 工程，2026-09-24）

- **来源**：文案会话按实拍图定了 54 条三语名（49cb9912283，docs/copy/naming-bathroom-accessories.md）。
- **slug**：54 条全部改成 `{型号}-{名字}`（bh01-grab-bar、bh15-80mm-barrel-bolt…），图片、视频、CAD 图纸（bh33 svg、drawings/index.json、cad-dimensions.mjs）一起改名。
- **移类**：BH01–04 → care-grab-bars/fixed-grab-bars；BH56–58 → care-grab-bars/flip-up-grab-bars；BH55 淋浴凳 → care-grab-bars；BH15 ×3、BH16、BH17 → hardware-accessories/latches。series 跟着改成目标子类的系列名。
- **301**：54 条 productMerges，其中 13 条带 toCategory，一跳到位，en/es/pt 共 324 条 nginx 规则。顺带把 ANSI 门锁在 deadbolts 下的旧网址改成一跳到 grip-handle-sets（原来目标是个中间跳转页，生成器把它丢掉了）。
- **标题**：54 条重跑。BUYER_NOUN 补了卫浴用词（towel/dispenser/shelf/seat… 三语）。BH15/16 加了产品级 positioning，因为品类卖点讲斜舌方向，对插销不成立；BH55 同样加了。图片 alt 从「Bathroom Accessories」改成产品名。
- **care-grab-bars 类目**：第一次在 HYDE 上有产品。封面原来是雷茵独有的 hb2900，换成 BH56、BH01 实拍；补了 nameEs 和三语 seoTitle。summary 交给文案会话（写的是雷茵的货）。
- **测试**：379/382。剩下 3 项：`empty-category`、`taxonomy-redirect-locales` 查的是本地 out/，发布后变绿；`article-catalogue-claims` 是 why-the-catalogue-is-this-wide 的计数句（588 条、卫浴 42），已交文案会话改。
- **雷茵**：BH 不在 out-rayen 的页面里；products-rayen 下的 BH 图片、content/rayen/product-image-cleanup.json 没动（雷茵车道）。zh-terms 是文案会话补的中立文件，雷茵会显示新中文名。
- **甲方**：手册 ③ 加了这 54 条（发布后再装）；新增 ④ GA4 第二资源 G-X7EMRX2V2X 的问题。
