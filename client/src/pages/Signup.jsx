import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { setTempEmail } = useContext(AuthContext);
  const { logoUrl, siteName } = useBranding();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/register', { name, email, password });
      setTempEmail(email);
      toast.success('Registration successful. Please verify your email.');
      navigate('/verify-otp');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const LogoDisplay = ({ mobile = false }) => {
    if (logoUrl) {
      return (
        <img 
          src={logoUrl} 
          alt={siteName} 
          className={`${mobile ? 'h-12' : 'h-12'} w-auto object-contain rounded-xl hover:scale-105 transition-transform duration-300`} 
        />
      );
    }
    return (
      <div className={`w-12 h-12 bg-orange-500 text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-saas-inner ${!mobile ? 'hover:scale-105 transition-transform duration-300' : ''}`}>
        {siteName?.charAt(0) || 'R'}
      </div>
    );
  };

  return (
    <PageTransition>
      <SEOHead title={`Sign Up | ${siteName || 'RK Tours'}`} />
      <div className="min-h-screen bg-bg-secondary flex">
        
        {/* Left: Branding Visual (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center p-16">
          <div className="absolute inset-0 aurora-bg opacity-70"></div>
          <div className="absolute inset-0 noise-overlay"></div>
          
          <div className="relative z-10 max-w-md">
            <Link to="/" className="inline-block mb-12">
              <LogoDisplay />
            </Link>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Join the future of mobility.
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Create an account to track your journeys, save your payment methods, and get exclusive access to premium vehicles.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-sm">
            
            <div className="lg:hidden flex justify-center mb-10">
              <Link to="/">
                <LogoDisplay mobile />
              </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create an account</h2>
              <p className="text-sm text-gray-500 font-medium">Enter your details to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-semibold text-neutral-900 focus:border-orange-500 shadow-md outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-semibold text-neutral-900 focus:border-orange-500 shadow-md outline-none transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-semibold text-neutral-900 focus:border-orange-500 shadow-md outline-none transition-colors" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Create Account <FiArrowRight /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 font-medium">
              Already have an account? <Link to="/login" className="text-orange-500 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Signup;