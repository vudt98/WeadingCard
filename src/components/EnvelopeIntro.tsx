import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { wedding } from "../config/wedding";
import {
  DoubleHappiness,
  LongPhungDecoration,
  Ornament,
} from "./LongPhungDecoration";
import { useModal } from "../hooks/useModal";
import { formatDate } from "../utils/invitation";

export function EnvelopeIntro({
  guest,
  date,
  onOpen,
}: {
  guest: string;
  date: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);
  const reduced = useReducedMotion();
  useModal(ref);
  return (
    <motion.div
      ref={ref}
      className="intro"
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-heading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
    >
      <motion.div
        className="envelope-card"
        animate={
          opening
            ? { opacity: 0, y: reduced ? 0 : -36, scale: reduced ? 1 : 1.03 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: reduced ? 0 : 0.65 }}
        onAnimationComplete={() => {
          if (opening) onOpen();
        }}
      >
        <span className="eyebrow intro-kicker">THIỆP BÁO HỶ</span>
        <DoubleHappiness />
        <LongPhungDecoration className="intro-creatures" />
        <h1 id="intro-heading" className="intro-names">
          {wedding.groomName}
          <i>&</i>
          {wedding.brideName}
        </h1>
        <p className="intro-date">
          {formatDate(date, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
        <Ornament />
        <div className="envelope-guest">
          <span className="eyebrow">{wedding.copy.invitation}</span>
          <strong>{guest}</strong>
        </div>
        <button
          className="button primary"
          disabled={opening}
          onClick={() => setOpening(true)}
        >
          Mở thiệp <ArrowRight size={17} />
        </button>
        <p className="intro-bottom">{wedding.copy.opening}</p>
      </motion.div>
    </motion.div>
  );
}
