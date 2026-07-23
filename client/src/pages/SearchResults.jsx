import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { FiMapPin, FiArrowRight, FiUsers, FiFilter, FiSettings } from 'react-icons/fi';
import SEOHead from '../components/SEOHead';
import PageTransition from '../components/PageTransition';
import { CabSkeleton } from '../components/SkeletonLoader';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '1.5rem' };
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#757575" }] },
  { featureType: "administrative.country", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#181818" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "poi.park", elementType: "labels.text.stroke", stylers: [{ color: "#1b1b1b" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#2c2c2c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#8a8a8a" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#373737" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3c3c3c" }] },
  { featureType: "road.highway.controlled_access", elementType: "geometry", stylers: [{ color: "#4e4e4e" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "transit", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#000000" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3d3d3d" }] }
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { selectedRoute } = location.state || {};
  const queryParams = new URLSearchParams(location.search);
  
  const [pickup] = useState(queryParams.get('pickup') || '');
  const [drop] = useState(queryParams.get('drop') || '');
  const [date, setDate] = useState(queryParams.get('date') || '');
  const [tripType, setTripType] = useState(queryParams.get('trip') || 'one-way');
  const [cabType, setCabType] = useState(queryParams.get('type') || '');

  const [cabs, setCabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });
  
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  const geocodeAddress = useCallback((address, setCoordsCallback) => {
    if (!window.google) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setCoordsCallback({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (pickup) geocodeAddress(pickup, setPickupCoords);
    if (drop) geocodeAddress(drop, setDropCoords);
  }, [pickup, drop, geocodeAddress, isLoaded]);

  useEffect(() => {
    const fetchAndFilterCabs = async () => {
      setLoading(true);
      try {
        let fetchedCabs = [];
        const cachedCabs = sessionStorage.getItem('cabsData');
        if (cachedCabs) {
          fetchedCabs = JSON.parse(cachedCabs);
        } else {
          const res = await axiosInstance.get('/cabs');
          fetchedCabs = res.data;
          sessionStorage.setItem('cabsData', JSON.stringify(fetchedCabs));
        }

        if (cabType) {
          fetchedCabs = fetchedCabs.filter(cab => 
            cab.category && cab.category.toLowerCase() === cabType.toLowerCase()
          );
        }

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

  const getMapBounds = () => {
    if (!window.google || !pickupCoords || !dropCoords) return null;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupCoords);
    bounds.extend(dropCoords);
    return bounds;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-secondary font-sans pb-20">
        <SEOHead title={`${pickup} to ${drop} Cabs | RK Tours`} />
        
        {/* DASHBOARD HEADER */}
        <div className="bg-bg-inverse pt-20 pb-24 px-4 sm:px-8 relative overflow-hidden">
          <div className="absolute inset-0 noise-overlay"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            
            {/* Left: Route Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{pickup}</h1>
                <FiArrowRight className="text-zinc-600 text-2xl" />
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{drop}</h1>
              </div>
              
              {selectedRoute && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
                    <span className="text-zinc-400 text-xs font-mono">{selectedRoute.distance} KM</span>
                  </div>
                  <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-md">
                    <span className="text-zinc-400 text-xs font-mono">EST. {(selectedRoute.distance / 60).toFixed(1)} HRS</span>
                  </div>
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:ring-1 focus:ring-white outline-none"
                />
                <select 
                  value={tripType} 
                  onChange={(e) => setTripType(e.target.value)} 
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:ring-1 focus:ring-white outline-none appearance-none pr-8"
                >
                  <option value="one-way">One Way</option>
                  <option value="round-trip">Round Trip</option>
                </select>
                <select 
                  value={cabType} 
                  onChange={(e) => setCabType(e.target.value)} 
                  className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm font-semibold focus:ring-1 focus:ring-white outline-none appearance-none pr-8"
                >
                  <option value="">Any Vehicle</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="hatchback">Hatchback</option>
                </select>
              </div>
            </div>

            {/* Right: Embedded Map */}
            <div className="hidden lg:block w-full h-[240px] bg-zinc-900 rounded-[24px] border border-zinc-800 p-2 shadow-2xl">
              {isLoaded && pickupCoords && dropCoords ? (
                <GoogleMap 
                  mapContainerStyle={mapContainerStyle} 
                  options={{ styles: darkMapStyle, disableDefaultUI: true, gestureHandling: 'none' }}
                  onLoad={(map) => {
                    const bounds = getMapBounds();
                    if (bounds) map.fitBounds(bounds);
                  }}
                >
                  <Marker position={pickupCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#ffffff', fillOpacity: 1, strokeColor: '#000000', strokeWeight: 2 }} />
                  <Marker position={dropCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#ffffff', fillOpacity: 1, strokeColor: '#000000', strokeWeight: 2 }} />
                  <Polyline path={[pickupCoords, dropCoords]} options={{ strokeColor: '#ffffff', strokeOpacity: 0.5, strokeWeight: 3, geodesic: true }} />
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-xl bg-zinc-900/50">
                   <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-400 rounded-full animate-spin"></div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* CAB LISTING (SaaS Horizontal Rows) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8 relative z-20">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : cabs.length === 0 ? (
            <div className="bg-white rounded-[32px] shadow-saas-sm border border-gray-100 p-12 text-center">
              <h3 className="text-xl font-extrabold text-black mb-2 tracking-tight">No Vehicles Available</h3>
              <p className="text-sm font-medium text-gray-500">Try adjusting your filters or selecting a different date.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cabs.map((cab) => (
                <div key={cab._id} className="bg-white rounded-[24px] p-4 sm:p-6 border border-gray-100 shadow-saas-sm flex flex-col md:flex-row items-center gap-6 hover:border-black/10 hover:shadow-saas-md transition-all duration-300 group">
                  
                  {/* Left: Image */}
                  <div className="w-full md:w-40 h-28 bg-gray-50 rounded-[16px] p-2 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-100 transition-colors">
                    <img src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} alt={cab.name} className="max-w-full max-h-full object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.1)] group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  
                  {/* Middle: Details */}
                  <div className="flex-grow w-full">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-extrabold text-black tracking-tight">{cab.name}</h3>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-black uppercase tracking-widest">{cab.category || 'Sedan'}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="h-6 px-2.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1.5"><FiUsers className="text-black" /> {cab.seats} Seats</span>
                      <span className="h-6 px-2.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1.5"><FiFilter className="text-black" /> {cab.fuelType || 'Petrol'}</span>
                      <span className="h-6 px-2.5 bg-gray-50 border border-gray-100 rounded-md text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1.5"><FiSettings className="text-black" /> {cab.acStatus || 'AC'}</span>
                    </div>
                  </div>

                  {/* Right: Price & Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto md:min-w-[140px] border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                    <div className="text-left md:text-right mb-0 md:mb-4">
                      {cab.customFixedFare ? (
                        <>
                          <div className="text-xs font-bold uppercase tracking-widest text-green-600 mb-0.5">Fixed Fare</div>
                          <div className="text-2xl font-black text-black tracking-tighter">₹{cab.customFixedFare}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Estimated</div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-black tracking-tighter">₹{cab.pricePerKm}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">/km</span>
                          </div>
                        </>
                      )}
                    </div>
                    <button 
                      onClick={() => handleProceedToBook(cab)}
                      className="w-auto md:w-full px-6 py-3 bg-black text-white rounded-xl font-bold text-sm shadow-saas-glow hover:bg-neutral-800 active:scale-95 transition-all"
                    >
                      Select
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default SearchResults;