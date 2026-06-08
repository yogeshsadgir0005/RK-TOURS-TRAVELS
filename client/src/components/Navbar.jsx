import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { logoUrl, siteName } = useBranding();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pointer-events-none">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="pointer-events-auto bg-white/70 backdrop-blur-3xl border border-black/5 shadow-[var(--shadow-saas-lg)] rounded-full px-8 py-3.5 flex items-center justify-between w-full max-w-7xl mx-auto"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-8 w-auto object-contain rounded-[8px] transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xl shadow-[var(--shadow-saas-inner)] group-hover:scale-105 transition-transform duration-300">
                {siteName.charAt(0)}
              </div>
            )}
            <span className="font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-black to-neutral-600">
              {siteName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 rounded-full hover:bg-gray-100/50 transition-colors">Home</Link>
            <Link to="/about" className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 rounded-full hover:bg-gray-100/50 transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 rounded-full hover:bg-gray-100/50 transition-colors">Contact</Link>
            
            <div className="w-px h-6 bg-gray-200 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/my-bookings" className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 rounded-full hover:bg-gray-100/50 transition-colors">My Bookings</Link>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-semibold text-black px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  {user.name?.split(' ')[0] || 'Account'}
                </Link>
                <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                  <FiLogOut className="text-lg" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link to="/login" className="text-sm font-bold text-black px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors">Log In</Link>
                <Link to="/signup" className="text-sm font-bold text-white bg-gradient-to-b from-neutral-800 to-black border border-black/10 px-5 py-2.5 rounded-full shadow-[var(--shadow-saas-sm)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle (Removed because bottom bar exists) */}
        </motion.nav>
      </div>
    </>
  );
};

export default Navbar;