import { useCallback, useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { wedding } from "../config/wedding";
import { Reveal } from "./Reveal";
import { useModal } from "../hooks/useModal";

function Lightbox({ initial, close }: { initial: number; close: () => void }) {
  const [index, setIndex] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const move = useCallback(
    (by: number) =>
      setIndex(
        (i) =>
          (i + by + wedding.galleryImages.length) %
          wedding.galleryImages.length,
      ),
    [],
  );
  useModal(ref, close);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [move]);
  return (
    <div
      className="lightbox"
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Album ảnh cưới"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <button
        className="lightbox-close icon-button"
        onClick={close}
        aria-label="Đóng album"
      >
        <X />
      </button>
      <button
        className="icon-button"
        onClick={() => move(-1)}
        aria-label="Ảnh trước"
      >
        <ArrowLeft />
      </button>
      <figure>
        <img
          src={wedding.galleryImages[index].src}
          alt={wedding.galleryImages[index].alt}
        />
        <figcaption aria-live="polite">
          {index + 1} / {wedding.galleryImages.length} · Một chút kỷ niệm, một
          đời thương
        </figcaption>
      </figure>
      <button
        className="icon-button"
        onClick={() => move(1)}
        aria-label="Ảnh tiếp theo"
      >
        <ArrowRight />
      </button>
    </div>
  );
}
export function PhotoGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const close = useCallback(() => setSelected(null), []);
  return (
    <section className="gallery-section section-shell" id="khoanh-khac">
      <Reveal>
        <div className="gallery-heading">
          <div>
            <span className="eyebrow">OUR LITTLE MEMORIES</span>
            <h2>
              Thương từng <em>khoảnh khắc</em>
            </h2>
          </div>
          <button className="text-link" onClick={() => setSelected(0)}>
            Mở album ảnh <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="gallery-grid">
          {wedding.galleryImages.map((image, i) => (
            <button
              className={`gallery-item gallery-item-${i}`}
              key={image.src}
              onClick={() => setSelected(i)}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width="800"
                height="1000"
              />
              <span>
                0{i + 1} <ArrowUpRight size={20} />
              </span>
            </button>
          ))}
        </div>
        <p className="gallery-footnote">
          Những bức ảnh minh họa cho một câu chuyện chờ được viết bằng kỷ niệm
          của bạn.
        </p>
      </Reveal>
      {selected !== null && <Lightbox initial={selected} close={close} />}
    </section>
  );
}
