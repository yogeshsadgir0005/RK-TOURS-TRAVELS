import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';
import { DEFAULT_CABS, mergeDataById } from '../data/defaultData';
import FleetCard from '../components/FleetCard';
import PageTransition from '../components/PageTransition';
import SEOHead from '../components/SEOHead';

const getInitialCabs = () => {
  try {
    const cached = JSON.parse(sessionStorage.getItem('cabsData') || '[]');
    return mergeDataById(DEFAULT_CABS, Array.isArray(cached) ? cached : []);
  } catch {
    return DEFAULT_CABS;
  }
};

const Fleet = () => {
  const navigate = useNavigate();
  const [cabs, setCabs] = useState(getInitialCabs);

  useEffect(() => {
    let active = true;

    axiosInstance.get('/cabs?limit=100')
      .then(({ data }) => {
        if (!active) return;
        const fetched = Array.isArray(data) ? data : [];
        const merged = mergeDataById(DEFAULT_CABS, fetched);
        setCabs(merged);
        sessionStorage.setItem('cabsData', JSON.stringify(merged));
      })
      .catch(() => {
        // The bundled fleet remains available when the API is offline.
      });

    return () => {
      active = false;
    };
  }, []);

  const bookCab = (cab) => {
    navigate('/book', {
      state: {
        cab,
        journey: {
          pickup: '',
          drop: '',
          date: new Date().toISOString().split('T')[0],
          tripType: 'one-way',
        },
      },
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-950 pb-20 pt-28 text-white">
        <SEOHead
          title="Our Fleet | RK Tours & Travels"
          description="Explore RK Tours & Travels' maintained sedan and SUV fleet for comfortable outstation journeys across Maharashtra."
          url="/fleet"
        />

        <header className="relative overflow-hidden border-b border-white/10 pb-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.055),transparent_28%)]" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white"
            >
              <FiArrowLeft /> Back
            </button>

            <div className="grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-500">RK vehicle directory</p>
                <h1 className="mt-4 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.04em] sm:text-7xl">
                  Choose the cabin.<br />
                  <span className="text-white/35">We handle the road.</span>
                </h1>
              </div>
              <div className="border-l border-orange-500 pl-5">
                <p className="max-w-md text-sm leading-relaxed text-white/55">
                  Every listed vehicle is cleaned, checked and assigned with a verified driver before dispatch.
                </p>
                <div className="mt-5 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.12em] text-white/65">
                  <span className="flex items-center gap-1.5"><FiCheckCircle className="text-orange-500" /> AC fleet</span>
                  <span className="flex items-center gap-1.5"><FiCheckCircle className="text-orange-500" /> Clear per-km rates</span>
                  <span className="flex items-center gap-1.5"><FiCheckCircle className="text-orange-500" /> 24/7 dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">Available vehicles</p>
            <p className="text-xs font-black text-orange-500">{String(cabs.length).padStart(2, '0')} cabs</p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cabs.map((cab, index) => (
              <FleetCard key={cab._id} cab={cab} index={index} onBook={bookCab} />
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Fleet;
