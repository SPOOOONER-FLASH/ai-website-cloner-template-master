# 2026-09-27 · Claude (Hyde 文案) · 计算器组件文字接入七语覆盖层

工程会话提醒：`/euro-cylinder-calculator` 在 fr/de/ja/ko/tr/ru/ar 的正文和按钮全是英文。

- 页面文字本来就走 `tx()`，已被提取器收录，等多语会话翻译。
- 组件 `CylinderCalculator.tsx` 原来用自己的 `COPY[locale]`，其中三条是函数，提取器看不到。改为 `dict(COPY, locale)`（`@/lib/i18n-client`），三条函数改成带 `{total}` `{outside}` `{inside}` `{side}` `{mm}` `{max}` 占位符的字符串，渲染时 `fill()` 填值。英西葡文字不变。
- 重新生成 `content/i18n/ui-keys.json`（705 句）。差异里也有其他会话改过但没重新提取的界面句子（首页描述、Custom tooling 等），生成器只读当前源码，一并更新。

测试：typecheck、`npm test` 通过。交多语会话：按 ui-keys 出这批句子的七语翻译。
