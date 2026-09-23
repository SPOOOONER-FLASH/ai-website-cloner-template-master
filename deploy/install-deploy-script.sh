#!/bin/bash
# 把仓库里的 deploy/cantonlock-deploy.sh 装到服务器 /usr/local/bin/，一条命令。
#
#   sudo bash /www/wwwroot/cantonlock.com/deploy/install-deploy-script.sh
#
# ---------------------------------------------------------------------------
# 为什么要有这个脚本，而不是在 runbook 里写四行命令
#
# 修好的部署脚本 2026-09-22 就进了仓库（ea954f22575），但服务器上 cron 跑的仍是旧那份：
# 仓库里的文件不会自己跑到 /usr/local/bin/。旧那份每次有新提交就把 16,000 个文件
# 全部重写一遍 —— 61 个视频不被收录的根因就在这里（详见 cantonlock-deploy.sh 文件头）。
#
# 手工装有三个坑，这个脚本各挡一个：
#
# 1. **不能在旧脚本正在跑时覆盖它。** bash 是边读边执行脚本文件的；cron 每 5 分钟跑一次，
#    正好在它运行中途 cp 过去，它会从新文件的某个字节偏移处接着读，执行半截命令。
#    所以先拿 cron 用的同一把 flock，等正在跑的那一轮结束；再写到临时文件、mv 过去
#    （mv 是换 inode，正在读旧文件的进程不受影响）。
# 2. **两条 git config 只设一次，但漏了就不完整。** 修复有三层（见部署脚本），
#    其中两层是仓库的 git 设置，不在脚本文件里。
# 3. **第一次换上以后，索引里仍是旧 chown 留下的 stat。** 不刷新的话，下一次有新提交时
#    还会整批重写一次。这里装完立刻 refresh，让第一轮就干净。
#
# 失败即停（set -e），每一步都打印 →，最后一行是 ✓ 或 ✗。
# ---------------------------------------------------------------------------
set -euo pipefail

REPO=/www/wwwroot/cantonlock.com
SRC="$REPO/deploy/cantonlock-deploy.sh"
DEST=/usr/local/bin/cantonlock-deploy.sh
LOCK=/tmp/cantonlock-deploy.lock

fail() { echo "✗ FAIL: $*"; exit 1; }

[ "$(id -u)" -eq 0 ] || fail "要用 sudo 运行：sudo bash $0"
[ -f "$SRC" ] || fail "找不到 $SRC —— 仓库不在 $REPO？截图发我，不要重跑。"

echo "→ 检查新脚本语法"
bash -n "$SRC" || fail "新脚本语法错误，什么都没改。截图发我。"

echo "→ 等正在运行的那一轮部署结束（最多等几分钟，屏幕停住是正常的）"
exec 9>"$LOCK"
flock 9

if [ -f "$DEST" ]; then
  BAK="$DEST.bak-$(date +%Y%m%d-%H%M%S)"
  cp -a "$DEST" "$BAK"
  echo "→ 旧脚本已备份：$BAK"
fi

echo "→ 安装新脚本"
install -m 755 "$SRC" "$DEST.new"
mv -f "$DEST.new" "$DEST"
cmp -s "$SRC" "$DEST" || fail "装上去的和仓库里的不一致。旧脚本备份在 ${BAK:-（无）}。"

echo "→ git 比较文件时不看属主和 ctime"
git -C "$REPO" config core.checkStat minimal
git -C "$REPO" config core.trustctime false

echo "→ 刷新索引（让下一次发布只写真正变了的文件）"
git -C "$REPO" update-index -q --refresh || true

[ "$(git -C "$REPO" config core.checkStat)" = "minimal" ] || fail "core.checkStat 没设上"
[ "$(git -C "$REPO" config core.trustctime)" = "false" ] || fail "core.trustctime 没设上"

echo "✓ 完成。新部署脚本已装好，下一轮 cron（5 分钟内）起生效。"
echo "  验证：过 10 分钟跑  tail -5 /var/log/cantonlock-deploy.log"
echo "  应该看不到 shallow.lock 报错；有新提交时出现一行 updated to xxxxxxx。"
