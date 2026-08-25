# 阿里深链接、/products 改为 Finder 入口、首屏图片优化

- **Agent**：Claude
- **Commit**：与本 update 相同的提交
- **目标**：甲方指出官网到阿里的引流断在"落到店铺首页还要自己搜"；同时 `/products`
  产品太多、首屏图片慢。

## 1. 阿里引流（最重要的一条）

**发现全站阿里入口只有页尾一处，指向店铺首页。** 买家刚看完 305 的规格表，
点过去是个店铺主页，得重新找一遍——正是甲方担心的流失点。

`src/lib/alibaba.ts` 提供两级降级：

1. `product.alibabaUrl` —— 甲方从阿里后台粘贴的**具体商品链接**，有就用
2. 没有则回退到**店铺内搜索深链接**，带上型号

回退存在的理由：要求甲方先填完 431 个 URL 才能开始引流，等于永远不引流。
搜索模板放在 `content/site-settings.json`，阿里改 URL 结构时不用改代码——
本站也无法自动验证格式，因为店铺对非浏览器一律返回 captcha。

产品详情页加了入口，实测：
`https://cnhyland.en.alibaba.com/search/product?SearchText=015%20Panic%20Exit%20Device`

CMS 产品表单加了「阿里巴巴商品链接」字段，甲方可逐个补具体链接。

## 2. `/products` 改为 Finder 入口

原来是 FSB 式全量索引（431 个产品一页）。FSB 只有几十个手柄，我们有 431 个。
改为：类目卡片 + 一个 Finder 入口区，含 4 个**预筛选深链接**
（不锈钢 209 / 防火门 19 / 逃生锁 42 / 锁体 41，计数从目录实时算，不会过期）。

产品卡片 431 → **0**，img 标签 318 → **17**。

## 3. 首屏图片

`MediaPlaceholder` 加 `priority`：`loading=eager` + `fetchpriority=high` + `decoding=sync`。
`loading="lazy"` 对 20 张网格是对的，对首行是错的——浏览器要等布局算完才知道它们在视口内，
本该最先发的请求反而最后发。

标了 priority 的：产品详情页主图（LCP 元素）、两个列表的首行 3 张、`/products` 首行 3 张类目卡。
实测第 1–3 张 `eager/high`，第 4 张 `lazy/-`。

## 4. 顺带修的两个 bug

- **`?promo=1` 强制显示弹窗**：甲方每次想验证弹窗都被自己的 30 分钟冷却挡住，
  已两次误报"弹窗没了"。加了这个开关，且**不写入冷却**，预览不会影响真实访客。
- **Finder 会吞掉不属于它的 URL 参数**：它每次重建整个 query string，
  `?promo=1`、`utm_source` 之类会被静默清除。改为只覆盖自己拥有的键
  （`FACET_PARAM_NAMES`），并加测试锁定。

## 验证

- `npm test` 34 通过；lint 0 error
- `npx serve out` 实测：阿里深链接、预筛选、priority 属性、`?promo=1` 全部生效

## 明确未修改

- **图片素材本身**（甲方说留给 Codex）
- Codex 的 editorial / carousel / responsive srcset 工作；我只在 `MediaPlaceholder`
  加了一个可选 prop，没动它的 `getResponsiveEditorialImageProps` 逻辑

## 已知风险 / 外部阻塞

- **阿里搜索 URL 格式未经验证**（店铺对非浏览器返回 captcha）。若格式不对，
  改 `content/site-settings.json` 的 `alibaba.searchTemplate` 即可，不用改代码。
  **建议甲方在浏览器里点一次确认。**
- SSH 部署仍缺三个值；宝塔面板连不上

## 建议 Codex 下一步协助或复核

1. `/product-finder` 目前**不在弹窗展示范围**内（`promoSurfaceFor` 返回 null）。
   那是买家最认真找产品的页面，可能值得加进 surfaces——但这是甲方的商业判断，
   我没擅自改。
2. 首屏图片我只加了 `priority` 机制并标了几处。你更熟悉 editorial 那条线，
   首页 hero 是否也该标，交给你判断。
