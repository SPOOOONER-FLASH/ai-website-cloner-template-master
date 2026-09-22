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

> ⚠ **2026-09-21 修正**：这一条的第 2 步原先写的是「在那个块的**正下方**」，
> 甲方照做，把新块贴在了 `location ~* ^/index\.php$ {` 这一行的正下面 ——
> 也就是**塞进了那个块的内部**。nginx 不允许 location 嵌套 location，保存被拒：
>
> ```
> nginx: [emerg] location "/index.asp" is outside location "^/index\.php$"
> ```
>
> **他的读法是对的，是指令写错了。** 「正下方」有两个意思，我只想到了一个。
> 下面的步骤已经改成用一个不会读错的锚点：`#LEGACY-REDIRECT-END`。
> 那次 `nginx -t` 拦住了错误配置，站点全程没受影响。

**怎么做**

1. 登录服务器面板 → 站点 `cantonlock.com` → **配置文件**
2. **如果你上次已经贴过一段**：先把它删干净。按 `Ctrl+F` 搜 `index.asp`，
   把下面这四行连同注释一起删掉，让文件回到没动过的样子：

```nginx
# 更早的 ASP 时代首页。Search Console 仍在报它 404。
location = /index.asp {
    return 301 https://cantonlock.com/;
}
```

3. 按 `Ctrl+F` 搜 **`#LEGACY-REDIRECT-END`**。它是一整行，长这样：

```nginx
    #LEGACY-REDIRECT-END
```

4. **把光标放到这一行的行尾，按回车另起一行**，然后粘贴这一段：

```nginx
    # 更早的 ASP 时代首页。Search Console 仍在报它 404。
    location = /index.asp {
        return 301 https://cantonlock.com/;
    }
```

   **为什么是这里**：`#LEGACY-REDIRECT-END` 的上一行是一个 `}`，它关掉了
   `location ~* ^/index\.php$` 那个块。贴在 END 之后，新块就是那个块的**兄弟**
   而不是**孩子** —— 这正是上次失败的原因。
   贴完之后，`location = /index.asp {` 这一行的左边**不能**还在别的 `location` 里面。

5. 点绿色的 **保存** 按钮。

   **这个面板在保存时会自己跑 `nginx -t`，你不需要另外开终端。**
   它就是靠这个挡住了 2026-09-21 那次错误粘贴。

6. **看清楚它回什么**：

   - 弹窗说**保存成功** → 配置已生效，去第 7 步验证。
   - 弹窗说 **「保存失败，因为检测到被修改的配置文件存在错误」**，
     底下跟着一段 `nginx: [emerg] ...` →
     **停在这里，把整个弹窗截图发我，不要再改别的地方。**

     这不是坏消息：**保存失败意味着旧的、好的配置还在跑，网站一切正常。**
     面板不会把测试不通过的配置装上去。

7. 验证。浏览器直接打开 `https://cantonlock.com/index.asp`，应该**跳到首页**。

8. **如果还是 404，先别改配置。** 大概率配置是对的，只是边缘上还留着修好之前
   那份 404。用这两条命令一次分清是「配置没生效」还是「缓存没更新」：

```bash
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' https://cantonlock.com/index.asp
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' "https://cantonlock.com/index.asp?cb=123"
```

   `location = /index.asp` 是**路径**精确匹配，加不加查询串都一样命中；
   但带查询串通常是另一个缓存键。所以：

   | 两条结果 | 含义 | 怎么办 |
   |---|---|---|
   | 裸的 404，带 `?cb=` 的 **301** | 配置没问题，只是缓存旧了 | **purge 一次**就好，不要动配置 |
   | 两条都 404 | 配置真的没生效 | 把第 4 步粘贴的那段截图发我 |
   | 两条都 301 | 已经好了 | 无事 |

   > 2026-09-21 实测就是第一种：裸的 404、带查询串的 301。配置一次就贴对了。

---

### ③ 一个我必须问你的问题 —— 15 款外装锁的壳体是铁还是锌合金（2026-09-21）

**这条不用你上服务器，也不用敲任何命令。只要回我一句话。**

**问题是什么**

这 15 款外装锁（rim lock）的规格表上，同一张表里有两行在说壳体，但说的材料不一样：

- 一行写 **Iron case**（铁壳），或者 5835/5836 写的是 **1.2mm 钢板壳**
- 另一行写 **Zinc die-cast case**（锌合金压铸壳）

一个壳体不可能既是铁板又是锌合金压铸。**现在这两行是并排显示在产品页上的**，英语、西语、葡语三个版本都是。

**为什么值得你花两分钟**

买五金的人是懂行的。他看到同一张表自相矛盾，不会只怀疑这一行 —— 他会开始怀疑这一页上所有的数字，包括那些是对的。这正是我们一直在避免的事。

**我查到的原因**

「Zinc die-cast case」这一行不是逐个产品量出来的，是**按品类套的一句模板**。全站 184 个产品带这一行，但只有 7 种写法，每一种精确对应一个品类 —— 也就是说当初是一次性刷上去的，没有跟每个产品自己的材料行对过。

所以大概率是**模板那行错**，但我不会替工厂猜。

**我需要你回答的**

看一眼这个表，告诉我每一款的壳体到底是什么。你可以直接回「全部都是铁的」这种整体答案，不用逐条写。

| 型号 | 现在表里写的材料 |
|---|---|
| 260 | Iron |
| 556 | iron |
| 558 | iron |
| 559 | Iron |
| 1073D | Iron case, steel base internal components with zinc plated |
| 1073S | Iron case, steel base internal components with zinc plated finish |
| 5681 | Iron case, with 3 pcs brass keys, brass latch |
| 5682 | Iron case, with 3 pcs brass keys, zinc alloy latch and cylinder |
| 5683 | Iron |
| 5688 | Iron case |
| 5689 | Iron case, steel base internal components with zinc plated finish |
| 5833 | Iron and Brass |
| 5835 | **Steel sheet 1.2mm case** |
| 5836 | **Steel sheet 1.2mm case** |
| G559 | Iron lock body |

**另外单独问一句**：5835 和 5836 写的 **1.2mm** 这个钢板厚度，是真的吗？这个数字是从一份西班牙语的经销商资料里来的，不是我们自己的资料。

**如果你不确定**

就直接说「不确定」。**我会把那一行删掉，而不是写一个看起来合理的数字。** 一个缺的规格，买家会来问；一个编的规格，买家验出来之后就不会再回来了。这一条比补齐重要。

**完成的标准**：你回我一句话。之后我改这 15 个产品的三语规格表，跑测试，提交，告诉你已经改好。你不用做别的。

---

## 只有这两件是常规动作

| 什么时候 | 做什么 |
|---|---|
| 我说「已部署，记得 purge」 | 只 **purge** |
| 我说「有新的跳转规则」 | 先**装跳转规则**，再 **purge** |
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
