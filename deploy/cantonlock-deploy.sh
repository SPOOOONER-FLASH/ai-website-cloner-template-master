#!/bin/bash
# cantonlock.com 自动拉取。装在服务器 /usr/local/bin/cantonlock-deploy.sh，
# 由 cron 每 5 分钟调用：
#   */5 * * * * flock -n /tmp/cantonlock-deploy.lock /usr/local/bin/cantonlock-deploy.sh
#
# 这份是仓库里的正本；服务器上那份以它为准，改了要重新 cp 过去（见 CLIENT-RUNBOOK）。
#
# ---------------------------------------------------------------------------
# 2026-09-22 修了两件事，都来自服务器日志与 tail 输出：
#
# 1. 每次发布都把全部文件重写一遍 —— 视频不被收录的真正原因。
#
#    旧脚本是 `git reset --hard` 之后 `chown -R www:www` 整个目录。git 以 root 写文件，
#    索引里记的是 uid=0 和当时的 ctime；chown 一改，索引就认为「所有文件都被动过」。
#    旧护栏只挡住了「没有新提交」的轮次；一旦有新提交（每天好几次），reset 会把
#    16,000 个文件全部重新 checkout —— 内容没变，mtime 全新，nginx 的 ETag 跟着变。
#    线上 61 个视频全落在 06:21:11–14 三秒内被重写，就是这个。
#
#    修法：只 chown 不属于 www 的文件（也就是这次 git 新写的那些），然后
#    `git update-index --refresh` 让索引记住新的 stat；再配合一次性设置
#      git config core.checkStat minimal && git config core.trustctime false
#    让 git 比较文件时不看 uid/gid/ctime。三层任一层单独都能挡住，放在一起是为了
#    下一个改脚本的人漏掉一层也不会复发。
#
# 2. 残留的 .git/shallow.lock 让每一轮 fetch 都失败。
#
#    日志里满屏 `Unable to create .../shallow.lock: File exists` 和
#    `shallow file has changed since we read it`。后者是两个 git 同时动 shallow 文件：
#    cron 的 fetch 和 install-nginx-redirects.sh 的 git pull 撞在一起。某一次被打断，
#    锁文件就留下了，之后每一轮 set -e 在 fetch 处退出 —— 网站静默地停止更新，
#    日志里只有这一行，没有人会看。
#
#    修法：没有 git 进程在跑时，清掉残留锁；install 脚本拿同一把 flock（见那边）。
# ---------------------------------------------------------------------------
set -euo pipefail
D=/www/wwwroot/cantonlock.com
cd "$D"

if ! pgrep -x git >/dev/null; then
  for lock in .git/shallow.lock .git/index.lock; do
    if [ -e "$lock" ]; then
      rm -f "$lock"
      echo "$(date '+%F %T') removed stale $lock"
    fi
  done
fi

git fetch origin main --depth 1 --quiet
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  git reset --hard origin/main --quiet
  find "$D" ! -user www -exec chown www:www {} +
  git update-index -q --refresh || true
  echo "$(date '+%F %T') updated to $(git rev-parse --short HEAD)"
fi
