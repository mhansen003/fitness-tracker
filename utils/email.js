const nodemailer = require('nodemailer');

/**
 * Send password reset email
 * NOTE: You'll need to configure email service credentials in .env
 */
async function sendPasswordResetEmail(email, resetToken) {
  // Create a test account if no email service is configured
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASS || testAccount.pass,
    },
  });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Fitness Tracker" <noreply@fitnesstracker.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Fitness Tracker account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  // Log preview URL for development (using Ethereal)
  if (process.env.NODE_ENV !== 'production') {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }

  return info;
}

module.exports = {
  sendPasswordResetEmail
};
