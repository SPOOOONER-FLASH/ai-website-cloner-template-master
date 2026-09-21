# Claude — 2026-09-15 — 旧 index.php 的 301 已经和产品目录脱节 11 天

## 起因，以及为什么报告本身不是问题

甲方给了 Bing Site Scan 的一页：「head 里缺 description」，2 个页面，都是旧 DedeCMS 网址
（`?tid=23&lang=cn` 和 `?aid=397`）。

**这两条本身不用修。** 实测两条都正常 301。Bing 那一列是**上次抓取时**的状态 ——
`scripts/verify-legacy-redirects.mjs` 顶部那段注释记的就是 2026-09-07 同一个坑：
差一步就让甲方去改生产环境的 nginx，去修一个本来就在工作的东西。**先请求，再下结论。**

## 但顺着查出来一个真的

`aid=397` → `/products/panic-exit-devices/x2-panic-exit-device/` → **又一条 301** →
`…-x2-panic-exit-device-trim/`。

| 问题 | 条数 | 原因 |
|---|---|---|
| 301 链（两跳） | **17** | 产品改名之后 legacy 对照表没有重生成（15 条逃生器械 + DS011 + LC04） |
| 其中会再退一步的 | **2** | 标签匹配不上：`Lc04 85×60mm` vs 型号 `LC04 85*60`；`72` vs `072`，重生成时会掉到 `/products/` |

精确数字是数出来的：把上一版 conf 的每个目标拿去比对 `taxonomy-redirects.conf` 的
`location =` 列表，命中 17 条。（提交信息里写的是 13，是我先按改名批次估的，**偏少了**；
以这里为准。）

链能用，所以十一天没有人发现。但第一跳攒下的排名会打折，而且它成立只是因为
`taxonomy-redirects.conf` 里那条中间规则**碰巧还在** —— 清理掉那条，旧网址就直接断了。

## 修了什么

**1. `LEGACY_AID_OVERRIDES`** —— 三个 aid，每个写了理由。205（LC04，还在卖）、
381（072，还在卖）、1608（024，确实停产了，落到逃生器械类目页而不是通用 `/products/`）。

**2. 无解析就停机，不再回退。** 以前 unresolved 只是打印一行然后落到 `/products/`。
一个「故意落到大类页」和一个「型号改名把它甩掉了」在那个列表里长得一模一样。
照 AGENTS.md 2026-09-11 那条：默认值是错的而不只是不全的时候，让它停。

**3. 禁止 301 链。** 生成时读 `taxonomy-redirects.conf` 的 `location =`，
任何一条 legacy 目标如果自己也是重定向源，就抛错。

**4. `--check`，并接进 `test:export`。** 这才是十一天没被发现的根因 ——
类目那份有 `npm run redirects:taxonomy` 和固定的上线流程，这份 09-04 生成过一次就再没有
任何东西盯过它。现在 `npm run test:export` 会重生成一遍比对，对不上就构建失败。

## 验证

- 拿回旧文件跑 `--check` → 退出码 1，提示「out of date」✔
- 临时把一个 override 指向 `ds011-door-flush-bolt/`（它自己是 301 源）→ 链检查抛错 ✔
- `verify-legacy-redirects.mjs` 加了 aid 397 / 205 / 381 三条，对**线上**跑 **6/9**，
  失败的正是这三条 —— 这是预期的：**服务器上还是旧文件**，要甲方跑一次部署脚本
- 424/424 全部解析（之前 421，更早 423）
- `npm run lint` 干净（两条 warning 是别人文件里原有的）

## 甲方要做的

`CLIENT-RUNBOOK` 新增 **1d 节** —— 和 1a 节一字不差的两行命令
（`git pull` + `install-nginx-redirects.sh`），然后 purge。
做完 `node scripts/verify-legacy-redirects.mjs` 应该是 `9/9`。

## 顺带做的两件（甲方本轮要求）

**书堆那条规矩是我写错了。** 我上一版写成「别家版权封面不能照抄」；甲方 2026-09-15：
「那就是几本书 不是版权，随意什么英文书都行」。已改成道具说明 ——
竖立书脊提供一排竖直硬边，和罗纹板同一个作用。真正不能进画面的只有别家五金品牌的标。
`catalogue-scene-style.md` 和 `NOW.md` 两处都改了。

**Word 版现在有生成器。** `scripts/build-client-docx.mjs` 把 Markdown 转成 docx，
两份：`拍摄风格拆解.docx`、`选品清单.docx`（选品清单是本轮新加的）。
上一份 Word 是 scratchpad 里的一次性脚本、内容是重打进去的 —— 那种文件必然和 md 走散。
现在 md 是唯一源，docx 是导出。

⚠ 为此加了 `docx` 到 **devDependencies**。纯离线 npm 包，不需要登录或 key；
加它是因为「写生成器」这条规矩要求生成器对下一个 session 也能跑，
而原来那个 `docx` 只装在本次会话的 scratchpad 里。

## 没碰的

- `out/`（本次改动不影响导出，**不需要重新构建，也不需要 purge**）
- Codex 的 `NewsVisual.tsx` / `news-visuals.json` / `EditorialAtlas.tsx` 等未提交改动
- `taxonomy-redirects.conf`（它是对的，本次只读）

## 下一个有用的检查

`redirects:legacy:check` 现在会拦住「对照表旧了」，但拦不住「服务器上的文件旧了」——
那只有 `verify-legacy-redirects.mjs` 打线上才知道。值得在甲方跑完 1d 之后复跑一次确认 9/9。
