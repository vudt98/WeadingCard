export function coverflowCard(index: number, active: number, count: number) {
  let offset = index - active;
  if (offset > count / 2) offset -= count;
  else if (offset < -count / 2) offset += count;
  const distance = Math.abs(offset);
  const compact = count >= 3 && count <= 6;
  const hidden = distance > (compact ? 1 : 2);
  return {
    offset,
    transform: `translateX(${(compact ? 55 : 60) * offset}%) translateZ(${-(compact ? 110 : 150) * distance}px) rotateY(${(compact ? 28 : 45) * offset}deg) scale(${Math.max(0.7, 1 - 0.15 * distance)})`,
    opacity: compact && hidden ? 0 : Math.max(0.3, 1 - 0.25 * distance),
    zIndex: 100 - distance,
    hidden,
  };
}
