import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const Privacy = () => {
  return (
    <PageTransition>
      <SEOHead title="Privacy Policy | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-32 pb-24 px-4 sm:px-8 font-sans">
        
        <div className="max-w-[65ch] mx-auto bg-white p-8 sm:p-12 rounded-[32px] border border-gray-100 shadow-saas-sm">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-100 pb-8">Last Updated: June 2026</p>
          
          <div className="space-y-8 text-gray-600 font-medium leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-black tracking-tight mb-4">1. Information We Collect</h2>
              <p>
                When you interact with RK Tours, we collect specific data to provide a seamless travel experience. This includes your name, contact information, location data (when using our application), and payment details processed securely through our partners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black tracking-tight mb-4">2. How We Use Your Data</h2>
              <p>
                Your data is exclusively utilized to:
              </p>
              <ul className="list-disc pl-5 mt-4 space-y-2">
                <li>Process and confirm your cab bookings.</li>
                <li>Provide real-time updates and driver tracking.</li>
                <li>Maintain the highest standards of safety and security during your trip.</li>
                <li>Improve our platform's algorithms for better route and pricing estimation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-black tracking-tight mb-4">3. Data Security Architecture</h2>
              <p>
                We employ enterprise-grade encryption (AES-256) for all data at rest and in transit. Your personal information is stored on secure servers with strict access controls, ensuring absolute privacy.
              </p>
            </section>

          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Privacy;