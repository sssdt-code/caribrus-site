# CaribRus CRM Setup

This static site can send leads to Google Sheets through Google Apps Script.

## 1. Create the Sheet

Create a Google Sheet named `CaribRus Leads`.

## 2. Add Apps Script

Open the Sheet, then:

Extensions -> Apps Script

Paste the contents of `apps-script-crm.js`.

## 3. Optional Telegram Alerts

In Apps Script:

Project Settings -> Script properties

Add:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Do not add the bot token to `index.html`, GitHub, or any public file.

If these are not set, leads still go to Google Sheets.

To get `TELEGRAM_CHAT_ID`:

1. Open your Telegram bot and send `/start`.
2. Open the Telegram `getUpdates` URL for your bot in a private browser tab.
3. Find `message.chat.id` in the JSON response.
4. Save that number as `TELEGRAM_CHAT_ID` in Apps Script properties.

## 4. Deploy Web App

Deploy -> New deployment -> Web app

Use:

- Execute as: Me
- Who has access: Anyone

Copy the Web app URL and set it in `index.html`:

```js
const endpoint = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";
```

## 5. Test

Submit the form from `https://caribrus.com`.

Expected:

- A row appears in the `Leads` sheet.
- A Telegram message arrives if bot settings are configured.
- If the request fails, the browser stores a local backup in `localStorage`.
