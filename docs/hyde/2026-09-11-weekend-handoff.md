# 9.11 周末出差 HYDE 工程交接

> 写给**下一个从零开始的会话**。读完这一份就能接着干，不必翻聊天记录。
> 停止时间：2026-09-11 · 上一任：Claude（Opus 5）· 状态：**Codex 下线五天，我在代管他们的区域**
>
> 文件名用 ASCII（`2026-09-11-weekend-handoff.md`）。Git Bash 在 Windows 下对中文路径的
> pathspec 匹配不稳 —— `git commit -- <中文路径>` 会直接报
> `did not match any file(s) known to git`。**文档标题以本页第一行为准。**

---

## 一、三十秒版本

| | |
|---|---|
| 客户 | 中山 Canton Hyland / HYDE，门五金工厂 |
| 网站 | cantonlock.com，Next.js 16 静态导出，产物在 `out/` |
| 联系人 | Johnson Liu（柳雷博 / Spooner），`spoonerlau@gmail.com` |
| 目录 | **584** 条 HYDE 记录，**517** 有照片已上线，**67** 无照片已下架（页面保留 noindex） |
| 素材 | 191 条产品视频，460 条有规格表，**20 篇**文章 |
| 语言 | 英文主站 + 西语镜像；另有独立中文站 `out-rayen/`（含 `/en/` 英文版） |
| 部署 | 服务器每 5 分钟 `git pull`；**推送即部署**。Cloudflare purge 只由甲方做 |
| 另一个 agent | **Codex 从 2026-09-10 起下线五天**，他们的 `src/app/es/**` 与设计区域暂由 Claude 代管 |

---

## 二、六条纪律（动手之前必读）

### 1. Cloudflare purge —— agent 绝对不碰

> purge 一会我来就行，写进纪律你们 agent 不要动，每次结尾你们确保 deploy 了 out/ 就行，
> 然后写一句记得 purge，其他的别浪费 token 了。

不要开面板、不要找 API token、不要调 purge 端点、不要查边缘缓存为什么是旧的、
**不要暗示 purge 发生过**。构建、提交、推送，回复末尾写一句「记得 purge」。

> ⚠ 2026-09-10 学到的配套判断：**线上 404 不等于没部署。**
> 先用 `curl "网址?cb=123"` 绕过边缘缓存打一次，再去怀疑构建或部署。
> 那天我看到 404 就去接棒重出构建，结果 Codex 早就构建提交过了，白跑一趟。

### 2. 永远不生成想象出来的金属产品 —— 但界线在产品，不在画面

甲方 2026-09-10 亲自澄清过一次，**我上一版把这条写窄了**：

> 不要全真实，是产品本身必须是真实的，换底图，换棚拍而已。

| | 允许吗 |
|---|---|
| **产品本体**：轮廓、孔位、螺距、方轴、中心距、比例 | ❌ 必须来自真实照片，一毫米都不能想象 |
| **背景 / 棚拍环境 / 灯光 / 构图** | ✅ 随便换，这正是要做的事 |
| 一张图里混不同表面处理 | ❌ 客户订黑色，图里每一件都得是黑色 |
| 拼工厂并不成套卖的组合 | ❌ 配套关系要先确认 |

被否掉的那批图**不是因为用了 AI**，是执手轮廓被改了形导致转不动门 ——
产品本体错了，不是画面错了。

### 3. 专业感比好看重要

> 真的是不需要花里胡哨，就让别人看起来专业……工厂给人专业感觉，他们会睡得安稳。

**写出来的尺寸胜过形容词，规格表胜过渐变，一致性本身就是论据，不知道的写破折号。**
一个编出来的数字被抓到一次，买家会把所有数字都打折。

### 4. 白底图只放在 product finder

首页和产品页都不要白底图。

### 5. 共享工作树

- 陌生的未提交路径一律当作对方的：不还原、不格式化、不移动、不暂存、不提交、**不删除**
- 提交用 `git commit -F <消息文件> -- <明确路径>`
- **⚠ 但重出构建后必须先 `git add out/`** —— 见第九节第一坑
- `git add -A -- <目录>` 看起来精确，实际会把那个目录下所有陌生文件都收走

### 6. 做完一条推一条

已授权的工作不要反复请示。每两三个完成的目标就 checkpoint：提交 + 写 agent-update + 推送。
写在聊天里的东西下一次压缩就没了。

---

## 三、仓库地图与命令

```
content/products/*.json     584 条 HYDE 产品记录                    ← Claude
content/news/*.json         20 篇文章                                ← Claude
content/i18n/zh-terms.json  中文术语表                               ← Claude
src/data/ src/lib/          结构化数据与纯函数，几乎都有 .test.ts    ← Claude
src/app/(en)/               英文路由
src/app/es/                 西语路由                    ← Codex（下线期间 Claude 代管）
src/app/zh/                 中文站路由 → out-rayen/     ← Codex
src/components/site/        共享组件（西语文案也在这里，不只在 app/es）
scripts/*.mjs               全部生成器与审计            ← Claude
docs/hyde/                  给甲方看的 Word 文档
docs/collaboration/         交接、任务、给工厂的问题、agent-updates
```

### 命令

```bash
npm run check          # lint + typecheck + test + build + test:export
npm test               # 242 条测试
npm run deploy:prep    # 发布前跑这个
npm run copy:register  # 文案：机翻腔、空形容词、清嗓子、句长节奏
npm run copy:parity    # 英西数字是否一致
npm run seo:graph      # 全站链接图与 GEO 面，11 项
npm run seo:citability # AI 引用可能性打分
npm run sheets         # 重新生成给工厂的填写表
```

> **生成器规则**：任何数字都必须由 `scripts/` 里的脚本产出，不要手写进文档。
> 手写的数字过期了没人知道它过期了。

---

## 四、当前状态与本次验证结果

### 本轮（9.10–9.11）做完并上线的

| 事项 | 结果 |
|---|---|
| 逃生器械类目改名 | 46 条里 18 条名不副实，15 条改名（14 个外执手 + 072 锁体），全留 301 |
| 072 找到了 | 我之前报「目录里没有」是**错的**，它一直在，型号写作 `72` |
| BHMA/US 表面码 | 517 条里 **77 条（15%）**拿到号，进产品 FAQ 与 FAQPage 结构化数据 |
| 视频 uploadDate | 加时区，191 个视频从 0 个被索引解锁（等 GSC 验证修复） |
| nginx 301 | 16 条 → **48 条**，甲方已在服务器执行 |
| 西语排版 | **107 处**英文间距破折号按 RAE 改，正确 raya 10 → 89 |
| 英西数字对照 | **207 对段落，0 处不一致** |
| 首页 JS | **2,241 KB → 669 KB**（整本目录本来在浏览器里） |
| 第 20 篇文章 | 311 开模的五个月（甲方老板口述） |
| stahlock 全爬 | **452 页、2,143 条规格行** |
| 竞品认证对照 | Von Duprin / Yale / Cal-Royal / Detex / Klacci |

### 验证结果

```
npm test          242 / 242
lint              0 problem
typecheck         通过
deploy:prep       exit 0
seo:graph         11 项全清，0 error
seo:audit         1,204 可索引页，JSON-LD 1,204，语义问题 0
seo:deadlinks     100,989 条内链 + 29,804 条资源引用全部解析
copy:register     583 段，3 处命中（全是地道用法）
copy:parity       207 对段落，0 处数字不一致
citability        67 / 100
PageSpeed         手机 76 / 电脑 88；无障碍 100，最佳实践 100，SEO 100
```

### PageSpeed 剩下的

| 项 | 状态 |
|---|---|
| 首页 JS 2,241 → 669 KB | ✅ 已修，并加了测试锁住 |
| Speed Index 11.4 秒 | ⚠ **未处理**，见第七节 |
| 缓存生命周期 205 KiB | ⚠ 服务器/Cloudflare 配置，甲方动作 |
| 6 张产品缩略图无 srcset（164 KB） | ⚠ 未处理 |

---

## 五、卡在工厂的七条

**这是目前唯一真正的瓶颈**，不是设计、不是推广、不是外链。
详见 `docs/collaboration/2026-09-08-questions-for-factory.md`。

| 优先级 | 缺什么 | 挡住多少已有需求 |
|---|---|---|
| **最高** | **275 条产品没记录表面处理** | BHMA 覆盖率从 15% 往上走的唯一路径 |
| **最高** | **6068、窄边铝合金锁体的规格** | 各 3 个询盘，站上**根本没有页面** |
| 高 | **哪些 LC 型号配 072** | 42 个 LC 型号，不能替工厂背书 42 组配套关系 |
| 高 | 307/305/310/301/316-S 的尺寸 | 五张尺寸线图；BAU 规格制定者要的就是图 |
| 中 | **MOQ、常规交期、打样交期** | 买家淘汰我们的三条之一，站上一个字没有 |
| 中 | 退货 / 质量保证条款 | Trudoor 靠 BBB + 退货政策拿信任，我们连一句都没有 |
| 中 | 308 的规格 | 阿里 37 次曝光，该页现为 noindex |

> **尺寸线图画不了不是缺工具，是缺数字。** `build-dimension-drawings.mjs` 已经出了 79 张，
> 但只对**已发布尺寸**的产品出图。一张线图上的每条尺寸线都会被买家当作可下单的依据。

---

## 六、需求数据里最该记住的四件事

1. **AI 引用的是解释性文章，不是类目页。** `reading-door-hardware-model-numbers` 被引 7 次，
   类目页 3 次；被引前四里三篇是文章。**想被 AI 引用就写文章。**

2. **搜索流量是真的第三方流量。** 44 个国家、111 次 Google AI 曝光、EAN 条码、
   一条 Hindalco 的 BOM 行、竞品编号、拼错的词。甲方问过「是不是你和 codex 搜的」——不是。

3. **曝光和询盘不是一回事。** 307 曝光倒数第五（24 次），询盘第一（5 个）。
   主匙系统曝光 259 次全表最高。

4. **北美是两个体系的问题，不是认证少。** 五家竞品全部持有 ANSI A156.3 Grade 1 +
   UL 逃生器械列名，我们一项没有；我们有 EN 1125 + CE，五家一项没有。
   **307 与 311 已决定送检**（甲方 2026-09-10 决定，两个都送）。
   在证书号下来之前，**任何材料都不得暗示我们已持有 ANSI 或 UL** ——
   UL Product iQ 与 BHMA 目录都是公开可查的，规格制定者要把证号写进送审文件。

---

## 七、下一个人该做的三件事

**按「做了立刻有回报 × 不依赖任何人」排序。**

### 1. collections / projects 补具体数字（不用等任何人）

`npm run seo:citability` 已经量化了：

| 页面类型 | 分 | 每页具体数字 |
|---|---|---|
| `/product-finder` | 75 | 29 |
| `/collections/*` | **41** | **2.1** |
| `/projects/*` | **39** | **0** |

**数据在 `content/products` 里就有** —— 合集页可以写清有几个型号、覆盖哪些表面、
最小最大尺寸。这是目前投入产出比最高的一块。

### 2. Speed Index 11.4 秒 —— 但这是个设计决定，不是纯技术活

首页轮播**每 6 秒换一张**（`DISPLAY_INTERVAL_MS = 6000`，13 张幻灯片），
而 Lighthouse 测量窗口就是十几秒。视口里最大的元素在测量期间反复重绘，
Speed Index 自然停不下来。**这不是加载慢，是画面一直在动。**

⚠ **不要直接把轮播删掉或调慢来刷分。** 这牵涉两件事：

- `AGENTS.md` 里写着：「FSB spends a 1440px hero on one lever and no effects;
  that restraint is the most expensive-looking thing on their site.」
  —— 按这条，静态单图 hero 可能本来就是对的
- 但 hero 是设计区域，**归 Codex**，而且甲方从没说过轮播不好

**建议**：把这个判断连同数据一起摆给甲方，让他决定，不要单方面改首页外观。

### 3. 6 张产品缩略图补 srcset（164 KB）

首页 21 张图里 12 张有 srcset，6 张产品缩略图没有（15–45 KB 各）。
`getResponsiveEditorialImageProps` 只覆盖 editorial 图库，产品图走的是另一条路。

---

## 八、上一任欠的两件事

| # | 事情 | 卡在谁 |
|---|---|---|
| 1 | **`ca6020840s450` 查明是什么产品** | 三次搜索查不到任何门五金对应，**没有猜** |
| 2 | **Bing「来自高质量域的入站链接不足」** | 甲方指示跳过。但有一条免费的：**BAU 展商目录里的官网字段**确认填的是 `https://cantonlock.com`，广交会和巴西展同理 |

> 另外两件**已经做完**，别重复做：stahlock 爬取（452 页）已完成；
> `rxfse25r510l32d3` 已解出买家画像（`32D` 是 BHMA 砂面不锈钢，`RX` 是请求退出开关，
> `3` 是 3 英尺门 —— 北美规格制定者），厂家仍未查到。

---

## 九、八个踩过的坑

### 1. ⚠ 重出构建后必须先 `git add out/`（这条害网站出过故障）

`git commit -- out/` 只提交**已跟踪**文件里匹配路径的那些，**不会加未跟踪的新文件**。
2026-09-10 那次发布漏了 **1,871 个新文件**，包括首页 `<script>` 引用的两个 JS 分片。
HTML 返回 200、分片 404，甲方浏览器显示「This page couldn't load」。

**发布前检查 `git status --short out/ | grep -c '^??'` 必须是 0。**

### 2. 检测器自己也要被检测

我写的文案审计第一版命中 19 次「清嗓子」，几乎全是好句子
（`"…is not an answer. It is an answer plus an assumption."` 是平行结构）。
**一条惩罚全页最强段落的规则，会教作者删掉自己最好的一句。**

同样：`leverage` 被我当成商业套话，而命中的是
「resist the **leverage** of someone pulling on a handle」—— 那是力学术语。

### 3. 「保险」可能就是问题本身

给 `SiteFacts` 的 facts 留了 `?? siteFacts(locale)` 兜底，还在注释里写「兜底是它不设
必填的原因」。重出后体积纹丝不动 —— **那个 import 本身就把整个模块钉在客户端包里，
兜底走不走到毫无关系。兜底本身就值 1.5MB。**

### 4. 搜索后台的数字是历史，不是现状

Bing 报「371 个旧 URL 返回 200」，实测全部是正确 301 —— 那 322 条是七八月的上次抓取记录。
**不要把后台快照当成当前状态。**

### 5. `grep -c` 按行计数，压缩文件是一整行

我用 `grep -c srcset` 得出「首页零个 srcset」，实际有 12 个 ——
HTML 输出的是 `srcSet` 而我的 grep 区分大小写，且 `-c` 数的是行不是次数。
**差点去"修"一个没坏的东西。**

### 6. `sizes` 末尾的 `184vw` 是对的

手机上画框 4:3 而原图 2.55:1，`object-cover` 要填满就得让宽度溢出到约 1.9 倍。
仓库里有一条测试专门锁着它，注释写明了原因 —— 就是为了挡住想"修"它的人。

### 7. `node -e` 里的反斜杠和反引号会被 bash 吃掉

正则里的 `\/`、`\d`、`\s` 全会丢。**用 `cat > /tmp/x.js <<'EOF'` 写文件再跑，
或者直接用 Edit/Write 工具。** 这条这两天中了四次。

### 8. 仓库里 LF 和 CRLF 文件混着

字符串锚点匹配不上时，先 `JSON.stringify` 打印一行看看行尾符。

---

## 十、发布流程

```bash
npm run deploy:prep                    # build + 资产保留 + 导出审计 + 新鲜度检查
git add out/ out-rayen/                # ⚠ 必须，见第九节第一坑
git status --short out/ | grep -c '^??'  # 必须是 0
git commit -F <消息文件> -- <明确路径>
git push
```

推完在回复末尾写一句：**记得 purge**。不要多写。

### 服务器出问题时

| 症状 | 处理 |
|---|---|
| `git pull` 报 `local changes would be overwritten` + `Aborting` | 手册 1c-新 节。**注意 `git clean` 要加 `-e .user.ini -e .htaccess`** —— 那是宝塔生成的，还可能 `chattr +i` 删不掉导致整条命令中断 |
| 301 不生效 | 手册 1a 节，跑 `bash /www/wwwroot/cantonlock.com/deploy/install-nginx-redirects.sh` |
| 线上 404 | 先 `curl "网址?cb=123"` 排除 Cloudflare 缓存 |

---

## 附：还要读什么

| 文件 | 什么时候读 |
|---|---|
| `AGENTS.md` | **动手之前**。纪律全文 |
| `docs/collaboration/NOW.md` | **动手之前**。谁在动哪些文件 |
| `docs/hyde/HYDE-操作手册-CLIENT-RUNBOOK.docx` | 需要甲方手动操作时（Word，给甲方看的） |
| `docs/collaboration/2026-09-10-FOR-CODEX-MUST-READ.md` | Codex 回来时让他先看这份 |
| `docs/collaboration/2026-09-10-gtm-north-america.md` | 北美策略与竞品对比 |
| `docs/collaboration/2026-09-08-questions-for-factory.md` | 想知道为什么某个产品页是空的 |
| `docs/research/north-america-longtail.json` | 50 个北美长尾词，每条注明能不能诚实回答 |
| `docs/collaboration/agent-updates/` | 最近发生了什么，按日期倒着看 |
