import { useState, useEffect, useRef } from 'react';
import citiesData from '../data/cities.json';
import { motion, AnimatePresence } from 'framer-motion';

const CityAutocomplete = ({ value, onChange, placeholder, icon: Icon, iconColorClass = "text-black" }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = citiesData.filter(city =>
        city.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectCity = (cityName) => {
    onChange(cityName);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block ml-1">{placeholder}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 z-10 flex items-center justify-center">
            <Icon className={`text-lg ${iconColorClass}`} />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={`Enter ${placeholder.toLowerCase()}`}
          onFocus={() => {
            if (value && suggestions.length > 0) setIsOpen(true);
          }}
          className={`w-full h-12 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-semibold text-black placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-black focus:bg-white shadow-saas-inner transition-colors duration-200 ${Icon ? 'pl-11 pr-4' : 'px-4'}`}
          autoComplete="off"
        />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-50 w-full mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-saas-lg overflow-hidden"
          >
            <ul className="max-h-60 overflow-y-auto py-2">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectCity(city.name)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-500">{city.state.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black">{city.name}</span>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-0.5">{city.state}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CityAutocomplete;