import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create a reusable transporter object using Gmail SMTP service
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Food Express " <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};