import { createElement } from 'react';
import { useParams } from 'react-router-dom';
import { FiClock, FiShield, FiTag } from 'react-icons/fi';
import SEOHead from '../components/SEOHead';
import BookingForm from '../components/BookingForm';
import PageTransition from '../components/PageTransition';

const formatCity = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const CityPage = () => {
  const { citySlug = '' } = useParams();
  const cityName = formatCity(citySlug) || 'Your city';
  const benefits = [
    { icon: FiShield, title: 'Verified drivers', body: `Every driver serving ${cityName} is checked before dispatch.` },
    { icon: FiTag, title: 'Clear fares', body: `Know the price structure for journeys starting in ${cityName}.` },
    { icon: FiClock, title: '24/7 support', body: 'A real support team stays available throughout your trip.' },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-950 pb-24 text-white">
        <SEOHead
          title={`Cabs in ${cityName} - Top Rated Taxi Service | RK Tours & Travels`}
          description={`Book reliable local and outstation cabs in ${cityName} with verified drivers and clear fares.`}
          url={`/city/${citySlug}`}
          keywords={`cabs in ${cityName}, ${cityName} taxi service, book cab ${cityName}`}
        />

        <header className="border-b border-white/10 bg-neutral-900 px-5 pb-16 pt-28 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-orange-500">Local and outstation</p>
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Cab service in {cityName}</h1>
            <p className="mt-5 max-w-2xl text-base font-medium text-gray-400 sm:text-lg">Plan a clean, dependable ride with straightforward booking and round-the-clock assistance.</p>
          </div>
        </header>

        <section className="mx-auto -mt-7 max-w-7xl px-4 sm:px-8">
          <BookingForm defaultPickup={cityName} />
        </section>

        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
          <div className="grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-3">
            {benefits.map(({ icon, title, body }) => (
              <article key={title} className="bg-neutral-900 p-7 sm:p-8">
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-500">{createElement(icon)}</div>
                <h2 className="mb-2 text-xl font-black">{title}</h2>
                <p className="text-sm font-medium leading-relaxed text-gray-400">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default CityPage;