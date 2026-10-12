# 巴西逃生锁专栏（barra antipânico）— 任务与授权记录

**这是有授权的例外，做法与阿根廷集合相同**（`2026-10-10-argentina-collection.md`）。

## 客户决定（原话，2026-10-12）

| 原话 | 含义 |
|---|---|
| 「把 saga disafe dks montec MRA DORMETAL SOPRANO 等等 的网站上的产品都爬取过来……建立一个巴西逃生锁专栏，我们都开了磨具」 | 抓这些品牌的逃生锁，做巴西专栏 |
| 「所有都是我们的授权 找我们定做的」 | 这些品牌都是找 HYDE 定做的客户，照片与文案已授权 |
| 「你设计一个 ar4 一样的或者那个拉手一样的或者去 FSB 学习下……拿出 SOTA 的水平 这是我们作为 OEM 源头厂家最大的优势要展现」 | 设计参照 AR-4 页、首页 9014 视频块、FSB；主题是「OEM 源头工厂」 |
| 「这个呀 有视频的 是吧 然后去 fsbna.com 再看看」 | 要有视频（同 9014 那块） |

Claude 先提出过顾虑：2026-02-13 的采购表（`sample buying list20260213.xlsx`）是在巴西零售买 DKS / Decor Metal 样品。客户随后答复「所有都是我们的授权，找我们定做的」，以此为准。

## 范围

- **包括**：Saga Portas、Disafe、DKS、Montec、MRA、Dormetal、Soprano、Decor Metal、Tivui（截图与采购表里的巴西品牌）。
- **不包括**：截图里的美国进口货（Kwikset、Dynasty Hardware、Fortstrong、Hawaminent）。它们不是巴西品牌，客户点名的也不是它们；要加须客户另行确认。

## 规则（同阿根廷）

- 页面上**不出现**任何客户品牌名。数据里的 `brand` / `sourceUrl` 只用于追溯，不渲染。
- 产品上冲压、印刷的客户品牌（DKS、MRA、Soprano 等标志）按 `scripts/argentina/retouch-stamps.mjs` 的方法修掉：只改方框内像素，孔位、螺丝、锁舌、边缘不动。「EMPURRE / PUSH TO EXIT」这类功能字样不是品牌，保留。
- 尺寸、材料、认证只用对方公开原文；没写的留空，不推算。
- 统一打 HYDE 水印。
- 主视频用 HYDE 自己的 306 系列工厂实拍（`public/videos/products/306-*.mp4`，片中本来就有葡语字幕，是给巴西市场拍的），裁掉字幕区，剪成无声循环片。

## 流水线

1. 抓取 → `tmp/claude-brazil/`（gitignored，仅本机）：`products.json`、`raw/<brand>/`、`crawl.mjs`
2. 去品牌字 → 归并同款 → 型号 BR 前缀 → 水印 → `src/data/generated/brazil-collection.json`
3. 页面 `/products/brazil/`（英）+ `/pt/products/brazil/`（葡），PARTIAL_ROUTES 仅 en/pt

## 进度

- 10-12：授权与范围记录（本文件）。
- 10-12：抓取完成：6 个品牌 103 条（Saga、MRA、Tivui 被 Mercado Livre 拦截或无官网，未取到）。三套预览 → 甲方选「A 多图 + 选型器」，并要求不写品牌数与厂商（下游客户，保密）。合成页 `/products/brazil/` + `/pt/products/brazil/` 已建，noindex，见 `agent-updates/2026-10-12-claude-brazil-proposals.md`。
- 10-12：补抓 Saga：官网 portacortafogo.com 只是维修服务站，商店在 www.portascortafogo.com（Yampi，脚本直连 403，浏览器正常访问可读），「Barra Anti-pânico」分类 4 件 → BR5-S、BR5-TK；共 40 个型号。MRA、Tivui 仍缺。
- 10-12：甲方「就按图片来呀 巴西专栏没有问题 非常好……做完你直接推送就行 工程在做别的」→ 上线：37 张客户照片经 workflow 逐张去品牌字（只改方框内像素，独立复核，失败的修后再复核），打 HYDE 水印后才进 `public/`；去 noindex、加 sitemap；产品菜单全语种加「Panic bars for Brazil」（es 与覆盖语种链英文页，pt 链葡语页）；首页阿根廷模块下加巴西模块（全语种）。本会话自己发布（`release:hyde` + GitLab 镜像）。
