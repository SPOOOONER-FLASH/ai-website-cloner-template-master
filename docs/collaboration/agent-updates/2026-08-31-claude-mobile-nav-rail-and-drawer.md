# claude — 移动端导航：顶部 rail + 抽屉按购买优先级重排

| | |
|---|---|
| 范围 | `SiteHeader` / `SiteMenuDrawer` / `globals.css` / 三个 layout / `home.ts` + `home-es.ts` |
| 测试 | lint + typecheck + `npm test` 128 全过（新增 9 条） |
| 未碰 | `out/`（5164 个改动，构建令牌不在我手上）；`src/app/es/**` 文案；`content/**` |
| 风险 | 顶部多了一行 rail，header 高度 +48px。抽屉结构全换，旧的 9 条 `text-h2` 列表没了 |

## 三件事

### 1. 移动端此前没有导航

顶部 nav 是 `max-xl:hidden` —— **1376px 以下完全不渲染**。手机、平板、连 1280px
笔记本看到的只有 wordmark / EN|ES / 放大镜 / 汉堡，没有任何一个词说明去哪。
本站主要流量从搜索落在产品页，需要发现才能用的菜单，多数人不会去发现。

新增 `.nav-rail`：`xl:hidden` 的横向滚动条，读同一份 `headerNav`（CMS 驱动，不是第二份
硬编码）。横滚不换行 —— 六个标签 14px 约 430px，375px 手机内容带只有 343px，换行会让
最小的屏幕上 header 高度翻倍。右侧渐隐提示还有内容。

- `Product Finder` 加粗：435 个型号 15 个类目，它是找到具体型号最快的路径。
- `Buy it now` 做成黑色 pill，点击**打开抽屉**而不是直接跳阿里 —— 直接跳会丢掉想用邮件
  询价的买家，而邮件询盘正是本站要产出的东西。

### 2. 抽屉顺序就是设计

原来：9 条 24px 导航（Home/Products/…/Certificates）在第一栏，购买路径在第二栏 ——
手机上单列，等于**排在全部 9 条之下**。本站存在的两个目的（一封邮件、一次点去阿里）
是菜单里最后出现的东西。

现在的顺序：

1. **Buy it now** —— Alibaba 硬阴影 CTA + Contact / Price list / Downloads + 邮箱
2. **Products** —— All products / Product Finder + **15 个真实类目**
3. **Company** —— Company / Projects / Services / Certificates / Events / News（灰色降级）
4. 社交 + 公司抬头

类目直接进菜单是香奈儿的做法，理由在我们这里更成立：在五金站打开菜单的人找的是产品
类型，不是 hub 页。字号随之改：分组标签 12px，条目 16px（原来 24px）。24px 让每一条都
在喊，等于没有一条在喊。

`categories` 走 props 从 server layout 传下来，不在抽屉里 import ——
`@/data/categories` 会把 15KB JSON、子类目树和 alt-override 模块一起打进客户端包，
只为渲染 15 个标签。

### 3. 首页轮播指向类目，不再指向单个 SKU

第一帧标题写「Panic Exit Devices」，链接却是
`/products/panic-exit-devices/305-fire-door-panic-exit-device`（3 行规格的单品）。
第二帧同理。第三帧本来就指 `/products/lock-cases`，是对的。

三帧现在都指类目。`hero1` 标题/正文同步改成类目级（西语顺手把 `manilla` 改成 `manija`，
按术语表口径）。

`src/data/home-destinations.test.ts` 锁死这条：首页 hero/carousel 的 `href` 深度不得超过
2 段，且类目 slug 必须真实存在。`home-accent.test.ts` 里那条 CTA 断言同一提交内改掉，
它要守的规则（CTA 说明去处，不写 "Learn more"）没有变。

## 没做 / 下一步

- **没跑 `npm run build` / `deploy:prep`**：`out/` 已有 5164 个改动，构建令牌在别人手上。
  源码已进 main，构建者带上即可。
- 页脚移动端仍是 4 栏网格里的 `col-span-2` —— 375px 上每栏 163px，Newsletter 和
  How to buy 并排挤着。下一提交处理，同时按客户要求从 How to buy 里去掉 Projects。
- 字阶塌陷：`--text-h3` 与 `--text-c1` 是同一个值（16–18px），h1 只有 24px。
  卡片标题＝正文＝页脚标题，这是「字太密集」的真实原因。下一提交处理。
- 搜索框没有默认建议（空查询时一片空白）。客户要求电脑端和手机端都加类目 + 拳头产品。
- 移动端弹窗「Talk to us About your project」标题大小写读起来是断的，且在 375px 上很挤。
