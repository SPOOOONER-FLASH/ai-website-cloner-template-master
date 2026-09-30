import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const statePath = path.join(root, 'docs/collaboration/tasks/2026-09-28-kanee-real-products.json');
const runtimePath = path.join(root, 'tmp/codex-kanee-fidelity/hook-runtime.json');

/** Stop only steers the explicitly authorized session. It runs no production commands. */
export function decideStop(state, input, runtime = {}) {
  const allow = { output: {}, runtime };
  if (!state || input.session_id !== state.sessionId || input.hook_event_name !== 'Stop') return allow;
  if (state.status !== 'active') return allow;
  const pending = state.tasks.filter((task) => task.status === 'pending');
  if (pending.length === 0) return allow;
  const changed = runtime.revision !== state.revision;
  const repeated = runtime.lastTurn && runtime.lastTurn === input.turn_id;
  const next = {
    revision: state.revision,
    unchanged: changed ? 0 : (runtime.unchanged ?? 0) + (repeated ? 0 : 1),
    lastTurn: input.turn_id ?? null,
  };
  if (next.unchanged >= 3) {
    return { runtime: next, output: { systemMessage:
      'KANEE 任务仍未完成，但连续三轮没有新增可核验进展；已停止 hook 空转。保留目标与文件，先报告缺失素材、权限或工具故障；有新证据后再推进。' } };
  }
  return { runtime: next, output: {
    decision: 'block',
    reason: `继续已授权的 KANEE/HYDE 视觉任务。下一项：${pending[0].label}。` +
      '读取 docs/collaboration/tasks/2026-09-28-kanee-real-products.json 和相邻任务说明，完成一个可验证的小阶段。' +
      '只用真实 HYDE 产品照片或经核验模型；不得生成或修改孔位、螺丝、安装面、部件、套装或表面处理。' +
      '图像必须无侧边白卡、产品不悬浮，核对接触阴影、光向、透视、真实来源；20 张要逐张 QA。' +
      '有新产物或新证据才更新 revision；外部阻塞标为 blocked，不循环重试。' +
      '不得覆盖 out/、out-rayen/，不得替用户 purge，不得安装付费工具或自动购买额度。' +
      '本 hook 不授予新权限、不承诺后台运行，不得把写出配置等同于真实触发成功。',
  } };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let output = {};
  try {
    const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
    // Never touch this task's runtime during another agent's Stop event.
    if (input.session_id === state.sessionId && input.hook_event_name === 'Stop') {
      let runtime = {};
      try { runtime = JSON.parse(fs.readFileSync(runtimePath, 'utf8')); } catch { /* first run */ }
      const result = decideStop(state, input, runtime);
      output = result.output;
      fs.mkdirSync(path.dirname(runtimePath), { recursive: true });
      fs.writeFileSync(runtimePath, JSON.stringify(result.runtime, null, 2) + '\n');
    }
  } catch {
    output = { systemMessage: 'KANEE Stop hook could not read its task state; no continuation was requested.' };
  }
  process.stdout.write(JSON.stringify(output));
}
