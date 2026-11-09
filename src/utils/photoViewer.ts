export const identityZoom = { scale: 1, tx: 0, ty: 0 };
export type PhotoZoom = typeof identityZoom;

export function clampZoom(scale: number, tx: number, ty: number, width: number, height: number, imageWidth = width, imageHeight = height): PhotoZoom {
  const boundedScale = Math.max(1, Math.min(4, scale));
  const x = Math.max(0, (imageWidth * boundedScale - width) / 2);
  const y = Math.max(0, (imageHeight * boundedScale - height) / 2);
  return { scale: boundedScale, tx: Math.max(-x, Math.min(x, tx)), ty: Math.max(-y, Math.min(y, ty)) };
}

export function swipeDirection(dx: number, dy: number): number {
  return Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : 0;
}

export function wrapPhoto(index: number, count: number): number {
  return count > 0 ? ((index % count) + count) % count : 0;
}
