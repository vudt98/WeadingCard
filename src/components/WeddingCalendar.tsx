import { calendarMonth } from "../utils/invitation";

export function WeddingCalendar({ date }: { date: string }) {
  const { year, month, selectedDay, weeks } = calendarMonth(date);
  const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return (
    <table className="wedding-calendar">
      <caption>
        Tháng {month} <span>/ {year}</span>
      </caption>
      <thead>
        <tr>
          {weekdays.map((day, index) => (
            <th
              scope="col"
              key={day}
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
              <td key={col}>
                {day !== null && (
                  <span
                    className={day === selectedDay ? "selected-day" : ""}
                    aria-label={
                      day === selectedDay
                        ? `Ngày cưới, ${day} tháng ${month} năm ${year}`
                        : undefined
                    }
                  >
                    {day}
                  </span>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
