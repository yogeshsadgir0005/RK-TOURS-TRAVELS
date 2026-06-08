import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import heroImage from '../assets/hero.png';
import { 
  FiMapPin, FiArrowRight, FiShield, FiClock, FiDollarSign, 
  FiUsers, FiFilter, FiStar
} from 'react-icons/fi';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { RouteSkeleton } from '../components/SkeletonLoader';
import SEOHead from '../components/SEOHead';

// 3D Tilt Card Component
const TiltCard = ({ children, onClick, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useTransform(x, [-0.5, 0.5], [10, -10]);
  const mouseYSpring = useTransform(y, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateY: mouseXSpring,
        rotateX: mouseYSpring,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 z-20 rounded-[32px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-white/0 via-white/5 to-white/20"></div>
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [cabs, setCabs] = useState([]);
  const [loadingCabs, setLoadingCabs] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [heroBg, setHeroBg] = useState('https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=2070&auto=format&fit=crop');

  const [tripType, setTripType] = useState('one-way');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [routesRes, cabsRes, testimonialsRes, contentRes] = await Promise.all([
          axiosInstance.get('/routes?limit=6'),
          axiosInstance.get('/cabs?limit=4'),
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
        console.error("Error fetching home data:", error);
      } finally {
        setLoadingRoutes(false);
        setLoadingCabs(false);
        setLoadingTestimonials(false);
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

  const features = [
    { icon: FiShield, title: "Verified Drivers", desc: "Every partner undergoes strict background checks." },
    { icon: FiDollarSign, title: "Transparent Pricing", desc: "No hidden charges. What you see is what you pay." },
    { icon: FiClock, title: "On-Time Guarantee", desc: "Reliable pickups, every single time." },
    { icon: FiStar, title: "Premium Fleet", desc: "Well-maintained, clean, and comfortable cars." }
  ];

  return (
    <PageTransition>
      <div className="font-sans bg-bg-secondary min-h-screen">
        <SEOHead 
          title="Premium SaaS Cab Booking | RK Tours" 
          description="The most advanced intercity cab booking platform."
          url="/"
        />
        
        {/* HERO SECTION - DYNAMIC IMAGE BACKGROUND */}
        <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <img src={heroBg} alt="Hero Background" className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="text-center w-full"
            >
              <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] font-extrabold text-white leading-[1.1] text-center mb-6 max-w-4xl mx-auto">
                Book Your Ride, <br className="sm:hidden" />
                Anytime Anywhere
              </h1>
              <p className="text-lg md:text-xl text-gray-200 max-w-2xl text-center mx-auto font-medium mb-12">
                Reliable, comfortable, and affordable cab booking across 100+ cities in India.
              </p>
            </motion.div>

            {/* THE GLASS SEARCH WIDGET */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
              className="max-w-4xl mx-auto w-full relative z-30"
            >
              <div className="bg-white/90 backdrop-blur-3xl rounded-[28px] p-6 sm:p-8 border border-white shadow-[var(--shadow-saas-lg)]">
                  
                  {/* Segmented Control */}
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl w-max mb-6 sm:mb-8 relative">
                    <button 
                      onClick={() => setTripType('one-way')}
                      className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${tripType === 'one-way' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      One Way
                    </button>
                    <button 
                      onClick={() => setTripType('round-trip')}
                      className={`relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 z-10 ${tripType === 'round-trip' ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Round Trip
                    </button>
                    {/* Active Pill Indicator */}
                    <div 
                      className={`absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-[var(--shadow-saas-sm)] transition-transform duration-300 ease-out z-0 ${tripType === 'round-trip' ? 'translate-x-full' : 'translate-x-0'}`}
                    />
                  </div>

                  <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-4 sm:gap-6 items-end relative">
                    
                    <div className="w-full">
                      <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Pickup Location" />
                    </div>

                    {/* Swap Button Desktop */}
                    <div className="hidden md:flex items-center justify-center h-12 w-12 z-10 -mx-3">
                      <button 
                        type="button" 
                        onClick={handleSwap}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-[var(--shadow-saas-md)] flex items-center justify-center hover:bg-gray-50 active:scale-95 hover:rotate-180 transition-all duration-300 z-20 relative"
                      >
                        <FiArrowRight className="text-black" />
                      </button>
                    </div>

                    {/* Swap Button Mobile */}
                    <div className="md:hidden flex justify-center -my-2 relative z-10">
                      <button 
                        type="button" 
                        onClick={handleSwap}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all duration-300 rotate-90"
                      >
                        <FiArrowRight className="text-black text-sm" />
                      </button>
                    </div>

                    <div className="w-full">
                      <CityAutocomplete value={drop} onChange={setDrop} placeholder="Drop Location" isDrop={true} />
                    </div>

                    <div className="w-full mt-4 md:mt-0 h-full flex items-end">
                      <button 
                        type="submit" 
                        className="w-full px-10 h-[52px] bg-black hover:bg-gray-900 text-white rounded-[14px] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 group shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]"
                      >
                        Search <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* POPULAR ROUTES (Premium Structured) */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <div className="text-center mb-20 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10 opacity-50"></div>
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Popular Routes</h2>
            <p className="text-lg text-gray-500 font-medium">Most booked intercity routes by our customers</p>
          </div>

          {loadingRoutes ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {[1, 2, 3].map(i => <RouteSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {popularRoutes.map((route) => (
                <div 
                  key={route._id} 
                  className="bg-white rounded-[20px] md:rounded-[24px] overflow-hidden cursor-pointer group p-4 md:p-8 border border-gray-200/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-black/10 transition-all duration-500 relative flex flex-col min-h-[220px] md:min-h-[280px]"
                  onClick={() => navigate(`/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`, { state: { selectedRoute: route } })} 
                >
                  {/* Premium subtle gradient top right blob */}
                  <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-bl from-gray-50/80 to-transparent rounded-bl-full z-0 transition-transform duration-700 group-hover:scale-110"></div>
                  
                  <div className="relative z-10 flex-grow">
                    {/* Pickup */}
                    <div className="flex gap-3 md:gap-5 items-start mb-8 md:mb-12 group/pickup">
                      <div className="mt-1 relative z-20 bg-white">
                        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-[2px] md:border-[3px] border-black flex items-center justify-center bg-white shadow-sm transition-transform duration-300 group-hover/pickup:scale-110">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-black"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Pickup From</p>
                        <p className="font-black text-sm md:text-xl text-black leading-tight tracking-tight">{route.pickupCity}</p>
                      </div>
                    </div>

                    {/* Vertical dashed line with moving dot */}
                    <div className="absolute left-[24px] md:left-[34px] top-[24px] md:top-[34px] bottom-[70px] md:bottom-[100px] w-px border-l border-dashed border-gray-200 z-10">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full absolute -left-[3px] md:-left-[3.5px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:bg-black transition-all duration-500 group-hover:animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    </div>

                    {/* Drop */}
                    <div className="flex gap-3 md:gap-5 items-start mb-4 md:mb-6 group/drop">
                      <div className="mt-1 relative z-20 bg-white">
                        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full border-[2px] md:border-[3px] border-black flex items-center justify-center bg-white shadow-sm transition-transform duration-300 group-hover/drop:scale-110">
                          <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-black"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Drop To</p>
                        <p className="font-black text-sm md:text-xl text-black leading-tight tracking-tight">{route.destinationCity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 border-t border-gray-100/80 pt-3 md:pt-5 mt-auto flex flex-col md:flex-row md:justify-between items-start md:items-end gap-2 md:gap-0">
                    <div>
                      <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Distance</p>
                      <p className="font-black text-xs md:text-sm text-black tracking-tight">{route.distance} km</p>
                    </div>
                    <div className="text-black font-bold text-[10px] md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all duration-300 self-end">
                      View <FiArrowRight className="text-[12px] md:text-base"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FLEET SECTION (Premium Structured) */}
        <section className="py-24 bg-white border-t border-gray-100/60 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight mb-4">Our Fleet</h2>
              <p className="text-lg text-gray-500 font-medium">Choose from our wide range of meticulously maintained vehicles</p>
            </div>
            
            {loadingCabs ? (
              <div className="flex justify-center"><div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                {cabs.map((cab) => (
                  <div key={cab._id} className="bg-white rounded-[16px] md:rounded-[24px] p-2.5 md:p-4 border border-gray-200/60 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-black/10 transition-all duration-500 group flex flex-col h-full">
                    
                    {/* Premium Studio Image Box */}
                    <div className="relative w-full h-[120px] md:h-[200px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-50 via-gray-100/50 to-gray-50/50 rounded-xl md:rounded-2xl mb-3 md:mb-6 overflow-hidden flex items-center justify-center border border-gray-100/50">
                      {/* Glassmorphic AC Badge */}
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white/80 backdrop-blur-md rounded-full px-2 py-0.5 md:px-3 md:py-1 shadow-sm text-[8px] md:text-[10px] font-black border border-white/40 z-10 text-black tracking-widest">
                        {cab.acStatus || 'AC'}
                      </div>
                      <img 
                        src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} 
                        alt={cab.name} 
                        className="w-[90%] h-[90%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    
                    {/* Card Content */}
                    <div className="px-1 md:px-2 flex flex-col flex-grow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-1 md:gap-0">
                        <div>
                          <h3 className="text-sm md:text-xl font-black text-black tracking-tight leading-tight line-clamp-1">{cab.name}</h3>
                          <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5 md:mt-1">{cab.category || 'Sedan'}</p>
                        </div>
                        <div className="flex items-baseline md:text-right">
                          <span className="text-lg md:text-2xl font-black text-black leading-none">₹{cab.pricePerKm}</span>
                          <span className="text-[8px] md:text-[10px] font-bold text-gray-400 ml-0.5 md:ml-1">/km</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-8 mt-auto pt-2 md:pt-4">
                        <span className="px-1.5 py-1 md:px-3 md:py-1.5 bg-gray-50 rounded md:rounded-lg border border-gray-200/60 text-[9px] md:text-xs font-bold text-gray-600 flex items-center gap-1 md:gap-2 tracking-wide group-hover:bg-white group-hover:border-gray-200 transition-colors">
                          <FiUsers className="text-gray-400 text-[10px] md:text-sm" /> {cab.seats}
                        </span>
                        <span className="px-1.5 py-1 md:px-3 md:py-1.5 bg-gray-50 rounded md:rounded-lg border border-gray-200/60 text-[9px] md:text-xs font-bold text-gray-600 flex items-center gap-1 md:gap-2 tracking-wide group-hover:bg-white group-hover:border-gray-200 transition-colors">
                          <FiFilter className="text-gray-400 text-[10px] md:text-sm" /> {cab.fuelType || 'Petrol'}
                        </span>
                      </div>
                      
                      <button className="w-full bg-black text-white rounded-[10px] md:rounded-[14px] py-2 md:py-4 text-[10px] md:text-sm font-black flex justify-center items-center gap-1 md:gap-2 hover:bg-gray-900 active:scale-[0.98] transition-all duration-300 group/btn shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]">
                        Select <FiArrowRight className="text-[12px] md:text-base group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FEATURES (Clean Light Grid) */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-16 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-black tracking-tight mb-4">Why ride with us.</h2>
              <p className="text-xl text-gray-500 font-medium">Uncompromising quality at every turn.</p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              
              <div className="bg-gray-50 rounded-[20px] md:rounded-[32px] p-4 md:p-8 border border-gray-100 hover:bg-white hover:shadow-[var(--shadow-saas-md)] hover:border-gray-200 transition-all duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 border border-gray-100">
                  <FiShield className="text-lg md:text-xl text-black" />
                </div>
                <h3 className="text-sm md:text-xl font-black text-black tracking-tight mb-1.5 md:mb-3">Verified Drivers</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium leading-snug">Strict background checks ensure your safety is our highest priority.</p>
              </div>

              <div className="bg-gray-50 rounded-[20px] md:rounded-[32px] p-4 md:p-8 border border-gray-100 hover:bg-white hover:shadow-[var(--shadow-saas-md)] hover:border-gray-200 transition-all duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 border border-gray-100">
                  <FiDollarSign className="text-lg md:text-xl text-black" />
                </div>
                <h3 className="text-sm md:text-xl font-black text-black tracking-tight mb-1.5 md:mb-3">Transparent Pricing</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium leading-snug">No hidden charges. What you see is exactly what you pay.</p>
              </div>

              <div className="bg-gray-50 rounded-[20px] md:rounded-[32px] p-4 md:p-8 border border-gray-100 hover:bg-white hover:shadow-[var(--shadow-saas-md)] hover:border-gray-200 transition-all duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 border border-gray-100">
                  <FiClock className="text-lg md:text-xl text-black" />
                </div>
                <h3 className="text-sm md:text-xl font-black text-black tracking-tight mb-1.5 md:mb-3">On-Time Guarantee</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium leading-snug">Punctual pickups and efficient routing ensure you never wait.</p>
              </div>

              <div className="bg-gray-50 rounded-[20px] md:rounded-[32px] p-4 md:p-8 border border-gray-100 hover:bg-white hover:shadow-[var(--shadow-saas-md)] hover:border-gray-200 transition-all duration-300">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 border border-gray-100">
                  <FiStar className="text-lg md:text-xl text-black" />
                </div>
                <h3 className="text-sm md:text-xl font-black text-black tracking-tight mb-1.5 md:mb-3">Premium Fleet</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium leading-snug">Travel in comfort with our meticulously maintained, clean cars.</p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default Home;