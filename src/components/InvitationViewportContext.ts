import { createContext, type RefObject } from "react";

export const InvitationViewportContext = createContext<{
  scrollRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  overlayRef: RefObject<HTMLDivElement | null>;
} | null>(null);
