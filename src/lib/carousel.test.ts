import assert from "node:assert/strict";
import test from "node:test";

import {
  getNextSlideIndex,
  getRenderedSlideIndexes,
  shouldConserveBandwidth,
  shouldAutoplay,
} from "./carousel.ts";

test("getNextSlideIndex wraps in both directions", () => {
  assert.equal(getNextSlideIndex(2, 3, 1), 0);
  assert.equal(getNextSlideIndex(0, 3, -1), 2);
});

test("shouldAutoplay pauses for every interruption condition", () => {
  assert.equal(
    shouldAutoplay({
      isHovered: false,
      isFocused: false,
      isDocumentHidden: false,
      reducedMotion: false,
      conserveData: false,
    }),
    true,
  );

  for (const pausedState of [
    { isHovered: true },
    { isFocused: true },
    { isDocumentHidden: true },
    { reducedMotion: true },
    { conserveData: true },
  ]) {
    assert.equal(
      shouldAutoplay({
        isHovered: false,
        isFocused: false,
        isDocumentHidden: false,
        reducedMotion: false,
        conserveData: false,
        ...pausedState,
      }),
      false,
    );
  }
});

test("speculative carousel loading respects data saver and 2G connections", () => {
  assert.equal(shouldConserveBandwidth(undefined), false);
  assert.equal(shouldConserveBandwidth({ effectiveType: "4g" }), false);
  assert.equal(shouldConserveBandwidth({ saveData: true }), true);
  assert.equal(shouldConserveBandwidth({ effectiveType: "2g" }), true);
  assert.equal(shouldConserveBandwidth({ effectiveType: "slow-2g" }), true);
});

test("getRenderedSlideIndexes initially exposes only the active slide", () => {
  assert.deepEqual(
    getRenderedSlideIndexes({
      activeIndex: 0,
      stagedIndex: null,
      leavingIndex: null,
      slideCount: 3,
    }),
    [0],
  );
});

test("getRenderedSlideIndexes keeps exactly the two crossfade frames", () => {
  assert.deepEqual(
    getRenderedSlideIndexes({
      activeIndex: 0,
      stagedIndex: 1,
      leavingIndex: null,
      slideCount: 3,
    }),
    [0, 1],
  );
  assert.deepEqual(
    getRenderedSlideIndexes({
      activeIndex: 1,
      stagedIndex: null,
      leavingIndex: 0,
      slideCount: 3,
    }),
    [0, 1],
  );
});

test("getRenderedSlideIndexes deduplicates and rejects invalid frames", () => {
  assert.deepEqual(
    getRenderedSlideIndexes({
      activeIndex: 0,
      stagedIndex: 0,
      leavingIndex: 4,
      slideCount: 1,
    }),
    [0],
  );
  assert.deepEqual(
    getRenderedSlideIndexes({
      activeIndex: 0,
      stagedIndex: null,
      leavingIndex: null,
      slideCount: 0,
    }),
    [],
  );
});
