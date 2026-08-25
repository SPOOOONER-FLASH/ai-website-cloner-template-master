# 交接说明 — Canton Hyland / HYDE 官网

> 新会话请**先读这一份**，再按需读 PROGRESS.md 和 BUILD_PLAN.md。
> 最后更新：2026-08-24

---

## 一、这个站是干什么的（最重要，会改变优先级判断）

甲方 2026-08-24 明确：

- **不卖给建筑商/建筑师。** 目标客户是海外经销商和项目采购。
- **最终目的是引流到两个地方：邮箱询盘、阿里巴巴店铺。** 成交在那两个渠道发生，不在本站。
- 所以本站的定位是**品牌展示 + 产品展示**，衡量标准是「产生多少封询盘 / 多少人点去阿里」。

**这条推翻了早期按 FSB 做对标时的一些判断。** FSB 是德国高端品牌，面向建筑师做规格制定，
所以它有 BIM 库、招标文本、门专业规划服务。这些对我们**价值很低**，不要照抄。
真正值钱的是：拿到联系方式、把人送到阿里、让人相信这家工厂是真的。

品牌关系：**HYDE 是品牌**，Canton Hyland Hardware (Group) Co., Ltd. 是背后的公司主体。
页头只放 HYDE 标识，公司全称出现在页尾、公司页和 Organization 结构化数据里。

---

## 二、技术底座与硬约束

| | |
|---|---|
| 框架 | Next.js 16 App Router，**`output: "export"` 静态导出** |
| 部署 | 服务器只 `git pull`，**不跑 Node、没有数据库** |
| CMS | Decap CMS，编辑写 GitHub 上的 JSON，每次保存 = 一次提交 |
| 域名 | 现为 `spoonercantonlock.stahlock.com`（临时），正式域名 `cantonlock.com` 未启用 |
| 索引 | **`indexable = false`，全站 noindex** — 这是决定不是疏漏，等正式域名 |

### 由静态导出衍生的规则

1. **每个动态路由必须有 `generateStaticParams()`**，且不能返回空数组（会构建失败）。
2. **没有服务端**，所以询盘走 Web3Forms 直接 POST，搜索靠构建期索引 + 浏览器匹配。
3. **`out/` 提交进仓库**。改完必须 `npm run deploy:prep` 再提交，否则线上是旧的。
4. 「保存 ≠ 上线」：同事在 CMS 发布只是把内容写进仓库，**还需要有人构建并推送**。
   自动化方案（GitHub Actions）尚未做，见待办。

---

## 三、内容纪律（**违反会造成商业风险，不是代码风格问题**）

这一条是这个项目最重要的约定，历次会话都在遵守：

- **没有真实数据就留空，不要猜。** 空的规格表是诚实的，编造的规格表是事故 ——
  采购商会照着它下单。
- **认证只能对应点名该型号的检测报告。** 手上四份报告只覆盖
  KD070/30-290、KD070/20-101、607 SS ET。不能把兄弟型号的证书套用过去。
- **案例只有甲方确认供过货才能标「真实项目」**，否则一律「代表性应用」。
- **FAQ 里商业性答案（起订量、交期、付款方式、OEM 政策）留空等甲方填**，
  未回答的不渲染、不进结构化数据。
- 已知需要甲方拍板的冲突都记在 `docs/research/legacy/旧站素材迁移报告.xlsx`。

---

## 四、当前状态

**产品 431 个 · 静态页面 471 个 · 规格 1023 行 · 图片 1342 张**

> 2026-08-24 更新：硬盘 PSD 导入 + SEO 重写完成，见下方「近期变更」。

### 已完成

| 模块 | 状态 |
|---|---|
| 首页、产品总览/分类/详情、选型器、案例、下载中心、公司、联系 | ✅ |
| 西语版（首页、公司、联系、案例） | ✅ |
| 新闻 `/news`（press-release / insight 两类） | ✅ 结构完成，**0 篇内容** |
| FAQ `/faq` | ✅ 15 问，8 已答、7 等甲方 |
| 价格表索取 `/request/price-list` | ✅ 五字段短表单 |
| 站内搜索 | ✅ 461 条索引，构建期生成，浏览器匹配 |
| 弹窗 | ✅ **停留 10 秒触发、30 分钟冷却**、两张卡片、可分别关闭、非模态 |
| 产品视频 | ✅ YouTube/Vimeo 链接或自托管 mp4，自动识别 |
| 产品富文本描述 | ✅ Markdown，限定按钮（防止粘贴带进字体标签） |
| 内容健康度看板 `/status` | ✅ 构建期算真数，非模拟 |
| CMS 五大栏目 | ✅ 产品 / 案例 / 新闻 / 分类与下载 / 网站设置（弹窗·导航·基础设置·FAQ） |
| CMS 皮肤 + 可视化预览 + 两栏表单 | ✅ UEESHOP 风格 |
| 阿里店铺入口 | ✅ 页尾「How to buy」 |
| SEO 元数据 | ✅ 471 页全部有 canonical + hreflang + OG + Twitter card，字段长度达标 |
| `/llms.txt` | ✅ 构建期从目录数据生成，供 AI 答案引擎读取 |

### 近期变更（2026-08-24）

| 变更 | 结果 |
|---|---|
| 从硬盘 PSD 提取无水印原图 | 有图产品 **150 → 319**，完全缺图 **281 → 112** |
| SEO 字段按 Google/Bing 长度重写 | 构建产物有问题的页面 **427 → 1**（剩下那个是 `/admin`，本就 Disallow） |
| 筛选器属性归一 | 大小写合并；筛选器实际选项数见下方「属性字段现状」 |
| 规格标签合并同义词 | 38 → 32 个标签，`Application` 覆盖 80 → 130 个产品 |
| Product Finder 改造 | 分页 50/页；左栏只留 Category + Type；无图产品排到最后 |
| 双 agent 协作锁 | `scripts/agent-lock.mjs` + pre-commit hook，见 AGENTS.md |
| 弹窗时序锁进测试 | `src/lib/promo-settings.test.ts`；`npm test` 已接入 CI |
| 新增 `/llms.txt` | 从目录数据生成，`indexable=false` 时降级为暂存声明 |
| 新增 `public/seo/og-default.png` | 132 个页面此前没有社交卡片图 |
| sitemap 补齐 | 加入 `/product-finder`、`/faq`、`/request/price-list` |

**新增脚本**（都是先报告、加 `--write` 才落盘）：

```
scripts/import-drive-images.mjs      从硬盘 PSD 提取无水印图并挂到产品上
scripts/lib/psd.mjs                  PSD 图层读取（无第三方依赖）
scripts/lib/psdflatten.mjs           跳过水印层/角标层重新合成
scripts/lib/debadge.mjs              没有 PSD 时按白底涂掉角标
scripts/lib/marks.mjs                四种品牌标记检测
scripts/audit-seo.mjs                读 out/ 的 HTML 审计标题/描述/OG/结构化数据
scripts/generate-product-seo.mjs     重写 431 个产品的 seoTitle / seoDescription
scripts/normalise-product-data.mjs   材质/表面处理/门型大小写归一
scripts/consolidate-spec-labels.mjs  规格表同义标签合并
scripts/build-og-image.mjs           生成默认 OG 图
```

### 未完成 / 已知问题

1. **112 个产品仍无图片**（431 中的 26%）。这些型号在硬盘上要么没有目录，要么目录里
   只有 `雷茵/`（第三方品牌，不可用）。**需要甲方补拍或确认型号对应关系**，
   对不上的清单在 `docs/research/legacy/drive-match.json` 的 `unmatched`（151 条）。
2. **84 张已发布图片带 2022 年 `www.cantonlock.com` 斜向水印**，数据里标了
   `sourceNote: "2022-watermarked"`。甲方同意先用，拿到干净原片后按这个字段批量替换：
   `grep -rl '2022-watermarked' content/products/`
3. **44 个产品规格表为空**，且规格中位数只有 2 行，整体偏薄。
4. **`content/categories.json` 与 `downloads.json` 改了不生效** ——
   前台仍读 `src/data/{categories,downloads}.ts` 的硬编码数组。
   **这是后台里唯一「看着能用其实没用」的地方，优先修。**
5. **Product Finder 的结果区完全靠客户端渲染** —— 构建出的 HTML 里有目录数据但
   **0 个产品链接**。已补 ItemList 结构化数据兜底，但要让爬虫和 AI 引擎跟到具体型号，
   需要服务端渲染初始列表，或在页面底部加一个静态型号索引。
   **这是可见的设计改动，等甲方点头再做。**（分页本身已完成，不影响这一条。）
6. **属性字段里混进了 44 个整句话**，每一条在筛选器里都是一个独立勾选框。

   ⚠ 之前这份文档写「材质 71 → 41」是不准确的：41 是**值型条目**去重后的数量，
   自由文本那些并没有被归一化，仍然在筛选器里。现状：

   | 字段 | 筛选器选项总数 | 其中值型 | 其中自由文本（需人工改写） |
   |---|---|---|---|
   | material | 63 | 41 | **22** |
   | finishes | 92 | 78 | **14** |
   | doorTypes | 95 | 87 | **8** |

   例如 material 填成 "steel material with spray painting, different finishes are
   available."。归一脚本只报告不擅自改写——把句子改写成值是编辑判断：
   `node scripts/normalise-product-data.mjs`
7. **门型有 11 组单复数重复**（Fire Door / Fire Doors 等），同上，需人工定夺。
8. **12 行规格值填的是门的构造而不是用途**（"Single Door" 填在 Use 里），
   `node scripts/consolidate-spec-labels.mjs` 会列出来。
9. **新闻详情路由暂存为 `src/app/news/[slug]/page.tsx.template`** ——
   静态导出下空数组会让构建失败，写完第一篇后 `git mv` 启用，同目录有 README。
10. `hero-designed-for.webp` 源图裁坏了（右侧 PUSH 被切）。
11. `aid 1608` 未导入：旧站列表页标型号 `024`，详情页规格块写 `023 ETAN`，自相矛盾。
12. 全站 noindex，等正式域名。**`indexable` 一旦翻成 true，sitemap、robots.txt、
    llms.txt 三者同时生效**，已实测过输出（sitemap 467 条 URL）。

---

## 五、★ 硬盘素材：缺图问题怎么解决的（已完成，方法值得记住）

甲方 F 盘两个目录，重点是 `F:\新网站资料`（80.4 GB），按品类编号组织，
**二级目录名就是型号**：

```
1-逃生锁/001, 015, 023, 305, 307, ...
3-执手锁/3431 SSET, 803, 808 SNET, ...
10-锁芯/45, 47BSIK, 54 SNDK, ...
24-工厂图    27-场景图    26-详情页模板
```

### 关键发现：JPG 上有三种品牌标记，但 PSD 里它们是独立图层

硬盘上的 JPG 是导出产物，烧进了三种标记：

| 标记 | 形态 | 占比 |
|---|---|---|
| **STAHLOCK** | 另一品牌标准字，15% 不透明度横跨画面中央 | 1187 张候选图里 584 张 |
| **Hyland 红色角标** | 母公司 logo，压在影棚白底的角上 | 416 张 |
| **www.cantonlock.com** | 2022 批次的斜向重复域名水印 | 116 张 |
| **RAYEN 雷茵** | 第三方品牌，只存在于 `雷茵/` 子目录 | 按路径排除，从不导入 |

一开始试过对 STAHLOCK 做信号处理反解（水印 α 只有 0.22–0.33，数值上可行），
但**每张图的水印位置都不同**，配准反复撞到搜索边界并把母版洗白，投入产出比不划算。

**真正的解法是 PSD**：每张 JPG 旁边的修图源文件把水印保留为独立图层——
名字是固定哈希 `3d7a87fbe2efd9bad39f10e51879a18a`，不透明度 38/255。
Hyland 角标同样是独立图层（角落的小图层，含约 16% 红色像素）。
**跳过这些图层重新合成 PSD，得到的是精确原图而不是估计值。**

1187 张候选图里 1094 张有配套 PSD；最终发布的 699 张图里 683 张走 PSD 路线，
16 张退回 JPG + 白底涂抹角标（`scripts/lib/debadge.mjs`，产品贴太近时会拒绝处理而不是瞎猜）。

### 结果

| | |
|---|---|
| 有图产品 | 150 → **319** |
| 完全缺图 | 281 → **112** |
| 发布图片 | 608 → **1342** 张 |
| 标记为 2022 水印 | 84 张（`sourceNote: "2022-watermarked"`） |

### 教训（下次别再踩）

1. **排序不要用像素启发式覆盖客户自己的顺序。** 试过用「照片 vs 图纸」分类器重排，
   结果把安装说明书扫描件排成了主图。硬盘上 `首图` 就是客户指定的主图，
   数字前缀就是他们的序列——直接用。
2. **一个型号可能在两个品类目录下**（9082E、F101），按 slug 合并候选目录，
   否则同一产品会被处理两次，第二次只覆盖前几个文件、留下孤儿文件。
3. **每张渲染结果都要重新做标记检测**，不能假设 PSD 一定干净。
4. **导入前后都拼 contact sheet 目检。** 之前靠这个方法发现过
   「冷库门场景照混进 023 ETAN」和「PUSH 被裁掉」。

`24-工厂图`、`27-场景图` 尚未使用，可用于公司页和应用场景页。

### `F:\网站资料`（旧的，2022）

含 `产品图片` / `产品描述` / `类目分类` / `国内站`。优先级低于上面那个。

---

## 六、阿里巴巴：能做什么、不能做什么

- **不能抓取。** curl 和真实浏览器都试过，`cnhyland.en.alibaba.com` 与移动版
  均返回 captcha 拦截页（33 处拦截标记）。**解验证码是硬性禁区，不要再试。**
- 数据要么甲方从卖家后台导出（阿里后台有「导出」功能，出 Excel），要么手工复制。
- **可以学 Alibaba 的**（甲方从自己后台截图提供，已确认）：

| 阿里的做法 | 我们能借鉴什么 |
|---|---|
| 标题堆关键词到 128 字符上限 | 我们 SEO 标题偏短，可加型号+材质+认证+用途 |
| 副标题另 128 字符 | 对应我们的 `summary` |
| 自定义属性（Type/Material/Certification/Color/Finish/Application/MOQ） | 和我们 `specs` 结构一致。**已按这套做过一轮对齐**，见下方覆盖率表 |
| 阶梯价（200/500/1000 三档） | 我们不公开价格，但可做「MOQ 分档」展示 |
| 发货期按数量分档（≤200 → 8 天） | FAQ 的「交期」答案可以用这个结构 |
| 「Frequently bought together」 | **甲方明确要的相关产品推荐，见下** |
| FAQ 直接写在商品详情页底部 | 我们已有独立 FAQ 页，可考虑产品页也放几条 |
| 产品详情页底部「更多选择」放同系列型号图 | 同上，相关产品 |

### 对照阿里属性集，我们的数据覆盖率（431 个产品）

| 阿里属性 | 我们的字段 | 覆盖 | 备注 |
|---|---|---|---|
| Material | `material` + specs "Material" | **84%** | 已归一大小写，71 → 41 个值 |
| Finish | `finishes` + specs "Finish" | **51%** | 97 → 78 个值 |
| Application | specs "Application" | **30%** | 原来被拆成 5 个标签，已合并 |
| Type / Function | specs "Type" / "Function" | 10% | 两者含义不同，未合并 |
| Color | specs "Color" | 4% | 与 Finish 不同，未合并 |
| Certification | `certifications` | **5%** | 只能写点名该型号的报告，不可外推 |
| MOQ | —— | **0%** | 甲方未提供，建议从阿里后台导出 |

**最值得补的三项**（都要甲方给数据，不能猜）：

1. **MOQ 与交期分档** —— 阿里后台已有（≤200 → 8 天那种结构），导出即可用，
   同时能填上 FAQ 里空着的「起订量」「交期」两问。
2. **Application** —— 只有 30% 的产品写了用途。这是采购商最常搜的维度
   （"hotel door lock"、"fire door panic bar"），补齐性价比最高。
3. **规格行本身** —— 中位数只有 2 行，44 个产品完全为空。

---

## 七、甲方已确认的待办（按他勾选的）

### 要做

1. **相关产品推荐** —— 每个产品页放「类似产品」。数据已有（`relatedModels` 字段 + 同分类），
   目前详情页底部有 Related products 但仅靠手填的 `relatedModels`，大部分产品是空的。
   建议：手填优先，空则自动按同分类补齐。
2. **Service 聚合栏目** —— 把「报价 / 图纸 / 价格表 / FAQ / 联系」聚到一处，加进主导航。
3. ~~**Robots.txt / LLMs.txt**~~ —— `/llms.txt` 与 `robots.txt` 都已在构建期生成，
   随 `indexable` 开关联动。**后台可视化管理这两个文件尚未做**（目前改要动代码）。
4. **展会日程页**（广交会 / Big 5 / Intersec）
5. **Newsletter 订阅落地页 + 页脚订阅位**
6. **资质证书展示页**（四份报告目前只在下载中心）
7. **材料 / 表面处理内容线**（1007 行规格里已有数据，是聚合不是新写）
8. **应用场景页**（酒店 / 医院 / 学校 / 机场）
9. **图片 ALT 批量管理**

### 明确不做

- ❌ 经销商查询
- ❌ 网站装修（可视化拖拽编辑器）

### 需要后端，暂缓

询盘存储、客户 CRM、业务员分配、流量统计、转化率、SEO 检测评分、会员登录。

---

## 八、怎么干活

```bash
npm run check        # lint + typecheck + build，提交前必跑
npm run deploy:prep  # 构建并校验 out/ 是最新的
npm run cms          # 本地开后台，localhost:3001/admin/index.html，不需要登录
```

### 验证纪律

- **改了页面就要实测，不要凭 CSS 猜。** 用浏览器工具量 `getBoundingClientRect`、
  `getComputedStyle`、`scrollWidth - clientWidth`。之前靠实测抓到过导航折行、
  hero 溢出、logo 低于品牌最小尺寸、搜索排序错误。
- **dev server 的 CSS 可能陈旧**（新文件的 Tailwind 任意值类不生成）。
  遇到样式不生效先跑 `npm run build`，再用 `npx serve out`（**不要加 `-s`**，
  那是 SPA 模式会把所有路径重写到首页）验证生产产物。
- 断点：393 / 640 / 744 / 820 / 1032 / 1376 / 1512。桌面导航在 <1376 隐藏。

### 与 Codex 并行

甲方同时让 Codex 在做**设计与图片替换**（editorial 图片、品牌资产）。
两边都往 `main` 提交，已发生过 `.git/index.lock` 冲突。

- 提交前先 `git log --oneline -5` 看有没有别人的新 commit。
- Codex 主要动 `public/images/editorial/`、`docs/superpowers/`、品牌资产。
- 我方主要动 `src/`、`content/`、`scripts/`、`public/admin/`。
- 目前无实质冲突，但**提交前重新构建**，确保 `out/` 包含对方的新资源。

---

## 九、关键文件地图

```
content/                     内容源（CMS 编辑这里）
  products/*.json            431 个产品
  faq.json  promo.json  navigation.json  site-settings.json
  categories.json  downloads.json        ← ⚠ 改了不生效，待接线
src/data/                    类型与查询
  types.ts                   所有内容模型
  navigation.ts              导航 + 站点设置
src/lib/
  content-health.ts          /status 看板的数据
  seo.ts                     每页 metadata + defaultOgImage
  product-finder.ts          筛选器分面（valuesFor 不做归一，靠数据层保证一致）
src/app/
  sitemap.ts  robots.ts  llms.txt/route.ts   三者都随 indexable 联动
public/seo/og-default.png    社交卡片兜底图，由 build-og-image.mjs 生成
scripts/
  build-content-index.mjs    生成产品 barrel（prebuild）
  build-search-index.mjs     生成搜索索引（prebuild）
  import-drive-images.mjs    ★ 从硬盘 PSD 提取无水印图（第五节）
  lib/psd.mjs                PSD 图层读取，无第三方依赖
  lib/psdflatten.mjs         跳过水印层/角标层重新合成
  lib/debadge.mjs            没有 PSD 时按白底涂掉角标
  lib/marks.mjs              四种品牌标记检测
  audit-seo.mjs              ★ 读 out/ 的 HTML 审计 SEO，改完必跑
  generate-product-seo.mjs   重写 431 个产品的 seoTitle / seoDescription
  normalise-product-data.mjs 材质/表面处理/门型大小写归一
  consolidate-spec-labels.mjs 规格表同义标签合并
  build-og-image.mjs         生成默认 OG 图
  import-legacy-images.mjs   旧站图片导入（历史，已被 import-drive-images 取代）
  import-legacy-catalogue.mjs 旧站产品导入
  legacy_report_xlsx.py      甲方报告（⚠ 本机 python 是商店占位程序，跑不了）
  recalc-excel.ps1           Excel 公式校验（LibreOffice 缺失时用 Excel COM）
public/admin/                Decap CMS：config.yml / admin.css / preview.js
docs/research/legacy/        旧站抓取产物 + 迁移报告 + drive-match.json
docs/research/fsb/           FSB 拆解结论（teardown.json，89 条发现）
```

---

## 十、给新会话的开场建议

硬盘导图和 SEO 两件已经做完。**按当前价值排序，接下来最高的三件：**

1. **修分类与下载的接线**（第四节问题 4）——
   `content/{categories,downloads}.json` 改了不生效，前台仍读 `src/data/` 的硬编码数组。
   这是后台里唯一「看着能用其实没用」的地方，同事在 CMS 改了会以为生效了。
2. **相关产品推荐**（第七节 1）—— 甲方明确要，数据已具备。
   手填 `relatedModels` 优先，为空则按同分类自动补齐。
3. **Service 聚合栏目**（第七节 2）—— 把报价/图纸/价格表/FAQ/联系聚到一处进主导航。
   这直接服务于「产生询盘」这个唯一指标。

**需要甲方给数据才能推进的**（可以一次性问齐）：

- 112 个产品的图片（硬盘上没有，见第四节问题 1）
- MOQ 与交期分档（阿里后台可导出，同时能填 FAQ 里空着的两问）
- Application 用途字段（只有 30% 的产品有）
- 44 个属性字段里的整句话要改写成值（第四节问题 6）
- 门型单复数、12 行填错位置的规格值（第四节问题 7、8）

### 动手前

```bash
git log --oneline -5     # 确认 Codex 没有未合并的改动
npm run check            # lint + typecheck + build
```

### 收尾前

```bash
node scripts/audit-seo.mjs   # 目标：只剩 /admin 一个页面有问题
npm run deploy:prep          # 必跑，否则线上是旧的
```
