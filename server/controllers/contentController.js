import sendBrevoEmail from '../config/brevo.js';
import { WebsiteContent } from '../models/WebsiteContent.js';

export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'yogeshsadgir05@gmail.com'; 
    
    const emailSubject = `New Contact Form Submission from ${name}`;
    const emailContent = `
      <div style="font-family: sans-serif; color: #333;">
        <h2>New Message from CabBook Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 8px;">${message}</p>
      </div>
    `;
    
    await sendBrevoEmail(adminEmail, emailSubject, emailContent);
    
    res.status(200).json({ success: true, message: 'Message sent successfully to admin.' });
  } catch (error) {
    next(error);
  }
};

export const getWebsiteContent = async (req, res, next) => {
  try {
    const contentDocs = await WebsiteContent.find();
    const content = {};
    contentDocs.forEach(doc => {
      content[doc.key] = doc.value;
    });
    res.json(content);
  } catch (error) {
    next(error);
  }
};

export const updateWebsiteContent = async (req, res, next) => {
  try {
    const { key, value } = req.body;
    
    await WebsiteContent.findOneAndUpdate(
      { key }, 
      { value }, 
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Content updated successfully' });
  } catch (error) {
    next(error);
  }
};