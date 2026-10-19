import { describe, expect, it } from "vitest";
import {
  calendarUrl,
  countdownParts,
  createInvitationUrl,
  formatDate,
  normalizeGuest,
  numericDateParts,
  parseInvitation,
} from "./invitation";
import { wedding } from "../config/wedding";

describe("invitation personalization", () => {
  it("decodes Vietnamese names and selects the requested family", () => {
    expect(
      parseInvitation(
        "?guest=B%E1%BA%A1n+Long+v%C3%A0+gia+%C4%91%C3%ACnh+nh%E1%BB%8F&ben=nhagai&fbclid=unused",
      ),
    ).toEqual({ guest: "Bạn Long và gia đình nhỏ", side: "nhagai" });
  });
  it("uses safe defaults for absent, empty and invalid values", () => {
    expect(parseInvitation("")).toEqual({
      guest: "Quý khách",
      side: "nhatrai",
    });
    expect(parseInvitation("?guest=+++&ben=bad")).toEqual({
      guest: "Quý khách",
      side: "nhatrai",
    });
  });
  it("normalizes whitespace, strips controls and limits Unicode code points", () => {
    expect(normalizeGuest("  Gia   đình\u0000   Linh  ")).toBe("Gia đình Linh");
    expect([...normalizeGuest("💚".repeat(120))]).toHaveLength(100);
    expect(normalizeGuest("Linh\u0300")).toBe("Linh̀".normalize("NFC"));
  });
  it("preserves hostile text literally instead of interpreting markup", () => {
    expect(
      parseInvitation("?guest=%3Cimg%20src=x%20onerror=alert(1)%3E").guest,
    ).toBe("<img src=x onerror=alert(1)>");
  });
  it("round-trips personal links, preserves a repository subpath, strips trackers", () => {
    const result = new URL(
      createInvitationUrl(
        "https://example.github.io/wedding/?fbclid=x#album",
        "Bạn Long & gia đình",
        "nhagai",
      ),
    );
    expect(result.pathname).toBe("/wedding/");
    expect(result.searchParams.get("guest")).toBe("Bạn Long & gia đình");
    expect(result.searchParams.get("ben")).toBe("nhagai");
    expect(result.searchParams.has("fbclid")).toBe(false);
    expect(result.hash).toBe("");
  });
});
describe("wedding timezone and calendar", () => {
  it("keeps decorative dates numeric in the wedding timezone", () => {
    expect(numericDateParts("2027-01-09T18:00:00Z")).toEqual({
      day: "10",
      month: "01",
      year: "2027",
    });
  });
  it("computes the countdown against an absolute +07:00 instant", () => {
    expect(
      countdownParts(
        "2027-01-10T17:00:00+07:00",
        Date.parse("2027-01-09T08:58:57Z"),
      ),
    ).toEqual([1, 1, 1, 3]);
  });
  it("never shows negative time after the wedding", () => {
    expect(
      countdownParts(
        "2027-01-10T17:00:00+07:00",
        Date.parse("2027-01-11T00:00:00Z"),
      ),
    ).toEqual([0, 0, 0, 0]);
  });
  it("renders local time and builds side-specific UTC calendar links", () => {
    expect(
      formatDate(wedding.events.nhatrai.dateTimeISO, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    ).toBe("17:00");
    const url = new URL(calendarUrl(wedding.events.nhagai, "Anh & Linh"));
    expect(url.searchParams.get("dates")).toBe(
      "20270109T040000Z/20270109T070000Z",
    );
    expect(url.searchParams.get("location")).toContain("Park Hyatt");
  });
});
