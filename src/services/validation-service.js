import { VALIDATION_RULES, EMPLOYEE_OPTIONS, REGEX_PATTERNS } from '../config/constants.js';
import { calculateAge, isValidDate, addYears } from '../utils/date-utils.js';

/**
 * Validation service for employee data validation
 * Provides comprehensive validation for all employee fields with localized error messages
 */
class ValidationService {
  /**
   * Validates an employee object and returns validation errors
   * @param {Object} employee - The employee data to validate
   * @param {Object} options - Validation options
   * @param {boolean} options.isEditing - Whether this is an edit operation
   * @param {string} options.currentEmployeeId - Current employee ID (for edit operations)
   * @param {Array} options.existingEmployees - Array of existing employees for uniqueness checks
   * @returns {Object} Object containing validation errors
   */
  validateEmployee(employee, options = {}) {
    const errors = {};
    const { isEditing = false, currentEmployeeId = null, existingEmployees = [] } = options;

    // First Name validation
    const firstNameError = this.validateFirstName(employee.firstName);
    if (firstNameError) {
      errors.firstName = firstNameError;
    }

    // Last Name validation
    const lastNameError = this.validateLastName(employee.lastName);
    if (lastNameError) {
      errors.lastName = lastNameError;
    }

    // Email validation
    const emailError = this.validateEmail(employee.email, existingEmployees, isEditing, currentEmployeeId);
    if (emailError) {
      errors.email = emailError;
    }

    // Phone validation
    const phoneError = this.validatePhone(employee.phone);
    if (phoneError) {
      errors.phone = phoneError;
    }

    // Date of Birth validation
    const dateOfBirthError = this.validateDateOfBirth(employee.dateOfBirth);
    if (dateOfBirthError) {
      errors.dateOfBirth = dateOfBirthError;
    }

    // Date of Employment validation
    const dateOfEmploymentError = this.validateDateOfEmployment(employee.dateOfEmployment, employee.dateOfBirth);
    if (dateOfEmploymentError) {
      errors.dateOfEmployment = dateOfEmploymentError;
    }

    // Department validation
    const departmentError = this.validateDepartment(employee.department);
    if (departmentError) {
      errors.department = departmentError;
    }

    // Position validation
    const positionError = this.validatePosition(employee.position);
    if (positionError) {
      errors.position = positionError;
    }

    return errors;
  }

  /**
   * Validates first name
   * @param {string} firstName
   * @returns {string|null} Error message key or null if valid
   */
  validateFirstName(firstName) {
    if (!firstName || firstName.trim().length === 0) {
      return 'validation.firstNameRequired';
    }
    if (firstName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      return 'validation.firstNameTooShort';
    }
    if (firstName.trim().length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      return 'validation.firstNameTooLong';
    }
    if (!REGEX_PATTERNS.NAME.test(firstName.trim())) {
      return 'validation.firstNameInvalid';
    }
    return null;
  }

  /**
   * Validates last name
   * @param {string} lastName
   * @returns {string|null} Error message key or null if valid
   */
  validateLastName(lastName) {
    if (!lastName || lastName.trim().length === 0) {
      return 'validation.lastNameRequired';
    }
    if (lastName.trim().length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      return 'validation.lastNameTooShort';
    }
    if (lastName.trim().length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      return 'validation.lastNameTooLong';
    }
    if (!REGEX_PATTERNS.NAME.test(lastName.trim())) {
      return 'validation.lastNameInvalid';
    }
    return null;
  }

  /**
   * Validates email
   * @param {string} email
   * @param {Array} existingEmployees
   * @param {boolean} isEditing
   * @param {string} currentEmployeeId
   * @returns {string|null} Error message key or null if valid
   */
  validateEmail(email, existingEmployees = [], isEditing = false, currentEmployeeId = null) {
    if (!email || email.trim().length === 0) {
      return 'validation.emailRequired';
    }

    if (!REGEX_PATTERNS.EMAIL.test(email.trim())) {
      return 'validation.emailInvalid';
    }

    // Check for uniqueness
    const existingEmployee = existingEmployees.find(emp =>
      emp.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (existingEmployee) {
      // If editing, allow the same email for the current employee
      if (isEditing && existingEmployee.id === currentEmployeeId) {
        return null;
      }
      return 'validation.emailExists';
    }

    return null;
  }

  /**
   * Validates phone number
   * @param {string} phone
   * @returns {string|null} Error message key or null if valid
   */
  validatePhone(phone) {
    if (!phone || phone.trim().length === 0) {
      return 'validation.phoneRequired';
    }

    // Remove all non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length < VALIDATION_RULES.PHONE_MIN_DIGITS) {
      return 'validation.phoneTooShort';
    }
    if (cleanPhone.length > VALIDATION_RULES.PHONE_MAX_DIGITS) {
      return 'validation.phoneTooLong';
    }

    if (!REGEX_PATTERNS.PHONE.test(phone.trim())) {
      return 'validation.phoneInvalid';
    }

    return null;
  }

  /**
   * Validates date of birth
   * @param {string} dateOfBirth
   * @returns {string|null} Error message key or null if valid
   */
  validateDateOfBirth(dateOfBirth) {
    if (!dateOfBirth || dateOfBirth.trim().length === 0) {
      return 'validation.dateOfBirthRequired';
    }

    if (!isValidDate(dateOfBirth)) {
      return 'validation.dateOfBirthInvalid';
    }

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    // Check if date is in the future
    if (birthDate > today) {
      return 'validation.dateOfBirthFuture';
    }

    const age = calculateAge(dateOfBirth);

    // Check minimum age
    if (age < VALIDATION_RULES.MIN_AGE_YEARS) {
      return 'validation.dateOfBirthTooYoung';
    }

    // Check maximum age
    if (age > VALIDATION_RULES.MAX_AGE_YEARS) {
      return 'validation.dateOfBirthTooOld';
    }

    return null;
  }

  /**
   * Validates date of employment
   * @param {string} dateOfEmployment
   * @param {string} dateOfBirth
   * @returns {string|null} Error message key or null if valid
   */
  validateDateOfEmployment(dateOfEmployment, dateOfBirth) {
    if (!dateOfEmployment || dateOfEmployment.trim().length === 0) {
      return 'validation.dateOfEmploymentRequired';
    }

    if (!isValidDate(dateOfEmployment)) {
      return 'validation.dateOfEmploymentInvalid';
    }

    const employmentDate = new Date(dateOfEmployment);
    const today = new Date();

    // Check if date is too far in the future
    const maxFutureDate = addYears(today, VALIDATION_RULES.MAX_FUTURE_EMPLOYMENT_YEARS);
    if (employmentDate > maxFutureDate) {
      return 'validation.dateOfEmploymentTooFuture';
    }

    // Check if employment date is before birth date
    if (dateOfBirth && dateOfBirth.trim().length > 0 && isValidDate(dateOfBirth)) {
      const birthDate = new Date(dateOfBirth);
      if (employmentDate < birthDate) {
        return 'validation.dateOfEmploymentBeforeBirth';
      }
    }

    return null;
  }

  /**
   * Validates department
   * @param {string} department
   * @returns {string|null} Error message key or null if valid
   */
  validateDepartment(department) {
    if (!department || department.trim().length === 0) {
      return 'validation.departmentRequired';
    }

    if (!EMPLOYEE_OPTIONS.DEPARTMENTS.includes(department)) {
      return 'validation.departmentInvalid';
    }

    return null;
  }

  /**
   * Validates position
   * @param {string} position
   * @returns {string|null} Error message key or null if valid
   */
  validatePosition(position) {
    if (!position || position.trim().length === 0) {
      return 'validation.positionRequired';
    }

    if (!EMPLOYEE_OPTIONS.POSITIONS.includes(position)) {
      return 'validation.positionInvalid';
    }

    return null;
  }

  /**
   * Checks if validation errors object has any errors
   * @param {Object} errors
   * @returns {boolean}
   */
  hasErrors(errors) {
    return Object.keys(errors).length > 0;
  }
}

export const validationService = new ValidationService();
