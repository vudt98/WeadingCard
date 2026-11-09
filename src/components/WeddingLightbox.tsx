import { useInvitationMotion } from "../hooks/useInvitationMotion";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type TouchEvent } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

import { wedding } from "../config/wedding";
import { useModal } from "../hooks/useModal";
import { clampZoom, identityZoom, swipeDirection, wrapPhoto, type PhotoZoom } from "../utils/photoViewer";
import "../photo-viewer.css";

type Gesture = { mode: "none" | "swipe" | "pan" | "pinch" | "blocked"; x: number; y: number; dx: number; dy: number; distance: number; zoom: PhotoZoom };
const idleGesture = (): Gesture => ({ mode: "none", x: 0, y: 0, dx: 0, dy: 0, distance: 0, zoom: identityZoom });
const distance = (touches: React.TouchList) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

export function WeddingLightbox({ initial, close, onNavigate }: { initial: number; close: () => void; onNavigate?: () => void }) {
  const images = wedding.galleryImages;
  const labels = wedding.photoViewer;
  const [index, setIndex] = useState(() => wrapPhoto(initial, images.length));
  const [zoom, setZoom] = useState(identityZoom);
  const [interacting, setInteracting] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const thumbnails = useRef<HTMLDivElement>(null);
  const gesture = useRef(idleGesture());
  const pointerDrag = useRef<{ id: number; x: number; y: number; zoom: PhotoZoom; moved: boolean } | null>(null);
  const suppressClickUntil = useRef(0);
  const lastTap = useRef(0);
  const { reduced } = useInvitationMotion();
  useModal(dialog, close);

  const reset = useCallback(() => {
    setZoom(identityZoom);
    setInteracting(false);
    gesture.current = idleGesture();
    pointerDrag.current = null;
    lastTap.current = 0;
  }, []);
  const select = useCallback((next: number) => {
    reset();
    setIndex(wrapPhoto(next, images.length));
  }, [images.length, reset]);
  const move = useCallback((by: number) => {
    reset();
    setIndex(current => wrapPhoto(current + by, images.length));
  }, [images.length, reset]);

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (zoom.scale > 1 && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        const dx = event.key === "ArrowLeft" ? 60 : event.key === "ArrowRight" ? -60 : 0;
        const dy = event.key === "ArrowUp" ? 60 : event.key === "ArrowDown" ? -60 : 0;
        setZoom(current => clampZoom(current.scale, current.tx + dx, current.ty + dy, viewport.current?.clientWidth ?? 0, viewport.current?.clientHeight ?? 0, photo.current?.offsetWidth, photo.current?.offsetHeight));
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }
    };
    document.addEventListener("keydown", handle);
    window.addEventListener("resize", reset);
    return () => { document.removeEventListener("keydown", handle); window.removeEventListener("resize", reset); };
  }, [move, reset, zoom.scale]);

  useEffect(() => {
    const strip = thumbnails.current;
    const selected = strip?.children[index] as HTMLElement | undefined;
    if (strip && selected) strip.scrollTo({ left: selected.offsetLeft - strip.clientWidth / 2 + selected.clientWidth / 2, behavior: reduced ? "instant" : "smooth" });
  }, [index, reduced]);

  const bounded = (scale: number, tx: number, ty: number) => clampZoom(scale, tx, ty, viewport.current?.clientWidth ?? 0, viewport.current?.clientHeight ?? 0, photo.current?.offsetWidth, photo.current?.offsetHeight);
  function pointerStart(event: PointerEvent<HTMLDivElement>) {
    // Touch keeps its existing pinch/swipe handling; mouse and pen use capture
    // so dragging continues even when the pointer leaves the image.
    if (event.pointerType === "touch" || event.button !== 0 || zoom.scale <= 1 || (event.target instanceof Element && event.target.closest("button"))) return;
    event.preventDefault();
    pointerDrag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, zoom, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
    setInteracting(true);
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = pointerDrag.current;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 4) { drag.moved = true; lastTap.current = 0; suppressClickUntil.current = Date.now() + 500; }
    setZoom(bounded(drag.zoom.scale, drag.zoom.tx + dx, drag.zoom.ty + dy));
  }
  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (pointerDrag.current?.id !== event.pointerId) return;
    if (!pointerDrag.current.moved && event.type === "pointerup") {
      const now = Date.now();
      if (lastTap.current && now - lastTap.current < 300) { setZoom(identityZoom); lastTap.current = 0; }
      else lastTap.current = now;
    }
    pointerDrag.current = null;
    setInteracting(false);
    // A captured click targets the stage; it must not close the album.
    suppressClickUntil.current = Date.now() + 500;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function touchStart(event: TouchEvent) {
    setInteracting(true);
    const touches = event.touches;
    const state = gesture.current;
    if (touches.length === 2) {
      gesture.current = { ...idleGesture(), mode: "pinch", distance: distance(touches), zoom };
      lastTap.current = 0;
    } else if (touches.length === 1 && state.mode !== "blocked") {
      gesture.current = { ...idleGesture(), mode: zoom.scale > 1 ? "pan" : "swipe", x: touches[0].clientX, y: touches[0].clientY, zoom };
    }
  }
  function touchMove(event: TouchEvent) {
    const state = gesture.current;
    const touches = event.touches;
    if (state.mode === "pinch" && touches.length === 2) {
      suppressClickUntil.current = Date.now() + 500;
      setZoom(bounded(state.zoom.scale * distance(touches) / (state.distance || 1), state.zoom.tx, state.zoom.ty));
    } else if ((state.mode === "swipe" || state.mode === "pan") && touches.length === 1) {
      state.dx = touches[0].clientX - state.x;
      state.dy = touches[0].clientY - state.y;
      if (Math.hypot(state.dx, state.dy) > 8) { suppressClickUntil.current = Date.now() + 500; lastTap.current = 0; }
      if (state.mode === "pan") setZoom(bounded(state.zoom.scale, state.zoom.tx + state.dx, state.zoom.ty + state.dy));
    }
  }
  function touchEnd(event: TouchEvent) {
    const state = gesture.current;
    if (event.touches.length) {
      gesture.current = { ...idleGesture(), mode: "blocked" };
      return;
    }
    if (state.mode === "swipe") {
      const direction = swipeDirection(state.dx, state.dy);
      if (direction) move(direction);
    }
    if (state.mode === "pinch" && zoom.scale <= 1.02) setZoom(identityZoom);
    setInteracting(false);
    gesture.current = idleGesture();
  }
  function cancelTouch() {
    gesture.current = idleGesture();
    setInteracting(false);
    suppressClickUntil.current = Date.now() + 500;
    lastTap.current = 0;
  }
  const current = images[index];
  if (!current) return null;
  const viewingOriginal = zoom.scale > 1;
  const currentSrc = viewingOriginal ? current.fullSrc : current.previewSrc;
  return <div className="lightbox photo-viewer" ref={dialog} role="dialog" aria-modal="true" aria-label={labels.title}
    onClick={event => { if (event.target === event.currentTarget && Date.now() > suppressClickUntil.current) close(); }}>
    <div className="photo-viewer-toolbar">
      <button type="button" className="photo-viewer-zoom" onClick={() => setZoom(viewingOriginal ? identityZoom : { scale: 2.5, tx: 0, ty: 0 })} aria-label={viewingOriginal ? labels.zoomOut : labels.zoomIn} aria-pressed={viewingOriginal}>{viewingOriginal ? <ZoomOut size={22} /> : <ZoomIn size={22} />}</button>
      <button type="button" className="photo-viewer-close" onClick={close} aria-label={labels.close}><X size={22} /></button>
    </div>
    <p className="photo-viewer-counter" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {images.length}<span className="sr-only"> · {current.alt}</span></p>
    <div className={`photo-viewer-stage${viewingOriginal ? " is-zoomed" : ""}${interacting ? " is-dragging" : ""}`} ref={viewport} onTouchStart={touchStart} onTouchMove={touchMove} onTouchEnd={touchEnd} onTouchCancel={cancelTouch}
      onPointerDown={pointerStart} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd}
      onClick={event => { if (event.target === event.currentTarget && Date.now() > suppressClickUntil.current) close(); }}>
      <button type="button" className="photo-viewer-arrow photo-viewer-previous" onClick={() => { move(-1); onNavigate?.(); }} aria-label={labels.previous}><ChevronLeft /></button>
      {loadedSrc !== currentSrc && failedSrc !== currentSrc && <p className="photo-viewer-loading" role="status">{labels.loadingImage}</p>}
      {failedSrc === currentSrc ? <p className="photo-viewer-error" role="alert">{labels.loadError}</p> : <img ref={photo} className="photo-viewer-image" key={currentSrc} src={currentSrc} srcSet={viewingOriginal ? undefined : current.previewSrcSet} sizes="(min-width: 1024px) 928px, calc(100vw - 96px)" alt={current.alt} draggable={false}
        onLoad={() => setLoadedSrc(currentSrc)}
        onError={() => setFailedSrc(currentSrc)}
        style={{ transform: `translate(${zoom.tx}px, ${zoom.ty}px) scale(${zoom.scale})`, transition: interacting || reduced ? "none" : "transform 0.2s ease-out" }}
        onClick={event => {
          event.stopPropagation();
          if (Date.now() < suppressClickUntil.current) return;
          const now = Date.now();
          if (lastTap.current && now - lastTap.current < 300) { setZoom(zoom.scale > 1 ? identityZoom : { scale: 2.5, tx: 0, ty: 0 }); lastTap.current = 0; }
          else lastTap.current = now;
        }} />}
      <button type="button" className="photo-viewer-arrow photo-viewer-next" onClick={() => { move(1); onNavigate?.(); }} aria-label={labels.next}><ChevronRight /></button>
    </div>
    {viewingOriginal && <p className="photo-viewer-pan-hint">{labels.panHint}</p>}
    <div className="photo-viewer-thumbnails" ref={thumbnails} aria-label={labels.thumbnails}>
      {images.map((image, position) => <button type="button" key={image.src} aria-label={`${labels.viewImage} ${position + 1}`} aria-current={position === index ? "true" : undefined} onClick={() => select(position)}>
        <img src={image.src} alt="" draggable={false} />
      </button>)}
    </div>
  </div>;
}
