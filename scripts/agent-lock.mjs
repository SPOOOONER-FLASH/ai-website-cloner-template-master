/**
 * A working-tree lock for the two agents that share this repository.
 *
 * ---------------------------------------------------------------------------
 * The problem this solves
 *
 * Claude and Codex do not work on separate branches — they take turns editing one
 * working tree. So git never reports a conflict, and the failure mode is not a merge
 * that needs resolving but a *silent overwrite*: one side sets promo.delaySeconds to 10
 * because the client asked for 10, the other sets it to 20 while restyling the promo
 * rail, and nothing anywhere says so. That happened twice before this file existed.
 *
 * The second failure mode is a race on .git/index.lock when both sides commit at once.
 *
 * So: claim the tree before working, release it when done, and refuse to commit while
 * the other side holds it.
 *
 * ---------------------------------------------------------------------------
 * Why the lock is NOT committed
 *
 * Both agents run on the same machine against the same checkout, so a local file is
 * already visible to both. Committing it would mean every claim and release is itself a
 * commit-and-push — the lock would need a lock. It is gitignored on purpose. If the two
 * ever move to separate machines this stops working and needs replacing with something
 * that goes through the remote.
 *
 *   node scripts/agent-lock.mjs status            # who holds it, and for how long
 *   node scripts/agent-lock.mjs claim claude      # take it (fails if held by another)
 *   node scripts/agent-lock.mjs claim codex --force
 *   node scripts/agent-lock.mjs release           # hand it back, leaves a note
 *   node scripts/agent-lock.mjs check             # exit 1 if another agent holds it
 */
import { existsSync, readFileSync, writeFileSync, unlinkSync } from "node:fs";

const LOCK = ".agent-lock.json";
const AGENTS = ["claude", "codex", "human"];

/**
 * A forgotten release would block the other side forever, so a claim goes stale. Two
 * hours is longer than any single stretch of work here and short enough that a crashed
 * session does not cost a day.
 */
const STALE_MINUTES = 120;

const [, , cmd, ...rest] = process.argv;
const force = rest.includes("--force");
const who = rest.find((a) => !a.startsWith("--"));

const now = () => Date.now();
const mins = (ms) => Math.round(ms / 60000);

function read() {
  if (!existsSync(LOCK)) return null;
  try {
    return JSON.parse(readFileSync(LOCK, "utf8"));
  } catch {
    return null;
  }
}

function isStale(lock) {
  return now() - lock.claimedAt > STALE_MINUTES * 60000;
}

function describe(lock) {
  const held = mins(now() - lock.claimedAt);
  const stale = isStale(lock) ? "  ⚠ STALE" : "";
  return `${lock.agent} — held ${held} min${stale}${lock.task ? `\n  task: ${lock.task}` : ""}`;
}

function status() {
  const lock = read();
  if (!lock) {
    console.log("FREE — nobody is working. Safe to claim and commit.");
    const note = readNote();
    if (note) console.log(`\nlast handoff: ${note}`);
    return 0;
  }
  console.log(`HELD by ${describe(lock)}`);
  if (isStale(lock)) {
    console.log(`\nThe claim is older than ${STALE_MINUTES} minutes. If that agent is`);
    console.log("finished or crashed, take it with:  node scripts/agent-lock.mjs claim <you> --force");
  }
  return 0;
}

const NOTE = ".agent-lock.note";
const readNote = () => (existsSync(NOTE) ? readFileSync(NOTE, "utf8").trim() : "");

function claim() {
  if (!who || !AGENTS.includes(who)) {
    console.error(`usage: claim <${AGENTS.join("|")}> [--task "..."] [--force]`);
    return 2;
  }
  const lock = read();
  if (lock && lock.agent !== who && !isStale(lock) && !force) {
    console.error(`REFUSED — ${describe(lock)}`);
    console.error("\nWait for them to release, or --force if you know they have stopped.");
    return 1;
  }
  if (lock && lock.agent !== who && (isStale(lock) || force)) {
    console.log(`taking over from ${lock.agent} (${isStale(lock) ? "stale" : "forced"})`);
  }
  const taskIdx = rest.indexOf("--task");
  const task = taskIdx >= 0 ? rest[taskIdx + 1] : "";
  writeFileSync(LOCK, `${JSON.stringify({ agent: who, claimedAt: now(), task }, null, 2)}\n`);
  console.log(`CLAIMED by ${who}${task ? ` — ${task}` : ""}`);
  return 0;
}

function release() {
  const lock = read();
  if (!lock) {
    console.log("already free");
    return 0;
  }
  unlinkSync(LOCK);
  const other = lock.agent === "claude" ? "codex" : "claude";
  const stamp = new Date(now()).toISOString().replace("T", " ").slice(0, 16);
  const note = `${lock.agent} finished at ${stamp}${lock.task ? ` — ${lock.task}` : ""}. ${other} may start.`;
  writeFileSync(NOTE, `${note}\n`);
  console.log(`RELEASED by ${lock.agent}`);
  console.log(`\n>>> ${other}: the tree is free. Commit your work, then claim it.`);
  return 0;
}

/** Used by the pre-commit hook. Silent when the commit is allowed. */
function check() {
  const lock = read();
  if (!lock) return 0;                       // nobody claimed; allow, the hook warns
  const self = process.env.AGENT_NAME;
  if (self && lock.agent === self) return 0; // own claim
  if (isStale(lock)) return 0;               // abandoned
  console.error(`\n  BLOCKED — ${describe(lock)}`);
  console.error("\n  Another agent is mid-task in this working tree. Committing now can");
  console.error("  bury their unfinished edits inside your commit.");
  console.error("\n  If they have actually stopped:");
  console.error("    node scripts/agent-lock.mjs claim <you> --force");
  console.error("  Then commit again.\n");
  return 1;
}

const table = { status, claim, release, check };
if (!cmd || !table[cmd]) {
  console.error(`usage: node scripts/agent-lock.mjs <${Object.keys(table).join("|")}>`);
  process.exit(2);
}
process.exit(table[cmd]());
