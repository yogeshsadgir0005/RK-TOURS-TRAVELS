import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useBranding } from '../context/BrandingContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { logoUrl, siteName } = useBranding();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      login(response.data, response.data.token);
      toast.success('Welcome back!');
      navigate(from, { replace: true, state: location.state?.state });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsGoogleLoading(true);
      try {
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        const res = await axiosInstance.post('/auth/google', {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub,
          image: userInfo.data.picture,
        });
        
        login(res.data, res.data.token);
        toast.success('Successfully logged in with Google');
        navigate(from, { replace: true, state: location.state?.state });
      } catch (error) {
        console.error('Google login API error:', error.response?.data || error.message || error);
        toast.error(error.response?.data?.message || 'Google login failed due to API error');
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google login popup error:', err);
      toast.error('Google login popup failed');
    },
  });

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
      <SEOHead title={`Log In | ${siteName || 'RK Tours'}`} />
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
              Your gateway to premium intercity travel.
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              Log in to access your bookings, save your details, and experience seamless journeys across India.
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
              <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Welcome back</h2>
              <p className="text-sm text-gray-400 font-medium">Please enter your details to sign in.</p>
            </div>

            <button 
              onClick={() => googleLogin()}
              disabled={isGoogleLoading}
              className="w-full h-12 bg-white border border-transparent rounded-xl flex items-center justify-center gap-3 font-bold text-sm text-neutral-900 hover:bg-neutral-100 shadow-md transition-all mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-neutral-800 flex-1"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Or email</span>
              <div className="h-px bg-neutral-800 flex-1"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block ml-1">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-bold text-neutral-900 placeholder-gray-500 focus:border-orange-500 outline-none shadow-md transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Password</label>
                  <Link to="/forgot-password" className="text-[10px] font-bold uppercase tracking-widest text-orange-500 hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                  <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full h-12 pl-11 pr-4 bg-white border border-transparent rounded-xl text-sm font-bold text-neutral-900 placeholder-gray-500 focus:border-orange-500 outline-none shadow-md transition-colors" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Sign In <FiArrowRight /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400 font-medium">
              Don't have an account? <Link to="/signup" className="text-orange-500 font-bold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default Login;