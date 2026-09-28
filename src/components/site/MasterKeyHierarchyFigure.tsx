import type { Locale } from "@/data/site";

/*
  The hierarchy chart for /guides/master-key-hierarchy-planning-2026/.

  It draws what the article argues, nothing more: the levels from its table, one
  cross-keyed door (its "expensive favor"), one door kept off every master (its "which
  doors must never be on a master"), and one group reserved for expansion. Every node
  is a role the text names. No platform, pin count or capacity figure appears, because
  the article says plainly that those belong to whoever designs the real system.

  Labels exist for all ten locales, using each locale's own terms from its translation of
  the article's levels table. A locale without labels renders nothing rather than English.
*/

type Labels = {
  title: string;
  caption: string;
  ggmk: [string, string];
  gmk: [string, string];
  mk: (n: number) => [string, string];
  reserved: [string, string];
  door: string;
  cross: [string, string];
  noMaster: [string, string];
  legend: [string, string, string];
};

const LABELS: Partial<Record<Locale, Labels>> = {
  en: {
    title: "Example master key hierarchy",
    caption:
      "An example three-level system: a grand master, two floor masters and the change keys below them, with the three decisions this article says belong at design time: one cross-keyed door, one door kept off every master, and one group reserved for expansion. Illustrative only; a real hierarchy is designed on the platform it will be cut on.",
    ggmk: ["Grand grand master (GGMK)", "only for several systems; often not issued"],
    gmk: ["Grand master (GMK)", "opens every door in this system"],
    mk: (n) => [`Master (MK) · Floor ${n}`, `opens every door on floor ${n}`],
    reserved: ["Reserved group", "left unissued for expansion"],
    door: "change key",
    cross: ["Meeting room", "cross-keyed"],
    noMaster: ["Server room", "on no master"],
    legend: ["Mastered", "Cross-keyed", "Reserved or optional"],
  },
  es: {
    title: "Ejemplo de jerarquía de llave maestra",
    caption:
      "Un sistema de ejemplo con tres niveles: una gran maestra, dos maestras de planta y las llaves diferentes debajo, con las tres decisiones que este artículo sitúa en la fase de diseño: una puerta con llave cruzada, una puerta fuera de toda maestra y un grupo reservado para ampliaciones. Solo ilustrativo; la jerarquía real se diseña sobre la plataforma en la que se va a cortar.",
    ggmk: ["Gran gran maestra (GGMK)", "solo para varios sistemas; a menudo no se emite"],
    gmk: ["Gran maestra (GMK)", "abre todas las puertas del sistema"],
    mk: (n) => [`Maestra (MK) · Planta ${n}`, `abre todas las puertas de la planta ${n}`],
    reserved: ["Grupo reservado", "sin emitir, para ampliaciones"],
    door: "llave diferente",
    cross: ["Sala de reuniones", "llave cruzada"],
    noMaster: ["Sala de servidores", "fuera de toda maestra"],
    legend: ["Amaestrada", "Llave cruzada", "Reservado u opcional"],
  },
  pt: {
    title: "Exemplo de hierarquia de chave mestra",
    caption:
      "Um sistema de exemplo com três níveis: uma grande mestra, duas mestras de andar e as chaves diferentes abaixo delas, com as três decisões que este artigo coloca na fase de projeto: uma porta com chave cruzada, uma porta fora de qualquer mestra e um grupo reservado para ampliação. Apenas ilustrativo; a hierarquia real é projetada na plataforma em que será cortada.",
    ggmk: ["Grande grande mestra (GGMK)", "só para vários sistemas; muitas vezes não é emitida"],
    gmk: ["Grande mestra (GMK)", "abre todas as portas do sistema"],
    mk: (n) => [`Mestra (MK) · Andar ${n}`, `abre todas as portas do andar ${n}`],
    reserved: ["Grupo reservado", "não emitido, para ampliação"],
    door: "chave diferente",
    cross: ["Sala de reuniões", "chave cruzada"],
    noMaster: ["Sala de servidores", "fora de qualquer mestra"],
    legend: ["Com mestra", "Chave cruzada", "Reservado ou opcional"],
  },
  fr: {
    title: "Exemple d’organigramme de passe",
    caption:
      "Un exemple de système à trois niveaux : un passe général, deux passes partiels d’étage et les clés individuelles en dessous, avec les trois décisions que cet article place au moment de la conception : une porte en croisement, une porte hors de tout passe et un groupe réservé pour l’extension. Illustration seulement ; un vrai organigramme se conçoit sur la plateforme sur laquelle il sera taillé.",
    ggmk: ["Passe grand général (GGMK)", "seulement pour plusieurs systèmes ; souvent non émis"],
    gmk: ["Passe général (GMK)", "ouvre toutes les portes du système"],
    mk: (n) => [`Passe partiel (MK) · Étage ${n}`, `ouvre toutes les portes de l’étage ${n}`],
    reserved: ["Groupe réservé", "non émis, pour l’extension"],
    door: "clé individuelle",
    cross: ["Salle de réunion", "en croisement"],
    noMaster: ["Salle serveurs", "hors de tout passe"],
    legend: ["Sur passe", "Croisement", "Réservé ou facultatif"],
  },
  de: {
    title: "Beispiel einer Schließanlagen-Hierarchie",
    caption:
      "Ein Beispiel mit drei Ebenen: ein Generalschlüssel, zwei Hauptschlüssel je Etage und die Einzelschlüssel darunter, mit den drei Entscheidungen, die dieser Artikel in die Planung legt: eine Tür mit Überschneidung, eine Tür außerhalb jedes Hauptschlüssels und eine für Erweiterungen reservierte Gruppe. Nur zur Veranschaulichung; eine echte Hierarchie wird auf der Plattform geplant, auf der sie geschnitten wird.",
    ggmk: ["Obergeneralschlüssel (GGMK)", "nur bei mehreren Anlagen; oft nicht ausgegeben"],
    gmk: ["Generalschlüssel (GMK)", "schließt jede Tür dieser Anlage"],
    mk: (n) => [`Hauptschlüssel (MK) · Etage ${n}`, `schließt jede Tür auf Etage ${n}`],
    reserved: ["Reservierte Gruppe", "für Erweiterung nicht ausgegeben"],
    door: "Einzelschlüssel",
    cross: ["Besprechungsraum", "Überschneidung"],
    noMaster: ["Serverraum", "auf keinem Hauptschlüssel"],
    legend: ["Im Hauptschlüssel", "Überschneidung", "Reserviert oder optional"],
  },
  ja: {
    title: "マスターキー階層の例",
    caption:
      "3段階のシステムの例です。グランドマスター1本、各階のマスター2本、その下の個別キーに加えて、この記事が設計段階で決めるべきとする3点を示しています。相互キーの扉1枚、どのマスターにも入れない扉1枚、増設用に残すグループ1つです。図は説明用で、実際の階層は切削するプラットフォーム上で設計します。",
    ggmk: ["グランドグランドマスター（GGMK）", "複数システム向け・発行しないことも多い"],
    gmk: ["グランドマスター（GMK）", "このシステムの全扉を開ける"],
    mk: (n) => [`マスター（MK）・${n}階`, `${n}階の全扉を開ける`],
    reserved: ["予備グループ", "増設用に未発行"],
    door: "個別キー",
    cross: ["会議室", "相互キー"],
    noMaster: ["サーバー室", "どのマスターにも入れない"],
    legend: ["マスター系統", "相互キー", "予備・任意"],
  },
  ko: {
    title: "마스터키 계층 예시",
    caption:
      "3단계 시스템의 예입니다. 그랜드 마스터 1개, 층별 마스터 2개, 그 아래 개별 키와 함께, 이 글이 설계 단계에서 정해야 한다고 말하는 세 가지를 보여 줍니다. 크로스 키잉 문 1개, 어떤 마스터에도 넣지 않는 문 1개, 확장용으로 남겨 둔 그룹 1개입니다. 설명용 도식이며, 실제 계층은 가공할 플랫폼에서 설계합니다.",
    ggmk: ["그랜드 그랜드 마스터(GGMK)", "여러 시스템용, 발급하지 않는 경우가 많음"],
    gmk: ["그랜드 마스터(GMK)", "이 시스템의 모든 문을 엶"],
    mk: (n) => [`마스터(MK) · ${n}층`, `${n}층의 모든 문을 엶`],
    reserved: ["예비 그룹", "확장용으로 미발급"],
    door: "개별 키",
    cross: ["회의실", "크로스 키잉"],
    noMaster: ["서버실", "어떤 마스터에도 없음"],
    legend: ["마스터 계통", "크로스 키잉", "예비 또는 선택"],
  },
  tr: {
    title: "Örnek master anahtar hiyerarşisi",
    caption:
      "Üç seviyeli örnek bir sistem: bir grand master, iki kat masterı ve altlarındaki tekil anahtarlar; bu yazının tasarım aşamasında verilmesi gerektiğini söylediği üç kararla birlikte: bir çapraz anahtarlı kapı, hiçbir mastera bağlı olmayan bir kapı ve genişleme için ayrılmış bir grup. Yalnızca örnektir; gerçek hiyerarşi, anahtarların kesileceği platform üzerinde tasarlanır.",
    ggmk: ["Grand grand master (GGMK)", "yalnızca birden çok sistem için; çoğu zaman verilmez"],
    gmk: ["Grand master (GMK)", "bu sistemdeki her kapıyı açar"],
    mk: (n) => [`Master (MK) · Kat ${n}`, `${n}. kattaki her kapıyı açar`],
    reserved: ["Ayrılmış grup", "genişleme için verilmedi"],
    door: "tekil anahtar",
    cross: ["Toplantı odası", "çapraz anahtarlı"],
    noMaster: ["Sunucu odası", "hiçbir masterda değil"],
    legend: ["Mastera bağlı", "Çapraz anahtarlı", "Ayrılmış veya isteğe bağlı"],
  },
  ru: {
    title: "Пример иерархии мастер-ключей",
    caption:
      "Пример системы из трёх уровней: гранд-мастер, два поэтажных мастера и индивидуальные ключи под ними, а также три решения, которые, по этой статье, принимаются на этапе проектирования: одна дверь с перекрёстным ключом, одна дверь вне любого мастера и одна группа, оставленная под расширение. Схема иллюстративная; настоящая иерархия проектируется на той платформе, на которой будут нарезаться ключи.",
    ggmk: ["Гранд-гранд-мастер (GGMK)", "только для нескольких систем; часто не выдаётся"],
    gmk: ["Гранд-мастер (GMK)", "открывает все двери системы"],
    mk: (n) => [`Мастер (MK) · Этаж ${n}`, `открывает все двери этажа ${n}`],
    reserved: ["Резервная группа", "не выдана, под расширение"],
    door: "индивид. ключ",
    cross: ["Переговорная", "перекрёстный ключ"],
    noMaster: ["Серверная", "вне любого мастера"],
    legend: ["Под мастером", "Перекрёстный ключ", "Резерв или по выбору"],
  },
  ar: {
    title: "مثال على هرم المفتاح الرئيسي",
    caption:
      "مثال على نظام من ثلاثة مستويات: مفتاح رئيسي عام، ومفتاحان رئيسيان للطوابق، والمفاتيح الفردية تحتهما، مع القرارات الثلاثة التي يرى هذا المقال أنها تُتخذ عند التصميم: باب بمفاتيح متقاطعة، وباب خارج أي مفتاح رئيسي، ومجموعة محجوزة للتوسع. الرسم توضيحي فقط؛ الهرم الحقيقي يُصمَّم على المنصة التي ستُقطع عليها المفاتيح.",
    ggmk: ["المفتاح الرئيسي الأعلى (GGMK)", "لعدة أنظمة فقط؛ وغالبًا لا يُصدر"],
    gmk: ["المفتاح الرئيسي العام (GMK)", "يفتح كل أبواب هذا النظام"],
    mk: (n) => [`المفتاح الرئيسي (MK) · الطابق ${n}`, `يفتح كل أبواب الطابق ${n}`],
    reserved: ["مجموعة محجوزة", "غير مُصدرة، للتوسع"],
    door: "مفتاح فردي",
    cross: ["قاعة الاجتماعات", "مفاتيح متقاطعة"],
    noMaster: ["غرفة الخوادم", "خارج أي مفتاح رئيسي"],
    legend: ["ضمن المفتاح الرئيسي", "مفاتيح متقاطعة", "محجوز أو اختياري"],
  },
};

export function hasMasterKeyFigure(locale: Locale): boolean {
  return Boolean(LABELS[locale]);
}

type Box = { cx: number; y: number; w: number; h: number; lines: [string, string]; dashed?: boolean; strong?: boolean };

/** Shrinks a label that would overrun its box (width estimated per script, not measured). */
function fit(text: string, size: number, width: number): number {
  const em = [...text].reduce((sum, ch) => sum + (/[\u3000-\u9fff\uac00-\ud7af\uff00-\uffef]/.test(ch) ? 1 : 0.5), 0);
  return Math.min(size, Math.floor(((width - 8) / em) * 10) / 10);
}

function Node({ cx, y, w, h, lines, dashed, strong }: Box) {
  return (
    <g>
      <rect
        x={cx - w / 2}
        y={y}
        width={w}
        height={h}
        rx={2}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={strong ? 1.5 : 1}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={cx} y={y + h / 2 - 4} textAnchor="middle" fontSize={fit(lines[0], 13, w)} fontWeight={600} fill="var(--color-ink)">
        {lines[0]}
      </text>
      <text x={cx} y={y + h / 2 + 13} textAnchor="middle" fontSize={fit(lines[1], 11.5, w)} fill="var(--color-ink-secondary)">
        {lines[1]}
      </text>
    </g>
  );
}

/** Orthogonal connector from the bottom of one box to the top of another. */
function Link({ x1, y1, x2, y2, dashed }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  const mid = (y1 + y2) / 2;
  return (
    <path
      d={`M${x1} ${y1} V${mid} H${x2} V${y2}`}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth={1}
      strokeDasharray={dashed ? "5 4" : undefined}
    />
  );
}

export function MasterKeyHierarchyFigure({ locale }: { locale: Locale }) {
  const t = LABELS[locale];
  if (!t) return null;

  const ggmk: Box = { cx: 400, y: 16, w: 300, h: 48, lines: t.ggmk, dashed: true };
  const gmk: Box = { cx: 400, y: 104, w: 300, h: 48, lines: t.gmk, strong: true };
  const mk1: Box = { cx: 150, y: 196, w: 240, h: 48, lines: t.mk(1) };
  const mk2: Box = { cx: 476, y: 196, w: 240, h: 48, lines: t.mk(2) };
  const reserved: Box = { cx: 708, y: 196, w: 176, h: 48, lines: t.reserved, dashed: true };
  const doorY = 292;
  const door = (cx: number, room: string): Box => ({ cx, y: doorY, w: 84, h: 48, lines: [room, t.door] });
  const floor1 = [door(46, "101"), door(134, "102"), door(222, "103")];
  const meeting: Box = { cx: 326, y: doorY, w: 116, h: 48, lines: t.cross };
  const floor2 = [door(432, "201"), door(520, "202")];
  const server: Box = { cx: 708, y: doorY, w: 176, h: 48, lines: t.noMaster, strong: true };
  const bottom = (b: Box) => b.y + b.h;

  return (
    <figure className="my-48 max-w-full min-w-0">
      <div className="overflow-x-auto border border-line bg-surface">
        <svg
          viewBox="0 0 800 400"
          role="img"
          direction="ltr"
          aria-labelledby="mk-figure-title"
          className="block h-auto w-full min-w-[720px]"
        >
          <title id="mk-figure-title">{t.title}</title>
          <Link x1={ggmk.cx} y1={bottom(ggmk)} x2={gmk.cx} y2={gmk.y} dashed />
          <Link x1={gmk.cx} y1={bottom(gmk)} x2={mk1.cx} y2={mk1.y} />
          <Link x1={gmk.cx} y1={bottom(gmk)} x2={mk2.cx} y2={mk2.y} />
          <Link x1={gmk.cx} y1={bottom(gmk)} x2={reserved.cx} y2={reserved.y} dashed />
          {floor1.map((d) => (
            <Link key={d.lines[0]} x1={mk1.cx} y1={bottom(mk1)} x2={d.cx} y2={d.y} />
          ))}
          {floor2.map((d) => (
            <Link key={d.lines[0]} x1={mk2.cx} y1={bottom(mk2)} x2={d.cx} y2={d.y} />
          ))}
          <Link x1={mk1.cx + 40} y1={bottom(mk1)} x2={meeting.cx - 12} y2={meeting.y} dashed />
          <Link x1={mk2.cx - 40} y1={bottom(mk2)} x2={meeting.cx + 12} y2={meeting.y} dashed />
          {[ggmk, gmk, mk1, mk2, reserved, ...floor1, meeting, ...floor2, server].map((b) => (
            <Node key={`${b.cx}-${b.y}`} {...b} />
          ))}
          <g fontSize={12} fill="var(--color-ink-secondary)">
            <line x1={24} y1={378} x2={56} y2={378} stroke="var(--color-ink)" />
            <text x={64} y={382}>{t.legend[0]}</text>
            <line x1={220} y1={378} x2={252} y2={378} stroke="var(--color-ink)" strokeDasharray="5 4" />
            <text x={260} y={382}>{t.legend[1]}</text>
            <rect x={430} y={370} width={32} height={16} fill="none" stroke="var(--color-ink)" strokeDasharray="5 4" />
            <text x={470} y={382}>{t.legend[2]}</text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-12 text-c2 text-ink-secondary">{t.caption}</figcaption>
    </figure>
  );
}
