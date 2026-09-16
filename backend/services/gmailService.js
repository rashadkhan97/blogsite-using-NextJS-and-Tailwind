const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendPasswordResetEmail = async (to, resetUrl) => {
  await transporter.sendMail({
    from: process.env.GMAIL,
    to,
    subject: 'Reset your BlogSpace password',
    html: `
      <p>You requested a password reset for your BlogSpace account.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in 15 minutes. If you didn't request this, you can ignore this email.</p>
    `,
  });
};

module.exports = { sendPasswordResetEmail };
