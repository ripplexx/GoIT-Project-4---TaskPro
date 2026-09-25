import { sendMail } from '../utils/mailer.js';
import { env } from '../utils/env.js';

export async function sendHelpController(req, res) {
  const { email, comment } = req.body;

  await sendMail({
    to: env('HELP_RECIPIENT_EMAIL'),
    replyTo: email,
    subject: 'TaskPro — Need help request',
    text: `From: ${email}\n\n${comment}`,
  });

  res.json({ status: 200, message: 'Help request received', data: { ok: true } });
}
