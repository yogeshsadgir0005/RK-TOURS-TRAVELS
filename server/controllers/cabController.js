import { Cab } from '../models/Cab.js';

export const createCab = async (req, res, next) => {
  try {
    // Destructure all new dynamic fields
    const { name, vehicleNumber, seats, pricePerKm, image, acStatus, fuelType, category, rating, trips, features, isActive } = req.body;
    const cab = await Cab.create({ 
      name, vehicleNumber, seats, pricePerKm, image, acStatus, fuelType, category, rating, trips, features, isActive 
    });
    res.status(201).json(cab);
  } catch (error) { next(error); }
};

export const getAllCabs = async (req, res, next) => {
  try {
    const query = req.user && req.user.role === 'admin' ? {} : { isActive: true };
    const cabs = await Cab.find(query).sort('-createdAt');
    res.json(cabs);
  } catch (error) { next(error); }
};

export const getCabById = async (req, res, next) => {
  try {
    const cab = await Cab.findById(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (error) { next(error); }
};

export const updateCab = async (req, res, next) => {
  try {
    // req.body will now dynamically include features, fuelType, etc., passed from Admin Panel
    const cab = await Cab.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json(cab);
  } catch (error) { next(error); }
};

export const deleteCab = async (req, res, next) => {
  try {
    const cab = await Cab.findByIdAndDelete(req.params.id);
    if (!cab) return res.status(404).json({ message: 'Cab not found' });
    res.json({ message: 'Cab deleted successfully' });
  } catch (error) { next(error); }
};