import { ArrowDown, ArrowUpRight } from "lucide-react";
import { wedding, type WeddingEvent } from "../config/wedding";
import { formatDate, numericDateParts } from "../utils/invitation";
import { Botanical } from "./Botanical";
import { Reveal } from "./Reveal";

export function HeroSection({
  guest,
  event,
}: {
  guest: string;
  event: WeddingEvent;
}) {
  const date = numericDateParts(event.dateTimeISO);
  return (
    <section className="hero section-shell" id="loi-moi">
      <div className="hero-copy">
        <Reveal>
          <div className="eyebrow hero-eyebrow">
            <span /> WE'RE GETTING MARRIED
          </div>
          <h1>
            {wedding.groomName}
            <i className="hero-amp">&</i>
            <span>{wedding.brideName}</span>
          </h1>
          <p className="hero-tagline">
            Một lời hẹn. <em>Một đời bên nhau.</em>
          </p>
          <div className="guest-greeting">
            <span>TRÂN TRỌNG KÍNH MỜI</span>
            <strong>{guest}</strong>
            <p>
              đến chung vui và cùng viết nên kỷ niệm đẹp nhất
              <br className="desktop-break" /> trong câu chuyện của chúng mình.
            </p>
          </div>
          <a href="#ngay-chung-doi" className="button primary">
            Khám phá lời mời <ArrowUpRight size={17} />
          </a>
          <div className="hero-date">
            <span>{date.day}</span>
            <div>
              <b>
                {date.month} . {date.year}
              </b>
              <small>
                {formatDate(event.dateTimeISO, { weekday: "long" })} · TP. Hồ
                Chí Minh
              </small>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal className="hero-visual">
        <div className="hero-image-frame">
          <img
            src={wedding.heroImage}
            alt="Ảnh minh họa cặp đôi cầm hoa cưới trong ánh nắng"
            width="1000"
            height="1250"
            fetchPriority="high"
          />
          <div className="image-shade" />
          <span className="image-caption">you, me & a little forever.</span>
        </div>
        <Botanical className="hero-leaf" />
        <div className="photo-stamp">
          <HeartMark />
          <span>
            TOGETHER
            <br />
            IS A BEAUTIFUL
            <br />
            PLACE TO BE
          </span>
        </div>
        <span className="vertical-note">
          THE BEGINNING OF OUR FOREVER — 2027
        </span>
      </Reveal>
      <a className="scroll-hint" href="#chung-minh">
        <ArrowDown size={15} /> CUỘN ĐỂ KHÁM PHÁ
      </a>
    </section>
  );
}
function HeartMark() {
  return (
    <svg
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21S1 14 1 7C1 0 10-1 12 6 14-1 23 0 23 7c0 7-11 14-11 14Z"
        stroke="currentColor"
      />
    </svg>
  );
}
