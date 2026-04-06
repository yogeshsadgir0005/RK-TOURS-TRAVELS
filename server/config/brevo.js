import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: 'Cab Booking Admin', email: 'yogeshsadgir05@gmail.com' },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent,
      },
      { headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    throw new Error('Email sending failed');
  }
};
export default sendBrevoEmail;