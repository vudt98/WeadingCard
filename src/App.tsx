import { useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { ArrowUp } from "lucide-react";
import { wedding, type WeddingSide } from "./config/wedding";
import { parseInvitation } from "./utils/invitation";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { HeroSection } from "./components/HeroSection";
import { CeremonyDetails } from "./components/CeremonyDetails";
import { EventDetails } from "./components/EventDetails";
import { PhotoGallery } from "./components/PhotoGallery";
import { MusicPlayer } from "./components/MusicPlayer";
import { InvitationGenerator } from "./components/InvitationGenerator";
import { RSVPForm } from "./components/RSVPForm";
import {
  DressCode,
  WeddingSchedule,
  Guestbook,
} from "./components/WeddingExtras";
import { WeddingGift } from "./components/WeddingGift";
import { DoubleHappiness, Ornament } from "./components/LongPhungDecoration";

export default function App() {
  const [invitation] = useState(() => parseInvitation(window.location.search));
  const [side, setSide] = useState<WeddingSide>(invitation.side);
  const [opened, setOpened] = useState(false);
  const event = wedding.events[side];
  function changeSide(next: WeddingSide) {
    setSide(next);
    const url = new URL(window.location.href);
    url.searchParams.set("ben", next);
    url.searchParams.delete("fbclid");
    window.history.replaceState({}, "", url);
  }
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence
        onExitComplete={() => document.getElementById("main-content")?.focus()}
      >
        {!opened && (
          <EnvelopeIntro
            guest={invitation.guest}
            date={event.dateTimeISO}
            onOpen={() => setOpened(true)}
          />
        )}
      </AnimatePresence>
      <div inert={!opened} className="invitation-page">
        <a className="skip-link" href="#main-content">
          Đến nội dung thiệp
        </a>
        <header className="site-header">
          <a href="#loi-moi" className="brand" aria-label="Về đầu thiệp">
            {wedding.monogram}
          </a>
          <nav aria-label="Điều hướng thiệp">
            <a href="#le-cuoi">Lễ cưới</a>
            <a href="#khoanh-khac">Album</a>
            <a href="#ngay-chung-doi">Tiệc cưới</a>
          </nav>
          <a href="#hoi-am" className="header-rsvp">
            Hồi âm
          </a>
        </header>
        <main id="main-content" tabIndex={-1}>
          <HeroSection guest={invitation.guest} event={event} />
          <div className="family-choice" role="group" aria-label="Chọn bên mời">
            <button
              aria-pressed={side === "nhatrai"}
              onClick={() => changeSide("nhatrai")}
            >
              Nhà trai
            </button>
            <span aria-hidden="true">✧</span>
            <button
              aria-pressed={side === "nhagai"}
              onClick={() => changeSide("nhagai")}
            >
              Nhà gái
            </button>
          </div>
          <CeremonyDetails side={side} />
          <PhotoGallery />
          <EventDetails side={side} onSideChange={changeSide} />
          <RSVPForm />
          <DressCode />
          <WeddingSchedule event={event} />
          <Guestbook />
          <WeddingGift />
        </main>
        <footer className="site-footer section-shell">
          <Ornament />
          <DoubleHappiness />
          <p className="footer-thanks">{wedding.copy.thankYou}</p>
          <p className="footer-names">
            {wedding.groomName} <i>&</i> {wedding.brideName}
          </p>
          <span className="eyebrow">{wedding.hashtag}</span>
          <div className="footer-bottom">
            {wedding.isDemo && <span>{wedding.copy.demoNote}</span>}
            <a href="#loi-moi">
              <ArrowUp size={14} /> Về đầu thiệp
            </a>
          </div>
          <InvitationGenerator />
        </footer>
        {opened && <MusicPlayer />}
      </div>
    </MotionConfig>
  );
}
