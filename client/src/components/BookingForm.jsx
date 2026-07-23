import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { FiMapPin, FiCalendar, FiUser, FiPhone, FiSearch, FiArrowRight } from 'react-icons/fi';
import { TbArrowsRightLeft } from 'react-icons/tb';
import { FaCarSide } from 'react-icons/fa';
import { DEFAULT_CABS, mergeDataById } from '../data/defaultData';

const BookingForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [cabs, setCabs] = useState(DEFAULT_CABS);
  const [adminPhone, setAdminPhone] = useState('919130899368');
  const [formData, setFormData] = useState({
    pickupCity: '', destinationCity: '', journeyDate: '', tripType: 'One Way', cabTypeId: '',
    passengerName: '', passengerPhone: ''
  });

  useEffect(() => {
    // Pre-fill if logged in
    if (user) {
      setFormData(prev => ({ ...prev, passengerName: user.name, passengerPhone: user.phone || '' }));
    }
    // Fetch active cabs & admin settings
    const fetchData = async () => {
      try {
        let fetched = [];
        const cachedCabs = sessionStorage.getItem('cabsData');
        if (cachedCabs) {
          fetched = JSON.parse(cachedCabs);
        } else {
          const cabRes = await axiosInstance.get('/cabs');
          fetched = cabRes.data || [];
          sessionStorage.setItem('cabsData', JSON.stringify(fetched));
        }
        setCabs(mergeDataById(DEFAULT_CABS, fetched));
      } catch (err) { console.error("Failed to load initial data"); }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedCab = cabs.find(c => c._id === formData.cabTypeId);
      
      const payload = {
        pickup: { state: 'Default', district: 'Default', city: formData.pickupCity },
        destination: { state: 'Default', district: 'Default', city: formData.destinationCity },
        journeyDate: formData.journeyDate,
        tripType: formData.tripType,
        cabType: formData.cabTypeId,
        passengerDetails: { name: formData.passengerName, phone: formData.passengerPhone }
      };

      // 1. Generate WA Link directly without DB saving for maximum simplicity
      const waDetails = { ...payload, cabTypeName: selectedCab?.name || 'Standard' };
      const waLink = generateWhatsAppLink(adminPhone, waDetails);

      // 2. Open WA
      window.open(waLink, '_blank');

      // Optional: Reset form or show success message if needed, but opening WA is usually enough feedback.

    } catch (error) {
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="bg-neutral-900 p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-5xl mx-auto relative z-10">
      <form onSubmit={handleSubmit}>
        
        {/* Trip Type */}
        <div className="flex gap-3 mb-8">
          <label className={`flex items-center gap-2 px-6 py-2.5 rounded-full cursor-pointer transition-all font-medium text-sm ${formData.tripType === 'One Way' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}>
            <input type="radio" name="tripType" value="One Way" checked={formData.tripType === 'One Way'}
              onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
              className="sr-only" />
            <FiArrowRight className="text-lg" /> One Way
          </label>
          <label className={`flex items-center gap-2 px-6 py-2.5 rounded-full cursor-pointer transition-all font-medium text-sm ${formData.tripType === 'Round Trip' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700'}`}>
            <input type="radio" name="tripType" value="Round Trip" checked={formData.tripType === 'Round Trip'}
              onChange={(e) => setFormData({ ...formData, tripType: e.target.value })}
              className="sr-only" />
            <TbArrowsRightLeft className="text-lg" /> Round Trip
          </label>
        </div>

        {/* Primary Booking Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400 tracking-wide">Pickup Location</label>
            <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <FiMapPin className="absolute left-4 text-blue-500 text-lg" />
              <input type="text" placeholder="Enter city" required
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                value={formData.pickupCity} onChange={e => setFormData({...formData, pickupCity: e.target.value})} />
            </div>
          </div>
            
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400 tracking-wide">Drop Location</label>
            <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <FiMapPin className="absolute left-4 text-orange-500 text-lg" />
              <input type="text" placeholder="Enter city" required
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                value={formData.destinationCity} onChange={e => setFormData({...formData, destinationCity: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400 tracking-wide">Travel Date</label>
            <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <FiCalendar className="absolute left-4 text-blue-500 text-lg pointer-events-none" />
              <input type="date" required
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white font-medium"
                value={formData.journeyDate} onChange={e => setFormData({...formData, journeyDate: e.target.value})} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-400 tracking-wide">Cab Type</label>
            <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <FaCarSide className="absolute left-4 text-blue-500 text-lg pointer-events-none" />
              <select required 
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white font-medium appearance-none cursor-pointer"
                value={formData.cabTypeId} onChange={e => setFormData({...formData, cabTypeId: e.target.value})}>
                <option value="" disabled>Select cab</option>
                {cabs.map(cab => <option key={cab._id} value={cab._id}>{cab.name} - ₹{cab.pricePerKm}/km</option>)}
              </select>
            </div>
          </div>

        </div>

        {/* Passenger Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-neutral-800">
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-gray-400 tracking-wide">Passenger Name</label>
             <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
               <FiUser className="absolute left-4 text-gray-400 text-lg" />
               <input type="text" placeholder="Enter full name" required
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                value={formData.passengerName} onChange={e => setFormData({...formData, passengerName: e.target.value})} />
             </div>
           </div>
           
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold text-gray-400 tracking-wide">Phone Number</label>
             <div className="relative flex items-center border border-neutral-800 rounded-xl bg-neutral-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
               <FiPhone className="absolute left-4 text-gray-400 text-lg" />
               <input type="tel" placeholder="Enter phone number" required
                className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-white placeholder-gray-500 font-medium"
                value={formData.passengerPhone} onChange={e => setFormData({...formData, passengerPhone: e.target.value})} />
             </div>
           </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button type="submit" 
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 hover:-translate-y-0.5">
            <FiSearch className="text-xl" />
            Book on WhatsApp
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default BookingForm;