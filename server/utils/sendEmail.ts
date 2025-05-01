import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface SendEmailOptions {
  email: string | string[];
  subject: string;
  message?: string; // Optional text version
  html: string;
  attachments?: Mail.Attachment[];
}

const sendEmail = async (options: SendEmailOptions): Promise<any> => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST as string,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER as string,
      pass: process.env.SMTP_PASS as string,
    },
  });

  // Create email template
  const message: Mail.Options = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message, // Use text if provided
    html: options.html,
  };

  // Add attachments if any
  if (options.attachments) {
    message.attachments = options.attachments;
  }

  try {
    // Send email
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Consider using a more specific error type or logging framework
    throw new Error('Email could not be sent');
  }
};

interface EmailTemplate {
  subject: string;
  html: string;
}

// Email templates
const emailTemplates = {
  welcome: (name: string): EmailTemplate => ({
    subject: 'Welcome to School Management System',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining our school management system.</p>
      <p>You can now access all features of the platform.</p>
    `,
  }),

  resetPassword: (resetUrl: string): EmailTemplate => ({
    subject: 'Password Reset Request',
    html: `
      <h1>Password Reset Request</h1>
      <p>You are receiving this email because you (or someone else) has requested to reset your password.</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  }),

  announcement: (title: string, content: string): EmailTemplate => ({
    subject: `New Announcement: ${title}`,
    html: `
      <h1>${title}</h1>
      <div>${content}</div>
    `,
  }),

  // Consider using a Date object for 'date' parameter for better type safety
  attendance: (studentName: string, date: string | Date, status: string): EmailTemplate => ({
    subject: 'Attendance Update',
    html: `
      <h1>Attendance Update</h1>
      <p>Student: ${studentName}</p>
      <p>Date: ${new Date(date).toLocaleDateString()}</p>
      <p>Status: ${status}</p>
    `,
  }),

  // Consider using a Date object for 'dueDate' parameter
  feeReminder: (studentName: string, amount: number | string, dueDate: string | Date): EmailTemplate => ({
    subject: 'Fee Payment Reminder',
    html: `
      <h1>Fee Payment Reminder</h1>
      <p>Student: ${studentName}</p>
      <p>Amount Due: ${amount}</p>
      <p>Due Date: ${new Date(dueDate).toLocaleDateString()}</p>
      <p>Please ensure timely payment to avoid late fees.</p>
    `,
  }),
};

// Use ES module export
export {
  sendEmail,
  emailTemplates,
  SendEmailOptions, // Exporting the interface might be useful
  EmailTemplate // Exporting the interface might be useful
};