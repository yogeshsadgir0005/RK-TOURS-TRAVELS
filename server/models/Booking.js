// Booking.js
import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  streetAddress: { type: String }, // New field
  city: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String },
  mapUrl: { type: String } // New field for exact pin link
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pickup: locationSchema,
  destination: locationSchema,
  journeyDate: { type: Date, required: true },
  tripType: { type: String, enum: ['One Way', 'Round Trip'], required: true },
  cabType: { type: mongoose.Schema.Types.ObjectId, ref: 'Cab', required: true },
  distance: { type: Number },
  totalFare: { type: Number },     
  estimatedRate: { type: Number }, 
  status: { type: String, enum: ['Pending', 'Approved', 'Completed', 'Cancelled'], default: 'Pending' },
  passengerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }
  }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);