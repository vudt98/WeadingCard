import { CalendarPlus, MapPin, ArrowUpRight, Clock3 } from "lucide-react";
import { wedding, type WeddingSide } from "../config/wedding";
import { calendarUrl, formatDate, numericDateParts } from "../utils/invitation";
import { Countdown } from "./Countdown";
import { Reveal } from "./Reveal";
import { Botanical } from "./Botanical";

export function EventDetails({
  side,
  onSideChange,
}: {
  side: WeddingSide;
  onSideChange: (side: WeddingSide) => void;
}) {
  const event = wedding.events[side];
  const date = numericDateParts(event.dateTimeISO);
  return (
    <section className="event-section" id="ngay-chung-doi">
      <div className="section-shell">
        <Reveal>
          <div className="section-heading">
            <span className="eyebrow">SAVE OUR DATE</span>
            <h2>
              Ngày mình <em>chung đôi</em>
            </h2>
            <p>Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng mình.</p>
          </div>
          <div className="event-layout">
            <div className="event-date-panel">
              <Botanical />
              <span className="eyebrow">
                {formatDate(event.dateTimeISO, { weekday: "long" })}
              </span>
              <div className="large-date">{date.day}</div>
              <div className="date-month">
                THÁNG {date.month} <span> / </span> {date.year}
              </div>
              <span className="date-rule" />
              <p>Ngày đẹp nhất là ngày có bạn.</p>
            </div>
            <div className="event-information">
              <div
                className="side-switch"
                role="group"
                aria-label="Chọn tiệc cưới"
              >
                <button
                  aria-pressed={side === "nhatrai"}
                  onClick={() => onSideChange("nhatrai")}
                >
                  Nhà trai
                </button>
                <button
                  aria-pressed={side === "nhagai"}
                  onClick={() => onSideChange("nhagai")}
                >
                  Nhà gái
                </button>
              </div>
              <span className="eyebrow">TRÂN TRỌNG KÍNH MỜI</span>
              <h3>{event.title}</h3>
              <p className="event-description">
                Cùng nâng ly, trao lời chúc và lưu giữ những khoảnh khắc đáng
                nhớ.
              </p>
              <div className="event-meta">
                <Clock3 size={19} />
                <div>
                  <strong>
                    {formatDate(event.dateTimeISO, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    ·{" "}
                    {formatDate(event.dateTimeISO, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </strong>
                  <span>Đón khách & chụp hình trước tiệc 30 phút</span>
                </div>
              </div>
              <div className="event-meta">
                <MapPin size={20} />
                <div>
                  <strong>{event.venueName}</strong>
                  <span>{event.address}</span>
                </div>
              </div>
              <div className="event-actions">
                <a
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button primary"
                >
                  Xem chỉ đường <ArrowUpRight size={16} />
                </a>
                <a
                  href={calendarUrl(
                    event,
                    `${wedding.groomName} & ${wedding.brideName}`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="calendar-link"
                >
                  <CalendarPlus size={17} /> Thêm vào lịch
                </a>
              </div>
              <small className="venue-note">
                Địa điểm và lịch tiệc minh họa, vui lòng thay trước khi gửi
                thiệp.
              </small>
            </div>
          </div>
          <Countdown date={event.dateTimeISO} />
        </Reveal>
      </div>
    </section>
  );
}
