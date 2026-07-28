import { useState, useEffect, useRef } from 'react';
import citiesData from '../data/cities.json';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div;

const CityAutocomplete = ({ value, onChange, placeholder, icon: Icon, iconColorClass = "text-black", darkTheme = false }) => {
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
      <label className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 block ml-1 ${darkTheme ? 'text-white/80' : 'text-gray-500'}`}>{placeholder}</label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 sm:left-4 z-10 flex items-center justify-center">
            <Icon className={`text-base sm:text-lg ${iconColorClass}`} />
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
          className={`w-full h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-0 transition-colors duration-200 ${Icon ? 'pl-9 sm:pl-11 pr-3.5 sm:pr-4' : 'px-3.5 sm:px-4'} ${darkTheme ? 'bg-white border border-transparent text-neutral-900 placeholder-gray-500 focus:border-orange-500 shadow-md' : 'bg-gray-50/50 border border-gray-200 text-black placeholder-gray-400 focus:border-black focus:bg-white shadow-saas-inner'}`}
          autoComplete="off"
        />
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`absolute z-50 w-full mt-2 backdrop-blur-xl rounded-2xl shadow-saas-lg overflow-hidden ${darkTheme ? 'bg-neutral-900/95 border border-neutral-800' : 'bg-white/95 border border-gray-100'}`}
          >
            <ul className="max-h-60 overflow-y-auto py-2">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectCity(city.name)}
                  className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-colors border-b last:border-0 ${darkTheme ? 'hover:bg-neutral-800 border-neutral-800' : 'hover:bg-gray-50 border-gray-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkTheme ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                    <span className={`text-[10px] font-bold ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{city.state.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <span className={`block text-sm font-bold ${darkTheme ? 'text-white' : 'text-black'}`}>{city.name}</span>
                    <span className={`block text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${darkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{city.state}</span>
                  </div>
                </li>
              ))}
            </ul>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CityAutocomplete;