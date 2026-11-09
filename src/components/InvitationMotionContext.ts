import { createContext } from "react";

export interface InvitationMotionPreference {
  systemReduced: boolean;
  reduced: boolean;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

export const InvitationMotionContext = createContext<InvitationMotionPreference | null>(null);
