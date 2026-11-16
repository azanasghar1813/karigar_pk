import { createContext, useContext, useState, useEffect } from 'react'
import { CITIES } from '../config/site'

const CityContext = createContext()

export function CityProvider({ children }) {
  const [selectedCity, setSelectedCityState] = useState(() => {
    try {
      const saved = localStorage.getItem('karigar_selected_city')
      if (saved && CITIES.includes(saved)) {
        return saved
      }
    } catch {
      // ignore localStorage errors
    }
    return 'Karachi' // Reference default
  })

  const setSelectedCity = (city) => {
    if (CITIES.includes(city)) {
      setSelectedCityState(city)
      try {
        localStorage.setItem('karigar_selected_city', city)
      } catch {
        // ignore
      }
    }
  }

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity, cities: CITIES }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCity() {
  const context = useContext(CityContext)
  if (!context) {
    throw new Error('useCity must be used within a CityProvider')
  }
  return context
}

export default CityContext
