import SEOHead from '../components/SEOHead';
import { FiMapPin, FiUsers, FiTarget, FiAward } from 'react-icons/fi';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <SEOHead 
        title="About Us" 
        description="Learn more about CabBook, India's leading intercity cab booking service." 
        url="/about" 
      />
      
      {/* Hero Section */}
      <section className="bg-black pt-32 pb-24 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
            About CabBook
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 font-medium max-w-2xl mx-auto">
            Making intercity travel safe, reliable, and affordable for everyone.
          </p>
        </div>
      </section>

      {/* Story & Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Content: Our Story */}
          <div className="pr-0 lg:pr-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6 tracking-tight">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>
                Founded in 2020, CabBook started with a simple mission: to make intercity cab travel as easy as booking a flight. We noticed that travelers struggled with unreliable drivers, hidden charges, and poor vehicle conditions.
              </p>
              <p>
                Today, we serve 100+ cities across India with a fleet of 10,000+ verified drivers and well-maintained vehicles. Our commitment to quality and transparency has made us one of the most trusted cab booking platforms.
              </p>
            </div>
          </div>

          {/* Right Content: Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-5">
                <FiMapPin size={26} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1 tracking-tight">100+</h3>
              <p className="text-sm text-gray-500 font-medium">Cities</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-5">
                <FiUsers size={26} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1 tracking-tight">10K+</h3>
              <p className="text-sm text-gray-500 font-medium">Drivers</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-5">
                <FiTarget size={26} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1 tracking-tight">500K+</h3>
              <p className="text-sm text-gray-500 font-medium">Rides</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-5">
                <FiAward size={26} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-black mb-1 tracking-tight">4.8/5</h3>
              <p className="text-sm text-gray-500 font-medium">Rating</p>
            </div>
          </div>

        </div>
      </section>

      {/* Mission, Vision, Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-xl font-bold text-black mb-4 tracking-tight">Our Mission</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To provide safe, comfortable, and affordable intercity cab services to every Indian traveler.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-xl font-bold text-black mb-4 tracking-tight">Our Vision</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              To become India's most trusted and technology-driven cab booking platform.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-black transition-colors duration-300">
            <h3 className="text-xl font-bold text-black mb-4 tracking-tight">Our Values</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Safety first, transparency in pricing, customer obsession, and continuous innovation.
            </p>
          </div>

        </div>
      </section>
      
    </div>
  );
};

export default About;