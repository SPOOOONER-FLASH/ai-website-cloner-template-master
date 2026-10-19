# Claude — 四个表单加 hCaptcha（2026-10-14，紧急）

甲方在 Web3Forms 后台把 hCaptcha 设成了「必须验证」，用来挡假 OEM 询盘。设好以后，网站提交询盘一律报「We could not send this from the website」，因为表单没有带验证码。四个表单用的是同一个 access key，所以询盘、资料索取、BAU 预约、Newsletter 全部失败。

- 新组件 `src/components/site/HCaptchaField.tsx`：
  - 直接加载 hCaptcha 官方脚本（render=explicit），渲染进 div，没有新增依赖；
  - 用的是 Web3Forms 免费版的公用 site key；
  - token 写在 `h-captcha-response` 里，`new FormData(form)` 会自动带上。
- 四个表单都接上了：InquiryForm、AssetRequestForm、BauMeetingForm、NewsletterForm。没完成验证就提交时，不发请求，显示 en/es/pt/de 的提示；每次提交后重置验证码（token 只能用一次）。
- 本地验证：验证框能显示，textarea 也在；不勾选就提交时没有任何请求发出，提示正常显示。按规定 agent 不能自己完成验证码，所以真正提交成功要等上线后由甲方实测一次。
- npm test 全部通过。
- 共享 node_modules：主线新增的 lenis 一直没装，本地预览起不来。我先用 --no-package-lock 装了 lenis，结果误改了 167 个包的版本；随后用 `npm ci` 按 lockfile 完整还原，再只加了 lenis 这一个包。package.json 和 lockfile 都没有改动。
