import assert from "node:assert/strict";
import test from "node:test";
import { ROLL_MS, STAGGER_MS, rollFrame, type Rollable } from "./fact-roll.ts";

/*
  The roll on the homepage figures strip, asserted without a browser.

  This exists because the roll is the one thing about that strip a built-HTML check can
  never see. The export always contains the true value — 361, not 0 — and that is
  deliberate: an answer engine reading the static page must read the real number, so the
  animation is something that happens to a figure already on screen rather than the way it
  arrives. The consequence is that every intermediate frame lives only in a browser, and
  the browser is exactly what the export tests do not have.

  It also exists because the first version of this animation shipped a real defect. The
  figures were held at `opacity-0` until an IntersectionObserver revealed them, and
  measuring the page found opacity stuck at 0 with the strip scrolled fully into view: an
  observer delivers nothing in a hidden document. The failure mode of a reveal is
  invisible content, and the content here is the six numbers this site most wants quoted.
  So the reveal was removed, and what remains is arithmetic — which can be tested.
*/

type Fact = Rollable & { value: string; label: string };

const FIXTURE: Fact[] = [
  { value: "361", label: "models", countTo: 361 },
  { value: "15", label: "families", countTo: 15 },
  { value: "1998", label: "since" },
  { value: "ISO 9001", label: "quality" },
  { value: "101–200", label: "people" },
];

/** The last figure finishes last; everything is over by then. */
const TOTAL_MS = ROLL_MS + STAGGER_MS * FIXTURE.length;

test("only facts that declare countTo are ever rolled", () => {
  const { values } = rollFrame(FIXTURE, 300);
  assert.deepEqual(Object.keys(values).sort(), ["0", "1"]);
  /*
    Indices 2, 3 and 4 are a year, a standard name and a range. The component renders
    fact.value for anything absent here, so their absence IS the guarantee that "1998"
    never counts up from nothing.
  */
});

test("the roll starts at zero and ends exactly on the published figures", () => {
  const first = rollFrame(FIXTURE, 0);
  assert.equal(first.values[0], 0);
  assert.equal(first.values[1], 0);
  assert.equal(first.done, false, "a roll that is done at t=0 never animates");

  const last = rollFrame(FIXTURE, TOTAL_MS);
  assert.equal(last.values[0], 361, "must land on the real model count, not near it");
  assert.equal(last.values[1], 15);
  assert.equal(last.done, true);
});

test("no figure ever overshoots or goes backwards", () => {
  let previous = rollFrame(FIXTURE, 0).values;
  for (let elapsed = 16; elapsed <= TOTAL_MS + 500; elapsed += 16) {
    const { values } = rollFrame(FIXTURE, elapsed);
    for (const [index, value] of Object.entries(values)) {
      const target = FIXTURE[Number(index)].countTo!;
      assert.ok(
        value <= target,
        `figure ${index} reached ${value}, past its real value of ${target}`,
      );
      assert.ok(
        value >= previous[Number(index)],
        `figure ${index} went backwards: ${previous[Number(index)]} → ${value}`,
      );
    }
    previous = values;
  }
});

test("figures start in reading order, left to right", () => {
  /*
    Sampled just after the second figure has begun. With a stagger the left figure must be
    strictly further along in relative terms; without one they move as a block, which
    reads as a glitch rather than a sequence.
  */
  const { values } = rollFrame(FIXTURE, STAGGER_MS + 120);
  const firstProgress = values[0] / FIXTURE[0].countTo!;
  const secondProgress = values[1] / FIXTURE[1].countTo!;
  assert.ok(
    firstProgress > secondProgress,
    `the left figure should lead: ${firstProgress.toFixed(3)} vs ${secondProgress.toFixed(3)}`,
  );
});

test("it stays finished once finished, however late the frame arrives", () => {
  /* A backgrounded tab can deliver a frame seconds late; that must not restart anything. */
  const late = rollFrame(FIXTURE, TOTAL_MS * 40);
  assert.equal(late.done, true);
  assert.equal(late.values[0], 361);
});

test("a strip with nothing countable reports done immediately", () => {
  const noCounts = FIXTURE.filter((fact) => fact.countTo === undefined);
  const { values, done } = rollFrame(noCounts, 0);
  assert.deepEqual(values, {});
  assert.equal(done, true, "otherwise the component would spin rAF forever with nothing to do");
});
