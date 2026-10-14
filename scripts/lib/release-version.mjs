/*
 * HYDE release version numbers (client 2026-10-13: 「出一个 hot fix 或者 update 日志……你命名版本号，
 * 记录每次上线什么，有跟踪」).
 *
 * vYYYY.MM.DD.N — the release commit's date on the release machine's clock (America/Los_Angeles, the
 * clock every date in docs/collaboration uses: goal rows, agent-updates) and its order among that day's HYDE releases.
 * Derived from git history, so scripts/build-release-log.mjs (the log) and scripts/release-site.mjs
 * (which stamps the number into the release commit and /release.json) always agree.
 */
export const RELEASE_SUBJECT = /^发布（HYDE（cantonlock\.com））/;
const STAMPED = /^发布（HYDE（cantonlock\.com））\s*(v\d{4}\.\d{2}\.\d{2}\.\d+)/;

export const RELEASE_TZ = "America/Los_Angeles";
/** "2026-10-13" on the release clock for an ISO timestamp. */
export function releaseDate(iso) {
  return new Date(iso).toLocaleDateString("sv-SE", { timeZone: RELEASE_TZ });
}

/**
 * releases: [{ sha, when (ISO), subject }] oldest first.
 * Returns the same objects with `version` set. A version already stamped in the subject wins;
 * the rest are numbered in order within their release-clock date.
 */
export function assignVersions(releases) {
  const perDay = new Map();
  return releases.map((r) => {
    const day = releaseDate(r.when);
    const n = (perDay.get(day) ?? 0) + 1;
    perDay.set(day, n);
    const stamped = STAMPED.exec(r.subject)?.[1];
    return { ...r, version: stamped ?? `v${day.replaceAll("-", ".")}.${n}` };
  });
}

/** The version the next release on `nowIso` gets, given every earlier release. */
export function nextVersion(releases, nowIso) {
  const day = releaseDate(nowIso);
  const n = releases.filter((r) => releaseDate(r.when) === day).length + 1;
  return `v${day.replaceAll("-", ".")}.${n}`;
}

/** Hotfix when every change it carries reads as a fix; otherwise an update. */
const FIX = /修|fix|hotfix|404|阻断|回退|revert|补\s*srcset|漏|错/i;
export function releaseType(subjects) {
  return subjects.length > 0 && subjects.every((s) => FIX.test(s)) ? "Hotfix" : "Update";
}
