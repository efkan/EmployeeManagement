import { css } from 'lit';
import {
  buttonStyles,
  formStyles,
  tableStyles,
  cardStyles,
  paginationStyles,
  emptyStateStyles,
  layoutStyles
} from './shared-styles.js';

export const employeeListStyles = css`
  ${buttonStyles}
  ${formStyles}
  ${tableStyles}
  ${cardStyles}
  ${paginationStyles}
  ${emptyStateStyles}
  ${layoutStyles}

  :host {
    display: block;
    padding: var(--spacing-lg);
  }

  .list-container {
    max-width: 1600px;
    margin: 0 auto 0.7rem auto;
    padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl)
      var(--spacing-xl);
    overflow: hidden;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    gap: var(--spacing-md);
  }

  .list-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--ing-orange);
  }

  .header-actions {
    display: flex;
    gap: var(--spacing-sm);
    align-items: center;
  }

  .search-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-xl);
  }

  /* Desktop: hide separate search container */
  @media (min-width: 769px) {
    .search-container {
      display: none;
    }

    .header-actions .search-input {
      display: block;
    }
  }

  /* Component-specific search input modifications */
  .search-input {
    margin-right: var(--spacing-sm);
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    :host {
      padding: var(--spacing-md);
    }

    .list-header {
      flex-direction: column;
      align-items: stretch;
      gap: var(--spacing-md);
    }

    .header-actions {
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-sm);
    }

    /* Hide search input in header actions on mobile */
    .header-actions .search-input {
      display: none;
    }

    .search-container {
      order: 2;
      margin-bottom: var(--spacing-lg);
      display: flex;
    }

    .search-input {
      min-width: auto;
      flex: 1;
      margin-right: 0;
      width: 100%;
    }

    .employees-table {
      overflow-x: auto;
    }

    .table {
      min-width: 1000px;
    }

    .table th,
    .table td {
      padding: var(--spacing-sm);
    }

    .actions {
      flex-direction: column;
    }

    .employees-list {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .employee-details {
      grid-template-columns: 1fr;
      gap: var(--spacing-xs);
    }

    .employee-card-actions {
      flex-direction: row;
      justify-content: flex-end;
      gap: var(--spacing-xs);
    }
  }

  @media (max-width: 480px) {
    .list-title {
      font-size: var(--font-size-xl);
    }

    .table th,
    .table td {
      padding: var(--spacing-xs);
      font-size: var(--font-size-sm);
    }

    .pagination-container {
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .pagination-controls {
      flex-wrap: wrap;
      justify-content: center;
    }

    .pagination-info {
      margin-right: 0;
      text-align: center;
    }

    .items-per-page {
      margin-left: 0;
      justify-content: center;
    }
  }
`;