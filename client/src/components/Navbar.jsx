import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCar } from 'react-icons/fa';
import axiosInstance from '../utils/axiosInstance';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [logoUrl, setLogoUrl] = useState('');
  const [siteName, setSiteName] = useState('CabBook');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const res = await axiosInstance.get('/content');
        if (res.data.logoUrl) setLogoUrl(res.data.logoUrl);
        if (res.data.siteName) setSiteName(res.data.siteName);
      } catch (err) {
        console.error("Branding fetch failed", err);
      }
    };
    fetchBranding();

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navBackgroundClass = (isHomePage && !isScrolled)
    ? 'bg-black/20 backdrop-blur-md border-b border-transparent' 
    : 'bg-black border-b border-neutral-800';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <Link to="/" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
              
            ) : (
              <>
                <div className="text-white group-hover:scale-110 transition-transform">
                  <FaCar className="text-2xl" />
                </div>
              </>
            )}
            
                <span className="font-bold text-lg text-white tracking-tight">{siteName}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>Home</Link>
            <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>About</Link>
            <Link to="/contact" className={`text-sm font-medium transition-colors ${location.pathname === '/contact' ? 'text-white' : 'text-neutral-400 hover:text-white'}`}>Contact</Link>
          </div>

          {/* User Controls */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/my-bookings" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors">My Bookings</Link>
            
                  <Link to="/profile" className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all">Profile</Link>
                
                <button onClick={handleLogout} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-white hover:text-neutral-300 px-4 py-2 transition-colors">Log in</Link>
                <Link to="/signup" className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-all shadow-lg shadow-white/5">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-neutral-300 p-2 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-neutral-800 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">Contact</Link>
            
            {user ? (
              <>
                <div className="h-px bg-neutral-800 my-4 mx-4"></div>
                <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">My Bookings</Link>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-xl transition-colors">Profile</Link>
                <button 
                  onClick={handleLogout} 
                  className="w-full text-left block px-4 py-3 text-base font-medium text-red-400 hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex justify-center items-center px-4 py-2.5 border border-neutral-700 text-base font-medium rounded-full text-white hover:bg-neutral-800 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="flex justify-center items-center px-4 py-2.5 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-neutral-200 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;