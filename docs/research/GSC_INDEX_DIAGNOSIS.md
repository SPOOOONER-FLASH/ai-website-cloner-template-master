# GSC / Bing 索引诊断 — 2026-09-01

结论先说：**Search Console 那九个错误分类里，绝大多数已经修好了，只是没被重新抓取。**
下面每一条都是对线上服务器实测出来的，不是推断。

## 一、最重要的证据：404 分类已经清零

GSC 报「未找到 (404)」75 页，全部是旧 DedeCMS URL。
从那份清单里取 22 条实测：

```
测试 22 条  →  301 共 22 条  →  404 共 0 条
```

其中 10 条落到具体产品页，12 条落到 `/products/` 汇总页。
**一条 404 都不剩。** GSC 上「上次抓取日期」多在 2026-08-26～29，
而 tid 映射是 **2026-08-30** 才上线的 —— 它抓的是修复之前的状态。

## 二、512「重复网页，用户未选定规范网页」是什么

全部是旧 DedeCMS URL，四个维度交叉产生大量变体：

```
www / 裸域  ×  Index.php / index.php  ×  lang=en|cn|es  ×  page=N
```

同一个 tid 因此可以有十几个 URL。GSC 例子里出现过的 tid 约 **50 个**，
而 `deploy/nginx/legacy-redirects.conf` 里**只映射了 11 个**（aid 映射了 423 个）。

未映射的 tid 全部 301 到 `/products/`。于是几十个 URL 指向同一页 —— 这就是「重复」。

**这不是错误，是可接受的降级。** 重新抓取后 Google 会把它们归并到 `/products/`。
要更好只能恢复旧类目表，把 tid 对应到具体类目 —— 没有那份数据就是猜，按内容纪律不猜。

## 三、真正还没解决的：447「已发现 — 尚未编入索引」

**这 447 条是我们自己的新页面**，不是旧 URL。GSC 的「上次抓取日期」全部是「不适用」——
Google 从 sitemap 知道它们存在，**但一次都没抓过**。

### 不是结构问题，我量过

| 检查 | 结果 |
|---|---|
| `/products/` 直接链出的产品页 | **454 个** |
| knob-locks 类目页（67 个产品，每页 20 分页） | HTML 里 **71 个**产品链接，分页不隐藏任何产品 |
| sitemap | 933 条，含 hreflang 2754 条、图片 1440 条 |
| canonical | 全站齐备 |

每个产品页距首页 2 次点击，`ProductIndexList` 服务端渲染全量链接。**内链没有问题。**

### 那是什么问题

抓取预算。GSC 同期显示 Google 在 2026-08-29 还在抓旧 URL，
而 447 个真页面一次没抓过。**512 + 366 ≈ 878 个旧 URL 正在吃掉抓取预算。**

旧 URL 的 301 生效后，Google 重新抓一遍就会把它们丢掉，预算自然回流到真页面。
**这件事主要靠时间，不靠再改代码。**

## 四、www 旧 URL 是两跳，我判断不值得改

```
www/Index.php?aid=140  →  裸域/Index.php?aid=140  →  /products/knob-locks/5807-ssr-.../
```

server 级的 `if ($host = www...)` 先于 location 匹配执行，所以 www 的旧 URL 多一跳。
约一半旧 URL 是 www，等于多花约 440 次抓取。

**但我不建议改。** Google 最多跟 10 跳，两跳不是错误、不影响收录。
要做到一跳得把 www 拆成独立 server 块并复制整套 legacy location ——
为边际收益去动一套刚验证通过的跳转，风险大于回报。

## 五、已经修掉的（本轮代码侧）

| 项 | 状态 |
|---|---|
| Bing 唯一的 High severity「`<h1>` missing」 | **0**（door-hinges 跳转桩改 noindex，保留 canonical） |
| 可索引页里的重复 title | **0 组**（同上三个桩） |
| Bing「meta description 太短」26 页 | 构建产物最短 **121** 字符 |
| Bing「title 太短」22 页 | 构建产物最短 **30** 字符 |
| 图片 sitemap | 0 → **1440** 条 |
| AI 爬虫 | 五个具名组，各自重复 disallow |

Bing Site Scan 的数字同样是上次抓取的快照，会滞后。

## 六、4 条「备用网页（有适当的规范标记）」不是问题

```
/contact/?product=Lock+Case&model=Lc8535B
```
这是我们自己的产品页询盘深链，canonical 正确指向 `/contact/`。**按设计工作。**

## 七、可以主动催的一件事

`scripts/indexnow-submit.mjs` 会把 sitemap 里的 URL 推给 IndexNow
（Bing / Yandex / Naver / Seznam）。密钥文件已在线上。
Bing 目前只有 173 展示 / 14 点击，推一次能明显缩短它的重新抓取周期。

**Google 不支持 IndexNow**，对 447 那件事没有帮助。

⚠ 这是往第三方推数据的动作，需要甲方点头再跑。
跑之前必须确认服务器已经拉到最新构建 —— 推一个服务器还没更新的 URL，
等于让它按旧内容抓一遍。
