import { useInvitationMotion } from "../hooks/useInvitationMotion";
import { motion } from "motion/react";
import { useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { wedding, type WeddingAnimation } from "../config/wedding";
import { RevealContext } from "./RevealContext";
import { InvitationViewportContext } from "./InvitationViewportContext";
import "../reveal.css";

export function Reveal({
  children,
  className = "",
  effect = "fadeInUp",
  delay = wedding.animation.delay,
  duration = wedding.animation.duration,
  style,
}: {
  children?: ReactNode;
  className?: string;
  effect?: WeddingAnimation;
  delay?: number;
  duration?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useContext(RevealContext);
  const viewport = useContext(InvitationViewportContext);
  const { reduced } = useInvitationMotion();
  const [entered, setEntered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Observe stationary geometry once the layout is ready, even behind the cover.
  // The door does not start or reset entrances; off-screen content waits for entry.
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || reduced || entered || focused || effect === "none") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        setEntered(true);
        observer.disconnect();
      }
    }, { root: viewport?.scrollRef.current, rootMargin: `0px 0px -${wedding.animation.viewportInsetPx}px 0px`, threshold: wedding.animation.visibleAmount });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, reduced, entered, focused, effect, viewport]);
  const visible = effect === "none" || reduced || focused || (enabled && entered);
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      data-reveal-trigger={effect}
      onFocusCapture={() => setFocused(true)}
    >
      <motion.div
        className="reveal-content"
        data-reveal={effect}
        data-reveal-started={visible ? "true" : "false"}
        initial={false}
        style={{
          opacity: visible ? 1 : 0,
          animationName: visible && !reduced && !focused && effect !== "none" ? `elegance-${effect}` : "none",
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          animationTimingFunction: "ease",
          animationFillMode: "both",
          animationIterationCount: 1,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
