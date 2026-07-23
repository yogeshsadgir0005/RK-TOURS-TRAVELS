import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { FiTarget, FiShield, FiHeart } from 'react-icons/fi';

const About = () => {
  return (
    <PageTransition>
      <SEOHead title="About Us | RK Tours" />
      <div className="min-h-screen bg-bg-secondary pt-20 pb-24 px-4 sm:px-8 font-sans">
        
        <div className="max-w-[65ch] mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-8">About RK Tours</h1>
          
          <div className="text-gray-400 font-medium leading-relaxed space-y-6 text-lg">
            <p>
              Founded with a singular vision, RK Tours represents the apex of intercity mobility. We believe that traveling between cities should not be a chore, but a seamless, premium experience.
            </p>
            <p>
              By leveraging cutting-edge SaaS architecture, we have eliminated the friction traditionally associated with booking outstation cabs. Our platform provides absolute transparency, instant confirmations, and an uncompromising standard of quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16">
            <div className="bg-neutral-900 p-6 rounded-[24px] border border-neutral-800 shadow-saas-sm">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-800"><FiTarget className="text-white text-lg" /></div>
              <h3 className="font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-gray-400 leading-relaxed">To engineer the most reliable and premium intercity travel network in India.</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-[24px] border border-neutral-800 shadow-saas-sm">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-800"><FiShield className="text-white text-lg" /></div>
              <h3 className="font-bold text-white mb-2">Our Promise</h3>
              <p className="text-sm text-gray-400 leading-relaxed">Zero hidden fees, perfectly maintained vehicles, and absolute punctuality.</p>
            </div>
            <div className="bg-neutral-900 p-6 rounded-[24px] border border-neutral-800 shadow-saas-sm">
              <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center mb-4 border border-neutral-800"><FiHeart className="text-white text-lg" /></div>
              <h3 className="font-bold text-white mb-2">Our Passion</h3>
              <p className="text-sm text-gray-400 leading-relaxed">A relentless obsession with the finest details of user experience and comfort.</p>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default About;