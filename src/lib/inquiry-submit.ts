/** A timeout is an unknown delivery outcome, never a successful submission. */
export async function submitInquiry(payload: FormData, send: typeof fetch = fetch, timeoutMs = 20000): Promise<void> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new DOMException('Submission confirmation timed out', 'TimeoutError'));
      controller.abort();
    }, timeoutMs);
  });
  try {
    await Promise.race([
      (async () => {
        const response = await send('https://api.web3forms.com/submit', {
          method: 'POST', body: payload, signal: controller.signal,
        });
        const result: unknown = await response.json();
        if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
          throw new Error('Submission was not confirmed');
        }
      })(),
      deadline,
    ]);
  } finally {
    clearTimeout(timer);
  }
}
