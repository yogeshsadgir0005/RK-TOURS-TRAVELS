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

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [cabs, setCabs] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(true);

  const [tripType, setTripType] = useState('one-way');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        let routesData, cabsData;
        const cachedRoutes = sessionStorage.getItem('routesData');
        const cachedCabs = sessionStorage.getItem('cabsData');

        if (cachedRoutes && cachedCabs) {
          routesData = JSON.parse(cachedRoutes);
          cabsData = JSON.parse(cachedCabs);
        } else {
          const [routesRes, cabsRes] = await Promise.all([
            axiosInstance.get('/routes?limit=6'),
            axiosInstance.get('/cabs?limit=4')
          ]);
          routesData = routesRes.data.slice(0, 6);
          cabsData = cabsRes.data.slice(0, 4);
          sessionStorage.setItem('routesData', JSON.stringify(routesData));
          sessionStorage.setItem('cabsData', JSON.stringify(cabsData));
        }

        setPopularRoutes(routesData);
        setCabs(cabsData);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoadingRoutes(false);
        setLoadingCabs(false);
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
        <section className="relative bg-neutral-900 min-h-[100dvh] flex flex-col justify-center overflow-hidden pt-24 pb-12">
          {/* Video */}
          <div className="absolute inset-0 z-0">
             <video 
               src="/rk_hero_bg.mp4" 
               autoPlay 
               loop 
               muted 
               playsInline 
               className="w-full h-full object-cover opacity-80" 
             />
          </div>
          
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Outstation Cab Booking <br className="hidden sm:block" />
                <span className="text-orange-500">Anywhere in Maharashtra</span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base mb-8 max-w-lg">
                Affordable intercity cabs with verified drivers. Mumbai, Pune, Nashik, Nagpur and 50+ cities.
              </p>
            </div>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 sm:p-5 max-w-3xl shadow-xl">
              
              {/* Trip Type Tabs */}
              <div className="flex gap-0 mb-4 border-b border-white/20">
                <button 
                  onClick={() => setTripType('one-way')}
                  className={`text-sm font-semibold pb-2.5 px-4 border-b-2 transition-colors ${tripType === 'one-way' ? 'border-orange-500 text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                >
                  One Way
                </button>
                <button 
                  onClick={() => setTripType('round-trip')}
                  className={`text-sm font-semibold pb-2.5 px-4 border-b-2 transition-colors ${tripType === 'round-trip' ? 'border-orange-500 text-white' : 'border-transparent text-white/60 hover:text-white'}`}
                >
                  Round Trip
                </button>
              </div>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                
                <div className="flex-1">
                  <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Pickup city" darkTheme={true} />
                </div>

                {/* Swap */}
                <button 
                  type="button" 
                  onClick={handleSwap}
                  className="self-center w-8 h-8 sm:mb-2 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors sm:rotate-0 rotate-90 flex-shrink-0"
                >
                  ⇄
                </button>

                <div className="flex-1">
                  <CityAutocomplete value={drop} onChange={setDrop} placeholder="Drop city" isDrop={true} darkTheme={true} />
                </div>

                <button 
                  type="submit" 
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 h-12 rounded-xl transition-colors flex items-center justify-center gap-2 flex-shrink-0 w-full sm:w-auto"
                >
                  Search Cabs <FiArrowRight />
                </button>
              </form>
            </div>

            {/* Trust Strip */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3].map(i => <RouteSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {popularRoutes.map((route) => (
                  <div 
                    key={route._id} 
                    className="bg-neutral-900 rounded-lg border border-neutral-800 p-4 cursor-pointer hover:border-orange-500 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                    onClick={() => navigate(`/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`, { state: { selectedRoute: route } })} 
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-green-500 bg-neutral-900"></div>
                        <div className="w-px h-5 bg-gray-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-red-500 bg-neutral-900"></div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{route.pickupCity}</p>
                        <p className="text-sm font-semibold text-white truncate mt-1">{route.destinationCity}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">{route.distance} km</p>
                      <span className="text-xs font-semibold text-orange-600 group-hover:underline mt-1 inline-block">View →</span>
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
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {cabs.map((cab) => (
                  <div key={cab._id} className="bg-neutral-800 rounded-lg border border-neutral-800 overflow-hidden hover:border-orange-500 hover:shadow-md transition-all group">
                    
                    {/* Image */}
                    <div className="relative bg-neutral-900 h-32 sm:h-40 flex items-center justify-center p-3">
                      <span className="absolute top-2 right-2 bg-neutral-900 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {cab.acStatus || 'AC'}
                      </span>
                      <img 
                        src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} 
                        alt={cab.name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-white truncate">{cab.name}</h3>
                          <p className="text-[11px] text-gray-400 uppercase">{cab.category || 'Sedan'}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-base sm:text-lg font-bold text-white">₹{cab.pricePerKm}</span>
                          <span className="text-[10px] text-gray-400">/km</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 text-[11px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><FiUsers className="text-[11px]" /> {cab.seats} seats</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><FiFilter className="text-[11px]" /> {cab.fuelType || 'Petrol'}</span>
                      </div>
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
            <a href="tel:+918087959271" className="bg-neutral-900 text-white font-bold text-sm px-6 py-3 rounded-md flex items-center gap-2 hover:bg-neutral-800 transition-colors flex-shrink-0">
              <FiPhoneCall /> +91 80879 59271
            </a>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;