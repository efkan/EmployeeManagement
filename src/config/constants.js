/**
 * Application constants and configuration
 */

// Employee validation constants
export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_MIN_DIGITS: 10,
  PHONE_MAX_DIGITS: 15,
  MIN_AGE_YEARS: 16,
  MAX_AGE_YEARS: 100,
  MAX_FUTURE_EMPLOYMENT_YEARS: 1
};

// Department and position options
export const EMPLOYEE_OPTIONS = {
  DEPARTMENTS: ['Analytics', 'Tech'],
  POSITIONS: ['Junior', 'Medior', 'Senior']
};

// Pagination settings
export const PAGINATION = {
  DEFAULT_ITEMS_PER_PAGE: 5,
  ITEMS_PER_PAGE_OPTIONS: [5, 10, 25, 50],
  MAX_VISIBLE_PAGES: 5
};

// Storage keys
export const STORAGE_KEYS = {
  EMPLOYEES: 'employeeManagement_employees',
  LANGUAGE: 'employeeManagement_language',
  VIEW_MODE: 'employeeManagement_viewMode',
  ITEMS_PER_PAGE: 'employeeManagement_itemsPerPage'
};

// Supported languages
export const LANGUAGES = {
  SUPPORTED: ['en', 'tr'],
  DEFAULT: 'en'
};

// View modes
export const VIEW_MODES = {
  TABLE: 'table',
  LIST: 'list'
};

// Regular expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,3}?[\s\-\(\)]?[\d\s\-\(\)]{6,14}$/,
  NAME: /^[a-zA-ZÀ-ÿĞğİıÖöŞşÜüÇç\s'-]+$/
};
