import { readdirSync } from "node:fs";
import { join } from "node:path";
import { publishedProducts } from "@/data/products";
import { downloads } from "@/data/downloads";

/**
 * 我们能给买家什么文件，以及给不了什么。
 *
 * ---------------------------------------------------------------------------
 * 为什么这是一个页面而不是一篇文章
 *
 * 这些内容早就写在 /news/what-documents-you-can-actually-get/ 里，而且比任何
 * 对手写得都实 —— 它逐项说了有什么、能寄什么、以及"没有 BIM 库"。
 *
 * 但 2026-09-21 的 Clarity 读数里，Documentation 那一题我们是 **0%**。榜上除了
 * ul.com、europa.eu、ua.edu 这些发证机构，还有 snrida.com —— 一家和我们同类的
 * 中国门五金出口厂。它的 Solutions 页面上没有任何尺寸、MOQ、开模周期或认证编号，
 * 原话是 "Documentation scope is reviewed project by project"。它赢的不是内容，
 * 是**信息架构**：按买家角色分栏，把交付物逐项命名。
 *
 * 一个引擎在回答"这家供应商能提供什么文件"时，找到的是一个**站点区块**，
 * 不是一篇博客文章。文章回答一个问题；区块回答"你是谁、能给我什么"。
 *
 * 所以内容不变 —— 那篇文章的诚实程度就是我们的资产 —— 变的只是它的位置和形状。
 *
 * ---------------------------------------------------------------------------
 * 分类为什么是这三种用途
 *
 * 不是抄 snrida 的 Contractors / Importers / Distributors。那是他们的销售漏斗。
 * 我们用的是那篇文章自己已经写出来的三种用途：
 *
 *   "A cutsheet for a client approval, a drawing for a door manufacturer's
 *    machining setup and a specification for a tender each need a different
 *    thing emphasised."
 *
 * 买家不是按自己的角色找文件的，是按**手上那份文件要交给谁**找的。
 *
 * ---------------------------------------------------------------------------
 * 数字现算
 *
 * 那篇文章写着"79 张线图"。今天实际是 84 张。一个写死的数字在下一次生成线图
 * 时就过期了，而且没有人会发现 —— 这正是 AGENTS.md 那条生成器规则的由来。
 */

const DRAWINGS_DIR = join(process.cwd(), "public", "images", "drawings");

/** Dimensioned line drawings actually on disk, drawn 1:1 from published dimensions. */
export function drawingCount(): number {
  try {
    return readdirSync(DRAWINGS_DIR).filter((f) => f.endsWith(".svg")).length;
  } catch {
    return 0;
  }
}

/** Products whose spec table a buyer can read today. */
export function specifiedProductCount(): number {
  return publishedProducts.filter((p) => (p.specs ?? []).length > 0).length;
}

export function catalogue() {
  return downloads.find((d) => d.kind === "catalogue") ?? null;
}

export type Availability = "published" | "on-request" | "absent";

export interface DocumentRow {
  id: string;
  availability: Availability;
  /** Which of the three purposes this document serves. */
  purposes: ("approval" | "machining" | "tender")[];
}

/**
 * The inventory, in the order the article states it: most of it first, the gap last.
 *
 * `absent` rows are not an oversight. A supplier page that lists only what it has
 * reads as complete, and a specifier discovers the gap after they have designed
 * around it. Saying "there is no BIM library" on the same page is the difference
 * between a factory that is careful and one that is hopeful.
 */
export const DOCUMENT_ROWS: DocumentRow[] = [
  { id: "drawings", availability: "published", purposes: ["machining", "approval"] },
  { id: "specifications", availability: "published", purposes: ["tender", "approval"] },
  { id: "catalogue", availability: "published", purposes: ["approval", "tender"] },
  { id: "spec-export", availability: "on-request", purposes: ["tender"] },
  { id: "test-documents", availability: "on-request", purposes: ["tender"] },
  { id: "bim", availability: "absent", purposes: ["machining", "tender"] },
  { id: "native-cad", availability: "absent", purposes: ["machining"] },
];
