# 2026-09-06 · Claude · 雷茵 RAYEN 中文站一期

**范围**：新建 `src/app/zh/**`、`src/components/rayen/**`、`src/data/rayen.ts`、
`content/rayen/**`、`content/i18n/zh-terms.json`、四个 `scripts/`、
`public/images/rayen/**`、`public/images/products-rayen/**`、`out-rayen/`。
**没有碰**任何 `src/components/site/**`、`src/app/(en)/**`、`src/app/es/**`、
`content/products/*.json`、`content/site-settings.json`。

## 这个站是什么

客户 2026-09-06 要求给**中山市雷茵五金制品有限公司（RAYEN 雷茵）**建中文站，
放同一台服务器，参考悍高 higold.com 与顶固 dinggu.net。

调研中发现的关键事实，决定了整个架构：**这家厂有三个身份。**
雷茵是母厂主体，HYDE（cantonlock.com）和 Stahlock（stahlock.com）是它的两个出口品牌。
所以中文站的主线不是「再来一个品牌站」，而是「**这就是那家工厂**」——
顶固首页那个「旗下品牌」分区在这里可以真实地用上，而且它是这个站最强的可信度资产。

设计上的取舍（客户已批准方案 C，分 B→C 两期）：

| 从悍高拿 | 从顶固拿 | 两边都不抄 |
|---|---|---|
| 克制：一屏一件事、大留白、零动效、不做轮播 | 两级栏目 IA、页脚大 sitemap | 悍高的「市值200亿/全球第一」式表述 |
| 真实数字条（用我们自己核得住的三个数） | 「加盟合作」的转化位 → 「合作与定制」 | 顶固的投资者关系 / 爱心公益 |

客户明确说「**成立年份 2026，其他都不写**」，所以数字条只有三个数：
15 个在售品类 / 435 个在售型号 / 2026 年成立，全部由 `content/products` 现算，
不会和站上实际内容对不上。

## 架构：为什么是 `/zh` 构建、`out-rayen/` 部署

页面建在 `src/app/zh/**`，和 `(en)` / `es` 并列的第三个 root layout，
自带 `<html lang="zh-Hans">` 和自己的样式表 `src/app/zh/rayen.css`。
**没有改任何共享组件**，所以这次改动碰不到已上线的 cantonlock.com。

`npm run build` 之后 `scripts/build-rayen-site.mjs` 把 `out/zh/` 提到
`out-rayen/` 的根，重写 `/zh/` 前缀，只复制被引用到的静态资源，
写一份全站 `Disallow` 的 robots.txt，**然后把 `out/zh` 删掉** ——
否则 cantonlock.com/zh/ 会对外提供另一个法人主体的中文站。

这一步已经接进 `build` 脚本本身，不是一个要记得跑的额外命令。忘记跑的后果
（HYDE 域名下多出一个雷茵站）在构建日志里是看不见的。

`src/lib/rayen-paths.test.ts` 锁住这套机制：所有内链必须走 `zhPath()`，
手写 `href="/..."` 会挂测试 —— 因为 `/zh` 重写只认 `zhPath()` 产出的形状。

## ⚠ 发现：`public/images/products/` 不是干净的原图

**这是这次最重要的一条，对 HYDE 站同样成立，请 Codex 过一眼。**

我原本按「`products-hyde/` 是加水印的，`products/` 是原图」来写代码。
**这个假设是错的。** 1595 张 `products/` 里有 **660 张左上角已经烧进了
"Hyland ® — Total solutions to the building industry" 的椭圆商标**，
是拍摄方留下的；`products-hyde/` 是在这基础上**再**盖一层水印。

它能一直没被发现，是因为 Hyland 就是这家厂自己的出口品牌 —— 看上去不像盗图。
但放在雷茵页面上仍然是别家的牌子。是渲染出品类九宫格、盯着 40px 的角落才看出来的。

处理：`scripts/build-rayen-product-images.mjs` 生成 `public/images/products-rayen/`：

| 结果 | 数量 | 说明 |
|---|---|---|
| 清掉水印 | 547 | 靠红色字样定位，按红字外扩到椭圆+副标题，填充色取商标四周那一圈自己的颜色 |
| 本来就干净 | 890 | 角落里没有红色 = 没有商标，原样复制 |
| **拒绝处理** | 158 | 商标压在走廊、门体这类实景画面上，填充会毁图。**宁可没图也不毁图** |

拒绝的逻辑是这个脚本的重点，不是它的缺陷。第一版用「角落有墨迹」判定，
误拒了 1595 张里的 803 张 —— 因为半个品类的产品本身就伸进那个角落。

顺带把 4 张 `/images/concepts/` 的应用场景渲染图也排除在雷茵站外了：
那正是客户 2026-09-04 禁掉的想象场景素材。

### 另一个观察，需要人来判断

被拒绝的 158 张里，相当一部分**看起来是 AI 生成的场景图** —— 走廊、消防栓、
"EXIT" 指示牌，构图高度雷同，门上五金的细节经不起看。它们目前**在 HYDE 站上是在用的**。
我没有动，因为那是既有内容、且不是我这次的范围，但按 AGENTS.md 那条
「绝不生成想象中的金属产品」，这批图值得复核。

## 中文内容：生成器，不是手写

`content/i18n/zh-terms.json` 是唯一词源，`scripts/build-chinese-mirror.mjs`
生成 `src/data/generated/products-zh.json`（已接进 `prebuild`，不会漂）。

- **规格标签 231 个，100% 覆盖**，缺一个就 `--check` 失败。
- **规格值 80% 中文**。原则是「**要么全中文，要么保持原样英文，绝不半中半英**」——
  第一版直接输出词元替换，出了 131 处「Fully 左右通用, 左开 or 右开 hand」。
  那比不翻更糟：买家读到就知道这份目录是机器过了一遍没人看。
  `npm run rayen:mirror:report` 打印剩下的 360 条，随时可以补 phrase。
- **中文摘要是「生成」的不是「翻译」的**：由该型号自己的结构化字段拼出来，
  所以它说不出规格表里没有的话。同 `cf41054b1b` 的 FAQPage 思路。
- 所有 `Hyland 300` 之类的系列名映射成品牌中立的中文（`300 系列`），
  图片 alt 全部重写 —— 英文 alt 写的是 "Hyland 001 Panic Exit Device"。

## 测试与检查

| | 结果 |
|---|---|
| `npm run typecheck` | 通过 |
| eslint（雷茵相关文件） | 通过。`eslint.config.mjs` 加了 `out-rayen/**` 到 ignore，和 `out/**` 同理 |
| `node --test src/lib/rayen-paths.test.ts` | 4/4 通过 |
| `npm test` | 199 项，**195 通过 / 4 失败** —— 失败的全在 `src/components/site/*.test.ts`，见下 |
| `npm run build` | 通过。456 页进 `out-rayen/`，`out/zh` 已移除 |
| out-rayen 死链自查 | 456 页、17548 内链、8959 资源引用，**0 死链** |

## 没有碰、也没有修的东西（Codex 的在制品）

工作树里这几个文件是别人正在改的，我按 AGENTS.md 的脏树规则一律没动：

- `src/components/site/SiteMenuDrawer.tsx`、`ProductsEditorialOverview.tsx`（M）
- `src/components/site/EditorialAtlas.tsx`、`EditorialCatalogue.module.css`（??）
- `scripts/lib/product-cutout.mjs`（M）—— **现在是语法错误状态**，
  171 行附近两段注释被合到了一起，`npm run lint` 全量跑会挂在这里。像是编辑到一半。

由此产生的既有失败，**不是我这次引入的**：

- `npm test` 那 4 个失败：`header-shelf` / `home-accent` / `mobile-navigation`，
  断言的都是 `SiteMenuDrawer.tsx` 的内容。
- `npm run test:export` 的 `audit-dead-links`：18 条死链，全部来自
  `/products/index.html` 和 `/es/products/index.html` 指向扁平型号 URL，
  即 `ProductsEditorialOverview.tsx` 那次改动。

## 发布状态

- `out/`（HYDE）和 `out-rayen/`（雷茵）**都已构建并提交**。我拿了发布接力棒。
- 已推送。服务器 5 分钟一次 `git pull` 会拉到。
- **雷茵站还看不到，需要客户在宝塔里做一次一次性操作** ——
  把 `spoonercantonlock.stahlock.com` 的网站目录指到
  `/www/wwwroot/cantonlock.com/out-rayen`、运行目录改成 `/`、启动网站。
  完整步骤（含每一步失败了怎么办）在 `CLIENT-RUNBOOK.md` 第 6 节。
- 预览期间全站 `Disallow: /`。正式域名定下来时，改
  `content/rayen/site.json` 的 `preview.host`、`src/app/zh/layout.tsx` 的
  `robots`、以及 `build-rayen-site.mjs` 里的 robots.txt —— 三处，同一个提交里改。

## 下一步（给下一位）

1. **等客户给电话 / 邮箱 / 微信 / 1688 链接 / 正式域名**。现在联系页和页脚是短横线，
   填 `content/rayen/site.json` 就出现，不用改代码。
2. **证书**：`24-工厂图/证书/1.jpg` 是 KALE KILIT 申请、Canton Hyland 制造的
   Intertek 报告，不是雷茵的资质，没有放。见 runbook 里给客户的说明。
3. **二期（方案 C 的品牌层）**：工厂视频首屏、展会资讯流、选型指南。
   展会照片目前全部排除 —— `新网站展览图` 的 8/9/12/14/15 是 Stahlock 展位，
   `展览图` 里有 Hydeland 招牌，`202608` 里有 JUSTOR 开达的品牌墙。
   要用得先请客户确认哪些是雷茵自己的展位。
4. **78 个型号没有任何实拍图**（不是被水印挡的，是仓库里就没有）。
   已在 `npm run sheets` 的美工填写表统计范围内。
5. 补 `zh-terms.json` 的 phrase，把规格值中文覆盖率从 80% 往上推。
