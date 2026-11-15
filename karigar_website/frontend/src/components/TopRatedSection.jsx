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
    <section className="py-12 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with City Filters (matching reference image) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[#FF8A00] text-xl">⭐</span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-extrabold text-[#0A1930]">
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
                    ? 'bg-[#0A1930] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:text-[#0A1930] border border-gray-200'
                }`}
              >
                {activeCity === city ? '📍 ' : ''}{city}
              </button>
            ))}

            <Link
              to={`/find-karigar?city=${activeCity}`}
              className="text-xs sm:text-sm font-bold text-[#0A1930] hover:text-[#FF8A00] ml-2 inline-flex items-center gap-1 whitespace-nowrap transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid (3 Professionals + 1 Map Preview Card) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          
          {/* 3 Karigar Cards (Clean White with borders & soft shadow) */}
          {currentCards.map((worker) => (
            <div
              key={worker.id}
              className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:border-[#FF8A00]/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between group"
            >
              {/* Worker Image with Badges */}
              <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Verified Badge */}
                <div className="absolute top-3 left-3 bg-[#0A1930] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={13} className="text-[#FF8A00]" />
                  <span>Verified</span>
                </div>

                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleFav(worker.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors cursor-pointer shadow-sm"
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
                  <h3 className="font-poppins font-bold text-[#0A1930] text-base sm:text-lg mb-1 group-hover:text-[#FF8A00] transition-colors">
                    {worker.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs mb-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-[#0A1930]">{worker.rating}</span>
                    <span className="text-gray-500">({worker.reviews} reviews)</span>
                  </div>

                  <p className="text-gray-500 text-xs flex items-center gap-1 mb-4 truncate">
                    <MapPin size={12} className="text-[#FF8A00] flex-shrink-0" />
                    <span>{worker.location}</span>
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">Starting from</span>
                    <span className="font-poppins font-bold text-[#0A1930] text-sm sm:text-base">{worker.startingPrice}</span>
                  </div>

                  <Link
                    to={`/find-karigar?service=${encodeURIComponent(worker.service)}&city=${activeCity}`}
                    className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 border border-gray-200 text-[#0A1930] hover:text-[#FF8A00] text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                  >
                    <span>View profile</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Card 4: Interactive City Map Card (Directly from Reference Image) */}
          <div className="bg-white border border-gray-200/90 rounded-2xl overflow-hidden hover:border-[#FF8A00]/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between relative group">
            
            <div className="relative h-full min-h-[300px] bg-[#E8ECEF] overflow-hidden flex items-center justify-center p-6 text-center">
              
              {/* Map Graphic View */}
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Karachi Map Overview"
                className="absolute inset-0 w-full h-full object-cover filter contrast-125"
              />
              <div className="absolute inset-0 bg-[#0A1930]/10" />

              {/* Pins on Map */}
              <div className="absolute top-1/4 left-1/4 animate-bounce">
                <div className="w-6 h-6 rounded-full bg-[#FF8A00] flex items-center justify-center shadow-lg">
                  <MapPin size={14} className="text-white fill-white" />
                </div>
              </div>

              <div className="absolute bottom-1/3 right-1/4 animate-pulse">
                <div className="w-5 h-5 rounded-full bg-[#FF8A00] flex items-center justify-center shadow-lg">
                  <MapPin size={12} className="text-white fill-white" />
                </div>
              </div>

              {/* Center Map Overlay Card */}
              <div className="relative z-10 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl max-w-[200px]">
                <h4 className="font-poppins font-bold text-[#0A1930] text-sm mb-0.5">
                  {activeCity}
                </h4>
                <p className="text-gray-500 text-[11px] mb-2 leading-tight">
                  Explore local businesses near you →
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/find-karigar?city=${activeCity}&view=map`)}
                  className="w-full bg-[#FF8A00] hover:bg-[#E67A00] text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg shadow transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Explore Map</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {/* Google Brand Tag & Expand */}
              <span className="absolute bottom-3 left-3 text-[11px] font-bold text-gray-500 bg-white/80 px-1.5 py-0.5 rounded shadow-sm">
                Google
              </span>

              <button
                type="button"
                onClick={() => navigate(`/find-karigar?city=${activeCity}&view=map`)}
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-[#0A1930] shadow"
                title="Expand map view"
              >
                <Expand size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges Strip (Clean White surface with icons from Reference Image) */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#102747] flex-shrink-0">
                <ShieldCheck size={22} className="text-[#102747]" />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1930] text-xs sm:text-sm">100% Verified</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs">Professionals</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
                <Zap size={22} className="text-[#FF8A00]" />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1930] text-xs sm:text-sm">Instant Booking</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs">& Support</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#102747] flex-shrink-0">
                <Headphones size={22} className="text-[#102747]" />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1930] text-xs sm:text-sm">24/7 Customer</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs">Support</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                <Shield size={22} className="text-emerald-600" />
              </div>
              <div>
                <h4 className="font-poppins font-bold text-[#0A1930] text-xs sm:text-sm">Secure Payments</h4>
                <p className="text-gray-500 text-[11px] sm:text-xs">& Safe Transactions</p>
              </div>
            </div>

          </div>
        </div>

        {/* Crown Promotional Banner (Dark Navy container matching Reference Image) */}
        <div className="bg-[#0A1930] border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#FF8A00]/15 flex items-center justify-center text-[#FF8A00] flex-shrink-0">
              <Crown size={26} />
            </div>
            <div>
              <h3 className="font-poppins font-bold text-white text-base sm:text-lg">
                Be a Professional on KarigarPK
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                Grow your business, get more customers.
              </p>
            </div>
          </div>

          <Link
            to="/register-karigar"
            className="bg-[#FF8A00] hover:bg-[#E67A00] text-white px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap shadow-md flex items-center gap-2 hover:scale-105 transition-all"
          >
            <span>Join Now</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}
