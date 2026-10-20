import { wedding, type WeddingSide } from "../config/wedding";
import { formatDate } from "../utils/invitation";
import { Ornament } from "./LongPhungDecoration";
import { Reveal } from "./Reveal";

export function CeremonyDetails({ side }: { side: WeddingSide }) {
  const ceremony = wedding.ceremonies[side];
  return (
    <section className="ceremony-section section-shell" id="le-cuoi">
      <Reveal>
        <div className="section-heading">
          <span className="eyebrow">HAI GIA ĐÌNH · MỘT NIỀM VUI</span>
          <h2>Trân trọng báo hỷ</h2>
        </div>
        <div className="family-grid">
          {Object.values(wedding.families).map((family) => (
            <article key={family.label}>
              <span className="eyebrow">{family.label}</span>
              <p>
                {family.father}
                <br />
                {family.mother}
              </p>
              <small>{family.address}</small>
            </article>
          ))}
        </div>
        <p className="ceremony-intro">Trân trọng báo tin lễ thành hôn của</p>
        <div className="couple-full-names">
          <div>
            <h3>{wedding.families.nhatrai.fullName}</h3>
            <span>{wedding.families.nhatrai.role}</span>
          </div>
          <i aria-hidden="true">&</i>
          <div>
            <h3>{wedding.families.nhagai.fullName}</h3>
            <span>{wedding.families.nhagai.role}</span>
          </div>
        </div>
        <Ornament />
        <div className="ceremony-date" aria-live="polite">
          <span className="eyebrow">{ceremony.title}</span>
          <p>
            Được cử hành tại <strong>{ceremony.venue}</strong>
          </p>
          <p className="ceremony-time">
            {formatDate(ceremony.dateTimeISO, {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
          <p>
            {formatDate(ceremony.dateTimeISO, {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          {ceremony.lunarDate && <small>{ceremony.lunarDate}</small>}
        </div>
      </Reveal>
    </section>
  );
}
