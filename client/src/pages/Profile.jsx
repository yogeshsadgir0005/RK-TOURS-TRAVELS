import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiCheckCircle, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const Profile = () => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.put('/auth/profile', formData);
      login(response.data.user, localStorage.getItem('token'));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = 'h-12 w-full rounded-xl border border-white/10 bg-neutral-950 pl-11 pr-4 text-sm font-semibold text-white outline-none transition-colors focus:border-orange-500 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-white/35';

  return (
    <PageTransition>
      <SEOHead title="Profile | RK Tours" />
      <div className="min-h-screen bg-neutral-950 px-4 pb-16 pt-28 sm:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-2 rounded-2xl border border-white/10 bg-neutral-900 p-2">
              <Link to="/profile" className="flex items-center gap-3 rounded-xl bg-orange-500 px-4 py-3 text-sm font-black text-white">
                <FiUser /> Account details
              </Link>
              <Link to="/my-bookings" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white">
                <FiBookOpen /> My bookings
              </Link>
            </div>
          </aside>

          <main>
            <div className="mb-8">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">Customer account</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white">Account settings</h1>
              <p className="mt-2 text-sm text-white/45">Manage the details used for your bookings.</p>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-neutral-900 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
              <div className="flex flex-col gap-5 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-orange-500 text-3xl font-black text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">{user?.name || 'RK customer'}</h2>
                  <p className="mt-1 text-sm font-medium text-white/40">Member account</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 p-6 sm:p-8">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Full name</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className={fieldClass} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Email address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="email" value={formData.email} disabled className={fieldClass} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-emerald-400">Verified</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.16em] text-white/40">Phone number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className={fieldClass} />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <button type="submit" disabled={isLoading} className="flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-7 text-sm font-black text-white transition-colors hover:bg-orange-600 disabled:opacity-60">
                    {isLoading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" /> : <>Save changes <FiCheckCircle /></>}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
