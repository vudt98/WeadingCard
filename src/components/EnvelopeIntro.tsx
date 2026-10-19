import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Heart } from "lucide-react";
import { wedding } from "../config/wedding";
import { Botanical } from "./Botanical";
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
      exit={{ opacity: 0, y: reduced ? 0 : -40 }}
      transition={{ duration: 0.65 }}
    >
      <Botanical className="intro-leaf" />
      <span className="eyebrow">MỘT LỜI MỜI TỪ TRÁI TIM</span>
      <h1 id="intro-heading" className="intro-names">
        {wedding.groomName} <i>&</i> {wedding.brideName}
      </h1>
      <p className="intro-quote">Có những cuộc gặp, là để bên nhau cả đời.</p>
      <motion.div
        className={`envelope ${opening ? "is-opening" : ""}`}
        animate={opening ? { y: 15, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.7 }}
        onAnimationComplete={() => {
          if (opening) onOpen();
        }}
      >
        <div className="letter">
          <span className="eyebrow">TRÂN TRỌNG KÍNH MỜI</span>
          <strong>{guest}</strong>
          <span>đến chung vui cùng chúng mình</span>
        </div>
        <div className="envelope-fold" />
        <div className="wax-seal">
          <Heart size={25} strokeWidth={1} />
        </div>
      </motion.div>
      <button
        className="button primary"
        disabled={opening}
        onClick={() => setOpening(true)}
      >
        Mở thiệp cưới <ArrowUpRight size={17} />
      </button>
      <span className="intro-date">
        {formatDate(date, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).replaceAll("/", " . ")}{" "}
        <span>·</span> SAVE THE DATE
      </span>
      <small className="demo-note">
        Bản thiệp mẫu · Nội dung và hình ảnh minh họa
      </small>
    </motion.div>
  );
}
