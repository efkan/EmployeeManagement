// Mock translations for tests
export const mockTranslations = {
  nav: {
    addEmployee: 'Add Employee',
    employees: 'Employees'
  },
  employee: {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    dateOfBirth: 'Date of Birth',
    dateOfEmployment: 'Date of Employment',
    department: 'Department',
    position: 'Position'
  },
  placeholders: {
    enterFirstName: 'Enter first name',
    enterLastName: 'Enter last name',
    enterEmail: 'Enter email',
    enterPhone: 'Enter phone',
    selectDepartment: 'Select department',
    selectPosition: 'Select position',
    search: 'Search employees...'
  },
  buttons: {
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add'
  },
  messages: {
    confirmDelete: 'Are you sure you want to delete this employee?',
    confirmUpdate: 'Are you sure you want to update this employee?',
    noEmployees: 'No employees found',
    noResults: 'No employees match your search criteria'
  }
};

/**
 * Mock the localization service for testing
 */
export function mockLocalizationService() {
  // Create a simple mock that avoids dynamic imports
  const mockService = {
    initialized: true,
    t: function(key, replacements = {}) {
      const keys = key.split('.');
      let value = mockTranslations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      // Handle replacements
      if (typeof value === 'string' && Object.keys(replacements).length > 0) {
        return Object.keys(replacements).reduce((str, key) => {
          return str.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), replacements[key]);
        }, value);
      }

      return value || key;
    },
    getCurrentLanguage: () => 'en',
    setLanguage: async () => {},
    init: async () => {},
    resetForTesting: () => {}
  };

  return mockService;
}
