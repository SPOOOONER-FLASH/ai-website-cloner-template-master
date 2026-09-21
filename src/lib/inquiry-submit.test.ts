import assert from 'node:assert/strict';
import test from 'node:test';
import { submitInquiry } from './inquiry-submit.ts';

test('only confirmed provider success resolves', async () => {
  await submitInquiry(new FormData(), async () => new Response('{"success":true}'));
  for (const response of [new Response('{"success":false}'), new Response('{"success":"true"}'), new Response('{"success":true}', { status: 500 }), new Response('invalid')]) {
    await assert.rejects(submitInquiry(new FormData(), async () => response));
  }
});
test('a stalled request is aborted and settles within the time budget', async () => {
  let signal: AbortSignal | null | undefined;
  await assert.rejects(submitInquiry(new FormData(), async (_url, options) => {
    signal = options?.signal;
    return new Promise<Response>(() => {});
  }, 15), { name: 'TimeoutError' });
  assert.equal(signal?.aborted, true);
});
test('a stalled response body is also bounded', async () => {
  await assert.rejects(submitInquiry(new FormData(), async () => new Response(new ReadableStream({ start() {} })), 15), { name: 'TimeoutError' });
});
