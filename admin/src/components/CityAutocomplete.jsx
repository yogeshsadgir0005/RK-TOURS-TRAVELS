import { useState, useEffect, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import citiesData from '../data/cities.json';

const CityAutocomplete = ({ value, onChange, placeholder, icon: Icon, iconColorClass }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown if user clicks outside of the component
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val); // Update the parent state immediately
    
    if (val.trim().length > 0) {
      // Filter cities: check if the city object's 'name' includes the typed text, limit to top 5
      const filtered = citiesData
        .filter(city => city.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectCity = (cityName) => {
    onChange(cityName); // Set the parent state to just the clicked city's name
    setShowSuggestions(false); // Hide the dropdown
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Icon */}
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
        {Icon && <Icon className={`${iconColorClass || 'text-gray-400'} text-lg`} />}
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        required
        value={value}
        onChange={handleChange}
        onFocus={() => {
          if (value.trim().length > 0 && suggestions.length > 0) setShowSuggestions(true);
        }}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 border border-gray-200/80 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b66f5] outline-none text-gray-700 bg-white transition-all text-sm font-medium placeholder-gray-400"
        autoComplete="off"
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl mt-2 max-h-60 overflow-hidden py-1">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelectCity(city.name)}
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#3b66f5] cursor-pointer transition-colors flex items-center justify-between"
            >
               <div className="flex items-center gap-2">
                 <FiMapPin className="text-gray-400 text-xs" /> 
                 <span>{city.name}</span>
               </div>
               <span className="text-[10px] text-gray-400 font-normal uppercase tracking-wider">{city.state}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;