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
# ---------------------------------------------------------------------------
# 2026-09-23 第三处修正，来自服务器日志：
#
# 3. 每一轮都是 `fatal: shallow file has changed since we read it`，而此时没有任何
#    git 进程、也没有锁文件 —— 不是抢锁，是 `fetch --depth 1` 本身在这台机器上
#    必然失败：带 --depth 的拉取每次都要重写 .git/shallow，这一步坏了。
#    现在拉取不带 --depth。浅仓库照样能增量拉新提交，只是不再每次改写 shallow，
#    出错的那一步就不存在了。同时关掉会在后台改仓库的自动 gc / maintenance。
#
# 4. `chown: .user.ini: Operation not permitted`。宝塔给站点目录下的 .user.ini 加了
#    不可改属性，chown 必然失败；配上 set -e，脚本在 reset 之后、写日志之前退出 ——
#    网站其实更新了，日志里却永远看不到 "updated to"。现在跳过 .user.ini 和 .git，
#    chown 失败也不中断。
#
# 每一行输出都带时间，出事时能看出是哪一轮。
# ---------------------------------------------------------------------------
set -uo pipefail
D=/www/wwwroot/cantonlock.com
cd "$D" || exit 1
log() { echo "$(date '+%F %T') $*"; }

if ! pgrep -x git >/dev/null; then
  for lock in .git/shallow.lock .git/index.lock; do
    if [ -e "$lock" ]; then
      rm -f "$lock"
      log "removed stale $lock"
    fi
  done
fi

if ! out=$(git fetch origin main --quiet 2>&1); then
  sleep 5
  if ! out=$(git fetch origin main --quiet 2>&1); then
    log "fetch failed: $(echo "$out" | tail -1)"
    exit 1
  fi
fi

if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  if ! out=$(git reset --hard origin/main --quiet 2>&1); then
    log "reset failed: $(echo "$out" | tail -1)"
    exit 1
  fi
  find "$D" -path "$D/.git" -prune -o ! -user www ! -name .user.ini -exec chown www:www {} + 2>/dev/null || true
  git update-index -q --refresh || true
  log "updated to $(git rev-parse --short HEAD)"
fi
