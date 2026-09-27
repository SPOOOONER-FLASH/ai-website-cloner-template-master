# 2026-09-27 · Claude（工程）· IndexNow 发布后只推真改过的页

**范围**：`scripts/indexnow-submit.mjs` 加 `--last-release` / `--since <ref>`；`npm run seo:indexnow:release`。

**为什么**：甲方转来的复盘写「每次发布后跑 IndexNow」（ChatGPT 靠 Bing 索引）。脚本原来要人手给 `--only`，实际没人跑。
按文件比对不行：每次构建都把 build id 和 chunk hash 写进全部约 7,000 个 index.html，逐字节 diff 说「全变了」。
现在去掉 script、_next 链接、class 后比「读者看得到的内容」：上一版发布 7,682 页字节变化，其中 4,291 页内容真变（七语种产品特性从西语换成本语种）。

**purge 守卫**：Cloudflare 缓存 HTML，purge 是甲方的事。提交前抽 3 个变化页，看线上 HTML 是否已含本次构建的 `"b":"<buildId>"`；不是就退出 1，提示先 purge。

**已做**：09-27 实推 3,954 条（进 sitemap 的那部分）→ IndexNow 200 OK。

**以后**：甲方说 purge 完，跑 `npm run seo:indexnow:release`。一次约 20 秒。

**没碰**：RAYEN、视觉文件、out/。

## 追加：只比 <head> + <main>

3d9ab7aec9c 发布后第一次实跑：页头语言切换一改，7,692 页全算「内容变了」。改为只比 head 与 main（页头页脚不算）。
这一版实际仍有 6,999 页变化：每个产品页（10 语种）新增了一句询价要点，是真改动。实推 6,329 条（在 sitemap 里的）→ 200 OK。
线上核对：/fr/…/310… 有「Projets + applications」区块；计算器和锁体文章的新 title 已生效。
