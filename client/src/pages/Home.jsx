import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import { 
  FiMapPin, FiArrowRight, FiShield, FiClock, FiDollarSign, 
  FiStar, FiUsers, FiSearch, FiCalendar, FiRefreshCw, FiFilter, FiChevronDown
} from 'react-icons/fi';
import { FaStar, FaCarSide } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  
  // Data States
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [cabs, setCabs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  
  /* NEW INTEGRATION: Hero Background State */
  const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop');
  
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Search Widget States
  const [tripType, setTripType] = useState('one-way');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [cabType, setCabType] = useState('');
  
  // Custom Dropdown State
  const [isCabDropdownOpen, setIsCabDropdownOpen] = useState(false);
  const cabDropdownRef = useRef(null);

  const cabOptions = [
    { value: '', label: 'Any Cab' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' }
  ];

  // Close dropdown when clicking outside
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
    const fetchData = async () => {
      try {
        const [routesRes, cabsRes, testimonialsRes, contentRes] = await Promise.all([
          axiosInstance.get('/routes'),
          axiosInstance.get('/cabs'),
          axiosInstance.get('/content/testimonials'),
          /* NEW INTEGRATION: Fetch Settings for Hero BG */
          axiosInstance.get('/content')
        ]);
        setPopularRoutes(routesRes.data.slice(0, 6));
        setCabs(cabsRes.data.slice(0, 4));
        setTestimonials(testimonialsRes.data.slice(0, 3));
        
        /* NEW INTEGRATION: Apply Hero BG */
        if (contentRes.data.heroImageUrl) {
          setHeroBg(contentRes.data.heroImageUrl);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoadingRoutes(false);
        setLoadingCabs(false);
        setLoadingTestimonials(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if(!pickup || !drop || !date) {
        alert("Please fill pickup, drop, and date to search.");
        return;
    }
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${date}&type=${cabType}&trip=${tripType}`);
  };

  const features = [
    { icon: FiShield, title: 'Safe Rides', desc: 'Verified drivers and GPS-tracked rides for your safety.' },
    { icon: FiClock, title: 'On Time', desc: 'Punctual pickup and drop-off, guaranteed.' },
    { icon: FiDollarSign, title: 'Best Prices', desc: 'Transparent pricing with no hidden charges.' },
    { icon: FiStar, title: 'Top Rated', desc: '4.8/5 average rating from 50,000+ riders.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-12">
      <SEOHead title="Reliable Intercity Cabs" description="Book affordable one-way and round-trip cabs instantly." url="/" />
      
      {/* HERO SECTION */}
      <section className="bg-black pt-28 pb-32 px-4 relative overflow-hidden min-h-[85vh] flex flex-col justify-center">
        <div 
          className="absolute inset-0 z-0 opacity-60 lg:opacity-90 pointer-events-none transition-all duration-700"
          style={{
            /* NEW INTEGRATION: Applied Dynamic Background */
            backgroundImage: `url('${heroBg}')`,
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent 95%)'
          }}
        ></div>

        <div className="max-w-7xl w-full mx-auto relative z-10">
          <div className="max-w-2xl text-left mb-12 lg:mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Book Your Ride, <br />
              Anytime Anywhere
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-xl font-normal tracking-wide">
              Reliable, comfortable, and affordable cab booking across 100+ cities in India.
            </p>
          </div>

          {/* Search Widget */}
          <div className="relative z-20 max-w-[1050px] w-full">
            <div className="bg-[#181818] rounded-3xl shadow-2xl p-6 lg:p-8 text-left border border-neutral-800">
              
              <div className="flex items-center gap-3 mb-6">
                <button 
                  onClick={() => setTripType('one-way')} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${tripType === 'one-way' ? 'bg-black text-white border border-neutral-600 shadow-md' : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                >
                  <FiArrowRight /> One Way
                </button>
                <button 
                  onClick={() => setTripType('round-trip')} 
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${tripType === 'round-trip' ? 'bg-black text-white border border-neutral-600 shadow-md' : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                >
                  <FiRefreshCw /> Round Trip
                </button>
              </div>

              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  
                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[13px] font-medium text-neutral-400 ml-1">Pickup Location</label>
                    <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                  </div>

                  <div className="flex flex-col gap-2 relative">
                    <label className="text-[13px] font-medium text-neutral-400 ml-1">Drop Location</label>
                    <CityAutocomplete value={drop} onChange={setDrop} placeholder="Enter city" icon={FiMapPin} iconColorClass="text-black" />
                  </div>

                  {/* Upgraded Date Picker */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-neutral-400 ml-1">Travel Date</label>
                    <div className="relative overflow-hidden rounded-2xl bg-white">
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
                    <label className="text-[13px] font-medium text-neutral-400 ml-1">Cab Type</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
                        <FaCarSide className="text-black text-lg" />
                      </div>
                      <div 
                        onClick={() => setIsCabDropdownOpen(!isCabDropdownOpen)}
                        className="w-full pl-11 pr-4 py-3.5 bg-white border-none rounded-2xl text-black transition-all text-sm font-medium cursor-pointer flex items-center justify-between select-none"
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
                  <button type="submit" className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 border border-neutral-700 text-white px-8 py-3.5 rounded-2xl font-medium text-sm transition-all shadow-md w-full sm:w-auto">
                    <FiSearch size={18} /> Search Cabs
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-black mb-3 tracking-tight">Popular Routes</h2>
          <p className="text-gray-500 font-medium">Most booked intercity routes by our customers</p>
        </div>
        {loadingRoutes ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.map((route) => (
              <Link key={route._id} to={`/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`} className="group block">
                <div className="bg-white rounded-3xl border border-neutral-100 p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="p-3 bg-neutral-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <FiMapPin size={24} />
                    </div>
                    <span className="text-sm font-bold text-neutral-400">Fixed Fare</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-black tracking-tight">{route.pickupCity}</span>
                      <FiArrowRight className="text-neutral-300" />
                      <span className="text-2xl font-bold text-black tracking-tight">{route.destinationCity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium">
                      <span>{route.distance} km</span>
                      <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                      <span>Starting ₹{route.basePrice}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Our Fleet Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-black mb-3 tracking-tight">Our Fleet</h2>
          <p className="text-gray-500 font-medium">Choose from our wide range of well-maintained vehicles</p>
        </div>
        
        {loadingCabs ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cabs.map((cab) => (
              <div key={cab._id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden flex flex-col hover:border-black transition-all duration-300">
                
                <div className="h-48 w-full bg-gray-50 relative p-4 flex items-center justify-center border-b border-gray-100">
                  <img 
                    src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} 
                    alt={cab.name} 
                    className="max-w-full max-h-full object-contain" 
                  />
                  <div className="absolute top-4 right-4 bg-white border border-gray-200 px-3 py-1 rounded-full text-[11px] font-bold text-black shadow-sm z-10 tracking-wide">
                    {cab.acStatus || 'AC'}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">{cab.name}</h3>
                      <p className="text-gray-500 text-sm capitalize">{cab.category || 'Sedan'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-extrabold text-black">
                        ₹{cab.pricePerKm}<span className="text-sm text-gray-500 font-medium">/km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-700 mb-6 font-medium">
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                      <FiUsers className="text-black"/> {cab.seats} Seats
                    </span>
                    <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                      <FiFilter className="text-black" /> {cab.fuelType || 'Petrol'}
                    </span>
                  </div>

                  <Link 
                    to={`/cab/${cab._id}`} 
                    className="mt-auto w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                  >
                    Select & Book <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-black mb-3 tracking-tight">Why Choose CabBook</h2>
            <p className="text-gray-500 font-medium">Thousands of travelers trust us for their intercity travel</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-200 text-center hover:border-black transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-black text-white rounded-2xl mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black tracking-tight">What Our Riders Say</h2>
        </div>
        
        {loadingTestimonials ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200 max-w-md mx-auto">
            <p className="text-gray-500 font-medium">No testimonials yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 flex flex-col h-full">
                <div className="flex gap-1.5 text-black mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-600 mb-8 italic leading-relaxed text-sm lg:text-base flex-grow">
                  "{testimonial.review}"
                </p>
                <h4 className="font-bold text-black">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;