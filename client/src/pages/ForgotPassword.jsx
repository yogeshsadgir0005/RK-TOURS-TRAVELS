import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiMail } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';
import SEOHead from '../components/SEOHead';
import PageTransition from '../components/PageTransition';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      navigate('/verify-otp', { state: { email, intent: 'reset-password' } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 pb-16 pt-28">
        <SEOHead title="Forgot Password | RK Tours" description="Reset your RK Tours account password." />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:42px_42px]" />

        <div className="relative w-full max-w-md">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
          >
            <FiArrowLeft /> Back to login
          </Link>

          <div className="rounded-[28px] border border-white/10 bg-neutral-900 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.38)] sm:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-500">Account recovery</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Reset your password.</h1>
            <p className="mt-2 text-sm leading-relaxed text-white/50">Enter your email and we will send a six-digit verification code.</p>

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 p-4 text-sm font-semibold text-red-300">
                {error}
              </div>
            )}

            <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/45">Email address</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 w-full rounded-xl border border-white/10 bg-neutral-950 pl-11 pr-4 text-sm font-semibold text-white outline-none transition-colors placeholder:text-white/30 focus:border-orange-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                ) : (
                  <>Send verification code <FiArrowRight /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
