# NextGen Developer — Website

Premium single-page site for a software agency, built with Node.js + Express serving static HTML/CSS/vanilla JS.

## Run locally

```bash
npm install
npm start
```

Then open http://localhost:3000

## Edit key things

- **WhatsApp number**: `public/js/main.js` → `WHATSAPP_NUMBER` (digits only, no `+`).
- **Logo**: swap the inline SVG in `views/index.html` (`.brand-mark`) and `public/images/favicon.svg` for your own logo file.
- **Displayed email/phone**: `views/index.html`, in the contact section (`<div class="contact-detail">`) and again in the footer (`Contact` column).
- **Copy / pricing / services**: all in `views/index.html`.
- **Colors / type**: CSS variables at the top of `public/css/style.css`.

## Receiving contact form messages by email

The form posts to `/api/contact`, which sends an email via Nodemailer. To turn this on:

1. Copy `.env.example` to a new file named `.env` in the project root.
2. Fill in:
   - `SMTP_USER` — the Gmail address that will send the notification
   - `SMTP_PASS` — a **Gmail App Password** (not your normal password — generate one at https://myaccount.google.com/apppasswords, requires 2-Step Verification to be on)
   - `CONTACT_EMAIL` — the inbox that should actually receive the messages (can be the same as `SMTP_USER` or different)
3. Restart the server (`npm start`).

Using a different email provider instead of Gmail? Open `routes/index.js` and replace the `service: 'gmail'` transporter config with your provider's SMTP `host`/`port` settings — Nodemailer's docs cover this for any SMTP provider.

If `.env` isn't set up yet, the form still works and logs submissions to the terminal — it just won't email anyone until you configure it.

## Structure

```
app.js
package.json
routes/index.js
views/index.html
public/css/style.css
public/js/main.js
public/images/favicon.svg
```
