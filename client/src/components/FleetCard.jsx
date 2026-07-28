import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiFilter, FiInfo, FiUsers } from 'react-icons/fi';

const FleetCard = ({ cab, index = 0, onBook }) => {
  const fleetNumber = String(index + 1).padStart(2, '0');

  return (
    <article
      data-motion-card="fleet"
      className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-white/10 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:border-orange-500/50"
    >
      <div className="relative h-52 overflow-hidden border-b border-white/10 bg-[#171717] p-5 sm:h-56">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.055),transparent_34%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
            Ready to dispatch
          </span>
          <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">
            {cab.acStatus || 'AC'}
          </span>
        </div>

        <img
          src={cab.image || 'https://via.placeholder.com/400x300?text=Cab'}
          alt={cab.name}
          className="relative z-[1] mx-auto mt-2 h-[145px] w-full object-contain drop-shadow-[0_20px_22px_rgba(0,0,0,0.45)] sm:h-[160px]"
        />

        <span className="absolute bottom-3 left-5 z-10 text-[10px] font-black tracking-[0.24em] text-white/30">
          RK / {fleetNumber}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500">
              {cab.category || 'Sedan'} class
            </p>
            <h3 className="mt-1 truncate text-xl font-black tracking-tight text-white">{cab.name}</h3>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/35">Starts at</p>
            <p className="mt-0.5 text-xl font-black text-white">
              &#8377;{cab.pricePerKm}
              <span className="text-[10px] font-semibold text-white/45">/km</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <span className="flex min-h-12 items-center justify-center gap-1.5 border-r border-white/10 px-2 text-[10px] font-bold text-white/60">
            <FiUsers className="text-orange-500" /> {cab.seats} seats
          </span>
          <span className="flex min-h-12 items-center justify-center gap-1.5 border-r border-white/10 px-2 text-[10px] font-bold text-white/60">
            <FiFilter className="text-orange-500" /> {cab.fuelType || 'Petrol'}
          </span>
          <span className="flex min-h-12 items-center justify-center gap-1.5 px-2 text-[10px] font-bold text-white/60">
            <FiCheck className="text-orange-500" /> Sanitised
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => onBook?.(cab)}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 text-sm font-black text-white transition-colors hover:bg-orange-600"
          >
            Book this cab <FiArrowRight />
          </button>
          <Link
            to={`/cab/${cab._id}`}
            aria-label={`View details for ${cab.name}`}
            className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors hover:border-orange-500/50 hover:text-orange-500"
          >
            <FiInfo />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default FleetCard;
