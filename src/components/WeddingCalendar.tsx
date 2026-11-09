import { calendarMonth } from "../utils/invitation";
import type { CSSProperties } from "react";
import { Reveal } from "./Reveal";
import { wedding } from "../config/wedding";

export function WeddingCalendar({ date, heartImage }: { date: string; heartImage?: string; referenceLayout?: boolean }) {
  const { year, month, selectedDay, weeks } = calendarMonth(date);
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <>
      <Reveal className="calendar-title" effect="zoomIn"><p aria-hidden="true">Tháng {month} <span>/ {year}</span></p></Reveal>
      <Reveal effect="fadeIn" delay={0}>
    <table className="wedding-calendar" style={{
      "--calendar-sunday": wedding.calendar.sundayColor,
      ...(heartImage ? { "--calendar-heart": `url("${new URL(heartImage, document.baseURI).href}")` } : {}),
    } as CSSProperties}>
      <caption className="sr-only">
        Tháng {month} <span>/ {year}</span>
      </caption>
      <thead>
        <tr>
          {weekdays.map((day, index) => (
            <th
              scope="col"
              key={day}
              className={index === 6 ? "calendar-sunday" : undefined}
              aria-label={index === 6 ? "Chủ nhật" : `Thứ ${index + 2}`}
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weeks.map((week, index) => (
          <tr key={index}>
            {week.map((day, col) => (
              <td key={col} className={col === 6 ? "calendar-sunday" : undefined}>
                {day !== null && (
                  <span
                    className={day === selectedDay ? "selected-day" : ""}
                    aria-label={
                      day === selectedDay
                        ? `Ngày cưới, ${day} tháng ${month} năm ${year}`
                        : undefined
                    }
                  >
                    <b className="calendar-day-number">{day}</b>
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
      </Reveal>
    </>
  );
}
