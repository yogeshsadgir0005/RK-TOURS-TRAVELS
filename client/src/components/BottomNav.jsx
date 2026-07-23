import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiPhone } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const location = useLocation();

  if (['/login', '/signup', '/verify-otp'].includes(location.pathname)) return null;

  const tabs = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/my-bookings', icon: FiList, label: 'Bookings' },
    { to: '/contact', icon: FiPhone, label: 'Contact' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-md border-t border-white/10"></div>
      
      <div className="relative flex justify-around items-center h-[68px] px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <Link key={tab.to} to={tab.to} className="relative flex flex-col items-center justify-center w-full h-full">
              {active && (
                <motion.div 
                  layoutId="bottomNavActive" 
                  className="absolute top-1.5 inset-x-4 h-0.5 bg-amber-400 rounded-full" 
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon className={`text-[20px] mb-0.5 ${active ? 'text-amber-400' : 'text-gray-500'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${active ? 'text-amber-400' : 'text-gray-500'}`}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
