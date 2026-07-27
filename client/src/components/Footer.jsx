import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FiArrowRight, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { useBranding } from '../context/BrandingContext';

const Footer = () => {
  const { logoUrl, siteName, contentData } = useBranding();
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    if (!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let ctx;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();

      ctx = gsap.context(() => {
        footer.querySelectorAll('[data-footer-column]').forEach((column, index) => {
          gsap.fromTo(
            column,
            {
              rotateX: index % 2 ? 17 : -17,
              rotateY: index % 2 ? -11 : 11,
              scaleX: 0.86,
              scaleY: 0.9,
              transformOrigin: index % 2 ? 'center top' : 'center bottom',
              transformPerspective: 900,
            },
            {
              rotateX: 0,
              rotateY: 0,
              scaleX: 1,
              scaleY: 1,
              duration: 0.64,
              delay: index * 0.065,
              ease: 'back.out(1.35)',
            }
          );
        });

        const pin = footer.querySelector('[data-footer-pin]');
        if (pin) {
          gsap.timeline({ defaults: { ease: 'back.out(1.8)' } })
            .fromTo(pin, { rotateZ: -18, scaleY: 0.72, transformOrigin: '50% 85%' }, { rotateZ: 12, scaleY: 1.08, duration: 0.36 })
            .to(pin, { rotateZ: 0, scaleY: 1, duration: 0.28 });
        }
      }, footer);
    }, { threshold: 0.08 });

    observer.observe(footer);

    return () => {
      observer.disconnect();
      ctx?.revert();
    };
  }, []);

  const address = contentData?.contactAddress || "Pune, Maharashtra\nIndia 411001";
  const phone = contentData?.contactPhone || "+91 99999 99999";
  const email = contentData?.contactEmail || "support@rktours.com";
  const mapIframe = contentData?.mapIframe || "";

  return (
    <footer ref={footerRef} className="bg-neutral-900 text-white relative overflow-hidden pt-16 pb-12">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Responsive Grid: 1 row on Desktop (6 cols total), 2 columns on Mobile/Tablet */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-12 mb-20">
          
          {/* Logo Section (Full width on mobile, 2 cols on desktop) */}
          <div data-footer-column className="col-span-2 lg:col-span-2 pr-0 lg:pr-8">
            <Link to="/" className="flex items-center gap-2 mb-6 group inline-flex">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-14 w-auto object-contain rounded-[10px] transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-[var(--shadow-saas-inner)] group-hover:scale-105 transition-transform duration-300">
                  {siteName?.charAt(0) || 'R'}
                </div>
              )}
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">
              Your trusted partner for outstation cab bookings across Maharashtra. Reliable drivers, clean cars, and transparent pricing on every trip.
            </p>
          </div>

          {/* Company */}
          <div data-footer-column className="col-span-1">
            <h4 className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Contact</Link></li>
              <li><Link to="/careers" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div data-footer-column className="col-span-1">
            <h4 className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Terms</Link></li>
              <li><Link to="/cancellation" className="text-gray-400 text-sm hover:text-white transition-colors duration-200 flex items-center gap-2 group"><span className="hidden sm:inline-block opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"><FiArrowRight /></span> Cancellation</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div data-footer-column className="col-span-2">
            <h4 className="text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest mb-6 text-center">Contact</h4>
            <div className="flex flex-col sm:flex-row gap-6">
              
              {/* Left Side: Map */}
              <div className="w-full sm:w-1/2 h-48 sm:h-auto min-h-[160px] rounded-xl overflow-hidden bg-white/5 border border-white/10 relative shadow-lg flex-shrink-0">
                <iframe 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no" 
                  marginHeight="0" 
                  marginWidth="0" 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(address.replace(/\n/g, ', '))}&t=&z=11&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 absolute inset-0 z-0 opacity-90 grayscale-[20%]"
                  title="Location Map"
                ></iframe>
                
                {/* Custom Guaranteed Red Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] pointer-events-none z-10 drop-shadow-2xl">
                  <svg data-footer-pin xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-500">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <div className="w-3 h-1 bg-black/40 rounded-full mx-auto mt-1 blur-[1px]"></div>
                </div>
              </div>

              {/* Right Side: Address in Words */}
              <div className="w-full sm:w-1/2 flex flex-col justify-center gap-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-400 flex-shrink-0" />
                  <p className="text-gray-400 text-xs sm:text-sm">{phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-400 flex-shrink-0" />
                  <p className="text-gray-400 text-xs sm:text-sm">{email}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-500 text-sm">Designed for reliability</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;