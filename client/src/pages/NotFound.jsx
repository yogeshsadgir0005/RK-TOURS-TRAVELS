import { Link } from 'react-router-dom';
import { FiArrowRight, FiHome } from 'react-icons/fi';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const NotFound = () => (
  <PageTransition>
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 pb-16 pt-28 text-center text-white">
      <SEOHead title="Page Not Found | RK Tours" />
      <div className="max-w-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-500">Route unavailable / 404</p>
        <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-7xl">This road ends here.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/50">The page you requested does not exist or has moved. Return home to plan another route.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="inline-flex h-12 items-center gap-2 rounded-xl bg-orange-500 px-6 text-sm font-black text-white"><FiHome /> Go home</Link>
          <Link to="/contact" className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-black text-white">Contact support <FiArrowRight /></Link>
        </div>
      </div>
    </div>
  </PageTransition>
);

export default NotFound;
