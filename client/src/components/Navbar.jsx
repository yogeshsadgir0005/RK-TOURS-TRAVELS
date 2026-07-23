import { Link, useLocation } from 'react-router-dom';
import { useBranding } from '../context/BrandingContext';
import { FiPhone } from 'react-icons/fi';

const Navbar = () => {
  const { logoUrl, siteName } = useBranding();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-md border-b border-white/5">
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
            
            <a href="tel:+918087959271" className="text-[13px] font-medium text-amber-400 flex items-center gap-1.5 hover:text-amber-300 transition-colors">
              <FiPhone className="text-xs" />
              +91 80879 59271
            </a>

            <Link to="/my-bookings" className="text-[13px] font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-md transition-colors">
              My Bookings
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;