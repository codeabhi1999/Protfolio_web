import nodemailer from 'nodemailer';

export const sendNotificationEmail = async (messageData) => {
  const { name, email, phone, subject, message } = messageData;
  const adminEmail = process.env.ADMIN_EMAIL || 'abhijeet.chavan.dev@gmail.com';

  // Check if SMTP settings are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_HOST) {
    console.warn('WARNING: SMTP settings are not fully configured in .env. Logging email to console instead:');
    console.log(`
==================================================
EMAIL NOTIFICATION TO: ${adminEmail}
--------------------------------------------------
Sender Name: ${name}
Sender Email: ${email}
Sender Phone: ${phone || 'N/A'}
Subject: ${subject}
Message:
${message}
==================================================
    `);
    return { success: true, loggedToConsole: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${name} (Portfolio)" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px; max-width: 600px;">
          <h2 style="color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px;">New Contact Message Received</h2>
          <table style="width: 100%; margin-top: 15px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #4F46E5; border-radius: 4px;">
            <h4 style="margin-top: 0; margin-bottom: 10px; color: #374151;">Message Content:</h4>
            <p style="white-space: pre-wrap; margin: 0; color: #4B5563; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 25px; font-size: 0.85em; color: #9CA3AF; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
            This email was sent automatically from your MERN Portfolio Website contact form.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Nodemailer Error:', error.message);
    // Don't crash backend execution, return failure state so controller can handle
    return { success: false, error: error.message };
  }
};
