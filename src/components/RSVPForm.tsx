import { Mail } from "lucide-react";
import { wedding } from "../config/wedding";
import { Reveal } from "./Reveal";
import { Ornament } from "./LongPhungDecoration";
export function RSVPForm() {
  return (
    <section className="rsvp-section section-shell" id="hoi-am">
      <Reveal>
        <Ornament />
        <span className="eyebrow">HẠNH PHÚC KHI CÓ BẠN</span>
        <h2>{wedding.copy.rsvpTitle}</h2>
        <p className="section-description">{wedding.copy.rsvpText}</p>
        <div className="availability-note">
          <Mail size={22} strokeWidth={1.3} />
          <strong>{wedding.copy.rsvpStatus}</strong>
          <p>{wedding.copy.rsvpNote}</p>
        </div>
      </Reveal>
    </section>
  );
}
