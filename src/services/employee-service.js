import { atom } from './nanostores-wrapper.js';
import { STORAGE_KEYS, VIEW_MODES, PAGINATION } from '../config/constants.js';

// Nanostores atoms for reactive state management
export const employees = atom([]);
export const selectedEmployee = atom(null);
export const isLoading = atom(false);
export const viewMode = atom(VIEW_MODES.TABLE);
export const itemsPerPage = atom(PAGINATION.DEFAULT_ITEMS_PER_PAGE);

/**
 * Employee service for CRUD operations and state management
 * Handles all employee data operations with localStorage persistence
 */
class EmployeeService {
  constructor() {
    this.storageKey = STORAGE_KEYS.EMPLOYEES;
    this.viewModeStorageKey = STORAGE_KEYS.VIEW_MODE;
    this.itemsPerPageStorageKey = STORAGE_KEYS.ITEMS_PER_PAGE;

    this._initializeData();
  }

  /**
   * Initialize all data from localStorage
   * @private
   */
  _initializeData() {
    this.loadFromStorage();
    this.loadViewModeFromStorage();
    this.loadItemsPerPageFromStorage();
  }

  /**
   * Load employees from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsedEmployees = JSON.parse(stored);
        employees.set(parsedEmployees);
      } else {
        // Load sample data if no data exists
        this.loadSampleData();
      }
    } catch (error) {
      console.error('Failed to load employees from storage:', error);
      // Load sample data as fallback
      this.loadSampleData();
    }
  }

  /**
   * Load sample data for demonstration
   */
  loadSampleData() {
    const sampleEmployees = [
      {
        id: 'emp1',
        firstName: 'Ahmet',
        lastName: 'Sourtimes',
        email: 'ahmet@sourtimes.org',
        phone: '+90 532 123 45 67',
        dateOfEmployment: '2022-09-23',
        dateOfBirth: '1990-01-15',
        department: 'Analytics',
        position: 'Junior',
        createdAt: '2022-09-23T00:00:00.000Z',
        updatedAt: '2022-09-23T00:00:00.000Z'
      },
      {
        id: 'emp2',
        firstName: 'Mehmet',
        lastName: 'Yılmaz',
        email: 'mehmet.yilmaz@company.com',
        phone: '+90 532 234 56 78',
        dateOfEmployment: '2022-08-15',
        dateOfBirth: '1988-05-10',
        department: 'Analytics',
        position: 'Junior',
        createdAt: '2022-08-15T00:00:00.000Z',
        updatedAt: '2022-08-15T00:00:00.000Z'
      },
      {
        id: 'emp3',
        firstName: 'Ayşe',
        lastName: 'Kaya',
        email: 'ayse.kaya@company.com',
        phone: '+90 532 345 67 89',
        dateOfEmployment: '2022-07-10',
        dateOfBirth: '1992-03-22',
        department: 'Analytics',
        position: 'Junior',
        createdAt: '2022-07-10T00:00:00.000Z',
        updatedAt: '2022-07-10T00:00:00.000Z'
      },
      {
        id: 'emp4',
        firstName: 'Can',
        lastName: 'Demir',
        email: 'can.demir@company.com',
        phone: '+90 532 456 78 90',
        dateOfEmployment: '2022-06-05',
        dateOfBirth: '1991-07-30',
        department: 'Analytics',
        position: 'Junior',
        createdAt: '2022-06-05T00:00:00.000Z',
        updatedAt: '2022-06-05T00:00:00.000Z'
      },
      {
        id: 'emp5',
        firstName: 'Zeynep',
        lastName: 'Özkan',
        email: 'zeynep.ozkan@company.com',
        phone: '+90 532 567 89 01',
        dateOfEmployment: '2022-05-20',
        dateOfBirth: '1993-11-12',
        department: 'Analytics',
        position: 'Junior',
        createdAt: '2022-05-20T00:00:00.000Z',
        updatedAt: '2022-05-20T00:00:00.000Z'
      }
    ];

    employees.set(sampleEmployees);
    this.saveToStorage();
  }

  /**
   * Save employees to localStorage
   */
  saveToStorage() {
    try {
      const currentEmployees = employees.get();
      localStorage.setItem(this.storageKey, JSON.stringify(currentEmployees));
    } catch (error) {
      console.error('Failed to save employees to storage:', error);
    }
  }

  /**
   * Load view mode from localStorage
   */
  loadViewModeFromStorage() {
    try {
      const savedViewMode = localStorage.getItem(this.viewModeStorageKey);
      if (savedViewMode && (savedViewMode === 'list' || savedViewMode === 'table')) {
        viewMode.set(savedViewMode);
      }
    } catch (error) {
      console.error('Failed to load view mode from storage:', error);
      // Default to table view on error
      viewMode.set('table');
    }
  }

  /**
   * Save view mode to localStorage
   * @param {string} mode - View mode ('list' or 'table')
   */
  saveViewModeToStorage(mode) {
    try {
      localStorage.setItem(this.viewModeStorageKey, mode);
    } catch (error) {
      console.error('Failed to save view mode to storage:', error);
    }
  }

  /**
   * Load items per page from localStorage
   */
  loadItemsPerPageFromStorage() {
    try {
      const savedItemsPerPage = localStorage.getItem(this.itemsPerPageStorageKey);
      const parsedItemsPerPage = parseInt(savedItemsPerPage, 10);

      if (!isNaN(parsedItemsPerPage) && parsedItemsPerPage > 0) {
        itemsPerPage.set(parsedItemsPerPage);
      }
    } catch (error) {
      console.error('Failed to load items per page from storage:', error);
      // Default to 5 items per page on error
      itemsPerPage.set(5);
    }
  }

  /**
   * Save items per page to localStorage
   * @param {number} count - Number of items per page
   */
  saveItemsPerPageToStorage(count) {
    try {
      localStorage.setItem(this.itemsPerPageStorageKey, count);
    } catch (error) {
      console.error('Failed to save items per page to storage:', error);
    }
  }

  /**
   * Set view mode and persist to localStorage
   * @param {string} mode - View mode ('list' or 'table')
   */
  setViewMode(mode) {
    if (mode === VIEW_MODES.LIST || mode === VIEW_MODES.TABLE) {
      viewMode.set(mode);
      this.saveViewModeToStorage(mode);
    } else {
      console.warn('Invalid view mode:', mode);
    }
  }

  /**
   * Set items per page and persist to localStorage
   * @param {number} count - Number of items per page
   */
  setItemsPerPage(count) {
    if (Number.isInteger(count) && count > 0) {
      itemsPerPage.set(count);
      this.saveItemsPerPageToStorage(count);
    } else {
      console.warn('Invalid items per page count:', count);
    }
  }

  /**
   * Get current items per page
   * @returns {number} Current items per page
   */
  getItemsPerPage() {
    return itemsPerPage.get();
  }

  /**
   * Get current view mode
   * @returns {string} Current view mode
   */
  getViewMode() {
    return viewMode.get();
  }

  /**
   * Generate a unique ID for new employees
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Get all employees
   * @returns {Array} Array of employees
   */
  getAllEmployees() {
    return employees.get();
  }

  /**
   * Get employee by ID
   * @param {string} id - Employee ID
   * @returns {Object|null} Employee object or null if not found
   */
  getEmployeeById(id) {
    const currentEmployees = employees.get();
    return currentEmployees.find(emp => emp.id === id) || null;
  }

  /**
   * Check if email exists
   * @param {string} email - Email to check
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {boolean} True if email exists
   */
  emailExists(email, excludeId = null) {
    const currentEmployees = employees.get();
    return currentEmployees.some(emp =>
      emp.email.toLowerCase() === email.toLowerCase() && emp.id !== excludeId
    );
  }

  /**
   * Check if phone number exists
   * @param {string} phone - Phone number to check
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {boolean} True if phone exists
   */
  phoneExists(phone, excludeId = null) {
    const currentEmployees = employees.get();
    // Normalize phone numbers by removing all non-digit characters for comparison
    const normalizedPhone = phone.replace(/[^\d]/g, '');
    return currentEmployees.some(emp => {
      const normalizedEmpPhone = emp.phone.replace(/[^\d]/g, '');
      return normalizedEmpPhone === normalizedPhone && emp.id !== excludeId;
    });
  }

  /**
   * Validate employee data
   * @param {Object} employeeData - Employee data to validate
   * @param {string} excludeId - ID to exclude from email uniqueness check
   * @returns {Object} Validation result with isValid and errors
   */
  validateEmployee(employeeData, excludeId = null) {
    const errors = {};
    let isValid = true;

    // Required fields
    if (!employeeData.firstName?.trim()) {
      errors.firstName = 'messages.requiredField';
      isValid = false;
    }

    if (!employeeData.lastName?.trim()) {
      errors.lastName = 'messages.requiredField';
      isValid = false;
    }

    if (!employeeData.email?.trim()) {
      errors.email = 'messages.requiredField';
      isValid = false;
    } else {
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(employeeData.email)) {
        errors.email = 'messages.invalidEmail';
        isValid = false;
      } else if (this.emailExists(employeeData.email, excludeId)) {
        errors.email = 'messages.emailExists';
        isValid = false;
      }
    }

    if (!employeeData.phone?.trim()) {
      errors.phone = 'messages.requiredField';
      isValid = false;
    } else {
      // Phone format validation (basic)
      const phoneRegex = /^[+]?[0-9\s\-()]+$/;
      if (!phoneRegex.test(employeeData.phone)) {
        errors.phone = 'messages.invalidPhone';
        isValid = false;
      } else if (this.phoneExists(employeeData.phone, excludeId)) {
        errors.phone = 'messages.phoneExists';
        isValid = false;
      }
    }

    if (!employeeData.dateOfEmployment) {
      errors.dateOfEmployment = 'messages.requiredField';
      isValid = false;
    }

    // New required fields
    if (!employeeData.dateOfBirth) {
      errors.dateOfBirth = 'messages.requiredField';
      isValid = false;
    } else {
      // Age validation - must be at least 18 years old
      const birthDate = new Date(employeeData.dateOfBirth);
      const today = new Date();

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred this year yet
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        errors.dateOfBirth = 'messages.invalidAge';
        isValid = false;
      }
    }
    if (!employeeData.department?.trim()) {
      errors.department = 'messages.requiredField';
      isValid = false;
    }
    if (!employeeData.position?.trim()) {
      errors.position = 'messages.requiredField';
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * Add a new employee
   * @param {Object} employeeData - Employee data
   * @returns {Promise<Object>} Result with success status and data/error
   */
  async addEmployee(employeeData) {
    isLoading.set(true);

    try {
      const validation = this.validateEmployee(employeeData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const newEmployee = {
        id: this.generateId(),
        firstName: employeeData.firstName.trim(),
        lastName: employeeData.lastName.trim(),
        email: employeeData.email.trim(),
        phone: employeeData.phone.trim(),
        dateOfEmployment: employeeData.dateOfEmployment,
        dateOfBirth: employeeData.dateOfBirth,
        department: employeeData.department?.trim(),
        position: employeeData.position?.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const currentEmployees = employees.get();
      employees.set([...currentEmployees, newEmployee]);
      this.saveToStorage();

      return { success: true, data: newEmployee };
    } catch (error) {
      console.error('Failed to add employee:', error);
      return { success: false, error: error.message };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Update an existing employee
   * @param {string} id - Employee ID
   * @param {Object} employeeData - Updated employee data
   * @returns {Promise<Object>} Result with success status and data/error
   */
  async updateEmployee(id, employeeData) {
    isLoading.set(true);

    try {
      const validation = this.validateEmployee(employeeData, id);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const currentEmployees = employees.get();
      const employeeIndex = currentEmployees.findIndex(emp => emp.id === id);

      if (employeeIndex === -1) {
        return { success: false, error: 'Employee not found' };
      }

      const updatedEmployee = {
        ...currentEmployees[employeeIndex],
        firstName: employeeData.firstName.trim(),
        lastName: employeeData.lastName.trim(),
        email: employeeData.email.trim(),
        phone: employeeData.phone.trim(),
        dateOfEmployment: employeeData.dateOfEmployment,
        dateOfBirth: employeeData.dateOfBirth,
        department: employeeData.department?.trim(),
        position: employeeData.position?.trim(),
        updatedAt: new Date().toISOString()
      };

      const updatedEmployees = [...currentEmployees];
      updatedEmployees[employeeIndex] = updatedEmployee;

      employees.set(updatedEmployees);
      this.saveToStorage();

      return { success: true, data: updatedEmployee };
    } catch (error) {
      console.error('Failed to update employee:', error);
      return { success: false, error: error.message };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Delete an employee
   * @param {string} id - Employee ID
   * @returns {Promise<Object>} Result with success status
   */
  async deleteEmployee(id) {
    isLoading.set(true);

    try {
      const currentEmployees = employees.get();
      const filteredEmployees = currentEmployees.filter(emp => emp.id !== id);

      if (filteredEmployees.length === currentEmployees.length) {
        return { success: false, error: 'Employee not found' };
      }

      employees.set(filteredEmployees);
      this.saveToStorage();

      // Clear selected employee if it was deleted
      if (selectedEmployee.get()?.id === id) {
        selectedEmployee.set(null);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to delete employee:', error);
      return { success: false, error: error.message };
    } finally {
      isLoading.set(false);
    }
  }

  /**
   * Search employees by name or email
   * @param {string} query - Search query
   * @returns {Array} Filtered employees
   */
  searchEmployees(query) {
    if (!query.trim()) {
      return this.getAllEmployees();
    }

    const currentEmployees = employees.get();
    const searchTerm = query.toLowerCase().trim();

    return currentEmployees.filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm) ||
      emp.lastName.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Set selected employee
   * @param {Object|null} employee - Employee to select
   */
  setSelectedEmployee(employee) {
    selectedEmployee.set(employee);
  }

  /**
   * Clear selected employee
   */
  clearSelectedEmployee() {
    selectedEmployee.set(null);
  }

  /**
   * Clear all employees (mainly for testing)
   */
  clearAll() {
    employees.set([]);
    selectedEmployee.set(null);
    this.saveToStorage();
  }

  /**
   * Reset view mode to default (mainly for testing)
   */
  resetViewMode() {
    viewMode.set('table');
    localStorage.removeItem(this.viewModeStorageKey);
  }

  /**
   * Reset items per page to default (mainly for testing)
   */
  resetItemsPerPage() {
    itemsPerPage.set(5);
    localStorage.removeItem(this.itemsPerPageStorageKey);
  }
}

// Create singleton instance
export const employeeService = new EmployeeService();
