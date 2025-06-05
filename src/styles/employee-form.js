import { css } from 'lit';
import { buttonStyles, formStyles, loadingStyles, layoutStyles } from './shared-styles.js';

export const employeeFormStyles = css`
  ${buttonStyles}
  ${formStyles}
  ${loadingStyles}
  ${layoutStyles}

  :host {
    display: block;
    padding: var(--spacing-lg);
    /* Ensure dropdowns are not clipped */
    overflow: visible;
  }

  .form-container {
    max-width: 640px;
    margin: 3rem auto;
    background-color: var(--content-background);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    position: relative;
    z-index: 1;
    overflow: visible;
  }

  /* Component-specific styles only */
  .form-header {
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }

  .form-title {
    font-size: var(--font-size-2xl);
    font-weight: 600;
    color: var(--gray-900);
    margin: 0;
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--gray-200);
  }

  /* Select specific styling to match input fields */
  .form-input[type="date"],
  select.form-input {
    padding: var(--spacing-md) 0;
    cursor: pointer;
  }

  /* Custom styling for select elements */
  select.form-input {
    /* Keep native appearance for better dropdown positioning */
    appearance: auto;
    -webkit-appearance: auto;
    -moz-appearance: auto;
    /* Ensure proper positioning context */
    position: relative;
    z-index: 1;
    /* Remove custom arrow since we're keeping native appearance */
    background-image: none;
    padding-right: 0;
  }

  /* Style select on focus for better UX */
  select.form-input:focus {
    /* Ensure dropdown appears above other elements */
    z-index: 1000;
  }

  /* Style the select dropdown options */
  select.form-input option {
    background-color: var(--white);
    color: var(--gray-900);
    padding: var(--spacing-sm);
  }

  select.form-input option:hover,
  select.form-input option:focus {
    background-color: var(--gray-100);
  }

  /* Specific focus styling for select elements */
  select.form-input:focus {
    outline: 2px solid var(--ing-orange);
    outline-offset: 2px;
    /* Ensure dropdown appears above other elements */
    z-index: 1000;
    /* Use box-shadow for the underline */
    box-shadow: inset 0 -1px 0 0 var(--ing-orange);
  }

  /* Style the date input calendar icon */
  .form-input[type="date"]::-webkit-calendar-picker-indicator {
    color: var(--ing-orange);
    cursor: pointer;
    filter: brightness(0) saturate(100%) invert(54%) sepia(88%) saturate(2450%) hue-rotate(7deg) brightness(95%) contrast(101%);
  }

  /* For Firefox (if supported) */
  .form-input[type="date"]::-moz-calendar-picker-indicator {
    color: var(--ing-orange);
    cursor: pointer;
  }

  .form-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    /* Ensure dropdowns are not clipped */
    overflow: visible;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    /* Ensure dropdowns are not clipped */
    overflow: visible;
  }

  /* Mobile responsiveness */
  @media (min-width: 640px) {
    .form-row {
      flex-direction: row;
      gap: var(--spacing-xl);
    }

    .form-row .form-group {
      flex: 1;
      margin-bottom: 0;
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    :host {
      padding: var(--spacing-md);
    }

    .form-container {
      padding: var(--spacing-lg);
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .btn {
      width: 100%;
    }
  }
`;
