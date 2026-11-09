import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { wedding, type WeddingSide } from "./config/wedding";
import { parseInvitation } from "./utils/invitation";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { MagazineInvitation } from "./components/MagazineInvitation";
import { MusicPlayer, type MusicPlayerHandle } from "./components/MusicPlayer";
import { RevealContext } from "./components/RevealContext";
import { AutoScrollControl } from "./components/AutoScrollControl";
import { InvitationViewportContext } from "./components/InvitationViewportContext";
import { useInvitationReady } from "./hooks/useInvitationReady";
import { AlbumMusicContext } from "./components/AlbumMusicContext";
import { InvitationMotionProvider } from "./components/InvitationMotionProvider";
import { useInvitationMotion } from "./hooks/useInvitationMotion";

export default function App() {
  return <InvitationMotionProvider><Invitation /></InvitationMotionProvider>;
}

function Invitation() {
  const { reduced } = useInvitationMotion();
  const [invitation] = useState(() => parseInvitation(window.location.search));
  const [side, setSide] = useState<WeddingSide>(invitation.side);
  const [opened, setOpened] = useState(false);
  const invitationReady = useInvitationReady();
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const albumMusic = useMemo(() => ({
    setVisible: (visible: boolean) => musicRef.current?.setAlbumVisible(visible),
    navigate: () => musicRef.current?.albumNavigate(),
  }), []);
  const viewport = useMemo(() => ({ scrollRef, cardRef, overlayRef }), []);
  const event = wedding.events[side];
  const startOpening = useCallback(() => {
    musicRef.current?.prepareForOpening();
  }, []);
  const finishOpening = useCallback(() => setOpened(true), []);
  function changeSide(next: WeddingSide) {
    setSide(next);
    const url = new URL(window.location.href);
    url.searchParams.set("ben", next);
    url.searchParams.delete("fbclid");
    window.history.replaceState({}, "", url);
  }
  return (
    <>
      <link rel="stylesheet" href={wedding.crimson.fontStylesheet} precedence="crimson-fonts" />
      <InvitationViewportContext.Provider value={viewport}>
        <div className="crimson-card" ref={cardRef} data-motion={reduced ? "reduced" : "full"}>
          <div inert={!opened} className="crimson-content">
            <div className="invitation-scroll" ref={scrollRef} data-invitation-scroll tabIndex={0}>
              <div className="crimson-page magazine-page">
                <a className="skip-link" href="#main-content">{wedding.ui.skipLink}</a>
                <RevealContext.Provider value={invitationReady}>
                  <AlbumMusicContext.Provider value={albumMusic}>
                    <MagazineInvitation guest={invitation.guest} side={side} onSideChange={changeSide} />
                  </AlbumMusicContext.Provider>
                </RevealContext.Provider>
              </div>
            </div>
            <MusicPlayer ref={musicRef} opened={opened} />
            {opened && <AutoScrollControl />}
            <div className="crimson-overlays" ref={overlayRef} />
          </div>
          <AnimatePresence onExitComplete={() => document.getElementById("main-content")?.focus({ preventScroll: true })}>
            {!opened && <EnvelopeIntro guest={invitation.guest} date={event.dateTimeISO} onOpeningStart={startOpening} onOpen={finishOpening} />}
          </AnimatePresence>
        </div>
      </InvitationViewportContext.Provider>
    </>
  );
}
