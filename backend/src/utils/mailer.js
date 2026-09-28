import { env } from './env.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';


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
