# 跳转规则随每 5 分钟的自动拉取自动安装（Claude 工程，2026-09-25）

- **甲方问**：「为啥总是要去终端写这个」。因为 nginx 规则在宝塔目录，不在仓库；cron 只拉网站文件。
- **改了什么**：deploy/cantonlock-deploy.sh 末尾加一段。仓库里的 taxonomy/legacy 规则和已装的不一致（cmp）时，调用 install-nginx-redirects.sh --no-pull：先 nginx -t，失败还原旧规则、不重载。--no-pull 是因为它的 pull 会去拿 cron 正持有的那把 flock。同一份内容装失败过就记下 md5，不再每 5 分钟重试，等下一次规则变化。日志在 /var/log/cantonlock-redirects.log。
- **甲方一次性操作**：手册 ③，sudo bash deploy/install-deploy-script.sh，把新版部署脚本装到 /usr/local/bin/。之后跳转规则只剩 purge。
- **验证**：bash -n 通过。09-25 18:15 的手动安装已生效：钢琴合页旧网址、aid=401、卫浴旧网址实测都一跳到新网址。
- **风险**：cron 的 PATH 里没有宝塔 nginx，已显式加 /www/server/nginx/sbin。装完后第一轮 cron 应不会触发（规则已一致）；下一次规则变化时看日志确认。
