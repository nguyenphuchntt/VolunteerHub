/**
 * Unified Category Configuration
 * 
 * Key: Exact value expected by backend API
 * Label: Vietnamese (displayed in UI)
 */

export const CATEGORIES = {
  ENVIRONMENT: { key: 'Environment', label: 'Môi trường', icon: '🌱' },
  COMMUNITY_SERVICE: { key: 'Community Service', label: 'Cộng đồng', icon: '🤝' },
  EDUCATION: { key: 'Education', label: 'Giáo dục', icon: '📚' },
  HEALTH_WELLNESS: { key: 'Health & Wellness', label: 'Y tế', icon: '🏥' },
  ANIMAL_WELFARE: { key: 'Animal Welfare', label: 'Động vật', icon: '🐾' },
  OTHER: { key: 'Other', label: 'Khác', icon: '📌' },
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
 * @param {string} key - Category key (e.g., "Environment", "Community Service")
 * @returns {string} Vietnamese label or original key if not found
 */
export const getCategoryLabel = (key) => {
  if (!key) return 'Khác';

  // Find by key value
  const found = Object.values(CATEGORIES).find(cat => cat.key === key);
  if (found) return found.label;

  // Legacy mappings for old data
  const legacyMap = {
    'ENVIRONMENT': 'Môi trường',
    'EDUCATION': 'Giáo dục',
    'HEALTHCARE': 'Y tế',
    'CHARITY': 'Từ thiện',
    'COMMUNITY': 'Cộng đồng',
    'OTHER': 'Khác',
  };

  const upperKey = key.toUpperCase().replace(/\s+/g, '_').replace('&', '');
  return legacyMap[upperKey] || key;
};

/**
 * Get category icon
 */
export const getCategoryIcon = (key) => {
  if (!key || key === 'all') return '🌟';

  const found = Object.values(CATEGORIES).find(cat => cat.key === key);
  return found?.icon || '📌';
};
