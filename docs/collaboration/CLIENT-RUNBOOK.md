# Spooner 操作手册

**最后更新：2026-09-21 · 更新人：Claude**

这份文件只写**现在要做什么**。做完的、过时的一律移进
`docs/collaboration/archive/`，不留在这里。

> 甲方 2026-09-17：「那个 runbook 都是旧的信息，我需要每次你给我安排工作要清晰的
> 指令和新的指引。」
>
> 之前那份 1,412 行的手册里，光「让 301 生效」就有 1、1a、1b、1c、1c-新、1d 六节，
> 其中三节写的是「这一节又旧了，回去跑第 1 节」。整份已存进
> `archive/2026-09-17-client-runbook-history.md`，只当记录，**不要照着做**。
>
> 从今天起的规矩：**你要动手的事，永远只在这份文件的第一屏，带日期**。
> 做完一条我就把它移走。你在这里读到一条已经做完的事，是我的错，告诉我。

---

## 现在要做的（2026-09-21）

上一屏（2026-09-17 的表单密钥和跳转规则）已经做完，移进了
`archive/2026-09-17-form-key-and-redirects.md`，**不要再照着做**。
实测结果写在那份存档的开头。

---

### ① Search Console 手动请求收录 —— 今天 10 条，明天 10 条

**为什么要手点**：20 篇新文章已经上线，sitemap 也有了，Bing 那边我已经用
IndexNow 推过（63 条 → 200 OK）。**Google 没有 IndexNow**，只能等它自己来爬，
或者在 Search Console 里逐条催。手点能把「几周」变成「一两天」。

**为什么分两天**：Search Console 的「请求编入索引」有每日配额，一天点太多后面
会点不动。而且只点英文版就够 —— 西语和葡语版通过 sitemap 里的 hreflang 关联，
Google 认了英文版就会顺着找到另外两种。

**怎么做**

1. 打开 https://search.google.com/search-console
2. 左上角确认选的是 **cantonlock.com**
3. 把下面第一条网址**粘贴到页面最顶部那个长条搜索框**（不是左边菜单），回车
4. 等它检测完（约 30 秒），页面会说「网址不在 Google 上」——这是正常的，新页面本来就不在
5. 点 **请求编入索引**
6. 等它转完圈说「已请求编入索引」，再换下一条

**今天这 10 条**

```
https://cantonlock.com/guides/euro-cylinder-size-chart-2026/
https://cantonlock.com/guides/backset-door-thickness-chart-2026/
https://cantonlock.com/guides/hinge-grades-and-count-2026/
https://cantonlock.com/guides/door-closer-power-size-2026/
https://cantonlock.com/guides/finish-code-reference-2026/
https://cantonlock.com/guides/strike-plates-and-keeps-2026/
https://cantonlock.com/guides/door-preparation-161-and-86-2026/
https://cantonlock.com/guides/spindle-sizes-and-length-2026/
https://cantonlock.com/guides/en-ansi-bhma-cross-reference-2026/
https://cantonlock.com/guides/glass-door-thickness-and-cutouts-2026/
```

**明天这 10 条**

```
https://cantonlock.com/guides/fire-door-hardware-what-must-be-rated-2026/
https://cantonlock.com/guides/corrosion-resistance-en-1670-2026/
https://cantonlock.com/guides/cycle-testing-durability-grades-2026/
https://cantonlock.com/guides/lever-return-and-en-1906-2026/
https://cantonlock.com/guides/key-blanks-and-restricted-profiles-2026/
https://cantonlock.com/guides/door-closer-mounting-positions-2026/
https://cantonlock.com/guides/door-hardware-hs-codes-2026/
https://cantonlock.com/guides/moq-tooling-and-lead-time-2026/
https://cantonlock.com/guides/container-loading-door-hardware-2026/
https://cantonlock.com/guides/samples-and-incoming-inspection-2026/
```

**排序不是随便排的**：今天这 10 条是买家真的会一个字一个字敲进搜索框的查表题
（欧标锁芯尺寸表、距心对照、一扇门要几个铰链、闭门器力量等级……），
明天那 10 条偏专业判断，搜的人少一些但成交意图更强。

**遇到这两种情况**

- 说「已超出配额」→ 今天就停，明天接着点。不是出错。
- 说「网址不在 Google 上，且存在编入索引问题」→ **截图发我**，先别自己动。

---

### ② `/index.asp` 还是 404 —— nginx 加一行，约 2 分钟

**这条是新发现的**。2026-09-17 那一屏里报的四个 404，我今天逐个实测：

```
/es/products/panic-exit-devices/72-panic-exit-device/    301 ✅
/pt/products/panic-exit-devices/72-panic-exit-device/    301 ✅
/es/products/panic-exit-devices/030-panic-exit-device/   301 ✅
/index.asp                                               404 ❌  ← 还是坏的
```

前三条你上次跑脚本已经修好了。第四条修不好，因为**仓库里从来就没有这条规则** ——
`/index.asp` 是更早的 ASP 时代地址，不带 `?aid=` 这种参数，不在生成器的管辖范围内。
它得手工加在 nginx 的 location 块里，而那个块按快照里的说明就是「只有这个要手工改」的那个。

**怎么做**

1. 登录服务器面板，打开 cantonlock.com 的 nginx 配置文件
   （就是你上次改 `location ~* ^/index\.php$` 的那个文件）
2. 在那个 `location ~* ^/index\.php$ { ... }` 块的**正下方**，新增这一段：

```nginx
# 更早的 ASP 时代首页。Search Console 仍在报它 404。
location = /index.asp {
    return 301 https://cantonlock.com/;
}
```

3. **先测试，不要直接重载**：

```bash
nginx -t
```

4. **看清楚它说什么**：
   - 出现 `syntax is ok` 和 `test is successful` → 继续第 5 步
   - 出现任何 `[emerg]` 或 `failed` → **停在这里，截图发我**。
     不要重载 —— 带着坏配置重载会让整站下线。

5. 测试通过后才重载：

```bash
nginx -s reload
```

   这条命令**成功时不打印任何东西**。没有输出就是对的。

6. 验证（在你自己电脑上跑，或者浏览器直接打开 `https://cantonlock.com/index.asp`）：

```bash
curl -sI https://cantonlock.com/index.asp | head -1
```

   应该看到 `HTTP/2 301`。还是 `404` 就把第 2 步那段粘贴给我看。

---

## 只有这两件是常规动作

| 什么时候 | 做什么 |
|---|---|
| 我说「已部署，记得 purge」 | 只做 ③ |
| 我说「有新的跳转规则」 | 先 ② 再 ③ |
| 其他任何时候 | **什么都不用做** |

服务器每五分钟自己拉一次代码，页面内容（产品、文章、翻译）**不需要你动手**。
需要你动手的只有 nginx 跳转规则，因为它在宝塔管理的目录里，脚本之外没人能碰。

---

## 我刚刚替你查过的（2026-09-17 实测，不用你确认）

| 项目 | 状态 |
|---|---|
| `www.cantonlock.com` → 裸域 301 | ✅ 生效 |
| `index.php?lang=es` → `/es/` | ✅ **生效** —— 旧手册第 1b 节那个「只做一次」的手工改动，你已经做完了 |
| 英文旧类目跳转（如 `/products/door-hinges/`） | ✅ 生效 |
| 西语/葡语旧型号跳转、`/index.asp` | ❌ **要跑上面的 ②** |
| 今天的葡语构建是否已上线 | ✅ 已在服务器上（绕开缓存实测，`/pt/glossary/` 与 `/pt/` 都是新内容） |
| 带哈希的 JS/CSS 缓存一年 | ✅ 生效 |
| 联系表单能不能发出邮件 | ❌ **不能，从上线起就不能** —— 见上面的 ① |

---

## 出事了怎么办

**网站打不开 / 报 502** —— 和跳转规则无关的话，先在宝塔终端跑：

```bash
nginx -t
```

* 打印 `syntax is ok` 和 `test is successful` → 配置没问题，问题在别处，截图发我。
* 打印别的 → 截图发我，**不要保存任何配置文件**。

**`git pull failed` / 「local changes would be overwritten」** —— 服务器上有人手改过文件。
截图发我，我给你三行对齐命令（存档里 1c-新 节有，但我更愿意按当时情况给你，
免得你照着一份旧的敲）。

---

## 需要时再看（不用主动做）

这些都在存档里，需要时我会直接把当次的步骤贴给你，不要求你翻文档：

* Google Search Console 手动提交 —— **目前不需要提交任何页面**。
  覆盖率报告里最大的三类（重复网页 462、已抓取未编入 421、已发现未编入 415）
  手动提交都不起作用，原因写在 `OPEN-ITEMS.md` 第三之二节。
* Bing / Clarity 设置 —— 已配置完成。
* Clarity 里怎么分辨爬虫和真买家、要不要封爬虫 —— 2026-09-10 的结论在存档里。
* 两台机器怎么同步、我在哪台机器上写文件 —— 存档第 7、8 节。
* 雷茵中文站预览域名、还缺的素材 —— 存档，以及 `OPEN-ITEMS.md`。
* skills 的安装与更新 —— `docs/collaboration/SKILLS.md`。

---

## 还欠我的东西（我会一直提醒）

完整清单在 `docs/collaboration/OPEN-ITEMS.md`。当前最挡路的四件（2026-09-17 实测数字）：

1. **六个订单代码的含义** —— 表面码 `N`，功能码 `DK` `KT` `IK` `PT` `BS`。
   `/finishes` 页面上它们现在印着「未确认」。每个一句话就能补上。
2. **五个型号的板尺寸** —— 307 / 311 / 305 / 035 的 **Plate size** 与
   **Plate thickness**（308 已经有 Plate size，还缺厚度）。
   这几个型号占了九十天询盘的大头，数一给，尺寸图和规格表当天就能出。
3. **308-S 与 308-D** —— 是同一个锁体配不同端盒，还是两套不同的东西。
   现在两条记录规格一样，站上不敢替工厂下结论。
4. **执手 / 拉手的固定孔径与孔中心距** —— **519 个已发布型号里只有 6 条有这个数**。
   开孔图生成器早就建好了，就卡在这一个字段上；买家换装时第一个要对的也是它。
