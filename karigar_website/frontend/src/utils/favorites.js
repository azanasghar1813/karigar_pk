// KarigarPK Global Saved Businesses & Favorites Storage

const STORAGE_KEY = 'karigar_saved_businesses'

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.warn('Error reading favorites:', err)
    return []
  }
}

export function isFavorite(id) {
  if (!id) return false
  const list = getFavorites()
  return list.some(item => item.id === id || item._id === id)
}

export function toggleFavorite(item, type = 'listing') {
  if (!item) return false
  const id = item._id || item.id
  if (!id) return false

  const list = getFavorites()
  const existsIndex = list.findIndex(f => (f.id || f._id) === id)

  let updatedList = []
  let nowFavorite = false

  if (existsIndex >= 0) {
    // Remove
    updatedList = list.filter(f => (f.id || f._id) !== id)
    nowFavorite = false
  } else {
    // Add
    const isKarigar = type === 'karigar' || item.type === 'karigar'
    const name = isKarigar ? (item.fullName || item.name || 'Verified Professional') : (item.name || 'Local Business')
    const service = isKarigar
      ? (Array.isArray(item.services) && item.services.length > 0 ? item.services[0] : (item.services || item.service || 'Service'))
      : (item.service || 'Local Service')
    const photo = isKarigar
      ? (item.profilePhoto || item.photo || '/assets/images/electrician_work.jpg')
      : (item.photos && item.photos.length > 0 ? item.photos[0] : (item.photo || '/assets/images/electrician_work.jpg'))
    const phone = item.phone || ''
    const city = item.city || 'Pakistan'
    const area = item.area || ''
    const rating = item.rating || 0
    const hourlyRate = item.hourlyRate || (isKarigar ? 500 : null)

    const savedRecord = {
      id,
      _id: id,
      type: isKarigar ? 'karigar' : 'listing',
      name,
      service,
      photo,
      phone,
      city,
      area,
      rating,
      hourlyRate,
      savedAt: new Date().toISOString()
    }

    updatedList = [savedRecord, ...list]
    nowFavorite = true
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
    window.dispatchEvent(new Event('karigar_favorites_changed'))
  } catch (err) {
    console.warn('Error saving favorites to localStorage:', err)
  }

  return nowFavorite
}

export function removeFavorite(id) {
  if (!id) return
  const list = getFavorites()
  const updatedList = list.filter(f => (f.id || f._id) !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
    window.dispatchEvent(new Event('karigar_favorites_changed'))
  } catch (err) {
    console.warn('Error removing favorite:', err)
  }
}
