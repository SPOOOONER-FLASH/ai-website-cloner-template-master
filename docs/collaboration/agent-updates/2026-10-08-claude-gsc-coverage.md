# 2026-10-08 · Claude（文案会话）· Search Console 12 个导出包：读完，五类都不是错误

**起因**：甲方 10-08 发来 Search Console 截图和 12 个 zip，只说了一个字：「修」。zip 里是 5 份 Coverage Drilldown、5 份 Coverage Validation、2 份 Video indexing Validation。

## 做了什么

- 新增 `scripts/audit-gsc-coverage.mjs`，可以重跑。它做三件事：
  - 按类型给网址归类：旧网站的 index.php、www、http、带参数、PDF、各语种的产品页和分类页。
  - 拉取线上 10 个站点地图（7,375 个网址）做对照。
  - 实测旧网址和带参数网址以外的那些，线上现在返回什么。
- 输出 `docs/research/analytics/2026-10-08/gsc-coverage.md`；原始 CSV 在 `raw/`。

## 结论

| 类别 | 数量 | 判断 |
|---|---:|---|
| 网页会自动重定向 | 766 | 739 个是旧 CMS 网址。抽查 index.php 网址，以及全部非旧网址（www、http、旧分类 slug），都 301 到正确的新页；站点地图里 0 个 |
| 备用网页（有规范标记） | 294 | 询价链接 `?product=&model=`，规范网址指回不带参数的页面，Google 已照做；站点地图里 0 个 |
| 被 noindex 排除 | 73 | 37 个旧网址，加 36 个没有照片的型号页（`isPublished` 规则）；站点地图里 0 个 |
| 已抓取 - 尚未编入索引 | 395 | 383 个是旧网址，最后抓取多在 5 月，现已 301。站点地图里有 5 个：4 个德语/阿语页，加 1 个地弹簧页，都是新上线的，属于时间问题 |
| 视频不在观看页面上 | 384 | 设计如此，见下 |

**验证为什么失败**：重定向、规范网址、noindex 这三类，“失败”只说明网址仍处在那个状态，而那正是我们要的状态。

## 请工程会话修正一处诊断（我没有改，那是你的文件）

`src/components/site/ProductVideo.tsx` 的注释和 `docs/collaboration/OPEN-ITEMS.md` 的「视频：30 个」一节，把「视频不在观看页面上」归因于 `preload="none"`。

但这一类在 Google 的定义里，是“视频不是这个页面的主要内容”：页面要以视频为主，Google 才给它建视频索引。产品页的主角是产品，所以改 preload 或者把 VideoObject 提到顶层都修不掉。

两条路：
- 接受现状。产品页上的视频照样能播，只是不进 Google 视频搜索。我建议走这条。
- 给每个视频单独做观看页。384 页，价值很低。

## 给甲方

- runbook 顶部新增 2026-10-08 一节：这五类不要再点“验证修复”，并导出 404（43）、重复网页未选规范（345）、已发现未编入（1,086）三张表。
- 旧的 ④ 已移到 `archive/2026-10-08-runbook-gsc-two-lists.md`。
- 桌面上的 docx 已重新生成。

## 测试

- 只改了 `docs/` 和新脚本，没有改页面，所以不需要跑 `npm run content` 或构建。
