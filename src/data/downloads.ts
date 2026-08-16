import type { DownloadFile, DownloadKind } from "./types";

/**
 * Download records are limited to client-supplied files already stored locally.
 * The four reports are model-scoped evidence; never present them as blanket approval
 * for the current catalogue. All certification information must be checked against
 * the original test reports before public launch.
 */
export const downloads: DownloadFile[] = [
  {
    id: "catalogue-2026",
    title: "Canton Hyland Product Catalogue 2026",
    kind: "catalogue",
    format: "pdf",
    sizeBytes: 4_633_973,
    url: "/downloads/canton-hyland-product-catalogue-2026.pdf",
    language: "en",
    relatedModels: [],
    updatedAt: "2026-08-16",
  },
  {
    id: "intertek-en1125-kd070-30-290",
    title: "Intertek EN 1125 Test Report — KD070/30-290",
    kind: "certificate",
    format: "webp",
    sizeBytes: 46_132,
    url: "/images/certificates/intertek-en1125-panic-device.webp",
    language: "en",
    relatedModels: ["KD070/30-290"],
    updatedAt: "2013-11-07",
  },
  {
    id: "intertek-en1154-kd070-20-101",
    title: "Intertek EN 1154 Test Report — KD070/20-101",
    kind: "certificate",
    format: "webp",
    sizeBytes: 30_838,
    url: "/images/certificates/intertek-en1154-floor-spring.webp",
    language: "en",
    relatedModels: ["KD070/20-101"],
    updatedAt: "2016-06-17",
  },
  {
    id: "intertek-durability-607-ss-et",
    title: "Intertek Tubular Lock Durability Report — 607 SS ET",
    kind: "certificate",
    format: "webp",
    sizeBytes: 22_730,
    url: "/images/certificates/intertek-tubular-lock-durability.webp",
    language: "en",
    relatedModels: ["607 SS ET"],
    updatedAt: "2014-04-28",
  },
  {
    id: "celab-ce-panic-device-series",
    title: "CELAB CE Certificate of Conformity — Panic Exit Device Series",
    kind: "certificate",
    format: "webp",
    sizeBytes: 19_946,
    url: "/images/certificates/celab-ce-panic-exit-device.webp",
    language: "en",
    relatedModels: [],
    updatedAt: "2010-01-01",
  },
];

export const downloadKindLabels: Record<DownloadKind, string> = {
  catalogue: "Product catalogues",
  datasheet: "Technical datasheets",
  certificate: "Test reports and certificates",
  cad: "CAD files",
  bim: "BIM objects",
  installation: "Installation guides",
  warranty: "Warranty documents",
};

export function formatDownloadSize(sizeBytes: number): string {
  if (sizeBytes >= 1_000_000) return `${(sizeBytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.round(sizeBytes / 1_000)} KB`;
}

export function getDownloadsByKind(kind: DownloadKind): DownloadFile[] {
  return downloads.filter((file) => file.kind === kind);
}

