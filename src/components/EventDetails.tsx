import { CalendarPlus, MapPin, ArrowUpRight } from "lucide-react";
import {
  wedding,
  type WeddingSide,
  type WeddingEvent,
} from "../config/wedding";
import { calendarUrl, formatDate, numericDateParts } from "../utils/invitation";
import { Countdown } from "./Countdown";
import { WeddingCalendar } from "./WeddingCalendar";
import { Reveal } from "./Reveal";
import { Ornament } from "./LongPhungDecoration";

export function EventDetails({
  side,
  onSideChange,
}: {
  side: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
}) {
  const event: WeddingEvent = wedding.events[side];
  const date = numericDateParts(event.dateTimeISO);
  return (
    <section className="event-section section-shell" id="ngay-chung-doi">
      <Reveal>
        <div className="section-heading">
          <span className="eyebrow">MỘT NGÀY ĐẸP · MỘT ĐỜI THƯƠNG</span>
          <h2>Chung vui cùng chúng mình</h2>
          <p>{wedding.copy.eventIntro}</p>
        </div>
        <div className="side-switch" role="group" aria-label="Chọn tiệc cưới">
          <button
            aria-pressed={side === "nhatrai"}
            onClick={() => onSideChange("nhatrai")}
          >
            Tiệc nhà trai
          </button>
          <button
            aria-pressed={side === "nhagai"}
            onClick={() => onSideChange("nhagai")}
          >
            Tiệc nhà gái
          </button>
        </div>
        <div className="event-layout">
          <div className="event-invitation">
            <span className="eyebrow">{event.title}</span>
            <p className="event-at">
              Vào lúc{" "}
              <strong>
                {formatDate(event.dateTimeISO, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </strong>
            </p>
            <div className="formal-date">
              <span>{formatDate(event.dateTimeISO, { weekday: "long" })}</span>
              <strong>{date.day}</strong>
              <span>
                Tháng {date.month}
                <br />
                {date.year}
              </span>
            </div>
            {event.lunarDate && <p>{event.lunarDate}</p>}
            <p className="welcome-time">Đón khách từ {event.welcomeTime}</p>
            <Ornament />
            <Countdown date={event.dateTimeISO} />
          </div>
          <div className="event-calendar">
            <WeddingCalendar date={event.dateTimeISO} />
            <a
              href={calendarUrl(
                event,
                `${wedding.groomName} & ${wedding.brideName}`,
              )}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              <CalendarPlus size={17} /> Thêm vào lịch
            </a>
          </div>
        </div>
        <div className="venue-panel">
          <div className="venue-photo">
            <img
              src={wedding.detailImage}
              alt="Hoa trang trí minh họa cho tiệc cưới"
              width="800"
              height="1000"
              loading="lazy"
            />
          </div>
          <div className="venue-copy">
            <MapPin size={25} strokeWidth={1.2} />
            <span className="eyebrow">HẸN GẶP BẠN TẠI</span>
            <h3>{event.venueName}</h3>
            <p>{event.address}</p>
            <a
              href={event.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="button primary"
            >
              Xem chỉ đường <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
