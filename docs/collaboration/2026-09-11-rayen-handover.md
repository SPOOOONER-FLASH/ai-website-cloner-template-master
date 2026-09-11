# 9.11 周末出差 雷茵 工程交接

> 交接人：Claude（johns 机器）｜日期：2026-09-11｜接手前先读第 4 节和第 8 节。
>
> **文件名用 ASCII。** Git Bash 在 Windows 下对中文路径的 pathspec 匹配不稳，
> `git commit -- <中文路径>` 会直接报 `did not match any file`，而且报得很安静 ——
> 你以为提交了，其实什么都没进去。这份文件叫 `2026-09-11-rayen-handover.md`
> 就是这个原因，别改成中文名。

---

## 1. 三十秒版本

雷茵（中山市雷茵五金制品有限公司，RAYEN）是一个**独立的中文站**，
跟 HYDE / cantonlock 共用一套 Next 工具链和一个 git 仓库，但输出到**不同的目录、不同的 vhost**。

- 源码：`src/app/zh`（中文）、`src/app/zh-en`（英文）
- 构建产物：`out-rayen/`，英文在 `out-rayen/en/`
- 预览域名：`https://spoonercantonlock.stahlock.com/`（正式域名未定，robots 全站 Disallow）
- 在售：**75 个型号 / 6 个品类 / 518 张图**（HYDE 那 580 多个型号不在这个站上）

**`/zh-en/` 永远是 404，那不是 bug。** 它是构建期前缀，部署后英文在 `/en/`。

**现在最要紧的一件事**：本次的产品图打标（518 张）**已经做完、已经构建、但没能提交** ——
另一个会话连续占着 `.git/index.lock`。详见第 4 节，接手第一件事就是把它提交推送。

---

## 2. 雷茵的六条纪律

HYDE 有它自己的六条；这是雷茵的。

### 一、purge 只由甲方做
构建 `out-rayen/`、提交、推送，最后写一句「记得 purge」。**到此为止。**
不要开 Cloudflare 后台、不要找 API token、不要调 purge 接口、不要去研究边缘缓存为什么看着是旧的。
更不要暗示 purge 已经发生过。登录页、超时的控制台、没有 token、边缘缓存是新的、源站部署成功 ——
这是五件不同的事，没有一件等于 purge。

### 二、绝不生成想象出来的金属产品
不是「提示词写好点就能过」的质量线，是**品类规则**。
孔位、螺距、方轴、背距、安装中心距在开模那一刻就定死了。
生成出来的执手看着像那么回事，孔位是错的，装不上去 —— 而买家赔进去的是一整批货。
**可以做的**：把真实照片修干净、白化、去背景、纠正透视、统一阴影、把甲方自己的展会照片调正。
**不可以做的**：生成不存在的产品、给真产品加减零件、拼一个工厂不成套卖的「套装」、一张图里混表面处理。
**出图前问一句**：买家能不能拿着这张图去车间订到这个零件？需要加注解才行，就不发。

### 三、专业感比好看重要
买家买的是「这家供应商不会出错」这个信念。装饰最多是中性的 ——
一个动效不会让孔位变正确，一个拼命想打动人的页面读起来像在补偿什么。
**一个写明的尺寸胜过一个首屏动画；一张规格表胜过一个渐变。**
**一致性本身就是论证**：十五张一模一样打光的产品板说「这是一家有流程的工厂」，
十五张各拍各的说「这些图是从别处凑来的」。
**不知道就说不知道**：缺的尺寸写短横线。买家抓到一个编出来的数字，会把整张表都打折。

### 四、白底只放 product finder
白底是给可筛选的产品检索页用的。内容页、公司页、品质页不要整片纯白铺开 ——
这个站的层次靠 `--color-surface` / `--color-surface-alt` 和线框分区，不靠大白块。

### 五、共享工作树
Claude 和 Codex（以及并行的另一个 Claude 会话）**共用同一个 checkout**，没有全局锁。
- 动批量文件前，在 `docs/collaboration/NOW.md` 加一行；提交完删自己那行，**不删别人的**。
- **只按明确路径暂存**：`git add -- <paths>`。共享脏树里绝不用无差别批量暂存。
- **构建完先 `git add out/ out-rayen/` 再 `git commit`。** pathspec 形式不会加未跟踪的新文件 ——
  2026-09-10 就这样漏掉了 1,871 个文件，首页 `<script>` 引的 chunk 全 404。
- 看见一堆不认识的改动是**正常的**，不是停下来调查的信号。`out/` 一个目录就 2,350 个文件。
- `out/` 脏 = 接力棒在别人手上，别构建、别碰 `out/`。

### 六、做完一条推一条
甲方 2026-08-31：「做完你就立即推送部署」。2026-09-07：「不打断，你继续工作，做完一条推送一条」。
已授权的活不要反复请示。把长任务切成能独立发布的段，每段验完就提交推送。
服务器每 5 分钟 `git pull`，**没推的提交对谁都没用**。
检查不过就修或者回滚 —— 「先放着不推」不是第三个选项。

---

## 3. 仓库地图与命令

### 雷茵相关的文件在哪

| 路径 | 是什么 |
|---|---|
| `src/data/rayen.ts` | 数据边界。读 `products-zh.json`，按 `sites.includes("rayen")` 过滤 |
| `src/data/rayen-i18n.ts` | **中英文案都在这里**。改文案只改这个文件 |
| `src/components/rayen/pages.tsx` | 八个页面的正文，按 locale 取参数。两套路由都是薄壳 |
| `src/components/rayen/Chrome.tsx` | 页头页脚，一套组件两种语言 |
| `src/components/rayen/primitives.tsx` | Shell / Photo / NoPhoto / SpecTable / ProductCard / FactStrip |
| `src/components/rayen/Gallery.tsx` | 产品图库（客户端组件） |
| `src/app/zh/**` · `src/app/zh-en/**` | 路由薄壳，各 8 个页面 |
| `content/rayen/site.json` | 品牌数据、联系方式、中英字段 |
| `content/products/*.json` | 型号数据。`sites` 字段决定上哪个站 |
| `scripts/build-chinese-mirror.mjs` | 生成 `src/data/generated/products-zh.json`，同时产出中英两套 |
| `scripts/build-rayen-site.mjs` | 把 `out/zh` 抬成 `out-rayen/`，`out/zh-en` 抬成 `out-rayen/en/` |

### 图片流水线（顺序不能换）

```bash
npm run rayen:images
```

等于四步串起来：

1. `build-rayen-product-images.mjs` —— 去水印
2. `delocalize-drawings.mjs` —— 图纸上的日文改中文、他厂编号改掉
3. `square-rayen-plates.mjs` —— 竖长/超宽的白底产品图补白边成正方形
4. `brand-rayen-images.mjs` —— 打雷茵标

**为什么不能换顺序**：补白边会移动画面坐标，`delocalize-drawings` 的坐标是按原图量死的，
必须在补白边**之前**跑。打标必须最后，否则补白边会把标挤到画面中间。

检查（CI 用，不写文件）：

```bash
npm run rayen:images:check
```

### 常用命令

```bash
npm run rayen:mirror        # 重新生成中英镜像数据
npm run rayen:site          # 只重跑 out/zh → out-rayen 的搬运
npm test                    # 242 个测试
npm run deploy:prep         # 完整发布构建 + 全部发布检查
```

---

## 4. 当前状态与本次验证结果

### 已经上线的

| 项 | 提交 | 状态 |
|---|---|---|
| 英文版（同域名 `/en/`，八页两语言一套组件） | `dd1bbbb324` | ✅ 已推送 |
| 竖长图被方框裁掉的修复（327 张受影响，实修 70 张） | `0fc5472016` | ✅ 已上线验证 |
| 图纸日文 + BRN-HB001 改写（4 张） | `0fc5472016` | ✅ 已上线验证 |
| 中文文案重写（走进雷茵「像机翻」） | `bd3fe79bd0` | ✅ 已上线验证 |

### ⚠ 做完了但**没提交**的 —— 接手第一件事

**产品图打雷茵标，518 张。**

- 图片**已经改在磁盘上**（`public/images/products-rayen/`）
- `scripts/brand-rayen-images.mjs` **已写好**（未跟踪）
- `content/rayen/image-branding.json` 账本**已生成**（未跟踪）
- `package.json` 的 `rayen:images` 链**已改**
- `npm run deploy:prep` **已跑完**，`out/` 和 `out-rayen/` 是新的

**为什么没提交**：另一个会话（在做西语排版）从 00:43 起连续占着 `.git/index.lock`，
六个 git 进程在跑。按第五条纪律，不跟它抢。

**接手照做**：

```bash
git add public/images/products-rayen content/rayen scripts/brand-rayen-images.mjs package.json out/ out-rayen/ src/data/generated public/search-index.json
git status --short out/ out-rayen/ | grep -c '^??'
```

**第二条命令必须输出 0** 才能提交。不是 0 说明 `git add` 被锁挡掉了 —— 重跑，别往下走。
提交信息草稿在 `/tmp/brand-msg.txt`（如果没了，第 2 节和本节够你重写一份）。

### 本次验证结果

```
npm test                 242 / 242 通过
npm run rayen:images:check
  products-rayen/ 与源图一致（3265 张）
  图纸本地化检查通过：4 张都能定位
  产品图缩放检查通过：518 张，没有会被方框裁掉的
  产品图品牌标检查通过：518 张都带标
npm run deploy:prep      死链审计 1369 页 / 101,187 条内链 / 30,012 个资源引用 全过
                         语义 SEO 问题 0
                         ✅ out/ 比所有源文件都新
```

### 全站品牌排查（这轮做的，结论是干净的）

| 位置 | 结果 |
|---|---|
| 站点 logo `/images/rayen/logo.webp` | 本来就是 RAYEN 雷茵 ✅ |
| 75 张产品主图 | 无任何别家标记 |
| 350 张实景照 | 无签名、无标牌 |
| 44 张图纸 + 168 张线稿 | 日文与 BRN-HB001 已改 ✅ |
| 水印账本 | 雷茵在售图 **0 张**曾带水印 |
| 16 张清不干净的 | 本来就不进雷茵站（镜像会剔除）✅ |

所以打标那一步**只做加法**，没有「换掉」谁。

---

## 5. 卡在工厂的七条

这七条都不是代码问题，是**等甲方给东西**。别自己编，编了就违反第二、第三条纪律。

1. **雷茵自己的电话** —— `content/site-settings.json` 里的号码是 HYDE 的（美国号）。
   现在页脚和联系页显示短横线。
2. **雷茵自己的邮箱** —— 同上，现有的是 `@cantonlock` 域，属于另一家公司。
3. **微信号 / 微信二维码** —— 联系页留着位置。
4. **营业执照扫描件** —— 品质页现在写明「证书扫描件我们还没有放上来」。
   要带编号看得清的原件，糊的不如不放。
5. **检测报告（如有）** —— 有没有 BHMA / EN / CE 都不知道，所以一个字都没写。
6. **正式域名** —— 定了之后要同时改：`content/rayen/site.json` 的 `preview.host`、
   `build-rayen-site.mjs` 里的 robots.txt（现在全站 `Disallow: /`）、nginx vhost。
   **robots 要和域名在同一个提交里改**，不能提前放开。
7. **ICP 备案** —— 服务器在法兰克福，没有粤ICP备可填，页脚留空。
   编一个是任何人十秒钟就能在 beian.miit.gov.cn 查穿的、有刑责的谎。
   哪天迁到境内主机并备案了，号填在 `Chrome.tsx` 页脚那个位置。

---

## 6. 需求数据四件事

老板给过一张《产品网站模块表》，要求每个产品页都对得上。现在**只做到一半**。

| 字段 | 现状 |
|---|---|
| 类别 / 材质 / 表面处理 / 尺寸 / 产品图 | ✅ 已有 |
| 间距（中心距）/ 重量 / 安装孔径 | ⚠ 部分型号有，大量空着 |
| 施工（安装方式）/ 机能 / 备考 | ❌ 基本没有 |
| 价格 | ❌ **故意不做**，也不要从 artunion 抄 |
| 系列 / 施工案例 / 目录位置 | ❌ 没有 |

四件事：

1. **artunion.co.jp 抓规格** —— 按**型号**匹配，不要按标题或图片匹配（会串）。
   要的是 重量 / 施工 / ピッチ（间距）。**价格一律不抓。**
2. **补齐 重量 / 安装孔径 / 中心距** —— 首页那句「每个型号都有独立规格表：材质、尺寸、
   中心距、安装孔径、重量和表面处理」已经这么写了，**表里必须真有这几栏**，
   否则损失的不是这一句，是整张表的可信度。
3. **机能 / 备考** —— 锁类才有（功能代号：入户、通道、浴室、教室、库房）。拉手类没有，别硬塞。
4. **系列归并** —— `styleFamily` 字段已经在用（同款式执手↔拉手成套），可以扩展成"系列"。

---

## 7. 下一个人该做的三件事

**按这个顺序。**

### 一、把第 4 节那个没提交的打标推上去
十分钟的事，但现在磁盘上和线上不一致 —— 这是最危险的状态。
记得先确认 `git status --short out/ out-rayen/ | grep -c '^??'` 输出 0。
推完写一句「记得 purge」。

### 二、artunion 规格抓取
见第 6 节第 1 条。按型号匹配，不抓价格。
抓完写进 `content/products/*.json`，跑 `npm run rayen:mirror`，
新出现的规格标签要在 `zh-terms` 里补中文 —— 否则
`src/lib/rayen-paths.test.ts` 里那条 `--check` 会直接让 CI 挂掉（这是故意的，
半中半英的规格表没人看）。

### 三、中文文案继续打磨
走进雷茵已经重写过了。剩下 品质与认证 / 合作与定制 / 联系我们 还是偏短偏硬。
**参考语体**：悍高 higold.com（企业开篇怎么写）、坚士 janes-lock.com.cn
（一家工厂怎么陈述厂区、产能、认证）。顶固 dinggu.net 的 `/about.html` 已经 404，别浪费时间。

**判断机翻的诀窍**：不看用词，看句子骨架。
「经验始于」是 "experience begins in"；三样以上的东西用「与」连是英文列表习惯；
「从…到…」后面不断句直接接谓语，中文读起来没有关节。

---

## 8. 上一任欠的两件事

### 一、一个空提交信息的提交，已经推上去了

`bc7af2e4c6`，提交信息是空的。当时拿 `git commit -F /dev/null --allow-empty-message`
去试探索引锁 —— 这是个坏主意，它真的建了一个提交。
**没有 amend**，因为同一分支上还有别的会话在работать，改写已推送的历史会连累他们。
就让它留着。**探测锁只用 `ls .git/index.lock`，永远不要拿真提交去试。**

### 二、一次把别人半写完的 JSON 提交进去了

`git add -A -- content` 扫进了另一个会话正在写的 5 个产品 JSON（bh55–58、dv04），
提交上去是截断的、解析不了的。后来补了一个提交修回来。
**教训：只按明确路径暂存，永远不要在共享脏树里用 `-A`。**

---

## 9. 八个踩过的坑

1. **`git add` 被索引锁挡掉，但 `&&` 链把错误吞了** ——
   `git add ... >/dev/null 2>&1; git commit` 看起来成功了，其实什么都没加。
   **提交前必须验** `git status --short out/ | grep -c '^??'` 是不是 0。
   2026-09-10 就是这样漏了 1,871 个文件，HTML 返回 200、chunk 全 404，
   甲方浏览器上写着 "This page couldn't load"。

2. **`git commit -- <中文路径>` 静默匹配不到** ——
   Git Bash / Windows 下中文 pathspec 不稳。**新文件一律用 ASCII 文件名。**

3. **Windows errno -4094（UNKNOWN）** —— sharp 用 `sharp(路径)` 读图时会一直占着文件句柄，
   往**同一个路径**写就报这个错。**先 `readFileSync` 成 Buffer 再交给 sharp**，就地覆盖才安全。
   另外两个会话同时跑图片流水线也会撞出这个错 —— 所以脚本要「重试一次，还不行就跳过并报告」，
   绝不能让一个文件锁死掉整条发布线。

4. **字段名写错，脚本"成功"了但只做了零头** ——
   产品记录的图库字段叫 `gallery`，不叫 `images`。第一版 `square-rayen-plates.mjs`
   读 `product.images`，读到空，于是只处理了 75 张主图、报告「成功」，
   每个产品页的其余视图全都还是裁的。**两个字段名都读**，改名不会再让它悄悄缩水。

5. **新增品类要注册五处** —— `content/categories.json` 的 `image`、
   `configurator.ts` 的 `OPTION_NOTES`、`OPTION_NOTES_ES`、`category-sourcing.ts`，
   而且**子品类也必须有 `image`**，否则构建会在 `/_not-found` 崩，
   报 `Cannot read properties of undefined (reading 'src')` —— 报错位置和真正的原因毫无关系。

6. **`/zh-en/` 必须在 `/zh/` 之前替换** —— 反过来 `/zh/` 会把 `/zh-en/` 的前四个字符吃掉，
   剩下 `-en/`。**构建不报错、页面照样生成**，只有点下去才 404。

7. **`hover:underline` 这类工具类被测试禁掉了** —— `short-marker.test.ts` 扫的是**文件文本**，
   所以连注释里把被禁的类名原样写出来都会让测试挂掉。

8. **客户的压缩包名比图纸更可信** —— PRE_G600 我按图纸判成「双层毛巾杆」，
   客户的包名写的是「一字型淋浴门拉手」。**包名赢。**
   还有 G2110 那张备选首页图，墙上有日文招牌「スタジオ B」，换掉了。

---

## 10. 发布流程

```bash
# 0. 先看接力棒在不在自己手上
git status --short out/ | wc -l          # 不是 0 就别构建，等别人提交
cat docs/collaboration/NOW.md

# 1. 图片流水线（改过图或图片脚本才需要）
npm run rayen:images

# 2. 数据镜像（改过 content/products 或文案才需要）
npm run rayen:mirror

# 3. 检查
npx tsc --noEmit
npx eslint
npm test                                  # 242 个

# 4. 完整发布构建（包含 next build + 搬运 + 死链审计 + SEO 审计）
npm run deploy:prep

# 5. 确认英文站真的出来了
ls out-rayen/en/index.html                # 不存在就是搬运没跑，别忽略

# 6. 暂存 —— 必须先 add 再 commit，pathspec 不会加未跟踪的新文件
git add out/ out-rayen/ <你改的源码路径>
git status --short out/ out-rayen/ | grep -c '^??'    # ← 必须是 0

# 7. 提交信息先写成文件，再 -F。不要把 heredoc 挂在 && 后面
#    （add 失败时 && 会短路，heredoc 根本不跑，最后提交出一个只有警告行的信息）
git commit -F /tmp/msg.txt

# 8. 推送
git push
```

服务器 crontab 每 5 分钟 `git pull` 一次，nginx 直接服务 `out/`（HYDE）和 `out-rayen/`（雷茵）。
**推完最后写一句：记得 purge Cloudflare。然后就停。**

---

### 一句话交接

英文版、缩放、图纸日文、中文文案都已上线；**产品图打标 518 张做完了但卡在索引锁上没提交，
接手第一件事就是把它推上去**（第 4 节有照抄的命令）；然后 artunion 抓规格、继续磨文案。
七条缺料在甲方手上，别自己编。
