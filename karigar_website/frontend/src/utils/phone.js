/**
 * Helper to validate if a phone number is a Pakistani mobile number.
 * Pakistani mobile numbers start with 03xx (11 digits) or +923xx / 923xx (12 digits).
 * Landlines (021, 042, 051, 041, etc.) CANNOT use WhatsApp.
 */
export function isPakistaniMobileNumber(phone) {
  if (!phone || typeof phone !== 'string') return false
  const clean = phone.replace(/\D/g, '')
  
  if (clean.startsWith('03') && clean.length === 11) return true
  if (clean.startsWith('923') && clean.length === 12) return true
  
  return false
}

/**
 * Clean phone to pure digits in international WhatsApp format (923xxxxxxxxx)
 */
export function getWhatsAppNumber(phone) {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  if (clean.startsWith('92')) return clean
  if (clean.startsWith('0')) return `92${clean.slice(1)}`
  return `92${clean}`
}

/**
 * Mask phone number for display if needed e.g. 0300-XXX-4567
 */
export function maskPhone(phone) {
  if (!phone) return ''
  const clean = phone.replace(/\D/g, '')
  if (clean.length >= 10) {
    const start = clean.slice(0, 4)
    const end = clean.slice(-4)
    return `${start}-XXX-${end}`
  }
  return phone
}
