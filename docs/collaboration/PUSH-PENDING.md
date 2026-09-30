# 未推送积压

`npm run ship` 三次推不上时写这里（甲方 2026-09-23：推不上就报告，先做别的，不要干等）。
成功推送后，这里的记录随之上传，作为历史保留。

## 2026/9/24 03:44:51 · 三次推送失败

原因：合并停下（远端改了有人正在编辑的文件）：warning: in the working copy of 'out/es/products/lock-cases/lc8520b-lock-case/__next.es.txt', LF will be replaced by CRLF the next time Git touches it / warning: in the working copy of 'out/es/products/lock-cases/lc8520b-lock-case/index.txt', LF will be replaced by CRLF the next time Git touches it

未推送的提交：

- `f3aff3c2f2b` shiplog: 更新上线存档
- `30c65ee87d3` ship：被拒后用 merge 而不是 rebase —— 共用工作区里总有别人的未提交改动
- `c2758224a58` shiplog: 更新上线存档
- `59b1ba8c1c3` 推送纪律：npm run ship 三次不成就记下来去做别的；每次推送自动更新上线存档
- `2012aacb05f` Release two missing HYDE mobile carousel crops

下一次 `npm run ship` 成功时这些会一起推上去。

**已解决（2026-09-24）**：共用工作区有人在重建 out/，合并被挡；旁路检出里又遇到 scripts/release-site.mjs 真冲突（另一会话同时修了它）。手工合并两边改动后推送 `1eb49b135b9`，上面列的提交全部已在远端。

## 2026/9/24 03:59:56 · 三次推送失败

原因：旁路合并也失败：fatal: unable to access 'https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master.git/': Recv failure: Connection was reset

未推送的提交：

- `d0ca5d29d2e` ship：失败原因过滤 CRLF 警告；积压记录标注已解决

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/24 06:43:58 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：CONFLICT (content): Merge conflict in content/promo.json / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `d73f0524ebe` shiplog: 更新上线存档
- `1ae899aca79` 弹窗：目录下载换成配置器，葡语页面恢复弹窗

下一次 `npm run ship` 成功时这些会一起推上去。

> 已解决 2026-09-24：旁路检出手动合并 promo.json（保留配置器卡 + 远端西语「planilla de puertas」），`e99d85f59ac` 已推送。

## 2026/9/24 08:19:23 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging src/data/pt-glossary.ts / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `c52bd67bcb5` shiplog: 更新上线存档
- `a74b910b066` 规格术语表补齐西 10 葡 6；306 三条补西葡；译者加 --only 做定向重写

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/24 08:24:36 · HYDE（cantonlock.com）发布三次推送失败

构建好的发布提交 `f4175e4360b`（源码 101f83baa3f）没推上去。网络恢复后重跑 `npm run release:hyde` —— 检出和依赖都已缓存。

> 已解决 2026-09-24（Claude Hyde 视觉）：不是网络问题。三次都是 `fetch first`，因为别的会话在推送大包 out/ 的几分钟里往 main 推了提交。在 E:\release\release-hyde 里 fetch、rebase、立即 push，第一次就成功：`32871f5eb0c`（源码 101f83baa3f）。

## 2026/9/25 00:22:57 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging scripts/import-guide-heroes.mjs / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `9c9ea120666` shiplog: 更新上线存档
- `c8e012f4309` Replace rejected guide composites with genuine catalogue photos

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/25 08:06:02 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging scripts/build-taxonomy-redirects.mjs / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `30ff59603d4` shiplog: 更新上线存档
- `ea1b3550713` Cloudflare 报告处理：security.txt 上线、改名视频 18 条 301、手册 ⑥、AI 抓取数据进看板

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/25 08:07:42 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging scripts/build-taxonomy-redirects.mjs / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `b1fe5a05859` shiplog: 更新上线存档
- `30ff59603d4` shiplog: 更新上线存档
- `ea1b3550713` Cloudflare 报告处理：security.txt 上线、改名视频 18 条 301、手册 ⑥、AI 抓取数据进看板

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/25 18:11:24 · 三次推送失败

原因：旁路合并也失败： ! [remote rejected]         HEAD -> main (cannot lock ref 'refs/heads/main': is at edaf8533ee3e44d28557d250aaec120b895213d1 but expected a4c49f93999fa88867a5e18127f2ad6b0ab60538) / error: failed to push some refs to 'https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master.git'

未推送的提交：

- `031b3c481a3` shiplog: 更新上线存档
- `41368600df7` 七语种：指南第二批（fr/ko/tr/ar 30，ru 20，ja 18，de 10）；术语表删两个死键

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/25 18:19:00 · 三次推送失败

原因：旁路合并也失败：hint: before pushing again. / hint: See the 'Note about fast-forwards' in 'git push --help' for details.

未推送的提交：

- `3c50b33579a` shiplog: 更新上线存档
- `031b3c481a3` shiplog: 更新上线存档
- `41368600df7` 七语种：指南第二批（fr/ko/tr/ar 30，ru 20，ja 18，de 10）；术语表删两个死键

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/25 18:37:02 · 三次推送失败

原因：旁路合并也失败：hint: before pushing again. / hint: See the 'Note about fast-forwards' in 'git push --help' for details.

未推送的提交：

- `d5495ddb726` Merge remote-tracking branch 'origin/main' into claude-spec-work
- `21aeafe584e` shiplog: 更新上线存档
- `73de868825d` 门叶数量统一为 de dos hojas / de duas folhas（含七处复合值）；葡语补上大小写折叠

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/27 11:32:00 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：CONFLICT (content): Merge conflict in package.json / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `fcdd3036d14` shiplog: 更新上线存档
- `e753119a9e7` 工具页：欧式锁芯长度计算器（/euro-cylinder-calculator，三语 + 7 语种路由）

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/27 13:05:53 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：CONFLICT (content): Merge conflict in docs/collaboration/SHIPLOG.md / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `9f0f3612165` shiplog: 更新上线存档
- `60ba0e16694` 规格覆盖报告：重新生成（origin 的规格值 MM→mm 归一后两个字段的不同取值数 30→28、85→84）
- `cb8a7a0ded5` 产品标题生成器重跑：177 条产品名/摘要改后七语种 497 条 seoTitle/seoDescription 重新生成（titles:check）
- `92d0975e6e8` 合 origin/main 后七语种补译：计算器页 41 键、177 条改过英文的产品、6 篇文章 seoTitle、8 条无主图产品规格哈希
- `6f82b5483f3` Merge remote-tracking branch 'origin/main'
- `7faa51d331f` 七语种页面英文残留：文章问答读旁挂译文、术语表/配置器释义走 tx、附件与作者字段进提取器
- `dcc67ff59a2` 七语种页面英文残留第二轮：服务端字典注册、包装函数与函数值文案可翻、67 个无主图产品、数据文件字段进提取器

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/28 05:50:41 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging src/components/site/NewsDetail.tsx / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `6877c222dfd` shiplog: 更新上线存档
- `07063d6956a` runbook：等部署后提交 9 条 RSS，写成非开发者照着做的步骤
- `c8f7a3fc259` 作者照片进署名与 Person 结构化数据
- `5c104750057` 十个语种各一条 RSS；此前只有英文，es/pt 路由并不存在

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/28 21:45:03 · HYDE（cantonlock.com）发布三次推送失败

构建好的发布提交 `3cc92f97f0a`（源码 e36f7876720）没推上去。网络恢复后重跑 `npm run release:hyde` —— 检出和依赖都已缓存。

补充验收：合并后的新增展会栏使 1440px 首页卡片仍遮挡 CTA，浏览器复测拒绝了这个旧工件。不要单独推送 `3cc92f97f0a`；待卡片避让修复通过后，基于新主线重新运行 `release:hyde`。

## 2026/9/29 05:51:11 · 三次推送失败

原因：超时（5 分钟无响应）

未推送的提交：

- `13ccca544f8` shiplog: 更新上线存档
- `0dba9b4ca5e` fix: keep compact homepage offers clear of hero actions
## 2026/9/28 23:08:44 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging package.json / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `dbb05084861` shiplog: 更新上线存档
- `44b4c7ab034` feed 的 <language> 去掉没人决定过的地区码；runbook 换成实测命令

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/29 01:48:44 · HYDE（cantonlock.com）发布三次推送失败

构建好的发布提交 `8de4215bb6b`（源码 a4207a6949c）没推上去。网络恢复后重跑 `npm run release:hyde` —— 检出和依赖都已缓存。

## 2026/9/29 05:58:17 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：CONFLICT (content): Merge conflict in public/search-index.json / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `1eb2ac7555c` shiplog: 更新上线存档
- `f77990f9f45` 311 overlays: restore the sourceHash that matches the ABS English
- `0c6314617bb` Merge branch 'main' of https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master into eng-work
- `984509e1af0` 311 恢复 ABS 配铝（甲方 09-29：「311 的是 abs 不动」）

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/30 01:07:48 · 三次推送失败

原因：fatal: unable to access 'https://github.com/SPOOOONER-FLASH/ai-website-cloner-template-master.git/': Failed to connect to github.com:443 after 21068 ms: Could not connect to server

未推送的提交：

- `8bf9a3c8757` shiplog: 更新上线存档
- `7bc7c396229` docs: verify HYDE desktop release and hand off title range bug

下一次 `npm run ship` 成功时这些会一起推上去。

## 2026/9/30 02:36:21 · HYDE（cantonlock.com）发布三次推送失败

构建好的发布提交 `704a5dae934`（源码 bb1cb20c73b）没推上去。网络恢复后重跑 `npm run release:hyde` —— 检出和依赖都已缓存。

## 2026/9/30 03:08:34 · HYDE（cantonlock.com）发布三次推送失败

构建好的发布提交 `6e8af2fe42e`（源码 6ed3b7a0684）没推上去。网络恢复后重跑 `npm run release:hyde` —— 检出和依赖都已缓存。

## 2026/9/30 07:23:37 · 三次推送失败

原因：旁路合并也失败：真冲突，需要人看：Auto-merging src/data/article-revisions.json / Automatic merge failed; fix conflicts and then commit the result.

未推送的提交：

- `904ceb6c7b0` shiplog: 更新上线存档
- `79f5207bc69` 玻璃门指南：JU 系列不是地弹簧；三段"我们不公布"已被 09-29 发布推翻

下一次 `npm run ship` 成功时这些会一起推上去。
