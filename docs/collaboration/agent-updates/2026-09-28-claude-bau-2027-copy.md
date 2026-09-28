# 2026-09-28 · Claude (Hyde 文案) · BAU 2027 活动条目与专栏文案

- `content/events.json`：BAU 2027 由 planned-visit 改为 exhibiting，「Exhibiting · Hall C4, Stand 523」，链接暂指 /contact/（专栏页上线后由工程会话改为 /bau-2027/）。
- `src/lib/events.test.ts`：原规则“任何活动不得写 exhibiting”改为“只有写在 VERIFIED_STANDS 里、有证据的展位才可以，且标签必须写出该展位”。证据：主办方位置确认 + 已付款（BAU 会话）。
- `content/bau-2027.json`：专栏 EN + DE 全部文案，包括预约表单字段。只用已确认事实；主推产品清单是 09-09 需求数据第一梯队，待老板确认。
- 任务与分工：`docs/collaboration/tasks/2026-09-28-bau-2027-column.md`（视觉会话出 A/B/C 三个版式；工程会话建页）。

风险：德语表单需要隐私政策页（DSGVO），站上还没有，已列入待甲方。
测试：typecheck、`npm test` 411/411。
