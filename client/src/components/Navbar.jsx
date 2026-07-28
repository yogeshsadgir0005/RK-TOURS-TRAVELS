import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiPhone } from 'react-icons/fi';
import { useBranding } from '../context/BrandingContext';

const NAV_ITEMS = [
  { to: '/', label: 'Home', number: '01' },
  { to: '/about', label: 'About', number: '02' },
  { to: '/contact', label: 'Contact', number: '03' },
];

const Navbar = () => {
  const { logoUrl, siteName } = useBranding();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [pastHero, setPastHero] = useState(!isHome);

  useEffect(() => {
    const updateNavbar = () => {
      if (location.pathname !== '/') {
        setPastHero(true);
        return;
      }

      const heroExitPoint = Math.max(window.innerHeight * 0.72, 520);
      setPastHero(window.scrollY >= heroExitPoint);
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
    window.addEventListener('resize', updateNavbar);

    return () => {
      window.removeEventListener('scroll', updateNavbar);
      window.removeEventListener('resize', updateNavbar);
    };
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const heroGlass = isHome && !pastHero;

  return (
    <nav className="site-nav fixed inset-x-0 top-0 z-50 bg-transparent pt-3">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div
          className={`flex h-16 items-center justify-between gap-3 rounded-2xl border border-white/20 px-3 shadow-[0_18px_60px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-300 sm:px-4 ${
            heroGlass
              ? 'bg-neutral-950/45 supports-[backdrop-filter]:bg-neutral-950/25'
              : 'bg-black'
          }`}
        >
          <div className="flex min-w-0 items-center">
            <Link data-nav-logo to="/" className="flex min-w-0 flex-shrink-0 items-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName || 'RK Tours & Travels'}
                  className="h-9 w-auto max-w-[190px] object-contain sm:max-w-[220px]"
                />
              ) : (
                <span className="text-lg font-black tracking-tight text-white">
                  {siteName || 'RK Tours & Travels'}
                </span>
              )}
            </Link>

            <div className="ml-4 hidden items-center border-l border-white/15 pl-4 2xl:flex">
              <span className="whitespace-nowrap text-[9px] font-bold uppercase leading-[1.3] tracking-[0.2em] text-white/55">
                Maharashtra
                <br />
                24 x 7 dispatch
              </span>
            </div>
          </div>

          <div className="hidden items-center rounded-full border border-white/10 bg-black/25 p-1 shadow-inner md:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  data-nav-item
                  to={item.to}
                  className={`flex h-9 items-center gap-2 rounded-full px-3 text-sm font-semibold transition-colors lg:px-4 ${
                    active
                      ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                      : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className="hidden text-[9px] font-black tracking-[0.12em] text-white/35 lg:inline">
                    {item.number}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-shrink-0 items-center gap-2">
            <a
              href="tel:+919130899368"
              className="hidden h-11 items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-3.5 text-white transition-colors hover:border-orange-500/40 hover:bg-white/10 xl:flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-orange-500/15 text-orange-500">
                <FiPhone size={14} />
              </span>
              <span className="leading-none">
                <span className="block text-[8px] font-bold uppercase tracking-[0.18em] text-white/40">
                  Call dispatch
                </span>
                <span className="mt-1 block text-xs font-bold">+91 91308 99368</span>
              </span>
            </a>

            <Link
              to="/my-bookings"
              className="hidden h-11 items-center gap-3 rounded-full bg-orange-500 pl-4 pr-1.5 text-sm font-black text-white shadow-[0_10px_28px_rgba(249,115,22,0.25)] transition-colors hover:bg-orange-600 md:flex"
            >
              My Bookings
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black/20">
                <FiArrowUpRight size={15} />
              </span>
            </Link>

            <a
              href="tel:+919130899368"
              aria-label="Call RK Tours & Travels"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-orange-500 md:hidden"
            >
              <FiPhone size={17} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
