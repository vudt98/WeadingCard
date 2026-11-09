import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("../../google-apps-script/Code.gs", import.meta.url), "utf8");
const request = { version: 1, submissionId: "a1111111-1111-4111-8111-111111111111", nonce: "b1111111-1111-4111-8111-111111111111", clientOrigin: "https://example.com", guestName: "Nguyễn Minh", side: "nhagai", attending: true, guestCount: 2, message: "Chúc mừng!", website: "" };

function backend(maxRows = 1000) {
  const rows: unknown[][] = [];
  const props: Record<string, string> = { ALLOWED_ORIGINS: "https://example.com" };
  let flushFails = false, locked = false;
  function range(row: number, col: number, height = 1, width = 1) {
    if (row + height - 1 > maxRows) throw new Error("test range exceeds sheet grid");
    const api = {
      getValues: () => Array.from({ length: height }, (_, r) => Array.from({ length: width }, (_, c) => rows[row - 1 + r]?.[col - 1 + c] ?? "")),
      getValue: () => rows[row - 1]?.[col - 1] ?? "",
      setValues: (values: unknown[][]) => { values.forEach((valuesRow, r) => { rows[row - 1 + r] ??= []; valuesRow.forEach((v, c) => { rows[row - 1 + r][col - 1 + c] = v; }); }); return api; },
      setNumberFormat: () => api, setFontWeight: () => api, setBackground: () => api,
      createTextFinder: (text: string) => {
        const finder = {
          matchEntireCell: () => finder, useRegularExpression: () => finder,
          findNext: () => { for (let r = row - 1; r < row - 1 + height; r++) if (rows[r]?.[col - 1] === text) return { getRow: () => r + 1 }; return null; },
        };
        return finder;
      },
    };
    return api;
  }
  const sheet = { getLastRow: () => rows.length, getMaxRows: () => maxRows, insertRowsAfter: (_row: number, count: number) => { maxRows += count; }, getRange: range, setFrozenRows: () => {}, hideColumns: () => {} };
  const book = { getSheetByName: () => sheet, getId: () => "private-sheet-id", setSpreadsheetTimeZone: () => {} };
  const context = createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => props[key], setProperty: (key: string, value: string) => { props[key] = value; } }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => book, openById: () => book, flush: () => { if (flushFails) throw new Error("test flush failure"); } },
    LockService: { getScriptLock: () => ({ waitLock: () => { if (locked) throw new Error("test lock timeout"); locked = true; }, releaseLock: () => { locked = false; } }) },
    Utilities: { DigestAlgorithm: { SHA_256: "sha256" }, Charset: { UTF_8: "utf8" }, computeDigest: (_algorithm: string, text: string) => createHash("sha256").update(text).digest(), base64EncodeWebSafe: (bytes: Uint8Array) => Buffer.from(bytes).toString("base64url") },
    HtmlService: { XFrameOptionsMode: { ALLOWALL: "ALLOWALL" }, createHtmlOutput: (html: string) => ({ html, setXFrameOptionsMode() { return this; } }) },
  });
  runInContext(source, context);
  const server = context as unknown as { setupRSVP(): void; doPost(event: unknown): { html: string } };
  server.setupRSVP();
  return {
    rows, props, locked: () => locked,
    failFlush: (value: boolean) => { flushFails = value; },
    post: (input: unknown) => server.doPost({ parameter: { payload: JSON.stringify(input) } }).html,
    result: (input: unknown) => {
      const html = server.doPost({ parameter: { payload: JSON.stringify(input) } }).html;
      const match = html.match(/var message=(.*?),origin=/);
      return match ? JSON.parse(match[1]) as { ok: boolean; submissionId: string; code?: string } : null;
    },
  };
}

describe("Apps Script response persistence (real Code.gs, mocked Google services)", () => {
  it("writes one row with the expected columns and acknowledges the saved ID", () => {
    const b = backend();
    expect(b.result(request)).toMatchObject({ ok: true, submissionId: request.submissionId });
    expect(b.rows).toHaveLength(2);
    expect(b.rows[1].slice(1, 7)).toEqual(["Nguyễn Minh", "Nhà gái", "Có", 2, "Chúc mừng!", request.submissionId]);
    expect(b.locked()).toBe(false);
  });
  it("deduplicates identical retries and rejects a reused ID with different contents", () => {
    const b = backend();
    expect(b.result(request)?.ok).toBe(true);
    expect(b.result({ ...request, nonce: "c1111111-1111-4111-8111-111111111111" })?.ok).toBe(true);
    expect(b.result({ ...request, guestCount: 3 })?.ok).toBe(false);
    expect(b.rows).toHaveLength(2);
  });
  it("extends the sheet when all existing grid rows are used", () => {
    const b = backend(1);
    expect(b.result(request)?.ok).toBe(true);
    expect(b.rows).toHaveLength(2);
  });
  it("never acknowledges a flush failure; safely acknowledges retry after a persisted write", () => {
    const b = backend();
    b.failFlush(true);
    expect(b.result(request)?.ok).toBe(false);
    expect(b.locked()).toBe(false);
    b.failFlush(false);
    expect(b.result(request)?.ok).toBe(true);
    expect(b.rows).toHaveLength(2);
  });
  it("stores a declined response with zero guests and protects text against formulas", () => {
    const b = backend();
    expect(b.result({ ...request, attending: false, guestCount: 0, guestName: "=NAME()", message: "=IMPORTXML(\"test\")" })?.ok).toBe(true);
    expect(b.rows[1].slice(1, 6)).toEqual(["'=NAME()", "Nhà gái", "Không", 0, "'=IMPORTXML(\"test\")"]);
  });
  it("rejects malformed, unauthorized, honeypot and invalid input without writing rows", () => {
    const b = backend();
    for (const value of [null, { ...request, clientOrigin: "https://attacker.com" }, { ...request, nonce: "bad" }]) expect(b.result(value)).toBeNull();
    for (const patch of [{ guestName: " " }, { guestName: "x".repeat(101) }, { message: "x".repeat(501) }, { guestCount: 11 }, { guestCount: 1.5 }, { guestCount: 0 }, { side: "other" }, { website: "spam" }, { version: 2 }, { attending: false, guestCount: 2 }]) expect(b.result({ ...request, ...patch })?.ok).toBe(false);
    expect(b.rows).toHaveLength(1);
  });
  it("rejects missing configuration and changed headers", () => {
    const b = backend();
    delete b.props.SPREADSHEET_ID;
    expect(b.result(request)?.ok).toBe(false);
    b.props.SPREADSHEET_ID = "private-sheet-id";
    b.rows[0][0] = "moved column";
    expect(b.result(request)?.ok).toBe(false);
    expect(b.rows).toHaveLength(1);
    expect(b.locked()).toBe(false);
  });
  it("returns an iframe acknowledgement targeted to the allowed origin without guest data", () => {
    const b = backend();
    const html = b.post(request);
    expect(html).toContain('origin="https://example.com"');
    expect(html).toContain("ancestor.postMessage(message,origin)");
    expect(html).not.toContain(request.guestName);
    expect(html).not.toContain("private-sheet-id");
  });
});
