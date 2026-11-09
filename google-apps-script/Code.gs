/* Bound to the private response spreadsheet. See GOOGLE_SHEETS_RSVP.md. */
var RSVP_HEADERS = ["Thời gian nhận", "Họ tên", "Bên mời", "Tham dự", "Số người", "Lời nhắn", "Mã gửi", "Dấu kiểm tra"];
var RSVP_UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;

function allowedOrigins_() {
  return (PropertiesService.getScriptProperties().getProperty("ALLOWED_ORIGINS") || "")
    .split(",").map(function (origin) { return origin.trim(); }).filter(Boolean);
}

function setupRSVP() {
  var origins = allowedOrigins_();
  if (!origins.length || origins.some(function (origin) {
    return !/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(origin) && !/^http:\/\/(localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin);
  })) throw new Error("Set ALLOWED_ORIGINS to comma-separated website origins, without paths or trailing slashes.");
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error("Open this script using Extensions > Apps Script from the response spreadsheet.");
  var sheet = book.getSheetByName("RSVP");
  if (!sheet) {
    var first = book.getSheets()[0];
    sheet = book.getSheets().length === 1 && first.getLastRow() === 0 ? first.setName("RSVP") : book.insertSheet("RSVP");
  }
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setValues([RSVP_HEADERS]);
  assertHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setFontWeight("bold").setBackground("#eae8dc");
  sheet.hideColumns(7, 2);
  book.setSpreadsheetTimeZone("Asia/Ho_Chi_Minh");
  PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", book.getId());
  SpreadsheetApp.flush();
}

function assertHeaders_(sheet) {
  var headers = sheet.getRange(1, 1, 1, RSVP_HEADERS.length).getValues()[0];
  if (JSON.stringify(headers) !== JSON.stringify(RSVP_HEADERS)) throw new Error("Unexpected RSVP columns. Restore the documented header order before accepting responses.");
}

function doGet() {
  return HtmlService.createHtmlOutput("<p>Wedding RSVP endpoint. Submit from the wedding invitation.</p>");
}

function doPost(event) {
  var input;
  try {
    var raw = event && event.parameter && event.parameter.payload;
    if (typeof raw !== "string" || raw.length > 8000) throw new Error("INVALID_INPUT");
    input = JSON.parse(raw);
    if (!input || typeof input !== "object" || allowedOrigins_().indexOf(input.clientOrigin) === -1 || typeof input.nonce !== "string" || typeof input.submissionId !== "string" || !RSVP_UUID.test(input.nonce) || !RSVP_UUID.test(input.submissionId)) throw new Error("INVALID_INPUT");
  } catch (_) {
    return HtmlService.createHtmlOutput("<p>Invalid RSVP request.</p>");
  }
  var result = {
    type: "wedding-rsvp-result", version: 1, nonce: input.nonce,
    submissionId: input.submissionId, ok: false,
  };
  try {
    var details = validateRSVP_(input);
    saveRSVP_(input.submissionId, details);
    result.ok = true;
  } catch (error) {
    // Do not send spreadsheet details or guest information back to the browser.
    result.code = error.message === "INVALID_INPUT" ? "INVALID_INPUT" : "NOT_SAVED";
  }
  return replyRSVP_(result, input.clientOrigin);
}

function validateRSVP_(input) {
  if (input.version !== 1 || typeof input.guestName !== "string" || typeof input.message !== "string" || typeof input.attending !== "boolean" || (input.side !== "nhatrai" && input.side !== "nhagai") || input.website !== "") throw new Error("INVALID_INPUT");
  var name = input.guestName.normalize("NFC").replace(/\s+/g, " ").trim();
  var message = input.message.normalize("NFC").trim();
  if (!name || name.length > 100 || /\p{Cc}/u.test(name) || message.length > 500 || /\p{Cc}/u.test(message.replace(/[\n\r\t]/g, ""))) throw new Error("INVALID_INPUT");
  if (!Number.isInteger(input.guestCount) || (input.attending ? input.guestCount < 1 || input.guestCount > 10 : input.guestCount !== 0)) throw new Error("INVALID_INPUT");
  return { guestName: name, side: input.side, attending: input.attending, guestCount: input.guestCount, message: message };
}

function sheetText_(text) {
  // Guest-entered text must never become a spreadsheet formula.
  return /^[=+@-]/.test(text) ? "'" + text : text;
}

function saveRSVP_(submissionId, details) {
  var spreadsheetId = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
  if (!spreadsheetId) throw new Error("NOT_CONFIGURED");
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName("RSVP");
    if (!sheet) throw new Error("NOT_CONFIGURED");
    assertHeaders_(sheet);
    var hash = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, JSON.stringify(details), Utilities.Charset.UTF_8));
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var previous = sheet.getRange(2, 7, lastRow - 1, 1).createTextFinder(submissionId).matchEntireCell(true).useRegularExpression(false).findNext();
      if (previous) {
        if (sheet.getRange(previous.getRow(), 8).getValue() !== hash) throw new Error("CONFLICT");
        return; // Same submission, same contents: already saved, acknowledge it.
      }
    }
    var row = lastRow + 1;
    var maxRows = sheet.getMaxRows();
    if (row > maxRows) sheet.insertRowsAfter(maxRows, row - maxRows);
    sheet.getRange(row, 2, 1, 3).setNumberFormat("@");
    sheet.getRange(row, 6, 1, 3).setNumberFormat("@");
    sheet.getRange(row, 1, 1, RSVP_HEADERS.length).setValues([[
      new Date(), sheetText_(details.guestName), details.side === "nhagai" ? "Nhà gái" : "Nhà trai",
      details.attending ? "Có" : "Không", details.guestCount, sheetText_(details.message), submissionId, hash,
    ]]);
    sheet.getRange(row, 1).setNumberFormat("dd/MM/yyyy HH:mm:ss");
    SpreadsheetApp.flush();
    var written = sheet.getRange(row, 7, 1, 2).getValues()[0];
    if (written[0] !== submissionId || written[1] !== hash) throw new Error("WRITE_UNCONFIRMED");
  } finally {
    lock.releaseLock();
  }
}

function replyRSVP_(result, origin) {
  // Only controlled result fields enter this HTML. Escape script delimiters too.
  var payload = JSON.stringify(result).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  var target = JSON.stringify(origin).replace(/</g, "\\u003c");
  var html = '<!doctype html><meta charset="utf-8"><script>' +
    '(function(){var message=' + payload + ',origin=' + target + ';' +
    'var ancestor=window;for(var i=0;i<10;i++){if(ancestor===ancestor.parent)break;ancestor=ancestor.parent;ancestor.postMessage(message,origin);}})();' +
    '</script>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
