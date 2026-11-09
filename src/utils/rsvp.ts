import type { WeddingSide } from "../config/wedding";

export interface RSVPDetails {
  guestName: string;
  side: WeddingSide;
  attending: boolean;
  guestCount: number;
  message: string;
}
export interface RSVPRequest extends RSVPDetails {
  version: 1;
  submissionId: string;
  nonce: string;
  clientOrigin: string;
  website: string;
}
export const RSVP_MESSAGE_TYPE = "wedding-rsvp-result";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

export function isRSVPEndpoint(endpoint: string): boolean {
  try {
    const url = new URL(endpoint);
    return url.origin === "https://script.google.com" && /^\/macros\/s\/[\w-]+\/exec$/.test(url.pathname) && !url.search && !url.hash && !url.username && !url.password;
  } catch { return false; }
}

export function normalizeRSVP(details: RSVPDetails): RSVPDetails {
  const guestName = details.guestName.normalize("NFC").replace(/\s+/g, " ").trim();
  const message = details.message.normalize("NFC").trim();
  if (!guestName || guestName.length > 100 || /\p{Cc}/u.test(guestName) || message.length > 500 || /\p{Cc}/u.test(message.replace(/[\n\r\t]/g, "")) || !["nhatrai", "nhagai"].includes(details.side) || typeof details.attending !== "boolean" || (details.attending && (!Number.isInteger(details.guestCount) || details.guestCount < 1 || details.guestCount > 10))) {
    throw new Error("INVALID_INPUT");
  }
  return { guestName, side: details.side, attending: details.attending, guestCount: details.attending ? details.guestCount : 0, message };
}

export function isRSVPReply(event: Pick<MessageEvent, "origin" | "data">, request: RSVPRequest): boolean {
  let origin: URL;
  try { origin = new URL(event.origin); } catch { return false; }
  const trusted = origin.protocol === "https:" && !origin.port && (origin.hostname === "script.google.com" || origin.hostname === "script.googleusercontent.com" || origin.hostname.endsWith("-script.googleusercontent.com"));
  const data = event.data;
  return trusted && data !== null && typeof data === "object" && data.type === RSVP_MESSAGE_TYPE && data.version === 1 && uuid.test(request.nonce) && data.nonce === request.nonce && data.submissionId === request.submissionId && typeof data.ok === "boolean";
}

// Native form POST + an acknowledged postMessage avoids CORS/opaque responses.
// Apps Script renders its result inside Google's sandboxed iframe, so the
// sender may be a nested frame. Match its Google origin AND a fresh nonce.
export function sendRSVP(endpoint: string, request: RSVPRequest, signal?: AbortSignal, timeoutMs = 35000): Promise<void> {
  if (!isRSVPEndpoint(endpoint)) return Promise.reject(new Error("NOT_CONFIGURED"));
  if (signal?.aborted) return Promise.reject(new Error("ABORTED"));
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    frame.name = `rsvp-${request.nonce}`;
    frame.title = "RSVP";
    frame.hidden = true;
    frame.referrerPolicy = "no-referrer";
    const form = document.createElement("form");
    form.method = "POST";
    form.action = endpoint;
    form.target = frame.name;
    form.hidden = true;
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = "payload";
    field.value = JSON.stringify(request);
    form.append(field);
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("message", receive);
      signal?.removeEventListener("abort", abort);
      form.remove();
      frame.remove();
    };
    const fail = (code: string) => { cleanup(); reject(new Error(code)); };
    const receive = (event: MessageEvent) => {
      if (!isRSVPReply(event, request)) return;
      if (event.data.ok !== true) { fail("NOT_SAVED"); return; }
      cleanup();
      resolve();
    };
    const abort = () => fail("ABORTED");
    const timer = window.setTimeout(() => fail("UNCONFIRMED"), timeoutMs);
    window.addEventListener("message", receive);
    signal?.addEventListener("abort", abort, { once: true });
    document.body.append(frame, form);
    try { form.submit(); } catch { fail("NETWORK_ERROR"); }
  });
}
