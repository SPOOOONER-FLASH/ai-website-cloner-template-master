# 2026-09-11 Claude — 首页 6 张产品缩略图补 srcset，以及 Speed Index 那条已经不成立了

**范围**：新增 `src/components/site/product-images.config.json`、
`src/components/site/editorial-images.ts`、`scripts/generate-editorial-srcsets.mjs`、
`public/images/responsive/products/`（24 个新文件）。
**没碰**：首页轮播、hero、`src/app/es/**` 的西语文案、水印流水线、Cloudflare。

## 一、Speed Index 11.4 秒：这个数字已经过期，我没有按它行动

交接文档第七节第二件要求「把这个判断连同数据一起摆给甲方，让他决定」。
**但甲方 2026-09-11 自己跑的 PageSpeed 是 Speed Index 2.4 秒、Performance 92。**

11.4 秒那次测量早于（或正处于）首页 JS 从 2,241 KB 降到 669 KB 的那一版。
主线程不再被 1.5 MB 的产品目录堵住之后，轮播每 6 秒换图就不再拖住 Speed Index。

所以：**不要拿 11.4 秒去找甲方讨论轮播。** 那会是拿一个已经不成立的数字，
去请求改动一块没有问题的设计区域。轮播的事就此关闭，除非新的测量重新提出它。

这条本身是第九节第四坑的同一形态：「后台/报告的数字是历史，不是现状」。
交接文档里的测量数据也适用这条。

## 二、六张缩略图为什么没有 srcset

首页 21 张图：12 张有 candidates，3 张是 SVG（logo、认证标，没有固定像素宽度，
本来就不该有），**6 张产品缩略图有**。

原因不是组件写漏了。`MediaPlaceholder` 一直在调 `getResponsiveEditorialImageProps`，
两个调用点（`FlagshipTooling` 传 `(min-width:1440px) 420px, …`、`ArgentinaAr4Showcase`
传 `(min-width:1440px) 320px, …`）**也一直传着正确的 `sizes`**。
但那个函数只认 `editorial-images.config.json`，产品路径落到 `return { src }` —— 
srcSet 和 sizes 一起被丢掉了。

结果是 1000–1100px 见方的整张图，送进一个最宽 420 CSS px 的框。

| 图 | 原大小 | 新 320w |
|---|---|---|
| 307-panic-exit-device | 16 KB | 2.5 KB |
| 311-panic-exit-device | 15 KB | 2.5 KB |
| hyde-ar4-110 / 140 / 101 / 1121 | 25–45 KB | 3–5 KB |

## 三、为什么是第二个 config 文件，不是往 editorial 里塞

`product-images.config.json` 单独一份，输出到 `/images/responsive/products/`。

把产品图写进一个叫 `editorial-images.config.json` 的文件里，会让下一个会话在
「产品图的 candidates 在哪配的」这个问题上找不到 —— 文件名是下一个人决定去哪里翻的
唯一依据。两个库的性质也确实不同：editorial 是 1800px 的场景图，这些是方形的目录图版，
而且**水印会随着缩放一起缩**（水印宽度是 `imageWidth * 0.14`，等比，所以 320w 上的
水印占比与 1000w 上完全一致，没有变得看不清）。

## 四、顺手加的一条硬失败：文件名碰撞

candidates 按 **basename** 命名，而产品库是第一个带子目录的库。
`/products-hyde/argentina-ar4/hyde-ar4-110.webp` 和将来某个
`/products-hyde/hyde-ar4-110.webp` 会写到同一个候选文件上，后者覆盖前者，
于是第一个产品在所有小于源宽的尺寸下**静默地显示第二个产品的照片**。

在五金目录上那是买家篮子里的错件，所以让构建直接失败，不让它悄悄发生。
见 `assertNoBasenameCollision`。

## 五、那条「产品图不得有 srcset」的测试

`static-export-performance.test.ts` 有一条锁：
「`${slug} product images must not enter the editorial derivative pipeline`」。

**它针对的是项目页**（305、309-D、玻璃门配件那些技术锚点），我这次列进 config 的
是首页的 307、311 和四个 AR4，两边不重叠，测试原样通过，**没有改动任何锁**。

下一个想扩大产品 srcset 覆盖面的人请注意：那条锁是真的，扩到项目页的产品锚点会撞上它。
撞上时按 AGENTS.md 办 —— 在同一个提交里改测试，把推翻写清楚，不要绕过。

## 六、下一个人

- 首页现在 21 张图里 18 张有 candidates，剩 3 张是 SVG，这条到此为止。
- 甲方截图里还剩两条，都不是我们能动的：
  「Use efficient cache lifetimes」（158–207 KiB）是服务器/Cloudflare 配置，甲方动作，
  已在 `CLIENT-RUNBOOK.md` 范畴；「Reduce unused JavaScript 202 KiB」是框架运行时。
- 产品详情页的大图还没有 candidates（只有首页这 6 张进了 config）。要做的话先读第五条。
