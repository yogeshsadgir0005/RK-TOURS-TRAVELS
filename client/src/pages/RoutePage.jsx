import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import BookingForm from '../components/BookingForm';

const RoutePage = () => {
  const { routeSlug } = useParams(); // e.g., mumbai-to-pune
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        // Fetch dynamic SEO data based on the URL slug
        const res = await axiosInstance.get(`/seo/page?url=/cabs/${routeSlug}`);
        setSeoData(res.data);
      } catch (error) {
        console.error("SEO data not found for this route");
      } finally {
        setLoading(false);
      }
    };
    fetchRouteData();
  }, [routeSlug]);

  if (loading) return <div>Loading route...</div>;

  // Format city names for display
  const cities = routeSlug.split('-to-');
  const pickup = cities[0].charAt(0).toUpperCase() + cities[0].slice(1);
  const drop = cities[1].charAt(0).toUpperCase() + cities[1].slice(1);

  return (
    <div className="bg-gray-50 min-h-screen">
      {seoData ? (
        <SEOHead 
          title={seoData.title} 
          description={seoData.metaDescription} 
          url={`/cabs/${routeSlug}`}
          keywords={seoData.keywords}
          schemaMarkup={seoData.schemaMarkup}
        />
      ) : (
        <SEOHead 
          title={`Cab from ${pickup} to ${drop} - Best One Way Taxi Fares | RK Tours & Travels`} 
          description={`Book cheap and reliable cabs from ${pickup} to ${drop}. Experienced drivers, clean cars, and timely service. 24/7 customer support.`} 
          url={`/cabs/${routeSlug}`} 
          keywords={`cab from ${pickup} to ${drop}, taxi ${pickup} to ${drop}, ${pickup} to ${drop} one way cab, ${pickup} to ${drop} taxi fare`}
          schemaMarkup={{
            "@context": "https://schema.org",
            "@type": "Product",
            "name": `Cab Ride: ${pickup} to ${drop}`,
            "description": `One-way or round-trip cab service from ${pickup} to ${drop}.`,
            "brand": {
              "@type": "Brand",
              "name": "RK Tours & Travels"
            }
          }}
        />
      )}

      <div className="pt-24 pb-12 bg-blue-900 text-white text-center px-4">
        <h1 className="text-4xl font-bold">{seoData?.h1Tag || `Cab Booking from ${pickup} to ${drop}`}</h1>
      </div>

      <div className="px-4 mt-8">
        <BookingForm defaultPickup={pickup} defaultDrop={drop} />
      </div>
      
      {/* Dynamic Content could be injected here from backend */}
    </div>
  );
};
export default RoutePage;