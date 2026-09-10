/**
 * A video `uploadDate` that Google will accept.
 *
 * ---------------------------------------------------------------------------
 * WHAT GOOGLE ACTUALLY REPORTED
 *
 * Search Console's video indexing report, 2026-09-10, raised two issues against the same
 * field on the same page:
 *
 *   日期时间属性"uploadDate"缺少时区信息      uploadDate is missing timezone information
 *   "uploadDate"的日期时间值无效               the uploadDate datetime value is invalid
 *
 * Both come from one cause. The catalogue stores `uploadDate: "2026-09-04"` — a bare
 * calendar date. Schema.org's VideoObject.uploadDate is typed as DateTime, and Google's
 * video documentation requires ISO 8601 **with a timezone offset**. A bare date parses as
 * a Date, not a DateTime, so it is simultaneously "missing timezone" and "invalid".
 *
 * The consequence is not cosmetic. A VideoObject Google refuses to parse is a video that
 * cannot earn a video result, and this site publishes 191 product clips — the single
 * largest untapped SERP feature we have. One malformed field costs all of them.
 *
 * ---------------------------------------------------------------------------
 * WHY +08:00 AND NOT Z
 *
 * The offset is not decoration to satisfy a validator; it is a claim about when the file
 * was published, and it should be true. These clips are shot and uploaded at the factory
 * in Zhongshan, Guangdong, which is UTC+8 year-round — China has observed no daylight
 * saving since 1991, so a fixed offset is correct rather than a simplification that will
 * drift twice a year.
 *
 * Writing `Z` instead would silently move every upload back eight hours and claim the
 * factory published at 16:00 the previous day. Nothing would break and the date shown to
 * a buyer in a video result would be wrong, which is the kind of small untruth this
 * catalogue does not print anywhere else.
 *
 * Midnight local is used because the records carry a date only. That is the honest
 * reading of "this was uploaded on the 4th" — not an invented hour.
 */

/** Fixed, because mainland China has had no daylight saving since 1991. */
const FACTORY_OFFSET = "+08:00";

/** Bare `YYYY-MM-DD`, which is what the catalogue stores. */
const BARE_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Normalise a stored uploadDate to an ISO 8601 datetime with an offset.
 *
 * A value that already carries a time and an offset is returned untouched — the point is
 * to fix the bare dates, not to restamp records that a later import may store correctly.
 * An unparseable value returns null so the caller can drop the video from the markup
 * rather than emit a field Google will reject; a video missing from a rich result is a
 * lost opportunity, a malformed one is an error on the page.
 */
export function isoUploadDate(value: string | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (BARE_DATE.test(trimmed)) return `${trimmed}T00:00:00${FACTORY_OFFSET}`;

  /* Already a datetime with an offset or a Z — leave it alone. */
  if (/T\d{2}:\d{2}/.test(trimmed) && /(Z|[+-]\d{2}:\d{2})$/.test(trimmed)) return trimmed;

  /* A datetime with no offset is the same defect one level up: add ours. */
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    const withSeconds = /:\d{2}:\d{2}$/.test(trimmed) ? trimmed : `${trimmed}:00`;
    return `${withSeconds}${FACTORY_OFFSET}`;
  }

  return null;
}
