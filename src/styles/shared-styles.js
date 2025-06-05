import { css } from 'lit';

// Common button styles used across components
export const buttonStyles = css`
  .btn {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius-md);
    border: 1px solid transparent;
    font-size: var(--font-size-base);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    min-width: 120px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    text-decoration: none;
  }

  .btn:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: var(--ing-orange);
    color: var(--white);
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--ing-orange-hover);
  }

  .btn-secondary {
    background-color: var(--white);
    color: var(--gray-700);
    border-color: var(--gray-300);
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: var(--gray-50);
    border-color: var(--gray-400);
  }

  .btn-danger {
    background-color: var(--danger-color);
    color: var(--white);
  }

  .btn-danger:hover:not(:disabled) {
    background-color: var(--danger-hover);
  }

  .btn-small {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    min-width: 80px;
  }

  .btn-icon {
    padding: var(--spacing-sm);
    min-width: auto;
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    color: var(--ing-orange);
    opacity: 0.5;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-icon:hover {
    background-color: var(--ing-orange-light);
  }

  .btn-icon.active {
    color: var(--ing-orange);
    opacity: 1;
  }

  .btn-icon.active:hover {
    background-color: var(--ing-orange-light);
  }

  /* Action buttons in table/list - no borders, no background, ING orange color */
  .actions .btn,
  .actions .btn.btn-secondary,
  .actions .btn.btn-danger {
    background-color: transparent !important;
    border: none !important;
    color: var(--ing-orange) !important;
    padding: var(--spacing-xs);
    min-width: auto;
  }

  .actions .btn:hover,
  .actions .btn.btn-secondary:hover,
  .actions .btn.btn-danger:hover {
    background-color: var(--ing-orange-light) !important;
    border: none !important;
    color: var(--ing-orange) !important;
  }

  .employee-card-actions .btn,
  .employee-card-actions .btn.btn-secondary,
  .employee-card-actions .btn.btn-danger {
    background-color: transparent !important;
    border: none !important;
    color: var(--ing-orange) !important;
    padding: var(--spacing-xs);
    min-width: auto;
  }

  .employee-card-actions .btn:hover,
  .employee-card-actions .btn.btn-secondary:hover,
  .employee-card-actions .btn.btn-danger:hover {
    background-color: var(--ing-orange-light) !important;
    border: none !important;
    color: var(--ing-orange) !important;
  }

  /* Button icon styles */
  .btn mdi-icon {
    flex-shrink: 0;
  }

  .btn-secondary mdi-icon {
    color: var(--gray-700);
  }

  .btn-danger mdi-icon {
    color: white;
  }

  /* Action buttons icons should use ING orange color */
  .actions .btn mdi-icon,
  .actions .btn.btn-secondary mdi-icon,
  .actions .btn.btn-danger mdi-icon,
  .employee-card-actions .btn mdi-icon,
  .employee-card-actions .btn.btn-secondary mdi-icon,
  .employee-card-actions .btn.btn-danger mdi-icon {
    color: var(--ing-orange) !important;
  }
`;

// Common form styles used across components
export const formStyles = css`
  .form-group {
    margin-bottom: var(--spacing-lg);
    position: relative;
    z-index: auto;
  }

  .form-label {
    display: block;
    font-weight: 500;
    color: var(--ing-orange);
    margin-bottom: var(--spacing-sm);
    font-size: var(--font-size-sm);
  }

  .form-input {
    padding: var(--spacing-md) 0;
    border: none;
    border-bottom: 2px solid var(--ing-orange);
    border-radius: 0;
    background: transparent;
    font-size: var(--font-size-base);
    transition: all var(--transition-fast);
    width: 100%;
    box-sizing: border-box;
    height: 52.5px;
    line-height: 1.5;
    box-shadow: inset 0 -1px 0 0 transparent;
  }

  .form-input:focus {
    outline: none;
    box-shadow: inset 0 -1px 0 0 var(--ing-orange);
  }

  .form-input.error {
    border-bottom-color: var(--danger-color);
  }

  .form-input.error:focus {
    box-shadow: inset 0 -1px 0 0 var(--danger-color);
  }

  .form-error {
    display: block;
    color: var(--danger-color);
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
  }

  select.form-input {
    appearance: auto;
    -webkit-appearance: auto;
    -moz-appearance: auto;
    cursor: pointer;
    z-index: 1;
  }

  select.form-input:focus {
    z-index: 1000;
    outline: 2px solid var(--ing-orange);
    outline-offset: 2px;
  }

  .search-input {
    padding: var(--spacing-sm) 0;
    border: none;
    border-bottom: 2px solid var(--ing-orange);
    border-radius: 0;
    background: transparent;
    font-size: var(--font-size-base);
    transition: all var(--transition-fast);
    min-width: 200px;
  }

  .search-input:focus {
    outline: none;
    border-bottom-color: var(--ing-orange);
  }

  /* Style the native search cancel button (X icon) */
  .search-input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M18 6L6 18M6 6l12 12' stroke='%23FF6200' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: 16px 16px;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    margin-left: 8px;
  }

  .search-input::-webkit-search-cancel-button:hover {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M18 6L6 18M6 6l12 12' stroke='%23e55a00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    opacity: 0.8;
  }
`;

// Common loading and animation styles
export const loadingStyles = css`
  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading-spinner-lg {
    width: 24px;
    height: 24px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Common layout utilities
export const layoutStyles = css`
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .gap-sm {
    gap: var(--spacing-sm);
  }

  .gap-md {
    gap: var(--spacing-md);
  }

  .gap-lg {
    gap: var(--spacing-lg);
  }

  .ml-auto {
    margin-left: auto;
  }

  .w-full {
    width: 100%;
  }

  .text-center {
    text-align: center;
  }
`;

// Common table styles
export const tableStyles = css`
  .employees-table {
    width: 100%;
    background-color: var(--content-background);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th,
  .table td {
    padding: var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid var(--gray-200);
  }

  .table th {
    font-weight: 600;
    color: var(--ing-orange);
    font-size: var(--font-size-sm);
    letter-spacing: 0.05em;
  }

  .table td {
    color: var(--gray-900);
  }

  .table tbody tr:hover {
    background-color: var(--gray-100);
  }

  .table tbody tr:last-child td {
    border-bottom: none;
  }

  .employee-name {
    font-weight: 500;
  }

  .employee-email {
    color: var(--gray-600);
  }

  .employee-date {
    color: var(--gray-600);
    font-size: var(--font-size-sm);
  }

  .actions-cell {
    width: 140px;
  }

  .actions {
    display: flex;
    gap: var(--spacing-xs);
  }
`;

// Common card styles
export const cardStyles = css`
  .employees-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
  }

  .employee-card {
    background: var(--content-background);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
    display: flex;
    flex-direction: column;
  }

  .employee-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  .employee-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
  }

  .employee-name-card {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ing-orange);
    margin: 0;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .employee-position-card {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
    margin: var(--spacing-xs) 0 0 0;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .employee-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    flex-grow: 1;
  }

  .employee-detail-item {
    display: flex;
    flex-direction: column;
  }

  .employee-detail-label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--gray-600);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: var(--spacing-xs);
  }

  .employee-detail-value {
    font-size: var(--font-size-sm);
    color: var(--gray-800);
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .employee-card-actions {
    display: flex;
    gap: var(--spacing-sm);
    justify-content: flex-end;
    border-top: 1px solid var(--border-color);
    padding-top: var(--spacing-md);
    margin-top: auto;
  }
`;

// Common pagination styles
export const paginationStyles = css`
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
  }

  .pagination-info {
    color: var(--gray-600);
    font-size: var(--font-size-sm);
    margin-right: var(--spacing-md);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .pagination-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: none;
    background-color: transparent;
    color: var(--gray-700);
    cursor: pointer;
    border-radius: 50%;
    transition: all var(--transition-fast);
    font-size: var(--font-size-sm);
    min-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination-btn.nav-btn {
    color: var(--ing-orange);
    font-weight: bold;
    min-width: 48px;
    height: 48px;
    font-size: var(--font-size-xl);
  }

  .pagination-btn.nav-btn mdi-icon {
    color: var(--ing-orange);
  }

  .pagination-btn.nav-btn:hover:not(:disabled) {
    background-color: var(--ing-orange-light);
    color: var(--ing-orange-hover);
  }

  .pagination-btn.nav-btn:hover:not(:disabled) mdi-icon {
    color: var(--ing-orange-hover);
  }

  .pagination-btn:hover:not(:disabled):not(.active) {
    background-color: var(--gray-100);
  }

  .pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    color: var(--gray-400);
  }

  .pagination-btn.nav-btn:disabled {
    opacity: 0.3;
    color: var(--gray-400);
  }

  .pagination-btn.nav-btn:disabled mdi-icon {
    color: var(--gray-400);
  }

  .pagination-btn.active {
    background-color: var(--ing-orange);
    color: var(--white);
    border: none;
  }

  .pagination-btn.active:hover {
    background-color: var(--ing-orange-hover);
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    margin-left: var(--spacing-md);
  }

  .items-per-page-select {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-md);
    background-color: var(--white);
    color: var(--gray-700);
    font-size: var(--font-size-sm);
    cursor: pointer;
  }

  .items-per-page-select:focus {
    outline: 2px solid var(--ing-orange);
    outline-offset: 2px;
    border-color: var(--ing-orange);
  }

  .items-per-page-label {
    font-size: var(--font-size-sm);
    color: var(--gray-600);
  }
`;

// Empty state styles
export const emptyStateStyles = css`
  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--gray-500);
  }

  .empty-state-icon {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-md);
  }

  .empty-state-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--gray-700);
  }

  .empty-state-description {
    margin-bottom: var(--spacing-lg);
  }
`;
