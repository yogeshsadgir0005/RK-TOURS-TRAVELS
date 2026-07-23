import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const Terms = () => {
  return (
    <PageTransition>
      <SEOHead title="Terms of Service | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-20 pb-24 px-4 sm:px-8 font-sans">
        
        <div className="max-w-[65ch] mx-auto bg-neutral-900 p-8 sm:p-12 rounded-[32px] border border-neutral-800 shadow-saas-sm">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">Terms of Service</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8 border-b border-neutral-800 pb-8">Last Updated: June 2026</p>
          
          <div className="space-y-8 text-gray-400 font-medium leading-relaxed">
            
            <section>
              <h2 className="text-xl font-bold text-white tracking-tight mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the RK Tours platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not accept these terms, you must not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white tracking-tight mb-4">2. Service Usage</h2>
              <p>
                RK Tours provides a technology platform that connects users with independent cab operators. We are committed to maintaining the highest standards of service, but we are not a transportation carrier ourselves.
              </p>
              <p className="mt-4">
                Users must ensure that all information provided during the booking process is accurate and up-to-date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white tracking-tight mb-4">3. Cancellation & Refunds</h2>
              <p>
                We offer a transparent cancellation policy. Bookings cancelled 24 hours prior to the scheduled pickup time are eligible for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee.
              </p>
            </section>

          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Terms;