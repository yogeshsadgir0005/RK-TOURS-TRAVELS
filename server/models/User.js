import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date },

  // ADD THIS BLOCK: Allows Mongoose to save temporary profile changes
  pendingUpdate: {
    field: { type: String },
    value: { type: String }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  // Only hash if password exists and is modified
  if (!this.isModified('password') || !this.password) {
    return; 
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Prevents crash if Google user tries to login with standard password form
  if (!this.password) {
    return false; 
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);