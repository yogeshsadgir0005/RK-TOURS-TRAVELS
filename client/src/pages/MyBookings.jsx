import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import { FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axiosInstance.get('/bookings/mybookings');
        // Sort by newest first assuming journeyDate or createdAt exists
        const sortedBookings = res.data.sort((a, b) => new Date(b.journeyDate) - new Date(a.journeyDate));
        setBookings(sortedBookings);
      } catch (err) { 
        console.error("Failed to fetch bookings"); 
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 pt-28 px-4 sm:px-6 lg:px-8 font-sans">
      <SEOHead title="My Bookings | CabBook" />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8 tracking-tight">My Bookings</h1>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiClock className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-black mb-2 tracking-tight">No bookings yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't made any cab bookings with us yet. When you do, they will appear here.</p>
            <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-all">
              Book a Ride
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-black transition-colors duration-300">
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      booking.status === 'Completed' ? 'bg-black text-white' :
                      booking.status === 'Pending' ? 'bg-gray-100 text-black border border-gray-200' :
                      'bg-red-50 text-red-600 border border-red-100'
                    }`}>
                      {booking.status}
                    </span>
                    <span className="text-xs text-gray-400 font-medium font-mono uppercase">ID: {booking._id.slice(-8)}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-black mb-4 tracking-tight capitalize flex items-center flex-wrap gap-2">
                    {booking.pickup.city} <span className="text-gray-300 font-normal mx-1">→</span> {booking.destination.city}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <FiCalendar className="text-black" />
                      {new Date(booking.journeyDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 capitalize">
                      <FiMapPin className="text-black" />
                      {booking.tripType.replace('-', ' ')}
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <FaCarSide className="text-black" />
                      {booking.cabType?.name || 'Standard Cab'}
                    </span>
                  </div>
                </div>

              
                <div className="text-right flex-shrink-0 mt-4 md:mt-0">
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Fare</p>
                  <p className="text-3xl font-extrabold text-black">₹{booking.totalFare || '---'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyBookings;