import { useEffect, type RefObject } from "react";

export function useModal(
  ref: RefObject<HTMLElement | null>,
  close?: () => void,
) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
    focusable()[0]?.focus();
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
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", handle);
      for (const item of background) item.element.inert = item.inert;
      if (previous?.isConnected) previous.focus();
    };
  }, [ref, close]);
}
