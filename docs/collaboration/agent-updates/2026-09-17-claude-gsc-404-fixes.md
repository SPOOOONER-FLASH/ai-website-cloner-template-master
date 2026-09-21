# 谷歌 404 导出：49 条里有 3 条是真的，已修

**agent**: Claude · **日期**: 2026-09-17 · 接 `2026-09-17-gsc-index-coverage.md`

甲方发来了 Coverage Drilldown 导出和《谷歌 网络问题验证.docx》，
也就是我那份文件里要的 URL 清单。有了 URL 就不用猜了。

## 49 条 404 分成三堆

用 `scripts/` 之外的一次性脚本把每条 URL 拿去对 `legacy-redirects.conf` 的
aid/tid map 解析，结果：

| | 条数 | 结论 |
|---|---|---|
| 旧 index.php，map 能解析到真实页面 | **21** | 已经会 301。抓取日期 8-26~8-30，**早于 8-30 的大小写修复**，所以当时是硬 404。会随重抓消失 |
| 旧 index.php，map 解析不到，回落 `/products/` | **25** | 同上。回落也是 301 不是 404 |
| **不是 index.php** | **3** | **真的，而且是近几天抓的** |

那 3 条：

```
https://cantonlock.com/es/products/panic-exit-devices/72-panic-exit-device/   9-12 抓取
https://cantonlock.com/es/products/panic-exit-devices/030-panic-exit-device/  9-11 抓取
http://www.cantonlock.com/index.asp                                          9-9  抓取
```

## 第一条和第二条：跳转规则只有英文

这两个型号改过名（`72 → 072-…-lock-case`、`030 → 030-…-trim`），
`deploy/nginx/taxonomy-redirects.conf` 一直跳得好好的 —— **只在英文树上。**

生成器里每一条规则都以 `/products/` 开头，没有一条带语言前缀。
谷歌手里有这两个西语地址（它们就在导出里），所以**一次在一棵树上处理干净的改名，
在另一棵树上丢了两个已收录的页面**。葡语站 9-16 上线，本来会原样继承这个洞。

改法：`scripts/build-taxonomy-redirects.mjs` 现在按 `locales` 给每条规则出三份。
48 条 → **144 条**。

### 而且它立刻抓到了第二个 bug

新生成器**在写每条规则之前，先验证目标页面在导出里真的存在**。
理由是：跳到一个不存在的页面比它替代的那个 404 更糟 —— 爬虫的预算花掉了，
落到的是软错误而不是硬错误，而规则在配置文件里看起来是对的。

第一次运行就拒绝写三条：

```
⚠ 3 rule(s) NOT written, destination missing:
    /products/stainless-steel-handles/t2973a-stainless-steel-handle
      -> /products/stainless-steel-handles/t2973-stainless-steel-handle/
```

`t2973` 是**雷茵独有**的产品，`out/` 里三种语言都没有。
已提交的配置文件里那条规则，是 cantonlock.com 上的一个 **301 跳到 404**。
两个地址在 cantonlock.com 上都不存在，所以这条规则纯属有害。

（雷茵站上 `t2973` 是存在的，所以那条规则在 rayen.cn 上可能是需要的 ——
但那是另一套部署，不归这个安装脚本管。记在这里。）

## 第三条：index.asp

ASP 时代的首页地址，9-9 还在被抓，还在 404。加了一条规则指向首页 ——
和 `legacy-redirects.conf` 里「光秃秃的 index.php 是旧首页」是同一个道理。

**只加了这一条。** 没见过被请求的地址写规则是在猜，而跳转表里的猜测一旦上线，
和事实就分不出来了。

## 顺带一条：`?lang=es/`

导出里有 `https://www.cantonlock.com/index.php?lang=es/` —— **查询值里带了个斜杠**，
是多年前有人手写的链接。nginx 的 map 精确匹配键，`"es/"` 落到 default，
于是一个西语访客被送去英文树。加了一行 `"es/" "/es";`。

## 守卫

`src/data/taxonomy-redirect-locales.test.ts`，两条，**已验证在提交前的配置文件上会触发**：

1. 每个退役路径必须在**每种语言**都有跳转。
2. 没有任何一条跳转指向导出里不存在的页面。

第二条测试就是上面 t2973 那个 bug 的自动版本。

安装脚本 `deploy/install-nginx-redirects.sh` 的自检也加了四条 ——
两条西语、一条葡语、`/index.asp` 和 `?lang=es/`。
这些自检**对比的是跳转目标，不只是状态码**，因为一个跳错地方的 301 也是 301。

## 另外两件从导出里看明白的事

**1 · `/contact/?product=…` 那 1,172 个地址：已经处理过了，只是要时间。**

产品页的「询价」按钮会生成 `/contact/?product=X&model=Y`，导出里全部 1,758 个
链接**都已经带 `rel="nofollow"`**（上一批的工作）。nofollow 阻止的是新发现，
不会清掉谷歌已经知道的 —— 336 条「已抓取未收录」里只剩 8 条是这类地址，
说明它在消化。不用再动。

**2 · noindex 那一栏确认是故意的。**
导出里的例子是 `592-abet-tubular-lock`、`ju-088a-door-closer`、`lc31-lock-case` ——
全部是没有照片的型号。和我在文件里写的一致。

## 甲方要做的：两行命令

**规则在仓库里改好了，不跑这两行它们不会生效。** 见
`CLIENT-RUNBOOK.md`（已更新）。

```
cd /www/wwwroot/cantonlock.com && git pull
bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh
```

脚本会自己备份、`nginx -t`、测试不过自动还原不重载，最后逐条验证并打印结果。

⚠ **还有一件 9-04 起就挂着的事**：`cantonlock-com-conf.snapshot.2026-08-30.conf`
第 2b 节记着，主 vhost 里的 `location ~* ^/index\.php$` 块**服务器上仍是旧版**
（返回 `/products/` 而不是按语言分流）。那个块在宝塔管理的主配置文件里，
安装脚本不碰它，要手工改。

好消息是**现在能自动查出来**：自检里的 `/index.php|301|/` 和
`/index.php?lang=es/|301|/es/` 在旧版块下会 BAD。跑一次就知道它到底改没改。
