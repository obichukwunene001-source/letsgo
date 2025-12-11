Telegram Setup & Security Guidance
=================================

✅ Updated: `script/checkout.js` now uses the token and chat id you supplied.

Security note
-------------
- Embedding a Telegram bot token directly into client-side JavaScript exposes it publicly to anyone who visits the page. This is insecure for production.
- Recommended approach: set up a small backend endpoint (e.g., `/send-telegram`) that accepts the PDF and securely stores the bot token on the server (e.g., via environment variables). The server calls the Telegram Bot API to send the file.

How to use the current client (quick test)
-----------------------------------------
1. Your token and chat id are already applied to `script/checkout.js`:
   - `TELEGRAM_BOT_TOKEN = '8284855760:AAE1e7cUOkoZ6lSwAIA56VyYuaKGqG_pGaw'`
   - `TELEGRAM_CHAT_ID = '7924234311'`
2. Open `checkout.html` in a browser and place an order. After invoice generation, during the `ORDER NOW` flow the client will attempt to `sendDocument` directly to the Telegram Bot API using this token.

Potential runtime caveat
------------------------
- Direct browser calls to the Telegram Bot API may fail due to CORS restrictions applied by Telegram. If that happens you will need to use the `BACKEND_TELEGRAM_ENDPOINT` to host a server proxy and send the PDF to Telegram from the server-side.

Server-side fallback suggestion (Node.js Express example)
--------------------------------------------------------
1. Add an endpoint `/send-telegram` that accepts a `multipart/form-data` upload.
2. On the server retrieve the file and call Telegram API using `node-fetch` or `axios`.
3. Keep your bot token in an environment variable, not in client code.

Example:
```
POST /send-telegram
- body: file (the PDF), chat_id, caption
server-side:
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
```

If you'd like, I can scaffold a minimal server endpoint to forward file uploads to Telegram and update this repo to use it (recommended). Let me know and I will implement it next.

💡 Tip: For testing, keep the token as-is in the client but rotate & remove it afterwards.
