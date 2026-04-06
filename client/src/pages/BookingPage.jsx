import { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import axiosInstance from '../utils/axiosInstance';
import CityAutocomplete from '../components/CityAutocomplete';
import { FiMapPin, FiCalendar, FiCheckCircle, FiInfo, FiUser, FiPhone, FiMap } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

import citiesData from '../data/cities.json'; 

const mapContainerStyle = { width: '100%', height: '250px', borderRadius: '0.75rem' };
const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!location.state || !location.state.cab) {
    return <Navigate to="/" replace />;
  }

  const { cab, journey } = location.state;

  const [pickupCity, setPickupCity] = useState(journey?.pickup === 'TBD' ? '' : journey?.pickup || '');
  const [pickupState, setPickupState] = useState('');
  const [pickupStreet, setPickupStreet] = useState(journey?.pickupStreet || '');
  const [pickupCoords, setPickupCoords] = useState(defaultCenter);

  const [dropCity, setDropCity] = useState(journey?.drop === 'TBD' ? '' : journey?.drop || '');
  const [dropState, setDropState] = useState('');
  const [dropStreet, setDropStreet] = useState(journey?.dropStreet || '');
  const [dropCoords, setDropCoords] = useState(defaultCenter);

  const [date, setDate] = useState(journey?.date === 'TBD' ? '' : journey?.date || '');
  const [returnDate, setReturnDate] = useState(''); 
  
  const [tripType, setTripType] = useState(
    journey?.tripType === 'round-trip' || journey?.tripType === 'Round Trip' ? 'Round Trip' : 'One Way'
  ); 

  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [passengerPhone, setPassengerPhone] = useState(user?.phone || '');

  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [adminPhone, setAdminPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const [driverAllowance, setDriverAllowance] = useState(0);
  
  const [dynamicDistance, setDynamicDistance] = useState(0); 
  const [returnDistance, setReturnDistance] = useState(0);

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
    if (pickupCity || pickupState || pickupStreet) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(`${pickupStreet}, ${pickupCity}, ${pickupState}`, setPickupCoords);
      }, 1000); 
      return () => clearTimeout(timeoutId);
    }
  }, [pickupCity, pickupState, pickupStreet, geocodeAddress]);

  useEffect(() => {
    if (dropCity || dropState || dropStreet) {
      const timeoutId = setTimeout(() => {
        geocodeAddress(`${dropStreet}, ${dropCity}, ${dropState}`, setDropCoords);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [dropCity, dropState, dropStreet, geocodeAddress]);

  useEffect(() => {
    if (!window.google || !isLoaded) return;
    
    if (pickupCoords.lat === defaultCenter.lat && pickupCoords.lng === defaultCenter.lng) return;
    if (dropCoords.lat === defaultCenter.lat && dropCoords.lng === defaultCenter.lng) return;

    const service = new window.google.maps.DistanceMatrixService();
    
    const originLatLng = new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng);
    const destLatLng = new window.google.maps.LatLng(dropCoords.lat, dropCoords.lng);

    // FIXED: Calculate Outward Leg (A -> B) independently
    service.getDistanceMatrix({
      origins: [originLatLng],
      destinations: [destLatLng],
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
        const outwardKm = response.rows[0].elements[0].distance.value / 1000;
        setDynamicDistance(Number(outwardKm.toFixed(1)));
      }
    });

    // FIXED: Calculate Return Leg (B -> A) independently
    service.getDistanceMatrix({
      origins: [destLatLng],
      destinations: [originLatLng],
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
        const returnKm = response.rows[0].elements[0].distance.value / 1000;
        setReturnDistance(Number(returnKm.toFixed(1)));
      }
    });
  }, [pickupCoords, dropCoords, isLoaded]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routesRes = await axiosInstance.get('/routes');
        setAvailableRoutes(routesRes.data || []);
      } catch (error) { console.error("Failed to fetch routes:", error); }
      
      try {
        const contentRes = await axiosInstance.get('/content');
        setAdminPhone(contentRes.data?.admin_whatsapp_number || '');
        setDriverAllowance(Number(contentRes.data?.driverAllowance) || 300); 
      } catch (error) { console.error("Failed to fetch content:", error); }
    };
    fetchData();
  }, []);

  const matchedRoute = availableRoutes.find(r => 
    r?.pickupCity?.trim().toLowerCase() === pickupCity?.trim().toLowerCase() && 
    r?.destinationCity?.trim().toLowerCase() === dropCity?.trim().toLowerCase()
  );

  const isFixedRoute = !!matchedRoute;
  const multiplier = tripType === 'Round Trip' ? 2 : 1; 

  const getTripDays = () => {
    if (tripType !== 'Round Trip' || !returnDate || !date) return 1;
    const d1 = new Date(date);
    const d2 = new Date(returnDate);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; 
  };

  const totalTripDays = getTripDays();
  const totalDriverAllowance = totalTripDays === 1 ? 0 : driverAllowance * totalTripDays;

  const numericBasePrice = Number(matchedRoute ? String(matchedRoute.basePrice).replace(/[^0-9.]/g, '') : '0') || 0;
  const fixedBaseFare = isFixedRoute ? (numericBasePrice * multiplier) : 0;
  const fixedTaxes = isFixedRoute ? Math.round(fixedBaseFare * 0.05) : 0; 
  const totalFixedFare = isFixedRoute ? fixedBaseFare + fixedTaxes : 0;

  const customTripDistance = tripType === 'Round Trip' ? (dynamicDistance + returnDistance) : dynamicDistance;
  const customCabFare = Math.round(customTripDistance * cab.pricePerKm);
  const totalCustomFare = customCabFare + totalDriverAllowance; 

  const handleWhatsAppBooking = async () => {
    if (!pickupCity || !dropCity || !date || !passengerName || !passengerPhone || !pickupStreet || !dropStreet) {
      alert("Please fill in all full address details (Street & City) to book.");
      return;
    }

    setLoading(true);
    
    const pickupMapUrl = `https://www.google.com/maps/search/?api=1&query=${pickupCoords.lat},${pickupCoords.lng}`;
    const dropMapUrl = `https://www.google.com/maps/search/?api=1&query=${dropCoords.lat},${dropCoords.lng}`;

    try {
      const bookingPayload = {
        pickup: { streetAddress: pickupStreet, city: pickupCity, district: pickupCity, state: pickupState, mapUrl: pickupMapUrl },
        destination: { streetAddress: dropStreet, city: dropCity, district: dropCity, state: dropState, mapUrl: dropMapUrl },
        journeyDate: date,
        tripType: tripType, 
        cabType: cab._id,
        totalFare: isFixedRoute ? totalFixedFare : totalCustomFare, 
        estimatedRate: isFixedRoute ? null : cab.pricePerKm,
        status: 'Pending',
        passengerDetails: { name: passengerName, phone: passengerPhone }
      };

      await axiosInstance.post('/bookings', bookingPayload);

      const allowanceString = totalDriverAllowance > 0 ? ` + ₹${totalDriverAllowance} allowance for ${totalTripDays} days` : '';
      
      // FIXED: Showing the combined total exact distance on WhatsApp
      const fareMessage = isFixedRoute 
        ? `*Fixed Fare:* ₹${totalFixedFare}\n(Includes base fare ₹${fixedBaseFare} + taxes)` 
        : `*Estimated Fare:* ₹${totalCustomFare}\n(Total Distance: ${Number(customTripDistance).toFixed(1)}km at ₹${cab.pricePerKm}/km${allowanceString})`;

      const message = `*New Booking Request*

*Passenger:* ${passengerName}
*Mobile Number:* ${passengerPhone}

*PICKUP DETAILS:*
${pickupStreet}, ${pickupCity}, ${pickupState}
📍 Map: ${pickupMapUrl}

*DROP DETAILS:*
${dropStreet}, ${dropCity}, ${dropState}
📍 Map: ${dropMapUrl}

*Date:* ${date} ${tripType === 'Round Trip' ? `to ${returnDate}` : ''}
*Trip Type:* ${tripType}

*Cab Details:* ${cab.name} (${cab.seats} Seater, ${cab.acStatus || 'AC'})

${fareMessage}`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, '_blank');
      navigate('/my-bookings');

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-28 font-sans">
      <SEOHead title="Confirm Booking | CabBook" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="text-black font-bold hover:underline flex items-center gap-1 mb-4 transition-all">
            ← Back to Cabs
          </button>
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Review & Confirm Booking</h1>
          <p className="text-gray-500 font-medium mt-1">Finalize your premium itinerary details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row gap-8 items-center border-b border-gray-100">
                    <div className="w-48 h-32 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 flex-shrink-0">
                        <img src={cab.image} alt={cab.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-2xl font-bold text-black mb-1">{cab.name}</h4>
                                <p className="text-sm text-gray-500 font-medium mb-4">{cab.seats} Seater • {cab.acStatus || 'AC'} • {cab.fuelType}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Passenger Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                            <input type="tel" value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="Phone Number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                <h3 className="font-bold text-black text-lg">Journey Itinerary</h3>
                <div className="flex gap-3 flex-wrap">
                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none font-medium" />
                   
                   {tripType === 'Round Trip' && (
                     <input type="date" title="Return Date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none font-medium border-orange-300" />
                   )}
                   
                   <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none font-medium">
                      <option value="One Way">One Way</option>
                      <option value="Round Trip">Round Trip</option>
                    </select>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h4 className="font-bold text-black flex items-center gap-2"><FiMapPin className="text-green-600"/> Pickup Configuration</h4>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address</label>
                        <input type="text" value={pickupStreet} onChange={(e) => setPickupStreet(e.target.value)} placeholder="Flat, Building, Street" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                            <CityAutocomplete 
                              value={pickupCity} 
                              onChange={(val) => { 
                                setPickupCity(val);
                                const match = citiesData.find(c => c.name.toLowerCase() === val.toLowerCase());
                                if(match) setPickupState(match.state);
                              }} 
                              placeholder="City" 
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                            <input type="text" value={pickupState} onChange={(e) => setPickupState(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                        </div>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                    {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={pickupCoords} zoom={15}>
                            <Marker position={pickupCoords} draggable={true} onDragEnd={(e) => setPickupCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })} />
                        </GoogleMap>
                    ) : <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>}
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-[10px] font-bold text-center text-black border border-gray-200 shadow-sm">
                        Drag the pin to adjust exact pickup location
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-4">
                    <h4 className="font-bold text-black flex items-center gap-2"><FiMapPin className="text-red-600"/> Drop-off Configuration</h4>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address</label>
                        <input type="text" value={dropStreet} onChange={(e) => setDropStreet(e.target.value)} placeholder="Flat, Building, Street" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">City</label>
                            <CityAutocomplete 
                              value={dropCity} 
                              onChange={(val) => { 
                                setDropCity(val);
                                const match = citiesData.find(c => c.name.toLowerCase() === val.toLowerCase());
                                if(match) setDropState(match.state);
                              }} 
                              placeholder="City" 
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                            <input type="text" value={dropState} onChange={(e) => setDropState(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none text-black font-medium transition-all" />
                        </div>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                     {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={dropCoords} zoom={15}>
                            <Marker position={dropCoords} draggable={true} onDragEnd={(e) => setDropCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })} />
                        </GoogleMap>
                    ) : <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>}
                    <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-lg text-[10px] font-bold text-center text-black border border-gray-200 shadow-sm">
                        Drag the pin to adjust exact drop location
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-28">
              <div className="px-6 py-5 border-b border-gray-100 bg-black text-white">
                <h3 className="font-bold text-lg">Fare Summary</h3>
              </div>
              <div className="p-6">
                {isFixedRoute ? (
                  <>
                    <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between text-gray-600 font-medium">
                        <span>Base Fare ({matchedRoute.distance || '?'}km {tripType === 'Round Trip' && 'Round Trip'})</span>
                        <span className="text-black">₹{fixedBaseFare}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 font-medium">
                        <span>Taxes & GST (5%)</span>
                        <span className="text-black">₹{fixedTaxes}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mb-8">
                      <span className="font-bold text-black text-lg">Total Fare</span>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold text-black">₹{totalFixedFare}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 text-sm mb-6 pb-6 border-b border-gray-200">
                      
                      {/* FIXED: Showing Total Calculated Distance clearly */}
                      <div className="flex justify-between items-start text-gray-600 font-medium">
                        <div className="flex flex-col">
                          <span>Total Driving Distance</span>
                          {tripType === 'Round Trip' && (
                            <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                               Outward: {dynamicDistance} km • Return: {returnDistance} km
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-black font-bold">
                            {tripType === 'Round Trip' 
                              ? `${Number(customTripDistance).toFixed(1)} km` 
                              : `${dynamicDistance} km`}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between text-gray-600 font-medium">
                        <span>Cab Rate (₹{cab.pricePerKm}/km)</span>
                        <span className="text-black">₹{customCabFare}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 font-medium">
                        <span>Driver Allowance {totalTripDays === 1 ? '(N/A)' : `(${totalTripDays} Days)`}</span>
                        <span className="text-black">₹{totalDriverAllowance}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mb-8">
                      <span className="font-bold text-black text-lg">Estimated Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-extrabold text-black">₹{totalCustomFare}</span>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Subject to actual tolls</p>
                      </div>
                    </div>
                  </>
                )}
                
                <button disabled={loading} onClick={handleWhatsAppBooking} className="w-full bg-[#25D366] hover:bg-[#1ebd5a] text-white py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2 text-base disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-green-200">
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><FaWhatsapp size={22} /> Book via WhatsApp</>}
                </button>
                <p className="text-center text-xs text-gray-500 mt-4 font-medium">No advance payment required</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingPage;