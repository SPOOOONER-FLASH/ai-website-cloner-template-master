# Search Console 索引问题核对（2026-10-08）

由 `scripts/audit-gsc-coverage.mjs` 生成，数据：`docs/research/analytics/2026-10-08/raw`。已对照线上 7375 个站点地图网址，并实测非旧网站网址的当前状态。

**先看结论**：Search Console 把「验证」标成失败，只表示这些网址仍处在那个状态；对重定向、规范网址、noindex 三类，那个状态就是我们要的。真正的问题只看两件事：这些网址在不在我们提交的站点地图里，以及线上今天返回什么。

## 网页会自动重定向（766）

**判断**：正常。旧网址和 www/http 本来就该 301；只有出现在站点地图里的才是问题。

| 类型 | 数量 | 最近抓取 |
|---|---:|---|
| 旧网站网址（index.php / index.asp） | 739 | 2026-04-28 → 2026-10-05 |
| www. | 15 | 2026-08-30 → 2026-10-03 |
| en 分类页 | 4 | 2026-09-12 → 2026-10-01 |
| en 产品页 | 4 | 2026-09-01 → 2026-10-01 |
| http:// | 2 | 2026-10-05 → 2026-10-05 |
| fr 分类页 | 1 | 2026-10-02 → 2026-10-02 |
| en downloads | 1 | 2026-09-25 → 2026-09-25 |

在站点地图里：**0**

<details><summary>旧网址和带参数网址以外的，线上现状</summary>

| 网址 | 现在 |
|---|---|
| http://cantonlock.com/ | 301 → https://cantonlock.com/ |
| http://www.cantonlock.com/ | 301 → https://cantonlock.com/ |
| https://www.cantonlock.com/ | 301 → https://cantonlock.com/ |
| https://cantonlock.com/fr/products/lock-cases | 301 → https://cantonlock.com/fr/products/lock-cases/ |
| https://cantonlock.com/products/sliding-hook-locks | 301 → https://cantonlock.com/products/sliding-hook-locks/ |
| https://cantonlock.com/products/grip-handle-sets/600-concealed-sliding-door-handle/ | 301 → https://cantonlock.com/products/stainless-steel-handles/600-concealed-sliding-door-handle/ |
| https://cantonlock.com/products/panic-exit-devices/9080e-panic-exit-device/ | 301 → https://cantonlock.com/products/panic-exit-devices/9080e-panic-exit-device-trim/ |
| https://cantonlock.com/products/door-hinges/stainless-steel-door-hinge/ | 301 → https://cantonlock.com/products/brass-steel-hinges/stainless-steel-door-hinge/ |
| https://cantonlock.com/products/door-hinges/ | 301 → https://cantonlock.com/products/brass-steel-hinges/ |
| https://cantonlock.com/downloads | 301 → https://cantonlock.com/downloads/ |
| https://www.cantonlock.com/products/brass-steel-hinges/f100-ss-door-hinge/ | 301 → https://cantonlock.com/products/brass-steel-hinges/f100-ss-door-hinge/ |
| https://cantonlock.com/products/panic-exit-devices | 301 → https://cantonlock.com/products/panic-exit-devices/ |
| https://www.cantonlock.com/products/grip-handle-sets/70780-ab-grip-handle-set/ | 301 → https://cantonlock.com/products/grip-handle-sets/70780-ab-grip-handle-set/ |
| https://cantonlock.com/products | 301 → https://cantonlock.com/products/ |
| https://www.cantonlock.com/products/knob-locks/587-ssbk-light-duty-cylindrical-lock/ | 301 → https://cantonlock.com/products/knob-locks/587-ssbk-light-duty-cylindrical-lock/ |
| https://www.cantonlock.com/products/brass-steel-hinges/ssh017-brass-and-steel-hinges/ | 301 → https://cantonlock.com/products/brass-steel-hinges/ssh017-brass-and-steel-hinges/ |
| https://www.cantonlock.com/products/ | 301 → https://cantonlock.com/products/ |
| https://cantonlock.com/products/panic-exit-devices/305-fire-door-panic-exit-device | 301 → https://cantonlock.com/products/panic-exit-devices/305-fire-door-panic-exit-device/ |

</details>

## 备用网页（有适当的规范标记）（294）

**判断**：正常。询价链接带 ?product=&model=，规范网址指回不带参数的页面，Google 照做了。

| 类型 | 数量 | 最近抓取 |
|---|---:|---|
| 带参数：product+model | 242 | 2026-08-27 → 2026-10-05 |
| www. | 24 | 2026-08-27 → 2026-08-30 |
| 带参数：type | 16 | 2026-08-31 → 2026-10-02 |
| 带参数：product | 7 | 2026-09-21 → 2026-10-01 |
| 带参数：fbclid | 2 | 2026-10-05 → 2026-10-05 |
| 带参数：model | 1 | 2026-10-03 → 2026-10-03 |
| 带参数：subject | 1 | 2026-10-01 → 2026-10-01 |
| 带参数：subject+reference+model | 1 | 2026-09-24 → 2026-09-24 |

在站点地图里：**0**

<details><summary>旧网址和带参数网址以外的，线上现状</summary>

| 网址 | 现在 |
|---|---|
| https://www.cantonlock.com/products/bathroom-accessories/bh10-bathroom-accessories/ | 301 → https://cantonlock.com/products/bathroom-accessories/bh10-bathroom-accessories/ |
| https://www.cantonlock.com/products/bathroom-accessories/bh01-bathroom-accessories/ | 301 → https://cantonlock.com/products/bathroom-accessories/bh01-bathroom-accessories/ |
| https://www.cantonlock.com/products/brass-steel-hinges/ssh013-brass-and-steel-hinges/ | 301 → https://cantonlock.com/products/brass-steel-hinges/ssh013-brass-and-steel-hinges/ |
| https://www.cantonlock.com/products/hardware-accessories/ds013-door-stopper/ | 301 → https://cantonlock.com/products/hardware-accessories/ds013-door-stopper/ |
| https://www.cantonlock.com/products/panic-exit-devices/dsl02-panic-exit-device/ | 301 → https://cantonlock.com/products/panic-exit-devices/dsl02-panic-exit-device/ |
| https://www.cantonlock.com/products/hardware-accessories/dust-proof-02-door-viewer/ | 301 → https://cantonlock.com/products/hardware-accessories/dust-proof-02-door-viewer/ |
| https://www.cantonlock.com/products/bathroom-accessories/bh22-bathroom-accessories/ | 301 → https://cantonlock.com/products/bathroom-accessories/bh22-bathroom-accessories/ |
| https://www.cantonlock.com/products/glass-door-accessories/gl125-ss-glass-door-patch-fittings/ | 301 → https://cantonlock.com/products/glass-door-accessories/gl125-ss-glass-door-patch-fittings/ |
| https://www.cantonlock.com/products/lock-cases/lc14-85-50mm-lock-case/ | 301 → https://cantonlock.com/products/lock-cases/lc14-85-50mm-lock-case/ |
| https://www.cantonlock.com/products/bathroom-accessories/bh27-bathroom-accessories/ | 301 → https://cantonlock.com/products/bathroom-accessories/bh27-bathroom-accessories/ |
| https://www.cantonlock.com/products/lock-cases/lc07-85-45mm-lock-case/ | 301 → https://cantonlock.com/products/lock-cases/lc07-85-45mm-lock-case/ |
| https://www.cantonlock.com/products/lock-cases/hy006dk-lock-case/ | 301 → https://cantonlock.com/products/lock-cases/hy006dk-lock-case/ |
| https://www.cantonlock.com/products/lever-handles/823-pbet-lever-handle/ | 301 → https://cantonlock.com/products/lever-handles/823-pbet-lever-handle/ |
| https://www.cantonlock.com/products/lever-handles/808-snet-lever-handle/ | 301 → https://cantonlock.com/products/lever-handles/808-snet-lever-handle/ |
| https://www.cantonlock.com/products/knob-locks/607-abet-tubular-lock/ | 301 → https://cantonlock.com/products/knob-locks/607-abet-tubular-lock/ |
| https://www.cantonlock.com/products/lock-cylinders/70mb-lock-cylinder/ | 301 → https://cantonlock.com/products/lock-cylinders/70mb-lock-cylinder/ |
| https://www.cantonlock.com/products/knob-locks/609-pbet-tubular-lock/ | 301 → https://cantonlock.com/products/knob-locks/609-pbet-tubular-lock/ |
| https://www.cantonlock.com/products/lock-cylinders/70sn-lock-cylinder/ | 301 → https://cantonlock.com/products/lock-cylinders/70sn-lock-cylinder/ |
| https://www.cantonlock.com/products/door-closers/ju-088a-door-closer/ | 301 → https://cantonlock.com/products/door-closers/ju-088a-door-closer/ |
| https://www.cantonlock.com/products/stainless-steel-handles/nc053-stainless-steel-handle/ | 301 → https://cantonlock.com/products/stainless-steel-handles/nc053-stainless-steel-handle/ |

</details>

## 被“noindex”标记排除了（73）

**判断**：正常。没有照片的型号按规则 noindex（src/data/products.ts isPublished）；只有出现在站点地图里的才是问题。

| 类型 | 数量 | 最近抓取 |
|---|---:|---|
| 旧网站网址（index.php / index.asp） | 37 | 2026-09-03 → 2026-10-04 |
| en 产品页 | 19 | 2026-09-04 → 2026-10-04 |
| es 产品页 | 17 | 2026-09-03 → 2026-09-26 |

在站点地图里：**0**

<details><summary>旧网址和带参数网址以外的，线上现状</summary>

| 网址 | 现在 |
|---|---|
| https://cantonlock.com/products/panic-exit-devices/302-s-s-panic-exit-device/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/592-abet-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/panic-exit-devices/ddh001-panic-exit-device/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/9216-ac-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/607-bnet-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/587-fet-light-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/lever-handles/809-sbet-lever-handle/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lever-handles/805pbet-lever-handle/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/5870-ssps-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/grip-handle-sets/70900-bk-grip-handle-set/ | 200 · noindex, follow |
| https://cantonlock.com/products/hardware-accessories/400-indicator/ | 200 · noindex, follow |
| https://cantonlock.com/products/panic-exit-devices/301-s-s-panic-exit-device/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/607-wbk-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/571-sset-light-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/lock-cases/lc06-85-50mm-ps-lock-case/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/5833-sset-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/door-closers/ju-088a-door-closer/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/586-abet-light-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/lock-cases/lc31-lock-case/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lever-handles/809-pbet-lever-handle/ | 200 · noindex, follow |
| https://cantonlock.com/products/lock-cases/lc45-85-lock-case/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/5790-pbbset-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/576-pbps-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/587-wlet-light-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lock-cases/lc45-85-lock-case/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lever-handles/3431-snet-lever-handle/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lever-handles/807-abet-lever-handle/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/lock-cases/lc31-lock-case/ | 200 · noindex, follow |
| https://cantonlock.com/products/knob-locks/607-fet-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/592-abet-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/glass-door-accessories/100-30mm-glass-door-handle/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/607-fet-tubular-lock/ | 200 · noindex, follow |
| https://cantonlock.com/products/door-closers/ju-071-door-closer/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/bathroom-accessories/bh15-bathroom-accessories/ | 301 → https://cantonlock.com/es/products/hardware-accessories/bh15-barrel-bolt/ |
| https://cantonlock.com/es/products/knob-locks/6094-pbbk-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |
| https://cantonlock.com/es/products/knob-locks/5870-abet-heavy-duty-cylindrical-lock/ | 200 · noindex, follow |

</details>

## 已抓取 - 尚未编入索引（395）

**判断**：看抓取日期：旧网址多是 9 月 23 日前抓的，现在已 301，下次抓取会自己移到「重定向」。在站点地图里的少数几个是新上线的译文页，Google 抓了还没决定收录，属于时间问题，不是错误。

| 类型 | 数量 | 最近抓取 |
|---|---:|---|
| 旧网站网址（index.php / index.asp） | 383 | 2024-01-22 → 2026-10-03 |
| PDF 规格书 | 3 | 2026-10-05 → 2026-10-05 |
| 带参数：product+model | 2 | 2026-10-04 → 2026-10-05 |
| de 产品页 | 1 | 2026-10-05 → 2026-10-05 |
| de 分类页 | 1 | 2026-10-05 → 2026-10-05 |
| ar guides | 1 | 2026-10-05 → 2026-10-05 |
| de collections | 1 | 2026-10-04 → 2026-10-04 |
| en 产品页 | 1 | 2026-10-03 → 2026-10-03 |
| en sitemap.xml | 1 | 2026-09-10 → 2026-09-10 |
| 带参数：favicon.1ans_m3_4-gai.ico | 1 | 2026-08-31 → 2026-08-31 |

在站点地图里：**5** ← 这些是真问题

- https://cantonlock.com/de/products/glass-door-accessories/f123-glass-door-patch-fittings/
- https://cantonlock.com/de/products/glass-door-accessories/
- https://cantonlock.com/ar/guides/exit-device-comparison-2026/
- https://cantonlock.com/de/collections/knob-locks-heavy-duty-cylindrical-locks/
- https://cantonlock.com/products/floor-springs-and-pivots/d-3019-top-pivot/

<details><summary>旧网址和带参数网址以外的，线上现状</summary>

| 网址 | 现在 |
|---|---|
| https://cantonlock.com/downloads/spec-sheets/607-pbet-tubular-lock.pdf | 200 |
| https://cantonlock.com/de/products/glass-door-accessories/f123-glass-door-patch-fittings/ | 200 · index, follow, max-image-preview:large |
| https://cantonlock.com/de/products/glass-door-accessories/ | 200 · index, follow, max-image-preview:large |
| https://cantonlock.com/ar/guides/exit-device-comparison-2026/ | 200 · index, follow, max-image-preview:large |
| https://cantonlock.com/downloads/spec-sheets/eh03-lever-handle.pdf | 200 |
| https://cantonlock.com/downloads/spec-sheets/ar/036-panic-exit-device.pdf | 200 |
| https://cantonlock.com/de/collections/knob-locks-heavy-duty-cylindrical-locks/ | 200 · index, follow, max-image-preview:large |
| https://cantonlock.com/products/floor-springs-and-pivots/d-3019-top-pivot/ | 200 · index, follow, max-image-preview:large |
| https://cantonlock.com/sitemap.xml | 200 |

</details>

## 视频不在观看页面上（384）

**判断**：设计如此。Google 只为「以视频为主的页面」建视频索引；产品页的主角是产品，视频是配角。改播放器参数修不掉，要修只能给每个视频单独做观看页。

| 类型 | 数量 | 最近抓取 |
|---|---:|---|
| es 产品页 | 91 | 2026-09-06 → 2026-10-04 |
| en 产品页 | 66 | 2026-09-05 → 2026-10-05 |
| de 产品页 | 40 | 2026-09-26 → 2026-10-04 |
| ar 产品页 | 38 | 2026-09-26 → 2026-10-04 |
| fr 产品页 | 33 | 2026-09-25 → 2026-10-05 |
| pt 产品页 | 32 | 2026-09-17 → 2026-10-04 |
| ja 产品页 | 24 | 2026-09-26 → 2026-10-03 |
| ko 产品页 | 21 | 2026-09-26 → 2026-10-04 |
| tr 产品页 | 19 | 2026-09-26 → 2026-10-04 |
| ru 产品页 | 19 | 2026-09-26 → 2026-10-04 |
| en (首页) | 1 | 2026-10-05 → 2026-10-05 |

在站点地图里：**0**

## 要做的

- 已抓取 - 尚未编入索引：5 个网址在站点地图里

## 下一次请导出

这几类没有一种是“设计如此”，每一条都可能是真问题：

- 未找到 (404)
- 重复网页，用户未选定规范网页
- 已发现 - 尚未编入索引
