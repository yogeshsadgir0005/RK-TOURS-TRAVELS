const CabCard = ({ cab }) => {
  return (
    <div className="bg-neutral-800 rounded-xl shadow-md border border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-neutral-900 overflow-hidden relative">
        <img 
          src={cab.image || 'https://via.placeholder.com/400x200?text=Cab+Image'} 
          alt={cab.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
          {cab.seats} Seater
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2">{cab.name}</h3>
        <p className="text-gray-400 mb-4 text-sm">Comfortable and air-conditioned for your journey.</p>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-extrabold text-orange-500">&#8377;{cab.pricePerKm}</span>
            <span className="text-sm text-gray-500 font-medium"> / km</span>
          </div>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};
export default CabCard;