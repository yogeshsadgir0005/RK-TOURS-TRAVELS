import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import { FiMapPin, FiCalendar, FiArrowRight, FiUsers, FiSearch, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { FaCarSide } from 'react-icons/fa';
import SEOHead from '../components/SEOHead';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // NEW INTEGRATION: Receive selected route info
  const { selectedRoute } = location.state || {};
  
  const queryParams = new URLSearchParams(location.search);
  
  const [pickup, setPickup] = useState(queryParams.get('pickup') || '');
  const [drop, setDrop] = useState(queryParams.get('drop') || '');
  const [date, setDate] = useState(queryParams.get('date') || '');
  const [tripType, setTripType] = useState(queryParams.get('trip') || 'one-way');
  const [cabType, setCabType] = useState(queryParams.get('type') || '');

  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Custom Dropdown State
  const [isCabDropdownOpen, setIsCabDropdownOpen] = useState(false);
  const cabDropdownRef = useRef(null);

  const cabOptions = [
    { value: '', label: 'Any Cab' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cabDropdownRef.current && !cabDropdownRef.current.contains(event.target)) {
        setIsCabDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAndFilterCabs = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/cabs');
        let fetchedCabs = res.data;

        const currentTypeParam = queryParams.get('type');
        if (currentTypeParam) {
          fetchedCabs = fetchedCabs.filter(cab => 
            cab.category && cab.category.toLowerCase() === currentTypeParam.toLowerCase()
          );
        }

        setCabs(fetchedCabs);
      } catch (error) {
        console.error("Failed to fetch cabs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterCabs();
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if(!pickup || !drop || !date) {
        alert("Please fill pickup, drop, and date to search.");
        return;
    }
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${date}&type=${cabType}&trip=${tripType}`);
  };

  const handleProceedToBook = (cab) => {
    // NEW INTEGRATION: Pass the street locations dynamically if they exist
    navigate('/book', {
      state: { 
        cab, 
        journey: { 
          pickup, 
          drop, 
          date, 
          tripType,
          pickupStreet: selectedRoute?.pickupStreet || '',
          dropStreet: selectedRoute?.destinationStreet || '' 
        } 
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-28 px-4 sm:px-6 lg:px-8 font-sans">
      <SEOHead title="Search Results | CabBook" />
      <div className="max-w-7xl mx-auto">
        
        {/* NEW INTEGRATION: Show Route Details OR Search Box depending on how they got here */}
        {selectedRoute ? (
          <div className=" py-12 rounded-3xl shadow-xl mb-8 px-6 md:px-8">
            <h1 className="text-2xl font-extrabold text-black mb-8">Route Details</h1>
            <div className="bg-white rounded-2xl p-6 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
                
                <div className="flex-grow flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <FiMapPin className="text-green-600" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pickup</span>
                        </div>
                        <p className="text-xl font-bold text-black">{selectedRoute.pickupCity}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedRoute.pickupStreet || 'City Limits'}</p>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center px-4">
                        <p className="text-xs font-bold text-gray-400 mb-2">{selectedRoute.distance} km</p>
                        <FiArrowRight className="text-gray-300 text-2xl" />
                    </div>

                    <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-2 mb-2">
                            <FiMapPin className="text-red-600" />
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Drop-off</span>
                        </div>
                        <p className="text-xl font-bold text-black">{selectedRoute.destinationCity}</p>
                        <p className="text-sm text-gray-500 mt-1">{selectedRoute.destinationStreet || 'City Limits'}</p>
                    </div>
                </div>

                <div className="lg:w-72 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-6 lg:pt-0 lg:pl-8">
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Travel Date</label>
                       <input 
                         type="date" 
                         value={date} 
                         onChange={(e) => setDate(e.target.value)} 
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium"
                       />
                   </div>
                   <div>
                       <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Trip Type</label>
                       <select 
                         value={tripType} 
                         onChange={(e) => setTripType(e.target.value)} 
                         className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium appearance-none"
                       >
                           <option value="one-way">One Way</option>
                           <option value="round-trip">Round Trip</option>
                       </select>
                   </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 lg:p-8 text-left mb-8">
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setTripType('one-way')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                  tripType === 'one-way' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <FiArrowRight /> One Way
              </button>
              <button 
                onClick={() => setTripType('round-trip')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                  tripType === 'round-trip' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <FiRefreshCw /> Round Trip
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[13px] font-medium text-gray-500 ml-1">Pickup Location</label>
                  <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                <div className="flex flex-col gap-2 relative">
                  <label className="text-[13px] font-medium text-gray-500 ml-1">Drop Location</label>
                  <CityAutocomplete value={drop} onChange={setDrop} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                {/* Upgraded Date Picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-medium text-gray-500 ml-1">Travel Date</label>
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-black">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                      <FiCalendar className="text-black text-lg" />
                    </div>
                    <input 
                      type="date" 
                      required 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full pl-11 pr-4 py-3.5 border-none outline-none text-black bg-transparent transition-all text-sm font-medium relative z-20 cursor-pointer
                      [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>

                {/* Custom Cab Type Dropdown */}
                <div className="flex flex-col gap-2" ref={cabDropdownRef}>
                  <label className="text-[13px] font-medium text-gray-500 ml-1">Cab Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                      <FaCarSide className="text-black text-lg" />
                    </div>
                    <div 
                      onClick={() => setIsCabDropdownOpen(!isCabDropdownOpen)}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-black transition-all text-sm font-medium cursor-pointer flex items-center justify-between select-none focus-within:ring-2 focus-within:ring-black"
                    >
                      <span>{cabOptions.find(opt => opt.value === cabType)?.label || 'Any Cab'}</span>
                      <FiChevronDown className={`text-gray-500 text-lg transition-transform duration-200 ${isCabDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isCabDropdownOpen && (
                      <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {cabOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setCabType(option.value);
                              setIsCabDropdownOpen(false);
                            }}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center ${
                              cabType === option.value ? 'bg-gray-50 text-black font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                            }`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <div>
                <button type="submit" className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white px-8 py-3.5 rounded-2xl font-medium text-sm transition-all shadow-md w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-neutral-200">
                  <FiSearch size={18} /> Search Cabs
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Cab Results List remains identical... */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold text-black tracking-tight">Available Cabs ({cabs.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div></div>
        ) : cabs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-bold text-black mb-2">No cabs found</h3>
            <p className="text-gray-500">We couldn't find any cabs matching your selected criteria. Try changing the cab type or search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabs.map((cab) => (
              <div key={cab._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:border-black transition-all duration-300">
                <div className="h-48 w-full bg-gray-50 overflow-hidden relative border-b border-gray-100 flex items-center justify-center p-4">
                  <img src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} alt={cab.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-[10px] font-bold text-black shadow-sm z-10 tracking-wider border border-gray-200">
                    {cab.acStatus || 'AC'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black tracking-tight">{cab.name}</h3>
                      <p className="text-gray-500 text-sm capitalize">{cab.category || 'Standard'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-black">₹{cab.pricePerKm}<span className="text-sm text-gray-500 font-medium">/km</span></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 font-medium">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                      <FiUsers className="text-black"/> {cab.seats} Seats
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                      {cab.fuelType || 'Petrol'}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleProceedToBook(cab)}
                    className="mt-auto w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2 shadow-sm focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  >
                    Select & Book <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;