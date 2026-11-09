import { useContext, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import { wedding } from "../config/wedding";
import { useModal } from "../hooks/useModal";
import { formatDate } from "../utils/invitation";
import { InvitationViewportContext } from "./InvitationViewportContext";
import { useInvitationMotion } from "../hooks/useInvitationMotion";

const OPENING_DURATION_MS = 2500;

export function EnvelopeIntro({
  guest,
  date,
  onOpen,
  onOpeningStart,
}: {
  guest: string;
  date: string;
  onOpen: () => void;
  onOpeningStart: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const [opening, setOpening] = useState(false);
  const { reduced, systemReduced, enabled, setEnabled } = useInvitationMotion();
  const viewport = useContext(InvitationViewportContext);
  useModal(ref, undefined, openButtonRef);

  // Complete even if the browser suppresses transitionend (for example in a hidden tab).
  useEffect(() => {
    if (!opening) return;
    const timeout = window.setTimeout(onOpen, OPENING_DURATION_MS + 400);
    return () => window.clearTimeout(timeout);
  }, [opening, onOpen]);

  const open = () => {
    if (opening) return;
    // Reset a restored history/anchor position while both doors are still shut.
    viewport?.scrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
    onOpeningStart();
    if (reduced) onOpen();
    else setOpening(true);
  };

  return (
    <motion.div
      ref={ref}
      className={`intro${opening ? " is-opening" : ""}`}
      style={{
        "--door-duration": `${OPENING_DURATION_MS}ms`,
        "--opening-background": wedding.opening.backgroundColor,
        "--opening-button": wedding.opening.buttonColor,
        "--opening-button-text": wedding.opening.buttonTextColor,
      } as CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-heading"
      aria-describedby="intro-description"
      aria-busy={opening}
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0 }}
    >
      <h1 id="intro-heading" className="sr-only">
        {wedding.copy.coverTitle}: {wedding.groomName} &amp; {wedding.brideName}
      </h1>
      <p id="intro-description" className="sr-only">
        {wedding.copy.invitation} {guest}. {formatDate(date, {
          day: "2-digit", month: "2-digit", year: "numeric",
        })}.
      </p>
      <p className="envelope-identity" aria-hidden="true">{wedding.groomName} <span>&amp;</span> {wedding.brideName}</p>
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          className={`envelope-door envelope-door-${side}`}
          style={{ backgroundImage: `linear-gradient(${wedding.opening.textureOverlay}, ${wedding.opening.textureOverlay}), url("${wedding.opening.textureImage}")` }}
          aria-hidden="true"
          onTransitionEnd={(event) => {
            if (
              opening && side === "right" &&
              event.target === event.currentTarget && event.propertyName === "transform"
            ) onOpen();
          }}
        >
          {side === "right" && (
            <img
              className="wax-seal"
              src={wedding.opening.sealImage}
              alt=""
              width="110"
              height="110"
              draggable={false}
            />
          )}
        </div>
      ))}
      <div className="envelope-actions">
        {systemReduced && <label className="envelope-motion-option">
          <input type="checkbox" checked={enabled} disabled={opening} onChange={event => setEnabled(event.target.checked)} />
          <span><strong>{wedding.opening.enableMotionLabel}</strong><small>{wedding.opening.enableMotionDescription}</small></span>
        </label>}
        <button
          ref={openButtonRef}
          className="envelope-open"
          aria-disabled={opening}
          onClick={open}
        >
          {wedding.copy.openButton}
        </button>
      </div>
    </motion.div>
  );
}
