import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Heart, Send } from "lucide-react";
import { wedding, type WeddingSide } from "../config/wedding";
import { Reveal } from "./Reveal";
import { isRSVPEndpoint, normalizeRSVP, sendRSVP } from "../utils/rsvp";
export function RSVPForm({ guest = "", side = "nhatrai" }: { guest?: string; side?: WeddingSide }) {
  const id = useId();
  const [attending, setAttending] = useState(true);
  const [name, setName] = useState(guest === wedding.ui.defaultGuest ? "" : guest);
  const [count, setCount] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error" | "invalid">("idle");
  const [submittedSide, setSubmittedSide] = useState(side);
  const controller = useRef<AbortController | null>(null);
  const attempt = useRef<{ key: string; submissionId: string } | null>(null);
  const copy = wedding.rsvp;
  const configured = isRSVPEndpoint(copy.endpoint);
  const busy = status === "sending";
  const saved = status === "success";
  useEffect(() => () => controller.current?.abort(), []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || controller.current || saved) return;
    const form = event.currentTarget;
    let details;
    try {
      details = normalizeRSVP({ guestName: name, side, attending, guestCount: Number(count), message });
    } catch {
      setStatus("invalid");
      form.querySelector<HTMLInputElement>('input[name="guestName"]')?.focus();
      return;
    }
    const active = new AbortController();
    controller.current = active;
    setSubmittedSide(side);
    setStatus("sending");
    try {
      const key = JSON.stringify(details);
      if (attempt.current?.key !== key) attempt.current = { key, submissionId: crypto.randomUUID() };
      await sendRSVP(copy.endpoint, {
        ...details, version: 1, submissionId: attempt.current.submissionId,
        nonce: crypto.randomUUID(), clientOrigin: window.location.origin,
        website: String(new FormData(form).get("website") ?? ""),
      }, active.signal);
      if (!active.signal.aborted) setStatus("success");
    } catch {
      if (!active.signal.aborted) setStatus("error");
    } finally {
      if (controller.current === active) controller.current = null;
    }
  }
  return (
    <section className="rsvp-section section-shell" id="hoi-am" aria-labelledby={`${id}-title`}>
      <Reveal delay={0}>
        <form className="rsvp-paper" onSubmit={submit} aria-describedby={`${id}-availability`} aria-busy={busy}>
          <header className="rsvp-header">
            <Heart className="rsvp-heart" size={22} strokeWidth={1.2} aria-hidden="true" />
            <h2 id={`${id}-title`}>{copy.title}</h2>
            <p className="rsvp-introduction">{copy.introduction}</p>
            <p className="rsvp-side">{wedding.events[busy || saved ? submittedSide : side].title}</p>
          </header>
          <fieldset className="rsvp-controls" disabled={busy || saved}>
          <div className="rsvp-field">
            <label htmlFor={`${id}-name`}>{copy.nameLabel}</label>
            <input id={`${id}-name`} name="guestName" autoComplete="name" placeholder={copy.namePlaceholder} value={name} onChange={event => setName(event.target.value)} required maxLength={100} />
          </div>
          <fieldset className="rsvp-attendance">
            <legend>{copy.attendanceLabel}</legend>
            <div className="rsvp-attendance-options">
              <label className={attending ? "is-selected" : ""}><input type="radio" name={`${id}-attendance`} value="yes" checked={attending} onChange={() => setAttending(true)} /><span>{copy.attendingLabel}</span></label>
              <label className={!attending ? "is-selected" : ""}><input type="radio" name={`${id}-attendance`} value="no" checked={!attending} onChange={() => setAttending(false)} /><span>{copy.declinedLabel}</span></label>
            </div>
          </fieldset>
          {attending && <div className="rsvp-field">
            <label htmlFor={`${id}-count`}>{copy.countLabel}</label>
            <select id={`${id}-count`} name="guestCount" required value={count} onChange={event => setCount(event.target.value)} aria-describedby={`${id}-count-hint`}>
              <option value="" disabled>{copy.countPlaceholder}</option>
              {Array.from({ length: 10 }, (_, index) => index + 1).map(count => <option key={count} value={count}>{count} {copy.personLabel}</option>)}
            </select>
            <small id={`${id}-count-hint`}>{copy.countHint}</small>
          </div>}
          <div className="rsvp-field">
            <label htmlFor={`${id}-note`}>{copy.noteLabel} <span>({copy.optionalLabel})</span></label>
            <textarea id={`${id}-note`} name="message" rows={2} maxLength={500} placeholder={copy.notePlaceholder} value={message} onChange={event => setMessage(event.target.value)} />
          </div>
          </fieldset>
          <div className="rsvp-honeypot" aria-hidden="true" inert>
            <label htmlFor={`${id}-website`}>{copy.honeypotLabel}</label>
            <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button className="rsvp-submit" type="submit" disabled={!configured || busy || saved} aria-describedby={`${id}-availability`}><Send size={16} aria-hidden="true" />{busy ? copy.sendingLabel : copy.submitLabel}</button>
          <p className="rsvp-availability" id={`${id}-availability`}>{configured ? copy.privacyNote : copy.unavailableNote}</p>
          <p className={`rsvp-feedback rsvp-feedback-${status}`} role={status === "error" || status === "invalid" ? "alert" : "status"}>
            {saved ? copy.successMessage : status === "error" ? copy.errorMessage : status === "invalid" ? copy.invalidMessage : busy ? copy.sendingLabel : ""}
          </p>
        </form>
      </Reveal>
    </section>
  );
}
