import type { ImageRef } from "./types";

/**
 * Company profile and credentials — Canton Hyland.
 *
 * `profile` is based on the client's own approved English copy, delivered
 * 2026-08-15 (公司英文简介.docx). The client explicitly confirmed on 2026-08-16
 * that every site reference must use 1998 as the founding year. Certification
 * wording is narrowed to the supplied model-specific evidence; broad claims are
 * not extended beyond the certificate scans.
 */

export const profile: string[] = [
  "Canton Hyland Hardware (Group) Co., Ltd. was founded in 1998 and brings decades of manufacturing expertise to the commercial and residential hardware industry. Our production facilities house equipment for stamping, polishing, assembly and quality control.",
  "We specialize in comprehensive door security and building hardware solutions, including panic devices, cylindrical locks, tubular locks, deadbolts, lock cases, profile cylinders, door handles, patch fittings, and a complete range of building and bedroom hardware accessories. Supplied credentials include model-specific Intertek test reports and a CE conformity certificate for panic exit devices.",
  "As recognized experts in master key and construction key systems, we provide sophisticated access control solutions for complex commercial and institutional projects. Since achieving ISO 9001 certification in 2002, we have maintained our commitment to quality excellence and continuous improvement.",
  "We welcome OEM partnerships and specialize in developing custom solutions tailored to specific client requirements. We invite you to visit our facilities to explore how our expertise can meet your hardware needs.",
];

export const profileEs: string[] = [
  "Canton Hyland Hardware (Group) Co., Ltd. fue fundada en 1998 y aporta décadas de experiencia a la fabricación de herrajes para edificios comerciales y residenciales. Nuestras instalaciones integran estampación, pulido, montaje y control de calidad.",
  "Nos especializamos en soluciones completas de seguridad y herrajes para puertas: dispositivos antipánico, cerraduras cilíndricas y tubulares, cerrojos, cajas de cerradura, cilindros de perfil, manillas, herrajes para vidrio y accesorios para edificios y dormitorios.",
  "Como especialistas en sistemas de llave maestra y llave de obra, apoyamos proyectos comerciales e institucionales complejos. Desde la certificación ISO 9001 en 2002, mantenemos un enfoque de mejora continua y control de calidad.",
  "Trabajamos con distribuidores, arquitectos, contratistas y socios OEM, desarrollando soluciones adaptadas a requisitos técnicos y mercados de exportación.",
];

/**
 * Figures published on the client's own Alibaba storefront, read 2026-08-15.
 * Ranges are kept as ranges — narrowing them would be inventing precision.
 */
export const stats: { label: string; value: string }[] = [
  { label: "Founded", value: "1998" },
  { label: "Workforce", value: "101–200 people" },
  { label: "Facility area", value: "3,000–5,000 m²" },
  { label: "Annual output value", value: "US$50–100 million" },
  { label: "Quality system", value: "ISO 9001 since 2002" },
  { label: "Business type", value: "Manufacturer" },
  { label: "Location", value: "Guangdong, China" },
];

export const statsEs: { label: string; value: string }[] = [
  { label: "Fundación", value: "1998" },
  { label: "Equipo", value: "101–200 personas" },
  { label: "Superficie", value: "3.000–5.000 m²" },
  { label: "Producción anual", value: "US$50–100 millones" },
  { label: "Sistema de calidad", value: "ISO 9001 desde 2002" },
  { label: "Actividad", value: "Fabricante" },
  { label: "Ubicación", value: "Guangdong, China" },
];

export interface CertificateRecord {
  /** Standard or report title as printed on the document. */
  title: string;
  /** Issuing body. */
  issuer: string;
  /** Report or certificate number, verbatim. */
  reference: string;
  /** Date of issue as printed. */
  issued: string;
  /** The EXACT model the document covers. Do not generalise this to a product family. */
  coversModel: string;
  /**
   * Whether the scan may be published and offered as a download.
   *
   * False for all current records. Both issuers restrict redistribution: the Intertek
   * reports carry "Only the Client is authorized to permit copying or distribution of
   * this report and then only in its entirety", and this site was publishing page 1 of a
   * 13-page report. The same clause requires written Intertek approval before their name
   * or marks are used in advertising. CELAB's certificate carries an equivalent notice.
   *
   * Stating the facts below — standard, issuer, report number, model, date — is not
   * redistribution and stays public. Flip an entry to true once the issuer's written
   * permission is on file.
   */
  publish: boolean;
  image?: ImageRef;
}

/**
 * ⚠ Every entry below is transcribed from the certificate scan the client supplied.
 * Each one names a SPECIFIC model. A certificate for KD070/30-290 is not evidence
 * for model 305, so these are presented as company credentials — they are NOT
 * attached to individual product records. Mapping current SKUs to test reports
 * needs the client to confirm which models each report still covers.
 *
 * ⚠ A FOURTH RECORD WAS REMOVED, DO NOT RESTORE IT.
 *
 * The EN 1154 floor spring report (Intertek 151120057GZU-001, model KD070/20-101) named
 * KALE KILIT VE KALIP SANAYI A.S of Istanbul as the applicant and KALE ARCO as the trade
 * mark; Canton Hyland appears only as the contract manufacturer. It is a customer's
 * document, published here by mistake, and the scan has been deleted from the repository
 * along with its /downloads entry.
 *
 * The three that remain ARE Canton Hyland's own — the EN 1125 report names Canton Hyland
 * as both applicant and manufacturer with HYLAND as the trade mark, and the 607 SS ET
 * report is rendered to Canton Hyland. The client's message that "EN 1125 is a KALE
 * model" is mistaken; only the floor spring was KALE's. They are withheld for a different
 * reason — see `publish` above.
 *
 * There is no ANSI/BHMA certification. The client has confirmed this outright, so no
 * product record may carry an ANSI grade.
 */
export const certificates: CertificateRecord[] = [
  {
    title: "EN 1125 — Panic exit devices operated by a horizontal bar",
    issuer: "Intertek Testing Services Shenzhen Ltd., Guangzhou Branch",
    reference: "130722068GZU-001",
    issued: "7 November 2013",
    coversModel: "KD070/30-290",
    publish: false,
  },
  {
    title: "Tubular door lock durability test",
    issuer: "Intertek Testing Services Shenzhen Ltd., Guangzhou Branch",
    reference: "140306043GZU-001",
    issued: "28 April 2014",
    coversModel: "607 SS ET",
    publish: false,
  },
  {
    title: "CE Certificate of Conformity — EN 1125:2008",
    issuer: "CELAB, Italy",
    reference: "See certificate",
    issued: "2010",
    coversModel: "Panic exit device series",
    publish: false,
  },
];

/**
 * Representative editorial studies used for atmosphere only. These are not
 * documentary photographs of Canton Hyland facilities or completed projects.
 */
export const companyEditorialStudies: ImageRef[] = [
  {
    src: "/images/editorial/home-material-library.webp",
    ratio: "3 / 2",
    label: "Representative architectural material-library study in limestone, brushed metal, bronze and oak",
    labelEs: "Estudio representativo de una biblioteca de materiales con piedra caliza, metal cepillado, bronce y roble",
  },
  {
    src: "/images/editorial/home-design-context.webp",
    ratio: "3 / 2",
    label: "Representative architectural junction study in timber, limestone and metal",
    labelEs: "Estudio arquitectónico representativo de encuentros entre madera, piedra caliza y metal",
  },
  {
    src: "/images/editorial/industrial-precision-parts.webp",
    ratio: "3 / 2",
    label: "Representative editorial study of precision-machined metal forms",
    labelEs: "Estudio editorial representativo de formas metálicas mecanizadas con precisión",
  },
];
