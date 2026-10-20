import { ArrowDown } from "lucide-react";
import { wedding, type WeddingEvent } from "../config/wedding";
import { numericDateParts } from "../utils/invitation";
import {
  DoubleHappiness,
  LongPhungDecoration,
  Ornament,
} from "./LongPhungDecoration";
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
      <Reveal>
        <p className="eyebrow hero-eyebrow">HỶ SỰ · NGÀY MÌNH CHUNG ĐÔI</p>
        <div className="hero-names">
          <h1>
            <span>{wedding.groomName}</span>
            <span className="sr-only"> và </span>
            <span>{wedding.brideName}</span>
          </h1>
          <DoubleHappiness />
        </div>
        <p className="hero-date">
          {date.day} <span>·</span> {date.month} <span>·</span> {date.year}
        </p>
        <div className="hero-visual">
          <LongPhungDecoration />
          <div className="hero-image-frame">
            <img
              src={wedding.heroImage}
              alt={wedding.galleryImages[1].alt}
              width="1200"
              height="800"
              fetchPriority="high"
            />
            <div className="image-shade" />
            <p className="image-caption">{wedding.copy.heroQuote}</p>
          </div>
          <span className="frame-foot" aria-hidden="true">
            百 年 好 合
          </span>
        </div>
        <Ornament />
        <div className="guest-greeting">
          <span className="eyebrow">{wedding.copy.invitation}</span>
          <strong>{guest}</strong>
          <p>{wedding.copy.invitationText}</p>
        </div>
        <a className="scroll-hint" href="#le-cuoi">
          Cùng mở câu chuyện của chúng mình <ArrowDown size={16} />
        </a>
      </Reveal>
    </section>
  );
}
