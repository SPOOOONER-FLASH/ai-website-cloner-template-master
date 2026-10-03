import test from 'node:test';
import assert from 'node:assert/strict';
import { decideStop } from './codex-kanee-stop.mjs';

const session = '01a0570e-5f9e-7ea1-9127-cf4f6d0adb76';
const input = { session_id: session, hook_event_name: 'Stop', turn_id: 'turn-1' };
const state = { sessionId: session, status: 'active', revision: 1,
  tasks: [{ id: 'images', label: 'Twenty real-product plates', status: 'pending' }] };

// Removing the session check would spuriously continue Claude's unrelated work.
test('ignores another session', () => {
  assert.deepEqual(decideStop(state, { ...input, session_id: 'claude' }, {}).output, {});
});
// Returning a non-blocking result would strand unfinished authorized work.
test('continues the first actionable task', () => {
  const result = decideStop(state, input, {});
  assert.equal(result.output.decision, 'block');
  assert.match(result.output.reason, /Twenty real-product plates/);
});
test('does not continue a user-paused task', () => {
  assert.deepEqual(decideStop({ ...state, status: 'paused' }, input, {}).output, {});
});
test('does not spend tokens on externally blocked tasks', () => {
  const blocked = { ...state, tasks: [{ ...state.tasks[0], status: 'blocked' }] };
  assert.equal(decideStop(blocked, input, {}).output.decision, undefined);
});
test('allows stopping when every task is complete', () => {
  const done = { ...state, tasks: [{ ...state.tasks[0], status: 'done' }] };
  assert.deepEqual(decideStop(done, input, {}).output, {});
});
// A missing stall guard would burn credits indefinitely without new evidence.
test('stops after three unchanged continuation passes', () => {
  const result = decideStop(state, input, { revision: 1, unchanged: 3 });
  assert.equal(result.output.decision, undefined);
  assert.match(result.output.systemMessage, /没有新增/);
});
test('resets the stall guard when evidence revision advances', () => {
  const result = decideStop({ ...state, revision: 2 }, input, { revision: 1, unchanged: 3 });
  assert.equal(result.output.decision, 'block');
  assert.equal(result.runtime.unchanged, 0);
});
test('does not count a repeated Stop event in the same turn twice', () => {
  const result = decideStop(state, input, { revision: 1, unchanged: 2, lastTurn: 'turn-1' });
  assert.equal(result.runtime.unchanged, 2);
});
