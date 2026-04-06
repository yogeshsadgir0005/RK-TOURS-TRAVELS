import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { sendOTP } from '../utils/sendOTPEmail.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // 10 mins
    
    const user = await User.create({ name, email, password, phone, otp, otpExpiry });
    await sendOTP(email, otp);
    
    res.status(201).json({ message: 'OTP sent to email', userId: user._id });
  } catch (error) { next(error); }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (error) { next(error); }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) return res.status(401).json({ message: 'Please verify your email' });
      res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { next(error); }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { tokenId } = req.body; // This is the access_token sent from the frontend

    // 1. Fetch user profile from Google using the Access Token
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenId}` }
    });

    if (!googleRes.ok) {
      return res.status(400).json({ message: 'Failed to authenticate with Google' });
    }

    const userData = await googleRes.json();
    const { email, name, sub } = userData; // 'sub' is the unique Google ID

    // 2. Check if user exists in your database
    let user = await User.findOne({ email });

    // 3. If they don't exist, create a new account
    if (!user) {
      user = await User.create({ 
        name, 
        email, 
        isVerified: true,
        // NOTE: If your Mongoose schema requires a 'password' or 'phone', 
        // it will throw an error here. You must either update your User schema 
        // to make them optional, or provide dummy data here.
      });
    }

    // 4. Generate your app's JWT and send it to the frontend
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      token: generateToken(user._id) 
    });

  } catch (error) { 
    console.error("Google Login Error:", error);
    next(error); 
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) { next(error); }
};

// --- NEW FORGOT PASSWORD FUNCTIONS ---

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'If this email exists, an OTP will be sent.' }); // Generic message for security
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
    await user.save();

    await sendOTP(user.email, otp);
    
    res.json({ message: 'OTP sent to email for password reset' });
  } catch (error) { next(error); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Assign new password. Assuming your User schema has a pre('save') hook that automatically bcrypt hashes the password.
    user.password = newPassword; 
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful. Please log in.' });
  } catch (error) { next(error); }
};


// Add these to your existing authController.js

export const requestProfileUpdateOTP = async (req, res, next) => {
  try {
    const { field, value } = req.body;
    const user = await User.findById(req.user._id);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60000); // 10 mins
    
    // Store the pending change in the user object (temporary field)
    // Note: You might need to add 'pendingUpdate' to your User Schema if you want it strict
    user.pendingUpdate = { field, value }; 
    await user.save();

    await sendOTP(user.email, otp);
    
    res.json({ message: `OTP sent to your email to verify ${field} change.` });
  } catch (error) { next(error); }
};

export const verifyAndCommitUpdate = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const { field, value } = user.pendingUpdate;

    // Apply the change
    if (field === 'email') user.email = value;
    if (field === 'phone') user.phone = value;
    if (field === 'password') user.password = value;

    user.otp = undefined;
    user.otpExpiry = undefined;
    user.pendingUpdate = undefined;
    
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) { next(error); }
};