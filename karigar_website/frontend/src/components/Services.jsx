import { useState, useEffect } from 'react'
import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../config/api'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/services')
      .then(res => {
        setServices(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch services:', err)
        setLoading(false)
      })
  }, [])


  return (
    <section className="py-10 sm:py-14 md:py-16 px-4 bg-field-general">
      <div className="container">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="font-poppins text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">Our Services</h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">
            Book any home service in Lahore — electrician, plumber, carpenter & more
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-full text-center py-10 text-slate-400">
              No services found.
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service._id}
                className="service-card group p-4 sm:p-6"
              >
                <div className="flex justify-end">
                  <span className="text-gray-300" title={service.description}>
                    <Info size={16} />
                  </span>
                </div>
                <div className="mb-3 text-secondary group-hover:scale-110 transition-transform text-4xl sm:text-5xl flex justify-center">
                  {service.icon || '🔧'}
                </div>
                <h3 className="font-poppins font-bold text-white text-base sm:text-lg mb-2">{service.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm">{service.description}</p>
                <Link
                  to={`/find-karigar?service=${service.name}`}
                  className="inline-block mt-3 sm:mt-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 border-secondary text-secondary text-sm sm:text-base font-semibold opacity-100 translate-y-0 md:opacity-0 md:translate-y-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 hover:bg-secondary hover:text-white transition-all duration-300"
                >
                  Book Now
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}