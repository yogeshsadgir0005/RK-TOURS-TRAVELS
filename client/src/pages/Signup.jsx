import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/register', formData);
      navigate('/verify-otp', { state: { userId: res.data.userId, email: formData.email, intent: 'verify-email' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axiosInstance.post('/auth/google', { tokenId: tokenResponse.access_token });
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        navigate('/');
      } catch (err) {
        setError('Google signup failed. Please try again.');
      }
    },
    onError: () => setError('Google signup was unsuccessful.'),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <SEOHead title="Sign Up" description="Create a new CabBook account" url="/signup" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black tracking-tight">Create your account</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-gray-200 sm:rounded-2xl sm:px-10">
          {error && <div className="mb-6 bg-red-50 p-4 rounded-xl border border-red-200 text-red-700 text-sm font-medium">{error}</div>}
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required minLength={6} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" />
            </div>
            
            <div className="pt-3">
              <button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 disabled:opacity-70 transition-all">
                {loading ? <div className="w-5 h-5 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div> : 'Sign up'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">Or sign up with</span></div>
            </div>
            
            <div className="mt-6">
              <button onClick={() => handleGoogleSignup()} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-black hover:bg-gray-50 hover:border-black transition-colors">
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/login" className="text-sm font-semibold text-black underline decoration-2 decoration-neutral-300 hover:decoration-black transition-colors">
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;