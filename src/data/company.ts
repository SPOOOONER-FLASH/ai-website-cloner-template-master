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
  "Canton Hyland Hardware (Group) Co., Ltd. was founded in 1998 in Xiaolan, Zhongshan, the town that ships close to a third of China's lock exports. We stamp, polish, assemble and inspect our own parts, and our quality system has been certified to ISO 9001 since 2002.",
  "The range covers most of what a door needs: panic exit devices, cylindrical and tubular locks, deadbolts, mortise lock cases, profile cylinders, levers, glass door fittings, hinges, closers and the small parts that finish the job. Master key and construction key systems are a specialty. They are what a hospital, a school or an office tower asks of a lock supplier, and they are where a supplier's records either hold up or do not.",
  "Much of what we make leaves Xiaolan under our customers' brands. Bring us a drawing or a sample and we tool it. If a design runs into another maker's patent, our engineers change the parts or the appearance until it no longer does. We ship to brands and distributors in Europe, Russia, the Americas, Turkey and Southeast Asia. We exhibited at the Cologne hardware fair for years, and our Spanish-speaking team has exhibited in Lima and Buenos Aires.",
  "The best way to judge a factory is to stand in it. Buyers who want to see the floor before the first container are welcome in Zhongshan, and those who cannot travel can start with a sample.",
];

export const profileEs: string[] = [
  "Canton Hyland Hardware (Group) Co., Ltd. se fundó en 1998 en Xiaolan, Zhongshan, la localidad de donde sale cerca de un tercio de las cerraduras que exporta China. Estampamos, pulimos, montamos e inspeccionamos nuestras propias piezas, y nuestro sistema de calidad está certificado según ISO 9001 desde 2002.",
  "La gama cubre casi todo lo que necesita una puerta: dispositivos antipánico, cerraduras cilíndricas y tubulares, cerrojos, cajas de cerradura de embutir, cilindros de perfil, manijas, herrajes para puertas de vidrio, bisagras, cierrapuertas y las piezas pequeñas que rematan el trabajo. Los sistemas de llave maestra y llave de obra son una especialidad. Es lo que un hospital, una escuela o una torre de oficinas pide a un proveedor de cerraduras, y es donde los registros de un proveedor se sostienen o no.",
  "Buena parte de lo que fabricamos sale de Xiaolan con la marca de nuestros clientes. Tráiganos un plano o una muestra y hacemos el molde. Si un diseño choca con la patente de otro fabricante, nuestros ingenieros cambian las piezas o el aspecto hasta que deja de chocar. Enviamos a marcas y distribuidores de Europa, Rusia, América, Turquía y el Sudeste Asiático. Expusimos durante años en la feria de ferretería de Colonia, y nuestro equipo de habla hispana ha expuesto en Lima y en Buenos Aires.",
  "La mejor manera de juzgar una fábrica es entrar en ella. Los compradores que quieran ver la planta antes del primer contenedor son bienvenidos en Zhongshan, y quienes no puedan viajar pueden empezar con una muestra.",
];

/**
 * The same profile in Brazilian Portuguese.
 *
 * Translated from the ENGLISH, which is the client's own approved copy, not from the
 * Spanish — see src/lib/localised.ts. 1998 is the founding year on every locale; the
 * client confirmed that on 2026-08-16 and it is not a translation decision.
 */
export const profilePt: string[] = [
  "A Canton Hyland Hardware (Group) Co., Ltd. foi fundada em 1998 em Xiaolan, Zhongshan, a cidade de onde sai perto de um terço das fechaduras que a China exporta. Estampamos, polimos, montamos e inspecionamos as nossas próprias peças, e o nosso sistema de qualidade é certificado pela ISO 9001 desde 2002.",
  "A linha cobre quase tudo o que uma porta precisa: barras antipânico, fechaduras cilíndricas e tubulares, travas, caixas de fechadura de embutir, cilindros de perfil, maçanetas, ferragens para portas de vidro, dobradiças, molas aéreas e as peças pequenas que completam o serviço. Sistemas de chave-mestra e chave de obra são uma especialidade. É o que um hospital, uma escola ou um prédio de escritórios pede a um fornecedor de fechaduras, e é onde os registros de um fornecedor se sustentam ou não.",
  "Boa parte do que fabricamos sai de Xiaolan com a marca dos nossos clientes. Traga um desenho ou uma amostra e fazemos o ferramental. Se um projeto esbarra na patente de outro fabricante, nossos engenheiros alteram as peças ou a aparência até que deixe de esbarrar. Enviamos para marcas e distribuidores da Europa, da Rússia, das Américas, da Turquia e do Sudeste Asiático. Expusemos durante anos na feira de ferragens de Colônia, e nossa equipe que fala espanhol já expôs em Lima e em Buenos Aires.",
  "A melhor forma de julgar uma fábrica é entrar nela. Compradores que queiram ver a fábrica antes do primeiro contêiner são bem-vindos em Zhongshan, e quem não puder viajar pode começar com uma amostra.",
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

export const statsPt: { label: string; value: string }[] = [
  { label: "Fundação", value: "1998" },
  { label: "Equipe", value: "101–200 pessoas" },
  { label: "Área fabril", value: "3.000–5.000 m²" },
  { label: "Produção anual", value: "US$ 50–100 milhões" },
  { label: "Sistema de qualidade", value: "ISO 9001 desde 2002" },
  { label: "Atividade", value: "Fabricante" },
  { label: "Localização", value: "Guangdong, China" },
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
 * The factory. Four photographs of the actual plant, not atmosphere.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS CHANGED ON 2026-09-16
 *
 * This rail used to hold three editorial studies — an architectural material library, a
 * timber-and-limestone junction, and a tray of precision-machined blocks — captioned
 * "Representative…" because that is what they were. The client's own verdict, on being
 * asked whether the site could be shown to a Brazilian buyer:
 * 「目前的确实不像样子，几个 ai 图」.
 *
 * He is right, and the machined-blocks image was the worst of the three for a reason
 * AGENTS.md states outright: a heavy-industrial frame beside light door hardware "reads as
 * a catalogue somebody assembled from stock images". A tray of V-blocks and bushings does
 * not show that we make locks. It raises the question of whether we do.
 *
 * ---------------------------------------------------------------------------
 * WHAT THESE ARE, AND WHY THE CAPTIONS CHANGED SHAPE
 *
 * All three are client-supplied photographs of the plant — `press-shop.webp`,
 * `polishing-line.webp` and `assembly-line.webp`, from 公司图 1/2/3.jpg, registered in
 * IMAGE_CREDITS.md under first-party material. They are phone-camera pictures with mixed
 * colour temperature and no styling, and that is the argument rather than a defect: a
 * buyer deciding whether to put their own brand on our product is looking for evidence of
 * a process, not for a mood.
 *
 * So the captions say what is in the frame instead of hedging. "Representative study" was
 * required while the images were generated; it would be false modesty here, and it would
 * throw away the one thing these photographs are for. The generated set stays available
 * for architectural context elsewhere and keeps its hedged wording — see IMAGE_CREDITS.md,
 * which forbids "our factory" for those files and permits it for these.
 */
export const companyEditorialStudies: ImageRef[] = [
  {
    src: "/images/company/press-shop.webp",
    ratio: "3 / 2",
    label:
      "Our press shop: a row of mechanical punch presses with their tooling set, where lock cases, plates and handle blanks are stamped",
    labelEs:
      "Nuestra sección de prensas: una fila de prensas mecánicas con su utillaje montado, donde se estampan cajas de cerradura, placas y piezas en bruto de manijas",
    labelPt:
      "Nosso setor de prensas: uma fila de prensas mecânicas com a ferramenta montada, onde são estampadas caixas de fechadura, espelhos e peças brutas de maçanetas",
  },
  {
    src: "/images/company/polishing-line.webp",
    ratio: "3 / 2",
    label:
      "Our polishing line, with its extraction ducting overhead — the stage that decides whether a satin finish is even across a whole production run",
    labelEs:
      "Nuestra línea de pulido, con su extracción aérea — la etapa que decide si un acabado satinado es uniforme en toda una serie de producción",
    labelPt:
      "Nossa linha de polimento, com a exaustão aérea: a etapa que decide se um acabamento acetinado sai uniforme em todo um lote de produção",
  },
  {
    src: "/images/company/assembly-line.webp",
    ratio: "3 / 2",
    label:
      "Our assembly hall: operators building and bagging sets at the benches, with finished goods palletised behind them",
    labelEs:
      "Nuestra nave de montaje: operarios montando y embolsando juegos en los puestos, con producto terminado paletizado detrás",
    labelPt:
      "Nosso galpão de montagem: operários montando e ensacando conjuntos nas bancadas, com produto acabado paletizado atrás",
  },
  /*
    The fourth, added 2026-09-16 at the client's request to use the photographs in the
    RAYEN folder.

    The other three show PROCESS — pressing, polishing, assembling. This one shows capital,
    and it is the only picture in the set that answers the question a buyer asks before
    putting their own brand on a part: is this a workshop or a factory. A fibre laser
    cutter is not something a trading company has in a rented unit.

    The machine carries its maker's branding, which content/rayen/assets.json cleared
    explicitly — 「设备实拍，机身厂牌为设备供应商而非门锁品牌」. That is a supplier's mark on
    equipment, not another hardware brand on a product, and removing it would be retouching
    a documentary photograph.

    Cropped to 3:2 from a square original by scripts/build-company-crops.mjs — a photograph
    of a room has margin to give, which is why that script crops where build-framed-heroes
    pads.
  */
  {
    src: "/images/company/factory-laser-cutter.webp",
    ratio: "3 / 2",
    label:
      "The fiber laser cutter on our shop floor, cutting the steel plate that becomes lock cases and backplates",
    labelEs:
      "La cortadora láser de fibra en nuestra planta, que corta la chapa de acero de la que salen cajas de cerradura y placas",
    labelPt:
      "A cortadora laser de fibra na nossa fábrica, que corta a chapa de aço de que saem caixas de fechadura e espelhos",
  },
];
