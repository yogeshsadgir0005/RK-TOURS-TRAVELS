import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosInstance';
import DataTable from '../components/DataTable';
import Loader from '../components/Loader';
import CityAutocomplete from '../components/CityAutocomplete';
import { FiMapPin } from 'react-icons/fi';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

// IMPORTANT: Adjust this path depending on exactly where your cities.json is located!
import citiesData from '../data/cities.json'; 

const mapContainerStyle = { width: '100%', height: '250px', borderRadius: '0.75rem' };
const defaultCenter = { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('');
  const [pickupStreet, setPickupStreet] = useState('');
  const [pickupCoords, setPickupCoords] = useState(defaultCenter);

  const [dropCity, setDropCity] = useState('');
  const [dropState, setDropState] = useState('');
  const [dropStreet, setDropStreet] = useState('');
  const [dropCoords, setDropCoords] = useState(defaultCenter);

  const [distance, setDistance] = useState('');
  const [basePrice, setBasePrice] = useState('');

  const resetForm = () => {
    setPickupCity(''); setPickupStreet(''); setPickupState(''); setPickupCoords(defaultCenter);
    setDropCity(''); setDropStreet(''); setDropState(''); setDropCoords(defaultCenter);
    setDistance(''); setBasePrice(''); setEditingId(null);
  };

  const fetchRoutes = async () => {
    try {
      const res = await axiosInstance.get('/routes');
      setRoutes(res.data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchRoutes(); }, []);

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
    service.getDistanceMatrix({
      origins: [new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng)],
      destinations: [new window.google.maps.LatLng(dropCoords.lat, dropCoords.lng)],
      travelMode: 'DRIVING',
    }, (response, status) => {
      if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
        const distKm = Math.round(response.rows[0].elements[0].distance.value / 1000);
        setDistance(distKm);
      }
    });
  }, [pickupCoords, dropCoords, isLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupCity || !dropCity) { alert('Cities are required'); return; }

    const payload = {
      pickupStreet: pickupStreet,
      pickupCity: pickupCity,
      destinationStreet: dropStreet,
      destinationCity: dropCity,
      distance: Number(distance),
      basePrice: Number(basePrice)
    };

    try {
      if (editingId) {
        await axiosInstance.put(`/routes/${editingId}`, payload);
      } else {
        await axiosInstance.post('/routes', payload);
      }
      resetForm();
      setShowForm(false);
      fetchRoutes();
    } catch (error) { alert('Operation failed'); }
  };

  const handleEdit = (route) => {
    resetForm();
    setPickupStreet(route.pickupStreet || '');
    setPickupCity(route.pickupCity);
    setDropStreet(route.destinationStreet || '');
    setDropCity(route.destinationCity);
    setDistance(route.distance);
    setBasePrice(route.basePrice);
    setEditingId(route._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this route?')) {
      try {
        await axiosInstance.delete(`/routes/${id}`);
        fetchRoutes();
      } catch (error) { 
        alert('Delete failed'); 
      }
    }
  };

  const columns = [
    { 
      header: 'Pickup', 
      accessor: (row) => row.pickupStreet ? `${row.pickupStreet}, ${row.pickupCity}` : row.pickupCity 
    },
    { 
      header: 'Destination', 
      accessor: (row) => row.destinationStreet ? `${row.destinationStreet}, ${row.destinationCity}` : row.destinationCity 
    },
    { header: 'Distance', accessor: (row) => `${row.distance} km` },
    { header: 'Base Price', accessor: (row) => `₹${row.basePrice}` },
  ];

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Routes</h2>
        <button onClick={() => { setShowForm(!showForm); resetForm(); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
          {showForm ? 'Cancel' : 'Add New Route'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative">
          {!isLoaded && <div className="absolute top-2 right-4 text-xs text-orange-500 font-bold animate-pulse">Loading Map Tools...</div>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Pickup Block */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2"><FiMapPin className="text-green-600"/> Exact Pickup Point</h4>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address</label>
                      <input type="text" value={pickupStreet} onChange={(e) => setPickupStreet(e.target.value)} placeholder="Landmark, Area" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">City (Required)</label>
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
                          <input type="text" value={pickupState} onChange={(e) => setPickupState(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all" />
                      </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                    {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={pickupCoords} zoom={13}>
                            <Marker position={pickupCoords} draggable={true} onDragEnd={(e) => setPickupCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })} />
                        </GoogleMap>
                    ) : <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>}
                  </div>
                </div>

                {/* Drop Block */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2"><FiMapPin className="text-red-600"/> Exact Drop Point</h4>
                  <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Street Address</label>
                      <input type="text" value={dropStreet} onChange={(e) => setDropStreet(e.target.value)} placeholder="Landmark, Area" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">City (Required)</label>
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
                          <input type="text" value={dropState} onChange={(e) => setDropState(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-black transition-all" />
                      </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                     {isLoaded ? (
                        <GoogleMap mapContainerStyle={mapContainerStyle} center={dropCoords} zoom={13}>
                            <Marker position={dropCoords} draggable={true} onDragEnd={(e) => setDropCoords({ lat: e.latLng.lat(), lng: e.latLng.lng() })} />
                        </GoogleMap>
                    ) : <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">Loading Map...</div>}
                  </div>
                </div>

            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calculated Distance (km)</label>
                <input 
                  type="number" required value={distance} onChange={e => setDistance(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder={isLoaded ? "Auto-calculating..." : ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Base Price (₹)</label>
                <input 
                  type="number" required value={basePrice} onChange={e => setBasePrice(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold transition-all">
                Save Route
              </button>
            </div>

          </form>
        </div>
      )}

      <DataTable columns={columns} data={routes} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default RoutesPage;