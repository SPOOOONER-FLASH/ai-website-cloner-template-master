export interface AutoplayState {
  isHovered: boolean;
  isFocused: boolean;
  isDocumentHidden: boolean;
  reducedMotion: boolean;
  conserveData: boolean;
}

export interface BandwidthHint {
  saveData?: boolean;
  effectiveType?: string;
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
    state.reducedMotion ||
    state.conserveData
  );
}

export function shouldConserveBandwidth(connection?: BandwidthHint) {
  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "2g" ||
      connection?.effectiveType === "slow-2g",
  );
}

export function getRenderedSlideIndexes({
  activeIndex,
  stagedIndex,
  leavingIndex,
  slideCount,
}: {
  activeIndex: number;
  stagedIndex: number | null;
  leavingIndex: number | null;
  slideCount: number;
}) {
  if (slideCount <= 0) return [];

  const indexes = [leavingIndex, activeIndex, stagedIndex];
  return indexes.filter(
    (index, position): index is number =>
      index !== null &&
      index >= 0 &&
      index < slideCount &&
      indexes.indexOf(index) === position,
  );
}
