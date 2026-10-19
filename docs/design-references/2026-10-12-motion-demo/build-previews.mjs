// Builds the standalone previews into one folder of double-click files: <out>/<name>.html with
// scripts, styles and fonts inlined, and beside them img/ holding the preview's own image folder
// (public/img/<name>/) plus every other image path the page names literally.
//
//   node build-previews.mjs welcome menu finder finder-a finder-b finder-c [--out <dir>]
//
// vite.config.js builds index.html only and belongs to the main demo, so each entry gets its own
// inline config here. Default output: dist/previews/.
import fs from "node:fs";
import path from "node:path";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const root = import.meta.dirname;
const argv = process.argv.slice(2);
const at = argv.indexOf("--out");
const out = at >= 0 ? path.resolve(argv[at + 1]) : path.join(root, "dist", "previews");
const names = argv.filter((a, i) => !a.startsWith("--") && !(at >= 0 && i === at + 1));
if (!names.length) throw new Error("name at least one preview, e.g. welcome");

const copy = (rel) => {
  const from = path.join(root, "public", rel);
  const to = path.join(out, rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};

fs.mkdirSync(out, { recursive: true });
const missing = [];
for (const name of names) {
  const entry = path.join(root, `${name}.html`);
  if (!fs.existsSync(entry)) throw new Error(`no ${name}.html`);
  const tmp = path.join(root, "dist", `.build-${name}`);
  await build({
    root, base: "./", configFile: false, logLevel: "warn", publicDir: false,
    plugins: [react(), viteSingleFile()],
    build: { outDir: tmp, emptyOutDir: true, rollupOptions: { input: entry } },
  });
  const html = fs.readFileSync(path.join(tmp, `${name}.html`), "utf8");
  fs.writeFileSync(path.join(out, `${name}.html`), html);
  fs.rmSync(tmp, { recursive: true, force: true });

  if (fs.existsSync(path.join(root, "public/img", name))) copy(`img/${name}`);
  for (const ref of new Set(html.match(/img\/[\w\-./]+\.(?:webp|png|jpe?g|svg|mp4|avif)/g) ?? [])) {
    if (fs.existsSync(path.join(root, "public", ref))) copy(ref);
    else missing.push(`${name}: ${ref}`);
  }
  console.log(`built ${name}.html`);
}
// A name built from a template string (img/x/${slug}.webp) shows up here only if its folder was not
// copied whole; anything listed is a real gap in the built preview.
if (missing.length) console.log(`not found under public/:\n  ${missing.join("\n  ")}`);

// The client opens the folder, not a repository path: one index page in Chinese names every
// preview in it, including ones built by earlier runs.
const LABELS = {
  welcome: "首页：两张大图 → 开场标题与段落 → 工厂数字（视差、滚动变亮、进入上浮）",
  menu: "顶部下拉菜单：Products、Resources、Company、Buy it now 统一结构",
  finder: "Product Finder 基准版：现有结构，换成产品页的视觉语言",
  pages: "内页：Events 页（大号日期 + 黑底展会栏 + 日历表）和 FAQ 页（大号数字 + 搜索 + 分组索引 + 展开问答），左下角切换",
  "finder-a": "Product Finder 方案 A：样本册",
  "finder-b": "Product Finder 方案 B：工作台",
  "finder-c": "Product Finder 方案 C：引导优先",
};
const pages = fs.readdirSync(out).filter((f) => f.endsWith(".html") && f !== "00-目录.html").map((f) => f.slice(0, -5));
const rows = [
  ...pages.map((n) => `<li><a href="${n}.html">${LABELS[n] ?? n}</a></li>`),
  ...(pages.includes("menu") ? [`<li><a href="menu.html?type=large&pin=company">顶部下拉菜单：大号加粗版（和上一版对比）</a></li>`] : []),
].join("\n");
fs.writeFileSync(path.join(out, "00-目录.html"), `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDE 预览目录</title>
<style>body{font:17px/1.6 system-ui,sans-serif;color:#11110f;background:#fff;max-width:720px;margin:64px auto;padding:0 16px}h1{font-size:28px;margin:0 0 8px}p{color:#6e6e73;margin:0 0 32px}ul{list-style:none;padding:0;border-top:1px solid #11110f}li{border-bottom:1px solid #deddd8}a{display:block;padding:16px 0;color:inherit;text-decoration:none}a:hover{text-decoration:underline}</style>
<h1>HYDE 预览</h1><p>双击打开即可，不用联网也能看（Product Finder 基准版的部分产品图需要联网）。</p><ul>
${rows}
</ul></html>
`);
console.log(`→ ${out}`);
