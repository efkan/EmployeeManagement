import { LitElement, html, css } from 'lit';
import { localizationService } from '../services/localization-service.js';

export class ConfirmDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity var(--transition-normal), visibility var(--transition-normal);
    }

    :host([open]) {
      opacity: 1;
      visibility: visible;
    }

    .dialog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: var(--content-background);
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-lg);
      max-width: 400px;
      width: 90%;
      padding: var(--spacing-lg);
      transition: transform var(--transition-normal);
    }

    :host([open]) .dialog {
      transform: translate(-50%, -50%) scale(1);
    }

    .dialog-header {
      margin-bottom: var(--spacing-lg);
    }

    .dialog-title {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
    }

    .dialog-content {
      margin-bottom: var(--spacing-xl);
    }

    .dialog-message {
      color: var(--gray-700);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .dialog-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .btn {
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--border-radius-md);
      border: 1px solid transparent;
      font-size: var(--font-size-sm);
      font-weight: 500;
      cursor: pointer;
      transition: all var(--transition-fast);
      min-width: 80px;
    }

    .btn:focus {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .btn-secondary {
      background-color: var(--white);
      color: var(--gray-700);
      border-color: var(--gray-300);
    }

    .btn-secondary:hover {
      background-color: var(--gray-50);
      border-color: var(--gray-400);
    }

    .btn-danger {
      background-color: var(--danger-color);
      color: var(--white);
    }

    .btn-danger:hover {
      background-color: #b91c1c;
    }

    .btn-primary {
      background-color: var(--primary-color);
      color: var(--white);
    }

    .btn-primary:hover {
      background-color: var(--primary-color-hover);
    }

    /* Mobile responsiveness */
    @media (max-width: 640px) {
      .dialog {
        width: calc(100% - var(--spacing-2xl) * 2);
        padding: var(--spacing-md);
        margin: 0 auto;
      }

      .dialog-actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }

    @media (max-width: 480px) {
      .dialog {
        width: calc(100% - var(--spacing-2xl) * 2);
        margin: 0 auto;
      }
    }
  `;

  static properties = {
    open: { type: Boolean, reflect: true },
    title: { type: String },
    message: { type: String },
    confirmText: { type: String },
    cancelText: { type: String },
    type: { type: String } // 'danger', 'primary', etc.
  };

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.message = '';
    this.confirmText = '';
    this.cancelText = '';
    this.type = 'primary';
  }

  connectedCallback() {
    super.connectedCallback();
    // Close dialog on escape key
    this._handleKeydown = this._onKeydown.bind(this);
    document.addEventListener('keydown', this._handleKeydown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._handleKeydown);
  }

  _onKeydown(event) {
    if (event.key === 'Escape' && this.open) {
      this._onCancel();
    }
  }

  _onOverlayClick(event) {
    if (event.target === this) {
      this._onCancel();
    }
  }

  _onCancel() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('dialog-cancel', {
      bubbles: true,
      composed: true
    }));
  }

  _onConfirm() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('dialog-confirm', {
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Show the dialog with specified options
   * @param {Object} options - Dialog options
   */
  show(options = {}) {
    this.title = options.title || '';
    this.message = options.message || '';
    this.confirmText = options.confirmText || localizationService.t('buttons.confirm');
    this.cancelText = options.cancelText || localizationService.t('buttons.cancel');
    this.type = options.type || 'primary';
    this.open = true;
  }

  /**
   * Hide the dialog
   */
  hide() {
    this.open = false;
  }

  render() {
    const confirmButtonClass = this.type === 'danger' ? 'btn-danger' : 'btn-primary';

    return html`
      <div class="dialog" @click="${(e) => e.stopPropagation()}">
        ${this.title ? html`
          <div class="dialog-header">
            <h3 class="dialog-title">${this.title}</h3>
          </div>
        ` : ''}

        <div class="dialog-content">
          <p class="dialog-message">${this.message}</p>
        </div>

        <div class="dialog-actions">
          <button class="btn btn-secondary" @click="${this._onCancel}">
            ${this.cancelText}
          </button>
          <button class="btn ${confirmButtonClass}" @click="${this._onConfirm}">
            ${this.confirmText}
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
