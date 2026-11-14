import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Star, ShieldCheck, Heart, MapPin, ArrowRight, Expand, Crown, Headphones, Zap, Shield, CheckCircle } from 'lucide-react'

export default function TopRatedSection() {
  const [activeCity, setActiveCity] = useState('Karachi')
  const [favorites, setFavorites] = useState({})
  const navigate = useNavigate()

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Faisalabad']

  const cityShowcaseData = {
    Karachi: [
      {
        id: 'karachi-electrician-1',
        name: 'Al Mustafa Electrician',
        service: 'Electrician',
        rating: 4.9,
        reviews: '2.5k',
        location: 'Karachi, DHA Phase 6',
        startingPrice: 'PKR 500',
        image: '/assets/images/electrician_work.jpg',
        verified: true
      },
      {
        id: 'karachi-plumber-1',
        name: 'Quick Fix Plumbers',
        service: 'Plumber',
        rating: 4.8,
        reviews: '1.8k',
        location: 'Karachi, Gulshan-e-Iqbal',
        startingPrice: 'PKR 600',
        image: '/assets/images/plumber_sink.jpg',
        verified: true
      },
      {
        id: 'karachi-ac-1',
        name: 'Cool Tech AC Services',
        service: 'AC Repair',
        rating: 4.8,
        reviews: '1.2k',
        location: 'Karachi, Clifton',
        startingPrice: 'PKR 800',
        image: '/assets/images/ac_technician.jpg',
        verified: true
      }
    ],
    Lahore: [
      {
        id: 'lahore-electrician-1',
        name: 'Lahore Power Care',
        service: 'Electrician',
        rating: 4.9,
        reviews: '3.1k',
        location: 'Lahore, Gulberg III',
        startingPrice: 'PKR 500',
        image: '/assets/images/electrician_panel.jpg',
        verified: true
      },
      {
        id: 'lahore-plumber-1',
        name: 'Master Pipe Mechanics',
        service: 'Plumber',
        rating: 4.9,
        reviews: '2.1k',
        location: 'Lahore, DHA Phase 5',
        startingPrice: 'PKR 600',
        image: '/assets/images/plumber_pipes.jpg',
        verified: true
      },
      {
        id: 'lahore-ac-1',
        name: 'Model Town AC & Cool',
        service: 'AC Repair',
        rating: 4.8,
        reviews: '1.4k',
        location: 'Lahore, Model Town',
        startingPrice: 'PKR 750',
        image: '/assets/images/ac_technician.jpg',
        verified: true
      }
    ],
    Islamabad: [
      {
        id: 'isb-electrician-1',
        name: 'Capital Home Electric',
        service: 'Electrician',
        rating: 4.9,
        reviews: '1.9k',
        location: 'Islamabad, F-10 Markaz',
        startingPrice: 'PKR 700',
        image: '/assets/images/electrician_work.jpg',
        verified: true
      },
      {
        id: 'isb-plumber-1',
        name: 'Margalla Flow Plumbers',
        service: 'Plumber',
        rating: 4.8,
        reviews: '1.5k',
        location: 'Islamabad, G-11',
        startingPrice: 'PKR 650',
        image: '/assets/images/plumber_sink.jpg',
        verified: true
      },
      {
        id: 'isb-ac-1',
        name: 'Rawal AC Masters',
        service: 'AC Repair',
        rating: 4.7,
        reviews: '980',
        location: 'Islamabad, Blue Area',
        startingPrice: 'PKR 850',
        image: '/assets/images/ac_technician.jpg',
        verified: true
      }
    ],
    Faisalabad: [
      {
        id: 'fsd-electrician-1',
        name: 'Lyallpur Tech Care',
        service: 'Electrician',
        rating: 4.8,
        reviews: '1.1k',
        location: 'Faisalabad, D Ground',
        startingPrice: 'PKR 450',
        image: '/assets/images/electrician_panel.jpg',
        verified: true
      },
      {
        id: 'fsd-plumber-1',
        name: 'Al Madina Plumbing',
        service: 'Plumber',
        rating: 4.8,
        reviews: '850',
        location: 'Faisalabad, Peoples Colony',
        startingPrice: 'PKR 500',
        image: '/assets/images/plumber_sink.jpg',
        verified: true
      },
      {
        id: 'fsd-ac-1',
        name: 'Chenab Air Solution',
        service: 'AC Repair',
        rating: 4.7,
        reviews: '620',
        location: 'Faisalabad, Madina Town',
        startingPrice: 'PKR 700',
        image: '/assets/images/ac_technician.jpg',
        verified: true
      }
    ]
  }

  const currentCards = cityShowcaseData[activeCity] || cityShowcaseData.Karachi

  const toggleFav = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="py-14 sm:py-16 bg-[#0B1329] border-b border-[#1F2E54]/40">
      <div className="container mx-auto">
        
        {/* Section Header with City Filters (From Reference Image 1) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-secondary text-2xl">⭐</span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-white">
              Top-rated near you
            </h2>
          </div>

          {/* City Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setActiveCity(city)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeCity === city
                    ? 'bg-secondary text-white shadow-md shadow-orange-500/20'
                    : 'bg-[#131F3D] text-gray-300 hover:text-white border border-[#1F2E54]'
                }`}
              >
                📍 {city}
              </button>
            ))}

            <Link
              to={`/find-karigar?city=${activeCity}`}
              className="text-xs sm:text-sm font-bold text-secondary hover:text-orange-400 ml-2 inline-flex items-center gap-1 whitespace-nowrap"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid (3 Professionals + 1 Interactive Map Preview Card) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          
          {/* 3 Karigar Cards */}
          {currentCards.map((worker) => (
            <div
              key={worker.id}
              className="bg-[#131F3D] border border-[#1F2E54] rounded-2xl overflow-hidden hover:border-secondary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between group"
            >
              {/* Worker Image with Badges */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-800">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131F3D] via-transparent to-transparent opacity-80" />
                
                {/* Verified Badge */}
                <div className="absolute top-3 left-3 bg-[#0B1329]/90 border border-emerald-500/50 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 backdrop-blur-sm">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  <span>Verified</span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleFav(worker.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0B1329]/80 border border-white/10 flex items-center justify-center text-gray-300 hover:text-red-400 transition-colors cursor-pointer"
                  aria-label="Save to favorites"
                >
                  <Heart
                    size={15}
                    className={favorites[worker.id] ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-poppins font-bold text-white text-base sm:text-lg mb-1 group-hover:text-secondary transition-colors">
                    {worker.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs mb-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-white">{worker.rating}</span>
                    <span className="text-gray-400">({worker.reviews} reviews)</span>
                  </div>

                  <p className="text-gray-400 text-xs flex items-center gap-1 mb-4 truncate">
                    <MapPin size={12} className="text-secondary flex-shrink-0" />
                    <span>{worker.location}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1F2E54]/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Starting from</span>
                    <span className="font-poppins font-extrabold text-white text-sm sm:text-base text-secondary">{worker.startingPrice}</span>
                  </div>
                  
                  <Link
                    to={`/find-karigar?service=${encodeURIComponent(worker.service)}&city=${activeCity}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-secondary transition-colors group-hover:translate-x-0.5 duration-200"
                  >
                    <span>View profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Card 4: Interactive City Map Card (Directly from Reference Image 1) */}
          <div className="bg-[#131F3D] border border-[#1F2E54] rounded-2xl overflow-hidden hover:border-secondary/60 transition-all duration-300 shadow-card-dark flex flex-col justify-between relative group">
            
            {/* Styled Map Background with location pins */}
            <div className="relative h-full min-h-[220px] bg-[#0E1A33] overflow-hidden flex items-center justify-center p-6 text-center">
              
              {/* Map SVG Pattern Simulation */}
              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {/* Map Coastlines and Street lines simulation */}
              <svg className="absolute inset-0 w-full h-full text-blue-500/20" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,50 Q120,80 200,40 T400,90" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M50,0 Q80,120 40,200 T90,400" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M0,150 Q180,120 280,220" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4"/>
              </svg>

              {/* Pin 1 */}
              <div className="absolute top-1/4 left-1/4 animate-bounce">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-orange-500/50">
                  <MapPin size={14} className="text-white fill-white" />
                </div>
              </div>

              {/* Pin 2 */}
              <div className="absolute bottom-1/3 right-1/4 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50">
                  <MapPin size={12} className="text-white fill-white" />
                </div>
              </div>

              {/* Pin 3 */}
              <div className="absolute top-1/3 right-1/3">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              {/* Center Map Overlay Card (From Reference Image 1) */}
              <div className="relative z-10 bg-[#0B1329]/95 border border-[#1F2E54] rounded-2xl p-5 shadow-2xl backdrop-blur-md max-w-[240px]">
                <h4 className="font-poppins font-bold text-white text-base mb-1">
                  {activeCity}
                </h4>
                <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                  Explore verified local businesses and karigars near you
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/find-karigar?city=${activeCity}`)}
                  className="w-full bg-secondary hover:bg-secondary-dark text-white text-xs font-bold py-2 px-3 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explore on Map</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Expand Button */}
              <button
                type="button"
                onClick={() => navigate(`/find-karigar?city=${activeCity}`)}
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-[#0B1329] border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition-colors shadow"
                title="Expand map view"
              >
                <Expand size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip (Directly from Reference Image 1) */}
        <div className="bg-[#131F3D]/60 border border-[#1F2E54] rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-white text-xs sm:text-sm">100% Verified</h4>
                <p className="text-gray-400 text-[11px] sm:text-xs">CNIC & background checked</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary flex-shrink-0">
                <Zap size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-white text-xs sm:text-sm">Instant Booking</h4>
                <p className="text-gray-400 text-[11px] sm:text-xs">Quick response under 30m</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                <Headphones size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-white text-xs sm:text-sm">24/7 Support</h4>
                <p className="text-gray-400 text-[11px] sm:text-xs">Help whenever you need</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                <Shield size={22} />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-white text-xs sm:text-sm">Safe & Secure</h4>
                <p className="text-gray-400 text-[11px] sm:text-xs">Cash on delivery payments</p>
              </div>
            </div>

          </div>
        </div>

        {/* "Be a Professional on KarigarPK" CTA Banner Ribbon (From Reference Image 1) */}
        <div className="bg-gradient-to-r from-[#0F1E3D] via-[#152347] to-[#1A2E5E] border border-[#1F2E54] rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 text-secondary flex items-center justify-center flex-shrink-0">
              <Crown size={26} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-white text-base sm:text-lg">
                Be a Professional on KarigarPK
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Grow your business, increase your bookings & get more direct customers.
              </p>
            </div>
          </div>

          <Link
            to="/register-karigar"
            className="btn-secondary !px-6 !py-3 rounded-xl font-bold text-sm whitespace-nowrap shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>Join Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}
