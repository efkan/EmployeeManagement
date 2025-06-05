import { LitElement, html } from 'lit';
import { localizationService, currentLanguage } from '../services/localization-service.js';
import { employeeService, employees, viewMode, itemsPerPage } from '../services/employee-service.js';
import { mdiMenu, mdiSquareEditOutline, mdiDelete, mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import { routerService } from '../services/router.js';
import './confirm-dialog.js';
import './ui/mdi-icon.js';

// Import styles from a JS module instead
import { employeeListStyles } from '../styles/employee-list-styles.js';

export class EmployeeList extends LitElement {
  static styles = employeeListStyles;

  static properties = {
    searchQuery: {type: String},
    filteredEmployees: {type: Array},
    paginatedEmployees: {type: Array},
    selectedEmployeeId: {type: String},
    currentLang: {type: String},
    viewMode: {type: String}, // 'list' or 'table'
    currentPage: {type: Number},
    totalPages: {type: Number},
  };

  constructor() {
    super();
    this.searchQuery = '';
    this.filteredEmployees = [];
    this.paginatedEmployees = [];
    this.selectedEmployeeId = null;
    this.currentLang = 'en';
    this.viewMode = 'table'; // Default to table view
    this.currentPage = 1;
    this.totalPages = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('EmployeeList connected');

    // Subscribe to employee store updates
    this.unsubscribeEmployees = employees.subscribe(() => {
      this._updateFilteredEmployees();
    });
    // Subscribe to language changes
    this.unsubscribeLanguage = currentLanguage.subscribe((lang) => {
      console.log('Language changed to:', lang);
      this.currentLang = lang;
      this.requestUpdate();
    });
    // Subscribe to view mode changes
    this.unsubscribeViewMode = viewMode.subscribe((mode) => {
      this.viewMode = mode;
      this.requestUpdate();
    });
    // Subscribe to items per page changes
    this.unsubscribeItemsPerPage = itemsPerPage.subscribe(() => {
      this._updatePagination();
    });
    this._updateFilteredEmployees();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribeEmployees) {
      this.unsubscribeEmployees();
    }
    if (this.unsubscribeLanguage) {
      this.unsubscribeLanguage();
    }
    if (this.unsubscribeViewMode) {
      this.unsubscribeViewMode();
    }
    if (this.unsubscribeItemsPerPage) {
      this.unsubscribeItemsPerPage();
    }
  }

  _updateFilteredEmployees() {
    if (this.searchQuery.trim()) {
      this.filteredEmployees = employeeService.searchEmployees(
        this.searchQuery
      );
    } else {
      this.filteredEmployees = employeeService.getAllEmployees();
    }
    this._updatePagination();
  }

  _updatePagination() {
    const currentItemsPerPage = employeeService.getItemsPerPage();
    this.totalPages = Math.ceil(
      this.filteredEmployees.length / currentItemsPerPage
    );

    // Ensure current page is within valid range
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    // Calculate paginated employees
    const startIndex = (this.currentPage - 1) * currentItemsPerPage;
    const endIndex = startIndex + currentItemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(
      startIndex,
      endIndex
    );
  }

  _onSearchInput(event) {
    this.searchQuery = event.target.value;
    this.currentPage = 1; // Reset to first page when searching
    this._updateFilteredEmployees();
  }

  _onAddEmployee() {
    routerService.navigate('/employees/add');
  }

  _onToggleListFormat() {
    employeeService.setViewMode('list');
  }

  _onToggleTableFormat() {
    employeeService.setViewMode('table');
  }

  _onEditEmployee(employeeId) {
    routerService.navigate(`/employees/edit/${employeeId}`);
  }

  _onDeleteEmployee(employee) {
    this.selectedEmployeeId = employee.id;
    const confirmDialog = this.shadowRoot.querySelector('confirm-dialog');
    confirmDialog.show({
      title: localizationService.t('buttons.delete'),
      message: localizationService.t('messages.confirmDelete'),
      confirmText: localizationService.t('buttons.yes'),
      cancelText: localizationService.t('buttons.no'),
      type: 'danger',
    });
  }

  async _onConfirmDelete() {
    if (!this.selectedEmployeeId) return;

    try {
      const result = await employeeService.deleteEmployee(
        this.selectedEmployeeId
      );
      if (result.success) {
        // Show success message
        console.log(localizationService.t('messages.employeeDeleted'));
      } else {
        console.error('Failed to delete employee:', result.error);
      }
    } catch (error) {
      console.error('Delete employee error:', error);
    } finally {
      this.selectedEmployeeId = null;
    }
  }

  _formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(localizationService.getCurrentLanguage());
  }

  _onPageChange(newPage) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this._updatePagination();
    }
  }

  _onPreviousPage() {
    this._onPageChange(this.currentPage - 1);
  }

  _onNextPage() {
    this._onPageChange(this.currentPage + 1);
  }

  _onItemsPerPageChange(event) {
    const newItemsPerPage = parseInt(event.target.value);
    employeeService.setItemsPerPage(newItemsPerPage);
    this.currentPage = 1; // Reset to first page when changing items per page
    this._updatePagination();
  }

  _getVisiblePageNumbers() {
    const maxVisible = 5;
    const pages = [];

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      const end = Math.min(this.totalPages, start + maxVisible - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  _renderPagination() {
    if (this.totalPages <= 1 && this.filteredEmployees.length > 0) return '';

    const currentItemsPerPage = employeeService.getItemsPerPage();
    const startIndex =
      this.filteredEmployees.length > 0
        ? (this.currentPage - 1) * currentItemsPerPage + 1
        : 0;
    const endIndex = Math.min(
      this.currentPage * currentItemsPerPage,
      this.filteredEmployees.length
    );
    const visiblePages = this._getVisiblePageNumbers();

    return html`
      <div class="pagination-container">
        <div class="pagination-info">
          ${localizationService.t('pagination.showing')}
          ${startIndex}-${endIndex} ${localizationService.t('pagination.of')}
          ${this.filteredEmployees.length}
          ${localizationService.t('pagination.results')}
        </div>
        ${this.totalPages > 1
          ? html`
              <div class="pagination-controls">
                <button
                  class="pagination-btn nav-btn"
                  @click="${this._onPreviousPage}"
                  ?disabled="${this.currentPage === 1}"
                  title="${localizationService.t('pagination.previous')}"
                >
                  <mdi-icon path="${mdiChevronLeft}" size="36"></mdi-icon>
                </button>

                ${visiblePages.map(
                  (page) => html`
                    <button
                      class="pagination-btn ${page === this.currentPage
                        ? 'active'
                        : ''}"
                      @click="${() => this._onPageChange(page)}"
                      title="${localizationService.t(
                        'pagination.page'
                      )} ${page}"
                    >
                      ${page}
                    </button>
                  `
                )}

                <button
                  class="pagination-btn nav-btn"
                  @click="${this._onNextPage}"
                  ?disabled="${this.currentPage === this.totalPages}"
                  title="${localizationService.t('pagination.next')}"
                >
                  <mdi-icon path="${mdiChevronRight}" size="36"></mdi-icon>
                </button>
              </div>

              <div class="items-per-page">
                <select
                  class="items-per-page-select"
                  .value="${String(currentItemsPerPage)}"
                  @change="${this._onItemsPerPageChange}"
                  title="Items per page"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span class="items-per-page-label">per page</span>
              </div>
            `
          : ''}
      </div>
    `;
  }

  _renderEmptyState() {
    return html`
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h3 class="empty-state-title">
          ${this.searchQuery.trim()
            ? localizationService.t('messages.noEmployeesFound')
            : localizationService.t('messages.noEmployeesYet')}
        </h3>
        <p class="empty-state-description">
          ${this.searchQuery.trim()
            ? localizationService.t('messages.adjustSearchMessage')
            : localizationService.t('messages.getStartedMessage')}
        </p>
        ${!this.searchQuery.trim()
          ? html`
              <button class="btn btn-primary" @click="${this._onAddEmployee}">
                ${localizationService.t('nav.addEmployee')}
              </button>
            `
          : ''}
      </div>
    `;
  }

  _renderList() {
    return html`
      <div class="employees-list">
        ${this.paginatedEmployees.map(
          (employee) => html`
            <div class="employee-card">
              <div class="employee-card-header">
                <div>
                  <h3 class="employee-name-card">
                    ${employee.firstName} ${employee.lastName}
                  </h3>
                  <p class="employee-position-card">
                    ${employee.position || '-'}
                    ${employee.department ? `• ${employee.department}` : ''}
                  </p>
                </div>
              </div>

              <div class="employee-details">
                <div class="employee-detail-item">
                  <span class="employee-detail-label"
                    >${localizationService.t('employee.email')}</span
                  >
                  <span class="employee-detail-value">${employee.email}</span>
                </div>
                <div class="employee-detail-item">
                  <span class="employee-detail-label"
                    >${localizationService.t('employee.phone')}</span
                  >
                  <span class="employee-detail-value">${employee.phone}</span>
                </div>
                <div class="employee-detail-item">
                  <span class="employee-detail-label"
                    >${localizationService.t('employee.dateOfEmployment')}</span
                  >
                  <span class="employee-detail-value"
                    >${this._formatDate(employee.dateOfEmployment)}</span
                  >
                </div>
                <div class="employee-detail-item">
                  <span class="employee-detail-label"
                    >${localizationService.t('employee.dateOfBirth')}</span
                  >
                  <span class="employee-detail-value"
                    >${this._formatDate(employee.dateOfBirth)}</span
                  >
                </div>
              </div>

              <div class="employee-card-actions">
                <button
                  class="btn btn-secondary btn-small"
                  @click="${() => this._onEditEmployee(employee.id)}"
                  title="${localizationService.t('buttons.edit')}"
                >
                  <mdi-icon path="${mdiSquareEditOutline}" size="20"></mdi-icon>
                </button>
                <button
                  class="btn btn-danger btn-small"
                  @click="${() => this._onDeleteEmployee(employee)}"
                  title="${localizationService.t('buttons.delete')}"
                >
                  <mdi-icon path="${mdiDelete}" size="20"></mdi-icon>
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  _renderTable() {
    return html`
      <div class="employees-table">
        <table class="table">
          <thead>
            <tr>
              <th>${localizationService.t('employee.firstName')}</th>
              <th>${localizationService.t('employee.lastName')}</th>
              <th>${localizationService.t('employee.dateOfEmployment')}</th>
              <th>${localizationService.t('employee.dateOfBirth')}</th>
              <th>${localizationService.t('employee.phone')}</th>
              <th>${localizationService.t('employee.email')}</th>
              <th>${localizationService.t('employee.department')}</th>
              <th>${localizationService.t('employee.position')}</th>
              <th class="actions-cell">
                ${localizationService.t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            ${this.paginatedEmployees.map(
              (employee) => html`
                <tr>
                  <td>
                    <span class="employee-name">${employee.firstName}</span>
                  </td>
                  <td>
                    <span class="employee-name">${employee.lastName}</span>
                  </td>
                  <td>
                    <span class="employee-date"
                      >${this._formatDate(employee.dateOfEmployment)}</span
                    >
                  </td>
                  <td>
                    <span class="employee-date"
                      >${this._formatDate(employee.dateOfBirth)}</span
                    >
                  </td>
                  <td>${employee.phone}</td>
                  <td>
                    <span class="employee-email">${employee.email}</span>
                  </td>
                  <td>${employee.department || '-'}</td>
                  <td>${employee.position || '-'}</td>
                  <td class="actions-cell">
                    <div class="actions">
                      <button
                        class="btn btn-secondary btn-small"
                        @click="${() => this._onEditEmployee(employee.id)}"
                        title="${localizationService.t('buttons.edit')}"
                      >
                        <mdi-icon
                          path="${mdiSquareEditOutline}"
                          size="20"
                        ></mdi-icon>
                      </button>
                      <button
                        class="btn btn-danger btn-small"
                        @click="${() => this._onDeleteEmployee(employee)}"
                        title="${localizationService.t('buttons.delete')}"
                      >
                        <mdi-icon path="${mdiDelete}" size="20"></mdi-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  render() {
    return html`
      <div class="list-container">
        <div class="list-header">
          <h1 class="list-title">${localizationService.t('employeeList')}</h1>
          <div class="header-actions">
            <input
              type="search"
              class="search-input"
              placeholder="${localizationService.t(
                'placeholders.searchEmployees'
              )}"
              .value="${this.searchQuery}"
              @input="${this._onSearchInput}"
            />
            <button
              class="btn-icon ${this.viewMode === 'table' ? 'active' : ''}"
              @click="${this._onToggleTableFormat}"
              title="${localizationService.t('buttons.tableFormat')}"
            >
              <mdi-icon path="${mdiMenu}" size="34"></mdi-icon>
            </button>
            <button
              class="btn-icon ${this.viewMode === 'list' ? 'active' : ''}"
              @click="${this._onToggleListFormat}"
              title="${localizationService.t('buttons.listFormat')}"
            >
              <mdi-icon asset="apps.svg" size="34"></mdi-icon>
            </button>
          </div>
        </div>

        <div class="search-container">
          <input
            type="search"
            class="search-input"
            placeholder="${localizationService.t(
              'placeholders.searchEmployees'
            )}"
            .value="${this.searchQuery}"
            @input="${this._onSearchInput}"
          />
        </div>

        ${this.filteredEmployees.length === 0
          ? this._renderEmptyState()
          : html`
              ${this.viewMode === 'list'
                ? this._renderList()
                : this._renderTable()}
              ${this._renderPagination()}
            `}
      </div>

      <confirm-dialog
        @dialog-confirm="${this._onConfirmDelete}"
      ></confirm-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);