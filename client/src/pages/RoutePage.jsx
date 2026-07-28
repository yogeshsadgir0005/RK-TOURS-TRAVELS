import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import SEOHead from '../components/SEOHead';
import BookingForm from '../components/BookingForm';
import PageTransition from '../components/PageTransition';

const formatCity = (value = '') => value
  .split('-')
  .filter(Boolean)
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join(' ');

const RoutePage = () => {
  const { routeSlug = '' } = useParams();
  const cities = routeSlug.split('-to-');

  if (cities.length !== 2 || !cities[0] || !cities[1]) {
    return (
      <PageTransition>
        <div className="flex min-h-[70vh] items-center justify-center bg-neutral-950 px-6 text-center text-white">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-orange-500">Route unavailable</p>
            <h1 className="text-4xl font-black">We could not read this route.</h1>
            <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold transition-colors hover:bg-orange-600">
              <FiArrowLeft /> Back home
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  const pickup = formatCity(cities[0]);
  const drop = formatCity(cities[1]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-950 pb-24 text-white">
        <SEOHead
          title={`Cab from ${pickup} to ${drop} - Best One Way Taxi Fares | RK Tours & Travels`}
          description={`Book clean and reliable cabs from ${pickup} to ${drop} with verified drivers and 24/7 support.`}
          url={`/cabs/${routeSlug}`}
          keywords={`cab from ${pickup} to ${drop}, taxi ${pickup} to ${drop}, ${pickup} to ${drop} one way cab`}
        />

        <header className="border-b border-white/10 bg-neutral-900 px-5 pb-16 pt-28 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-orange-500">Direct intercity booking</p>
            <h1 className="flex flex-wrap items-center gap-x-4 gap-y-2 text-4xl font-black tracking-tight sm:text-6xl">
              <span>{pickup}</span>
              <FiArrowRight className="text-orange-500" aria-hidden="true" />
              <span>{drop}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium text-gray-400 sm:text-lg">Choose your cab, date and trip type. The fare and journey details stay clear from pickup to drop.</p>
          </div>
        </header>

        <section className="mx-auto -mt-7 max-w-7xl px-4 sm:px-8">
          <BookingForm defaultPickup={pickup} defaultDrop={drop} />
        </section>
      </div>
    </PageTransition>
  );
};

export default RoutePage;