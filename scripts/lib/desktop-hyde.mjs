/*
 * The client's Desktop\hyde folder layout (client, 2026-10-09: 「文件太多 帮我归纳整理 建文件夹
 * 搭建 hyde 自己的清晰的本地数据库存档和 待做计划 人工代做目标」).
 *
 * One routing rule, shared by the Word generator (so a new export lands in the right folder)
 * and scripts/organize-desktop-hyde.mjs (which files what is already there). Change the
 * layout here, nowhere else.
 */
import { homedir } from "node:os";
import { join } from "node:path";

export const DESKTOP_HYDE = join(homedir(), "Desktop", "hyde");

export const FOLDERS = {
  todo: "00-先看这里-人工待办",
  plan: "01-待做计划",
  reports: "02-周报与数据结论",
  research: "03-研究与方案",
  data: "04-数据库-原始导出",
  sales: "05-目录与报价",
  archive: "09-旧资料归档",
};

/** Folder (relative to DESKTOP_HYDE) for a document by its file name. */
export function folderFor(name) {
  if (/CLIENT-RUNBOOK|手动操作|同事操作|人工代做|目录说明|DEEPLINKS/.test(name)) return FOLDERS.todo;
  if (/待做计划|目标清单|TODO/i.test(name)) return FOLDERS.plan;
  if (/Quotation|报价|目录2026|catalog(?:ue)?/i.test(name)) return FOLDERS.sales;
  if (/\.(csv|xlsx|zip)$/i.test(name) && /cantonlock\.com/i.test(name)) return FOLDERS.data;
  if (/周报|月度|数据结论|REPORT|REVIEW|审计|Comparison|KPI|DEEPLINKS/i.test(name)) return FOLDERS.reports;
  return FOLDERS.research;
}

/** "2026-09-01", "9_1_2026" or "2026_10_9" in an export's file name → "2026-09-01". */
export function exportDate(name) {
  let m = name.match(/(20\d\d)[-_](\d{1,2})[-_](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  m = name.match(/(\d{1,2})_(\d{1,2})_(20\d\d)/);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return null;
}
