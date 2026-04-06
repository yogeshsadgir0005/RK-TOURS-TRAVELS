import SEOHead from '../components/SEOHead';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <SEOHead title="Privacy Policy" description="CabBooker Privacy Policy" url="/privacy" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-blue">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-gray-600 mb-4">We collect personal information such as your name, email address, and phone number when you register an account or make a booking. We also collect location data to provide our services effectively.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-gray-600 mb-4">We use your information to process bookings, communicate with you regarding your rides, and improve our platform. Your contact details are securely shared with assigned drivers for pickup coordination.</p>
        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
        <p className="text-gray-600 mb-4">We implement robust security measures to protect your personal data from unauthorized access, alteration, or disclosure.</p>
      </div>
    </div>
  );
};
export default Privacy;