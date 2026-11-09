export function advanceScroll(position: number, elapsedMs: number, speed: number, bottom: number) {
  return Math.min(Math.max(0, bottom), position + Math.max(0, speed) * Math.min(64, Math.max(0, elapsedMs)) / 1000);
}
