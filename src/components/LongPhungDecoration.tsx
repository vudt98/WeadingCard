import { asset } from "../config/wedding";

export function DoubleHappiness({ className = "" }: { className?: string }) {
  return (
    <img
      className={`double-happiness ${className}`}
      src={asset("images/long-phung/double-happiness.svg")}
      alt="Song Hỷ"
      width="100"
      height="100"
    />
  );
}
export function LongPhungDecoration({
  className = "",
  kind = "pair",
}: {
  className?: string;
  kind?: "pair" | "swallow";
}) {
  return (
    <div className={`long-phung ${kind} ${className}`} aria-hidden="true">
      {kind === "pair" ? (
        <>
          <img
            className="dragon"
            src={asset("images/long-phung/dragon.svg")}
            alt=""
            width="300"
            height="420"
          />
          <img
            className="phoenix"
            src={asset("images/long-phung/phoenix.svg")}
            alt=""
            width="300"
            height="420"
          />
        </>
      ) : (
        <img
          src={asset("images/long-phung/swallow.svg")}
          alt=""
          width="140"
          height="80"
        />
      )}
    </div>
  );
}
export function Ornament() {
  return (
    <div className="ornament" aria-hidden="true">
      <span />
      <svg
        viewBox="0 0 60 24"
        width="60"
        height="24"
        fill="none"
        stroke="currentColor"
      >
        <path d="M0 12h12l6-6 12 6 12-6 6 6h12M12 12l6 6 12-6 12 6 6-6M30 2l6 10-6 10-6-10Z" />
      </svg>
      <span />
    </div>
  );
}
