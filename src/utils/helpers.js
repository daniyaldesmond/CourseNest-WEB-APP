/**
 * Helper utility functions for CourseNest Online Learning Platform.
 */

/**
 * Format a number as currency (USD).
 * @param {number} amount - The amount to format.
 * @returns {string} - Formatted price.
 */
export const formatPrice = (amount) => {
  if (amount === undefined || amount === null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Extract initials from a user's name.
 * @param {string} name - User's full name.
 * @returns {string} - Initials (max 2 characters).
 */
export const getInitials = (name) => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format date values to relative/friendly readable strings.
 * @param {string|Date} dateVal - Date to represent.
 * @returns {string} - Relative date.
 */
export const formatDate = (dateVal) => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  if (isNaN(date.getTime())) return String(dateVal); // Fallback to raw string if it's already friendly e.g. "2 hours ago"
  
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 1) return 'Today';
  if (diffDays === 2) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Truncate long descriptions or texts.
 * @param {string} text - Raw text.
 * @param {number} limit - Character limit.
 * @returns {string} - Truncated text.
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};

/**
 * Format total minutes to hours and minutes string.
 * @param {number} minutes - Total minutes count.
 * @returns {string} - E.g. "2h 15m" or "45m".
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
};
