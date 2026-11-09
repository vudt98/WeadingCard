import { useContext, useLayoutEffect, type RefObject } from "react";
import { InvitationViewportContext } from "../components/InvitationViewportContext";

export function useModal(
  ref: RefObject<HTMLElement | null>,
  close?: () => void,
) {
  const viewport = useContext(InvitationViewportContext);
  useLayoutEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const scrollSurface = viewport?.scrollRef.current ?? document.body;
    const oldOverflow = scrollSurface.style.overflow;
    scrollSurface.style.overflow = "hidden";
    // Hide every branch outside the dialog from both pointer and keyboard users.
    const background: { element: HTMLElement; inert: boolean }[] = [];
    let branch: HTMLElement | null = ref.current;
    while (branch && branch !== document.body) {
      const parent: HTMLElement | null = branch.parentElement;
      for (const sibling of Array.from(parent?.children ?? [])) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== branch &&
          !sibling.inert
        ) {
          background.push({ element: sibling, inert: sibling.inert });
          sibling.inert = true;
        }
      }
      branch = parent;
    }
    const focusable = () =>
      Array.from(
        ref.current?.querySelectorAll<HTMLElement>(
          'button, a[href], input, select, textarea, [tabindex="0"]',
        ) ?? [],
      ).filter(
        (element) =>
          !element.matches(":disabled") &&
          !element.closest("[inert]") &&
          element.getClientRects().length > 0,
      );
    focusable()[0]?.focus({ preventScroll: true });
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape" && close) close();
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      scrollSurface.style.overflow = oldOverflow;
      document.removeEventListener("keydown", handle);
      for (const item of background) item.element.inert = item.inert;
      // Strict Mode can capture the dialog's own button as "previous". Never
      // focus a control that is being removed; it can also cancel auto-start.
      if (previous?.isConnected && !dialog?.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [ref, close, viewport]);
}
