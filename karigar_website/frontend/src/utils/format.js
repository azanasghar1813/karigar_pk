// phoneFormatter.js
export const formatPhone = (phoneStr) => {
  if (!phoneStr) return '';
  
  // Strip all non-numeric characters
  const cleaned = phoneStr.replace(/\D/g, '');
  
  // Handle local numbers (e.g., 03001234567) and international ones (923001234567)
  let normalized = cleaned;
  if (normalized.startsWith('92') && normalized.length === 12) {
    normalized = '0' + normalized.slice(2);
  } else if (normalized.length === 10 && !normalized.startsWith('0')) {
    // If someone entered 3001234567
    normalized = '0' + normalized;
  }
  
  // Format as 03XX XXXXXXX
  if (normalized.length === 11 && normalized.startsWith('03')) {
    return `${normalized.slice(0, 4)} ${normalized.slice(4)}`;
  }
  
  return phoneStr; // Return original if it doesn't match standard Pakistani format
};

export const getTelLink = (phoneStr) => {
  if (!phoneStr) return '#';
  const cleaned = phoneStr.replace(/\D/g, '');
  
  let normalized = cleaned;
  if (normalized.startsWith('0') && normalized.length === 11) {
    normalized = '92' + normalized.slice(1);
  }
  
  return `tel:+${normalized}`;
};
