import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { FiUser, FiBookOpen, FiClock, FiChevronDown, FiXCircle, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../context/ModalContext';
import { getDeviceId } from '../utils/getDeviceId';

const BookingAccordion = ({ booking, onCancel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-saas-sm overflow-hidden mb-4 transition-all hover:border-gray-300">
      {/* Header (Always Visible) */}
      <div 
        className="p-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
             <FiClock className="text-black text-xl" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-mono text-gray-500">{new Date(booking.journeyDate || booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${getStatusColor(booking.status?.toLowerCase())}`}>
                {booking.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-black tracking-tight">
              {booking.pickup?.city || 'Pickup'} 
              <span className="text-gray-400 mx-2">→</span> 
              {booking.destination?.city || 'Drop'}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full">
          <div className="text-left sm:text-right">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-0.5">Total Fare</span>
             <span className="text-xl font-black text-black">₹{booking.totalFare || booking.estimatedRate || 0}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
             <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
               <FiChevronDown />
             </motion.div>
          </div>
        </div>
      </div>

      {/* Body (Collapsible) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="border-t border-gray-100 bg-gray-50/50"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Location Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pickup Details</h4>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full border-2 border-black bg-white mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm font-medium text-black">{booking.pickup?.streetAddress || ''} {booking.pickup?.city}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Drop Details</h4>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-black mt-1.5 flex-shrink-0"></div>
                    <p className="text-sm font-medium text-black">{booking.destination?.streetAddress || ''} {booking.destination?.city}</p>
                  </div>
                </div>
              </div>

              {/* Trip & Driver Details */}
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Booking Information</h4>
                <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3 shadow-saas-inner">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Trip Type</span>
                    <span className="font-bold text-black uppercase">{booking.tripType?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Passenger</span>
                    <span className="font-bold text-black">{booking.passengerDetails?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Vehicle</span>
                    <span className="font-bold text-black">{booking.cabType?.name || 'Assigned soon'}</span>
                  </div>
                  {booking.status === 'Pending' && (
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">Action</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCancel(booking._id); }}
                        className="text-red-500 font-bold hover:underline flex items-center gap-1"
                      >
                        <FiXCircle /> Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');
  const [searchMethod, setSearchMethod] = useState('device'); // 'device' or 'phone'
  const { showConfirm } = useModal();

  useEffect(() => {
    fetchBookingsByDevice();
  }, []);

  const fetchBookingsByDevice = async () => {
    setLoading(true);
    setSearchMethod('device');
    try {
      const res = await axiosInstance.get(`/bookings/mybookings?deviceId=${getDeviceId()}`);
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingsByPhone = async (e) => {
    e.preventDefault();
    if (!phoneInput) return;
    setLoading(true);
    setSearchMethod('phone');
    try {
      const res = await axiosInstance.get(`/bookings/mybookings?phone=${phoneInput}`);
      setBookings(res.data);
      if (res.data.length === 0) toast.error('No bookings found for this number');
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    const isConfirmed = await showConfirm({
      title: 'Cancel Booking?',
      message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
      confirmText: 'Yes, cancel',
      cancelText: 'Keep it',
      type: 'danger'
    });
    
    if (!isConfirmed) return;

    try {
      await axiosInstance.put(`/bookings/${bookingId}/status`, { status: 'Cancelled' });
      toast.success('Booking cancelled successfully');
      if (searchMethod === 'phone') {
        fetchBookingsByPhone({ preventDefault: () => {} });
      } else {
        fetchBookingsByDevice();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  return (
    <PageTransition>
      <SEOHead title="My Bookings | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-20 px-4 sm:px-8 pb-12 font-sans relative">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
          
          {/* SAAS SIDEBAR */}
          <div className="hidden lg:block">
            <div className="sticky top-32 flex flex-col gap-2">
              <Link to="/my-bookings" className="px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors bg-white shadow-saas-sm text-black border border-gray-100">
                <FiBookOpen className="text-lg" />
                My Bookings
              </Link>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div>
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-2">My Bookings</h1>
              <p className="text-gray-500 font-medium">View and manage your upcoming and past trips.</p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : bookings.length === 0 && searchMethod === 'device' ? (
              <div className="bg-white p-8 sm:p-12 rounded-[32px] border border-gray-100 shadow-saas-sm text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <FiCalendar className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-black tracking-tight mb-2">No active bookings</h3>
                <p className="text-gray-500 font-medium mb-6">We couldn't find any recent bookings on this device.</p>
                <div className="border-t border-gray-100 pt-6 mt-2">
                   <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Booked on another device?</p>
                   <form onSubmit={fetchBookingsByPhone} className="flex flex-col gap-3">
                     <input type="tel" placeholder="Enter your 10-digit mobile number" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} required className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-black focus:border-black focus:bg-white shadow-saas-inner outline-none transition-colors" />
                     <button type="submit" className="w-full h-12 bg-black text-white rounded-xl font-bold text-sm shadow-saas-glow hover:bg-neutral-800 transition-colors">
                       Track Bookings
                     </button>
                   </form>
                </div>
              </div>
            ) : (
              <div>
                {searchMethod === 'phone' && (
                  <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <span className="text-sm font-medium text-gray-600">Showing bookings for <strong className="text-black">{phoneInput}</strong></span>
                     <button onClick={() => { setPhoneInput(''); fetchBookingsByDevice(); }} className="text-xs font-bold text-blue-600 hover:underline">Clear</button>
                  </div>
                )}
                {bookings.length === 0 && searchMethod === 'phone' ? (
                   <div className="text-center py-12 text-gray-500">No bookings found for this number.</div>
                ) : (
                  bookings.map(booking => (
                    <BookingAccordion 
                      key={booking._id} 
                      booking={booking} 
                      onCancel={handleCancelBooking} 
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default MyBookings;