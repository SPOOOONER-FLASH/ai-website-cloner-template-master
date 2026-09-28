import type { Locale } from "@/data/locales";
import { bauEntryDetails, bauEntryPhotos } from "@/data/bau-entry";
import { getResponsiveEditorialImageProps } from "./editorial-images";
import styles from "./BauEntry.module.css";

type BauEntryProps = { locale?: Locale };
type EntryDetails = ReturnType<typeof bauEntryDetails>;

function EntryArrow() {
  return (
    <svg className={styles.arrow} viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EntryActions({ details }: { details: EntryDetails }) {
  return (
    <div className={styles.actions}>
      <a className={styles.primaryLink} href={details.primaryHref} hrefLang={details.primaryLanguage}>
        <span>{details.copy.meeting}{details.markEnglish ? <> <bdi dir="ltr">(EN)</bdi></> : null}</span>
        <EntryArrow />
      </a>
      <a className={styles.secondaryLink} href={details.secondaryHref} hrefLang={details.secondaryLanguage} lang={details.secondaryLanguage}>
        {details.secondaryLabel}
      </a>
    </div>
  );
}

function StandFacts({ details }: { details: EntryDetails }) {
  return (
    <span className={styles.standFacts}>
      <span>{details.copy.hall} <bdi dir="ltr">{details.event.hall}</bdi></span>
      <span aria-hidden="true"> · </span>
      <span>{details.copy.stand} <bdi dir="ltr">{details.event.stand}</bdi></span>
    </span>
  );
}

/** Normal-flow, server-rendered exhibition entry; the navigation owns its placement. */
export function BauInfoBand({ locale = "en" }: BauEntryProps) {
  const details = bauEntryDetails(locale);

  return (
    <section className={`layout ${styles.band}`} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} aria-label={`${details.copy.bandIntro} BAU ${details.year}`} data-content-module="bau-info-band" data-bau-info-band="">
      <div className={`col-content ${styles.bandInner}`}>
        <p className={styles.bandName}>{details.copy.bandIntro} <bdi dir="ltr">BAU {details.year}</bdi></p>
        <div className={styles.bandFacts}>
          <bdi>{details.compactDates}</bdi>
          <bdi>{details.event.venue}</bdi>
          <StandFacts details={details} />
        </div>
        <EntryActions details={details} />
      </div>
    </section>
  );
}

/** Replaces the homepage seasonal slot; these are two separate real catalogue photos. */
export function BauShowcase({ locale = "en" }: BauEntryProps) {
  const details = bauEntryDetails(locale);

  return (
    <section className={`layout ${styles.showcase}`} lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} aria-labelledby={`bau-showcase-${locale}`} data-content-module="bau-showcase" data-bau-showcase="">
      <div className={`col-content ${styles.showcaseInner}`}>
        <div className={styles.introduction}>
          <h2 className={styles.title} id={`bau-showcase-${locale}`}>
            {details.copy.titleIntro} <bdi dir="ltr">BAU {details.year}</bdi>
          </h2>
          <div className={styles.showcaseFacts}>
            <p><bdi>{details.dates}</bdi></p>
            <p><bdi>{details.event.venue}</bdi></p>
            <p><StandFacts details={details} /></p>
          </div>
          <p className={styles.body}>{details.copy.body}</p>
          <EntryActions details={details} />
        </div>
        <div className={styles.photographs}>
          {bauEntryPhotos.map((photo) => (
            <figure className={styles.figure} key={photo.model}>
              {/* Static export uses the existing, unchanged product-photo candidates. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...getResponsiveEditorialImageProps(photo.src, "(min-width: 1440px) 433px, (min-width: 1032px) 30vw, (min-width: 744px) 47vw, calc(50vw - 24px)")}
                className={styles.productImage}
                width={1000}
                height={1000}
                loading="lazy"
                decoding="async"
                alt={`${photo.model} · ${details.copy.product}`}
              />
              <figcaption className={styles.caption}><bdi dir="ltr">{photo.model}</bdi> · {details.copy.product}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
