import assert from "node:assert/strict";
import test from "node:test";

import { getNextSlideIndex, shouldAutoplay } from "./carousel.ts";

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
    }),
    true,
  );

  for (const pausedState of [
    { isHovered: true },
    { isFocused: true },
    { isDocumentHidden: true },
    { reducedMotion: true },
  ]) {
    assert.equal(
      shouldAutoplay({
        isHovered: false,
        isFocused: false,
        isDocumentHidden: false,
        reducedMotion: false,
        ...pausedState,
      }),
      false,
    );
  }
});
