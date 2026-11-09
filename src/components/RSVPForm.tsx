import { Mail } from "lucide-react";
import { wedding } from "../config/wedding";
import { Reveal } from "./Reveal";
export function RSVPForm() {
  return (
    <section className="rsvp-section section-shell" id="hoi-am">
      <h2 className="sr-only">{wedding.copy.rsvpTitle}</h2>
      {wedding.copy.rsvpText && <Reveal>
        <p className="section-description">{wedding.copy.rsvpText}</p>
      </Reveal>}
      <Reveal className="crimson-rsvp-status" effect="fadeIn" delay={0}>
        <div className="availability-note">
          <Mail size={22} strokeWidth={1.3} />
          <strong>{wedding.copy.rsvpStatus}</strong>
          <p>{wedding.copy.rsvpNote}</p>
        </div>
      </Reveal>
    </section>
  );
}
