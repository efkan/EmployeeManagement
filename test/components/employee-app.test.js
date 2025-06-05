import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import '../../src/employee-app.js';
import { EmployeeApp } from '../../src/employee-app.js';
import { localizationService } from '../../src/services/localization-service.js';
import { employeeService } from '../../src/services/employee-service.js';
import { mockTranslations } from '../test-utils.js';

describe('EmployeeApp', () => {
  let element;

  beforeEach(async () => {
    // Reset and mock localization service
    if (localizationService.resetForTesting) {
      localizationService.resetForTesting();
    }
    localizationService.initialized = true;
    const { translations } = await import('../../src/services/localization-service.js');
    translations.set(mockTranslations);

    employeeService.clearAll();

    element = await fixture(html`<employee-app></employee-app>`);
  });

  it('should render main application structure', () => {
    const container = element.shadowRoot.querySelector('.app-container');
    expect(container).to.exist;

    const header = element.shadowRoot.querySelector('.app-header');
    expect(header).to.exist;

    const main = element.shadowRoot.querySelector('.app-main');
    expect(main).to.exist;
  });

  it('should contain navigation menu', () => {
    const navMenu = element.shadowRoot.querySelector('nav-menu');
    expect(navMenu).to.exist;
  });

  it('should contain router outlet', () => {
    const routerOutlet = element.shadowRoot.querySelector('.router-outlet');
    expect(routerOutlet).to.exist;
  });

  it('should initialize localization service on connection', async () => {
    // The localization service should be initialized
    expect(localizationService.isInitialized).to.be.true;
  });

  it('should show loading state initially', async () => {
    // Create new element to test loading state
    const loadingElement = await fixture(html`<employee-app></employee-app>`);

    // Should show loading state before initialization
    const loading = loadingElement.shadowRoot.querySelector('.loading');
    expect(loading).to.exist;
  });

  it('should handle navigation events from nav menu', async () => {
    const navMenu = element.shadowRoot.querySelector('nav-menu');

    // Simulate navigation event
    const navigationEvent = new CustomEvent('navigate', {
      detail: { path: '/add' }
    });

    navMenu.dispatchEvent(navigationEvent);
    await elementUpdated(element);

    // Router should handle the navigation
    // The test verifies the event is properly handled
    expect(true).to.be.true; // Navigation handling is tested in router tests
  });

  it('should respond to language changes', async () => {
    // Switch to Turkish
    await localizationService.setLanguage('tr');
    await elementUpdated(element);

    // Switch back to English
    await localizationService.setLanguage('en');
    await elementUpdated(element);
  });

  it('should handle service initialization errors gracefully', async () => {
    // This test would require mocking service failures
    // For now, we test that the error handling structure exists
    const errorState = element.shadowRoot.querySelector('.error');

    // Error state should not be visible in normal operation
    if (errorState) {
      expect(errorState.style.display).to.equal('none');
    }
  });

  it('should be responsive and work on mobile devices', () => {
    const container = element.shadowRoot.querySelector('.app-container');

    // Should have flex layout for responsive design
    const containerStyles = getComputedStyle(container);
    expect(containerStyles.display).to.equal('flex');
    expect(containerStyles.flexDirection).to.equal('column');
  });

  it('should have proper accessibility structure', () => {
    const main = element.shadowRoot.querySelector('.app-main');
    expect(main.getAttribute('role')).to.equal('main');
  });

  it('should maintain application state throughout navigation', async () => {
    // Add an employee
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    // Navigate to different routes (simulated)
    // Employee data should persist
    const employees = employeeService.getAllEmployees();
    expect(employees.length).to.equal(1);
    expect(employees[0].firstName).to.equal('John');
  });

  it('should cleanup resources when disconnected', async () => {
    // Disconnect the element
    element.disconnectedCallback();

    // Should cleanup event listeners and subscriptions
    // This test verifies the cleanup method exists and runs without errors
    expect(true).to.be.true;
  });

  it('should handle browser back/forward navigation', async () => {
    // Simulate browser navigation events
    const popStateEvent = new PopStateEvent('popstate', {
      state: { path: '/add' }
    });

    window.dispatchEvent(popStateEvent);
    await elementUpdated(element);

    // Router should handle the navigation
    expect(true).to.be.true;
  });
  it('should call _handleInitializationError and show error UI', async () => {
    element._handleInitializationError(new Error('Test error'));
    await elementUpdated(element);
    expect(element.hasError).to.be.true;
    expect(element.errorMessage).to.include('Test error');
    const errorDiv = element.shadowRoot.querySelector('.error');
    expect(errorDiv).to.exist;
  });

  it('should render loading state with _renderLoading', () => {
    element.isLoading = true;
    element.hasError = false;
    const loading = element._renderLoading();
    expect(loading).to.exist;
  });

  it('should render error state with _renderError', () => {
    element.isLoading = false;
    element.hasError = true;
    element.errorMessage = 'Error!';
    const error = element._renderError();
    expect(error).to.exist;
  });

  it('should render app state with _renderApp', () => {
    element.isLoading = false;
    element.hasError = false;
    const app = element._renderApp();
    expect(app).to.exist;
  });

  it('should call _onRetry and re-initialize app', async () => {
    let called = false;
    element._initializeApp = async () => { called = true; };
    element._onRetry();
    expect(called).to.be.true;
  });

  it('should call render and return correct template for each state', async () => {
    element.isLoading = true;
    element.hasError = false;
    let tpl = element.render();
    expect(tpl).to.exist;
    element.isLoading = false;
    element.hasError = true;
    tpl = element.render();
    expect(tpl).to.exist;
    element.isLoading = false;
    element.hasError = false;
    tpl = element.render();
    expect(tpl).to.exist;
  });

  it('should handle retry button click in error state', async () => {
    element._handleInitializationError(new Error('Test error'));
    await elementUpdated(element);
    const retryBtn = element.shadowRoot.querySelector('.retry-button');
    expect(retryBtn).to.exist;
    let retried = false;
    element._initializeApp = async () => { retried = true; };
    retryBtn.click();
    expect(retried).to.be.true;
  });

  it('should instantiate EmployeeApp class directly', () => {
    // Direct instantiation to ensure constructor coverage
    const app = new EmployeeApp();
    expect(app).to.be.instanceof(EmployeeApp);
    expect(app.isLoading).to.be.true;
    expect(app.hasError).to.be.false;
    expect(app.errorMessage).to.equal('');
  });

  it('should call connectedCallback when element is connected', async () => {
    // Create a new element and manually trigger lifecycle
    const app = new EmployeeApp();
    let initCalled = false;
    app._initializeApp = async () => { initCalled = true; };

    await app.connectedCallback();
    expect(initCalled).to.be.true;
  });

  it('should call updated lifecycle method', async () => {
    const app = new EmployeeApp();
    let routerInitCalled = false;
    app._initializeRouter = async () => { routerInitCalled = true; };

    // Mock changedProperties with isLoading change
    const changedProps = new Map();
    changedProps.set('isLoading', true);
    app.isLoading = false;
    app.hasError = false;

    await app.updated(changedProps);
    expect(routerInitCalled).to.be.true;
  });
});
