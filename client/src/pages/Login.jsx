import { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import axiosInstance from '../utils/axiosInstance';
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, fetchUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Pass the token to your backend
        const res = await axiosInstance.post('/auth/google', { tokenId: tokenResponse.access_token });
        localStorage.setItem('token', res.data.token);
        await fetchUser();
        navigate(from, { replace: true });
      } catch (err) {
        setError('Google authentication failed. Please try again.');
      }
    },
    onError: () => setError('Google login was unsuccessful.'),
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24 font-sans">
      <SEOHead title="Log in" description="Log in to your CabBook account" url="/login" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black tracking-tight">Welcome back</h2>
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
                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all sm:text-sm text-black" 
              />
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
                Forgot your password?
              </Link>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-4 focus:ring-neutral-200 transition-all"
              >
                Log in
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                onClick={() => handleGoogleLogin()}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-black hover:bg-gray-50 hover:border-black transition-colors"
              >
                <img className="h-5 w-5" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Google
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/signup" className="text-sm font-semibold text-black underline decoration-2 decoration-neutral-300 hover:decoration-black transition-colors">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;