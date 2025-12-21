/**
 * URL utilities for building SEO-friendly event URLs
 * Uses slug-id pattern: /events/{slug}-{eventId}
 */

/**
 * Generates a URL-friendly slug from text
 * Handles Vietnamese characters by removing diacritics
 * @param {string} text - The input text
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  
  // Vietnamese character mapping
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
    'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
    'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
    'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
    'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
    'Đ': 'D'
  };

  let slug = text
    .split('')
    .map(char => vietnameseMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/[^\w-]/g, '')    // Remove non-word characters
    .replace(/-+/g, '-')       // Replace multiple hyphens
    .replace(/^-|-$/g, '');    // Remove leading/trailing hyphens

  return slug;
};

/**
 * Builds an event URL with slug and ID
 * @param {object} event - Event object with eventId and optionally title/slug
 * @returns {string} - URL path like "/events/chuong-trinh-123"
 */
export const buildEventUrl = (event) => {
  if (!event) return '/explore';
  
  const eventId = event.eventId || event.id;
  const slug = event.slug || generateSlug(event.title);
  
  if (!eventId) return '/explore';
  if (!slug) return `/events/${eventId}`;
  
  return `/events/${slug}-${eventId}`;
};

/**
 * Extracts event ID from a slug-id URL parameter
 * Handles both "slug-123" format and plain "123" format
 * @param {string} identifier - The slug-id string from URL params
 * @returns {string|null} - The extracted event ID
 */
export const extractEventIdFromSlug = (identifier) => {
  if (!identifier) return null;
  
  // Try to parse as plain number first
  if (/^\d+$/.test(identifier)) {
    return identifier;
  }
  
  // Extract ID from "slug-123" format
  const match = identifier.match(/-(\d+)$/);
  return match ? match[1] : null;
};

/**
 * Builds a manage event URL with slug and ID
 * @param {object} event - Event object
 * @returns {string} - URL path like "/manage/events/chuong-trinh-123"
 */
export const buildManageEventUrl = (event) => {
  if (!event) return '/manage/events';
  
  const eventId = event.eventId || event.id;
  const slug = event.slug || generateSlug(event.title);
  
  if (!eventId) return '/manage/events';
  if (!slug) return `/manage/events/${eventId}`;
  
  return `/manage/events/${slug}-${eventId}`;
};

/**
 * Builds an edit event URL with slug and ID  
 * @param {object} event - Event object
 * @returns {string} - URL path like "/manage/events/chuong-trinh-123/edit"
 */
export const buildEditEventUrl = (event) => {
  if (!event) return '/manage/events';
  
  const eventId = event.eventId || event.id;
  const slug = event.slug || generateSlug(event.title);
  
  if (!eventId) return '/manage/events';
  if (!slug) return `/manage/events/${eventId}/edit`;
  
  return `/manage/events/${slug}-${eventId}/edit`;
};
