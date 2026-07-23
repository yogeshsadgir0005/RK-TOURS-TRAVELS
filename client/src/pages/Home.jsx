import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import { 
  FiArrowRight, FiUsers, FiFilter, FiStar, FiCheck, FiPhoneCall
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import { RouteSkeleton } from '../components/SkeletonLoader';
import SEOHead from '../components/SEOHead';
import { DEFAULT_ROUTES, DEFAULT_CABS, mergeDataById, getCityImage, getRouteStartingPrice } from '../data/defaultData';

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  
  const [popularRoutes, setPopularRoutes] = useState(DEFAULT_ROUTES);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [cabs, setCabs] = useState(DEFAULT_CABS);
  const [loadingCabs, setLoadingCabs] = useState(false);

  const [tripType, setTripType] = useState('one-way');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [routesRes, cabsRes] = await Promise.all([
          axiosInstance.get('/routes?limit=12').catch(() => ({ data: [] })),
          axiosInstance.get('/cabs?limit=12').catch(() => ({ data: [] }))
        ]);

        const fetchedRoutes = Array.isArray(routesRes.data) ? routesRes.data : [];
        const fetchedCabs = Array.isArray(cabsRes.data) ? cabsRes.data : [];

        const mergedRoutes = mergeDataById(DEFAULT_ROUTES, fetchedRoutes);
        const mergedCabs = mergeDataById(DEFAULT_CABS, fetchedCabs);

        setPopularRoutes(mergedRoutes.slice(0, 6));
        setCabs(mergedCabs.slice(0, 4));
        sessionStorage.setItem('routesData', JSON.stringify(mergedRoutes));
        sessionStorage.setItem('cabsData', JSON.stringify(mergedCabs));
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!pickup || !drop) {
      alert("Please enter pickup and drop locations.");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${today}&trip=${tripType}`);
  };

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  return (
    <PageTransition>
      <div className="font-sans bg-neutral-900 min-h-screen">
        <SEOHead 
          title="RK Tours & Travels — Outstation Cab Booking" 
          description="Book outstation cabs across Maharashtra. Reliable service, transparent pricing, 24/7 availability."
          url="/"
        />
        
        {/* ─── HERO ─── */}
        <section className="relative bg-neutral-900 overflow-hidden pt-24 sm:pt-28 pb-10 sm:pb-14">
          {/* Video with Mobile-First Fit & Dark Gradient Mask */}
          <div className="absolute inset-0 z-0 overflow-hidden">
             <video 
               src="/rk_hero_bg.mp4" 
               autoPlay 
               loop 
               muted 
               playsInline
               webkit-playsinline="true"
               x5-playsinline="true"
               className="w-full h-full object-cover object-center opacity-70 sm:opacity-80 scale-105 pointer-events-none" 
             />
             <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-900/40 to-neutral-900"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3 sm:mb-4">
                Outstation Cab Booking <br className="hidden sm:block" />
                <span className="text-orange-500">Anywhere in Maharashtra</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg">
                Affordable intercity cabs with verified drivers. Mumbai, Pune, Nashik, Nagpur and 50+ cities.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl sm:rounded-xl p-4 sm:p-5 max-w-3xl shadow-xl">
              
              {/* Trip Type Tabs */}
              <div className="flex gap-0 mb-3 sm:mb-4 border-b border-white/20">
                <button 
                  onClick={() => setTripType('one-way')}
                  className={`text-xs sm:text-sm font-semibold pb-2 sm:pb-2.5 px-3.5 sm:px-4 border-b-2 transition-colors ${tripType === 'one-way' ? 'border-orange-500 text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                >
                  One Way
                </button>
                <button 
                  onClick={() => setTripType('round-trip')}
                  className={`text-xs sm:text-sm font-semibold pb-2 sm:pb-2.5 px-3.5 sm:px-4 border-b-2 transition-colors ${tripType === 'round-trip' ? 'border-orange-500 text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                >
                  Round Trip
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-end">
                
                {/* Inputs Container */}
                <div className="relative flex flex-col sm:flex-row flex-1 gap-2.5 sm:gap-3 items-stretch sm:items-end">
                  <div className="flex-1 pr-9 sm:pr-0">
                    <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Pickup city" darkTheme={true} />
                  </div>

                  {/* Swap Button (Right side centered on mobile; in-between on desktop) */}
                  <div className="absolute right-0 top-[54%] -translate-y-1/2 sm:static sm:translate-y-0 sm:h-12 flex items-center justify-center z-10">
                    <button 
                      type="button" 
                      onClick={handleSwap}
                      className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-neutral-800 border border-white/30 flex items-center justify-center text-white/90 hover:text-white hover:bg-neutral-700 transition-all shadow-md sm:rotate-0 rotate-90 text-xs sm:text-sm"
                      title="Swap Pickup & Drop"
                    >
                      ⇄
                    </button>
                  </div>

                  <div className="flex-1 pr-9 sm:pr-0">
                    <CityAutocomplete value={drop} onChange={setDrop} placeholder="Drop city" isDrop={true} darkTheme={true} />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm px-5 sm:px-6 h-11 sm:h-12 rounded-xl transition-colors flex items-center justify-center gap-2 flex-shrink-0 w-full sm:w-auto mt-1 sm:mt-0 shadow-lg"
                >
                  Search Cabs <FiArrowRight />
                </button>
              </form>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 sm:mt-5">
              {['Verified Drivers', 'No Hidden Charges', '24/7 Support', 'Free Cancellation'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-gray-300 font-medium">
                  <FiCheck className="text-orange-500 text-sm" /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── POPULAR ROUTES ─── */}
        <section className="py-10 sm:py-14 bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Popular Routes</h2>
                <p className="text-sm text-gray-400 mt-1">Most booked intercity routes</p>
              </div>
              <Link to="/search" className="text-sm font-semibold text-orange-600 hover:text-orange-700 hidden sm:flex items-center gap-1">
                View all <FiArrowRight className="text-xs" />
              </Link>
            </div>

            {loadingRoutes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {[1, 2, 3, 4].map(i => <RouteSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {popularRoutes.map((route) => (
                  <div 
                    key={route._id} 
                    className="bg-neutral-900/90 rounded-2xl border border-neutral-800 p-5 sm:p-6 cursor-pointer hover:border-orange-500/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                    onClick={() => navigate(`/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`, { state: { selectedRoute: route } })} 
                  >
                    {/* Top Bar: Badge & Distance */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800/80">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        Outstation
                      </span>
                      <span className="text-xs font-semibold text-gray-400">
                        {route.distance} km
                      </span>
                    </div>

                    {/* Main Route Info: Timeline with City Avatars & Names */}
                    <div className="space-y-3 my-1">
                      {/* Pickup City */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={getCityImage(route.pickupCity)} 
                          alt={route.pickupCity} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/80 p-0.5 bg-neutral-800 flex-shrink-0 shadow-md ring-2 ring-emerald-500/20"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=120&q=80"; }}
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block leading-none mb-1">Pickup</span>
                          <p className="text-base font-bold text-white truncate leading-none">{route.pickupCity}</p>
                        </div>
                      </div>

                      {/* Vertical Connecting Line */}
                      <div className="w-0.5 h-3.5 bg-gradient-to-b from-emerald-500/50 via-neutral-700 to-rose-500/50 ml-4"></div>

                      {/* Drop City */}
                      <div className="flex items-center gap-3">
                        <img 
                          src={getCityImage(route.destinationCity)} 
                          alt={route.destinationCity} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-rose-500/80 p-0.5 bg-neutral-800 flex-shrink-0 shadow-md ring-2 ring-rose-500/20"
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=120&q=80"; }}
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block leading-none mb-1">Destination</span>
                          <p className="text-base font-bold text-white truncate leading-none">{route.destinationCity}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Starting Fare & Action Button */}
                    <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-medium text-gray-400 block mb-0.5">Starting from</span>
                        <span className="text-lg sm:text-xl font-extrabold text-orange-500 leading-none">
                          ₹{getRouteStartingPrice(route).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <button className="px-3.5 py-2 rounded-xl bg-neutral-800 group-hover:bg-orange-500 text-xs font-bold text-white transition-all duration-200 flex items-center gap-1.5 shadow-sm">
                        Book <FiArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── OUR FLEET ─── */}
        <section className="py-10 sm:py-14 bg-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Our Fleet</h2>
                <p className="text-sm text-gray-400 mt-1">Well-maintained vehicles for every budget</p>
              </div>
            </div>
            
            {loadingCabs ? (
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {cabs.map((cab) => (
                  <div key={cab._id} className="bg-neutral-800/80 rounded-2xl border border-neutral-800 overflow-hidden hover:border-orange-500/60 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                    
                    {/* Image Container */}
                    <div className="relative bg-neutral-900/90 h-40 sm:h-44 flex items-center justify-center p-4 border-b border-neutral-800/60">
                      <span className="absolute top-3 right-3 bg-neutral-800/90 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-neutral-700/60 shadow-sm">
                        {cab.acStatus || 'AC'}
                      </span>
                      <img 
                        src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} 
                        alt={cab.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold text-white leading-snug">{cab.name}</h3>
                          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mt-0.5">{cab.category || 'Sedan'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg sm:text-xl font-extrabold text-white">₹{cab.pricePerKm}</span>
                          <span className="text-xs text-gray-400 font-medium">/km</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-gray-400 font-medium pt-3 border-t border-neutral-800/80">
                        <span className="flex items-center gap-1.5"><FiUsers className="text-orange-500" /> {cab.seats} seats</span>
                        <span>•</span>
                        <span className="flex items-center gap-1.5"><FiFilter className="text-orange-500" /> {cab.fuelType || 'Petrol'}</span>
                      </div>

                      <button 
                        onClick={() => navigate('/book', { 
                          state: { 
                            cab, 
                            journey: { 
                              pickup: pickup || 'Nashik', 
                              drop: drop || 'Mumbai', 
                              date: new Date().toISOString().split('T')[0], 
                              tripType: tripType || 'one-way' 
                            } 
                          } 
                        })}
                        className="w-full mt-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        Book Cab <FiArrowRight className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── STATS STRIP ─── */}
        <section className="bg-neutral-900 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {[
                { num: '10,000+', label: 'Trips Completed' },
                { num: '50+', label: 'Cities Covered' },
                { num: '500+', label: 'Happy Customers' },
                { num: '24/7', label: 'Customer Support' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-500">{stat.num}</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <section className="py-10 sm:py-14 bg-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">What our customers say</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: "Rahul S.", city: "Pune", text: "Booked a cab from Pune to Mumbai. Driver arrived on time, car was clean. Very smooth experience." },
                { name: "Priya M.", city: "Nashik", text: "Transparent pricing with no hidden charges. The fare shown was exactly what I paid. Will use again." },
                { name: "Amit K.", city: "Mumbai", text: "Used RK Tours for my family trip. Comfortable Innova, professional driver. Highly recommended." }
              ].map((review, i) => (
                <div key={i} className="bg-neutral-900 rounded-lg border border-neutral-800 p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <FiStar key={s} className="text-orange-500 fill-orange-500 text-sm" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">"{review.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-neutral-800 text-white flex items-center justify-center text-xs font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{review.name}</p>
                      <p className="text-[11px] text-gray-400">{review.city}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA STRIP ─── */}
        <section className="bg-orange-500 py-8 sm:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Need a cab? Call us directly.</h3>
              <p className="text-sm text-white/90">Available 24/7 for bookings and enquiries</p>
            </div>
            <a href="tel:+919130899368" className="bg-neutral-900 text-white font-bold text-sm px-6 py-3 rounded-md flex items-center gap-2 hover:bg-neutral-800 transition-colors flex-shrink-0">
              <FiPhoneCall /> +91 91308 99368
            </a>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;