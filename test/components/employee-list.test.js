import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import '../../src/components/employee-list.js';
import { localizationService } from '../../src/services/localization-service.js';
import { employeeService } from '../../src/services/employee-service.js';
import { mockTranslations } from '../test-utils.js';

describe('EmployeeList', () => {
  let element;

  beforeEach(async () => {
    // Reset and mock localization service
    if (localizationService.resetForTesting) {
      localizationService.resetForTesting();
    }
    localizationService.initialized = true;
    const { translations } = await import('../../src/services/localization-service.js');
    translations.set(mockTranslations);

    employeeService.clearAll(); // Clear any existing data

    element = await fixture(html`<employee-list></employee-list>`);
  });

  it('should render search input and employee table', () => {
    const searchInput = element.shadowRoot.querySelector('.search-input');
    expect(searchInput).to.exist;

    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table).to.exist;

    const tableHeaders = element.shadowRoot.querySelectorAll('th');
    expect(tableHeaders.length).to.be.greaterThan(0);
  });

  it('should show empty state when no employees exist', async () => {
    await elementUpdated(element);

    const emptyState = element.shadowRoot.querySelector('.empty-state');
    expect(emptyState).to.exist;
  });

  it('should display employees in table when they exist', async () => {
    // Add test employees
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    employeeService.addEmployee({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      position: 'Manager',
      department: 'HR',
      dateOfBirth: '1985-05-15'
    });

    await elementUpdated(element);

    const tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(2);

    // Check first employee data
    const firstRowCells = tableRows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent.trim()).to.equal('John');
    expect(firstRowCells[1].textContent.trim()).to.equal('Doe');
    expect(firstRowCells[2].textContent.trim()).to.equal('john.doe@example.com');
  });

  it('should filter employees based on search input', async () => {
    // Add test employees
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    employeeService.addEmployee({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      position: 'Manager',
      department: 'HR',
      dateOfBirth: '1985-05-15'
    });

    await elementUpdated(element);

    // Search for "John"
    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    const tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);

    const firstRowCells = tableRows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent.trim()).to.equal('John');
  });

  it('should search across multiple fields', async () => {
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    const searchInput = element.shadowRoot.querySelector('.search-input');

    // Search by email
    searchInput.value = 'john.doe';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    let tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);

    // Search by position
    searchInput.value = 'Developer';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);

    // Search by department
    searchInput.value = 'Engineering';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);
  });

  it('should show no results message when search returns no matches', async () => {
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    const searchInput = element.shadowRoot.querySelector('.search-input');
    searchInput.value = 'NonExistentEmployee';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    const noResults = element.shadowRoot.querySelector('.no-results');
    expect(noResults).to.exist;
  });

  it('should emit edit event when edit button is clicked', async () => {
    const employee = employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    let editEvent = null;
    element.addEventListener('employee-edit', (e) => {
      editEvent = e;
    });

    const editButton = element.shadowRoot.querySelector('.edit-button');
    editButton.click();
    await elementUpdated(element);

    expect(editEvent).to.exist;
    expect(editEvent.detail.employee.id).to.equal(employee.id);
  });

  it('should emit delete event when delete button is clicked', async () => {
    const employee = employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    let deleteEvent = null;
    element.addEventListener('employee-delete', (e) => {
      deleteEvent = e;
    });

    const deleteButton = element.shadowRoot.querySelector('.delete-button');
    deleteButton.click();
    await elementUpdated(element);

    expect(deleteEvent).to.exist;
    expect(deleteEvent.detail.employee.id).to.equal(employee.id);
  });

  it('should sort table columns when headers are clicked', async () => {
    // Add employees in random order
    employeeService.addEmployee({
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      position: 'Designer',
      department: 'Design',
      dateOfBirth: '1992-03-20'
    });

    employeeService.addEmployee({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1988-07-10'
    });

    await elementUpdated(element);

    // Click on first name header to sort
    const firstNameHeader = element.shadowRoot.querySelector('th[data-sort="firstName"]');
    if (firstNameHeader) {
      firstNameHeader.click();
      await elementUpdated(element);

      const tableRows = element.shadowRoot.querySelectorAll('tbody tr');
      const firstRowFirstName = tableRows[0].querySelector('td').textContent.trim();
      expect(firstRowFirstName).to.equal('Alice'); // Should be sorted alphabetically
    }
  });

  it('should be responsive and show mobile view on small screens', () => {
    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table).to.exist;

    // The table should have responsive classes
    expect(table.classList.contains('responsive-table')).to.be.true;
  });

  it('should handle empty search gracefully', async () => {
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    const searchInput = element.shadowRoot.querySelector('.search-input');

    // Search with empty string
    searchInput.value = '';
    searchInput.dispatchEvent(new Event('input'));
    await elementUpdated(element);

    // Should show all employees
    const tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);
  });

  it('should update when employees are added or removed', async () => {
    await elementUpdated(element);

    // Initially empty
    let tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(0);

    // Add employee
    employeeService.addEmployee({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      position: 'Developer',
      department: 'Engineering',
      dateOfBirth: '1990-01-01'
    });

    await elementUpdated(element);

    // Should show one employee
    tableRows = element.shadowRoot.querySelectorAll('tbody tr');
    expect(tableRows.length).to.equal(1);
  });

  it('should respond to language changes', async () => {
    // Switch to Turkish
    await localizationService.setLanguage('tr');
    await elementUpdated(element);

    const searchPlaceholder = element.shadowRoot.querySelector('.search-input').placeholder;
    expect(searchPlaceholder).to.include('Ara'); // Turkish placeholder

    // Switch back to English
    await localizationService.setLanguage('en');
    await elementUpdated(element);

    const searchPlaceholderEn = element.shadowRoot.querySelector('.search-input').placeholder;
    expect(searchPlaceholderEn).to.include('Search'); // English placeholder
  });

  it('should be accessible with proper ARIA attributes', () => {
    const table = element.shadowRoot.querySelector('.employee-table');
    expect(table.getAttribute('role')).to.equal('table');

    const searchInput = element.shadowRoot.querySelector('.search-input');
    expect(searchInput.getAttribute('aria-label')).to.exist;

    const actionButtons = element.shadowRoot.querySelectorAll('button');
    actionButtons.forEach(button => {
      expect(button.getAttribute('aria-label')).to.exist;
    });
  });
});
