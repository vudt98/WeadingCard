import { useCallback, useRef, useState } from "react";
import { Copy, Download, Gift, X } from "lucide-react";
import { wedding } from "../config/wedding";
import { useModal } from "../hooks/useModal";
import { Reveal } from "./Reveal";

function GiftDialog({ close }: { close: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState("");
  useModal(ref, close);
  return (
    <div
      className="gift-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        className="gift-dialog"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-title"
      >
        <button
          className="icon-button dialog-close"
          aria-label="Đóng quà mừng"
          onClick={close}
        >
          <X />
        </button>
        <span className="eyebrow">HỘP QUÀ MỪNG</span>
        <h2 id="gift-title">{wedding.copy.giftTitle}</h2>
        <div className="gift-accounts">
          {wedding.gifts.map((account) => (
            <article key={`${account.bank}-${account.accountNumber}`}>
              <h3>{account.label}</h3>
              <img
                src={account.qrImage}
                alt={`Mã QR quà mừng ${account.label}`}
                width="220"
                height="220"
              />
              <p>{account.bank}</p>
              <strong>{account.accountName}</strong>
              <p>{account.accountNumber}</p>
              <div className="gift-actions">
                <button
                  className="text-link"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        account.accountNumber,
                      );
                      setStatus("Đã sao chép số tài khoản.");
                    } catch {
                      setStatus(
                        "Chưa sao chép được. Bạn có thể chọn số tài khoản ở trên để sao chép.",
                      );
                    }
                  }}
                >
                  <Copy size={16} /> Sao chép
                </button>
                <a className="text-link" href={account.qrImage} download>
                  <Download size={16} /> Lưu QR
                </a>
              </div>
            </article>
          ))}
        </div>
        <p role="status">{status}</p>
      </div>
    </div>
  );
}
export function WeddingGift() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <section className="gift-section section-shell" id="qua-mung">
      <Reveal>
        <span className="eyebrow">HỘP QUÀ MỪNG</span>
        <h2>{wedding.copy.giftTitle}</h2>
        <p className="section-description">{wedding.copy.giftText}</p>
        {wedding.gifts.length > 0 ? (
          <button className="gift-box" onClick={() => setOpen(true)}>
            <Gift size={52} strokeWidth={1} />
            <span>Mở hộp quà mừng</span>
          </button>
        ) : (
          <div className="gift-placeholder">
            <Gift size={52} strokeWidth={1} />
            <p>{wedding.copy.giftEmpty}</p>
          </div>
        )}
      </Reveal>
      {open && <GiftDialog close={close} />}
    </section>
  );
}
