import { expect } from '@open-wc/testing';
import { validationService } from '../../src/services/validation-service.js';

describe('ValidationService', () => {
  it('should be defined', () => {
    expect(validationService).to.exist;
  });

  describe('Email validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'firstname+lastname@company.co.uk',
        'user123@domain123.com'
      ];

      validEmails.forEach(email => {
        expect(validationService.validateEmail(email)).to.be.true;
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain.',
        'user name@domain.com',
        ''
      ];

      invalidEmails.forEach(email => {
        expect(validationService.validateEmail(email)).to.be.false;
      });
    });
  });

  describe('Phone validation', () => {
    it('should validate correct phone numbers', () => {
      const validPhones = [
        '+1234567890',
        '+90 555 123 4567',
        '(555) 123-4567',
        '555-123-4567',
        '5551234567'
      ];

      validPhones.forEach(phone => {
        expect(validationService.validatePhone(phone)).to.be.true;
      });
    });

    it('should reject invalid phone numbers', () => {
      const invalidPhones = [
        'abc123',
        '123',
        '+',
        '++1234567890',
        ''
      ];

      invalidPhones.forEach(phone => {
        expect(validationService.validatePhone(phone)).to.be.false;
      });
    });
  });

  describe('Name validation', () => {
    it('should validate correct names', () => {
      const validNames = [
        'John',
        'Mary Jane',
        'Jean-Pierre',
        'O\'Connor',
        'José',
        'Müller'
      ];

      validNames.forEach(name => {
        expect(validationService.validateName(name)).to.be.true;
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        '',
        '123',
        'John123',
        'Name@domain',
        'Name!',
        '   '
      ];

      invalidNames.forEach(name => {
        expect(validationService.validateName(name)).to.be.false;
      });
    });
  });

  describe('Date validation', () => {
    it('should validate correct dates', () => {
      const validDates = [
        '2023-01-01',
        '1990-12-31',
        '2000-06-15'
      ];

      validDates.forEach(date => {
        expect(validationService.validateDate(date)).to.be.true;
      });
    });

    it('should reject invalid dates', () => {
      const invalidDates = [
        '',
        '2023-13-01',
        '2023-01-32',
        'invalid-date',
        '01/01/2023'
      ];

      invalidDates.forEach(date => {
        expect(validationService.validateDate(date)).to.be.false;
      });
    });

    it('should validate future dates when required', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];

      expect(validationService.validateDate(futureDateString, { future: true })).to.be.true;

      const pastDate = '1990-01-01';
      expect(validationService.validateDate(pastDate, { future: true })).to.be.false;
    });
  });

  describe('Required field validation', () => {
    it('should validate required fields', () => {
      expect(validationService.validateRequired('test')).to.be.true;
      expect(validationService.validateRequired('   test   ')).to.be.true;
    });

    it('should reject empty required fields', () => {
      expect(validationService.validateRequired('')).to.be.false;
      expect(validationService.validateRequired('   ')).to.be.false;
      expect(validationService.validateRequired(null)).to.be.false;
      expect(validationService.validateRequired(undefined)).to.be.false;
    });
  });
});
