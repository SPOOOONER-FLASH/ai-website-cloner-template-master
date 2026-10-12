/*
  A door elevation, seen from the escape side, drawn as geometry rather than as a product:
  it says WHERE a panic bar latches (into the frame, or up and down into head and floor) and
  whether the door opens from outside — the three things a Brazilian installer sorts bars by.
  Proportions are schematic; no dimension is implied. Product shape lives in the photographs.
*/
export interface DoorConfig {
  door: "single" | "double";
  /** lateral: one latch into the frame or the other leaf. vertical: rods into head and floor. */
  locking: "lateral" | "vertical";
  /** A lever (and key) on the outside face — drawn dashed, because it is on the other side. */
  trim: boolean;
}

const TOP = 14;
const FLOOR = 156;
const BAR_Y = 96;

function Leaf({ x, w, locking, latchSide, trim }: { x: number; w: number; locking: DoorConfig["locking"]; latchSide: "left" | "right"; trim: boolean }) {
  const latchX = latchSide === "right" ? x + w - 9 : x + 9;
  const hingeX = latchSide === "right" ? x + 6 : x + w - 6;
  const barFrom = Math.min(latchX, hingeX) + 5;
  const barTo = Math.max(latchX, hingeX) - 5;
  return (
    <g>
      <rect x={x} y={TOP} width={w} height={FLOOR - TOP} className="fill-surface stroke-ink" strokeWidth={1.25} />
      {/* hinges */}
      {[TOP + 16, (TOP + FLOOR) / 2, FLOOR - 16].map((y) => (
        <line key={y} x1={hingeX + (latchSide === "right" ? -6 : 6)} x2={hingeX + (latchSide === "right" ? -9 : 9)} y1={y} y2={y} className="stroke-ink" strokeWidth={2} />
      ))}
      {/* push bar between its two housings */}
      <line x1={barFrom} x2={barTo} y1={BAR_Y} y2={BAR_Y} className="stroke-ink" strokeWidth={3.5} strokeLinecap="round" />
      <rect x={latchX - 5} y={BAR_Y - 9} width={10} height={18} className="fill-ink" />
      <rect x={hingeX - 3.5} y={BAR_Y - 7} width={7} height={14} className="fill-ink" />
      {locking === "lateral" ? (
        <rect x={latchSide === "right" ? x + w - 1 : x - 5} y={BAR_Y - 3} width={6} height={6} className="fill-ink" />
      ) : (
        <>
          <line x1={latchX} x2={latchX} y1={TOP + 2} y2={BAR_Y - 9} className="stroke-ink" strokeWidth={1.5} />
          <line x1={latchX} x2={latchX} y1={BAR_Y + 9} y2={FLOOR - 2} className="stroke-ink" strokeWidth={1.5} />
          <rect x={latchX - 3} y={TOP - 5} width={6} height={7} className="fill-ink" />
          <rect x={latchX - 3} y={FLOOR - 2} width={6} height={7} className="fill-ink" />
        </>
      )}
      {trim ? (
        <g className="stroke-ink-secondary" strokeWidth={1.25} strokeDasharray="2.5 2" fill="none">
          <rect x={latchX - 4} y={BAR_Y - 34} width={8} height={18} />
          <line x1={latchX} x2={latchSide === "right" ? latchX - 18 : latchX + 18} y1={BAR_Y - 28} y2={BAR_Y - 28} strokeWidth={2.5} strokeDasharray="3 2" />
          <circle cx={latchX} cy={BAR_Y - 20} r={1.6} />
        </g>
      ) : null}
    </g>
  );
}

export function DoorDiagram({ door, locking, trim, title }: DoorConfig & { title: string }) {
  return (
    <svg viewBox="0 0 200 170" role="img" aria-label={title} className="block h-auto w-full">
      <title>{title}</title>
      {/* frame and floor */}
      <path d={`M ${door === "single" ? 52 : 22} ${FLOOR} V ${TOP - 6} H ${door === "single" ? 148 : 178} V ${FLOOR}`} className="fill-none stroke-ink" strokeWidth={2.5} />
      <line x1={8} x2={192} y1={FLOOR + 6} y2={FLOOR + 6} className="stroke-line" strokeWidth={1} />
      {door === "single" ? (
        <Leaf x={56} w={88} locking={locking} latchSide="right" trim={trim} />
      ) : (
        <>
          {/* the passive leaf always shoots its rods; the active leaf latches the way the config says */}
          <Leaf x={26} w={74} locking="vertical" latchSide="right" trim={false} />
          <Leaf x={100} w={74} locking={locking} latchSide="left" trim={trim} />
        </>
      )}
    </svg>
  );
}
