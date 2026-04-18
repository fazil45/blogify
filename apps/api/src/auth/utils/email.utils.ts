import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"TradingApp" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
    });
  } catch (err) {
    console.error("Email failed to send:", err);
  }
};

export const emailVerificationTemplate = (
  username: string,
  verificationUrl: string,
): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; ">
    <h2 style="color: #22BC66;">Welcome to TradingApp, ${username}!</h2>
    <p>We're excited to have you on board. Please verify your email to get started.</p>
    <a href="${verificationUrl}" 
       style="display: inline-block; padding: 12px 24px; background-color: #22BC66; 
              color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
      Verify your email
    </a>
    <p>Or copy this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
    <p>This link expires in 24 hours.</p>
    <p>Need help? Just reply to this email.</p>
  </div>
`;

export const forgotPasswordTemplate = (
  username: string,
  resetUrl: string,
): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #22BC66;">Reset your password, ${username}</h2>
    <p>We got a request to reset the password of your account.</p>
    <a href="${resetUrl}" 
       style="display: inline-block; padding: 12px 24px; background-color: #22BC66; 
              color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
      Reset password
    </a>
    <p>Or copy this link: <a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link expires in 1 hour.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
  </div>
`;
