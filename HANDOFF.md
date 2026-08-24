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

**产品 431 个 · 静态页面 473 个 · 规格 1007 行 · 图片 608 张**

### 已完成

| 模块 | 状态 |
|---|---|
| 首页、产品总览/分类/详情、选型器、案例、下载中心、公司、联系 | ✅ |
| 西语版（首页、公司、联系、案例） | ✅ |
| 新闻 `/news`（press-release / insight 两类） | ✅ 结构完成，**0 篇内容** |
| FAQ `/faq` | ✅ 15 问，8 已答、7 等甲方 |
| 价格表索取 `/request/price-list` | ✅ 五字段短表单 |
| 站内搜索 | ✅ 461 条索引，构建期生成，浏览器匹配 |
| 弹窗 | ✅ 5 秒触发、两张卡片、**可分别关闭**、非模态 |
| 产品视频 | ✅ YouTube/Vimeo 链接或自托管 mp4，自动识别 |
| 产品富文本描述 | ✅ Markdown，限定按钮（防止粘贴带进字体标签） |
| 内容健康度看板 `/status` | ✅ 构建期算真数，非模拟 |
| CMS 五大栏目 | ✅ 产品 / 案例 / 新闻 / 分类与下载 / 网站设置（弹窗·导航·基础设置·FAQ） |
| CMS 皮肤 + 可视化预览 + 两栏表单 | ✅ UEESHOP 风格 |
| 阿里店铺入口 | ✅ 页尾「How to buy」 |

### 未完成 / 已知问题

1. **282 个产品没有任何图片**（431 中的 65%）。旧站只有 2022 那批水印图，按约定跳过。
   → **见第五节，硬盘里有解。**
2. **44 个产品规格表为空** —— 旧站页面本身就没有。
3. **`content/categories.json` 与 `downloads.json` 改了不生效** ——
   前台仍读 `src/data/{categories,downloads}.ts` 的硬编码数组。
   **这是后台里唯一「看着能用其实没用」的地方，优先修。**
4. **新闻详情路由暂存为 `src/app/news/[slug]/page.tsx.template`** ——
   静态导出下空数组会让构建失败，写完第一篇后 `git mv` 启用，同目录有 README。
5. `hero-designed-for.webp` 源图裁坏了（右侧 PUSH 被切）。
6. `aid 1608` 未导入：旧站列表页标型号 `024`，详情页规格块写 `023 ETAN`，自相矛盾。
7. 全站 noindex，等正式域名。

---

## 五、★ 硬盘素材：282 缺图问题的解法

甲方 F 盘已接入，两个目录：

### `F:\新网站资料`（80.4 GB，**这个是重点**）

按品类编号组织，**二级目录名就是型号**：

```
1-逃生锁/001, 015, 023, 305, 307, ...
3-执手锁/3431 SSET, 803, 808 SNET, ...
10-锁芯/45, 47BSIK, 54 SNDK, ...
24-工厂图    27-场景图    26-详情页模板
```

**已实测的匹配结果**（脚本产物在 `docs/research/legacy/drive-match.json`）：

| | |
|---|---|
| 硬盘型号目录 | 402 |
| 能对上站上产品 | **251** |
| **其中能补上当前完全缺图的产品** | **171 个**（占 282 缺口的 61%） |
| 对不上 | 151（部分是站上没有的型号，部分是命名差异如 `023` vs `023 ET`） |

**下一步怎么做**（建议作为最高优先级）：

1. 复用 `scripts/import-legacy-images.mjs` 的处理逻辑（转 webp、1000px、60KB 预算自适应降质）。
2. 按 `drive-match.json` 的 matched 列表，把每个型号目录里的图导进
   `public/images/products/`，写进对应产品的 `heroImage` / `gallery`。
3. **必须先目检**：用 sharp 拼 contact sheet 一次看几十张，确认没有水印、没有错图。
   之前就靠这个方法发现过「冷库门场景照混进 023 ETAN」和「PUSH 被裁掉」。
4. 151 个对不上的，导出清单给甲方确认型号对应关系。

`24-工厂图`、`27-场景图` 可用于公司页和应用场景页。

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
| 自定义属性（Type/Material/Certification/Color/Finish/Application/MOQ） | 和我们 `specs` 结构一致，可直接映射 |
| 阶梯价（200/500/1000 三档） | 我们不公开价格，但可做「MOQ 分档」展示 |
| 发货期按数量分档（≤200 → 8 天） | FAQ 的「交期」答案可以用这个结构 |
| 「Frequently bought together」 | **甲方明确要的相关产品推荐，见下** |
| FAQ 直接写在商品详情页底部 | 我们已有独立 FAQ 页，可考虑产品页也放几条 |
| 产品详情页底部「更多选择」放同系列型号图 | 同上，相关产品 |

---

## 七、甲方已确认的待办（按他勾选的）

### 要做

1. **相关产品推荐** —— 每个产品页放「类似产品」。数据已有（`relatedModels` 字段 + 同分类），
   目前详情页底部有 Related products 但仅靠手填的 `relatedModels`，大部分产品是空的。
   建议：手填优先，空则自动按同分类补齐。
2. **Service 聚合栏目** —— 把「报价 / 图纸 / 价格表 / FAQ / 联系」聚到一处，加进主导航。
3. **Robots.txt / LLMs.txt 后台管理**
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
  seo.ts                     每页 metadata
scripts/
  build-content-index.mjs    生成产品 barrel（prebuild）
  build-search-index.mjs     生成搜索索引（prebuild）
  import-legacy-images.mjs   图片导入（含自适应压缩，可复用于硬盘素材）
  import-legacy-catalogue.mjs 旧站产品导入
  legacy_report_xlsx.py      甲方报告
  recalc-excel.ps1           Excel 公式校验（LibreOffice 缺失时用 Excel COM）
public/admin/                Decap CMS：config.yml / admin.css / preview.js
docs/research/legacy/        旧站抓取产物 + 迁移报告 + drive-match.json
docs/research/fsb/           FSB 拆解结论（teardown.json，89 条发现）
```

---

## 十、给新会话的开场建议

最高价值的三件事，按顺序：

1. **把硬盘里那 171 个能补缺图的产品导进来**（第五节，已有匹配结果和可复用脚本）。
   这是目前对站点质量提升最大的一件事。
2. **修分类与下载的接线**（第四节问题 3），消掉后台唯一的假功能。
3. **相关产品推荐**（第七节 1），甲方明确要，且数据已具备。

动手前先 `git log --oneline -5` 确认 Codex 没有未合并的改动。
