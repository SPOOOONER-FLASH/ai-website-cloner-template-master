# 交接 — Canton Hyland / HYDE 官网

> 新会话先读这份，再按需读 `docs/collaboration/agent-updates/`（Claude × Codex 互通进度）。
> 最后更新：2026-08-27

## 一、这个站是干什么的

**不卖给建筑商。** 目标是海外经销商和项目采购，衡量标准是**产生多少封询盘 / 多少人点去阿里**。
成交发生在邮箱和阿里，不在本站。所以 FSB 那套 BIM 库、招标文本、门规划服务**价值很低，不要抄**。

**HYDE 是品牌**，Canton Hyland Hardware (Group) Co., Ltd. 是公司主体。

## 二、硬约束

| | |
|---|---|
| 框架 | Next.js 16 App Router，`output: "export"` 静态导出 |
| 正式域名 | **cantonlock.com**（已上线，Cloudflare CDN + Sectigo 证书） |
| 服务器 | 腾讯云法兰克福 `43.131.27.225`，宝塔 + nginx，与 stahlock.com 共用 |
| 部署 | 推送 GitHub → 服务器 crontab 每 5 分钟 `git pull` → nginx 发 `out/` |
| CMS | Decap，编辑写 GitHub JSON |

**由静态导出衍生的规则**

1. 每个动态路由必须有 `generateStaticParams()`，且不能返回空数组。
2. 没有服务端：询盘走 Web3Forms，搜索靠构建期索引。
3. **`out/` 提交进仓库**，改完必须 `npm run deploy:prep` 再提交。
4. 「CMS 保存 ≠ 上线」，还需要有人构建并推送。

## 三、内容纪律（违反会造成商业风险）

- **没有真实数据就留空，不要猜。** 空规格表是诚实的，编造的是事故——采购商照着下单。
- **认证只能对应点名该型号的检测报告。** 手上四份只覆盖 KD070/30-290、KD070/20-101、607 SS ET。
- **案例只有甲方确认供过货才能标「真实项目」**，否则一律「代表性应用」。
- **FAQ 商业性答案（起订量、交期、付款、OEM）留空等甲方填。**

## 四、当前状态

产品 431 · 静态页 471 · 图片 1342 张 · 测试 47 通过

**已完成**：全站页面、西语 7 页、FAQ、价格表索取、站内搜索、弹窗、CMS 五栏目、
SEO 元数据（471 页全带 canonical/hreflang/OG/JSON-LD）、`llms.txt`、Product Finder
（20/页 + 分面折叠 + 独立滚动）、全部 431 个产品链接服务端渲染（`ProductIndexList`）、阿里深链接、GA4 + Clarity、旧站 URL 301。

**分析与站长工具**

| | |
|---|---|
| GA4 | `G-RBTE7KF82P` 已收数据 |
| Clarity | `y8utyrgvv0` 已收数据 |
| IndexNow | key `6bb09b9b67d0e605a292835469627988`，验证文件在 `public/` |
| GSC | 820 已索引 / 961 未索引 |
| Bing | 533 indexed，86 errors |

## 五、⚠ 最要紧的两件未完成

**1. GSC「重复网页，用户未选定规范网页」525 页**
数量最大的未索引原因。需要逐类排查 canonical 是否自指。

**2. 西语只有 7 / 471 页**
`/es/` 导航的 href 全指向英文页，两个语区形成闭环。
`SPANISH_MIRROR_PREFIXES` 在 `src/data/site.ts`，加前缀即自动生成 hreflang 与 sitemap。

## 六、Bing 报的 86 个错误

| 类型 | 页数 | 说明 |
|---|---|---|
| `<h1>` 缺失 | 4 | 需定位是哪 4 页 |
| meta 描述过短 | 26 | 多为分类页 |
| 标题过短 | 25 | 同上 |
| 内容过少 | 25 | 44 个产品规格表为空 |
| `<img>` 缺 alt | 4 | |

## 七、需要甲方给数据才能推进

- 112 个产品无图（硬盘上没有）
- MOQ 与交期分档（阿里后台可导出，同时能填 FAQ 空着的两问）
- Application 用途字段（只有 30% 的产品有）
- 44 个属性字段里的整句话要改写成值
- 阿根廷四款锁（Elabora 代工）的型号与规格

## 八、甲方已确认的待办

**要做**：相关产品推荐 · Service 聚合栏目 · 展会日程页 · Newsletter · 资质证书页 ·
材料内容线 · 应用场景页 · 图片 ALT 批量管理 · 首页「当季主打市场」模块（方案待定，
倾向四宫格而非轮播）

**不做**：经销商查询 · 网站装修拖拽编辑器

## 九、怎么干活

```bash
npm run check        # lint + typecheck + build，提交前必跑
npm test             # 47 个测试
npm run deploy:prep  # 构建并校验 out/ 是最新
node scripts/audit-seo.mjs   # 读 out/ 的 HTML 审计 SEO
```

**协作**：Claude 与 Codex 共用一个工作树，无锁。开工前 `git log --oneline -5`，
只 `git add -- <明确路径>`，每次提交附一份 `docs/collaboration/agent-updates/`。

**文档纪律**：所有 `.md`（HANDOFF、agent-updates、docs/）写成最简洁的形式——表格与短句优先，
不写背景铺陈、不复述已知信息、不写礼貌用语。改完一件事就在 HANDOFF 里删掉对应的待办，
不要另起一段说「已完成」。目标是下一个 worker 用最少 token 读懂现状。

**验证纪律**：改了页面就实测，别凭 CSS 猜。用浏览器量 `getBoundingClientRect`。
本地验证生产产物用 `npx serve out`（**不要加 `-s`**，那是 SPA 模式会重写所有路径）。

**踩过的坑**

- `.git/index.lock` 反复出现（0 字节陈旧锁）→ 确认无 git 进程后 `rm -f` 即可。
- 改 crontab 用 `crontab <file>`，**不要用管道**，引号会被吃掉（曾误删腾讯云监控条目）。
- 写含反引号的文档用脚本文件，不要用 `node -e` 内联（反引号会被 bash 当命令替换）。
- nginx 子 `location` 一旦有 `add_header`，父级安全头会全部丢失，需在每个 location 重复声明。
- 本机 python 是商店占位程序，跑不了。

## 十、下一个会话建议顺序

1. **排查 GSC 525 个重复网页**（第五节 1）
2. **修分类与下载的接线** —— `content/{categories,downloads}.json` 改了不生效，
   前台仍读 `src/data/` 硬编码数组，是后台唯一的假功能
3. **西语铺开**（第五节 2）

**服务器相关**：回滚与止损见 `docs/deployment/CANTONLOCK_ROLLBACK.md`。
⚠ 证书 **2026-12-14 到期**且已开 HSTS（一年）——过期未续则网站完全打不开，
建议到期前换 Let's Encrypt 自动续期。
