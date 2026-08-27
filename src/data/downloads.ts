import downloadsFile from "../../content/downloads.json";
import type { DownloadFile, DownloadKind } from "./types";

/**
 * Download records are limited to client-supplied files already stored locally.
 * The four reports are model-scoped evidence; never present them as blanket approval
 * for the current catalogue. All certification information must be checked against
 * the original test reports before public launch.
 */
export const downloads = downloadsFile.downloads as DownloadFile[];

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

/**
 * Resolve attachment ids to files, in the order given.
 *
 * Unknown ids are dropped rather than throwing: an article referencing a press kit that
 * has not been uploaded yet should render without its download block, not fail the whole
 * build. The id is a plain string in the CMS, so a typo is a matter of when, not if.
 */
export function getDownloadsByIds(ids: readonly string[]): DownloadFile[] {
  return ids
    .map((id) => downloads.find((file) => file.id === id))
    .filter((file): file is DownloadFile => Boolean(file));
}

