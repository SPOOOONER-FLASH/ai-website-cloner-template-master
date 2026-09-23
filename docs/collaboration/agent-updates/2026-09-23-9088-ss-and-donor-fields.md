# 新品 9088 SS 上架；修掉导入脚本把「捐赠记录」身份抄给新品的 bug

- **Agent**: Claude · **日期**: 2026-09-23 · **来源**: 甲方微信压缩包 `Stainless Steel Handles(2).zip`

## 9088 SS

- 走现成三步管线：`add-photographed-models` → `import-client-product-photos` → `import-client-product-videos`。
  视频 64.3 MB → 5.2 MB（720p/30），真实棚拍（戴手套演示、中英俄字幕）。
- **图片 10 张用了 7 张**，另外三张不上：
  - **18**：生活场景图，面板顶部画了**两颗并排螺丝**；实物（尺寸图 11）顶部是**一个居中沉孔**。
    这就是 AGENTS.md「不得凭空添加螺丝」那一条，放大截图核对过。
  - **17**：生活场景图，产品本身核对无误，但客户 logo 压在室内背景上，无法干净处理；也打破产品图统一的棚拍风格。
  - **19**：弹簧特写配「Heavy-duty / Long Service Life」等宣传字，无出处的性能宣称不上规格页。
- **客户自带的 HYDE logo 已抹掉**（仅在纯白背景上：环带最小值 ≥252，逐张检查），由站点水印统一加在右上角。
  否则每张图会有两个 HYDE 标。22 号本来就没有客户 logo，未动。
- **15 行规格 × 三语**，全部读自工厂自己的尺寸图（11、22）和照片，`specSources` 记了出处：
  面板 200×50mm、厚 1mm、深 10mm、孔距 170mm；执手截面 22.5mm；执手到锁芯 58mm；
  锁体面板 175mm、背距 45mm、铁；锁芯锌合金、欧标、外钥匙内旋钮；材质取面板上的 SUS(304) 钢印。
- **故意没写的**：执手的 51 与 127.5 —— 那个角度下 51 是离门突出还是颈长分不清；
  执手本体材质（图上只有面板钢印）；门厚范围。页面写明「未发布，问出口团队要实测值」。
- 品类文案「入户门与玻璃门、全截面实心不锈钢」对它不成立（插芯锁装不上无框玻璃门；执手材质未证实），
  给标题生成器加了**单品 `positioning` 覆盖**，9088 用自己的一份。
- 表面一行原写「Brushed, with polished edges」，生成器按逗号数成「2 finishes」—— 改成不带逗号的一个表面。
- FAQ「522 个型号」→ 523（测试守着）；`zh-terms` 补两个新规格标签的中文。

## 导入脚本的 bug（影响 8 条已上线记录）

`add-photographed-models.mjs` 克隆同品类第一条记录取「形状」，但只清空了一部分字段。
`stainless-steel-handles` 的捐赠者是 **600（暗藏式推拉门拉手）**，于是 **7 个旧执手 + 9088** 都带着：
门型 Sliding Door / Pocket Door（选型器把它们归到推拉门下）、系列 Hyland 600、中文名 隐藏式推拉门拉手、
600 的 ISO 徽章与 featuresSource。9088 的葡语标题甚至以「069 Puxador…」开头 —— 另一个型号。

- 修脚本：所有按型号的字段一律清空，只继承「有哪些键」。
- 修 7 条旧记录（069、9007E、9010E、9087 SS、LH1083、LH1083 SS、LH1085 SS）：只动这几个继承来的字段。
  改前逐张看过产品图 —— 只有 600 真的是推拉门拉手。
- 新测试 `src/data/product-donor-fields.test.ts`，已接进 `npm test`（测试脚本是显式文件列表，不接就不会跑）。
  第一版「系列必须以本型号结尾」误报了 Hyland 300（真实的家族系列），已收窄。

## 验证

`npm test` 365 passed · `tsc` 干净 · `npm run content` 925 产品 / 搜索索引 523 个产品 · 水印清单 +8。

## 未触碰

Codex 未提交的 motion 改动（HeroCarousel、SiteHeader、SearchDialog、ProductImageZoom、globals.css、
`package.json` 里的 `motion:check`）。`package.json` 只暂存了我那一处：从 HEAD 版本构造暂存内容，他们的行留在工作区。

## 地址：未改网站显示，待甲方定

另一个会话 `a49cf9fab86` 按甲方「地址统一写 Lianfeng Industry Park」改了 `address`（报价用的办公地址）。
**网站不显示这个字段** —— 联系页、公司页、JSON-LD 显示的是 `factoryAddress`「No. 76 Haiwei Road」，
线上实测仍是海威路。要不要把网站上的工厂地址换掉，是个会让买家开车去不同地方的决定，已问甲方。
