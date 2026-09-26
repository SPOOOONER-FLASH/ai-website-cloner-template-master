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
