import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link, useLocation } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import { FiPhone } from 'react-icons/fi';

const Navbar = () => {
  const { logoUrl, siteName } = useBranding();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const logo = nav.querySelector('[data-nav-logo]');
      const items = nav.querySelectorAll('[data-nav-item]');

      gsap.fromTo(logo, { rotateY: -180, scale: 0.72, transformOrigin: 'center' }, { rotateY: 0, scale: 1, duration: 0.9, ease: 'back.out(1.5)' });
      gsap.fromTo(items, { rotateX: -88, transformOrigin: 'center top' }, { rotateX: 0, duration: 0.65, stagger: 0.07, ease: 'back.out(1.7)' });
    }, nav);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // For homepage, start glassmorphic and turn solid on scroll. For other pages, always solid dark to prevent white background bleeding behind glass.
  const isHome = location.pathname === '/';
  const navBgClass = (isHome && !scrolled) 
    ? 'bg-black/40 backdrop-blur-xl border-b border-white/10' 
    : 'bg-neutral-900 border-b border-transparent shadow-lg';

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link data-nav-logo to="/" className="flex items-center gap-3 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-9 w-auto object-contain" />
            ) : (
              <span className="text-white font-bold text-lg">{siteName}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link data-nav-item to="/" className={`text-[13px] font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Home</Link>
            <Link data-nav-item to="/about" className={`text-[13px] font-medium transition-colors ${isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>About</Link>
            <Link data-nav-item to="/contact" className={`text-[13px] font-medium transition-colors ${isActive('/contact') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Contact</Link>
            
            <a data-nav-item href="tel:+919130899368" className="text-[13px] font-medium text-white flex items-center gap-1.5 hover:text-gray-300 transition-colors">
              <FiPhone className="text-xs" />
              +91 91308 99368
            </a>

            <Link data-nav-item to="/my-bookings" className="text-[13px] font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors">
              My Bookings
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;