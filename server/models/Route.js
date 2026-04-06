import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  pickupStreet: { type: String },
  pickupCity: { type: String, required: true },
  destinationStreet: { type: String },
  destinationCity: { type: String, required: true },
  distance: { type: Number, required: true },
  basePrice: { type: Number, required: true },
  
  // NEW INTEGRATION: Custom pricing for specific cabs on this route
  cabFares: [{
    cab: { type: mongoose.Schema.Types.ObjectId, ref: 'Cab', required: true },
    fare: { type: Number, required: true }
  }]
}, { timestamps: true });

export const Route = mongoose.model('Route', routeSchema);