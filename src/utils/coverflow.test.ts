import { describe, expect, it } from "vitest";
import { coverflowCard } from "./coverflow";

describe("coverflow geometry", () => {
  it("balances a six-photo album with only the active photo and its two neighbors visible", () => {
    for (let active = 0; active < 6; active++) {
      const cards = Array.from({ length: 6 }, (_, index) => coverflowCard(index, active, 6));
      expect(cards.filter(card => !card.hidden).map(card => card.offset).sort()).toEqual([-1, 0, 1]);
      expect(cards.filter(card => card.hidden).every(card => card.opacity === 0)).toBe(true);
      expect(coverflowCard((active + 1) % 6, active, 6).transform).toBe("translateX(55%) translateZ(-110px) rotateY(28deg) scale(0.85)");
    }
    expect(coverflowCard(5, 0, 6).offset).toBe(-1);
    expect(coverflowCard(0, 5, 6).offset).toBe(1);
  });
  it("keeps the selected photo front and center", () => {
    expect(coverflowCard(4, 4, 9)).toMatchObject({ offset: 0, opacity: 1, zIndex: 100, hidden: false });
    expect(coverflowCard(4, 4, 9).transform).toBe("translateX(0%) translateZ(0px) rotateY(0deg) scale(1)");
  });
  it("places neighbors at source depth, angle and scale", () => {
    expect(coverflowCard(3, 4, 9).transform).toBe("translateX(-60%) translateZ(-150px) rotateY(-45deg) scale(0.85)");
    expect(coverflowCard(6, 4, 9).transform).toBe("translateX(120%) translateZ(-300px) rotateY(90deg) scale(0.7)");
  });
  it("wraps smoothly across the first/last photo", () => {
    expect(coverflowCard(8, 0, 9).offset).toBe(-1);
    expect(coverflowCard(0, 8, 9).offset).toBe(1);
    expect(coverflowCard(0, 7, 9).offset).toBe(2);
  });
  it("excludes distant cards from pointer and accessibility interaction", () => {
    expect(coverflowCard(3, 0, 9).hidden).toBe(true);
    expect(coverflowCard(2, 0, 9).hidden).toBe(false);
    expect(coverflowCard(0, 0, 1).hidden).toBe(false);
    expect(coverflowCard(1, 0, 2).offset).toBe(1);
  });
});
