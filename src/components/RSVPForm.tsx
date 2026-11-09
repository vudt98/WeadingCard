import { ExternalLink, Mail } from "lucide-react";
import { wedding } from "../config/wedding";
import { googleFormLinks } from "../utils/googleForm";
import { Reveal } from "./Reveal";
export function RSVPForm() {
  const links = googleFormLinks(wedding.rsvp.formUrl);
  const intro = links ? wedding.rsvp.introText : wedding.copy.rsvpText;
  return (
    <section className="rsvp-section section-shell" id="hoi-am" aria-labelledby="rsvp-title">
      <h2 className="sr-only" id="rsvp-title">{wedding.copy.rsvpTitle}</h2>
      {intro && <Reveal>
        <p className="section-description">{intro}</p>
      </Reveal>}
      {links ? <div className="rsvp-google-form">
        <p className="rsvp-privacy-note">{wedding.rsvp.privacyNote}</p>
        <iframe
          className="rsvp-form-frame"
          src={links.embedUrl}
          title={wedding.rsvp.frameTitle}
          loading="lazy"
          referrerPolicy="no-referrer"
          height={wedding.rsvp.embedHeight}
        />
        <p className="rsvp-fallback-note">{wedding.rsvp.fallbackText}</p>
        <a className="rsvp-form-link" href={links.openUrl} target="_blank" rel="noopener noreferrer">
          {wedding.rsvp.openLabel} <ExternalLink size={16} aria-hidden="true" />
          <span className="sr-only"> ({wedding.rsvp.newTabLabel})</span>
        </a>
      </div> : <Reveal className="crimson-rsvp-status" effect="fadeIn" delay={0}>
        <div className="availability-note">
          <Mail size={22} strokeWidth={1.3} />
          <strong>{wedding.copy.rsvpStatus}</strong>
          <p>{wedding.copy.rsvpNote}</p>
        </div>
      </Reveal>}
    </section>
  );
}
