import { useCallback, useId, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Copy, Download, Gift, QrCode, X } from "lucide-react";
import { wedding, type WeddingGiftAccount } from "../config/wedding";
import { useModal } from "../hooks/useModal";
import { Reveal } from "./Reveal";
import { InvitationPortal } from "./InvitationPortal";

const compactQuery = "(max-width: 639px)";
const compactSnapshot = () => window.matchMedia(compactQuery).matches;
const compactServerSnapshot = () => true;
function subscribeCompact(notify: () => void) {
  const media = window.matchMedia(compactQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}

function GiftAccount({ account, announce }: { account: WeddingGiftAccount; announce: (message: string) => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const copy = wedding.giftSettings;
  const hasQR = Boolean(account.qrImage) && !imageFailed;
  return <article className="gift-account">
    <span className="gift-recipient">{account.label}</span>
    <div className={`gift-qr-frame${!hasQR ? " is-pending" : ""}`}>
      {hasQR ? <img src={account.qrImage} alt={`Mã QR quà mừng ${account.label}`} width="220" height="220" onError={() => setImageFailed(true)} /> :
        <div className="gift-qr-pending"><QrCode size={40} strokeWidth={1} aria-hidden="true" /><p>{imageFailed ? copy.qrError : copy.qrPending}</p></div>}
    </div>
    <div className="gift-account-details">
      <h3>{account.accountName}</h3>
      {account.bank && <p className="gift-bank">{account.bank}</p>}
      {account.accountNumber ? <p className="gift-number">{account.accountNumber}</p> : <p className="gift-account-pending">{copy.accountPending}</p>}
    </div>
    <div className="gift-actions">
      <button type="button" className="gift-copy" disabled={!account.accountNumber} aria-label={`${copy.copyLabel} ${account.label}`} onClick={async () => {
        try {
          await navigator.clipboard.writeText(account.accountNumber);
          announce(`${copy.copiedLabel} ${account.label.toLocaleLowerCase("vi")}.`);
        } catch {
          announce(copy.copyError);
        }
      }}><Copy size={15} aria-hidden="true" />{copy.copyLabel}</button>
      {hasQR && <a className="gift-download" href={account.qrImage} download><Download size={15} aria-hidden="true" />{copy.downloadLabel}</a>}
    </div>
  </article>;
}

function GiftDialog({ close }: { close: () => void }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, compactServerSnapshot);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");
  const copy = wedding.giftSettings;
  const accounts: WeddingGiftAccount[] = wedding.gifts.length ? wedding.gifts : copy.recipients.map(recipient => ({
    label: recipient.label, accountName: recipient.name, bank: "", accountNumber: "", qrImage: "",
  }));
  useModal(ref, close);
  const choose = (index: number) => { setActive(index); setStatus(""); };
  return <div className="gift-overlay" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="gift-dialog" ref={ref} role="dialog" aria-modal="true" aria-labelledby="gift-title" aria-describedby="gift-description">
      <header className="gift-dialog-header">
        <button type="button" className="icon-button dialog-close" aria-label={copy.closeLabel} onClick={close}><X size={22} /></button>
        <h2 id="gift-title">{copy.title}</h2>
        <p id="gift-description">{wedding.gifts.length ? copy.dialogDescription : copy.pendingDescription}</p>
      </header>
      <div className="gift-dialog-body">
        {compact && <div className="gift-tabs" role="tablist" aria-label={copy.recipientTabsLabel}>
          {accounts.map((account, index) => <button type="button" role="tab" key={`${account.label}-${index}`} id={`${id}-tab-${index}`} aria-selected={active === index} aria-controls={`${id}-panel-${index}`} tabIndex={active === index ? 0 : -1} ref={element => { tabs.current[index] = element; }} onClick={() => choose(index)} onKeyDown={event => {
            let next: number;
            if (event.key === "ArrowRight") next = (index + 1) % accounts.length;
            else if (event.key === "ArrowLeft") next = (index - 1 + accounts.length) % accounts.length;
            else if (event.key === "Home") next = 0;
            else if (event.key === "End") next = accounts.length - 1;
            else return;
            event.preventDefault();
            choose(next);
            tabs.current[next]?.focus();
          }}>{account.label}</button>)}
        </div>}
        <div className="gift-accounts">{accounts.map((account, index) => <div className="gift-panel" key={`${account.label}-${account.accountNumber}`} id={`${id}-panel-${index}`} role={compact ? "tabpanel" : undefined} aria-labelledby={compact ? `${id}-tab-${index}` : undefined} hidden={compact && active !== index} tabIndex={compact ? 0 : undefined} onFocusCapture={() => setActive(index)}>
          <GiftAccount account={account} announce={setStatus} />
        </div>)}</div>
        <p className="gift-copy-status" role="status" aria-live="polite">{status}</p>
      </div>
    </div>
  </div>;
}

export function WeddingGift() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const copy = wedding.giftSettings;
  return <section className="gift-section section-shell" id="qua-mung" aria-labelledby="gift-section-title">
    <Reveal delay={0}>
      <div className="gift-love-card">
        <span className="gift-love-icon" aria-hidden="true"><Gift size={42} strokeWidth={1} /></span>
        <h2 id="gift-section-title">{copy.title}</h2>
        <p>{copy.description}</p>
        <button type="button" className="gift-open" onClick={() => setOpen(true)} aria-haspopup="dialog">{copy.openLabel}<ArrowUpRight size={17} aria-hidden="true" /></button>
      </div>
    </Reveal>
    {open && <InvitationPortal><GiftDialog close={close} /></InvitationPortal>}
  </section>;
}
