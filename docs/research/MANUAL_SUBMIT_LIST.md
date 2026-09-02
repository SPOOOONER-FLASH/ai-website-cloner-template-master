# 需要手动提交的网址

<!-- 由 scripts/build-submit-list.mjs 生成，请勿手改。 -->

**先看这一段。** Bing / Yandex / Naver / Seznam **不需要手动做任何事** —— `node scripts/indexnow-submit.mjs` 一次把整份 sitemap（969 条）推过去，几秒钟完成，也不限量。**每次部署后跑一次就够了。**

**Google 没有 IndexNow。** 唯一的手动办法是 Search Console → 网址检查 → 「请求编入索引」，每天只能提交十几条。所以下面这份表是**排过序**的：从第 1 组开始，配额用完就停，第二天接着做。不要从 sitemap 顶上一条条往下点。

## 1. 新增的页面（优先级最高）

与 `2d20cafcfd` 相比新增的 URL：它们没有任何抓取历史，站外也没有任何链接指向它们。手动提交对这一类的效果最明显。

共 34 条：

- https://cantonlock.com/collections/panic-exit-devices-fire-door/
- https://cantonlock.com/collections/panic-exit-devices-alarmed/
- https://cantonlock.com/collections/panic-exit-devices-multi-point/
- https://cantonlock.com/collections/panic-exit-devices-exterior-trim/
- https://cantonlock.com/collections/panic-exit-devices-special-applications/
- https://cantonlock.com/collections/knob-locks-commercial-locks/
- https://cantonlock.com/collections/knob-locks-heavy-duty-cylindrical-locks/
- https://cantonlock.com/collections/knob-locks-light-duty-cylindrical-locks/
- https://cantonlock.com/collections/knob-locks-tubular-locks/
- https://cantonlock.com/collections/glass-door-accessories-glass-door-patch-fittings/
- https://cantonlock.com/collections/glass-door-accessories-glass-door-handles/
- https://cantonlock.com/collections/hardware-accessories-door-viewers/
- https://cantonlock.com/collections/hardware-accessories-door-stoppers/
- https://cantonlock.com/collections/hardware-accessories-power-transfer-devices/
- https://cantonlock.com/collections/hardware-accessories-door-flush-bolts/
- https://cantonlock.com/collections/hardware-accessories-house-numbers/
- https://cantonlock.com/collections/hardware-accessories-indicators/
- https://cantonlock.com/collections/hardware-accessories-latches/
- https://cantonlock.com/collections/hardware-accessories-security-door-guards/
- https://cantonlock.com/compare/panic-exit-devices/
- https://cantonlock.com/compare/night-latches-rim-locks/
- https://cantonlock.com/compare/stainless-steel-handles/
- https://cantonlock.com/compare/lever-handles/
- https://cantonlock.com/compare/knob-locks/
- https://cantonlock.com/compare/bathroom-accessories/
- https://cantonlock.com/compare/brass-steel-hinges/
- https://cantonlock.com/compare/deadbolts/
- https://cantonlock.com/compare/door-closers/
- https://cantonlock.com/compare/grip-handle-sets/
- https://cantonlock.com/compare/glass-door-accessories/
- https://cantonlock.com/compare/hardware-accessories/
- https://cantonlock.com/compare/lock-cases/
- https://cantonlock.com/compare/lock-cylinders/
- https://cantonlock.com/compare/sliding-hook-locks/

## 2. 首页与几个枢纽页

Bing 存的首页索引记录还停留在旧站时代（显示为 redirect），需要它重新抓一次；其余几页是站内链接汇聚的地方，重抓一次会连带发现下游页面。

共 4 条：

- https://cantonlock.com/
- https://cantonlock.com/products/
- https://cantonlock.com/product-finder/
- https://cantonlock.com/contact/

## 3. 15 个类目页（有余额再提交）

类目页是新页面的入链来源。Google 每天配额有限，前两组提交完再轮到这里。

共 16 条：

- https://cantonlock.com/products/argentina-ar4/
- https://cantonlock.com/products/panic-exit-devices/
- https://cantonlock.com/products/night-latches-rim-locks/
- https://cantonlock.com/products/stainless-steel-handles/
- https://cantonlock.com/products/lever-handles/
- https://cantonlock.com/products/knob-locks/
- https://cantonlock.com/products/bathroom-accessories/
- https://cantonlock.com/products/brass-steel-hinges/
- https://cantonlock.com/products/deadbolts/
- https://cantonlock.com/products/door-closers/
- https://cantonlock.com/products/grip-handle-sets/
- https://cantonlock.com/products/glass-door-accessories/
- https://cantonlock.com/products/hardware-accessories/
- https://cantonlock.com/products/lock-cases/
- https://cantonlock.com/products/lock-cylinders/
- https://cantonlock.com/products/sliding-hook-locks/

## 提交完之后

Google 收到请求不代表当天就收录 —— 通常几天到两周。**不要重复提交同一条**，重复提交不会加快，只会把配额用掉。

Bing 面板上如果还写着 `Not indexed as this page is a redirect`，看 **Live URL** 标签页，那才是当前状态；**Bing Index** 标签页显示的是它存档里的旧记录。

