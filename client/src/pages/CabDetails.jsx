import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import { FiUsers, FiCheckCircle, FiShield } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const CabDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cab, setCab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCab = async () => {
      try {
        const res = await axiosInstance.get(`/cabs/${id}`);
        setCab(res.data);
      } catch (error) {
        console.error("Cab not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCab();
  }, [id]);

  const handleProceedToBook = () => {
    // Send to booking page with generic journey data if accessed directly from Fleet page
    navigate('/book', {
      state: {
        cab,
        journey: { pickup: 'TBD', drop: 'TBD', date: 'TBD', tripType: 'One Way' }
      }
    });
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex justify-center items-start">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-black"></div>
    </div>
  );

  if (!cab) return <div className="pt-32 text-center">Cab not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 font-sans">
      <SEOHead title={`${cab.name} | CabBook`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="text-black font-bold hover:underline mb-6 inline-block transition-all">
          ← Back
        </button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 bg-gray-50 p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <img src={cab.image || 'https://via.placeholder.com/600x400?text=Cab'} alt={cab.name} className="max-w-full max-h-80 object-contain mix-blend-multiply" />
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 lg:p-10 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-3xl font-extrabold text-black tracking-tight">{cab.name}</h1>
                <p className="text-gray-500 font-medium capitalize mt-1">{cab.category || 'Premium'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-black">₹{cab.pricePerKm}<span className="text-base text-gray-500 font-medium">/km</span></div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-8">
             {/* NEW INTEGRATION: Vehicle Number Display Badge */}
              {cab.vehicleNumber && (
                <span className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl text-sm text-black tracking-widest ">
                  {cab.vehicleNumber}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
            
              <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-800">
                <FiUsers /> {cab.seats} Seats
              </span>
              <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-800">
                {cab.fuelType || 'Diesel'}
              </span>
              <span className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-800">
                {cab.acStatus || 'AC'}
              </span>
            </div>

            <div className="mb-10">
              <h3 className="font-bold text-black text-lg mb-4">Features included</h3>
              <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-600">
                {cab.features && cab.features.length > 0 ? (
                  cab.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <FiCheckCircle className="text-black flex-shrink-0 text-base" /> {feature}
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2.5"><FiCheckCircle className="text-black text-base"/> GPS Tracking</div>
                    <div className="flex items-center gap-2.5"><FiCheckCircle className="text-black text-base"/> First Aid Kit</div>
                    <div className="flex items-center gap-2.5"><FiCheckCircle className="text-black text-base"/> Clean Interiors</div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-auto">
              <button 
                onClick={handleProceedToBook}
                className="flex-grow bg-black hover:bg-neutral-800 text-white font-bold py-4 rounded-xl transition-all text-base shadow-md focus:outline-none focus:ring-4 focus:ring-neutral-200"
              >
                Book Now
              </button>
              <div className="border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-2 text-black font-semibold text-sm bg-white shadow-sm flex-shrink-0 cursor-default">
                <FiShield className="text-black text-xl" /> Safe Ride
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CabDetails;