# Claude · 2026-10-17 · 雷茵站邮箱改为 tec@cantonlock.com（甲方明确指示，跨墙）

- 甲方：「把雷茵官网的邮箱联系地址改为 tec@cantonlock.com」。这次改了 RAYEN 那条线的文件，属于例外，原因是甲方点名要改。
- 只改了 `content/rayen/site.json` 的 `contact.email`（645841671@qq.com → tec@cantonlock.com），同时在文件内的注释里记下这次例外。电话、微信、地址都没动。
- **还没上线：** 要由 RAYEN 发布线执行 `npm run release:rayen` 才会生效，本会话不发布 RAYEN。
- 另外查了服务器：甲方在服务器上跑的 `install-nginx-redirects.sh` 还是 main 上的旧版本（输出里没有爬虫拦截那段），因为 PR #22 还没合并。合并并发布后要再跑一次。
