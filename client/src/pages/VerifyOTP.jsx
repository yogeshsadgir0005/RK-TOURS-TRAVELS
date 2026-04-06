import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { AuthContext } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import toast from 'react-hot-toast';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, fetchUser } = useContext(AuthContext); // Access user to check login status

  const userId = location.state?.userId;
  const email = location.state?.email;
  const intent = location.state?.intent || 'verify-email';

  if (!email && !userId) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const loadId = toast.loading('Verifying security code...');

    try {
      if (intent === 'reset-password') {
        await axiosInstance.post('/auth/reset-password', { email, otp, newPassword });
        toast.success('Password reset successfully!', { id: loadId });
        
        // If user is already logged in (resetting from profile), go to profile.
        // If not (forgot password flow), go to login.
        if (user) {
          navigate('/profile');
        } else {
          navigate('/login');
        }
      } 
      else if (intent === 'update-profile') {
        // For secure profile changes (Email/Phone)
        await axiosInstance.post('/auth/verify-update', { otp });
        await fetchUser(); // Refresh global state
        toast.success('Changes applied successfully!', { id: loadId });
        navigate('/profile');
      } 
      else {
        // Standard Signup Verification
        const res = await axiosInstance.post('/auth/verify-otp', { userId, otp });
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        toast.success('Account verified!', { id: loadId });
        // Since verify-otp logs them in, the PublicRoute logic will take care of future attempts
        navigate('/'); 
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP. Please check and try again.';
      setError(msg);
      toast.error(msg, { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <SEOHead title="Secure Verification | CabBook" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black tracking-tight">
          {intent === 'reset-password' ? 'Reset Password' : 
           intent === 'update-profile' ? 'Authorize Change' : 'Verify Identity'}
        </h2>
        <p className="mt-3 text-center text-sm font-medium text-gray-500 leading-relaxed">
          A 6-digit security code has been sent to <br/>
          <strong className="text-black font-bold">{email}</strong>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-10 px-4 shadow-2xl border border-gray-100 sm:rounded-[32px] sm:px-12">
          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-xs font-bold text-center uppercase tracking-widest">
              {error}
            </div>
          )}
          
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-extrabold text-gray-400 mb-4 text-center uppercase tracking-[0.3em]">
                Enter 6-Digit Code
              </label>
              <input 
                type="text" 
                required 
                maxLength={6} 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="------"
                className="appearance-none block w-full px-3 py-5 bg-gray-50 border-none rounded-2xl text-center text-4xl tracking-[0.4em] font-black text-black focus:ring-2 focus:ring-black focus:bg-white transition-all shadow-inner outline-none" 
              />
            </div>

            {intent === 'reset-password' && (
              <div className="animate-in slide-in-from-bottom-2 duration-300">
                <label className="block text-xs font-bold text-gray-700 mb-2 ml-1">Set New Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-black focus:bg-white transition-all sm:text-sm text-black outline-none" 
                />
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading || otp.length < 6}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all disabled:opacity-40 uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Confirm & Continue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;