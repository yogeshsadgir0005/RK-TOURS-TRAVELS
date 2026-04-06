import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      // Navigate to OTP page telling it this is a password reset flow
      navigate('/verify-otp', { state: { email, intent: 'reset-password' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <SEOHead title="Forgot Password" description="Reset your CabBook account password" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black tracking-tight">Reset password</h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">Enter your email and we'll send you an OTP.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10">
          {error && <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 text-sm font-medium">{error}</div>}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" 
              />
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-black hover:bg-neutral-800 disabled:opacity-70 transition-all"
              >
                {loading ? <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div> : 'Send OTP'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-semibold text-black hover:underline transition-colors">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;