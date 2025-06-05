import { expect } from '@open-wc/testing';
import { localizationService } from '../../src/services/localization-service.js';

describe('LocalizationService', () => {
  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.removeItem('employeeManagement_language');
    // Reset HTML lang attribute
    document.documentElement.lang = 'en';
    // Reset the service for clean test state
    localizationService.resetForTesting();
  });

  afterEach(() => {
    // Clean up any observers
    localizationService.cleanup();
  });

  describe('initialization', () => {
    it('should initialize with saved language preference from localStorage', async () => {
      localStorage.setItem('employeeManagement_language', 'tr');
      await localizationService.init();
      expect(localizationService.getCurrentLanguage()).to.equal('tr');
    });

    it('should fallback to HTML lang attribute when no saved preference', async () => {
      document.documentElement.lang = 'tr';
      await localizationService.init();
      expect(localizationService.getCurrentLanguage()).to.equal('tr');
    });

    it('should fallback to English for unsupported languages', async () => {
      document.documentElement.lang = 'fr';
      await localizationService.init();
      expect(localizationService.getCurrentLanguage()).to.equal('en');
    });

    it('should prefer saved language over HTML lang attribute', async () => {
      localStorage.setItem('employeeManagement_language', 'en');
      document.documentElement.lang = 'tr';
      await localizationService.init();
      expect(localizationService.getCurrentLanguage()).to.equal('en');
    });
  });

  describe('setLanguage', () => {
    it('should set language to Turkish and save to localStorage', async () => {
      await localizationService.setLanguage('tr');
      expect(localizationService.getCurrentLanguage()).to.equal('tr');
      expect(localStorage.getItem('employeeManagement_language')).to.equal('tr');
    });

    it('should set language to English and save to localStorage', async () => {
      await localizationService.setLanguage('en');
      expect(localizationService.getCurrentLanguage()).to.equal('en');
      expect(localStorage.getItem('employeeManagement_language')).to.equal('en');
    });

    it('should fallback to English for invalid language and save to localStorage', async () => {
      await localizationService.setLanguage('invalid');
      expect(localizationService.getCurrentLanguage()).to.equal('en');
      expect(localStorage.getItem('employeeManagement_language')).to.equal('en');
    });
  });

  describe('localStorage persistence', () => {
    it('should save language to localStorage', () => {
      localizationService.saveLanguage('tr');
      expect(localStorage.getItem('employeeManagement_language')).to.equal('tr');
    });

    it('should load saved language from localStorage', () => {
      localStorage.setItem('employeeManagement_language', 'tr');
      const saved = localizationService.getSavedLanguage();
      expect(saved).to.equal('tr');
    });

    it('should return null for unsupported saved language', () => {
      localStorage.setItem('employeeManagement_language', 'fr');
      const saved = localizationService.getSavedLanguage();
      expect(saved).to.be.null;
    });

    it('should return null when no language is saved', () => {
      const saved = localizationService.getSavedLanguage();
      expect(saved).to.be.null;
    });
  });

  describe('translation (t)', () => {
    beforeEach(async () => {
      // Load English translations for translation tests
      await localizationService.setLanguage('en');
    });

    it('should return nested translation', () => {
      const result = localizationService.t('employee.firstName');
      expect(result).to.equal('First Name');
    });

    it('should return key as fallback for invalid key', () => {
      const result = localizationService.t('invalid.key');
      expect(result).to.equal('invalid.key');
    });

    it('should handle deeply nested keys', () => {
      const result = localizationService.t('nav.employees');
      expect(result).to.equal('Employees');
    });
  });

  describe('getSupportedLanguages', () => {
    it('should return array of supported languages', () => {
      const languages = localizationService.getSupportedLanguages();
      expect(languages).to.deep.equal(['en', 'tr']);
    });
  });

  describe('getCurrentLanguage', () => {
    it('should return current language', async () => {
      await localizationService.setLanguage('tr');
      expect(localizationService.getCurrentLanguage()).to.equal('tr');
    });
  });
});
