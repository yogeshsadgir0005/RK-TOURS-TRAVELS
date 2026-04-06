import sendBrevoEmail from '../config/brevo.js';
export const sendOTP = async (email, otp) => {
  const content = `<p>Your Cab Booking verification OTP is: <strong>${otp}</strong>. It expires in 10 minutes.</p>`;
  await sendBrevoEmail(email, 'Your Verification OTP', content);
}; 