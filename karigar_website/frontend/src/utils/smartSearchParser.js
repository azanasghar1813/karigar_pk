// KarigarPK Smart Search Natural Language Parser

import { SERVICES_CONFIG, CITIES, CITY_AREAS } from '../config/site.js'

// Common Urdu / English prepositions and noise words
const NOISE_WORDS = new Set([
  'mein', 'me', 'in', 'at', 'near', 'se', 'ka', 'ki', 'ke', 'ko', 'wali', 'wala', 'walay', 'for', 'the', 'a', 'an'
])

// Category alias dictionary
const CATEGORY_ALIASES = [
  { match: ['electrician', 'bijli', 'electric', 'wiring', 'ups'], searchKey: 'Electrician', label: 'Electrician' },
  { match: ['plumber', 'plumbing', 'pipe', 'leakage', 'nal', 'motor'], searchKey: 'Plumber', label: 'Plumber' },
  { match: ['ac', 'ac repair', 'cooling', 'air conditioner', 'ac service'], searchKey: 'AC Repair', label: 'AC & Cooling' },
  { match: ['cleaning', 'cleaner', 'safai', 'deep cleaning', 'sofa cleaning'], searchKey: 'Cleaner', label: 'Cleaning' },
  { match: ['carpenter', 'carpentry', 'wood', 'furniture', 'lakri'], searchKey: 'Carpenter', label: 'Carpentry' },
  { match: ['painter', 'paint', 'rang', 'painting', 'distemper'], searchKey: 'Painter', label: 'Painting' },
  { match: ['auto', 'mechanic', 'car repair', 'car', 'gari', 'motorcycle', 'bike'], searchKey: 'Auto Services', label: 'Auto Services' },
  { match: ['beauty', 'salon', 'parlour', 'haircut', 'makeup', 'grooming'], searchKey: 'Beauty', label: 'Beauty & Salon' },
  { match: ['cctv', 'camera', 'security camera'], searchKey: 'CCTV Installation', label: 'CCTV Installation' },
  { match: ['locksmith', 'lock', 'chabi', 'tala'], searchKey: 'Locksmith', label: 'Locksmith' },
  { match: ['appliance', 'fridge', 'washing machine', 'microwave', 'oven'], searchKey: 'Appliance Repair', label: 'Appliance Repair' },
  { match: ['restaurant', 'food', 'cafe', 'khana', 'catering'], searchKey: 'Restaurants', label: 'Restaurants' },
  { match: ['home repair', 'handyman', 'maintenance', 'marammat'], searchKey: 'General Repair', label: 'Home Repair' }
]

// All known areas compiled from site configuration
const KNOWN_AREAS = [
  'DHA Phase 5', 'DHA Phase 6', 'DHA Phase 2', 'DHA',
  'Gulberg', 'Model Town', 'Johar Town', 'Bahria Town', 'Cantt',
  'Faisal Town', 'Wapda Town', 'Allama Iqbal Town', 'Clifton',
  'Gulshan-e-Iqbal', 'North Nazimabad', 'PECHS', 'Gulistan-e-Johar',
  'Federal B Area', 'Korangi', 'Saddar', 'F-6', 'F-7', 'F-8', 'F-10', 'F-11',
  'G-9', 'G-11', 'E-7', 'Civil Lines', 'Madina Town', 'D Ground', 'Peoples Colony',
  'Gulgasht Colony', 'Bosan Road', 'Shah Rukn-e-Alam', 'Satellite Town', 'Westridge',
  'Hayatabad', 'University Town', 'DC Colony'
]

/**
 * Parses user search query string into structured filter updates and chips.
 * @param {string} input - User typed search string
 * @param {Array} availableAreas - Optional dynamic area list from /api/listings/areas
 * @returns {Object} { filters, chips, remainingQuery }
 */
export function parseSmartSearch(input, availableAreas = []) {
  if (!input || typeof input !== 'string') {
    return { filters: {}, chips: [], remainingQuery: '' }
  }

  let text = input.trim()
  if (!text) {
    return { filters: {}, chips: [], remainingQuery: '' }
  }

  const chips = []
  const filterUpdates = {}

  // 1. "near me" / "qareeb" -> Radar View
  const radarPattern = /\b(near me|nearby|qareeb|aas paas)\b/i
  if (radarPattern.test(text)) {
    filterUpdates.viewMode = 'radar'
    chips.push({ id: 'radar', label: 'Near Me (Radar)', type: 'viewMode', value: 'radar' })
    text = text.replace(radarPattern, ' ')
  }

  // 2. "available today" / "available now" -> availableNow
  const availablePattern = /\b(available today|available now|online|abhi|dastiyab)\b/i
  if (availablePattern.test(text)) {
    filterUpdates.availableNow = true
    chips.push({ id: 'availableNow', label: 'Available Today', type: 'filter', key: 'availableNow', value: true })
    text = text.replace(availablePattern, ' ')
  }

  // 3. Price constraints:
  // "under Rs 1000", "under 1000", "below 800", "less than 500"
  const priceNumberMatch = text.match(/\b(?:under|below|less than|kam az kam|max)?\s*(?:rs\.?|pkr)?\s*(\d{3,5})\s*(?:se kam|tak|rs|pkr)?\b/i)
  if (priceNumberMatch && priceNumberMatch[1]) {
    const maxVal = parseInt(priceNumberMatch[1], 10)
    if (maxVal >= 100 && maxVal <= 20000) {
      filterUpdates.priceMax = maxVal
      chips.push({ id: 'priceMax', label: `Under Rs ${maxVal}`, type: 'filter', key: 'priceMax', value: maxVal })
      text = text.replace(priceNumberMatch[0], ' ')
    }
  }

  // "sasta", "saste", "cheap", "cheapest", "lowest price"
  const cheapPattern = /\b(sasta|saste|sasti|cheap|cheapest|low price|kam qeemat)\b/i
  if (cheapPattern.test(text)) {
    filterUpdates.sort = 'price_asc'
    chips.push({ id: 'sort_price', label: 'Lowest Price (Sasta)', type: 'filter', key: 'sort', value: 'price_asc' })
    text = text.replace(cheapPattern, ' ')
  }

  // 4. "best", "top rated", "top", "behtareen", "5 star" -> minRating 4.5 / sort
  const topRatedPattern = /\b(best|top rated|top-rated|top|behtareen|accha|ache|5 star|high rated)\b/i
  if (topRatedPattern.test(text)) {
    filterUpdates.minRating = 4.5
    filterUpdates.sort = 'rating'
    chips.push({ id: 'rating', label: 'Top Rated (4.5★+)', type: 'filter', key: 'minRating', value: 4.5 })
    text = text.replace(topRatedPattern, ' ')
  }

  // 5. Category Matching (electrician, plumber, ac repair, etc.)
  for (const cat of CATEGORY_ALIASES) {
    const sortedKeywords = [...cat.match].sort((a, b) => b.length - a.length)
    for (const kw of sortedKeywords) {
      const reg = new RegExp(`\\b${kw}\\b`, 'i')
      if (reg.test(text)) {
        filterUpdates.service = cat.searchKey
        chips.push({ id: 'service', label: cat.label, type: 'service', value: cat.searchKey })
        text = text.replace(reg, ' ')
        break
      }
    }
    if (filterUpdates.service) break
  }

  // 6. City / Area Matching
  // Check CITIES first
  for (const c of CITIES) {
    const cityReg = new RegExp(`\\b${c}\\b`, 'i')
    if (cityReg.test(text)) {
      filterUpdates.city = c
      chips.push({ id: 'city', label: c, type: 'city', value: c })
      text = text.replace(cityReg, ' ')
      break
    }
  }

  // Check Areas (combining availableAreas + KNOWN_AREAS)
  const combinedAreasList = [
    ...availableAreas.map(a => (typeof a === 'string' ? a : a.area || a.name)),
    ...KNOWN_AREAS
  ].filter(Boolean)

  // Sort areas by length descending so "DHA Phase 5" matches before "DHA"
  combinedAreasList.sort((a, b) => b.length - a.length)

  for (const aName of combinedAreasList) {
    if (!aName || aName === 'All Areas') continue
    const areaReg = new RegExp(`\\b${aName}\\b`, 'i')
    if (areaReg.test(text)) {
      filterUpdates.area = aName
      chips.push({ id: 'area', label: aName, type: 'area', value: aName })
      text = text.replace(areaReg, ' ')
      break
    }
  }

  // 7. Clean up remaining query text
  const cleanTokens = text
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t && !NOISE_WORDS.has(t.toLowerCase()))

  const remainingQuery = cleanTokens.join(' ')

  return {
    filters: filterUpdates,
    chips,
    remainingQuery
  }
}
