import { describe, expect, it } from "vitest";
import { clampZoom, swipeDirection, wrapPhoto } from "./photoViewer";

describe("photo viewer gestures", () => {
  it("requires a horizontal swipe longer than 50px", () => {
    expect(swipeDirection(-51, 10)).toBe(1);
    expect(swipeDirection(51, 10)).toBe(-1);
    expect(swipeDirection(50, 0)).toBe(0);
    expect(swipeDirection(-50, 0)).toBe(0);
  });
  it("keeps vertical and diagonal drags from changing photos", () => {
    expect(swipeDirection(80, 100)).toBe(0);
    expect(swipeDirection(-80, -100)).toBe(0);
    expect(swipeDirection(80, 80)).toBe(0);
  });
  it("limits pinch zoom to 1–4x and clears pan at 1x", () => {
    expect(clampZoom(0.2, 300, -500, 800, 600)).toEqual({ scale: 1, tx: 0, ty: -0 });
    expect(clampZoom(10, 9999, -9999, 800, 600)).toEqual({ scale: 4, tx: 1200, ty: -900 });
  });
  it("retains valid offsets and bounds them for a smaller viewport", () => {
    expect(clampZoom(2.5, 200, -200, 800, 600)).toEqual({ scale: 2.5, tx: 200, ty: -200 });
    expect(clampZoom(2.5, 900, -900, 320, 400)).toEqual({ scale: 2.5, tx: 240, ty: -300 });
  });
  it("wraps both directions and handles one or zero images", () => {
    expect(wrapPhoto(9, 9)).toBe(0);
    expect(wrapPhoto(-1, 9)).toBe(8);
    expect(wrapPhoto(-10, 9)).toBe(8);
    expect(wrapPhoto(5, 1)).toBe(0);
    expect(wrapPhoto(5, 0)).toBe(0);
  });
  it("bounds pan to the fitted photo rather than the viewport's empty margins", () => {
    expect(clampZoom(2.5, 9999, -9999, 1000, 600, 400, 600)).toEqual({ scale: 2.5, tx: 0, ty: -450 });
    expect(clampZoom(2.5, 9999, -9999, 400, 600, 400, 250)).toEqual({ scale: 2.5, tx: 300, ty: -12.5 });
  });
});
