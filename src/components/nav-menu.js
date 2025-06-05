import { LitElement, html, css } from 'lit';
import { localizationService, currentLanguage } from '../services/localization-service.js';
import { viewMode } from '../services/employee-service.js';
import { routerService } from '../services/router.js';
import { mdiAccountGroup, mdiPlus } from '@mdi/js';
import './ui/mdi-icon.js';

export class NavMenu extends LitElement {
  static styles = css`
    :host {
      box-shadow: var(--shadow-sm);
      font-family: var(--font-family-primary);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      margin-left: var(--spacing-md);
      z-index: 2;
    }
    /* Hide nav-actions (flag-button) on mobile, show on desktop */
    .nav-actions {
      display: flex;
    }
    .nav-actions .flag-button {
      display: flex;
    }
    @media (max-width: 768px) {
      .nav-actions {
        display: none;
      }
    }
    /* Show flag-button in nav-links only on mobile */
    .nav-links .flag-button {
      display: none;
    }
    @media (max-width: 768px) {
      .nav-links .flag-button {
        display: flex;
        margin: 0 auto;
        justify-content: center;
      }
    }

    .flag-button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--border-radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 32px;
    }

    .flag-image {
      width: 24px;
      height: 18px;
      object-fit: cover;
      border-radius: 2px;
      transition: transform var(--transition-fast);
    }

    .flag-button:hover {
      background-color: var(--gray-100);
    }

    .flag-button:hover .flag-image {
      transform: scale(1.1);
    }

    .flag-button:focus {
      outline: none;
    }

    .nav-container {
      max-width: 98%;
      margin: 0 auto;
      margin-top: 71px; /* Adjusted for fixed header */
      height: 64px;
    }

    .view-in {
      font-size: var(--font-size-sm);
      color: var(--gray-600);
      font-family: var(--font-family-secondary);
      opacity: 0.5;
    }

    .nav-content {
      margin-top: .5rem;
      display: flex;
      align-items: center;
      height: 64px;
      background: var(--white);
      position: relative;
      padding: 0 1.5rem;
    }

    /* Right-align the mobile menu button */
    .mobile-menu-button {
      margin-left: auto;
    }

    @media (max-width: 768px) {
      .mobile-menu-button {
        position: absolute;
        right: 1.5rem;
        top: 50%;
        transform: translateY(-50%);
        margin-left: 0;
      }
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .nav-logo {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .nav-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      margin: 0;
      letter-spacing: 1px;
      font-family: var(--font-family-primary);
    }

    .nav-links {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      margin-left: auto;
      padding: 0;
      background: transparent;
      z-index: 2;
    }

    .nav-link {
      width: 110px;
      color: var(--ing-orange);
      opacity: 0.5;
      text-decoration: none;
      font-weight: 500;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      transition: all var(--transition-fast);
      position: relative;
      background: transparent;
      font-family: var(--font-family-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
    }

    .nav-link mdi-icon {
      font-size: 1.1em;
    }

    .nav-link:hover {
      color: var(--ing-orange);
      background-color: var(--ing-orange-light);
    }

    .nav-link.active {
      color: var(--ing-orange);
      opacity: 1;
    }

    .mobile-menu-button {
      display: none;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: var(--border-radius-md);
      color: var(--ing-orange);
      transition: all var(--transition-fast);
      z-index: 3;
    }

    .mobile-menu-button:hover {
      background-color: var(--ing-orange-light);
    }

    .mobile-menu-button:focus {
      outline: none;
    }

    .hamburger {
      width: 20px;
      height: 20px;
      position: relative;
    }

    .hamburger span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: currentColor;
      border-radius: 1px;
      transition: all var(--transition-fast);
      position: absolute;
    }

    .hamburger span:nth-child(1) {
      top: 0;
    }

    .hamburger span:nth-child(2) {
      top: 50%;
      transform: translateY(-50%);
    }

    .hamburger span:nth-child(3) {
      bottom: 0;
    }

    .mobile-menu-button[aria-expanded="true"] .hamburger span:nth-child(1) {
      transform: rotate(45deg);
      top: 50%;
      transform-origin: center;
    }

    .mobile-menu-button[aria-expanded="true"] .hamburger span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-button[aria-expanded="true"] .hamburger span:nth-child(3) {
      transform: rotate(-45deg);
      bottom: 50%;
      transform-origin: center;
    }

    /* Mobile styles */
    @media (max-width: 768px) {
      .nav-container {
        padding: 0 var(--spacing-sm);
      }

      .mobile-menu-button {
        display: flex;
      }


      .nav-links {
        display: none;
        position: absolute;
        top: 64px;
        right: 0;
        left: 0;
        width: 100vw;
        min-width: 100vw;
        max-width: 100vw;
        background: var(--white);
        border-radius: 0 0 16px 16px;
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
        flex-direction: column;
        align-items: center;
        padding: 0;
        gap: 0;
        z-index: 10;
      }

      .nav-links.mobile-open {
        display: flex;
      }

      .nav-link {
        width: 90vw;
        min-width: 0;
        max-width: 500px;
        text-align: center;
        margin: 0.25rem 0;
        padding: var(--spacing-md) var(--spacing-lg);
        color: var(--ing-orange);
        border-radius: 0;
        justify-content: center;
        box-sizing: border-box;
        align-items: center;
        display: flex;
      }

      .nav-link.active::after {
        display: none;
      }

      /* Full width language switch button in mobile menu */
      .nav-links .flag-button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        min-width: 0;
        max-width: 500px;
        height: 64px;
        background: none;
        border-radius: 0;
        box-shadow: none;
        font-size: 1rem;
        box-sizing: border-box;
      }

      .nav-title {
        font-size: var(--font-size-lg);
      }

      .nav-actions {
        margin: 0.5rem 0 0 0;
        justify-content: flex-end;
      }
    }

    @media (max-width: 480px) {
      .nav-title {
        font-size: var(--font-size-base);
      }
    }
  `;

  static properties = {
    currentPath: {type: String},
    mobileMenuOpen: {type: Boolean},
    currentLanguage: {type: String},
    currentViewMode: {type: String},
  };

  constructor() {
    super();
    this.currentPath = '';
    this.mobileMenuOpen = false;
    this.currentLanguage = localizationService.getCurrentLanguage();
    this.currentViewMode = 'table'; // Default view mode
    this._updateCurrentPath();

    // Subscribe to language changes
    this._unsubscribeLanguage = currentLanguage.subscribe((lang) => {
      this.currentLanguage = lang;
    });

    // Subscribe to view mode changes
    this._unsubscribeViewMode = viewMode.subscribe((mode) => {
      this.currentViewMode = mode;
    });
  }

  connectedCallback() {
    super.connectedCallback();
    // Listen for route changes
    window.addEventListener(
      'vaadin-router-location-changed',
      this._onLocationChanged.bind(this)
    );
    // Close mobile menu on outside click
    document.addEventListener('click', this._onDocumentClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._onLocationChanged.bind(this)
    );
    document.removeEventListener('click', this._onDocumentClick.bind(this));
    if (this._unsubscribeLanguage) {
      this._unsubscribeLanguage();
    }
    if (this._unsubscribeViewMode) {
      this._unsubscribeViewMode();
    }
  }

  _onLocationChanged() {
    this._updateCurrentPath();
    this.mobileMenuOpen = false; // Close mobile menu on navigation
  }

  _updateCurrentPath() {
    this.currentPath = window.location.pathname;
  }

  _onDocumentClick(event) {
    // Only close if click is outside nav-menu and not on the mobile menu button
    const path = event.composedPath ? event.composedPath() : [];
    const isMenuButton = path.some(
      (el) => el && el.classList && el.classList.contains('mobile-menu-button')
    );
    if (!this.contains(event.target) && !isMenuButton) {
      this.mobileMenuOpen = false;
    }
  }

  _toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  _onLanguageButtonClick() {
    // Toggle between 'en' and 'tr'
    const newLanguage = this.currentLanguage === 'en' ? 'tr' : 'en';
    localizationService.setLanguage(newLanguage);
  }

  _onLinkClick(event, path) {
    event.preventDefault();
    routerService.navigate(path);
    this.mobileMenuOpen = false;
  }

  _isActive(path) {
    if (path === '/employees') {
      return this.currentPath === '/' || this.currentPath === '/employees';
    }
    return this.currentPath.startsWith(path);
  }

  render() {
    const viewModeText = this.currentViewMode === 'table'
      ? localizationService.t('nav.tableView')
      : localizationService.t('nav.listView');

    return html`
      <nav class="nav-container">
        <span class="view-in">${viewModeText}</span>
        <div class="nav-content">
          <div class="nav-brand">
            <img src="/src/assets/ing.svg" alt="ING Logo" class="nav-logo" />
            <h1 class="nav-title">ING</h1>
          </div>

          <ul class="nav-links ${this.mobileMenuOpen ? 'mobile-open' : ''}">
            <li>
              <a
                href="/employees"
                class="nav-link ${this._isActive('/employees') ? 'active' : ''}"
                @click="${(e) => this._onLinkClick(e, '/employees')}"
              >
                <mdi-icon
                  path="${mdiAccountGroup}"
                  title="Employees"
                ></mdi-icon>
                ${localizationService.t('nav.employees')}
              </a>
            </li>
            <li>
              <a
                href="/employees/add"
                class="nav-link ${this._isActive('/employees/add')
                  ? 'active'
                  : ''}"
                @click="${(e) => this._onLinkClick(e, '/employees/add')}"
              >
                <mdi-icon path="${mdiPlus}" title="Add Employee"></mdi-icon>
                ${localizationService.t('nav.addEmployee')}
              </a>
            </li>
            <li>
              <button
                class="flag-button"
                @click="${this._onLanguageButtonClick}"
                title="${this.currentLanguage === 'en'
                  ? "Türkçe'ye geç"
                  : 'Switch to English'}"
              >
                <img
                  class="flag-image"
                  src="/src/assets/${this.currentLanguage === 'en'
                    ? 'turkey.png'
                    : 'united-kingdom.png'}"
                  alt="${this.currentLanguage === 'en'
                    ? 'Turkey Flag'
                    : 'United Kingdom Flag'}"
                />
                <span style="margin-left: 0.5rem; font-size: 1rem; color: var(--ing-orange);">
                  ${this.currentLanguage === 'en' ? "Türkçe'ye Geç" : 'Switch to English'}
                </span>
              </button>
            </li>
          </ul>

          <div class="nav-actions">
            <button
              class="flag-button"
              @click="${this._onLanguageButtonClick}"
              title="${this.currentLanguage === 'en'
                ? "Türkçe'ye geç"
                : 'Switch to English'}"
            >
              <img
                class="flag-image"
                src="/src/assets/${this.currentLanguage === 'en'
                  ? 'turkey.png'
                  : 'united-kingdom.png'}"
                alt="${this.currentLanguage === 'en'
                  ? 'Turkey Flag'
                  : 'United Kingdom Flag'}"
              />
            </button>
          </div>

          <button
            class="mobile-menu-button"
            aria-expanded="${this.mobileMenuOpen}"
            aria-label="Toggle navigation menu"
            @click="${this._toggleMobileMenu}"
          >
            <span class="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-menu', NavMenu);
