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
  
  const { selectedRoute } = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  
  const [pickup, setPickup] = useState(queryParams.get('pickup') || '');
  const [drop, setDrop] = useState(queryParams.get('drop') || '');
  const [date, setDate] = useState(queryParams.get('date') || '');
  const [tripType, setTripType] = useState(queryParams.get('trip') || 'one-way');
  const [cabType, setCabType] = useState(queryParams.get('type') || '');

  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);

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

        if (cabType) {
          fetchedCabs = fetchedCabs.filter(cab => 
            cab.category && cab.category.toLowerCase() === cabType.toLowerCase()
          );
        }

        // Smart Sorting for Fixed Fare Cabs
        if (selectedRoute && selectedRoute.cabFares && selectedRoute.cabFares.length > 0) {
            const fixedFareCabs = [];
            const standardCabs = [];

            fetchedCabs.forEach(cab => {
                const fixedFareObj = selectedRoute.cabFares.find(cf => {
                    const cfId = typeof cf.cab === 'object' ? cf.cab._id : cf.cab;
                    return cfId === cab._id;
                });

                if (fixedFareObj) {
                    fixedFareCabs.push({ ...cab, customFixedFare: fixedFareObj.fare });
                } else {
                    standardCabs.push(cab);
                }
            });
            setCabs([...fixedFareCabs, ...standardCabs]);
        } else {
            setCabs(fetchedCabs);
        }
      } catch (error) {
        console.error("Failed to fetch cabs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterCabs();
  }, [location.search, cabType, selectedRoute]);

  const handleSearch = (e) => {
    e.preventDefault();
    if(!pickup || !drop || !date) {
        alert("Please fill pickup, drop, and date to search.");
        return;
    }
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${date}&type=${cabType}&trip=${tripType}`, { state: { selectedRoute } });
  };

  const handleProceedToBook = (cab) => {
    navigate('/book', {
      state: { 
        cab, 
        customFixedFare: cab.customFixedFare || null,
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
    <div className="min-h-screen bg-gray-50 pb-8 sm:pb-12 pt-20 sm:pt-28 px-3 sm:px-6 lg:px-8 font-sans">
      <SEOHead title="Search Results | CabBook" />
      <div className="max-w-7xl mx-auto">
        
        {selectedRoute ? (
          <div className="bg-black py-6 mt-6 sm:py-12 rounded-2xl sm:rounded-3xl shadow-xl mb-6 sm:mb-8 px-4 sm:px-6 md:px-8">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-4 sm:mb-8">Route Details</h1>
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-8 lg:items-center justify-between shadow-sm border border-gray-100">
                
                <div className="flex-grow flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                            <FiMapPin className="text-green-600 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Pickup</span>
                        </div>
                        <p className="text-sm sm:text-xl font-bold text-black">{selectedRoute.pickupCity}</p>
                        <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">{selectedRoute.pickupStreet || 'City Limits'}</p>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center px-4">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 mb-2">{selectedRoute.distance} km</p>
                        <FiArrowRight className="text-gray-300 text-xl sm:text-2xl" />
                    </div>

                    <div className="flex-1 w-full border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-6">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                            <FiMapPin className="text-red-600 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Drop-off</span>
                        </div>
                        <p className="text-sm sm:text-xl font-bold text-black">{selectedRoute.destinationCity}</p>
                        <p className="text-[10px] sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-1">{selectedRoute.destinationStreet || 'City Limits'}</p>
                    </div>
                </div>

                <div className="lg:w-72 flex flex-col gap-3 sm:gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 sm:pt-6 lg:pt-0 lg:pl-8">
                   <div>
                       <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Travel Date</label>
                       <input 
                         type="date" 
                         value={date} 
                         onChange={(e) => setDate(e.target.value)} 
                         className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium"
                       />
                   </div>
                   <div>
                       <label className="block text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 sm:mb-2">Trip Type</label>
                       <select 
                         value={tripType} 
                         onChange={(e) => setTripType(e.target.value)} 
                         className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none font-medium appearance-none"
                       >
                           <option value="one-way">One Way</option>
                           <option value="round-trip">Round Trip</option>
                       </select>
                   </div>
                </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 text-left mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <button 
                onClick={() => setTripType('one-way')}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 ${
                  tripType === 'one-way' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <FiArrowRight /> One Way
              </button>
              <button 
                onClick={() => setTripType('round-trip')}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm transition-all duration-200 ${
                  tripType === 'round-trip' ? 'bg-black text-white shadow-md' : 'bg-transparent text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                <FiRefreshCw /> Round Trip
              </button>
            </div>

            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                
                <div className="flex flex-col gap-1.5 sm:gap-2 relative">
                  <label className="text-[11px] sm:text-[13px] font-medium text-gray-500 ml-1">Pickup Location</label>
                  <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2 relative">
                  <label className="text-[11px] sm:text-[13px] font-medium text-gray-500 ml-1">Drop Location</label>
                  <CityAutocomplete value={drop} onChange={setDrop} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <label className="text-[11px] sm:text-[13px] font-medium text-gray-500 ml-1">Travel Date</label>
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-black">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none z-10">
                      <FiCalendar className="text-black text-sm sm:text-lg" />
                    </div>
                    <input 
                      type="date" 
                      required 
                      value={date} 
                      onChange={(e) => setDate(e.target.value)} 
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border-none outline-none text-black bg-transparent transition-all text-xs sm:text-sm font-medium relative z-20 cursor-pointer
                      [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2" ref={cabDropdownRef}>
                  <label className="text-[11px] sm:text-[13px] font-medium text-gray-500 ml-1">Cab Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none z-10">
                      <FaCarSide className="text-black text-sm sm:text-lg" />
                    </div>
                    <div 
                      onClick={() => setIsCabDropdownOpen(!isCabDropdownOpen)}
                      className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3.5 bg-gray-50 border-none rounded-xl sm:rounded-2xl text-black transition-all text-xs sm:text-sm font-medium cursor-pointer flex items-center justify-between select-none focus-within:ring-2 focus-within:ring-black"
                    >
                      <span>{cabOptions.find(opt => opt.value === cabType)?.label || 'Any Cab'}</span>
                      <FiChevronDown className={`text-gray-500 text-base sm:text-lg transition-transform duration-200 ${isCabDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isCabDropdownOpen && (
                      <div className="absolute top-[calc(100%+4px)] sm:top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 py-1.5 sm:py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {cabOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              setCabType(option.value);
                              setIsCabDropdownOpen(false);
                            }}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium cursor-pointer transition-colors flex items-center ${
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
                <button type="submit" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-black hover:bg-neutral-800 text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl font-medium text-xs sm:text-sm transition-all shadow-md w-full sm:w-auto focus:outline-none focus:ring-4 focus:ring-neutral-200">
                  <FiSearch className="w-4 h-4 sm:w-[18px] sm:h-[18px]" /> Search Cabs
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between items-end mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-black tracking-tight">Available Cabs ({cabs.length})</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8 sm:py-12"><div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-black"></div></div>
        ) : cabs.length === 0 ? (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
            <h3 className="text-base sm:text-lg font-bold text-black mb-2">No cabs found</h3>
            <p className="text-xs sm:text-sm text-gray-500">We couldn't find any cabs matching your selected criteria. Try changing the cab type or search parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {cabs.map((cab) => (
              <div key={cab._id} className={`bg-white rounded-[16px] sm:rounded-[24px] border ${cab.customFixedFare ? 'border-gray-800 shadow-md relative overflow-hidden' : 'border-gray-200'} flex flex-col hover:border-black transition-all duration-300`}>
                
                {/* Badge for custom matched route (Black instead of Green) */}
                {cab.customFixedFare && (
                  <div className="absolute top-0 right-0 bg-black text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 sm:px-4 sm:py-1.5 rounded-bl-lg sm:rounded-bl-xl z-20 shadow-sm uppercase tracking-widest">
                    Best Match
                  </div>
                )}

                <div className="h-28 sm:h-48 w-full bg-gray-50 overflow-hidden relative border-b border-gray-100 flex items-center justify-center p-2 sm:p-4">
                  <img src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} alt={cab.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold text-black shadow-sm z-10 tracking-wider border border-gray-200">
                    {cab.acStatus || 'AC'}
                  </div>
                </div>
                
                <div className="p-3 sm:p-6 flex flex-col flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 sm:mb-4">
                    <div>
                      <h3 className="text-sm sm:text-xl font-bold text-black tracking-tight leading-tight line-clamp-1">{cab.name}</h3>
                      <p className="text-gray-500 text-[10px] sm:text-sm capitalize mt-0.5">{cab.category || 'Standard'}</p>
                    </div>
                    
                    {/* Dynamically render either Fixed Fare or Per Km */}
                    {cab.customFixedFare ? (
                        <div className="text-left sm:text-right mt-1 sm:mt-0">
                          <div className="text-[8px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Fixed Fare</div>
                          <div className="text-base sm:text-2xl font-extrabold text-black">₹{cab.customFixedFare}</div>
                        </div>
                      ) : (
                        <div className="text-left sm:text-right mt-1 sm:mt-0">
                          <div className="text-base sm:text-2xl font-extrabold text-black">₹{cab.pricePerKm}<span className="text-[10px] sm:text-sm text-gray-500 font-medium">/km</span></div>
                        </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-3 text-gray-700 mb-3 sm:mb-6 font-medium flex-wrap">
                    <span className="flex items-center gap-1 sm:gap-1.5 bg-gray-100 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[10px] sm:text-sm">
                      <FiUsers className="text-black w-3 h-3 sm:w-4 sm:h-4"/> {cab.seats}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5 bg-gray-100 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[10px] sm:text-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                      {cab.fuelType || 'Petrol'}
                    </span>
                  </div>

                  <button 
                    onClick={() => handleProceedToBook(cab)}
                    className="mt-auto w-full bg-black hover:bg-neutral-800 text-white py-2 sm:py-3.5 rounded-lg sm:rounded-xl font-bold transition-all flex justify-center items-center gap-1.5 sm:gap-2 text-[11px] sm:text-base shadow-sm focus:outline-none focus:ring-4 focus:ring-neutral-200"
                  >
                    <span className="hidden sm:inline">Select & Book</span>
                    <span className="sm:hidden">Select</span>
                    <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
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