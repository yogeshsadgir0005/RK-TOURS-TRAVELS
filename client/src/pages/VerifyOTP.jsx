import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';
import { FiArrowRight } from 'react-icons/fi';

const VerifyOTP = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  
  const { tempEmail, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!tempEmail) {
      toast.error('Session expired. Please sign up again.');
      navigate('/signup');
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [tempEmail, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).split('');
    if (pastedData.some(isNaN)) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextFocusIndex = pastedData.length < 6 ? pastedData.length : 5;
    inputRefs.current[nextFocusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email: tempEmail, otp: otpValue });
      login(response.data.user, response.data.token);
      toast.success('Email verified successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
      setOtp(new Array(6).fill(''));
      inputRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <SEOHead title="Verify Email | RK Tours" />
      <div className="min-h-screen bg-bg-secondary flex">
        
        {/* Left: Branding Visual (Hidden on Mobile) */}
        <div className="hidden lg:flex w-1/2 bg-black relative overflow-hidden items-center justify-center p-16">
          <div className="absolute inset-0 aurora-bg opacity-70"></div>
          <div className="absolute inset-0 noise-overlay"></div>
          
          <div className="relative z-10 max-w-md">
            <Link to="/" className="inline-block mb-12">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-black text-2xl shadow-saas-inner hover:scale-105 transition-transform duration-300">
                R
              </div>
            </Link>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Security first.
            </h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed">
              We need to verify your email address to ensure the security of your account and future bookings.
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
          <div className="w-full max-w-sm">
            
            <div className="lg:hidden flex justify-center mb-10">
              <Link to="/">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-saas-inner">
                  R
                </div>
              </Link>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-black tracking-tight mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 font-medium">We've sent a 6-digit code to <span className="font-bold text-black">{tempEmail}</span></p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="flex justify-between gap-2" onPaste={handlePaste}>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-black bg-gray-50/50 border border-gray-200 rounded-xl focus:border-black focus:bg-white shadow-saas-inner outline-none transition-colors"
                  />
                ))}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 mt-4 bg-gradient-to-b from-neutral-800 to-black text-white rounded-xl font-bold text-sm shadow-saas-glow border border-black/10 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Verify & Continue <FiArrowRight /></>}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 font-medium">
              Didn't receive the code? <button className="text-black font-bold hover:underline">Resend</button>
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default VerifyOTP;