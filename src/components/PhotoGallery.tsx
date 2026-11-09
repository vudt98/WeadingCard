import { useInvitationMotion } from "../hooks/useInvitationMotion";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { WeddingLightbox } from "./WeddingLightbox";
import { wedding } from "../config/wedding";
import { Reveal } from "./Reveal";
import { InvitationPortal } from "./InvitationPortal";
import { InvitationViewportContext } from "./InvitationViewportContext";
import { AlbumMusicContext } from "./AlbumMusicContext";
import { wrapPhoto } from "../utils/photoViewer";
import { coverflowCard } from "../utils/coverflow";
import "../coverflow.css";

export function PhotoGallery() {
  const photos = wedding.galleryImages;
  const config = wedding.galleryCards;
  const count = photos.length;
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useContext(InvitationViewportContext);
  const music = useContext(AlbumMusicContext);
  const focusActive = useRef(false);
  const { reduced } = useInvitationMotion();
  const detailOpen = useRef(false);
  const choose = (index: number) => setActive(wrapPhoto(index, count));
  const move = (direction: number) => setActive(index => wrapPhoto(index + direction, count));
  const isStageVisible = useCallback(() => {
    // Check current geometry as well as the observer, including rapid scroll/clicks.
    const bounds = stage.current?.getBoundingClientRect();
    const scroll = viewport?.scrollRef.current?.getBoundingClientRect();
    return !document.hidden && !!bounds && bounds.bottom > Math.max(0, scroll?.top ?? 0)
      && bounds.top < Math.min(window.innerHeight, scroll?.bottom ?? window.innerHeight)
      && bounds.right > Math.max(0, scroll?.left ?? 0)
      && bounds.left < Math.min(window.innerWidth, scroll?.right ?? window.innerWidth);
  }, [viewport]);
  const close = useCallback(() => {
    detailOpen.current = false;
    setSelected(null);
    // Recheck the card after closing, including a resize or restored scroll.
    music?.setVisible(isStageVisible());
  }, [isStageVisible, music]);
  const requestAlbumMusic = () => {
    const visible = !document.hidden && (detailOpen.current || isStageVisible());
    music?.setVisible(visible);
    if (visible) music?.navigate();
  };

  useEffect(() => {
    if (!stage.current || !music) return;
    const observer = new IntersectionObserver(entries => {
      music.setVisible(detailOpen.current || entries.some(entry => entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0));
    }, { root: viewport?.scrollRef.current, threshold: 0 });
    observer.observe(stage.current);
    return () => { observer.disconnect(); music.setVisible(false); };
  }, [music, viewport]);

  useEffect(() => {
    if (!focusActive.current) return;
    focusActive.current = false;
    root.current?.querySelector<HTMLButtonElement>(".coverflow-card.is-active")?.focus({ preventScroll: true });
  }, [active]);

  if (!count) return null;
  return <section className="coverflow-section" id="khoanh-khac" aria-labelledby="album-title" ref={root}>
    <header className="coverflow-heading">
      <Reveal effect="zoomIn"><h2 id="album-title">{wedding.crimson.copy.albumTitle}</h2><p>{wedding.crimson.copy.albumScript}</p></Reveal>
    </header>
    <div className="coverflow-stage" ref={stage} role="region" aria-roledescription={config.carouselLabel} aria-label={wedding.copy.albumTitle}
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); focusActive.current = count > 1; move(event.key === "ArrowRight" ? 1 : -1); }
        else if (event.key === "Home" || event.key === "End") { event.preventDefault(); const next = event.key === "Home" ? 0 : count - 1; focusActive.current = next !== active; choose(next); }
      }}>
      <div className="coverflow-perspective">
        {photos.map((image, index) => {
          const card = coverflowCard(index, active, count);
          const isActive = index === active;
          return <button type="button" className={`coverflow-card${isActive ? " is-active" : ""}`} key={image.src}
            tabIndex={isActive ? 0 : -1} disabled={!isActive} aria-hidden={!isActive || undefined}
            aria-label={`${config.openImage} ${index + 1} / ${count}`}
            aria-current={isActive ? "true" : undefined}
            style={{ aspectRatio: Math.min(1.2, Math.max(0.5, ratios[index] ?? 2 / 3)), transform: card.transform, opacity: card.opacity, zIndex: card.zIndex, pointerEvents: isActive ? "auto" : "none", transitionDuration: reduced ? "0ms" : `${config.transitionMs}ms` }}
            onClick={() => {
              if (!isActive) return;
              detailOpen.current = true;
              requestAlbumMusic();
              setSelected(index);
            }}>
            <img src={image.src} alt={image.alt} loading="lazy" draggable={false} onLoad={event => {
              const imageElement = event.currentTarget;
              if (imageElement.naturalWidth && imageElement.naturalHeight) {
                const ratio = imageElement.naturalWidth / imageElement.naturalHeight;
                setRatios(current => current[index] === ratio ? current : { ...current, [index]: ratio });
              }
            }} />
          </button>;
        })}
      </div>
      {count > 1 && selected === null && <>
        <button type="button" className="coverflow-arrow coverflow-prev" onClick={() => { move(-1); requestAlbumMusic(); }} aria-label={wedding.photoViewer.previous}><ChevronLeft size={18} /></button>
        <button type="button" className="coverflow-arrow coverflow-next" onClick={() => { move(1); requestAlbumMusic(); }} aria-label={wedding.photoViewer.next}><ChevronRight size={18} /></button>
      </>}
    </div>
    <span className="sr-only" aria-live="polite" aria-atomic="true">{active + 1} / {count}</span>
    <p className="sr-only">{config.instructions}</p>
    <p className="album-hint">{config.visibleHint}</p>
    {selected !== null && <InvitationPortal><WeddingLightbox initial={selected} close={close} onNavigate={requestAlbumMusic} /></InvitationPortal>}
  </section>;
}
