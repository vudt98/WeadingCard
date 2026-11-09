import { describe, expect, it } from "vitest";
import { isRSVPEndpoint, isRSVPReply, normalizeRSVP, type RSVPDetails, type RSVPRequest } from "./rsvp";

const details: RSVPDetails = { guestName: "  Nguyễn   Minh  ", side: "nhagai", attending: true, guestCount: 3, message: " Chúc hạnh phúc! " };
const request: RSVPRequest = { ...details, version: 1, submissionId: "a1111111-1111-4111-8111-111111111111", nonce: "b1111111-1111-4111-8111-111111111111", clientOrigin: "https://example.com", website: "" };
const reply = { type: "wedding-rsvp-result", version: 1, submissionId: request.submissionId, nonce: request.nonce, ok: true };

describe("RSVP validation and acknowledgement", () => {
  it("normalizes names and records zero guests for a decline", () => {
    expect(normalizeRSVP(details)).toEqual({ ...details, guestName: "Nguyễn Minh", message: "Chúc hạnh phúc!" });
    expect(normalizeRSVP({ ...details, attending: false, guestCount: 3 }).guestCount).toBe(0);
  });
  it.each([0, 11, 1.5, NaN])("rejects invalid attending count %s", guestCount => {
    expect(() => normalizeRSVP({ ...details, guestCount })).toThrow();
  });
  it("rejects blank/oversized names and notes", () => {
    expect(() => normalizeRSVP({ ...details, guestName: "  " })).toThrow();
    expect(() => normalizeRSVP({ ...details, guestName: "a".repeat(101) })).toThrow();
    expect(() => normalizeRSVP({ ...details, message: "a".repeat(501) })).toThrow();
    expect(() => normalizeRSVP({ ...details, message: "a\u0000b" })).toThrow();
    expect(normalizeRSVP({ ...details, message: "Chúc mừng!\nHạnh phúc nhé." }).message).toContain("\n");
  });
  it("only enables published HTTPS Google Apps Script exec URLs", () => {
    expect(isRSVPEndpoint("https://script.google.com/macros/s/AKfy-test_123/exec")).toBe(true);
    for (const endpoint of ["", "https://example.com/exec", "http://script.google.com/macros/s/test/exec", "https://script.google.com/macros/s/test/dev", "https://script.google.com/macros/s/test/exec?x=1", "https://user@script.google.com/macros/s/test/exec"]) expect(isRSVPEndpoint(endpoint)).toBe(false);
  });
  it("accepts Google's nested sandbox acknowledgement only with matching request identifiers", () => {
    expect(isRSVPReply({ origin: "https://n-test-script.googleusercontent.com", data: reply }, request)).toBe(true);
    expect(isRSVPReply({ origin: "https://script.google.com", data: reply }, request)).toBe(true);
    for (const origin of ["null", "http://script.google.com", "https://script.google.com.attacker.com", "https://attacker.googleusercontent.com", "https://script.google.com:8443"]) expect(isRSVPReply({ origin, data: reply }, request)).toBe(false);
    for (const data of [null, {}, { ...reply, nonce: "wrong" }, { ...reply, submissionId: "wrong" }, { ...reply, ok: "true" }, { ...reply, type: "other" }, { ...reply, version: 2 }]) expect(isRSVPReply({ origin: "https://script.google.com", data }, request)).toBe(false);
    expect(isRSVPReply({ origin: "https://script.google.com", data: { ...reply, ok: false } }, request)).toBe(true);
  });
});
