import { LitElement, html, css } from 'lit';

// Services
import { localizationService } from './services/localization-service.js';
import { routerService } from './services/router.js';

// Components
import './components/nav-menu.js';
import './components/employee-list.js';
import './components/employee-form.js';
import './components/confirm-dialog.js';

/**
 * Main application component
 * Handles app initialization, routing setup, and global error states
 */
export class EmployeeApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--app-background);
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .app-header {
      flex-shrink: 0;
    }

    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .router-outlet {
      flex: 1;
    }

    /* Loading state */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2xl);
      color: var(--gray-600);
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 2px solid var(--gray-300);
      border-top: 2px solid var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: var(--spacing-md);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Error state */
    .error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2xl);
      color: var(--danger-color);
      text-align: center;
    }

    .error-icon {
      font-size: var(--font-size-3xl);
      margin-bottom: var(--spacing-md);
    }

    .error-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
    }

    .error-description {
      color: var(--gray-600);
      margin-bottom: var(--spacing-lg);
    }

    .retry-button {
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--primary-color);
      color: var(--white);
      border: none;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      font-weight: 500;
      transition: background-color var(--transition-fast);
    }

    .retry-button:hover {
      background-color: var(--primary-color-hover);
    }

    .retry-button:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
  `;

  static properties = {
    isLoading: { type: Boolean },
    hasError: { type: Boolean },
    errorMessage: { type: String }
  };

  constructor() {
    super();
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._initializeApp();
  }

  async updated(changedProperties) {
    super.updated(changedProperties);
    // Initialize router after the component is fully rendered
    if (changedProperties.has('isLoading') && !this.isLoading && !this.hasError) {
      await this._initializeRouter();
    }
  }

  /**
   * Initialize the application
   * @private
   */
  async _initializeApp() {
    try {
      this.isLoading = true;
      this.hasError = false;

      // Initialize localization service
      await localizationService.init();

      this.isLoading = false;
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this._handleInitializationError(error);
    }
  }

  /**
   * Initialize the router
   * @private
   */
  async _initializeRouter() {
    try {
      // Wait for next frame to ensure DOM is ready
      await new Promise(resolve => requestAnimationFrame(resolve));

      // Initialize router
      const routerOutlet = this.shadowRoot.querySelector('.router-outlet');
      if (routerOutlet) {
        console.log('Initializing router...');
        routerService.init(routerOutlet);
        console.log('Router initialized successfully');
      } else {
        throw new Error('Router outlet not found');
      }
    } catch (error) {
      console.error('Failed to initialize router:', error);
      this._handleInitializationError(error);
    }
  }

  /**
   * Handle initialization errors
   * @param {Error} error - The error that occurred
   * @private
   */
  _handleInitializationError(error) {
    this.hasError = true;
    this.errorMessage = error.message || 'Failed to initialize the application. Please try again.';
    this.isLoading = false;
  }

  /**
   * Retry initialization
   * @private
   */
  _onRetry() {
    this._initializeApp().then(() => {
      if (!this.hasError) {
        this._initializeRouter();
      }
    });
  }

  _renderLoading() {
    return html`
      <div class="loading">
        <div class="loading-spinner"></div>
        <span>Loading application...</span>
      </div>
    `;
  }

  _renderError() {
    return html`
      <div class="error">
        <div class="error-icon">⚠️</div>
        <h2 class="error-title">Something went wrong</h2>
        <p class="error-description">${this.errorMessage}</p>
        <button class="retry-button" @click="${this._onRetry}">
          Try Again
        </button>
      </div>
    `;
  }

  _renderApp() {
    return html`
      <div class="app-container">
        <header class="app-header">
          <nav-menu></nav-menu>
        </header>

        <main class="app-main">
          <div class="router-outlet"></div>
        </main>
      </div>
    `;
  }

  render() {
    if (this.isLoading) {
      return this._renderLoading();
    }

    if (this.hasError) {
      return this._renderError();
    }

    return this._renderApp();
  }
}

customElements.define('employee-app', EmployeeApp);
