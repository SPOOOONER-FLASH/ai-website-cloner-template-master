# Claude — Bing 报告 98% 是旧站；stahlock 二次映射补回 95 行

## 一、Bing 的 98 个错误里只有 2 个是我们的页面

把四份 FailingUrls CSV 拆开数了一遍：

| Bing 报的问题 | 旧站 `index.php` | 我们的页面 |
|---|---|---|
| 内容过少 18 | 18 | **0** |
| 标题过短 22 | 22 | **0** |
| 标题重复 32 | 32 | **0** |
| meta 描述过短 26 | 24 | **2** |
| **合计 98** | **96（98%）** | **2** |

那 2 个是 `/downloads/` 与 `/contact/`，实测 **149 与 155 字符**，早已在建议区间内 ——
Bing 的数据是抓取旧快照留下的。**这份报告不需要修，等重抓即可。**

## 二、但报告里藏着两个真 bug

### 1. `Index.php`（大写 I）全部 404

```
index.php?m=home&c=Lists&a=index&tid=97   → 301 /products/
Index.php?m=home&c=Lists&a=index&tid=97   → 404
```

nginx 的 location 是大小写敏感的。**Bing 索引的 72 个旧 URL 里有 39 个（54%）是大写 I**，
全部硬 404，外链权重直接丢掉。

**需要服务器改**：`location ~* ^/index\.php$`，或加一条 `/Index.php` → `/index.php` 的 301。
我改不了 nginx server block，这条给你。

### 2. `www` 不 301 到 apex

`https://www.cantonlock.com/` 返回 **200**，canonical 指向 apex。canonical 能兜底，
但 Bing 两个主机都在抓（那 2 个"我们的"URL 一个是 apex 一个是 www）。同样需要服务器改。

## 三、Bing 顺手把 tid 对照表送给我们了

`build-legacy-redirects.mjs` 原本写着「抓取没拿到 tid → 分类对照表，所以全部落到 /products/」。
Bing 的**标题重复**报告每行都带着旧 `<title>`，那就是分类名：

| tid | 旧标题 | 现在指向 |
|---|---|---|
| 97 | Lock Case | `/products/lock-cases/` |
| 99 / 101 / 105 | Knob Lock / Tubular / Heavy Duty Cylindrical | `/products/knob-locks/` |
| 119 | Glass Door Handle | `/products/glass-door-accessories/` |
| 123 | Panic Exit Device | `/products/panic-exit-devices/` |
| 131 | Brass and Steel Hinges | `/products/brass-steel-hinges/` |
| 133 | Hardware Accessories | `/products/hardware-accessories/` |
| 89 / 91 | Factory / Contact us | `/company/` `/contact/` |

**tid=97 一个就有 456 条内链**（GSC 内部链接报告）。全都倒进通用 hub，Google 读作 soft 404；
落到 Lock Cases 就不是。conf 已重新生成，随服务器配置一起部署。

## 四、stahlock 二次映射：kimi 的类目闸门砍掉了真数据

kimi 拿 stahlock 的类目字符串和我们的比，不同就排除，拦下 73 对。
**其中 66 对根本不是"不同类目"，是同一族的父子层级**：

    stahlock "Hardware Accessories" = 我们的 hardware-accessories/door-viewers、/latches、
                                      /door-stoppers、/door-flush-bolts …（42 对）
    stahlock "Push Bar" / "Trim Handle" / "Fire Door Coordinator"
                                    = 我们的 panic-exit-devices/*（23 对）

代价是实打实的：stahlock 的 305 页面有 Material / Finish / Length，我们的 305 只有 2 行。

**闸门是换掉不是拆掉。** 新脚本 `stahlock-second-pass.mjs` 用 `FAMILIES` 声明
「哪个 stahlock 栏目可以供给我们树的哪一段」，父子算同族，不同族仍然拒绝。

| | |
|---|---|
| 73 对里同族放行 | 66 |
| 抓取页面 | 65 |
| **补进的规格行** | **95 行 / 43 个产品** |
| 丢弃的认证行 | **20** |
| 仍拒绝，待人工判断 | 7 |

⚠ 认证规则在这里比别处更要紧：stahlock 的 305 页写着 `Certification: EN1205 compliant`。
**世上没有 EN 1205**，是 EN 1125 的错字，登在一个门店页上，而我们没有覆盖该型号的报告。全部丢弃。

仍拒绝的 7 对（型号相同但确实不同族，请甲方看）：

    315     ours: hardware-accessories/latches      stahlock: Push Bar
    600     ours: grip-handle-sets                  stahlock: Hardware Accessories
    881 SS / S02 CP / S03  ours: sliding-hook-locks stahlock: Commercial Locks
    9082E   ours: stainless-steel-handles           stahlock: Trim Handle
    F101    ours: glass-door-patch-fittings         stahlock: Night Latch And Rim Lock

## 五、我核对过的一件事：那 32 个不锈钢拉手，stahlock 没有

stahlock 的 Stainless Steel Handle 栏目是 `LH1085 SS / NCD / NCB / NC182 / NC181 / NC068 …`，
**和我们的 9001 / 9002E / 9004 / 9007 完全是另一条产品线**。
所以这 32 个页面不是映射漏了，是 stahlock 根本没有。要么甲方补规格，要么合并成带变体的单页。

## 六、结果

| | |
|---|---|
| 0 行规格 | 9 |
| 1–2 行 | 32（原 42） |
| **≥4 行** | **326 / 435**（原 295） |

`npm run lint` / `tsc` / `build` / `test:export` 全绿，938 页，0 semantic issue，0 editorial warning。
我自己的 94 个单元测试全过。

⚠ `npm test` 整体仍红，卡在 `scripts/watermark-product-images.test.mjs` —— @Codex 正在改，
你已经换成 POSIX 路径 `/repo/...`，那修好了 Linux 但 Windows 上 `path.resolve` 仍会得到
`C:/repo/...`，本地就挂了。建议两边都不写死：`path.join(os.tmpdir(), ...)`，或断言前把
两侧一起 normalize。没碰你的文件。
