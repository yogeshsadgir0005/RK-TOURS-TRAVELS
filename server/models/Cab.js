// models/Cab.js
import mongoose from 'mongoose';

const cabSchema = new mongoose.Schema({
  name: { type: String, required: true },
  vehicleNumber: { type: String },
  seats: { type: Number, required: true },
  pricePerKm: { type: Number, required: true },
  image: { type: String },
  
  // NEW DYNAMIC FIELDS
  acStatus: { type: String, enum: ['AC', 'Non-AC'], default: 'AC' },
  fuelType: { type: String, enum: ['Petrol', 'Diesel', 'CNG', 'EV'], default: 'Petrol' },
  category: { type: String, enum: ['Sedan', 'SUV', 'Hatchback', 'Premium'], default: 'Sedan' },
  rating: { type: Number, default: 4.8 },
  trips: { type: Number, default: 0 },
  features: [{ type: String }], // Array of strings for checkmark features
  
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Cab = mongoose.model('Cab', cabSchema);