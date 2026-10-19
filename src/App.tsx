import { useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import { ArrowUp, Heart } from "lucide-react";
import { wedding, type WeddingSide } from "./config/wedding";
import { parseInvitation } from "./utils/invitation";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { HeroSection } from "./components/HeroSection";
import { EventDetails } from "./components/EventDetails";
import { PhotoGallery } from "./components/PhotoGallery";
import { MusicPlayer } from "./components/MusicPlayer";
import { InvitationGenerator } from "./components/InvitationGenerator";
import { RSVPForm } from "./components/RSVPForm";
import { Reveal } from "./components/Reveal";

export default function App() {
  const [invitation] = useState(() => parseInvitation(window.location.search));
  const [side, setSide] = useState<WeddingSide>(invitation.side);
  const [opened, setOpened] = useState(false);
  const event = wedding.events[side];
  const [groomInitial, brideInitial] = wedding.monogram
    .split("&")
    .map((value) => value.trim());
  function changeSide(next: WeddingSide) {
    setSide(next);
    const url = new URL(window.location.href);
    url.searchParams.set("ben", next);
    url.searchParams.delete("fbclid");
    window.history.replaceState({}, "", url);
  }
  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && (
          <EnvelopeIntro
            guest={invitation.guest}
            date={event.dateTimeISO}
            onOpen={() => {
              setOpened(true);
              window.setTimeout(
                () => document.getElementById("main-content")?.focus(),
                700,
              );
            }}
          />
        )}
      </AnimatePresence>
      <div inert={!opened}>
        <a className="skip-link" href="#main-content">
          Đến nội dung thiệp
        </a>
        <header className="site-header">
          <a
            href="#loi-moi"
            className="brand"
            aria-label="Trang đầu thiệp cưới"
          >
            {groomInitial}
            <span>&</span>
            {brideInitial}
            <i />
          </a>
          <nav aria-label="Điều hướng chính">
            <a href="#chung-minh">Chúng mình</a>
            <a href="#ngay-chung-doi">Ngày chung đôi</a>
            <a href="#khoanh-khac">Khoảnh khắc</a>
          </nav>
          <a href="#hoi-am" className="header-rsvp">
            Gửi lời hồi âm <Heart size={14} />
          </a>
        </header>
        <main id="main-content" tabIndex={-1}>
          <HeroSection guest={invitation.guest} event={event} />
          <div className="love-ribbon">
            <span>YOU ARE MY TODAY</span>
            <Heart size={16} strokeWidth={1} />
            <span>AND ALL OF MY TOMORROWS</span>
            <Heart size={16} strokeWidth={1} />
            <span>FOREVER STARTS HERE</span>
          </div>
          <section className="couple-section section-shell" id="chung-minh">
            <Reveal>
              <div className="section-heading">
                <span className="eyebrow">TWO SOULS, ONE STORY</span>
                <h2>
                  Chúng mình, <em>từ nay về sau</em>
                </h2>
                <p>Giữa muôn vạn người, thật may vì đã tìm thấy nhau.</p>
              </div>
              <div className="couple-layout">
                <div className="couple-portrait">
                  <img
                    src={wedding.galleryImages[0].src}
                    alt={wedding.galleryImages[0].alt}
                    loading="lazy"
                    width="800"
                    height="1000"
                  />
                  <span>the best is yet to come</span>
                </div>
                <div className="couple-story">
                  <span className="eyebrow">CHÚ RỂ & CÔ DÂU</span>
                  <h3>
                    {wedding.groomName}
                    <i>&</i>
                    {wedding.brideName}
                  </h3>
                  <p>
                    Yêu không phải là tìm được một người hoàn hảo, mà là tìm
                    thấy cả thế giới trong một người bình thường.
                  </p>
                  <p>
                    Chúng mình chọn cùng nhau đi qua những ngày nắng, những ngày
                    mưa, và cả những ngày chẳng có gì đặc biệt. Chỉ cần có nhau,
                    ngày nào cũng là ngày đẹp.
                  </p>
                  <div className="story-signature">
                    {wedding.signature} <Heart size={22} strokeWidth={1} />
                  </div>
                  <small className="demo-note">
                    Câu chuyện minh họa cho bản thiệp mẫu
                  </small>
                </div>
              </div>
            </Reveal>
          </section>
          <section className="story-section section-shell">
            <Reveal>
              <div className="section-heading">
                <span className="eyebrow">THE WAY WE FOUND EACH OTHER</span>
                <h2>
                  Mình đã yêu nhau <em>như thế</em>
                </h2>
              </div>
              <div className="story-timeline">
                {wedding.story.map((item, i) => (
                  <article key={item.year}>
                    <div className="story-year">
                      <span>{item.year}</span>
                      <span className="timeline-dot" />
                    </div>
                    <span className="eyebrow">CHƯƠNG 0{i + 1}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </Reveal>
          </section>
          <EventDetails side={side} onSideChange={changeSide} />
          <PhotoGallery />
          <RSVPForm />
        </main>
        <footer className="site-footer section-shell">
          <a className="footer-monogram" href="#loi-moi">
            {groomInitial} <i>&</i> {brideInitial}
          </a>
          <p>Cảm ơn vì đã là một phần trong câu chuyện của chúng mình.</p>
          <span className="eyebrow">
            WITH LOVE, {wedding.groomName.toLocaleUpperCase("vi")} &{" "}
            {wedding.brideName.toLocaleUpperCase("vi")}
          </span>
          <div className="footer-bottom">
            <span>THIỆP MẪU · 2027 · Ảnh minh họa từ Unsplash</span>
            <a href="#loi-moi" aria-label="Về đầu trang">
              <ArrowUp size={16} /> Về đầu trang
            </a>
          </div>
          <InvitationGenerator />
        </footer>
        {opened && <MusicPlayer />}
      </div>
    </MotionConfig>
  );
}
