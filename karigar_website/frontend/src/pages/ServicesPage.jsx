import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Info } from 'lucide-react'
import api from '../config/api'

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState(null)
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
    <div>
      
      <div className="bg-gradient-to-br from-primary to-blue-900 text-white py-12 px-4">
        <div className="container">
          <h1 className="font-poppins text-4xl font-bold mb-4">All Services Available in Lahore</h1>
          <p className="text-gray-300 text-lg">
            Book any home service you need - electrician, plumber, carpenter and more
          </p>
        </div>
      </div>

      <div className="py-16 px-4 bg-field-general">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  onClick={() => setSelectedService(service._id)}
                  className="service-card cursor-pointer"
                >
                  <div className="flex justify-end text-gray-300" title="More Info">
                    <Info size={16} />
                  </div>
                  <div className="text-5xl mb-4">{service.icon || '🔧'}</div>
                  <h3 className="font-poppins text-xl font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  <Link
                    to={`/find-karigar?service=${service.name}`}
                    className="block w-full rounded-xl bg-secondary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md hover:bg-orange-600 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}