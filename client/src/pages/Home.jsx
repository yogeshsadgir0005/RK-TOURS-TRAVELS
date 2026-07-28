import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import {
  FiArrowRight, FiArrowUpRight, FiStar, FiCheck,
  FiPhoneCall, FiNavigation, FiRepeat
} from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import { RouteSkeleton } from '../components/SkeletonLoader';
import SEOHead from '../components/SEOHead';
import FleetCard from '../components/FleetCard';
import { DEFAULT_ROUTES, DEFAULT_CABS, mergeDataById, getCityImage, getRouteStartingPrice } from '../data/defaultData';

const DESTINATIONS = [
  {
    city: 'Mumbai',
    label: 'Coast to capital',
    note: 'Airport runs, business trips and weekend escapes',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1400&q=85',
  },
  {
    city: 'Pune',
    label: 'City to city',
    note: 'Doorstep pickup, direct drop',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Shaniwar_Wada.jpg/1280px-Shaniwar_Wada.jpg',
  },
  {
    city: 'Nashik',
    label: 'Home territory',
    note: 'Local knowledge across every route',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=85',
  },
];

const getStoryImage = (cityName) => (
  DESTINATIONS.find(({ city }) => city.toLowerCase() === cityName?.toLowerCase())?.image
  || getCityImage(cityName)
);
const REVIEWS = [
  { name: 'Rahul S.', city: 'Pune', text: 'Booked a cab from Pune to Mumbai. Driver arrived on time, the car was clean, and the complete trip felt effortless.' },
  { name: 'Priya M.', city: 'Nashik', text: 'The fare shown was exactly what I paid. Clear communication from booking to drop-off.' },
  { name: 'Amit K.', city: 'Mumbai', text: 'A comfortable Innova and a professional driver for our family trip. Highly recommended.' },
];

const Home = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [popularRoutes, setPopularRoutes] = useState(DEFAULT_ROUTES);
  const [loadingRoutes] = useState(false);
  const [cabs, setCabs] = useState(DEFAULT_CABS);
  const [loadingCabs] = useState(false);
  const [tripType, setTripType] = useState('one-way');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [routesRes, cabsRes] = await Promise.all([
          axiosInstance.get('/routes?limit=12').catch(() => ({ data: [] })),
          axiosInstance.get('/cabs?limit=12').catch(() => ({ data: [] })),
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
        console.error('Error fetching home data:', error);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (!pickup || !drop) {
      alert('Please enter pickup and drop locations.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    navigate(`/search?pickup=${pickup}&drop=${drop}&date=${today}&trip=${tripType}`);
  };

  const handleSwap = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const bookRoute = (route) => {
    navigate(
      `/search?pickup=${route.pickupCity}&drop=${route.destinationCity}&date=${new Date().toISOString().split('T')[0]}&trip=one-way`,
      { state: { selectedRoute: route } }
    );
  };

  return (
    <PageTransition>
      <div className="font-sans bg-neutral-900 min-h-screen">
        <SEOHead
          title="RK Tours & Travels - Outstation Cab Booking"
          description="Book outstation cabs across Maharashtra. Reliable service, transparent pricing, 24/7 availability."
          url="/"
        />

        <section data-motion-section="hero" className="relative bg-neutral-900 overflow-hidden pt-24 sm:pt-28 pb-12 lg:min-h-screen lg:flex lg:items-center lg:pt-20 lg:pb-16">
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

          <div className="absolute left-4 sm:left-8 lg:left-12 top-28 bottom-16 hidden md:flex flex-col items-center justify-between z-10">
            <span className="text-[10px] font-black tracking-[0.32em] text-white/40 [writing-mode:vertical-rl]">MAHARASHTRA / 24 x 7</span>
            <span className="w-px flex-1 my-5 bg-orange-500/70"></span>
            <FiNavigation className="text-orange-500" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.04fr_.96fr] gap-9 lg:gap-14 items-end">
              <div className="max-w-2xl lg:pb-5">
                <div className="inline-flex items-center gap-2 border border-orange-500/30 bg-black/35 backdrop-blur-md rounded-full px-3 py-1.5 mb-5">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-orange-100">Nashik based. Maharashtra wide.</span>
                </div>

                <h1 className="text-[2.55rem] sm:text-5xl lg:text-[4.5rem] font-black text-white leading-[0.95] tracking-[-0.055em]">
                  The road is yours.
                  <span className="block text-orange-500 mt-2">We handle the ride.</span>
                </h1>

                <p className="text-gray-300 text-sm sm:text-base lg:text-lg mt-6 max-w-xl leading-relaxed">
                  Verified drivers, clear fares and a dependable car at your door&mdash;for airport runs, business travel and weekends across Maharashtra.
                </p>

                <div className="grid grid-cols-3 max-w-lg mt-8 border-y border-white/15 divide-x divide-white/15">
                  {[
                    ['50+', 'cities'],
                    ['10k+', 'trips'],
                    ['24/7', 'dispatch'],
                  ].map(([value, label]) => (
                    <div key={label} className="py-3 px-3 first:pl-0">
                      <span className="block text-lg sm:text-2xl font-black text-white">{value}</span>
                      <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gray-400 mt-0.5">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div data-motion-booking className="relative bg-neutral-950/55 supports-[backdrop-filter]:bg-neutral-950/30 backdrop-blur-2xl backdrop-saturate-150 border border-white/25 rounded-[28px] p-4 sm:p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.10)] ring-1 ring-white/5 overflow-visible">
                <div className="absolute -top-3 left-5 flex items-center gap-2 bg-orange-500 text-white px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">Trip console</span>
                </div>

                <div className="flex items-center justify-between pt-2 mb-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Plan your route</p>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Where to next?</h2>
                  </div>
                  <div className="flex rounded-full bg-neutral-900 border border-neutral-800 p-1">
                    {[
                      ['one-way', 'One way'],
                      ['round-trip', 'Round trip'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTripType(value)}
                        className={`px-3 py-2 rounded-full text-[10px] sm:text-xs font-bold transition-colors ${tripType === value ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSearch} className="space-y-3">
                  <div className="relative grid sm:grid-cols-[1fr_auto_1fr] gap-2.5 items-center">
                    <CityAutocomplete value={pickup} onChange={setPickup} placeholder="Pickup city" darkTheme />
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="static -my-1 justify-self-center sm:my-0 w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 text-orange-500 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors z-10"
                      title="Swap pickup and drop"
                      aria-label="Swap pickup and drop cities"
                    >
                      <FiRepeat size={15} />
                    </button>
                    <CityAutocomplete value={drop} onChange={setDrop} placeholder="Drop city" isDrop darkTheme />
                  </div>

                  <button type="submit" className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center justify-center gap-2 transition-colors">
                    Find my cab <FiArrowRight />
                  </button>
                </form>

                <div data-motion-trust className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/10">
                  {['Verified drivers', 'Clear fares', 'Live support', 'Clean cars'].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-[10px] text-gray-400 font-semibold">
                      <FiCheck className="text-orange-500 flex-shrink-0" /> {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-motion-section="routes" className="relative py-16 sm:py-20 bg-neutral-800 overflow-hidden">
          <div className="absolute inset-y-0 left-[8%] w-px bg-white/5"></div>
          <div className="absolute inset-y-0 right-[8%] w-px bg-white/5"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-6 mb-9">
              <div className="flex items-start gap-4">
                <span className="text-xs font-black text-orange-500 pt-1">01</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500 font-bold mb-2">The route board</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Popular ways out.</h2>
                  <p className="text-sm text-gray-400 mt-2">Real routes, straightforward fares, no last-minute surprises.</p>
                </div>
              </div>
              <Link to="/search" className="hidden sm:flex items-center gap-2 text-sm font-bold text-white hover:text-orange-500 transition-colors">
                Explore all routes <FiArrowUpRight />
              </Link>
            </div>

            {loadingRoutes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((item) => <RouteSkeleton key={item} />)}
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-4">
                {popularRoutes.slice(0, 4).map((route, index) => {
                  const featured = index === 0;
                  return (
                    <article
                      key={route._id}
                      data-motion-card="route"
                      onClick={() => bookRoute(route)}
                      className={`group cursor-pointer relative overflow-hidden rounded-[26px] border border-neutral-700/70 bg-neutral-900 hover:border-orange-500/70 transition-colors ${featured ? 'lg:col-span-7 lg:row-span-3 min-h-[430px]' : 'lg:col-span-5 min-h-[134px]'}`}
                    >
                      {featured ? (
                        <>
                          <div className="absolute inset-0">
                            <img
                              src={getStoryImage(route.destinationCity)}
                              alt={route.destinationCity}
                              className="w-full h-full object-cover scale-105"
                              onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1200&q=80'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/10"></div>
                          </div>

                          <div className="relative z-10 h-full min-h-[430px] p-6 sm:p-8 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white border border-white/20 bg-black/30 backdrop-blur-md rounded-full px-3 py-1.5">Most booked</span>
                              <span className="text-sm font-bold text-white">{route.distance} km</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-3 mb-5">
                                <div className="flex -space-x-2">
                                  <img src={getCityImage(route.pickupCity)} alt={route.pickupCity} className="w-11 h-11 rounded-full object-cover border-2 border-neutral-950" />
                                  <img src={getCityImage(route.destinationCity)} alt={route.destinationCity} className="w-11 h-11 rounded-full object-cover border-2 border-orange-500" />
                                </div>
                                <span className="h-px flex-1 max-w-16 bg-orange-500"></span>
                                <FiNavigation className="text-orange-500" />
                              </div>
                              <p className="text-xs uppercase tracking-[0.22em] text-orange-400 font-bold">Featured corridor</p>
                              <h3 className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-3xl font-black tracking-tight text-white sm:text-5xl">
                                <span>{route.pickupCity}</span>
                                <FiArrowRight aria-hidden="true" className="flex-shrink-0 text-[0.72em] text-orange-500" />
                                <span>{route.destinationCity}</span>
                              </h3>
                              <div className="flex items-end justify-between gap-4 mt-6 pt-5 border-t border-white/15">
                                <div>
                                  <span className="text-[10px] uppercase tracking-widest text-gray-400">From</span>
                                  <p className="text-2xl font-black text-white">&#8377;{getRouteStartingPrice(route).toLocaleString('en-IN')}</p>
                                </div>
                                <span className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                  <FiArrowUpRight className="text-lg" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="h-full p-5 grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                          <div className="relative w-16 h-16">
                            <img src={getCityImage(route.pickupCity)} alt={route.pickupCity} className="absolute top-0 left-0 w-11 h-11 rounded-full object-cover border-2 border-emerald-500 bg-neutral-800" />
                            <img src={getCityImage(route.destinationCity)} alt={route.destinationCity} className="absolute bottom-0 right-0 w-11 h-11 rounded-full object-cover border-2 border-rose-500 bg-neutral-800" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-orange-500">{route.distance} km corridor</span>
                            <h3 className="mt-1 flex min-w-0 items-center gap-2 text-lg font-black text-white">
                              <span className="truncate">{route.pickupCity}</span>
                              <FiArrowRight aria-hidden="true" className="flex-shrink-0 text-sm text-orange-500" />
                              <span className="truncate">{route.destinationCity}</span>
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">From <span className="text-white font-bold">&#8377;{getRouteStartingPrice(route).toLocaleString('en-IN')}</span></p>
                          </div>
                          <span className="w-10 h-10 rounded-full border border-neutral-700 text-white flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
                            <FiArrowRight />
                          </span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        <section data-motion-section="fleet" className="relative overflow-hidden bg-neutral-950 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(255,255,255,0.055),transparent_26%)]"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-white/10"></div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-9 grid gap-7 border-b border-white/10 pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="flex items-start gap-4">
                <span className="pt-1 text-xs font-black text-orange-500">02</span>
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-white/40">RK vehicle directory</p>
                  <h2 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.035em] text-white sm:text-6xl">
                    The right cabin<br />
                    <span className="text-white/35">for every road.</span>
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">
                    Maintained, sanitised and priced clearly; choose the space you need and leave the driving to us.
                  </p>
                </div>
              </div>

              <Link
                to="/fleet"
                className="group inline-flex h-12 w-fit items-center gap-3 rounded-full border border-white/15 bg-white/[0.05] pl-5 pr-1.5 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:border-orange-500/60 hover:bg-orange-500"
              >
                View all fleet
                <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-500 text-white transition-colors group-hover:bg-black/20">
                  <FiArrowUpRight />
                </span>
              </Link>
            </div>

            {loadingCabs ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {cabs.map((cab, index) => (
                  <FleetCard
                    key={cab._id}
                    cab={cab}
                    index={index}
                    onBook={(selectedCab) => navigate('/book', {
                      state: {
                        cab: selectedCab,
                        journey: {
                          pickup: pickup || 'Nashik',
                          drop: drop || 'Mumbai',
                          date: new Date().toISOString().split('T')[0],
                          tripType: tripType || 'one-way',
                        },
                      },
                    })}
                  />
                ))}
              </div>
            )}

            <div className="mt-7 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:grid-cols-3">
              {[
                ['01', 'Checked before dispatch'],
                ['02', 'Transparent per-km pricing'],
                ['03', 'Verified professional drivers'],
              ].map(([number, label], index) => (
                <div
                  key={label}
                  className={`flex items-center gap-4 px-5 py-4 ${index < 2 ? 'border-b border-white/10 sm:border-b-0 sm:border-r' : ''}`}
                >
                  <span className="text-[10px] font-black text-orange-500">{number}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/55">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
<section data-motion-section="testimonials" className="py-16 sm:py-20 bg-neutral-950 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div className="flex items-start gap-4">
                <span className="text-xs font-black text-orange-500 pt-1">03</span>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gray-500 font-bold mb-2">Passenger notes</p>
                  <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Proof from the back seat.</h2>
                </div>
              </div>
              <div className="hidden sm:flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => <FiStar key={star} className="text-orange-500 fill-orange-500" />)}
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-4">
              <article data-motion-card="testimonial" className="relative min-h-[360px] rounded-[28px] border border-neutral-800 bg-neutral-900 p-7 sm:p-10 overflow-hidden flex flex-col justify-between">
                <span className="absolute -right-3 -top-12 text-[13rem] font-black leading-none text-orange-500/10">&ldquo;</span>
                <div className="relative">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => <FiStar key={star} className="text-orange-500 fill-orange-500" />)}
                  </div>
                  <blockquote className="text-2xl sm:text-4xl font-bold text-white leading-tight mt-8 max-w-2xl">
                    &ldquo;{REVIEWS[0].text}&rdquo;
                  </blockquote>
                </div>
                <div className="relative flex items-center justify-between gap-4 mt-10 pt-6 border-t border-neutral-800">
                  <div>
                    <p className="font-black text-white">{REVIEWS[0].name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{REVIEWS[0].city} passenger</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-black">Verified ride</span>
                </div>
              </article>

              <div className="grid gap-4">
                {REVIEWS.slice(1).map((review, index) => (
                  <article key={review.name} data-motion-card="testimonial" className="rounded-[24px] border border-neutral-800 bg-neutral-900 p-6 sm:p-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-4xl font-black text-orange-500/40">0{index + 2}</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => <FiStar key={star} className="text-xs text-orange-500 fill-orange-500" />)}
                        </div>
                      </div>
                      <p className="text-base text-gray-200 leading-relaxed mt-4">&ldquo;{review.text}&rdquo;</p>
                    </div>
                    <div className="flex items-center gap-3 mt-6">
                      <span className="w-9 h-9 rounded-full bg-orange-500 text-white font-black text-xs flex items-center justify-center">{review.name.charAt(0)}</span>
                      <div>
                        <p className="text-sm font-black text-white">{review.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-500">{review.city}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-motion-section="cta" className="relative bg-orange-500 overflow-hidden">
          <div className="absolute -right-24 -top-32 w-[520px] h-[520px] rounded-full border-[80px] border-black/10"></div>
          <div className="absolute right-[26%] inset-y-0 w-px bg-black/15 hidden lg:block"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-black/60 font-black">Dispatch desk / always open</p>
                <h2 className="text-3xl sm:text-5xl font-black text-white mt-3 tracking-tight">Your next road starts with one call.</h2>
                <p className="text-sm sm:text-base text-white/85 mt-3">Bookings, route questions and on-trip support&mdash;24 hours a day.</p>
              </div>
              <a href="tel:+919130899368" className="group bg-neutral-950 text-white rounded-2xl px-6 py-5 sm:px-8 flex items-center justify-between gap-8 min-w-[280px] hover:bg-white hover:text-black transition-colors">
                <span className="flex items-center gap-3">
                  <FiPhoneCall className="text-orange-500 text-xl" />
                  <span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-500 font-bold">Call RK Tours</span>
                    <span className="block text-base font-black mt-1">+91 91308 99368</span>
                  </span>
                </span>
                <FiArrowUpRight className="text-xl" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
