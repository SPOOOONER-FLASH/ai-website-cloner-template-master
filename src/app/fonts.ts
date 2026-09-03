import { Archivo } from "next/font/google";

/**
 * Archivo, self-hosted.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS STOPPED BEING A `<link>` TO fonts.googleapis.com
 *
 * That host is blocked in mainland China, and a stylesheet `<link>` is
 * render-blocking: the browser will not paint until it resolves or gives up. It does not
 * fail fast against a blocked host — it hangs until the connection times out. So a
 * visitor in China got a blank white page for as long as that took, and the client's own
 * team, who check the site from Zhongshan, were among the people seeing it.
 *
 * That is also the most plausible explanation for the Clarity session logged with a
 * 24-second initial load.
 *
 * The blocking is invisible from anywhere else. Nothing in the audit catches it, no test
 * fails, and the page is perfect the moment you look at it from outside China — which is
 * exactly the shape of bug that survives for months.
 *
 * `next/font/google` downloads the files at BUILD time and serves them from our own
 * origin under `_next/static/media`, so there is no third-party request at all: no
 * blocked host, no extra DNS lookup and TLS handshake before first paint, and no
 * dependency on Google being reachable from wherever the buyer is.
 *
 * ---------------------------------------------------------------------------
 * THE DETAILS THAT MATTER
 *
 * `display: "swap"` keeps text visible while the font loads — the same behaviour the
 * old `&display=swap` parameter asked for.
 *
 * `preload: false` because the font is applied through a CSS variable consumed by
 * Tailwind rather than by a className on a specific element; Next warns when it cannot
 * see the usage site, and preloading every weight on every route costs more than it
 * saves on a text-light catalogue page.
 *
 * The three weights are the ones the type scale actually uses: 400 body, 600 h2/h3,
 * 700 h1. Adding more would be free to write and not free to download.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-archivo",
  /*
    The fallback stack is spelled out here rather than left to the browser default so the
    swap period renders in something close in metrics. A visitor whose connection drops
    the font entirely still gets the layout, not Times New Roman.
  */
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
