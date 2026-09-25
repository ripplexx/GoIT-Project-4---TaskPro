import { env } from './env.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

// SMTP portları (587/465/25) çoğu PaaS'ta (Render dahil) spam'i önlemek için
// engellenip bağlantı sessizce askıda kalıyor; Brevo'nun HTTPS API'si aynı işi
// 443 üzerinden yapıyor ve hiçbir platformda bloklanmıyor.
export async function sendMail({ to, replyTo, subject, text }) {
  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'api-key': env('BREVO_API_KEY'),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: env('MAIL_FROM') },
      to: [{ email: to }],
      replyTo: { email: replyTo },
      subject,
      textContent: text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Brevo API request failed (${res.status}): ${body}`);
  }
}
