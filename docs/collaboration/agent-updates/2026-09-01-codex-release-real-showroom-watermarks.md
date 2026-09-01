# Codex release — real showroom, black 564 MB, repaired HYDE imagery

- **Source release:** `370b2a29a2` is pushed to `origin/main`.
- **Built from:** `370b2a29a2`; no concurrent source commit or unfamiliar working-tree file appeared during either production build.
- **Release output:** 941 pages, 933 public content pages, 933 pages with JSON-LD, 918 with reciprocal real alternates; 8,799 exported files / 287,749,903 bytes.
- **Image output:** homepage uses the 1536×1024 real showroom derivative; 564 MB uses the existing black source photograph; 1,485 HYDE product derivatives pass the manifest check.
- **Visual evidence:** the final exported showroom, 564 MB, and 023 ET assets were opened at original resolution. The old top oval/registered mark/tagline is absent on 023 ET; the replacement has no white plate or product collision. Local static HTML references the new showroom and black 564 MB assets.
- **Checks:** `npm run check`; `npm run deploy:prep`; `npm run seo:audit`; `npm run assets:watermark:check`; local `serve out` desktop render. Result: 151 unit tests + 25 export tests passed, SEO semantic issues 0, editorial warnings 0, watermark 1,485/1,485, and `out/` newer than source.
- **Output fingerprint:** `out/index.html` SHA-256 `5886D48DEFFD2F8369A8927EFB7F99A271C384324D37A6A1F951055E22529178`.
- **Git safety:** repository-local `pull.ff=only`, `push.default=simple`, `push.autoSetupRemote=true`, and `fetch.prune=true`. Codex desktop `Allows force push` should be switched off manually; app self-automation is prohibited.
- **Next:** push the complete generated `out/` commit, wait for the production server pull, purge Cloudflare, then verify no-query public HTML and assets before IndexNow.
