import type { Locale } from "@/data/site";

/*
  The hierarchy chart for /guides/master-key-hierarchy-planning-2026/.

  It draws what the article argues, nothing more: the levels from its table, one
  cross-keyed door (its "expensive favor"), one door kept off every master (its "which
  doors must never be on a master"), and one group reserved for expansion. Every node
  is a role the text names. No platform, pin count or capacity figure appears, because
  the article says plainly that those belong to whoever designs the real system.

  Labels exist for en / es / pt only. Other locales render nothing rather than an English
  chart on a translated page.
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
};

export function hasMasterKeyFigure(locale: Locale): boolean {
  return Boolean(LABELS[locale]);
}

type Box = { cx: number; y: number; w: number; h: number; lines: [string, string]; dashed?: boolean; strong?: boolean };

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
      <text x={cx} y={y + h / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-ink)">
        {lines[0]}
      </text>
      <text x={cx} y={y + h / 2 + 13} textAnchor="middle" fontSize={11.5} fill="var(--color-ink-secondary)">
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
