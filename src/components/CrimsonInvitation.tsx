import { CalendarPlus, MapPin } from "lucide-react";
import { wedding, type WeddingSide, type WeddingEvent } from "../config/wedding";
import { calendarUrl, formatDate, numericDateParts } from "../utils/invitation";
import { Countdown } from "./Countdown";
import { WeddingCalendar } from "./WeddingCalendar";
import { PhotoGallery } from "./PhotoGallery";
import { RSVPForm } from "./RSVPForm";
import { DressCode, WeddingSchedule, Guestbook } from "./WeddingExtras";
import { WeddingGift } from "./WeddingGift";
import { InvitationGenerator } from "./InvitationGenerator";
import { Reveal } from "./Reveal";

function DateCard({ title, date, venue, address, lunarDate, mapsUrl }: {
  title: string; date: string; venue: string; address: string; lunarDate?: string; mapsUrl: string;
}) {
  const parts = numericDateParts(date);
  return (
    <article className="crimson-date-card">
      <Reveal><h3>{title}</h3></Reveal>
      <Reveal><p className="crimson-time">{formatDate(date, { hour: "2-digit", minute: "2-digit", hour12: false })}
        <span> · {formatDate(date, { weekday: "long" })}</span></p></Reveal>
      <div className="crimson-date-row">
        <Reveal effect="fadeInLeft"><span>Tháng {parts.month}</span></Reveal>
        <Reveal effect="zoomIn"><strong>{parts.day}</strong></Reveal>
        <Reveal effect="fadeInRight"><span>Năm {parts.year}</span></Reveal>
      </div>
      {lunarDate && <Reveal><p className="crimson-lunar">{lunarDate}</p></Reveal>}
      <Reveal><h4>{venue}</h4></Reveal>
      <Reveal><p className="crimson-address">{address}</p></Reveal>
      <Reveal effect="pulse" duration={1}><a href={mapsUrl} target="_blank" rel="noreferrer" className="crimson-map-link crimson-pulse"><MapPin size={15} /> {wedding.ui.directions}</a></Reveal>
    </article>
  );
}

export function CrimsonInvitation({ guest, side, onSideChange }: {
  guest: string; side: WeddingSide; onSideChange: (side: WeddingSide) => void;
}) {
  const event: WeddingEvent = wedding.events[side];
  const ceremony = wedding.ceremonies[side];
  const countdownDate = wedding.countdown[side].dateTimeISO;
  const calendarDate = wedding.calendar[side].dateTimeISO;
  const copy = wedding.crimson.copy;
  return (
    <>
      <main id="main-content" tabIndex={-1}>
        <section className="crimson-hero" id="loi-moi">
            <Reveal className="crimson-hero-title" effect="fadeInUp" delay={0}><h1>{wedding.groomName} <span>&</span> {wedding.brideName}</h1></Reveal>
            <Reveal className="crimson-announcement-wrap" effect="fadeInUp" delay={0}><p className="crimson-script crimson-announcement">{copy.announcement}</p></Reveal>
            <div className="crimson-triptych">
              {wedding.crimson.heroImages.map((src, index) => <img key={src} src={src} alt={`Ảnh cưới minh họa Crimson Elegance ${index + 1}`} width="600" height="900" fetchPriority={index === 1 ? "high" : "auto"} />)}
            </div>
            <Reveal className="crimson-save-wrap" effect="fadeInLeft" delay={0}><p className="crimson-script crimson-save">{copy.saveTheDate}</p></Reveal>
            <Reveal className="crimson-date-wrap" effect="fadeInRight" delay={0}><p className="crimson-hero-date">{formatDate(event.dateTimeISO, { day: "numeric", month: "numeric", year: "numeric" })}</p></Reveal>
        </section>
        <section className="crimson-countdown-banner" aria-label="Đếm ngược ngày cưới">
          <Reveal className="crimson-banner-photo" effect="fadeIn"><img src={wedding.crimson.countdownImage} alt="Khoảnh khắc cưới minh họa" width="1106" height="737" /></Reveal>
          <div className="crimson-countdown-content">
            <Reveal className="crimson-countdown-tint" effect="fadeIn" />
            <Reveal effect="fadeInUp"><p className="crimson-countdown-quote">{wedding.copy.heroQuote}</p></Reveal>
            <Reveal effect="fadeIn" delay={0}><Countdown date={countdownDate} /></Reveal>
          </div>
        </section>
        <section className="crimson-invitation" id="le-cuoi">
            <Reveal><p className="crimson-invitation-intro">{copy.familyInvitation}</p></Reveal>
            <Reveal effect="fadeIn"><div className="crimson-guest"><span>{wedding.copy.invitation}</span><strong>{guest}</strong></div></Reveal>
            <div className="crimson-families">
              {Object.values(wedding.families).map((family, index) => <article key={family.label}><Reveal effect={index === 0 ? "fadeInLeft" : "fadeInRight"}><h2>{family.label}</h2></Reveal><Reveal effect={index === 0 ? "fadeInLeft" : "fadeInRight"}><p>{family.father}<br />{family.mother}</p></Reveal></article>)}
            </div>
        </section>
        <section className="crimson-events" id="ngay-chung-doi">
          <div className="crimson-side-switch" role="group" aria-label="Chọn bên mời">
            {(["nhatrai", "nhagai"] as const).map(value => <button key={value} onClick={() => onSideChange(value)} aria-pressed={side === value}>{wedding.families[value].label}</button>)}
          </div>
          <DateCard title={copy.receptionTitle} date={event.dateTimeISO} venue={event.venueName} address={event.address} lunarDate={event.lunarDate} mapsUrl={event.mapsUrl} />
          <DateCard title={ceremony.title} date={ceremony.dateTimeISO} venue={ceremony.venue} address={wedding.families[side].address} lunarDate={ceremony.lunarDate} mapsUrl={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(wedding.families[side].address)}`} />
          <div className="crimson-calendar">
            <Reveal className="crimson-calendar-tint" effect="fadeIn" />
            <WeddingCalendar date={calendarDate} heartImage={wedding.crimson.calendarHeart} />
            <a className="text-link" href={calendarUrl({ ...event, dateTimeISO: calendarDate }, `${wedding.groomName} & ${wedding.brideName}`)} target="_blank" rel="noreferrer"><CalendarPlus size={16} /> {wedding.ui.addToCalendar}</a>
          </div>
        </section>
        <section className="crimson-story" aria-labelledby="story-title">
          <Reveal effect="zoomIn"><h2 id="story-title" className="crimson-script">{copy.storyTitle}</h2></Reveal>
          {wedding.crimson.storyImages.map((src, index) => <article key={src} className={`crimson-story-row crimson-story-row-${index}`}>
            <div className="crimson-story-portrait">
              <Reveal className="crimson-story-photo" effect={index === 0 ? "fadeInLeft" : "fadeInRight"}><img src={src} alt={`Ảnh cưới minh họa ${index === 0 ? "chú rể" : "cô dâu"}`} width="600" height="800" loading="lazy" /></Reveal>
              <Reveal><p className="crimson-script crimson-role">{index === 0 ? copy.groomRole : copy.brideRole}</p></Reveal>
              <Reveal><h3>{index === 0 ? wedding.groomName : wedding.brideName}</h3></Reveal>
            </div>
            <Reveal className="crimson-story-text" effect={index === 0 ? "fadeInUp" : "fadeInRight"}><p className="crimson-story-copy">{wedding.story[index].text}</p></Reveal>
          </article>)}
        </section>
        <PhotoGallery />
        <RSVPForm guest={guest} side={side} />
        <WeddingGift />
        {wedding.crimson.sections.showGuestbook && <Guestbook />}
        {wedding.crimson.sections.showExtraDetails && <details className="crimson-extras"><summary>{copy.extraDetails}</summary><DressCode /><WeddingSchedule event={event} /></details>}
      </main>
      <footer className="crimson-footer">
        <Reveal className="crimson-footer-photo" effect="fadeIn" duration={1}><img src={wedding.crimson.footerImage} alt="Ảnh cưới minh họa kết thiệp" width="1000" height="730" loading="lazy" /></Reveal>
        <Reveal className="crimson-footer-tint" effect="fadeIn" duration={1} />
        <div className="crimson-footer-copy"><Reveal><p className="crimson-script">{copy.thanksTitle}</p></Reveal><Reveal className="crimson-thank-you-wrap"><p className="crimson-thank-you">{wedding.copy.thankYou}</p></Reveal></div>
      </footer>
      {wedding.crimson.sections.showInvitationTools && <div className="crimson-tools">{wedding.isDemo && <p>{wedding.copy.demoNote}</p>}<InvitationGenerator /></div>}
    </>
  );
}
