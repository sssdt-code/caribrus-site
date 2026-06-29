const SHEET_NAME = "Leads";

function doPost(event) {
  const payload = parsePayload(event);
  const sheet = getLeadSheet();
  ensureHeader(sheet);

  sheet.appendRow([
    new Date(),
    payload.caseId || "",
    payload.name || "",
    payload.email || "",
    payload.country || "",
    payload.goal || "",
    payload.message || "",
    payload.caseProgress || "",
    payload.caseChecklist || "",
    payload.source || "",
    payload.submittedAt || ""
  ]);

  notifyTelegram(payload);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function parsePayload(event) {
  if (!event || !event.postData || !event.postData.contents) return {};
  try {
    return JSON.parse(event.postData.contents);
  } catch (error) {
    return event.parameter || {};
  }
}

function getLeadSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeader(sheet) {
  if (sheet.getLastRow() > 0) return;
  sheet.appendRow([
    "Received At",
    "Case ID",
    "Name",
    "Email",
    "Country",
    "Goal",
    "Message",
    "Case Progress",
    "Case Checklist",
    "Source",
    "Submitted At"
  ]);
}

function notifyTelegram(payload) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty("TELEGRAM_BOT_TOKEN");
  const chatId = props.getProperty("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return;

  const text = [
    "New CaribRus lead",
    "Case: " + (payload.caseId || "Pending"),
    "Name: " + (payload.name || ""),
    "Email: " + (payload.email || ""),
    "Country: " + (payload.country || ""),
    "Goal: " + (payload.goal || ""),
    "Progress: " + (payload.caseProgress || "35") + "%",
    "Message: " + (payload.message || "Not provided")
  ].join("\n");

  UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/sendMessage", {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    }),
    muteHttpExceptions: true
  });
}
