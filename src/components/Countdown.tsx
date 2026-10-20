import { useEffect, useState } from "react";
import { countdownParts } from "../utils/invitation";
import { wedding } from "../config/wedding";
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
      <p>{passed ? wedding.copy.countdownPassed : wedding.copy.countdown}</p>
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
