import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CITY_COORDINATES } from '../config/site'

// Custom branded orange map pin icon using L.divIcon
const createCustomPin = (isFeatured = false) => {
  const size = isFeatured ? 36 : 28
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: #FF7A00;
        border: 2px solid #FFFFFF;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 10px rgba(10,31,68,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size]
  })
}

export default function MapView({
  city = 'Karachi',
  center = null,
  zoom = null,
  markers = [],
  onMarkerClick = null,
  selectedMarkerId = null,
  className = 'h-full w-full rounded-2xl',
  popupText = null
}) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersGroupRef = useRef(null)

  const cityData = CITY_COORDINATES[city] || CITY_COORDINATES['Karachi']
  const targetLat = center?.lat || cityData.lat
  const targetLng = center?.lng || cityData.lng
  const targetZoom = zoom || cityData.zoom || 12

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize Leaflet Map instance
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [targetLat, targetLng],
        zoom: targetZoom,
        zoomControl: false,
        attributionControl: false
      })

      // Standard OSM Tile Layer with clear daylight styling
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      // Add zoom control top-right
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
      markersGroupRef.current = L.layerGroup().addTo(map)
    } else {
      mapInstanceRef.current.setView([targetLat, targetLng], targetZoom, { animate: true })
    }
  }, [city, targetLat, targetLng, targetZoom])

  // Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return

    markersGroupRef.current.clearLayers()

    // If custom markers passed, render them
    if (markers && markers.length > 0) {
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return
        const isSelected = selectedMarkerId && (selectedMarkerId === m.id || selectedMarkerId === m._id)
        const pin = L.marker([m.lat, m.lng], { icon: createCustomPin(isSelected) })

        if (m.name || m.title) {
          const popupContent = `
            <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 140px;">
              <p style="font-weight: 700; font-size: 13px; color: #0A1F44; margin-bottom: 2px;">
                ${m.name || m.title}
              </p>
              ${m.service ? `<p style="font-size: 11px; color: #5A6B84; margin-bottom: 4px;">${m.service}</p>` : ''}
              ${m.price ? `<p style="font-weight: 700; font-size: 12px; color: #FF7A00;">Starting PKR ${m.price}</p>` : ''}
            </div>
          `
          pin.bindPopup(popupContent)
        }

        pin.on('click', () => {
          if (onMarkerClick) onMarkerClick(m)
        })

        markersGroupRef.current.addLayer(pin)
      })
    } else {
      // Default pin in the city center if no markers passed
      const defaultPin = L.marker([targetLat, targetLng], { icon: createCustomPin(true) })
      if (popupText) {
        defaultPin.bindPopup(`<b>${popupText}</b>`).openPopup()
      }
      markersGroupRef.current.addLayer(defaultPin)
    }
  }, [markers, targetLat, targetLng, popupText, selectedMarkerId, onMarkerClick])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[180px] z-0" />
    </div>
  )
}
