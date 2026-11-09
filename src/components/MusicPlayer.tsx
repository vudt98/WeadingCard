import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { wedding } from "../config/wedding";
import { MusicSession, type MusicState } from "../utils/musicSession";

export interface MusicPlayerHandle {
  prepareForOpening: () => void;
  setAlbumVisible: (visible: boolean) => void;
  albumNavigate: () => void;
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, { opened: boolean }>(function MusicPlayer({ opened }, handle) {
  const background = useRef<HTMLAudioElement>(null);
  const album = useRef<HTMLAudioElement>(null);
  const session = useRef<MusicSession | null>(null);
  const [state, setState] = useState<MusicState>({ track: "background", playing: false, error: null });
  const config = wedding.musicSettings;

  useEffect(() => {
    if (!background.current || !album.current) return;
    const player = new MusicSession({ background: background.current, album: album.current }, config, setState);
    session.current = player;
    return () => { player.dispose(); session.current = null; };
  }, [config]);

  useImperativeHandle(handle, () => ({
    prepareForOpening: () => session.current?.prepareForOpening(),
    setAlbumVisible: visible => session.current?.setAlbumVisible(visible),
    albumNavigate: () => session.current?.albumNavigate(),
  }), []);

  useEffect(() => { if (opened) session.current?.open(); }, [opened]);

  const error = state.error === "album" ? config.albumErrorMessage : state.error === "blocked" ? config.blockedMessage : state.error ? config.errorMessage : "";
  return <>
    <audio ref={background} data-music-track="background" src={wedding.music} loop preload="auto" />
    <audio ref={album} data-music-track="album" src={wedding.albumMusic} loop preload="none" />
    {opened && <div className="music-player" data-active-track={state.track}>
      <button type="button" data-music-control className={`music-button${state.playing ? " playing" : ""}`}
        onClick={() => session.current?.toggle()} aria-label={state.playing ? config.stopLabel : config.startLabel}
        title={state.playing ? config.stopLabel : config.startLabel} aria-pressed={state.playing} aria-describedby={error ? "music-status" : undefined}>
        <span className="music-disc" aria-hidden="true"><img src={config.icon} alt="" width="30" height="30" draggable={false} /></span>
        {!state.playing && <span className="music-off-mark" aria-hidden="true" />}
      </button>
      {error && <p id="music-status" role="status">{error}</p>}
    </div>}
  </>;
});
