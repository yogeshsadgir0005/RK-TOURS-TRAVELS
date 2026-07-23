import { useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import BookingForm from '../components/BookingForm';

const CityPage = () => {
  const { citySlug } = useParams();
  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  return (
    <div className="bg-neutral-900 min-h-screen text-white">
      <SEOHead 
        title={`Cabs in ${cityName} - Top Rated Taxi Service | RK Tours & Travels`} 
        description={`Book the best and most affordable cabs in ${cityName}. Reliable local and outstation taxi service with verified drivers.`} 
        url={`/city/${citySlug}`} 
        keywords={`cabs in ${cityName}, ${cityName} taxi service, book cab ${cityName}, outstation cabs ${cityName}, car rental ${cityName}`}
        schemaMarkup={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": `RK Tours & Travels - ${cityName}`,
          "description": `Reliable taxi service in ${cityName}. Book local and outstation cabs instantly.`,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": cityName,
            "addressCountry": "IN"
          }
        }}
      />

      <div className="pt-24 pb-12 bg-neutral-800 text-white text-center px-4">
        <h1 className="text-4xl font-bold">{`Cab Services in ${cityName}`}</h1>
        <p className="mt-4 text-xl text-neutral-300">Explore outstation and local cabs.</p>
      </div>

      <div className="px-4 mt-8">
        {/* Pass default pickup as the city */}
        <BookingForm defaultPickup={cityName} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-6">Why book a cab in {cityName} with us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
           <div className="bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-700">
             <h3 className="font-bold text-lg mb-2 text-white">Verified Drivers</h3>
             <p className="text-gray-400">All our drivers in {cityName} are background checked.</p>
           </div>
           <div className="bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-700">
             <h3 className="font-bold text-lg mb-2 text-white">Lowest Fares</h3>
             <p className="text-gray-400">We guarantee the best prices for your journeys originating from {cityName}.</p>
           </div>
           <div className="bg-neutral-800 p-6 rounded-lg shadow-sm border border-neutral-700">
             <h3 className="font-bold text-lg mb-2 text-white">24/7 Support</h3>
             <p className="text-gray-400">Round the clock customer support for all your needs.</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default CityPage;