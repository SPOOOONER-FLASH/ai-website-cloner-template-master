import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
test('CLI hook emits only valid JSON and ignores an unrelated session',()=>{
  const r=spawnSync(process.execPath,['scripts/hooks/codex-kanee-stop.mjs'],{input:JSON.stringify({session_id:'unrelated-qa-session',hook_event_name:'Stop'}),encoding:'utf8',timeout:5000,windowsHide:true});
  assert.equal(r.status,0);assert.equal(r.stderr,'');assert.deepEqual(JSON.parse(r.stdout),{});
});
test('CLI malformed input fails closed rather than continuing other work',()=>{
  const r=spawnSync(process.execPath,['scripts/hooks/codex-kanee-stop.mjs'],{input:'{broken',encoding:'utf8',timeout:5000,windowsHide:true});
  assert.equal(r.status,0);const json=JSON.parse(r.stdout);assert.equal(json.decision,undefined);assert.match(json.systemMessage,/could not read/);
});
