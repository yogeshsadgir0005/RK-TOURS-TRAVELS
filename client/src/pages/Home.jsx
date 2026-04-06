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
  const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop');
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Search Widget States (Date & Cab Type removed from UI, but kept in state for routing)
  const [tripType, setTripType] = useState('one-way');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [routesRes, cabsRes, testimonialsRes, contentRes] = await Promise.all([
          axiosInstance.get('/routes'),
          axiosInstance.get('/cabs'),
          axiosInstance.get('/content/testimonials'),
          axiosInstance.get('/content')
        ]);
        setPopularRoutes(routesRes.data.slice(0, 6));
        setCabs(cabsRes.data.slice(0, 4));
        setTestimonials(testimonialsRes.data.slice(0, 3));
        
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
    if(!pickup || !drop) {
        alert("Please enter both pickup and drop locations to search.");
        return;
    }
    // Automatically inject today's date for seamless routing to SearchResults page
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${today}&type=&trip=${tripType}`);
  };

  const features = [
    { icon: FiShield, title: 'Safe Rides', desc: 'Verified drivers and GPS-tracked rides for your safety.' },
    { icon: FiClock, title: 'On Time', desc: 'Punctual pickup and drop-off, guaranteed.' },
    { icon: FiDollarSign, title: 'Best Prices', desc: 'Transparent pricing with no hidden charges.' },
    { icon: FiStar, title: 'Top Rated', desc: '4.8/5 average rating from 50,000+ riders.' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans pb-8 sm:pb-12">
      <SEOHead title="Reliable Intercity Cabs" description="Book affordable one-way and round-trip cabs instantly." url="/" />
      
      {/* HERO SECTION */}
      <section className="bg-black pt-24 pb-16 px-3 sm:pt-32 sm:pb-40 sm:px-4 relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex flex-col justify-center">
        <div 
          className="absolute inset-0 z-0 opacity-60 lg:opacity-90 pointer-events-none transition-all duration-700"
          style={{
            backgroundImage: `url('${heroBg}')`,
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to right, black 40%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 40%, transparent 95%)'
          }}
        ></div>

        <div className="max-w-7xl w-full mx-auto relative z-10 mt-6 sm:mt-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
          
          <div className="max-w-2xl text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold text-white mb-3 sm:mb-6 tracking-tight leading-[1.1]">
              Book Your Ride, <br className="hidden sm:block" />
              Anytime Anywhere
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-200 max-w-xl font-medium tracking-wide drop-shadow-md">
              Reliable, comfortable, and affordable cab booking across 100+ cities in India.
            </p>
          </div>

          {/* REDESIGNED: Uber-Style Compact Search Widget */}
          <div className="relative z-20 max-w-[420px] w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-left border border-gray-100">
              
              <h2 className="text-3xl font-extrabold text-black mb-6 tracking-tight">Get a ride</h2>

              {/* Sleek Tabs */}
              <div className="flex items-center gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl w-max">
                <button 
                  onClick={() => setTripType('one-way')} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${tripType === 'one-way' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-500 hover:text-black'}`}
                >
                  One Way
                </button>
                <button 
                  onClick={() => setTripType('round-trip')} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${tripType === 'round-trip' ? 'bg-white text-black shadow-sm' : 'bg-transparent text-gray-500 hover:text-black'}`}
                >
                  Round Trip
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col gap-4">
                
                {/* Pickup */}
                <div className="flex flex-col gap-1 w-full">
                  <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Pickup location" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                {/* Drop */}
                <div className="flex flex-col gap-1 w-full">
                  <CityAutocomplete value={drop} onChange={setDrop} placeholder="Dropoff location" icon={FiMapPin} iconColorClass="text-black" />
                </div>

                <div className="pt-3">
                  <button type="submit" className="w-full h-14 bg-black hover:bg-neutral-800 text-white rounded-xl font-bold text-base transition-all shadow-lg flex items-center justify-center transform hover:-translate-y-0.5">
                    Search Cabs
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>

      {/* Popular Routes Section (NOW 2:2 MOBILE GRID) */}
      <section className="pt-12 pb-8 sm:pt-24 sm:pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-1 sm:mb-3 tracking-tight">Popular Routes</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Most booked intercity routes by our customers</p>
        </div>
        {loadingRoutes ? (
          <div className="flex justify-center py-8 sm:py-12"><div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-black"></div></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {popularRoutes.map((route) => (
              <div 
                key={route._id} 
                onClick={() => navigate(`/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`, { state: { selectedRoute: route } })} 
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 hover:border-black shadow-sm hover:shadow-xl transition-all duration-300 p-3 sm:p-6 relative overflow-hidden h-full flex flex-col cursor-pointer group"
              >
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-24 sm:h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-colors group-hover:bg-gray-100"></div>
                
                <div className="flex-grow space-y-2 sm:space-y-5 relative z-10">
                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-green-600 w-2.5 h-2.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Pickup From</p>
                      {route.pickupStreet && <p className="text-[8px] sm:text-sm text-black font-bold mt-0.5 sm:mt-1 line-clamp-1">{route.pickupStreet}</p>}
                      <p className="font-bold text-black text-[11px] sm:text-lg leading-tight line-clamp-1">{route.pickupCity}</p>
                    </div>
                  </div>

                  <div className="pl-2.5 sm:pl-4 py-0 sm:py-1">
                    <div className="w-0.5 h-3 sm:h-6 bg-gray-200"></div>
                  </div>

                  <div className="flex items-start gap-2 sm:gap-4">
                    <div className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <FiMapPin className="text-red-600 w-2.5 h-2.5 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <p className="text-[8px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Drop To</p>
                          {route.destinationStreet && <p className="text-[8px] sm:text-sm text-black font-bold mt-0.5 sm:mt-1 line-clamp-1">{route.destinationStreet}</p>}
                      <p className="font-bold text-black text-[11px] sm:text-lg leading-tight line-clamp-1">{route.destinationCity}</p>
                  
                    </div>
                  </div>
                </div>

                <div className="mt-4 sm:mt-8 pt-2.5 sm:pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between relative z-10 gap-1.5 sm:gap-0">
                  <div className="flex flex-col">
                     <span className="text-[8px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">Distance</span>
                     <span className="font-bold text-black text-[10px] sm:text-base">{route.distance} km</span>
                  </div>
                  <div className="flex items-center text-black font-bold group-hover:underline text-[9px] sm:text-base">
                    View <FiArrowRight className="ml-0.5 sm:ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Our Fleet Section */}
      <section className="py-8 sm:py-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-1 sm:mb-3 tracking-tight">Our Fleet</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Choose from our wide range of vehicles</p>
        </div>
        
        {loadingCabs ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {cabs.map((cab) => (
              <div key={cab._id} className="bg-white rounded-[16px] sm:rounded-[24px] border border-gray-200 overflow-hidden flex flex-col hover:border-black transition-all duration-300">
                
                <div className="h-28 sm:h-48 w-full bg-gray-50 relative p-2 sm:p-4 flex items-center justify-center border-b border-gray-100">
                  <img 
                    src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} 
                    alt={cab.name} 
                    className="max-w-full max-h-full object-contain" 
                  />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white border border-gray-200 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold text-black shadow-sm z-10 tracking-wide">
                    {cab.acStatus || 'AC'}
                  </div>
                </div>

                <div className="px-3 pb-3 pt-2 sm:px-6 sm:pb-6 sm:pt-4 flex flex-col flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start mb-2 sm:mb-4">
                    <div>
                      <h3 className="text-sm sm:text-xl font-bold text-black leading-tight">{cab.name}</h3>
                      <p className="text-gray-500 text-[10px] sm:text-sm capitalize mt-0.5">{cab.category || 'Sedan'}</p>
                    </div>
                    <div className="text-left sm:text-right mt-1 sm:mt-0">
                      <div className="text-base sm:text-2xl font-extrabold text-black">
                        ₹{cab.pricePerKm}<span className="text-[10px] sm:text-sm text-gray-500 font-medium">/km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 sm:gap-3 text-gray-700 mb-3 sm:mb-6 font-medium flex-wrap">
                    <span className="flex items-center gap-1 sm:gap-1.5 bg-gray-100 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[10px] sm:text-sm">
                      <FiUsers className="text-black w-3 h-3 sm:w-4 sm:h-4"/> {cab.seats}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5 bg-gray-100 px-1.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[10px] sm:text-sm">
                      <FiFilter className="text-black w-3 h-3 sm:w-4 sm:h-4" /> {cab.fuelType || 'Petrol'}
                    </span>
                  </div>

                  <Link 
                    to={`/cab/${cab._id}`} 
                    className="mt-auto w-full bg-black hover:bg-neutral-800 text-white py-2 sm:py-3.5 rounded-lg sm:rounded-xl font-bold transition-all flex justify-center items-center gap-1.5 sm:gap-2 text-[11px] sm:text-base"
                  >
                    Select <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-16 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black mb-1 sm:mb-3 tracking-tight">Why Choose Us</h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">Thousands of travelers trust us</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 text-center hover:border-black transition-all duration-300">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-black text-white rounded-lg sm:rounded-2xl mb-3 sm:mb-6">
                  <feature.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-sm sm:text-xl font-bold text-black mb-1 sm:mb-3 leading-tight">{feature.title}</h3>
                <p className="text-gray-600 text-[10px] sm:text-sm leading-tight sm:leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-24 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">What Our Riders Say</h2>
        </div>
        
        {loadingTestimonials ? (
          <div className="flex justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-black"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl sm:rounded-2xl border border-gray-200 max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-gray-500 font-medium">No testimonials yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-200 hover:border-black transition-all duration-300 flex flex-col h-full">
                <div className="flex gap-1 sm:gap-1.5 text-black mb-3 sm:mb-6 text-xs sm:text-base">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 sm:mb-8 italic leading-relaxed text-xs sm:text-base flex-grow">
                  "{testimonial.review}"
                </p>
                <h4 className="font-bold text-black text-sm sm:text-base">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;