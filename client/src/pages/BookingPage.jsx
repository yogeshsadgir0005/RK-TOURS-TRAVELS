import { useState, useContext, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FiUser, FiPhone, FiMapPin, FiCheckCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { GoogleMap, Marker, useJsApiLoader, Polyline } from '@react-google-maps/api';
import PageTransition from '../components/PageTransition';
import { getDeviceId } from '../utils/getDeviceId';

import citiesData from '../data/cities.json'; 

const mapContainerStyle = { width: '100%', height: '100%', borderRadius: '1rem' };
const receiptMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#bdbdbd" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#dadada" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { featureType: "road.local", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#e5e5e5" }] },
  { featureType: "transit.station", elementType: "geometry", stylers: [{ color: "#eeeeee" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9c9c9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] }
];

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { cab, journey, customFixedFare } = location.state || {};

  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [passengerPhone, setPassengerPhone] = useState('');
  
  const [pickupStreet, setPickupStreet] = useState(journey?.pickupStreet || '');
  const [pickupCity, setPickupCity] = useState(journey?.pickup || '');
  const [pickupState, setPickupState] = useState('');
  
  const [dropStreet, setDropStreet] = useState(journey?.dropStreet || '');
  const [dropCity, setDropCity] = useState(journey?.drop || '');
  const [dropState, setDropState] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState(0);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);

  useEffect(() => {
    if (!cab || !journey) {
      toast.error('Booking details missing. Redirecting to search.');
      navigate('/search');
    }
  }, [cab, journey, navigate]);

  useEffect(() => {
    if (pickupCity) {
      const cityObj = citiesData.find(c => c.name === pickupCity);
      if (cityObj) setPickupState(cityObj.state);
    }
    if (dropCity) {
      const cityObj = citiesData.find(c => c.name === dropCity);
      if (cityObj) setDropState(cityObj.state);
    }
  }, [pickupCity, dropCity]);

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
    if (pickupCity || pickupState || pickupStreet) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(`${pickupStreet}, ${pickupCity}, ${pickupState}`, setPickupCoords);
      }, 1000); 
      return () => clearTimeout(timeoutId);
    }
  }, [pickupCity, pickupState, pickupStreet, geocodeAddress, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (dropCity || dropState || dropStreet) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(`${dropStreet}, ${dropCity}, ${dropState}`, setDropCoords);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [dropCity, dropState, dropStreet, geocodeAddress, isLoaded]);

  useEffect(() => {
    if (!window.google || !isLoaded) return;
    if (pickupCoords && dropCoords) {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [pickupCoords],
        destinations: [dropCoords],
        travelMode: 'DRIVING',
      }, (response, status) => {
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          setCalculatedDistance(distanceInMeters / 1000);
        }
      });
    }
  }, [pickupCoords, dropCoords, isLoaded]);

  const calculateFare = () => {
    if (customFixedFare) return { baseFare: customFixedFare, totalFare: customFixedFare };
    const dist = calculatedDistance || 0;
    const isRoundTrip = journey.tripType === 'round-trip';
    const multiplier = isRoundTrip ? 2 : 1;
    const totalDist = dist * multiplier;
    
    // Minimum 250km per day logic as industry standard
    const minKm = isRoundTrip ? 250 * 2 : 250; 
    const finalDist = Math.max(totalDist, minKm);
    
    const baseFare = Math.round(finalDist * cab.pricePerKm);
    return { baseFare, totalFare: baseFare };
  };

  const { totalFare } = calculateFare();
  const gst = Math.round(totalFare * 0.05); // 5% GST
  const grandTotal = totalFare + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickupStreet || !dropStreet || !passengerPhone || !passengerName) {
        toast.error('Please fill all required fields');
        return;
    }

    setIsSubmitting(true);

    const bookingData = {
      cabType: cab._id,
      pickup: { streetAddress: pickupStreet, city: pickupCity, state: pickupState },
      destination: { streetAddress: dropStreet, city: dropCity, state: dropState },
      journeyDate: journey.date,
      tripType: journey.tripType === 'round-trip' ? 'Round Trip' : 'One Way',
      totalFare: grandTotal,
      passengerDetails: { name: passengerName, phone: passengerPhone },
      deviceId: getDeviceId()
    };

    try {
      const res = await axiosInstance.post('/bookings', bookingData);
      toast.success('Booking Confirmed Successfully!', { duration: 5000 });
      if (res.data.whatsappLink) window.open(res.data.whatsappLink, '_blank');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMapBounds = () => {
    if (!window.google || !pickupCoords || !dropCoords) return null;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickupCoords);
    bounds.extend(dropCoords);
    return bounds;
  };

  if (!cab) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-bg-secondary pb-24 pt-20 px-4 sm:px-8 font-sans">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 lg:items-start">
          
          {/* LEFT: THE FORM */}
          <div>
            <div className="mb-12">
              <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Complete your booking</h1>
              <p className="text-gray-400 font-medium">Almost there. Please provide your travel details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: Passenger */}
              <div className="bg-neutral-900 p-8 rounded-[32px] border border-neutral-800 shadow-saas-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">1</div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Passenger Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" required value={passengerName} onChange={(e) => setPassengerName(e.target.value)} className="w-full h-12 pl-11 pr-4 bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:border-white focus:bg-neutral-900 shadow-saas-inner outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Mobile Number</label>
                    <div className="relative">
                      <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" required value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="10-digit mobile number" className="w-full h-12 pl-11 pr-4 bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:border-white focus:bg-neutral-900 shadow-saas-inner outline-none transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Exact Location */}
              <div className="bg-neutral-900 p-8 rounded-[32px] border border-neutral-800 shadow-saas-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-bold">2</div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Pickup & Drop Addresses</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="border border-neutral-800 rounded-2xl p-4 sm:p-6 relative">
                    <div className="absolute top-6 left-6 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                    <div className="ml-12">
                      <h3 className="text-sm font-bold text-white mb-4">Pickup Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Street / Area / Landmark</label>
                          <input type="text" required value={pickupStreet} onChange={(e) => setPickupStreet(e.target.value)} placeholder="E.g., Flat 101, Galaxy Apts, MG Road" className="w-full h-12 px-4 bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:border-white focus:bg-neutral-900 shadow-saas-inner outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">City</label>
                          <input type="text" required value={pickupCity} onChange={(e) => setPickupCity(e.target.value)} className="w-full h-12 px-4 bg-neutral-800 border border-transparent rounded-xl text-sm font-semibold text-white outline-none cursor-not-allowed" readOnly />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">State</label>
                          <input type="text" required value={pickupState} onChange={(e) => setPickupState(e.target.value)} className="w-full h-12 px-4 bg-neutral-800 border border-transparent rounded-xl text-sm font-semibold text-white outline-none cursor-not-allowed" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-neutral-800 rounded-2xl p-4 sm:p-6 relative">
                    <div className="absolute top-6 left-6 w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="ml-12">
                      <h3 className="text-sm font-bold text-white mb-4">Drop Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Street / Area / Landmark</label>
                          <input type="text" required value={dropStreet} onChange={(e) => setDropStreet(e.target.value)} placeholder="E.g., Airport Terminal 2" className="w-full h-12 px-4 bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-semibold text-white focus:border-white focus:bg-neutral-900 shadow-saas-inner outline-none transition-colors" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">City</label>
                          <input type="text" required value={dropCity} onChange={(e) => setDropCity(e.target.value)} className="w-full h-12 px-4 bg-neutral-800 border border-transparent rounded-xl text-sm font-semibold text-white outline-none cursor-not-allowed" readOnly />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">State</label>
                          <input type="text" required value={dropState} onChange={(e) => setDropState(e.target.value)} className="w-full h-12 px-4 bg-neutral-800 border border-transparent rounded-xl text-sm font-semibold text-white outline-none cursor-not-allowed" readOnly />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* RIGHT: STICKY RECEIPT */}
          <div className="lg:sticky lg:top-32 w-full">
            <div className="bg-neutral-900 rounded-[32px] border border-neutral-800 shadow-saas-lg p-6 sm:p-8">
              
              {/* Mini Map */}
              <div className="w-full h-[180px] bg-neutral-800 rounded-2xl mb-6 border border-neutral-800 overflow-hidden shadow-saas-inner">
                {isLoaded && pickupCoords && dropCoords ? (
                  <GoogleMap 
                    mapContainerStyle={mapContainerStyle} 
                    options={{ styles: receiptMapStyle, disableDefaultUI: true, gestureHandling: 'none' }}
                    onLoad={(map) => {
                      const bounds = getMapBounds();
                      if (bounds) map.fitBounds(bounds);
                    }}
                  >
                    <Marker position={pickupCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#000000', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 }} />
                    <Marker position={dropCoords} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: '#000000', fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 }} />
                    <Polyline path={[pickupCoords, dropCoords]} options={{ strokeColor: '#000000', strokeOpacity: 1, strokeWeight: 3 }} />
                  </GoogleMap>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-neutral-600 border-t-neutral-400 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Cab Details */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-12 bg-neutral-800 rounded-lg p-1 border border-neutral-800 flex-shrink-0">
                  <img src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'} alt={cab.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white tracking-tight leading-tight">{cab.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cab.category} • {cab.seats} Seats</p>
                </div>
              </div>

              {/* Receipt Table */}
              <div className="space-y-4 mb-8">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b border-neutral-800 pb-2">Fare Breakdown</h4>
                <div className="flex flex-col gap-3 font-mono text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Base Fare {customFixedFare ? '(Fixed)' : `(${Math.max(calculatedDistance, 250).toFixed(0)}km min)`}</span>
                    <span className="font-semibold text-white">₹{totalFare}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Taxes & Fees (5% GST)</span>
                    <span className="font-semibold text-white">₹{gst}</span>
                  </div>
                  <div className="border-t border-dashed border-neutral-700 my-2"></div>
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="tracking-tighter">₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8 bg-neutral-800 p-4 rounded-2xl border border-neutral-800">
                <FiShield className="text-green-600 mt-1 flex-shrink-0 text-lg" />
                <p className="text-xs text-gray-300 font-medium leading-relaxed">Secure transaction. No hidden charges. Free cancellation up to 24 hours before pickup.</p>
              </div>

              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full h-14 bg-green-600 text-white rounded-2xl font-extrabold text-lg shadow-[0_0_24px_rgba(22,163,74,0.3)] hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Confirm Booking <FiCheckCircle className="text-xl" /></>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default BookingPage;