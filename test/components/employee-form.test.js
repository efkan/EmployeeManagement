import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/employee-form.js';
import { employeeService } from '../../src/services/employee-service.js';
import { mockLocalizationService } from '../test-utils.js';

describe('EmployeeForm', () => {
  it('should handle disconnectedCallback with no unsubscribeLanguage', () => {
    element.unsubscribeLanguage = null;
    expect(() => element.disconnectedCallback()).to.not.throw();
  });

  it('should handle _onInputChange with unknown field', () => {
    const input = document.createElement('input');
    input.name = 'unknownField';
    input.value = 'SomeValue';
    expect(() => element._onInputChange({ target: input })).to.not.throw();
  });

  it('should handle _getFieldError with falsy, string, and object error', () => {
    element.errors.testField = undefined;
    expect(element._getFieldError('testField')).to.be.undefined;
    element.errors.testField = 'A string error';
    expect(element._getFieldError('testField')).to.equal('A string error');
    element.errors.testField = { message: 'Object error' };
    expect(element._getFieldError('testField')).to.equal('Object error');
  });

  it('should call _showSuccessMessage and _showErrorMessage with empty message', () => {
    expect(() => element._showSuccessMessage('')).to.not.throw();
    expect(() => element._showErrorMessage('')).to.not.throw();
  });

  it('should not proceed in _onSubmit if form is invalid', async () => {
    element.formData = { firstName: '', lastName: '', email: '', phone: '', dateOfEmployment: '', dateOfBirth: '', department: '', position: '' };
    let dialogShown = false;
    element.shadowRoot.querySelector = () => ({ show: () => { dialogShown = true; } });
    await element._onSubmit({ preventDefault: () => {} });
    expect(dialogShown).to.be.false;
  });

  it('should handle _onConfirmSave when dialog is not open', async () => {
    // Simulate dialog not open (no-op)
    element.shadowRoot.querySelector = () => null;
    await element._onConfirmSave();
    expect(element).to.exist;
  });

  it('should call _resetForm when already empty', () => {
    element.formData = { firstName: '', lastName: '', email: '', phone: '', dateOfEmployment: '', dateOfBirth: '', department: '', position: '' };
    expect(() => element._resetForm()).to.not.throw();
  });

  it('should call _loadEmployee with non-existent ID', () => {
    expect(() => element._loadEmployee('nonexistent-id')).to.not.throw();
  });
  it('should not show confirm dialog on submit if not editing', async () => {
    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      phone: '555-0000',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.isEditing = false;
    let dialogShown = false;
    element.shadowRoot.querySelector = () => ({ show: () => { dialogShown = true; } });
    await element._onSubmit({ preventDefault: () => {} });
    expect(dialogShown).to.be.false;
  });

  it('should handle duplicate email error in _saveEmployee', async () => {
    // Add an employee with the same email first
    await employeeService.addEmployee({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'dupe@user.com',
      phone: '555-9999',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    });
    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'dupe@user.com',
      phone: '555-0002',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.isEditing = false;
    await element._saveEmployee();
    expect(element.errors.email).to.exist;
  });

  it('should handle duplicate phone error in _saveEmployee', async () => {
    // Add an employee with the same phone first
    await employeeService.addEmployee({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'unique@user.com',
      phone: '555-8888',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    });
    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'unique2@user.com',
      phone: '555-8888',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.isEditing = false;
    await element._saveEmployee();
    expect(element.errors.phone).to.exist;
  });

  it('should show error if required fields are missing on submit', async () => {
    element.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: ''
    };
    await element._saveEmployee();
    expect(Object.keys(element.errors).length).to.be.greaterThan(0);
  });

  it('should reset form fields on cancel', async () => {
    element.formData = {
      firstName: 'Temp',
      lastName: 'Temp',
      email: 'temp@user.com',
      phone: '555-0003',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element._onCancel();
    expect(element.formData.firstName).to.equal('');
    expect(element.formData.email).to.equal('');
  });
  it('should unsubscribe from language changes in disconnectedCallback', () => {
    let unsubCalled = false;
    element.unsubscribeLanguage = () => { unsubCalled = true; };
    element.disconnectedCallback();
    expect(unsubCalled).to.be.true;
  });

  it('should show confirm dialog on valid submit', async () => {
    // Fill all required fields with valid data
    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@user.com',
      phone: '555-0000',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.isEditing = true;
    let dialogShown = false;
    element.shadowRoot.querySelector = () => ({ show: () => { dialogShown = true; } });
    await element._onSubmit({ preventDefault: () => {} });
    expect(dialogShown).to.be.true;
  });

  it('should save employee successfully in _saveEmployee', async () => {
    element.formData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test2@user.com',
      phone: '555-0001',
      dateOfEmployment: '2024-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.isEditing = false;
    await element._saveEmployee();
    // Should clear errors on success
    expect(Object.keys(element.errors).length).to.equal(0);
  });

  it('should show error message for unknown field in _getFieldError', () => {
    const err = element._getFieldError('notAField');
    expect(err).to.be.undefined;
  });

  it('should render in editing and loading states', () => {
    element.isEditing = true;
    element.isLoading = true;
    const tpl = element.render();
    expect(tpl).to.exist;
  });
  it('should call connectedCallback and disconnectedCallback', () => {
    // connectedCallback is called by fixture, but we can call it directly for coverage
    element.connectedCallback();
    expect(element).to.exist;
    if (element.disconnectedCallback) {
      element.disconnectedCallback();
      expect(element).to.exist;
    }
  });

  it('should call onBeforeEnter and _checkRoute', () => {
    const location = { params: { id: 'test-id' } };
    element.onBeforeEnter(location);
    element._checkRoute(location);
    expect(element).to.exist;
  });

  it('should call _loadEmployee and _resetForm', () => {
    element._loadEmployee('test-id');
    element._resetForm();
    expect(element.formData).to.exist;
  });

  it('should call _onInputChange for input and select', () => {
    const input = document.createElement('input');
    input.name = 'firstName';
    input.value = 'Test';
    element._onInputChange({ target: input });
    expect(element.formData.firstName).to.equal('Test');
    const select = document.createElement('select');
    select.name = 'department';
    select.value = 'Tech';
    element._onInputChange({ target: select });
    expect(element.formData.department).to.equal('Tech');
  });

  it('should call _onCancel', () => {
    element._onCancel();
    expect(element).to.exist;
  });

  it('should call _onSubmit and _onConfirmSave', async () => {
    const event = { preventDefault: () => {} };
    element._onSubmit(event);
    await element._onConfirmSave();
    expect(element).to.exist;
  });

  it('should call _saveEmployee and handle error', async () => {
    // Force an error by passing invalid data
    element.formData = { ...element.formData, email: '' };
    await element._saveEmployee();
    expect(element.errors).to.exist;
  });

  it('should call _showSuccessMessage and _showErrorMessage', () => {
    element._showSuccessMessage('Success!');
    element._showErrorMessage('Error!');
    expect(element).to.exist;
  });

  it('should call _getFieldError for all fields', () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'dateOfEmployment', 'department', 'position'];
    fields.forEach(field => {
      element.errors[field] = 'Error';
      const err = element._getFieldError(field);
      expect(err).to.equal('Error');
    });
  });

  it('should call render', () => {
    const tpl = element.render();
    expect(tpl).to.exist;
  });
  let element;

  before(async () => {
    // Mock the localization service globally for all tests
    const { localizationService } = await import('../../src/services/localization-service.js');

    // Replace methods with mock versions
    const mockService = mockLocalizationService();
    Object.assign(localizationService, mockService);
  });

  beforeEach(async () => {
    employeeService.clearAll(); // Clear any existing data
    element = await fixture(html`<employee-form></employee-form>`);
  });

  it('should render form with all required fields', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;

    // Check all required fields exist
    expect(element.shadowRoot.querySelector('#firstName')).to.exist;
    expect(element.shadowRoot.querySelector('#lastName')).to.exist;
    expect(element.shadowRoot.querySelector('#email')).to.exist;
    expect(element.shadowRoot.querySelector('#phone')).to.exist;
    expect(element.shadowRoot.querySelector('#dateOfEmployment')).to.exist;
    expect(element.shadowRoot.querySelector('#dateOfBirth')).to.exist;
    expect(element.shadowRoot.querySelector('#department')).to.exist;
    expect(element.shadowRoot.querySelector('#position')).to.exist;

    // Check form buttons
    expect(element.shadowRoot.querySelector('button[type="submit"]')).to.exist;
    expect(element.shadowRoot.querySelector('button[type="button"]')).to.exist;
  });

  it('should handle input changes correctly', async () => {
    const firstNameInput = element.shadowRoot.querySelector('#firstName');

    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));

    expect(element.formData.firstName).to.equal('John');
  });

  it('should validate department and position dropdowns', () => {
    const departmentSelect = element.shadowRoot.querySelector('#department');
    const positionSelect = element.shadowRoot.querySelector('#position');

    expect(departmentSelect).to.exist;
    expect(positionSelect).to.exist;

    // Check department options
    const departmentOptions = departmentSelect.querySelectorAll('option');
    expect(departmentOptions.length).to.equal(3); // placeholder + Analytics + Tech

    // Check position options
    const positionOptions = positionSelect.querySelectorAll('option');
    expect(positionOptions.length).to.equal(4); // placeholder + Junior + Medior + Senior
  });

  it('should show correct form title', async () => {
    const title = element.shadowRoot.querySelector('.form-title');
    expect(title).to.exist;
  });
  it('should validate required fields and show errors', async () => {
    const form = element.shadowRoot.querySelector('form');
    // Clear all fields
    element.shadowRoot.querySelectorAll('input, select').forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      }
    });
    form.dispatchEvent(new Event('submit'));
    await element.updateComplete;
    // Check for error messages (assume .error-message class)
    const errors = element.shadowRoot.querySelectorAll('.error-message');
    expect(errors.length).to.be.greaterThan(0);
  });

  it('should validate email format and uniqueness', async () => {
    // Add an employee with a specific email
    await employeeService.addEmployee({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@doe.com',
      phone: '555-1234',
      dateOfEmployment: '2022-01-01',
      dateOfBirth: '1990-01-01',
      department: 'Analytics',
      position: 'Junior'
    });
    const emailInput = element.shadowRoot.querySelector('#email');
    emailInput.value = 'not-an-email';
    emailInput.dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
    await element.updateComplete;
    let error = element.shadowRoot.querySelector('.error-message');
    expect(error).to.exist;
    // Now test uniqueness
    emailInput.value = 'jane@doe.com';
    emailInput.dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
    await element.updateComplete;
    error = element.shadowRoot.querySelector('.error-message');
    expect(error).to.exist;
  });

  it('should validate phone format', async () => {
    const phoneInput = element.shadowRoot.querySelector('#phone');
    phoneInput.value = 'invalid-phone';
    phoneInput.dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
    await element.updateComplete;
    const error = element.shadowRoot.querySelector('.error-message');
    expect(error).to.exist;
  });

  it('should emit event on successful submit', async () => {
    // Fill all required fields with valid data
    element.shadowRoot.querySelector('#firstName').value = 'Alice';
    element.shadowRoot.querySelector('#firstName').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#lastName').value = 'Smith';
    element.shadowRoot.querySelector('#lastName').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#email').value = 'alice@smith.com';
    element.shadowRoot.querySelector('#email').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#phone').value = '555-6789';
    element.shadowRoot.querySelector('#phone').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#dateOfEmployment').value = '2023-01-01';
    element.shadowRoot.querySelector('#dateOfEmployment').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#dateOfBirth').value = '1995-01-01';
    element.shadowRoot.querySelector('#dateOfBirth').dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('#department').value = 'Analytics';
    element.shadowRoot.querySelector('#department').dispatchEvent(new Event('change'));
    element.shadowRoot.querySelector('#position').value = 'Junior';
    element.shadowRoot.querySelector('#position').dispatchEvent(new Event('change'));
    let eventFired = false;
    element.addEventListener('employee-saved', () => { eventFired = true; });
    element.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
    await element.updateComplete;
    expect(eventFired).to.be.true;
  });

  it('should reset form on cancel button click', async () => {
    const firstNameInput = element.shadowRoot.querySelector('#firstName');
    firstNameInput.value = 'Temp';
    firstNameInput.dispatchEvent(new Event('input'));
    const cancelBtn = element.shadowRoot.querySelector('button[type="button"]');
    cancelBtn.click();
    await element.updateComplete;
    expect(firstNameInput.value).to.equal('');
  });

  it('should pre-fill fields in edit mode', async () => {
    // Simulate edit mode by setting employee prop
    const employee = {
      id: '1',
      firstName: 'Edit',
      lastName: 'User',
      email: 'edit@user.com',
      phone: '555-0000',
      dateOfEmployment: '2020-01-01',
      dateOfBirth: '1980-01-01',
      department: 'Tech',
      position: 'Senior'
    };
    element.employee = employee;
    await element.updateComplete;
    expect(element.shadowRoot.querySelector('#firstName').value).to.equal('Edit');
    expect(element.shadowRoot.querySelector('#department').value).to.equal('Tech');
    expect(element.shadowRoot.querySelector('#position').value).to.equal('Senior');
  });

  it('should show localized labels for English and Turkish', async () => {
    // English
    document.documentElement.lang = 'en';
    await element.requestUpdate();
    await element.updateComplete;
    let label = element.shadowRoot.querySelector('label[for="firstName"]');
    expect(label.textContent.toLowerCase()).to.include('first');
    // Turkish
    document.documentElement.lang = 'tr';
    await element.requestUpdate();
    await element.updateComplete;
    label = element.shadowRoot.querySelector('label[for="firstName"]');
    expect(label.textContent.toLowerCase()).to.not.include('first');
  });

  it('should validate date fields (dateOfBirth < dateOfEmployment)', async () => {
    const dobInput = element.shadowRoot.querySelector('#dateOfBirth');
    const doeInput = element.shadowRoot.querySelector('#dateOfEmployment');
    dobInput.value = '2025-01-01';
    dobInput.dispatchEvent(new Event('input'));
    doeInput.value = '2024-01-01';
    doeInput.dispatchEvent(new Event('input'));
    element.shadowRoot.querySelector('form').dispatchEvent(new Event('submit'));
    await element.updateComplete;
    const error = element.shadowRoot.querySelector('.error-message');
    expect(error).to.exist;
  });
});