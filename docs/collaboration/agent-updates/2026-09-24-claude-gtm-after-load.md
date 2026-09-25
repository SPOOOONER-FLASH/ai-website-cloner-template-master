# GTM 改为页面 load 后加载；GA4 第二资源删除交甲方（Claude 工程，2026-09-24）

- **甲方决定（09-24）**：「G-X7EMRX2V2X 之前加的，重复无用就删掉；GTM 改成页面加载完再装，但是一定要装上去」。
- **GTM**：`AnalyticsHead` 先建 `dataLayer`，再把 Google 官方代码原样包进 `window.addEventListener('load', …)`。代码仍在 `<head>`，安装检测器能找到；load 之前的阅读、点击事件先排进 dataLayer，GTM 到了再处理。`hoist-head-scripts.mjs` 的正则同时认新旧两种写法（已用两种样本验证，生成的代码能解析）。
- **G-X7EMRX2V2X**：它是 GA 后台 Google 代码 GT-PL3V5HF9 的第二个目标，不在网站代码里，会话删不了。步骤写进 CLIENT-RUNBOOK ④，由甲方操作；删除只停止转发，不删历史数据。
- **测试**：tsc 通过。发布后实测：HTML 有这段代码、load 后 gtm.js 下载、dataLayer 有 gtm.js 事件。
- **影响雷茵**：AnalyticsHead 只在 HYDE 三个 layout 里用；out-rayen 没有 GTM。
- **上线实测（069a44f1ae8，/products/care-grab-bars/）**：3714ms window load，同一刻请求 gtm.js（GTM-MQHHPGJL）；`google_tag_manager` 里有该容器；dataLayer 事件依次为 gtm.js、gtag js/config、gtm.dom、gtm.load。G-RBTE7KF82P page_view 1 次；G-X7EMRX2V2X 仍在收，等甲方按手册 ④ 删除。
- **2026-09-25 撤回延后加载**：甲方在 GTM 里点「Test your website」，结果是「Your Google tag wasn't detected」。线上 HTML 的 head 里有代码（第 4,786 字节），唯一的变化就是外面那层 load 包装。Analytics.tsx 的注释早就写着检测器是抓原文、按原样代码格式去找，所以改回 Google 安装对话框里的原样代码，连换行也一样，立即执行。gtm.js 仍是异步下载，不挡页面显示；容器目前是空的，性能代价很小。hoist 正则两种写法都认（已用原样文本验证）。
- **2026-09-25 更正**：「wasn't detected」不是 load 包装造成的，上一条的归因是错的。从 Google 的服务器请求本站（translate.goog）拿到的是 Cloudflare 的 403「Just a moment...」质询页（09-17 打开的 Bot Fight Mode）；从普通网络和 r.jina.ai 请求都是 200、页面里有 GTM。检测器看不到网页，与代码写法无关。原样代码保留（甲方：GTM 的触发逻辑就要在 load 之前）。验证安装改用 GTM Preview，见手册 ⑤。
