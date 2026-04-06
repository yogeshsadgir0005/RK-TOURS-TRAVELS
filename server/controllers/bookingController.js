import Booking from '../models/Booking.js';
import { WebsiteContent } from '../models/WebsiteContent.js';
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = new Booking({ ...req.body, user: req.user._id });
    const savedBooking = await booking.save();
    
    const adminNumDoc = await WebsiteContent.findOne({ key: 'admin_whatsapp_number' });
    const adminPhone = adminNumDoc ? adminNumDoc.value : '910000000000';
    
    const waLink = generateWhatsAppLink(adminPhone, await savedBooking.populate('cabType'));
    res.status(201).json({ booking: savedBooking, whatsappLink: waLink });
  } catch (error) { next(error); }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('cabType').sort('-createdAt');
    res.json(bookings);
  } catch (error) { next(error); }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) { next(error); }
};