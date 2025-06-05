/**
 * Date utility functions for the employee management application
 */

/**
 * Formats a date string for display based on locale
 * @param {string} dateString - ISO date string
 * @param {string} locale - Locale code (e.g., 'en', 'tr')
 * @returns {string} Formatted date string
 */
export function formatDate(dateString, locale = 'en') {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toLocaleDateString(locale);
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Calculates age from date of birth
 * @param {string} dateOfBirth - ISO date string
 * @returns {number} Age in years
 */
export function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;

  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return 0;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Adjust age if birthday hasn't occurred this year yet
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return Math.max(0, age);
  } catch (error) {
    console.warn('Error calculating age:', error);
    return 0;
  }
}

/**
 * Checks if a date is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if date is valid
 */
export function isValidDate(dateString) {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch (error) {
    return false;
  }
}

/**
 * Gets today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Adds years to a date
 * @param {Date} date - Base date
 * @param {number} years - Years to add (can be negative)
 * @returns {Date} New date with years added
 */
export function addYears(date, years) {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + years);
  return newDate;
}
