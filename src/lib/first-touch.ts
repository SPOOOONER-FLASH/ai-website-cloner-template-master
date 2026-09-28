/**
 * Where the buyer first came from, carried to the inquiry.
 *
 * ---------------------------------------------------------------------------
 * WHY
 *
 * 2026-09-28, from the QuickCreator case studies: the evidence that an inquiry came from
 * ChatGPT was the visitor's first touch, read from an analytics trail. We could not answer
 * the same question. GA4 sees the session source, but the enquiry email the export team
 * reads says nothing about it, and the form is usually on the third or fourth page, where
 * `document.referrer` is our own site.
 *
 * So the landing page records one word, and the form sends it with the enquiry:
 * "chatgpt", "perplexity", "google", "direct" and so on. That word is what lets the
 * client say "this order came from an AI answer" with a record behind it.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS STORED, AND WHY IT IS THIS LITTLE
 *
 * One lowercase source label in sessionStorage — no URL, no query string, no identifier —
 * written once per browser session and gone when the tab closes. Nothing is sent anywhere
 * until the buyer submits the enquiry themselves.
 */

export const FIRST_TOUCH_KEY = "hyde:first-touch";

/** Hostname suffix → label. Assistants first: they are the question being asked. */
const SOURCES: Array<[string, string]> = [
  ["chatgpt.com", "chatgpt"],
  ["chat.openai.com", "chatgpt"],
  ["openai.com", "chatgpt"],
  ["perplexity.ai", "perplexity"],
  ["gemini.google.com", "gemini"],
  ["bard.google.com", "gemini"],
  ["copilot.microsoft.com", "copilot"],
  ["claude.ai", "claude"],
  ["deepseek.com", "deepseek"],
  ["kimi.com", "kimi"],
  ["moonshot.cn", "kimi"],
  ["doubao.com", "doubao"],
  ["grok.com", "grok"],
  ["you.com", "you"],
  ["google.", "google"],
  ["bing.com", "bing"],
  ["duckduckgo.com", "duckduckgo"],
  ["yandex.", "yandex"],
  ["baidu.com", "baidu"],
  ["linkedin.com", "linkedin"],
  ["lnkd.in", "linkedin"],
  ["facebook.com", "facebook"],
  ["instagram.com", "instagram"],
  ["youtube.com", "youtube"],
  ["alibaba.com", "alibaba"],
];

export const AI_SOURCES = new Set([
  "chatgpt", "perplexity", "gemini", "copilot", "claude", "deepseek", "kimi", "doubao", "grok", "you",
]);

function labelForHost(host: string): string | null {
  const h = host.toLowerCase().replace(/^www\./, "");
  for (const [suffix, label] of SOURCES) {
    if (suffix.endsWith(".") ? h.startsWith(suffix) || h.includes(`.${suffix}`) : h === suffix || h.endsWith(`.${suffix}`)) {
      return label;
    }
  }
  return null;
}

/**
 * The label for a landing: `utm_source` wins (ChatGPT adds `utm_source=chatgpt.com` to
 * the links it cites, and it survives when the referrer is stripped), then the referrer.
 * A referrer on our own host is not a first touch.
 */
export function classifyFirstTouch(referrer: string, search: string, ownHost: string): string {
  const utm = new URLSearchParams(search).get("utm_source")?.trim().toLowerCase();
  if (utm) return labelForHost(utm) ?? (utm.replace(/[^a-z0-9._-]/g, "").slice(0, 32) || "other");
  if (!referrer) return "direct";
  let host: string;
  try {
    host = new URL(referrer).hostname;
  } catch {
    return "other";
  }
  if (!host || host.replace(/^www\./, "") === ownHost.replace(/^www\./, "")) return "internal";
  return labelForHost(host) ?? "referral";
}

type Store = Pick<Storage, "getItem" | "setItem">;

/** Record the first touch of this session; later pages never overwrite it. */
export function rememberFirstTouch(store: Store, referrer: string, search: string, ownHost: string): string {
  try {
    const existing = store.getItem(FIRST_TOUCH_KEY);
    if (existing) return existing;
    const label = classifyFirstTouch(referrer, search, ownHost);
    store.setItem(FIRST_TOUCH_KEY, label);
    return label;
  } catch {
    // Storage blocked (private mode, a strict browser). Measurement never breaks the page.
    return "";
  }
}

export function readFirstTouch(store: Pick<Storage, "getItem"> | undefined): string {
  try {
    return store?.getItem(FIRST_TOUCH_KEY) ?? "";
  } catch {
    return "";
  }
}
