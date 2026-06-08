import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiUser } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  if (['/login', '/signup', '/verify-otp'].includes(location.pathname)) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-xl border-t border-gray-200/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"></div>
      
      <div className="relative flex justify-around items-center h-[76px] px-2 pb-[env(safe-area-inset-bottom)] pt-1">
        
        {/* Home */}
        <Link to="/" className="relative flex flex-col items-center justify-center w-full h-full">
          {location.pathname === '/' && (
            <motion.div 
              layoutId="bottomNavBubble" 
              className="absolute inset-y-2 inset-x-3 bg-white rounded-[18px] shadow-sm border border-gray-200/50" 
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          )}
          <div className={`relative z-10 p-1 transition-transform duration-300 ${location.pathname === '/' ? '-translate-y-0.5 text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <FiHome className="text-[20px] stroke-[2.5]" />
          </div>
          <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest mt-0.5 ${location.pathname === '/' ? 'text-black' : 'text-gray-400'}`}>Home</span>
        </Link>

        {/* Bookings */}
        <Link to="/my-bookings" className="relative flex flex-col items-center justify-center w-full h-full">
          {location.pathname === '/my-bookings' && (
            <motion.div 
              layoutId="bottomNavBubble" 
              className="absolute inset-y-2 inset-x-3 bg-white rounded-[18px] shadow-sm border border-gray-200/50" 
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          )}
          <div className={`relative z-10 p-1 transition-transform duration-300 ${location.pathname === '/my-bookings' ? '-translate-y-0.5 text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <FiList className="text-[20px] stroke-[2.5]" />
          </div>
          <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest mt-0.5 ${location.pathname === '/my-bookings' ? 'text-black' : 'text-gray-400'}`}>Bookings</span>
        </Link>

        {/* Profile */}
        <Link to={user ? "/profile" : "/login"} className="relative flex flex-col items-center justify-center w-full h-full">
          {location.pathname === '/profile' && (
            <motion.div 
              layoutId="bottomNavBubble" 
              className="absolute inset-y-2 inset-x-3 bg-white rounded-[18px] shadow-sm border border-gray-200/50" 
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          )}
          <div className={`relative z-10 p-1 transition-transform duration-300 ${location.pathname === '/profile' ? '-translate-y-0.5 text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <FiUser className="text-[20px] stroke-[2.5]" />
          </div>
          <span className={`relative z-10 text-[9px] font-black uppercase tracking-widest mt-0.5 ${location.pathname === '/profile' ? 'text-black' : 'text-gray-400'}`}>Profile</span>
        </Link>

      </div>
    </div>
  );
};

export default BottomNav;
