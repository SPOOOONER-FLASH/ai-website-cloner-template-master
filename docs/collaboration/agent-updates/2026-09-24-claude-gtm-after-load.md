# GTM 改为页面 load 后加载；GA4 第二资源删除交甲方（Claude 工程，2026-09-24）

- **甲方决定（09-24）**：「G-X7EMRX2V2X 之前加的，重复无用就删掉；GTM 改成页面加载完再装，但是一定要装上去」。
- **GTM**：`AnalyticsHead` 先建 `dataLayer`，再把 Google 官方代码原样包进 `window.addEventListener('load', …)`。代码仍在 `<head>`，安装检测器能找到；load 之前的阅读、点击事件先排进 dataLayer，GTM 到了再处理。`hoist-head-scripts.mjs` 的正则同时认新旧两种写法（已用两种样本验证，生成的代码能解析）。
- **G-X7EMRX2V2X**：它是 GA 后台 Google 代码 GT-PL3V5HF9 的第二个目标，不在网站代码里，会话删不了。步骤写进 CLIENT-RUNBOOK ④，由甲方操作；删除只停止转发，不删历史数据。
- **测试**：tsc 通过。发布后实测：HTML 有这段代码、load 后 gtm.js 下载、dataLayer 有 gtm.js 事件。
- **影响雷茵**：AnalyticsHead 只在 HYDE 三个 layout 里用；out-rayen 没有 GTM。
