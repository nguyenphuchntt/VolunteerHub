/**
 * Unified Category Configuration
 * 
 * Key: English (used for API)
 * Label: Vietnamese (displayed in UI)
 */

export const CATEGORIES = {
  ENVIRONMENT: { key: 'ENVIRONMENT', label: 'Môi trường', icon: '🌱' },
  EDUCATION: { key: 'EDUCATION', label: 'Giáo dục', icon: '📚' },
  HEALTHCARE: { key: 'HEALTHCARE', label: 'Y tế', icon: '🏥' },
  CHARITY: { key: 'CHARITY', label: 'Từ thiện', icon: '💝' },
  COMMUNITY: { key: 'COMMUNITY', label: 'Cộng đồng', icon: '🤝' },
  OTHER: { key: 'OTHER', label: 'Khác', icon: '📌' },
};

// Array format for filters and dropdowns
export const CATEGORY_LIST = [
  { id: 'all', key: 'all', label: 'Tất cả', icon: '🌟' },
  ...Object.values(CATEGORIES),
];

// Array for form dropdowns (without "all")
export const CATEGORY_OPTIONS = Object.values(CATEGORIES);

/**
 * Get Vietnamese label from category key
 * @param {string} key - Category key (e.g., "ENVIRONMENT", "Environment", "environment")
 * @returns {string} Vietnamese label or original key if not found
 */
export const getCategoryLabel = (key) => {
  if (!key) return 'Khác';
  const upperKey = key.toUpperCase().replace(/\s+/g, '_').replace('&', '');
  
  // Direct match
  if (CATEGORIES[upperKey]) {
    return CATEGORIES[upperKey].label;
  }
  
  // Legacy mappings
  const legacyMap = {
    'HEALTH_WELLNESS': 'Y tế',
    'HEALTHWELLNESS': 'Y tế',
    'COMMUNITY_SERVICE': 'Cộng đồng',
    'COMMUNITYSERVICE': 'Cộng đồng',
    'ANIMAL_WELFARE': 'Khác',
    'ANIMALWELFARE': 'Khác',
  };
  
  return legacyMap[upperKey] || key;
};

/**
 * Get category icon
 */
export const getCategoryIcon = (key) => {
  if (!key || key === 'all') return '🌟';
  const upperKey = key.toUpperCase();
  return CATEGORIES[upperKey]?.icon || '📌';
};
