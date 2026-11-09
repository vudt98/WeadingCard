import { BookHeart, Shirt } from "lucide-react";
import { wedding, type WeddingEvent } from "../config/wedding";
import { Reveal } from "./Reveal";
import { Ornament } from "./LongPhungDecoration";

export function DressCode() {
  if (!wedding.dressCode.length) return null;
  return (
    <section className="dress-section section-shell">
      <Reveal>
        <Shirt size={28} strokeWidth={1} />
        <span className="eyebrow">{wedding.ui.dressCodeLabel}</span>
        <h2>{wedding.ui.dressCodeTitle}</h2>
        <p className="section-description">{wedding.copy.dressCodeText}</p>
        <div className="dress-colors">
          {wedding.dressCode.map((item) => (
            <div key={item.name}>
              <span
                className="color-swatch"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
export function WeddingSchedule({ event }: { event: WeddingEvent }) {
  if (!event.schedule.length) return null;
  return (
    <section className="schedule-section section-shell" id="lich-trinh">
      <Reveal>
        <div className="section-heading">
          <span className="eyebrow">{wedding.ui.scheduleLabel}</span>
          <h2>{wedding.ui.scheduleTitle}</h2>
          <p>{event.title}</p>
        </div>
        <ol className="schedule">
          {event.schedule.map((item, index) => (
            <li key={item.time}>
              <time>{item.time}</time>
              <span className="schedule-dot" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <Ornament />
      </Reveal>
    </section>
  );
}
export function Guestbook() {
  return (
    <section className="guestbook-section section-shell">
      <Reveal>
        <span className="eyebrow">{wedding.ui.guestbookLabel}</span>
        <h2>{wedding.copy.guestbookTitle}</h2>
        <p className="section-description">{wedding.copy.guestbookText}</p>
        <div className="guestbook-paper">
          <BookHeart size={32} strokeWidth={1} />
          <strong>{wedding.copy.guestbookStatus}</strong>
          <p>{wedding.copy.guestbookNote}</p>
          <span className="paper-signature">{wedding.signature}</span>
        </div>
      </Reveal>
    </section>
  );
}
