# 2026-09-04 · Claude · Bing 的 /cdn-cgi/ 404、配置器规格行、以及我误提交了 Codex 的图

## ⚠ 先给 Codex：你的 100 张展墙图已经被我提交了

**`public/images/editorial/hyde-editorial-exhibition-wall-*.webp` 共 100 个文件，
在提交 `d55f7d0570` 里，署的是我的提交信息。**

怎么发生的：我先跑了 `git add -- out public` 做发布构建，那一条把你已暂存的 100 个
文件也一并放进了索引。**上一个提交我用了 pathspec（`git commit -- out`）躲开了，
这一个我用了 `git commit -m` 不带 pathspec —— 于是整个索引都被提交了。**

不撤销：文件是有效的，站点在用（`SiteMenuDrawer` 引用
`hyde-editorial-exhibition-wall-01.webp`），而且改写已推送的历史比这个错误本身更麻烦。
但**作者归属丢了，提交信息里也没提**，所以写在这里。

**教训：在共享检出里，`git commit` 永远带 pathspec。** 不是"注意一点"，
是这条命令在这个仓库里没有安全的无参数形式。

---

## 一、Bing 报的 404，以及它掩盖的那个更大的问题

Bing Site Scan：`https://cantonlock.com/cdn-cgi/l/email-protection` —— 4xx。

**那个 URL 不在我们的 `out/` 里。** 0 处。它是 Cloudflare 的
**Email Address Obfuscation** 在边缘实时改写我们的 `mailto:` 生成的：

```
<a href="mailto:lock@cantonlock.com">lock@cantonlock.com</a>
        ↓ Cloudflare 边缘改写
<a href="/cdn-cgi/l/email-protection#b8ccdd…" class="__cf_email__">[email protected]</a>
```

### 404 是较小的一半

**邮箱地址本身从页面上消失了** —— 对任何不执行 JavaScript 的东西都是
`[email protected]`，包括这个站花了很久才让它读懂的那些答案引擎。

Organization schema 里的 `ContactPoint` 把 `lock@cantonlock.com` 作为**结构化、可引用**
的数据发布出去，而旁边可见的页面写着「邮箱受保护」。**标记与可见文字不一致 ——
正是 SEO 审计在别处专门检查的那种失败**（`jsonld-faq-answer-not-visible` 查的就是这个）。

### 修法

Cloudflare 自己支持 `<!--email_off-->` … `<!--/email_off-->` 关闭一段区域的混淆。
新增 `EmailLink` 组件包住我们自己的地址，八处 `mailto:` 全部改过去。

**不需要动 Cloudflare 后台** —— 那是甲方专属，而且改动留在仓库里、只作用在我们打算
公开的地址上，别处的混淆保持开启。这个取舍是对的：这些地址已经在联系页、页脚和结构化
数据里公开了，它们**本来就该被读到**。对无视混淆的爬虫藏不住，却对遵守它的 Google 和
ChatGPT 藏住了 —— 有代价，没有对应的收益。

`robots.txt` 另加 `Disallow: /cdn-cgi/`，兜住已经进了 Bing 索引的那些。

### 顺带一处类型收紧

联系页的 `.filter((row) => row.email)` 改成类型谓词。以前不写也能过，是因为模板字符串
会吞掉 `undefined`；地址变成有类型的 prop 之后就不行了。**把过滤器保证了什么说出来，
好过在调用点断言掉它。**

---

## 二、配置器：三个东西合成一个

甲方：「配置器整体美术设计风格可否升级下，大方大气对齐 fsb 那种」。

### 量出来的问题

步骤条和规格行是上下两块，**显示的却是同样的五件事**。1440 下实测：

| | |
|---|---|
| 规格行容器 | **1,361px 宽** |
| 里面的内容 | **290px**（五个 58px 的破折号 + 分隔点） |
| 字号 | 17px —— 和正文同号 |

**一千像素的空灰底**，而五个一模一样的破折号没有告诉读者将要做哪五个决定。

### 现在

五个等分列，每列：序号、决定的名称、答案或破折号。**它同时是进度指示、规格行和修改入口。**

- 填满宽度的是**信息**，不是灰底
- 点第一下之前就交代了任务的形状
- 每个已答的列**就是**改它的按钮
- 当前步骤用黑色顶边（和站上「当前导航项」同一个手法，不是又发明一种高亮）

**等分而不是按内容宽度**：读者做到一半已经记住了 Material 在哪，每次点击都重排会把这个
拿走。跳过的步骤（剩余产品在这一项上没有差别）留在原位变灰 —— 删掉会让整行在任务中途变短。

### 一个不让测试落空的细节

这一行由 `specificationLine` 驱动，而不是直接遍历 `steps`。那个函数返回**每步一个槽、
按步骤顺序、答没答都在** —— 正是这一行依赖的不变量，而它已经有一条走真实目录的测试。
直接遍历 `steps` 会让那条测试守着一个没人调用的函数。

---

## 三、改了一条测试，说明为什么

`header-shelf.test.ts` 断言页脚含 `mailto:${siteSettings.contact.email}` 的字面量。
页脚仍然发布地址，只是换成了 `EmailLink`。

改成断**组件和地址**，不断锚点标记 —— 这条断言的用意是「页脚提供直接邮件入口」，
**钉死标记会在下次换实现时再失败一次**。

---

## 四、产品页右栏（承接上一条交接）

甲方：「右栏信息还是少了太空旷了，把地下两个规格都放上来」。

上一个交接已经做了，但**当时只提交了源、没有重建 `out/`**，所以甲方看到的还是旧版。
本次已发布。构建产物核对：右栏现在有 Material / Finish / Size / Application 四行实数据。

---

## 全量排查结果

| | |
|---|---|
| SEO 图谱 | **11 项全清，0 error 0 warning** |
| 死链 | **0**（1,029 页 / 75,866 内链 / 19,422 资源引用） |
| 语义问题 | **0** |
| `npm test` | **181 通过** |
| AI 可引用性 | 54/100（瓶颈仍是产品页数据密度，见 GEO 报告） |

`/configurator/` 仍是 33 分、0 个可引用数字 —— 它是 `ssr: false` 的工具页，
服务端渲染的是术语表；那个分数衡量的是它没有规格数字，符合预期。

## 没有碰

`docs/design-references/2026-09-04-*` 与 `.impeccable/mocks/`（`NOW.md` 上 Codex 的占位）。
