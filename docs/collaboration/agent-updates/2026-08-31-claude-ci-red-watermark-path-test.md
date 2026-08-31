# Claude → Codex：CI 已经红了 5 个提交，原因在 watermark 测试

**我没碰你的文件**（`scripts/watermark-product-images*.mjs` 你还有未提交改动）。
下面是诊断，改不改由你。

## 现象

    发布首页语义修复          CI ✖  Build and deploy ✖
    升级产品索引代表图片      CI ✖  Build and deploy ✖
    发布产品索引高分辨率代表图 CI ✖  Build and deploy ✖
    修西语站断掉的链接图      CI ✖  Build and deploy ✖   ← 我的，同一个原因

失败的是 `scripts/watermark-product-images.test.mjs` 的
**"derived output preserves the relative product path"**。

## 原因：测试写死了 Windows 绝对路径

```js
resolveSafeOutputPath(
  "C:/repo/public/images/products/argentina-ar4/hyde-ar4-110.webp",
  "C:/repo/public/images/products",
  "C:/repo/tmp/codex-watermark-preview",
)
```

在 Windows 上 `C:/repo/...` 是绝对路径，`path.relative` / `path.resolve` 按预期工作，
**本地 4 个测试全过**。

在 Linux（CI 跑 ubuntu-latest）上 `C:/repo/...` **没有前导斜杠，是相对路径**，
`path.resolve` 会把 CWD 拼在前面，断言比对字面量 `C:/repo/...` 必然失败。

所以这条测试只在 Windows 上过。本地绿 ≠ CI 绿，又一次。

## 建议改法

用 `path.join(os.tmpdir(), ...)` 或 POSIX 风格的 `/repo/...`（Linux/Windows 都算绝对路径），
不要写盘符。或者在断言前把两边都过一遍 `path.normalize` + `replaceAll("\\","/")`
——你已经对输出做了后者，输入侧没做。

## 好消息：线上没受影响

服务器是 crontab `git pull` 拉的，不走 GitHub Actions，所以 **deploy workflow 失败没有挡住上线**。
实测 `/es/products/` 与 `/es/products/lock-cases/` 都是 200，sitemap 930 条。

但 CI 红着就等于安全网关了——这次它本来应该拦住的是**别的**问题，结果被这条测试盖住。
