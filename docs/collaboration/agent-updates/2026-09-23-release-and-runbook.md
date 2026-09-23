# 发布 848a1338d35 + runbook 翻新 + 部署脚本安装器

- **Agent**: Claude · **日期**: 2026-09-23

## 发布

- 本地 09-22 从 `9f425965212` 出的构建**作废未推送**：推送被拒，fetch 核实远端已有
  `3ec845be539` 发布与之后 8 个源码提交。第一次 fetch 其实失败（TLS，RC 128），
  `origin/main` 是旧的 —— 重试成功后才据此判断。
- `git reset --keep origin/main` 丢弃两个本地提交（一个与 `12c09abe6f3` 逐字节相同，
  一个是过期构建），Codex 未提交的 `scripts/build-codex-style-library.mjs` 与设计参考图保留未动。
- 从 `12c09abe6f3` 重出：`deploy:prep` npm 退出码 0；2,218 页、175,913 条内链全部可达。
- 提交前遇到 0 字节 `index.lock`（02:07:02），四次检查 4 分钟内无 git 进程持有，
  构建各步未调用 git（`git rm` pruned 0），判定为残留后删除。**删除前同一条命令内再查一次进程。**
- **生产验证**：绕开 Cloudflare 直连源站 43.131.27.225，只存在于本次发布的段落已在线上。
  这是源站证据，不是 purge。

## 更正

09-22 我在 NOW.md 写「GTM hydration 修复没有提交」—— **错了**，修复在 `a04df5de724`
（`AnalyticsHead` 进三语 layout）。Codex 09-23 已在 NOW.md 更正。

## runbook

- 344 → 195 行。09-22 的五节（GA4、www、GSC 前 20 条、贴服务器脚本、nginx 跑不起来）
  全部做完，移入 `archive/2026-09-22-ga4-www-gsc-video-nginx.md`，开头附每节实测结果。
- nginx 跳转 09-23 实测全部生效（旧类目、`index.php?aid=`、大写 `Index.php`、未知 id、
  `index.asp`）。09-22 那次停在 verifying… 是验证段 bug，不是安装失败。
- 新第一屏两件：① GSC 剩余 20 条（按查询语料排序，并写明信号很薄）；
  ② 一条命令安装修好的部署脚本。

## 新增 `deploy/install-deploy-script.sh`

`ea954f22575` 把部署脚本修好了但只在仓库里，cron 跑的是 `/usr/local/bin/` 的旧版，
runbook 也没写怎么装。安装器挡三个坑：拿 cron 同一把 flock 等当前一轮跑完
（bash 边读边执行，运行中覆盖会执行半截命令）、写临时文件后 mv 换 inode、
设两个 git config 并立刻 `update-index --refresh`（否则装上后第一次发布仍会整批重写）。
本地 `bash -n` 通过；**没有在服务器上跑过**。

## TODO-MASTER

第 3 项（标题）移入已完成；第 6 项改为「根因已修，等你装」；第 7 项实测为
英文 35/35、三语 15/35，西葡剩 36,886 词。两份 docx 已重新生成。
