import { useInvitationMotion } from "../hooks/useInvitationMotion";

import { CalendarPlus, MapPin } from "lucide-react";
import { wedding, type WeddingSide, type WeddingEvent } from "../config/wedding";
import { calendarUrl, formatDate, numericDateParts } from "../utils/invitation";
import { Reveal } from "./Reveal";
import { PhotoGallery } from "./PhotoGallery";
import { WeddingCalendar } from "./WeddingCalendar";
import { Countdown } from "./Countdown";
import { RSVPForm } from "./RSVPForm";
import { WeddingGift } from "./WeddingGift";
import { DressCode, WeddingSchedule, Guestbook } from "./WeddingExtras";
import { InvitationGenerator } from "./InvitationGenerator";

function EventDetails({ title, date, venue, address, lunarDate, mapsUrl, calendarLabel }: {
  title: string; date: string; venue: string; address: string; lunarDate?: string; mapsUrl: string; calendarLabel: string;
}) {
  const parts = numericDateParts(date);
  return <Reveal className="event-card-reveal" effect="fadeInUpSmall" duration={0.75} delay={0}>
    <article className="magazine-event">
    <div className="event-content-reveal"><h2>{title}</h2></div>
    <p className="magazine-event-time">{wedding.magazine.copy.eventTimePrefix} {formatDate(date, { hour: "2-digit", minute: "2-digit", hour12: false })}, {formatDate(date, { weekday: "long" })}</p>
    <div className="magazine-date">
      <span>Tháng {parts.month}</span>
      <strong>{parts.day}</strong>
      <span>Năm {parts.year}</span>
    </div>
    {lunarDate && <p className="magazine-lunar">{lunarDate}</p>}
    <div className="event-content-reveal"><h3>{venue}</h3><p className="magazine-address">{address}</p></div>
    <div className="event-content-reveal"><a className="magazine-map" href={mapsUrl} target="_blank" rel="noreferrer">{wedding.ui.directions}</a></div>
    <div className="event-content-reveal"><a className="text-link event-calendar-link" href={calendarUrl({ title, dateTimeISO: date, venueName: venue, address }, `${wedding.groomName} & ${wedding.brideName}`)} target="_blank" rel="noreferrer"><CalendarPlus size={16} aria-hidden="true" />{calendarLabel}</a></div>
    </article>
  </Reveal>;
}

export function MagazineInvitation({ guest, side, onSideChange }: {
  guest: string; side: WeddingSide; onSideChange: (side: WeddingSide) => void;
}) {
  const { reduced } = useInvitationMotion();
  const event: WeddingEvent = wedding.events[side];
  const ceremony = wedding.ceremonies[side];
  const copy = wedding.magazine.copy;
  return <>
    <main id="main-content" tabIndex={-1}>
      <section className="magazine-hero" id="loi-moi">
        <div className="magazine-hero-photo">
          <img className="magazine-hero-image" src={wedding.magazine.heroImage} srcSet={wedding.magazine.heroSrcSet} sizes="(min-width: 900px) 890px, (min-width: 768px) calc(100vw - 10px), (min-width: 480px) 470px, calc(100vw - 10px)" alt={wedding.magazine.copy.heroAlt} width="1376" height="2064" fetchPriority="high" />
        </div>
        <div className="magazine-hero-copy">
          <p>{copy.heroEyebrow}</p>
          <h1>{wedding.groomName} <span>&amp;</span> {wedding.brideName}</h1>
          <p>{formatDate(ceremony.dateTimeISO, { day: "2-digit", month: "2-digit", year: "numeric" }).replaceAll("/", ".")}</p>
          <a className="hero-shortcut" href="#ngay-chung-doi" onClick={e => { e.preventDefault(); const target = document.getElementById("ngay-chung-doi"); target?.focus({ preventScroll: true }); target?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" }); }}><MapPin size={18} aria-hidden="true" />{copy.eventShortcut}</a>
        </div>
      </section>
      <section className="magazine-story" aria-labelledby="story-title">
        <Reveal effect="zoomIn"><h2 id="story-title">{copy.storyTitle}</h2></Reveal>
        <ol className="magazine-story-chapters">
          {wedding.story.map((item, index) => <li className="magazine-story-chapter" key={item.title}>
            <Reveal effect="fadeInUpSmall" delay={0} duration={0.5}>
              <h3><span className="magazine-story-order" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></span><span>{item.title}</span></h3>
              <p className="magazine-story-copy">{item.text}</p>
            </Reveal>
          </li>)}
        </ol>
      </section>
      <section className="magazine-couple" aria-label={copy.coupleLabel}>
        <Reveal {...wedding.magazine.portraitAnimation}>
          <div className="magazine-couple-layout">
            <div className="magazine-couple-name magazine-couple-bride">
              <p>{wedding.crimson.copy.groomRole}</p><h2>{wedding.groomName}</h2>
            </div>
            <img className="magazine-couple-photo" src={wedding.magazine.coupleImage} alt={`${wedding.crimson.copy.brideRole} ${wedding.brideName} và ${wedding.crimson.copy.groomRole} ${wedding.groomName}`} width="1333" height="2000" loading="lazy" />
            <div className="magazine-couple-name magazine-couple-groom">
              <p>{wedding.crimson.copy.brideRole}</p><h2>{wedding.brideName}</h2>
            </div>
          </div>
        </Reveal>
      </section>
      <section className="magazine-invitation" id="le-cuoi">
        <Reveal><p className="magazine-invite-label">{wedding.copy.invitation}</p><h2 className="magazine-guest">{guest}</h2><p className="magazine-invite-copy">{wedding.copy.invitationText}</p></Reveal>
        <div className="magazine-families">{Object.values(wedding.families).map(family => <article key={family.label}><Reveal><h3>{family.label}</h3><p>{family.father}<br />{family.mother}</p></Reveal></article>)}</div>
      </section>
      <section className="magazine-events" id="ngay-chung-doi" tabIndex={-1} aria-label={copy.eventShortcut}>
        <div className="magazine-side-switch" role="group" aria-label={copy.sideLabel}>
          {(["nhatrai", "nhagai"] as const).map(value => <button key={value} onClick={() => onSideChange(value)} aria-pressed={side === value}>{wedding.families[value].label}</button>)}
        </div>
        <EventDetails title={wedding.crimson.copy.receptionTitle} date={event.dateTimeISO} venue={event.venueName} address={event.address} lunarDate={event.lunarDate} mapsUrl={event.mapsUrl} calendarLabel={copy.receptionCalendar} />
        <div className="magazine-divider" aria-hidden="true"><Reveal><img src={wedding.magazine.eventsDivider} alt="" width="533" height="355" loading="lazy" /></Reveal></div>
        <EventDetails title={ceremony.title} date={ceremony.dateTimeISO} venue={ceremony.venue} address={event.address} lunarDate={ceremony.lunarDate} mapsUrl={event.mapsUrl} calendarLabel={copy.ceremonyCalendar} />
        <div className="magazine-calendar">
          <div className="magazine-calendar-frame">
            <img className="magazine-calendar-background" src={wedding.magazine.calendarBackground} alt="" width="450" height="324" loading="lazy" />
            <div className="magazine-calendar-inner">
              <WeddingCalendar date={wedding.calendar[side].dateTimeISO} heartImage={wedding.crimson.calendarHeart} referenceLayout />
            </div>
          </div>
        </div>
      </section>
      <PhotoGallery />
      <div className="magazine-rsvp"><RSVPForm guest={guest} side={side} /></div>
      <WeddingGift />
      <section className="magazine-countdown" aria-label={wedding.copy.countdown}>
        <Countdown date={wedding.countdown[side].dateTimeISO} />
        <Reveal><p className="magazine-reminder">{copy.reminder}</p></Reveal>
      </section>
      {wedding.crimson.sections.showGuestbook && <Guestbook />}
      {wedding.crimson.sections.showExtraDetails && <details className="crimson-extras"><summary>{wedding.crimson.copy.extraDetails}</summary><DressCode /><WeddingSchedule event={event} /></details>}
    </main>
    <footer className="magazine-footer">
      <img src={wedding.crimson.footerImage} alt={copy.footerAlt} width="1667" height="1250" loading="lazy" />
      <div className="magazine-footer-copy"><Reveal><p className="magazine-thanks">{wedding.crimson.copy.thanksTitle}</p><p>{wedding.copy.thankYou}</p></Reveal></div>
    </footer>
    {wedding.crimson.sections.showInvitationTools && <div className="crimson-tools"><InvitationGenerator /></div>}
  </>;
}
