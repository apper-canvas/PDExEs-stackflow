import { formatDistanceToNow } from 'date-fns';

/**
 * Formats a timestamp into a human-readable relative time string
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {Object} options - Formatting options
 * @param {boolean} options.addSuffix - Whether to add "ago" suffix (default: true)
 * @param {boolean} options.includeSeconds - Whether to include seconds in very recent times (default: true)
 * @returns {string} - Formatted relative time string (e.g., "5 minutes ago", "2 days ago", "just now")
 */
export const formatRelativeTime = (timestamp, options = {}) => {
  const {
    addSuffix = true,
    includeSeconds = true
  } = options;

  // Convert Unix timestamp (seconds) to JavaScript Date object
  const date = new Date(timestamp * 1000);
  
  // Calculate seconds difference for "just now" handling
  const secondsDiff = Math.floor((Date.now() - date.getTime()) / 1000);
  
  // Return "just now" for very recent timestamps (less than 30 seconds ago)
  if (includeSeconds && secondsDiff < 30) {
    return 'just now';
  }
  
  // Use formatDistanceToNow from date-fns to generate relative time
  return formatDistanceToNow(date, { 
    addSuffix,
    includeSeconds 
  });
};