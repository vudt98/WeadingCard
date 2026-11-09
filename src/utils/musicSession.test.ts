import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MusicSession, type MusicState } from "./musicSession";

class AudioStub extends EventTarget {
  paused = true;
  muted = false;
  volume = 1;
  currentTime = 0;
  calls = 0;
  nextPlay: (() => Promise<void>) | null = null;
  play() {
    this.calls++;
    const next = this.nextPlay;
    this.nextPlay = null;
    if (next) return next();
    this.begin();
    return Promise.resolve();
  }
  begin() { this.paused = false; this.dispatchEvent(new Event("playing")); }
  pause() {
    if (this.paused) return;
    this.paused = true;
    this.dispatchEvent(new Event("pause"));
  }
}
const tick = async () => { await Promise.resolve(); await Promise.resolve(); };
const blocked = () => Object.assign(new Error("gesture required"), { name: "NotAllowedError" });
function setup(autoPlayAfterOpen = true, crossfade = false, openingFadeInMs = 0) {
  const background = new AudioStub(), album = new AudioStub();
  let state: MusicState = { playing: false, track: "background", error: null };
  const player = new MusicSession({ background, album }, { volume: 0.28, autoPlayAfterOpen, openingFadeInMs, albumFadeInMs: crossfade ? 1200 : 0, backgroundFadeInMs: crossfade ? 1500 : 0 }, next => { state = next; });
  return { player, background, album, state: () => state };
}

describe("album music session", () => {
  it("starts background after opening and never starts Sugar merely on entering", async () => {
    const s = setup();
    s.player.albumNavigate();
    s.player.prepareForOpening();
    expect(s.background.muted).toBe(false);
    expect(s.background.calls).toBe(1);
    s.player.open(); await tick();
    s.player.setAlbumVisible(true);
    expect(s.album.calls).toBe(0);
    expect(s.state()).toMatchObject({ playing: true, track: "background" });
    expect(s.background.volume).toBe(0.28);
  });
  it("switches exclusively and resumes background at its saved position", async () => {
    const s = setup(); s.player.open(); await tick();
    s.background.currentTime = 37;
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect(s.background.paused).toBe(true);
    expect(s.state()).toMatchObject({ playing: true, track: "album" });
    s.album.currentTime = 12;
    s.player.albumNavigate(); s.player.albumNavigate();
    expect(s.album.calls).toBe(1);
    expect(s.album.currentTime).toBe(12);
    s.player.setAlbumVisible(false); await tick();
    expect(s.album.paused).toBe(true);
    expect(s.background.currentTime).toBe(37);
    expect(s.state()).toMatchObject({ playing: true, track: "background" });
    s.player.setAlbumVisible(true);
    expect(s.state().track).toBe("background");
    s.player.albumNavigate(); await tick();
    expect(s.album.currentTime).toBe(12);
  });
  it("respects a manual stop before entering or navigating the album", async () => {
    const s = setup(); s.player.open(); await tick(); s.player.toggle();
    s.player.setAlbumVisible(true); s.player.albumNavigate(); s.player.setAlbumVisible(false);
    expect(s.album.calls).toBe(0);
    expect(s.background.paused).toBe(true);
    expect(s.state().playing).toBe(false);
  });
  it("does not restart either track on exit after the user stops Sugar", async () => {
    const s = setup(); s.player.open(); await tick();
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick(); s.player.toggle();
    s.player.albumNavigate(); expect(s.album.calls).toBe(1);
    s.player.setAlbumVisible(false); await tick();
    expect(s.background.calls).toBe(1);
    expect(s.state()).toMatchObject({ playing: false, track: "background" });
    s.player.toggle(); await tick(); expect(s.background.paused).toBe(false);
  });
  it("allows an explicit music-button resume of Sugar during the same visit", async () => {
    const s = setup(); s.player.open(); await tick();
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    s.album.currentTime = 19;
    s.player.toggle(); s.player.toggle(); await tick();
    expect(s.state()).toMatchObject({ playing: true, track: "album" });
    expect(s.album.currentTime).toBe(19);
  });
  it("lets an album button retry playback after background autoplay is blocked", async () => {
    const s = setup(); s.background.nextPlay = () => Promise.reject(blocked());
    s.player.open(); await tick();
    expect(s.state()).toMatchObject({ playing: false, error: "blocked" });
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect(s.state()).toMatchObject({ playing: true, track: "album", error: null });
  });
  it("falls back to background with an honest warning when Sugar fails", async () => {
    const s = setup(); s.player.open(); await tick(); s.background.currentTime = 24;
    s.album.nextPlay = () => Promise.reject(new Error("missing media"));
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect(s.state()).toEqual({ track: "background", playing: true, error: "album" });
    expect(s.background.currentTime).toBe(24);
    expect(s.album.paused).toBe(true);
  });
  it("does not report success when fallback playback is blocked too", async () => {
    const s = setup(); s.player.open(); await tick();
    s.background.nextPlay = () => Promise.reject(blocked());
    s.album.nextPlay = () => { s.background.pause(); return Promise.reject(new Error("bad media")); };
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick(); await tick();
    expect(s.state()).toMatchObject({ track: "background", playing: false, error: "blocked" });
  });
  it("cancels a pending Sugar play on rapid exit and ignores its late resolution", async () => {
    const s = setup(); s.player.open(); await tick();
    let finish!: () => void;
    s.album.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.album.begin(); resolve(); }; });
    s.player.setAlbumVisible(true); s.player.albumNavigate(); s.player.albumNavigate();
    expect(s.album.calls).toBe(1);
    s.player.setAlbumVisible(false); await tick(); finish(); await tick();
    expect(s.album.paused).toBe(true);
    expect(s.state()).toMatchObject({ track: "background", playing: true, error: null });
  });
  it("does not resurrect music when stopped while Sugar is loading", async () => {
    const s = setup(); s.player.open(); await tick();
    let finish!: () => void;
    s.album.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.album.begin(); resolve(); }; });
    s.player.setAlbumVisible(true); s.player.albumNavigate(); s.player.toggle();
    s.player.setAlbumVisible(false); finish(); await tick();
    expect(s.album.paused && s.background.paused).toBe(true);
    expect(s.state().playing).toBe(false);
  });
  it("does not resume on exit if media playback was externally interrupted", async () => {
    const s = setup(); s.player.open(); await tick();
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    s.album.pause(); s.player.setAlbumVisible(false); await tick();
    expect(s.background.calls).toBe(1);
    expect(s.state().playing).toBe(false);
  });
  it("handles a runtime Sugar media error and ignores errors from inactive tracks", async () => {
    const s = setup(); s.player.open(); await tick();
    s.album.dispatchEvent(new Event("error")); expect(s.state().error).toBe(null);
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    s.album.dispatchEvent(new Event("error")); await tick();
    expect(s.state()).toMatchObject({ track: "background", playing: true, error: "album" });
  });
  it("keeps music off by default when autoplay is disabled", async () => {
    const s = setup(false); s.player.prepareForOpening(); s.player.open();
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect(s.background.calls + s.album.calls).toBe(0);
    s.player.toggle(); await tick(); expect(s.state().playing).toBe(true);
  });
  it("silences late promises after disposal", async () => {
    const s = setup(); let finish!: () => void;
    s.background.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.background.begin(); resolve(); }; });
    s.player.open(); s.player.dispose(); finish(); await tick();
    expect(s.background.paused && s.album.paused).toBe(true);
  });
});

describe("music crossfades", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });
  const enter = async () => {
    const s = setup(true, true); s.player.open(); await tick();
    s.background.currentTime = 37;
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    return s;
  };
  const advance = (ms: number) => vi.advanceTimersByTimeAsync(ms);

  it("starts from silence on the opening gesture and ramps without restarting when doors finish", async () => {
    const s = setup(true, true, 2500);
    s.player.prepareForOpening();
    expect(s.background.calls).toBe(1);
    expect(s.background.paused).toBe(false);
    expect(s.background.muted).toBe(false);
    expect(s.background.volume).toBe(0);
    await tick(); await advance(1250);
    expect(s.background.volume).toBeCloseTo(0.14, 2);
    s.background.currentTime = 1.25;
    const gain = s.background.volume;
    s.player.open(); s.player.prepareForOpening();
    expect(s.background.calls).toBe(1);
    expect(s.background.currentTime).toBe(1.25);
    expect(s.background.volume).toBe(gain);
    await advance(1270);
    expect(s.background.volume).toBe(0.28);
    expect(s.state()).toMatchObject({ playing: true, error: null });
    s.player.dispose();
  });

  it("waits for initial playback readiness before ramping the opening gain", async () => {
    const s = setup(true, true, 2500);
    let finish!: () => void;
    s.background.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.background.begin(); resolve(); }; });
    s.player.prepareForOpening(); await advance(3000);
    expect(s.background.volume).toBe(0);
    expect(s.state().playing).toBe(false);
    finish(); await tick(); await advance(1250);
    expect(s.background.volume).toBeCloseTo(0.14, 2);
    s.player.dispose();
  });

  it("cancels the opening fade on manual stop and never restarts at door completion", async () => {
    const s = setup(true, true, 2500);
    s.player.prepareForOpening(); await tick(); await advance(500);
    s.player.toggle(); s.player.open(); await advance(3000);
    expect(s.background.paused).toBe(true);
    expect(s.background.volume).toBe(0);
    expect(s.background.calls).toBe(1);
    expect(vi.getTimerCount()).toBe(0);
    s.player.dispose();
  });

  it("reports blocked opening playback honestly and allows an explicit retry", async () => {
    const s = setup(true, true, 2500);
    s.background.nextPlay = () => Promise.reject(blocked());
    s.player.prepareForOpening(); await tick(); s.player.open(); await advance(3000);
    expect(s.state()).toMatchObject({ playing: false, error: "blocked" });
    expect(s.background.volume).toBe(0);
    expect(s.background.calls).toBe(1);
    s.player.toggle(); await tick();
    expect(s.state()).toMatchObject({ playing: true, error: null });
    s.player.dispose();
  });

  it("fades Sugar in and background out, pausing only after the gain reaches zero", async () => {
    const s = await enter();
    expect(s.background.volume).toBe(0.28);
    expect(s.album.volume).toBe(0);
    expect(s.background.paused || s.album.paused).toBe(false);
    await advance(600);
    expect(s.background.volume).toBeCloseTo(0.14, 2);
    expect(s.album.volume).toBeCloseTo(0.14, 2);
    expect(s.background.volume + s.album.volume).toBeCloseTo(0.28);
    expect(s.background.paused).toBe(false);
    await advance(616);
    expect(s.background.volume).toBe(0);
    expect(s.background.paused).toBe(true);
    expect(s.album.volume).toBe(0.28);
    expect(s.state()).toMatchObject({ playing: true, track: "album" });
    s.player.dispose();
  });

  it("crossfades back over 1.5s and preserves both playback positions", async () => {
    const s = await enter(); await advance(1216); s.album.currentTime = 21;
    s.player.setAlbumVisible(false); await tick();
    expect(s.background.currentTime).toBe(37);
    expect(s.album.paused).toBe(false);
    await advance(750);
    expect(s.album.volume).toBeCloseTo(0.14, 2);
    expect(s.background.volume).toBeCloseTo(0.14, 2);
    await advance(770);
    expect(s.album.paused).toBe(true);
    expect(s.album.currentTime).toBe(21);
    expect(s.background.volume).toBe(0.28);
    s.player.dispose();
  });

  it("retains background at full gain while Sugar is still loading", async () => {
    const s = setup(true, true); s.player.open(); await tick();
    let finish!: () => void;
    s.album.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.album.begin(); resolve(); }; });
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await advance(5000);
    expect(s.background.paused).toBe(false);
    expect(s.background.volume).toBe(0.28);
    expect(s.state().playing).toBe(true);
    finish(); await tick(); await advance(600);
    expect(s.background.volume).toBeCloseTo(0.14, 2);
    s.player.dispose();
  });

  it("reverses from current gains without jumps when leaving mid-fade", async () => {
    const s = await enter(); await advance(400);
    const before = [s.background.volume, s.album.volume];
    s.player.setAlbumVisible(false); await tick();
    expect([s.background.volume, s.album.volume]).toEqual(before);
    await advance(400);
    expect(s.background.volume).toBeGreaterThan(before[0]);
    expect(s.album.volume).toBeLessThan(before[1]);
    const reverse = [s.background.volume, s.album.volume];
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect([s.background.volume, s.album.volume]).toEqual(reverse);
    await advance(1216);
    expect(s.background.paused).toBe(true);
    expect(s.album.volume).toBe(0.28);
    expect(s.background.calls).toBe(1);
    expect(s.album.calls).toBe(1);
    s.player.dispose();
  });

  it("ignores repeated album arrows without resetting or lengthening the fade", async () => {
    const s = await enter(); s.album.currentTime = 18; await advance(600);
    const gain = s.album.volume;
    s.player.albumNavigate(); s.player.albumNavigate();
    expect(s.album.volume).toBe(gain);
    expect(s.album.currentTime).toBe(18);
    await advance(616);
    expect(s.background.paused).toBe(true);
    expect(s.album.calls).toBe(1);
    s.player.dispose();
  });

  it("stops both tracks immediately during a fade and cancels all later gain changes", async () => {
    const s = await enter(); await advance(500); s.player.toggle();
    expect(s.background.paused && s.album.paused).toBe(true);
    expect(s.background.volume + s.album.volume).toBe(0);
    s.player.setAlbumVisible(false); await advance(5000);
    expect(s.background.volume + s.album.volume).toBe(0);
    expect(s.state().playing).toBe(false);
    s.player.dispose();
  });

  it("keeps the old song uninterrupted if the new song is blocked", async () => {
    const s = setup(true, true); s.player.open(); await tick();
    const calls = s.background.calls;
    s.album.nextPlay = () => Promise.reject(blocked());
    s.player.setAlbumVisible(true); s.player.albumNavigate(); await tick();
    expect(s.background.calls).toBe(calls);
    expect(s.background.paused).toBe(false);
    expect(s.background.volume).toBe(0.28);
    expect(s.state()).toMatchObject({ playing: true, error: "album", track: "background" });
    s.player.dispose();
  });

  it("restores outgoing gain smoothly on a mid-fade Sugar error", async () => {
    const s = await enter(); await advance(500);
    const gain = s.background.volume;
    s.album.dispatchEvent(new Event("error")); await tick();
    expect(s.background.volume).toBe(gain);
    expect(s.album.paused).toBe(true);
    await advance(1520);
    expect(s.background.volume).toBe(0.28);
    expect(s.state()).toMatchObject({ playing: true, error: "album", track: "background" });
    s.player.dispose();
  });

  it("retains Sugar with an error if returning background playback is blocked", async () => {
    const s = await enter(); await advance(1216);
    s.background.nextPlay = () => Promise.reject(blocked());
    s.player.setAlbumVisible(false); await tick();
    expect(s.album.paused).toBe(false);
    expect(s.album.volume).toBe(0.28);
    expect(s.state()).toMatchObject({ playing: true, error: "blocked", track: "album" });
    s.player.dispose();
  });

  it("ignores a late loading result after rapid exit and manual stop", async () => {
    const s = setup(true, true); s.player.open(); await tick();
    let finish!: () => void;
    s.album.nextPlay = () => new Promise<void>(resolve => { finish = () => { s.album.begin(); resolve(); }; });
    s.player.setAlbumVisible(true); s.player.albumNavigate(); s.player.setAlbumVisible(false);
    s.player.toggle(); finish(); await tick(); await advance(3000);
    expect(s.album.paused && s.background.paused).toBe(true);
    expect(s.background.volume + s.album.volume).toBe(0);
    s.player.dispose();
  });

  it("does not fade until a reversed target has really finished starting", async () => {
    const s = await enter(); await advance(1216);
    let finish!: () => void;
    s.background.nextPlay = () => {
      s.background.paused = false; // Native play() clears paused before it is ready.
      return new Promise<void>(resolve => { finish = () => { s.background.begin(); resolve(); }; });
    };
    s.player.setAlbumVisible(false); await advance(2000);
    expect(s.album.volume).toBe(0.28);
    expect(s.album.paused).toBe(false);
    finish(); await tick(); await advance(1520);
    expect(s.album.paused).toBe(true);
    s.player.dispose();
  });

  it("cleans up an active fade and leaves no scheduled audio changes", async () => {
    const s = await enter(); await advance(200); s.player.dispose();
    expect(vi.getTimerCount()).toBe(0);
    await advance(5000);
    expect(s.background.volume + s.album.volume).toBe(0);
    expect(s.background.paused && s.album.paused).toBe(true);
  });
});
