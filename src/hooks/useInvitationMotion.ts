import { useContext } from "react";
import { InvitationMotionContext } from "../components/InvitationMotionContext";

export function useInvitationMotion() {
  const preference = useContext(InvitationMotionContext);
  if (!preference) throw new Error("InvitationMotionProvider is required");
  return preference;
}
