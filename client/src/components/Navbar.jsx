import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import { FiPhone } from 'react-icons/fi';

const Navbar = () => {
  const { logoUrl, siteName } = useBranding();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-9 w-auto object-contain" />
            ) : (
              <span className="text-white font-bold text-lg">{siteName}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-[13px] font-medium transition-colors ${isActive('/') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Home</Link>
            <Link to="/about" className={`text-[13px] font-medium transition-colors ${isActive('/about') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>About</Link>
            <Link to="/contact" className={`text-[13px] font-medium transition-colors ${isActive('/contact') ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Contact</Link>
            
            <a href="tel:+918087959271" className="text-[13px] font-medium text-orange-500 flex items-center gap-1.5 hover:text-orange-400 transition-colors">
              <FiPhone className="text-xs" />
              +91 80879 59271
            </a>

            <Link to="/my-bookings" className="text-[13px] font-semibold text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md transition-colors">
              My Bookings
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;