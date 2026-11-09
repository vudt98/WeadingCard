import { wedding, type WeddingEvent, type WeddingSide } from "../config/wedding";

export const normalizeGuest = (value: string | null): string =>
  // Intentional removal of control characters from user-supplied display names.
  [
    ...(value ?? "")
      .normalize("NFC")
      .replace(/\p{Cc}/gu, "")
      .replace(/\s+/g, " ")
      .trim(),
  ]
    .slice(0, 100)
    .join("") || wedding.ui.defaultGuest;

export function parseInvitation(search: string) {
  const params = new URLSearchParams(search);
  return {
    guest: normalizeGuest(params.get("guest")),
    side: (params.get("ben") === "nhagai"
      ? "nhagai"
      : "nhatrai") as WeddingSide,
  };
}

export function createInvitationUrl(
  base: string,
  guest: string,
  side: WeddingSide,
) {
  const url = new URL(base);
  url.search = "";
  url.hash = "";
  url.searchParams.set("guest", normalizeGuest(guest));
  url.searchParams.set("ben", side);
  return url.toString();
}

export function countdownParts(dateISO: string, now = Date.now()) {
  const seconds = Math.max(
    0,
    Math.floor((new Date(dateISO).getTime() - now) / 1000),
  );
  return [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
}

export const formatDate = (iso: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    ...options,
  }).format(new Date(iso));

export function numericDateParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(iso));
  return {
    day: parts.find((p) => p.type === "day")!.value,
    month: parts.find((p) => p.type === "month")!.value,
    year: parts.find((p) => p.type === "year")!.value,
  };
}

export function calendarUrl(event: Pick<WeddingEvent, "title" | "dateTimeISO" | "venueName" | "address">, couple: string) {
  const start = new Date(event.dateTimeISO);
  const end = new Date(start.getTime() + 3 * 3600000);
  const stamp = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.title} · ${couple}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: `${event.venueName}, ${event.address}`,
    details:
      wedding.ui.calendarDescription,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Derive the month in the wedding timezone, then use UTC only for calendar math.
export function calendarMonth(iso: string) {
  const parts = numericDateParts(iso);
  const year = Number(parts.year),
    month = Number(parts.month);
  const selectedDay = Number(parts.day);
  const offset = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cells: (number | null)[] = Array.from(
    { length: Math.ceil((offset + count) / 7) * 7 },
    (_, index) =>
      index < offset || index >= offset + count ? null : index - offset + 1,
  );
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, index * 7 + 7),
  );
  return { year, month, selectedDay, weeks };
}
