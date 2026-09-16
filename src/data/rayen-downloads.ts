/**
 * The files the RAYEN site offers for download.
 *
 * Every figure here is a claim a buyer acts on before spending their data allowance, so
 * `bytes` and `pages` are checked against the real file by src/lib/rayen-downloads.test.ts
 * rather than trusted. A stale "8.4 MB" next to a 73 MB file is worse than no figure.
 *
 * WHY THE CATALOGUE IS RE-RENDERED AND NOT SHIPPED AS RECEIVED
 * The press original is 73 MB. On a phone over mobile data that is not a download, it is an
 * abandoned tab. The copy here is every page re-rendered at 2000 px wide — model codes and
 * the Chinese finish names stay legible at 100% zoom, which is what the file is for. The
 * press original still exists and is sent on request; see `note` in the page strings.
 */

export type RayenDownload = {
  id: string;
  href: string;
  zh: { title: string; summary: string };
  en: { title: string; summary: string };
  format: string;
  pages: number;
  bytes: number;
};

export const downloads: RayenDownload[] = [
  {
    id: "catalogue-2026",
    href: "/downloads/rayen-product-catalogue-2026.pdf",
    zh: {
      title: "雷茵产品图册 2026",
      summary: "执手、插芯锁体、合页与门控配件的完整图册，含型号、表面处理与配套件对照。",
    },
    en: {
      title: "RAYEN product catalogue 2026",
      summary:
        "The full catalogue of levers, mortice locks, hinges and door furniture, with model codes, finishes and matching pieces.",
    },
    format: "PDF",
    pages: 84,
    bytes: 8841446,
  },
];

/** "8.4 MB" — one decimal, because the second one is noise at this size. */
export function megabytes(bytes: number): string {
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
