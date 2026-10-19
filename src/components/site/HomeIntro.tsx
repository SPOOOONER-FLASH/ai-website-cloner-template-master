import styles from "./HomeIntro.module.css";

/**
 * The homepage's opening curtain, from the 2026-10-12 motion demo (design 4's BrandIntro):
 * the HYDE icon turns in, the wordmark wipes on, a rule draws, and the curtain parts top and
 * bottom. Client 2026-10-12: 「首页打开我要那个加载动画」.
 *
 * It is pure CSS, in the HTML, so it starts with the first paint and needs no JavaScript to
 * finish: the last keyframe hides it whatever happens. The inline script only decides whether
 * to show it at all — once per browser session, never for reduced motion — by marking <html>
 * before the curtain is parsed, so a returning visitor never sees it flash. The page beneath
 * renders and loads normally the whole time; the curtain is an overlay, not a loading gate.
 */
const DECIDE = `try{var d=document.documentElement;if(sessionStorage.getItem("hyde-intro")||matchMedia("(prefers-reduced-motion: reduce)").matches){d.dataset.intro="skip"}else{sessionStorage.setItem("hyde-intro","1")}}catch(e){document.documentElement.dataset.intro="skip"}`;

export function HomeIntro() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: DECIDE }} />
      <div className={styles.intro} aria-hidden="true">
        <div className={`${styles.half} ${styles.top}`} />
        <div className={`${styles.half} ${styles.bottom}`} />
        <div className={styles.center}>
          {/* eslint-disable-next-line @next/next/no-img-element -- a 1 KB SVG mark, no responsive variants */}
          <img className={styles.icon} src="/images/brand/hyde/hyde-logo-icon-black.svg" alt="" width={73} height={64} />
          {/* eslint-disable-next-line @next/next/no-img-element -- as above */}
          <img className={styles.word} src="/images/brand/hyde/hyde-logo-horizontal-black.svg" alt="" width={120} height={30} />
          <span className={styles.rule} />
        </div>
      </div>
    </>
  );
}
