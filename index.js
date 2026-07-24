const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Reusable transporter — reads credentials from environment variables (.env)
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // swap for a different SMTP provider if you're not using Gmail
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Contact form receiver — sends an email to CONTACT_EMAIL
router.post('/api/contact', async (req, res) => {
  const { name, email, phone, company, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'Name, email, and message are required.' });
  }

  console.log('New inquiry received:', { name, email, phone, company, service });

  if (!transporter || !process.env.CONTACT_EMAIL) {
    // Email isn't configured yet — request still succeeds so the form doesn't break,
    // but nothing is emailed. See .env.example to enable this.
    console.warn('Email not sent: SMTP_USER, SMTP_PASS, or CONTACT_EMAIL missing from .env');
    return res.json({ ok: true, message: 'Thanks — your message has been received. We will reply within 24 hours.' });
  }

  try {
    await transporter.sendMail({
      from: `"NextGen Developer Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${name}${service ? ` — ${service}` : ''}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        `Company: ${company || '—'}`,
        `Service: ${service || '—'}`,
        '',
        'Message:',
        message
      ].join('\n')
    });

    res.json({ ok: true, message: 'Thanks — your message has been received. We will reply within 24 hours.' });
  } catch (err) {
    console.error('Email send failed:', err.message);
    res.status(500).json({ ok: false, error: 'Message received but the email notification failed. We still logged your inquiry.' });
  }
});

// robots.txt
router.get('/robots.txt', (req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n');
});

// sitemap.xml
router.get('/sitemap.xml', (req, res) => {
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>`);
});

module.exports = router;
