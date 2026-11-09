import { useInvitationMotion } from "../hooks/useInvitationMotion";
import { useCallback, useContext, useEffect, useState } from "react";

import { ArrowDownToLine, Pause, Play } from "lucide-react";
import { wedding } from "../config/wedding";
import { advanceScroll } from "../utils/autoScroll";
import { InvitationViewportContext } from "./InvitationViewportContext";

const bottom = (surface: HTMLElement) => Math.max(0, surface.scrollHeight - surface.clientHeight);

export function AutoScrollControl() {
  const viewport = useContext(InvitationViewportContext);
  const { reduced } = useInvitationMotion();
  const [running, setRunning] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const config = wedding.autoScroll;
  const stop = useCallback(() => {
    setRunning(false);
  }, []);

  useEffect(() => {
    if (reduced) stop();
  }, [reduced, stop]);

  useEffect(() => {
    const surface = viewport?.scrollRef.current;
    if (!surface) return;
    let idleTimeout: number | undefined;
    const onScroll = () => {
      setScrolling(true);
      window.clearTimeout(idleTimeout);
      idleTimeout = window.setTimeout(() => setScrolling(false), config.controlIdleDelayMs);
    };
    surface.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      surface.removeEventListener("scroll", onScroll);
      window.clearTimeout(idleTimeout);
    };
  }, [config.controlIdleDelayMs, viewport]);

  useEffect(() => {
    const surface = viewport?.scrollRef.current;
    const card = viewport?.cardRef.current;
    if (!surface || !card) return;
    const interrupt = (event: Event) => {
      // Music toggles are independent of playback of the invitation's scroll.
      // Keep wheel/scroll keys interruptible even when these controls have focus.
      const playbackControl = event.target instanceof Element && event.target.closest("[data-auto-scroll-control], [data-music-control]");
      if (playbackControl && (event.type === "pointerdown" || event.type === "touchstart" || event.type === "focusin" || (event instanceof KeyboardEvent && ["Enter", " "].includes(event.key)))) return;
      // Let the destination's focusin decide whether Tab should pause scrolling.
      if (event instanceof KeyboardEvent && !["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) return;
      if (event.type === "focusin" && !(event.target instanceof Element && event.target.closest("button, a, input, textarea, select, summary, [contenteditable=true]"))) return;
      stop();
    };
    const visibility = () => { if (document.hidden) stop(); };
    const updateBottom = () => setAtBottom(surface.scrollTop >= bottom(surface) - 1);
    for (const event of ["wheel", "touchstart", "pointerdown", "keydown", "focusin"]) card.addEventListener(event, interrupt, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    surface.addEventListener("scroll", updateBottom, { passive: true });
    window.addEventListener("resize", updateBottom);
    const resize = new ResizeObserver(updateBottom);
    resize.observe(surface);
    if (surface.firstElementChild) resize.observe(surface.firstElementChild);
    updateBottom();
    return () => {
      for (const event of ["wheel", "touchstart", "pointerdown", "keydown", "focusin"]) card.removeEventListener(event, interrupt);
      document.removeEventListener("visibilitychange", visibility);
      surface.removeEventListener("scroll", updateBottom);
      window.removeEventListener("resize", updateBottom);
      resize.disconnect();
    };
  }, [stop, viewport]);

  useEffect(() => {
    const surface = viewport?.scrollRef.current;
    if (!surface || !running || reduced) return;
    let frame = 0;
    let previous: number | undefined;
    let position = surface.scrollTop;
    const tick = (now: number) => {
      if (document.hidden || document.querySelector('[role="dialog"]')) { stop(); return; }
      // Match the reference: retain a new browser/anchor position instead of
      // snapping back to a stale accumulated coordinate on the next frame.
      if (Math.abs(surface.scrollTop - position) > 2) position = surface.scrollTop;
      position = advanceScroll(position, previous === undefined ? 0 : now - previous, config.pixelsPerSecond, bottom(surface));
      previous = now;
      surface.scrollTo({ top: position, behavior: "instant" });
      if (position >= bottom(surface) - 1) { stop(); return; }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [running, reduced, config.pixelsPerSecond, stop, viewport]);

  if (!config.enabled) return null;
  const label = atBottom ? config.bottomLabel : reduced ? config.reducedMotionLabel : running ? config.stopLabel : config.startLabel;
  return (
    <button
      type="button"
      className={`auto-scroll-control${scrolling ? " is-scrolling" : ""}`}
      data-auto-scroll-control
      data-scroll-active={scrolling}
      aria-label={label}
      title={label}
      aria-pressed={running && !reduced}
      disabled={atBottom}
      onClick={() => {
        stop();
        const surface = viewport?.scrollRef.current;
        if (!surface) return;
        if (reduced) surface.scrollTo({ top: bottom(surface), behavior: "instant" });
        else if (!running) setRunning(true);
      }}
    >
      {reduced ? <ArrowDownToLine size={18} /> : running ? <Pause size={18} /> : <Play size={18} />}
      <span className="sr-only">{label}</span>
    </button>
  );
}
