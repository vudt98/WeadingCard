import { useEffect, useState } from "react";
import { countdownParts } from "../utils/invitation";
export function Countdown({ date }: { date: string }) {
  const [parts, setParts] = useState(() => countdownParts(date));
  useEffect(() => {
    setParts(countdownParts(date));
    const id = window.setInterval(() => setParts(countdownParts(date)), 1000);
    return () => clearInterval(id);
  }, [date]);
  const passed = new Date(date).getTime() <= Date.now();
  return (
    <div className="countdown-wrap">
      <p>
        {passed
          ? "Ngày vui đã đến, cảm ơn bạn vì đã ở đây."
          : "Đếm từng khoảnh khắc, chờ ngày mình chung đôi"}
      </p>
      <div
        className="countdown"
        role="timer"
        aria-label="Thời gian đến ngày cưới"
      >
        {parts.map((value, i) => (
          <div key={i}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{["NGÀY", "GIỜ", "PHÚT", "GIÂY"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
