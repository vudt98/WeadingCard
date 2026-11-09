import { useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { InvitationViewportContext } from "./InvitationViewportContext";

// Dialogs escape the scrolling/container-query content but retain the theme
// and the card's focus management and input interruption boundary.
export function InvitationPortal({ children }: { children: ReactNode }) {
  const viewport = useContext(InvitationViewportContext);
  return createPortal(children, viewport?.overlayRef.current ?? document.body);
}
