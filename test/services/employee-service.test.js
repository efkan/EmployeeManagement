import { EmployeeList } from '../../src/components/employee-list.js';

describe('EmployeeList', () => {
  it('should construct with default values', () => {
    const el = new EmployeeList();
    expect(el.searchQuery).to.equal('');
    expect(el.filteredEmployees).to.be.an('array');
    expect(el.currentPage).to.equal(1);
  });

  it('should call connectedCallback and subscribe to stores', () => {
    const el = new EmployeeList();
    el.connectedCallback();
    // Optionally, spy on store subscriptions or check side effects
  });

  it('should handle pagination methods', () => {
    const el = new EmployeeList();
    el.totalPages = 3;
    el.currentPage = 2;
    el._onPageChange(3);
    expect(el.currentPage).to.equal(3);
    el._onPreviousPage();
    expect(el.currentPage).to.equal(2);
    el._onNextPage();
    expect(el.currentPage).to.equal(3);
  });

  it('should handle items per page change', () => {
    const el = new EmployeeList();
    const event = { target: { value: '10' } };
    el._onItemsPerPageChange(event);
    expect(el.currentPage).to.equal(1);
  });

  it('should get visible page numbers', () => {
    const el = new EmployeeList();
    el.totalPages = 3;
    const pages = el._getVisiblePageNumbers();
    expect(pages).to.deep.equal([1, 2, 3]);
  });
});import { expect } from '@open-wc/testing';
import { employeeService, employees, viewMode, itemsPerPage, selectedEmployee } from '../../src/services/employee-service.js';

describe('EmployeeService', () => {
  beforeEach(() => {
    // Clear localStorage and reset stores
    localStorage.removeItem('employeeManagement_employees');
    localStorage.removeItem('employeeManagement_viewMode');
    localStorage.removeItem('employeeManagement_itemsPerPage');
    employees.set([]);
    viewMode.set('table'); // Reset to default
    itemsPerPage.set(5); // Reset to default
    selectedEmployee.set(null);
  });

  afterEach(() => {
    // Clean up
    localStorage.removeItem('employeeManagement_employees');
    localStorage.removeItem('employeeManagement_viewMode');
    localStorage.removeItem('employeeManagement_itemsPerPage');
    selectedEmployee.set(null);
  });

  describe('setSelectedEmployee', () => {
    it('should set the selected employee', async () => {
      const employeeData = {
        firstName: 'Set',
        lastName: 'Selected',
        email: 'set.selected@example.com',
        phone: '+1111111111',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'HR',
        position: 'Manager'
      };
      const addResult = await employeeService.addEmployee(employeeData);
      const employee = addResult.data;
      employeeService.setSelectedEmployee(employee);
      expect(selectedEmployee.get()).to.deep.equal(employee);
    });

    it('should set selected employee to null if null is passed', () => {
      employeeService.setSelectedEmployee(null);
      expect(selectedEmployee.get()).to.be.null;
    });
  });

  describe('clearSelectedEmployee', () => {
    it('should clear the selected employee', async () => {
      const employeeData = {
        firstName: 'Clear',
        lastName: 'Selected',
        email: 'clear.selected@example.com',
        phone: '+2222222222',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Finance',
        position: 'Analyst'
      };
      const addResult = await employeeService.addEmployee(employeeData);
      const employee = addResult.data;
      employeeService.setSelectedEmployee(employee);
      expect(selectedEmployee.get()).to.deep.equal(employee);
      employeeService.clearSelectedEmployee();
      expect(selectedEmployee.get()).to.be.null;
    });

    it('should do nothing if selected employee is already null', () => {
      selectedEmployee.set(null);
      employeeService.clearSelectedEmployee();
      expect(selectedEmployee.get()).to.be.null;
    });
  });

  describe('clearAll', () => {
    it('should clear all employees and selected employee', async () => {
      const employeeData = {
        firstName: 'Clear',
        lastName: 'All',
        email: 'clear.all@example.com',
        phone: '+3333333333',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'IT',
        position: 'Engineer'
      };
      const addResult = await employeeService.addEmployee(employeeData);
      const employee = addResult.data;
      employeeService.setSelectedEmployee(employee);
      expect(employeeService.getAllEmployees()).to.have.lengthOf(1);
      expect(selectedEmployee.get()).to.deep.equal(employee);
      employeeService.clearAll();
      expect(employeeService.getAllEmployees()).to.have.lengthOf(0);
      expect(selectedEmployee.get()).to.be.null;
    });

    it('should not throw if already empty', () => {
      employees.set([]);
      selectedEmployee.set(null);
      expect(() => employeeService.clearAll()).to.not.throw();
      expect(employeeService.getAllEmployees()).to.have.lengthOf(0);
      expect(selectedEmployee.get()).to.be.null;
    });
  });

  describe('addEmployee', () => {
    it('should add a valid employee', async () => {
      const employeeData = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      };

      const result = await employeeService.addEmployee(employeeData);
      expect(result.success).to.be.true;
      expect(result.data).to.include({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com'
      });
      expect(result.data.id).to.be.a('string');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        department: '',
        position: ''
      };

      const result = await employeeService.addEmployee(invalidData);
      expect(result.success).to.be.false;
      expect(result.errors).to.have.property('firstName');
      expect(result.errors).to.have.property('email');
      expect(result.errors).to.have.property('phone');
      expect(result.errors).to.have.property('dateOfEmployment');
      expect(result.errors).to.have.property('dateOfBirth');
      expect(result.errors).to.have.property('department');
      expect(result.errors).to.have.property('position');
    });

    it('should prevent duplicate emails', async () => {
      const employee1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const employee2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'john@example.com', // Same email
        phone: '+1987654321',
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      };

      await employeeService.addEmployee(employee1);
      const result = await employeeService.addEmployee(employee2);

      expect(result.success).to.be.false;
      expect(result.errors).to.have.property('email');
    });

    it('should prevent duplicate phone numbers', async () => {
      const employee1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8900',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const employee2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1 (234) 567-8900', // Same phone, different format
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      };

      await employeeService.addEmployee(employee1);
      const result = await employeeService.addEmployee(employee2);

      expect(result.success).to.be.false;
      expect(result.errors).to.have.property('phone');
    });

    it('should not add employee if validation fails', async () => {
      const invalid = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfEmployment: '',
        dateOfBirth: '',
        department: '',
        position: ''
      };
      const result = await employeeService.addEmployee(invalid);
      expect(result.success).to.be.false;
      expect(employeeService.getAllEmployees()).to.have.lengthOf(0);
    });
  });

  describe('updateEmployee', () => {
    it('should update an existing employee', async () => {
      const originalData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const addResult = await employeeService.addEmployee(originalData);
      const employeeId = addResult.data.id;

      const updatedData = {
        firstName: 'John',
        lastName: 'Smith', // Changed last name
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const updateResult = await employeeService.updateEmployee(employeeId, updatedData);
      expect(updateResult.success).to.be.true;
      expect(updateResult.data.lastName).to.equal('Smith');
    });

    it('should return error for non-existent employee', async () => {
      const updateData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const result = await employeeService.updateEmployee('non-existent-id', updateData);
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Employee not found');
    });

    it('should not allow updating to duplicate email', async () => {
      // Add two employees
      const employee1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const employee2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      };

      await employeeService.addEmployee(employee1);
      const addResult2 = await employeeService.addEmployee(employee2);

      // Try to update employee2 to have same email as employee1
      const updatedData = {
        ...employee2,
        email: 'john@example.com' // Duplicate email
      };

      const updateResult = await employeeService.updateEmployee(addResult2.data.id, updatedData);
      expect(updateResult.success).to.be.false;
      expect(updateResult.errors).to.have.property('email');
    });

    it('should not allow updating to duplicate phone number', async () => {
      // Add two employees
      const employee1 = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8900',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const employee2 = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '+1987654321',
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      };

      await employeeService.addEmployee(employee1);
      const addResult2 = await employeeService.addEmployee(employee2);

      // Try to update employee2 to have same phone as employee1 (different format)
      const updatedData = {
        ...employee2,
        phone: '+1 (234) 567-8900' // Same phone number, different format
      };

      const updateResult = await employeeService.updateEmployee(addResult2.data.id, updatedData);
      expect(updateResult.success).to.be.false;
      expect(updateResult.errors).to.have.property('phone');
    });

    it('should allow updating own phone number to same format', async () => {
      const employee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8900',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const addResult = await employeeService.addEmployee(employee);

      // Update to different format of same phone number
      const updatedData = {
        ...employee,
        phone: '+1 (234) 567-8900', // Same number, different format
        lastName: 'Smith' // Change something else to confirm update
      };

      const updateResult = await employeeService.updateEmployee(addResult.data.id, updatedData);
      expect(updateResult.success).to.be.true;
      expect(updateResult.data.lastName).to.equal('Smith');
    });

    it('should not update if validation fails', async () => {
      const employee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };
      const addResult = await employeeService.addEmployee(employee);
      const invalid = { ...employee, firstName: '' };
      const result = await employeeService.updateEmployee(addResult.data.id, invalid);
      expect(result.success).to.be.false;
      expect(result.errors).to.have.property('firstName');
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an existing employee', async () => {
      const employeeData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const addResult = await employeeService.addEmployee(employeeData);
      const employeeId = addResult.data.id;

      const deleteResult = await employeeService.deleteEmployee(employeeId);
      expect(deleteResult.success).to.be.true;

      const remainingEmployees = employeeService.getAllEmployees();
      expect(remainingEmployees).to.have.lengthOf(0);
    });

    it('should return error for non-existent employee', async () => {
      const result = await employeeService.deleteEmployee('non-existent-id');
      expect(result.success).to.be.false;
      expect(result.error).to.equal('Employee not found');
    });

    it('should not throw if employees list is empty', async () => {
      employees.set([]);
      const result = await employeeService.deleteEmployee('any-id');
      expect(result.success).to.be.false;
    });
  });

  describe('searchEmployees', () => {
    beforeEach(async () => {
      await employeeService.addEmployee({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      });

      await employeeService.addEmployee({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1987654321',
        dateOfEmployment: '2024-02-01',
        dateOfBirth: '1991-01-01',
        department: 'Analytics',
        position: 'Senior'
      });
    });

    it('should search by first name', () => {
      const result = employeeService.searchEmployees('John');
      expect(result).to.have.lengthOf(1);
      expect(result[0].firstName).to.equal('John');
    });

    it('should search by last name', () => {
      const result = employeeService.searchEmployees('Smith');
      expect(result).to.have.lengthOf(1);
      expect(result[0].lastName).to.equal('Smith');
    });

    it('should search by email', () => {
      const result = employeeService.searchEmployees('jane.smith');
      expect(result).to.have.lengthOf(1);
      expect(result[0].email).to.contain('jane.smith');
    });

    it('should return all employees for empty query', () => {
      const result = employeeService.searchEmployees('');
      expect(result).to.have.lengthOf(2);
    });

    it('should return empty array for no matches', () => {
      const result = employeeService.searchEmployees('xyz');
      expect(result).to.have.lengthOf(0);
    });

    it('should handle null/undefined query gracefully', () => {
      expect(employeeService.searchEmployees(null)).to.have.lengthOf(2);
      expect(employeeService.searchEmployees(undefined)).to.have.lengthOf(2);
    });
  });

  describe('validateEmployee', () => {
    it('should validate a correct employee', () => {
      const validEmployee = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      };

      const result = employeeService.validateEmployee(validEmployee);
      expect(result.isValid).to.be.true;
      expect(Object.keys(result.errors)).to.have.lengthOf(0);
    });

    it('should catch validation errors', () => {
      const invalidEmployee = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        phone: 'invalid-phone',
        dateOfEmployment: '',
        dateOfBirth: '',
        department: '',
        position: ''
      };

      const result = employeeService.validateEmployee(invalidEmployee);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.property('firstName');
      expect(result.errors).to.have.property('lastName');
      expect(result.errors).to.have.property('email');
      expect(result.errors).to.have.property('phone');
      expect(result.errors).to.have.property('dateOfEmployment');
      expect(result.errors).to.have.property('dateOfBirth');
      expect(result.errors).to.have.property('department');
      expect(result.errors).to.have.property('position');
    });

    it('should reject employees under 18 years old', () => {
      const today = new Date();
      const under18Date = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
      const under18DateString = under18Date.toISOString().split('T')[0];

      const youngEmployee = {
        firstName: 'Young',
        lastName: 'Person',
        email: 'young@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: under18DateString,
        department: 'Tech',
        position: 'Junior'
      };

      const result = employeeService.validateEmployee(youngEmployee);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.property('dateOfBirth');
      expect(result.errors.dateOfBirth).to.equal('messages.invalidAge');
    });

    it('should accept employees exactly 18 years old', () => {
      const today = new Date();
      const exactly18Date = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const exactly18DateString = exactly18Date.toISOString().split('T')[0];

      const eighteenEmployee = {
        firstName: 'Eighteen',
        lastName: 'Years',
        email: 'eighteen@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: exactly18DateString,
        department: 'Tech',
        position: 'Junior'
      };

      const result = employeeService.validateEmployee(eighteenEmployee);
      expect(result.isValid).to.be.true;
      expect(result.errors).to.not.have.property('dateOfBirth');
    });

    it('should accept employees over 18 years old', () => {
      const today = new Date();
      const over18Date = new Date(today.getFullYear() - 25, today.getMonth(), today.getDate());
      const over18DateString = over18Date.toISOString().split('T')[0];

      const adultEmployee = {
        firstName: 'Adult',
        lastName: 'Person',
        email: 'adult@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: over18DateString,
        department: 'Analytics',
        position: 'Senior'
      };

      const result = employeeService.validateEmployee(adultEmployee);
      expect(result.isValid).to.be.true;
      expect(result.errors).to.not.have.property('dateOfBirth');
    });

    it('should reject employees who turn 18 later this year', () => {
      const today = new Date();
      // Create a date that's 18 years ago but with a future month/day this year
      let futureDate = new Date(today.getFullYear() - 18, today.getMonth() + 1, today.getDate());

      // Handle year overflow
      if (futureDate.getMonth() > 11) {
        futureDate = new Date(today.getFullYear() - 17, 0, today.getDate());
      }

      const futureDateString = futureDate.toISOString().split('T')[0];

      const notYet18Employee = {
        firstName: 'NotYet',
        lastName: 'Eighteen',
        email: 'notyet18@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: futureDateString,
        department: 'Tech',
        position: 'Junior'
      };

      const result = employeeService.validateEmployee(notYet18Employee);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.have.property('dateOfBirth');
      expect(result.errors.dateOfBirth).to.equal('messages.invalidAge');
    });

    it('should handle missing employee object gracefully', () => {
      const result = employeeService.validateEmployee(null);
      expect(result.isValid).to.be.false;
      expect(result.errors).to.be.an('object');
    });
  });

  describe('emailExists', () => {
    beforeEach(async () => {
      await employeeService.addEmployee({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      });
    });

    it('should return true for existing email', () => {
      const result = employeeService.emailExists('john@example.com');
      expect(result).to.be.true;
    });

    it('should return false for non-existing email', () => {
      const result = employeeService.emailExists('jane@example.com');
      expect(result).to.be.false;
    });

    it('should exclude specific ID from check', async () => {
      const employees = employeeService.getAllEmployees();
      const existingId = employees[0].id;

      const result = employeeService.emailExists('john@example.com', existingId);
      expect(result).to.be.false;
    });

    it('should handle empty email gracefully', () => {
      expect(employeeService.emailExists('')).to.be.false;
      expect(employeeService.emailExists(null)).to.be.false;
    });
  });

  describe('phoneExists', () => {
    beforeEach(async () => {
      await employeeService.addEmployee({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1-234-567-8900',
        dateOfEmployment: '2024-01-01',
        dateOfBirth: '1990-01-01',
        department: 'Tech',
        position: 'Junior'
      });
    });

    it('should return true for existing phone number (exact match)', () => {
      const result = employeeService.phoneExists('+1-234-567-8900');
      expect(result).to.be.true;
    });

    it('should return true for existing phone number (normalized)', () => {
      // Should match normalized versions of the phone number
      const result1 = employeeService.phoneExists('12345678900');
      const result2 = employeeService.phoneExists('+1 234 567 8900');
      const result3 = employeeService.phoneExists('+1(234) 567-8900');

      expect(result1).to.be.true;
      expect(result2).to.be.true;
      expect(result3).to.be.true;
    });

    it('should return false for non-existing phone number', () => {
      const result = employeeService.phoneExists('+1-999-888-7777');
      expect(result).to.be.false;
    });

    it('should exclude specific ID from check', async () => {
      const employees = employeeService.getAllEmployees();
      const existingId = employees[0].id;

      const result = employeeService.phoneExists('+1-234-567-8900', existingId);
      expect(result).to.be.false;
    });

    it('should handle different phone number formats correctly', () => {
      // Test that various formats of the same number are considered duplicates
      const formats = [
        '12345678900',
        '+1 234 567 8900',
        '+1(234) 567-8900',
        '+1-234-567-8900',
        '+1.234.567.8900'
      ];

      formats.forEach(format => {
        const result = employeeService.phoneExists(format);
        expect(result).to.be.true;
      });
    });

    it('should handle empty phone gracefully', () => {
      expect(employeeService.phoneExists('')).to.be.false;
      expect(employeeService.phoneExists(null)).to.be.false;
    });
  });

  describe('View Mode Persistence', () => {
    describe('setViewMode', () => {
      it('should set view mode to list and save to localStorage', () => {
        employeeService.setViewMode('list');

        expect(viewMode.get()).to.equal('list');
        expect(localStorage.getItem('employeeManagement_viewMode')).to.equal('list');
      });

      it('should set view mode to table and save to localStorage', () => {
        employeeService.setViewMode('table');

        expect(viewMode.get()).to.equal('table');
        expect(localStorage.getItem('employeeManagement_viewMode')).to.equal('table');
      });

      it('should reject invalid view modes', () => {
        // Store original console.warn
        const originalWarn = console.warn;
        let warnCalled = false;
        let warnMessage = '';

        // Mock console.warn
        console.warn = (message, value) => {
          warnCalled = true;
          warnMessage = `${message} ${value}`;
        };

        employeeService.setViewMode('invalid');

        expect(viewMode.get()).to.equal('table'); // Should remain unchanged
        expect(localStorage.getItem('employeeManagement_viewMode')).to.be.null;
        expect(warnCalled).to.be.true;
        expect(warnMessage).to.equal('Invalid view mode: invalid');

        // Restore console.warn
        console.warn = originalWarn;
      });
    });

    describe('getViewMode', () => {
      it('should return current view mode', () => {
        viewMode.set('list');
        expect(employeeService.getViewMode()).to.equal('list');

        viewMode.set('table');
        expect(employeeService.getViewMode()).to.equal('table');
      });
    });

    describe('loadViewModeFromStorage', () => {
      it('should load list view mode from localStorage', () => {
        localStorage.setItem('employeeManagement_viewMode', 'list');

        employeeService.loadViewModeFromStorage();

        expect(viewMode.get()).to.equal('list');
      });

      it('should load table view mode from localStorage', () => {
        localStorage.setItem('employeeManagement_viewMode', 'table');

        employeeService.loadViewModeFromStorage();

        expect(viewMode.get()).to.equal('table');
      });

      it('should ignore invalid values in localStorage', () => {
        localStorage.setItem('employeeManagement_viewMode', 'invalid');

        employeeService.loadViewModeFromStorage();

        expect(viewMode.get()).to.equal('table'); // Should remain at default
      });

      it('should handle missing localStorage value gracefully', () => {
        localStorage.removeItem('employeeManagement_viewMode');

        employeeService.loadViewModeFromStorage();

        expect(viewMode.get()).to.equal('table'); // Should remain at default
      });

      it('should handle localStorage errors gracefully', () => {
        // Store original console.error
        const originalError = console.error;
        let errorCalled = false;
        let errorMessage = '';

        // Mock console.error
        console.error = (message) => {
          errorCalled = true;
          errorMessage = message;
        };

        // Mock localStorage to throw an error
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = () => {
          throw new Error('Storage error');
        };

        employeeService.loadViewModeFromStorage();

        expect(viewMode.get()).to.equal('table'); // Should default to table
        expect(errorCalled).to.be.true;
        expect(errorMessage).to.equal('Failed to load view mode from storage:');

        // Restore
        localStorage.getItem = originalGetItem;
        console.error = originalError;
      });
    });

    describe('saveViewModeToStorage', () => {
      it('should save view mode to localStorage', () => {
        employeeService.saveViewModeToStorage('list');

        expect(localStorage.getItem('employeeManagement_viewMode')).to.equal('list');
      });

      it('should handle localStorage errors gracefully', () => {
        // Store original console.error
        const originalError = console.error;
        let errorCalled = false;
        let errorMessage = '';

        // Mock console.error
        console.error = (message) => {
          errorCalled = true;
          errorMessage = message;
        };

        // Mock localStorage to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
          throw new Error('Storage error');
        };

        employeeService.saveViewModeToStorage('list');

        expect(errorCalled).to.be.true;
        expect(errorMessage).to.equal('Failed to save view mode to storage:');

        // Restore
        localStorage.setItem = originalSetItem;
        console.error = originalError;
      });
    });

    describe('resetViewMode', () => {
      it('should reset view mode to table and clear localStorage', () => {
        // Set up non-default state
        employeeService.setViewMode('list');
        expect(viewMode.get()).to.equal('list');
        expect(localStorage.getItem('employeeManagement_viewMode')).to.equal('list');

        // Reset
        employeeService.resetViewMode();

        expect(viewMode.get()).to.equal('table');
        expect(localStorage.getItem('employeeManagement_viewMode')).to.be.null;
      });
    });

    describe('Integration - View Mode Persistence Across Sessions', () => {
      it('should persist view mode preference across service instantiation', () => {
        // Set view mode to list
        employeeService.setViewMode('list');
        expect(viewMode.get()).to.equal('list');
        expect(localStorage.getItem('employeeManagement_viewMode')).to.equal('list');

        // Simulate new session by manually calling loadViewModeFromStorage
        viewMode.set('table'); // Reset atom to simulate fresh start
        employeeService.loadViewModeFromStorage();

        // Should restore list mode from localStorage
        expect(viewMode.get()).to.equal('list');
      });

      it('should maintain default table view when no previous preference exists', () => {
        // Ensure no stored preference
        localStorage.removeItem('employeeManagement_viewMode');

        // Simulate loading with no stored preference
        viewMode.set('table'); // Ensure default
        employeeService.loadViewModeFromStorage();

        // Should remain table (default)
        expect(viewMode.get()).to.equal('table');
      });
    });
  });

  describe('Items Per Page Persistence', () => {
    describe('setItemsPerPage', () => {
      it('should set items per page to 10 and save to localStorage', () => {
        employeeService.setItemsPerPage(10);

        expect(itemsPerPage.get()).to.equal(10);
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.equal('10');
      });

      it('should set items per page to 25 and save to localStorage', () => {
        employeeService.setItemsPerPage(25);

        expect(itemsPerPage.get()).to.equal(25);
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.equal('25');
      });

      it('should reject invalid items per page values', () => {
        // Store original console.warn
        const originalWarn = console.warn;
        let warnCalled = false;
        let warnMessage = '';

        // Mock console.warn
        console.warn = (message, value) => {
          warnCalled = true;
          warnMessage = `${message} ${value}`;
        };

        employeeService.setItemsPerPage(-5);

        expect(itemsPerPage.get()).to.equal(5); // Should remain unchanged
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.be.null;
        expect(warnCalled).to.be.true;
        expect(warnMessage).to.equal('Invalid items per page count: -5');

        // Restore console.warn
        console.warn = originalWarn;
      });

      it('should reject non-integer values', () => {
        // Store original console.warn
        const originalWarn = console.warn;
        let warnCalled = false;
        let warnMessage = '';

        // Mock console.warn
        console.warn = (message, value) => {
          warnCalled = true;
          warnMessage = `${message} ${value}`;
        };

        employeeService.setItemsPerPage(5.5);

        expect(itemsPerPage.get()).to.equal(5); // Should remain unchanged
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.be.null;
        expect(warnCalled).to.be.true;
        expect(warnMessage).to.equal('Invalid items per page count: 5.5');

        // Restore console.warn
        console.warn = originalWarn;
      });
    });

    describe('getItemsPerPage', () => {
      it('should return current items per page', () => {
        itemsPerPage.set(10);
        expect(employeeService.getItemsPerPage()).to.equal(10);

        itemsPerPage.set(25);
        expect(employeeService.getItemsPerPage()).to.equal(25);
      });
    });

    describe('loadItemsPerPageFromStorage', () => {
      it('should load items per page from localStorage', () => {
        localStorage.setItem('employeeManagement_itemsPerPage', '25');

        employeeService.loadItemsPerPageFromStorage();

        expect(itemsPerPage.get()).to.equal(25);
      });

      it('should ignore invalid values in localStorage', () => {
        localStorage.setItem('employeeManagement_itemsPerPage', 'invalid');

        employeeService.loadItemsPerPageFromStorage();

        expect(itemsPerPage.get()).to.equal(5); // Should remain at default
      });

      it('should ignore negative values in localStorage', () => {
        localStorage.setItem('employeeManagement_itemsPerPage', '-10');

        employeeService.loadItemsPerPageFromStorage();

        expect(itemsPerPage.get()).to.equal(5); // Should remain at default
      });

      it('should handle missing localStorage value gracefully', () => {
        localStorage.removeItem('employeeManagement_itemsPerPage');

        employeeService.loadItemsPerPageFromStorage();

        expect(itemsPerPage.get()).to.equal(5); // Should remain at default
      });

      it('should handle localStorage errors gracefully', () => {
        // Store original console.error
        const originalError = console.error;
        let errorCalled = false;
        let errorMessage = '';

        // Mock console.error
        console.error = (message) => {
          errorCalled = true;
          errorMessage = message;
        };

        // Mock localStorage to throw an error
        const originalGetItem = localStorage.getItem;
        localStorage.getItem = () => {
          throw new Error('Storage error');
        };

        employeeService.loadItemsPerPageFromStorage();

        expect(itemsPerPage.get()).to.equal(5); // Should default to 5
        expect(errorCalled).to.be.true;
        expect(errorMessage).to.equal('Failed to load items per page from storage:');

        // Restore
        localStorage.getItem = originalGetItem;
        console.error = originalError;
      });
    });

    describe('saveItemsPerPageToStorage', () => {
      it('should save items per page to localStorage', () => {
        employeeService.saveItemsPerPageToStorage(25);

        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.equal('25');
      });

      it('should handle localStorage errors gracefully', () => {
        // Store original console.error
        const originalError = console.error;
        let errorCalled = false;
        let errorMessage = '';

        // Mock console.error
        console.error = (message) => {
          errorCalled = true;
          errorMessage = message;
        };

        // Mock localStorage to throw an error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = () => {
          throw new Error('Storage error');
        };

        employeeService.saveItemsPerPageToStorage(25);

        expect(errorCalled).to.be.true;
        expect(errorMessage).to.equal('Failed to save items per page to storage:');

        // Restore
        localStorage.setItem = originalSetItem;
        console.error = originalError;
      });
    });

    describe('resetItemsPerPage', () => {
      it('should reset items per page to default and clear localStorage', () => {
        // Set up non-default state
        employeeService.setItemsPerPage(25);
        expect(itemsPerPage.get()).to.equal(25);
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.equal('25');

        // Reset
        employeeService.resetItemsPerPage();

        expect(itemsPerPage.get()).to.equal(5);
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.be.null;
      });
    });

    describe('Integration - Items Per Page Persistence Across Sessions', () => {
      it('should persist items per page preference across service instantiation', () => {
        // Set items per page to 25
        employeeService.setItemsPerPage(25);
        expect(itemsPerPage.get()).to.equal(25);
        expect(localStorage.getItem('employeeManagement_itemsPerPage')).to.equal('25');

        // Simulate new session by manually calling loadItemsPerPageFromStorage
        itemsPerPage.set(5); // Reset atom to simulate fresh start
        employeeService.loadItemsPerPageFromStorage();

        // Should restore 25 from localStorage
        expect(itemsPerPage.get()).to.equal(25);
      });

      it('should maintain default items per page when no previous preference exists', () => {
        // Ensure no stored preference
        localStorage.removeItem('employeeManagement_itemsPerPage');

        // Simulate loading with no stored preference
        itemsPerPage.set(5); // Ensure default
        employeeService.loadItemsPerPageFromStorage();

        // Should remain 5 (default)
        expect(itemsPerPage.get()).to.equal(5);
      });
    });
  });
});
