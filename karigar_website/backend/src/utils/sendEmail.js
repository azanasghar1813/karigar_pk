const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html, text }) => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587;
  const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

  if (!user || !pass) {
    console.warn('\n⚠️ [NODEMAILER WARNING]: EMAIL_USER / EMAIL_PASS not configured in .env.');
    console.log(`[SIMULATED EMAIL TO ${to}]:`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${text || html}\n`);
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Karigar PK" <${user}>`,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent to ${to} (MessageId: ${info.messageId})`);
  return { success: true, messageId: info.messageId };
};

module.exports = sendEmail;
