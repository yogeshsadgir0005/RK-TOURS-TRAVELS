import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import BookingForm from '../components/BookingForm';

const CityPage = () => {
  const { citySlug } = useParams();
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const res = await axiosInstance.get(`/seo/page?url=/city/${citySlug}`);
        setSeoData(res.data);
      } catch (error) {
        console.error("City SEO not found");
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, [citySlug]);

  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  if (loading) return <div className="pt-32 text-center">Loading city data...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {seoData ? (
        <SEOHead title={seoData.title} description={seoData.metaDescription} url={`/city/${citySlug}`} keywords={seoData.keywords} />
      ) : (
        <SEOHead title={`Cabs in ${cityName}`} description={`Book the best cabs in ${cityName}`} url={`/city/${citySlug}`} />
      )}

      <div className="pt-24 pb-12 bg-blue-900 text-white text-center px-4">
        <h1 className="text-4xl font-bold">{seoData?.h1Tag || `Cab Services in ${cityName}`}</h1>
        <p className="mt-4 text-xl text-blue-200">Explore outstation and local cabs.</p>
      </div>

      <div className="px-4 mt-8">
        {/* Pass default pickup as the city */}
        <BookingForm defaultPickup={cityName} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">Why book a cab in {cityName} with us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h3 className="font-bold text-lg mb-2">Verified Drivers</h3>
             <p className="text-gray-600">All our drivers in {cityName} are background checked.</p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h3 className="font-bold text-lg mb-2">Lowest Fares</h3>
             <p className="text-gray-600">We guarantee the best prices for your journeys originating from {cityName}.</p>
           </div>
           <div className="bg-white p-6 rounded-lg shadow-sm border">
             <h3 className="font-bold text-lg mb-2">24/7 Support</h3>
             <p className="text-gray-600">Round the clock customer support for all your needs.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default CityPage;