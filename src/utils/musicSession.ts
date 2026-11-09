export type MusicTrack = "background" | "album";
export type MusicError = "blocked" | "failed" | "album" | null;
export interface MusicState { track: MusicTrack; playing: boolean; error: MusicError }
export interface MusicAudio extends EventTarget {
  paused: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  play(): Promise<void>;
  pause(): void;
}
interface MusicConfig {
  volume: number;
  autoPlayAfterOpen: boolean;
  openingFadeInMs?: number;
  albumFadeInMs?: number;
  backgroundFadeInMs?: number;
}
const tracks = ["background", "album"] as const;
const otherTrack = (track: MusicTrack): MusicTrack => track === "album" ? "background" : "album";

/** Keep playback positions and cancel/reverse fades from the actual current gains. */
export class MusicSession {
  private track: MusicTrack = "background";
  private wanted: boolean;
  private opened = false;
  private albumVisible = false;
  private pending = false;
  private fading = false;
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private revision = 0;
  private error: MusicError = null;
  private lastState: MusicState | null = null;
  private ready: Record<MusicTrack, boolean> = { background: false, album: false };
  private listeners: (() => void)[] = [];

  constructor(
    private audio: Record<MusicTrack, MusicAudio>,
    private config: MusicConfig,
    private update: (state: MusicState) => void,
  ) {
    this.wanted = config.autoPlayAfterOpen;
    for (const track of tracks) {
      const element = audio[track];
      const playing = () => {
        this.ready[track] = true;
        if (!this.opened) return;
        if (!this.canPlay(track)) element.pause();
        else this.publish();
      };
      const pause = () => { this.ready[track] = false; if (!this.disposed) this.publish(); };
      const error = () => {
        if (this.opened && this.track === track && !this.disposed) this.fail(track, this.revision, null);
      };
      element.addEventListener("playing", playing);
      element.addEventListener("pause", pause);
      element.addEventListener("error", error);
      this.listeners.push(() => {
        element.removeEventListener("playing", playing);
        element.removeEventListener("pause", pause);
        element.removeEventListener("error", error);
      });
    }
  }

  private audible(track: MusicTrack) {
    const element = this.audio[track];
    return !element.paused && !element.muted && element.volume > 0;
  }

  private canPlay(track: MusicTrack) {
    return !this.disposed && this.wanted && (this.track === track || ((this.pending || this.fading) && this.audible(track)));
  }

  private publish() {
    if (this.disposed) return;
    const next = { track: this.track, playing: this.opened && this.wanted && tracks.some(track => this.audible(track)), error: this.error };
    if (this.lastState?.track === next.track && this.lastState.playing === next.playing && this.lastState.error === next.error) return;
    this.lastState = next;
    this.update(next);
  }

  private cancelFade() {
    if (this.fadeTimer !== null) clearTimeout(this.fadeTimer);
    this.fadeTimer = null;
    this.fading = false;
  }

  private fadeTo(track: MusicTrack, request: number, fadeInMs?: number) {
    const incoming = this.audio[track], outgoing = this.audio[otherTrack(track)];
    const fromIncoming = incoming.volume;
    const fromOutgoing = outgoing.paused || outgoing.muted ? 0 : outgoing.volume;
    const duration = Math.max(0, fadeInMs ?? (track === "album" ? this.config.albumFadeInMs ?? 1200 : this.config.backgroundFadeInMs ?? 1500));
    const started = Date.now();
    this.fading = true;
    const step = () => {
      if (this.disposed || !this.wanted || request !== this.revision) return;
      const progress = duration === 0 || (fromIncoming === this.config.volume && fromOutgoing === 0) ? 1 : Math.min(1, (Date.now() - started) / duration);
      const eased = progress * progress * (3 - 2 * progress);
      incoming.volume = fromIncoming + (this.config.volume - fromIncoming) * eased;
      outgoing.volume = fromOutgoing * (1 - eased);
      if (progress === 1) {
        outgoing.volume = 0;
        outgoing.pause();
        this.fadeTimer = null;
        this.fading = false;
      } else {
        this.fadeTimer = setTimeout(step, 16);
      }
      this.publish();
    };
    step();
  }

  prepareForOpening() {
    // Start within the opening button's user gesture, while the doors move.
    this.open();
  }

  open() {
    if (this.disposed || this.opened) return;
    this.opened = true;
    if (this.wanted) {
      this.audio.background.currentTime = 0;
      this.audio.background.volume = 0;
      void this.start("background", null, this.config.openingFadeInMs ?? 2500);
    }
  }

  toggle() {
    if (!this.opened || this.disposed) return;
    if (this.wanted && (this.pending || this.fading || tracks.some(track => !this.audio[track].paused))) {
      this.wanted = false;
      this.pending = false;
      this.revision++;
      this.cancelFade();
      this.error = null;
      for (const track of tracks) {
        this.audio[track].volume = 0;
        this.audio[track].pause();
      }
      this.publish();
    } else {
      this.wanted = true;
      void this.start(this.track);
    }
  }

  setAlbumVisible(visible: boolean) {
    if (this.disposed) return;
    this.albumVisible = visible;
    if (visible || this.track !== "album") return;
    const resume = this.wanted && (this.pending || this.fading || tracks.some(track => this.audible(track)));
    if (resume) void this.start("background");
    else {
      this.track = "background";
      this.revision++;
      this.pending = false;
      this.cancelFade();
      this.audio.album.volume = 0;
      this.audio.album.pause();
      this.error = null;
      this.publish();
    }
  }

  albumNavigate() {
    if (this.disposed || !this.opened || !this.albumVisible || !this.wanted) return;
    if (this.track === "album" && (this.pending || this.fading || !this.audio.album.paused)) return;
    void this.start("album");
  }

  private async start(track: MusicTrack, warning: MusicError = null, fadeInMs?: number) {
    if (this.disposed || !this.opened || !this.wanted) return;
    this.cancelFade(); // Leave both gains untouched when reversing a transition.
    this.track = track;
    const request = ++this.revision;
    this.pending = true;
    this.error = warning;
    const current = this.audio[track];
    const wasPaused = current.paused;
    const needsPlay = wasPaused || current.muted || !this.ready[track];
    if (wasPaused) current.volume = fadeInMs !== undefined || this.audible(otherTrack(track)) ? 0 : this.config.volume;
    current.muted = false;
    this.publish();
    try {
      // Retain the outgoing song until the new media has actually started.
      if (needsPlay) await current.play();
      if (this.disposed || request !== this.revision) {
        if (!this.canPlay(track)) current.pause();
        return;
      }
      this.pending = false;
      if (current.paused) { this.fail(track, request, new Error("Playback interrupted")); return; }
      this.fadeTo(track, request, fadeInMs);
    } catch (cause) {
      this.fail(track, request, cause);
    }
  }

  private fail(track: MusicTrack, request: number, cause: unknown) {
    if (this.disposed || request !== this.revision || this.track !== track) return;
    this.revision++;
    this.pending = false;
    this.cancelFade();
    this.audio[track].volume = 0;
    this.audio[track].pause();
    if (track === "album" && this.wanted) {
      void this.start("background", "album");
    } else {
      this.error = cause instanceof Error && cause.name === "NotAllowedError" ? "blocked" : "failed";
      const retained = otherTrack(track);
      if (this.wanted && this.audible(retained)) {
        this.track = retained;
        this.fadeTo(retained, this.revision);
      }
      this.publish();
    }
  }

  dispose() {
    this.disposed = true;
    this.revision++;
    this.cancelFade();
    this.listeners.forEach(remove => remove());
    for (const track of tracks) {
      this.audio[track].volume = 0;
      this.audio[track].pause();
    }
  }
}
