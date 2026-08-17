export interface AutoplayState {
  isHovered: boolean;
  isFocused: boolean;
  isDocumentHidden: boolean;
  reducedMotion: boolean;
}

export function getNextSlideIndex(
  currentIndex: number,
  slideCount: number,
  delta: number,
) {
  if (slideCount <= 0) return 0;

  return (currentIndex + delta + slideCount) % slideCount;
}

export function shouldAutoplay(state: AutoplayState) {
  return !(
    state.isHovered ||
    state.isFocused ||
    state.isDocumentHidden ||
    state.reducedMotion
  );
}
