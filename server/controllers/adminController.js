import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'Pending' });
    const completedBookings = await Booking.find({ status: 'Completed' });
    
    const revenue = completedBookings.reduce((acc, curr) => acc + (curr.price || 0), 0);
    
    res.json({ usersCount, totalBookings, pendingBookings, completedBookings: completedBookings.length, revenue });
  } catch (error) { next(error); }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email').populate('cabType').sort('-createdAt');
    res.json(bookings);
  } catch (error) { next(error); }
};