import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheckCircle, FiShield, FiUsers } from 'react-icons/fi';
import axiosInstance from '../utils/axiosInstance';
import { DEFAULT_CABS } from '../data/defaultData';
import SEOHead from '../components/SEOHead';
import PageTransition from '../components/PageTransition';

const CabDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cab, setCab] = useState(() => DEFAULT_CABS.find((item) => String(item._id) === String(id)) || null);
  const [loading, setLoading] = useState(!cab);

  useEffect(() => {
    let active = true;

    axiosInstance.get(`/cabs/${id}`)
      .then(({ data }) => {
        if (active && data) setCab(data);
      })
      .catch(() => {
        if (!active) return;
        const cached = JSON.parse(sessionStorage.getItem('cabsData') || '[]');
        setCab(cached.find((item) => String(item._id) === String(id)) || DEFAULT_CABS.find((item) => String(item._id) === String(id)) || null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleProceedToBook = () => {
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-orange-500" />
      </div>
    );
  }

  if (!cab) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-4 text-center text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">Vehicle unavailable</p>
        <h1 className="mt-3 text-3xl font-black">This cab could not be found.</h1>
        <button onClick={() => navigate('/fleet')} className="mt-6 rounded-xl bg-orange-500 px-6 py-3 text-sm font-black">Return to fleet</button>
      </div>
    );
  }

  const includedFeatures = cab.features?.length
    ? cab.features
    : ['GPS tracking', 'First aid kit', 'Clean interiors'];

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-950 pb-20 pt-28 text-white">
        <SEOHead
          title={`${cab.name} Cab Booking | RK Tours & Travels`}
          description={`Book a ${cab.name} with a verified driver for clear per-kilometre pricing.`}
          url={`/cab/${cab._id}`}
        />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-7 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/45 transition-colors hover:text-white"
          >
            <FiArrowLeft /> Back
          </button>

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-neutral-900 shadow-[0_28px_80px_rgba(0,0,0,0.36)] lg:grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-b border-white/10 bg-[#171717] p-8 lg:min-h-[560px] lg:border-b-0 lg:border-r">
              <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:38px_38px]" />
              <span className="absolute left-7 top-7 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] text-white/65">
                Ready to dispatch
              </span>
              <img
                src={cab.image || 'https://via.placeholder.com/600x400?text=Cab'}
                alt={cab.name}
                className="relative max-h-[360px] max-w-full object-contain drop-shadow-[0_24px_26px_rgba(0,0,0,0.45)]"
              />
              <p className="absolute bottom-6 left-7 text-[10px] font-black uppercase tracking-[0.2em] text-white/25">RK vehicle directory</p>
            </div>

            <div className="flex flex-col p-6 sm:p-9 lg:p-11">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">{cab.category || 'Premium'} class</p>
              <div className="mt-3 flex items-start justify-between gap-5">
                <div>
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{cab.name}</h1>
                  <p className="mt-2 text-sm font-semibold text-white/40">{cab.vehicleNumber || 'Vehicle assigned before dispatch'}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[8px] font-black uppercase tracking-[0.16em] text-white/35">Starts at</p>
                  <p className="mt-1 text-3xl font-black">&#8377;{cab.pricePerKm}<span className="text-xs text-white/40">/km</span></p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                <span className="flex min-h-14 items-center justify-center gap-2 border-r border-white/10 px-2 text-xs font-bold text-white/60"><FiUsers className="text-orange-500" /> {cab.seats} seats</span>
                <span className="flex min-h-14 items-center justify-center border-r border-white/10 px-2 text-xs font-bold text-white/60">{cab.fuelType || 'Diesel'}</span>
                <span className="flex min-h-14 items-center justify-center px-2 text-xs font-bold text-white/60">{cab.acStatus || 'AC'}</span>
              </div>

              <div className="mt-8">
                <h2 className="text-sm font-black uppercase tracking-[0.14em] text-white">Included with every ride</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {includedFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-sm font-semibold text-white/55">
                      <FiCheckCircle className="flex-shrink-0 text-orange-500" /> {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-auto">
                <button
                  type="button"
                  onClick={handleProceedToBook}
                  className="flex h-13 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black transition-colors hover:bg-orange-600"
                >
                  Book this cab <FiArrowRight />
                </button>
                <div className="flex h-13 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 text-xs font-bold text-white/60">
                  <FiShield className="text-orange-500" /> Safe ride
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CabDetails;
