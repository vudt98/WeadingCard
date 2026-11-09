import { describe, expect, it } from "vitest";
import { advanceScroll } from "./autoScroll";

describe("automatic scrolling", () => {
  it("moves at the same speed on 60Hz and 120Hz displays", () => {
    const run = (fps: number) => Array.from({ length: fps }).reduce<number>(position => advanceScroll(position, 1000 / fps, 60, 1000), 0);
    expect(run(60)).toBeCloseTo(60);
    expect(run(120)).toBeCloseTo(60);
  });
  it("stops at the bottom, including when content shrinks", () => {
    expect(advanceScroll(99, 20, 60, 100)).toBe(100);
    expect(advanceScroll(500, 20, 60, 300)).toBe(300);
    expect(advanceScroll(0, 20, 60, -100)).toBe(0);
  });
  it("caps background-tab gaps and ignores negative time or speed", () => {
    expect(advanceScroll(10, 5000, 60, 1000)).toBeCloseTo(13.84);
    expect(advanceScroll(10, -20, 60, 1000)).toBe(10);
    expect(advanceScroll(10, 20, -60, 1000)).toBe(10);
  });
});
