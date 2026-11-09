import { useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { InvitationMotionContext } from "./InvitationMotionContext";

const query = "(prefers-reduced-motion: reduce)";
const snapshot = () => window.matchMedia(query).matches;
const serverSnapshot = () => true;
function subscribe(notify: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

export function InvitationMotionProvider({ children }: { children: ReactNode }) {
  const systemReduced = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [enabled, setEnabled] = useState(false);
  const reduced = systemReduced && !enabled;
  const value = useMemo(() => ({ systemReduced, reduced, enabled, setEnabled }), [systemReduced, reduced, enabled]);
  return <InvitationMotionContext.Provider value={value}>
    <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
  </InvitationMotionContext.Provider>;
}
