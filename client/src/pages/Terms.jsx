import SEOHead from '../components/SEOHead';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEOHead title="Terms of Service" description="CabBooker Terms and Conditions" url="/terms" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-blue">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p className="text-gray-600 mb-4">By accessing and using the CabBooker platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. Booking and Cancellation</h2>
        <p className="text-gray-600 mb-4">Bookings are subject to cab availability. Users can cancel bookings prior to driver dispatch without penalty. Late cancellations may incur a fee as determined by our cancellation policy.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. User Responsibilities</h2>
        <p className="text-gray-600 mb-4">Users agree to provide accurate information, treat drivers with respect, and not use the service for any unlawful purposes.</p>
      </div>
    </div>
  );
};
export default Terms;