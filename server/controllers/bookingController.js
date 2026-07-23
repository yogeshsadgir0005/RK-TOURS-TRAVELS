import Booking from '../models/Booking.js';
import { WebsiteContent } from '../models/WebsiteContent.js';
import { generateWhatsAppLink } from '../utils/generateWhatsAppLink.js';

export const createBooking = async (req, res, next) => {
  try {
    const booking = new Booking({ ...req.body });
    const savedBooking = await booking.save();
    
    const adminNumDoc = await WebsiteContent.findOne({ key: 'admin_whatsapp_number' });
    const adminPhone = adminNumDoc ? adminNumDoc.value : '918087959271';
    
    const waLink = generateWhatsAppLink(adminPhone, await savedBooking.populate('cabType'));
    res.status(201).json({ booking: savedBooking, whatsappLink: waLink });
  } catch (error) { next(error); }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const { deviceId, phone } = req.query;
    if (!deviceId && !phone) return res.status(400).json({ message: "Device ID or Phone required" });
    
    const query = {};
    if (phone) query['passengerDetails.phone'] = phone;
    else if (deviceId) query.deviceId = deviceId;

    const bookings = await Booking.find(query).populate('cabType').sort('-createdAt');
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