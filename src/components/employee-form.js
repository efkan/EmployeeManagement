import { LitElement, html } from 'lit';
import { localizationService, currentLanguage } from '../services/localization-service.js';
import { employeeService } from '../services/employee-service.js';
import { routerService } from '../services/router.js';
import { validationService } from '../services/validation-service.js';
import { employeeFormStyles } from '../styles/employee-form.js';
import './confirm-dialog.js';

export class EmployeeForm extends LitElement {
  static styles = employeeFormStyles;

  static properties = {
    employeeId: { type: String },
    isEditing: { type: Boolean },
    isLoading: { type: Boolean },
    formData: { type: Object },
    errors: { type: Object },
    currentLang: { type: String }
  };

  constructor() {
    super();
    this.employeeId = null;
    this.isEditing = false;
    this.isLoading = false;
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: ''
    };
    this.errors = {};
    this.currentLang = 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    // Subscribe to language changes
    this.unsubscribeLanguage = currentLanguage.subscribe((lang) => {
      console.log('Language changed to:', lang);
      this.currentLang = lang;
      this.requestUpdate();
    });
    this._checkRoute();
  }

  /**
   * Vaadin Router lifecycle hook - called before each route navigation
   * This ensures the component state is properly reset when navigating between
   * /employees/add and /employees/edit/:id routes
   */
  onBeforeEnter(location) {
    // Always use the location parameter passed by the router - never fall back to routerService
    // during lifecycle callbacks as routerService.getCurrentLocation() may return stale data
    this._checkRoute(location);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeLanguage) {
      this.unsubscribeLanguage();
    }
  }

  _checkRoute(location) {
    // When called from onBeforeEnter, location parameter contains the correct new route info
    // When called from connectedCallback, location is undefined so we use routerService
    const currentLocation = location || routerService.getCurrentLocation();

    // Always reset state first to ensure clean transition
    this.employeeId = null;
    this.isEditing = false;
    this.errors = {};

    if (currentLocation && currentLocation.params && currentLocation.params.id) {
      this.employeeId = currentLocation.params.id;
      this.isEditing = true;
      this._loadEmployee();
    } else {
      this._resetForm();
    }
  }

  _loadEmployee() {
    const employee = employeeService.getEmployeeById(this.employeeId);
    if (employee) {
      this.formData = {
        firstName: employee.firstName || '',
        lastName: employee.lastName || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfEmployment: employee.dateOfEmployment || '',
        dateOfBirth: employee.dateOfBirth || '',
        department: employee.department || '',
        position: employee.position || ''
      };
    } else {
      // Employee not found, redirect to employees list
      routerService.navigate('/employees');
    }
  }

  _resetForm() {
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: ''
    };
    this.errors = {};
  }

  _onInputChange(event) {
    const { name, value } = event.target;
    this.formData = {
      ...this.formData,
      [name]: value
    };

    // Real-time validation for the changed field
    this._validateField(name, value);
  }

  /**
   * Validates a single field in real-time
   * @param {string} fieldName
   * @param {string} value
   */
  _validateField(fieldName, value) {
    const tempEmployee = { ...this.formData, [fieldName]: value };
    const existingEmployees = employeeService.getAllEmployees();

    const fieldErrors = validationService.validateEmployee(tempEmployee, {
      isEditing: this.isEditing,
      currentEmployeeId: this.employeeId,
      existingEmployees
    });

    // Update only the error for this specific field
    this.errors = {
      ...this.errors,
      [fieldName]: fieldErrors[fieldName] || null
    };
  }

  /**
   * Validates the entire form
   * @returns {boolean} True if form is valid, false otherwise
   */
  _validateForm() {
    const existingEmployees = employeeService.getAllEmployees();

    const errors = validationService.validateEmployee(this.formData, {
      isEditing: this.isEditing,
      currentEmployeeId: this.employeeId,
      existingEmployees
    });

    this.errors = errors;
    return !validationService.hasErrors(errors);
  }

  _onCancel() {
    routerService.navigate('/employees');
  }

  async _onSubmit(event) {
    event.preventDefault();

    if (this.isLoading) return;

    // Show confirmation dialog for editing
    if (this.isEditing) {
      const confirmDialog = this.shadowRoot.querySelector('confirm-dialog');
      confirmDialog.show({
        title: localizationService.t('buttons.confirm'),
        message: localizationService.t('messages.confirmUpdate'),
        confirmText: localizationService.t('buttons.yes'),
        cancelText: localizationService.t('buttons.no'),
        type: 'primary'
      });
      return;
    }

    // Direct save for new employee
    await this._saveEmployee();
  }

  async _onConfirmSave() {
    await this._saveEmployee();
  }

  async _saveEmployee() {
    this.isLoading = true;

    // Validate form before saving
    if (!this._validateForm()) {
      this.isLoading = false;
      return;
    }

    try {
      let result;

      if (this.isEditing) {
        result = await employeeService.updateEmployee(this.employeeId, this.formData);
      } else {
        result = await employeeService.addEmployee(this.formData);
      }

      if (result.success) {
        // Show success message and navigate back
        this._showSuccessMessage();
        routerService.navigate('/employees');
      } else {
        // Show validation errors
        if (result.errors) {
          this.errors = result.errors;
        } else {
          this._showErrorMessage(result.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Save employee error:', error);
      this._showErrorMessage('An unexpected error occurred');
    } finally {
      this.isLoading = false;
    }
  }

  _showSuccessMessage() {
    const message = this.isEditing
      ? localizationService.t('messages.employeeUpdated')
      : localizationService.t('messages.employeeAdded');

    // In a real app, you might show a toast notification here
    console.log(message);
  }

  _showErrorMessage(message) {
    // In a real app, you might show a toast notification here
    console.error(message);
  }

  _getFieldError(fieldName) {
    const errorKey = this.errors[fieldName];
    return errorKey ? localizationService.t(errorKey) : '';
  }

  render() {
    const title = this.isEditing
      ? `${localizationService.t('buttons.edit')} ${localizationService.t('nav.employees').slice(0, -1)}`
      : localizationService.t('nav.addEmployee');

    return html`
      <div class="form-container">
        <div class="form-header">
          <h1 class="form-title">${title}</h1>
        </div>

        <form @submit="${this._onSubmit}">
          <div class="form-fields">
            <!-- First Name and Last Name Row -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="firstName">
                  ${localizationService.t('employee.firstName')}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  class="form-input ${this.errors.firstName ? 'error' : ''}"
                  .value="${this.formData.firstName}"
                  placeholder="${localizationService.t(
                    'placeholders.enterFirstName'
                  )}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.firstName
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('firstName')}</span
                      >
                    `
                  : ''}
              </div>

              <div class="form-group">
                <label class="form-label" for="lastName">
                  ${localizationService.t('employee.lastName')}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  class="form-input ${this.errors.lastName ? 'error' : ''}"
                  .value="${this.formData.lastName}"
                  placeholder="${localizationService.t(
                    'placeholders.enterLastName'
                  )}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.lastName
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('lastName')}</span
                      >
                    `
                  : ''}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="email">
                  ${localizationService.t('employee.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="form-input ${this.errors.email
                    ? 'error'
                    : ''}"
                  .value="${this.formData.email}"
                  placeholder="${localizationService.t(
                    'placeholders.enterEmail'
                  )}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.email
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('email')}</span
                      >
                    `
                  : ''}
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">
                  ${localizationService.t('employee.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  class="form-input ${this.errors.phone ? 'error' : ''}"
                  .value="${this.formData.phone}"
                  placeholder="${localizationService.t(
                    'placeholders.enterPhone'
                  )}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.phone
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('phone')}</span
                      >
                    `
                  : ''}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="dateOfBirth">
                  ${localizationService.t('employee.dateOfBirth')}
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  class="form-input ${this.errors.dateOfBirth
                    ? 'error'
                    : ''}"
                  .value="${this.formData.dateOfBirth}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.dateOfBirth
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('dateOfBirth')}</span
                      >
                    `
                  : ''}
              </div>

              <div class="form-group">
                <label class="form-label" for="dateOfEmployment">
                  ${localizationService.t('employee.dateOfEmployment')}
                </label>
                <input
                  type="date"
                  id="dateOfEmployment"
                  name="dateOfEmployment"
                  class="form-input ${this.errors.dateOfEmployment
                    ? 'error'
                    : ''}"
                  .value="${this.formData.dateOfEmployment}"
                  @input="${this._onInputChange}"
                  required
                />
                ${this.errors.dateOfEmployment
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('dateOfEmployment')}</span
                      >
                    `
                  : ''}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="department">
                  ${localizationService.t('employee.department')}
                </label>
                <select
                  id="department"
                  name="department"
                  class="form-input ${this.errors.department ? 'error' : ''}"
                  .value="${this.formData.department}"
                  @change="${this._onInputChange}"
                  required
                >
                  <option value="">
                    ${localizationService.t('placeholders.selectDepartment')}
                  </option>
                  <option value="Analytics">Analytics</option>
                  <option value="Tech">Tech</option>
                </select>
                ${this.errors.department
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('department')}</span
                      >
                    `
                  : ''}
              </div>

              <div class="form-group">
                <label class="form-label" for="position">
                  ${localizationService.t('employee.position')}
                </label>
                <select
                  id="position"
                  name="position"
                  class="form-input ${this.errors.position ? 'error' : ''}"
                  .value="${this.formData.position}"
                  @change="${this._onInputChange}"
                  required
                >
                  <option value="">
                    ${localizationService.t('placeholders.selectPosition')}
                  </option>
                  <option value="Junior">Junior</option>
                  <option value="Medior">Medior</option>
                  <option value="Senior">Senior</option>
                </select>
                ${this.errors.position
                  ? html`
                      <span class="form-error"
                        >${this._getFieldError('position')}</span
                      >
                    `
                  : ''}
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click="${this._onCancel}"
            >
              ${localizationService.t('buttons.cancel')}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              ?disabled="${this.isLoading}"
            >
              ${this.isLoading
                ? html`
                    <span class="loading-spinner"></span>
                    ${localizationService.t('buttons.save')}
                  `
                : localizationService.t('buttons.save')}
            </button>
          </div>
        </form>
      </div>

      <confirm-dialog @dialog-confirm="${this._onConfirmSave}"></confirm-dialog>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
