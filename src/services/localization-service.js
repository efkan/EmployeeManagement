import { atom } from './nanostores-wrapper.js';
import { LANGUAGES, STORAGE_KEYS } from '../config/constants.js';

export const currentLanguage = atom(LANGUAGES.DEFAULT);
export const translations = atom({});

/**
 * Localization service for handling i18n
 * Manages language switching and translation loading
 */
class LocalizationService {
  constructor() {
    this.supportedLanguages = LANGUAGES.SUPPORTED;
    this.storageKey = STORAGE_KEYS.LANGUAGE;
    this.initialized = false;
    this.langObserver = null;
  }

  /**
   * Initialize the localization service
   */
  async init() {
    // First, check for saved language preference in localStorage
    let language = this.getSavedLanguage();

    // If no saved preference, fall back to HTML lang attribute
    if (!language) {
      const htmlLang = document.documentElement.lang || 'en';
      language = this.supportedLanguages.includes(htmlLang) ? htmlLang : 'en';
    }

    await this.setLanguage(language);

    // Watch for changes to the HTML lang attribute
    this.watchLanguageChanges();

    this.initialized = true;
  }

  /**
   * Watch for changes to the HTML lang attribute
   */
  watchLanguageChanges() {
    // Create a MutationObserver to watch for changes to the lang attribute
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const newLang = document.documentElement.lang;
          if (newLang && newLang !== this.getCurrentLanguage()) {
            console.log('HTML lang attribute changed to:', newLang);
            this.setLanguage(newLang);
          }
        }
      });
    });

    // Start observing the document element for attribute changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang']
    });

    this.langObserver = observer;
  }

  /**
   * Set the current language and load translations
   * @param {string} language - Language code (en, tr)
   */
  async setLanguage(language) {
    if (!this.supportedLanguages.includes(language)) {
      console.warn(`Language '${language}' not supported. Falling back to '${LANGUAGES.DEFAULT}'.`);
      language = LANGUAGES.DEFAULT;
    }

    try {
      const module = await import(`../localization/${language}.js`);
      translations.set(module.default);
      currentLanguage.set(language);
      document.documentElement.lang = language;

      // Save language preference to localStorage
      this.saveLanguage(language);
    } catch (error) {
      console.error(`Failed to load translations for language '${language}':`, error);
      // Fallback to English if loading fails
      if (language !== LANGUAGES.DEFAULT) {
        await this.setLanguage(LANGUAGES.DEFAULT);
      }
    }
  }

  /**
   * Get a translated string by key
   * @param {string} key - Translation key (e.g., 'employee.firstName')
   * @param {Object} replacements - Optional replacements for placeholders
   * @returns {string} Translated string
   */
  t(key, replacements = {}) {
    const currentTranslations = translations.get();
    const keys = key.split('.');
    let value = currentTranslations;

    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found`);
        return key; // Return the key as fallback
      }
    }

    // Replace placeholders if any
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, placeholder) => {
        return replacements[placeholder] || match;
      });
    }

    return value;
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return currentLanguage.get();
  }

  /**
   * Get supported languages
   * @returns {Array<string>} Array of supported language codes
   */
  getSupportedLanguages() {
    return [...this.supportedLanguages];
  }

  /**
   * Manually update language (useful for programmatic language switching)
   * @param {string} language - Language code
   */
  async updateLanguage(language) {
    await this.setLanguage(language);
  }

  /**
   * Save language preference to localStorage
   * @param {string} language - Language code to save
   */
  saveLanguage(language) {
    try {
      localStorage.setItem(this.storageKey, language);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  }

  /**
   * Get saved language preference from localStorage
   * @returns {string|null} Saved language code or null if not found
   */
  getSavedLanguage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved && this.supportedLanguages.includes(saved) ? saved : null;
    } catch (error) {
      console.error('Failed to load saved language preference:', error);
      return null;
    }
  }

  /**
   * Cleanup method to disconnect observers
   */
  cleanup() {
    if (this.langObserver) {
      this.langObserver.disconnect();
    }
  }

  /**
   * Reset service for testing
   */
  resetForTesting() {
    this.cleanup();
    this.initialized = false;
    currentLanguage.set('en');
    translations.set({});
  }
}

// Create singleton instance
export const localizationService = new LocalizationService();
