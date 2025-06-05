import { LitElement, html, css } from 'lit';
import { assetService } from '../../services/asset-service.js';

/**
 * A reusable icon component that supports both MDI paths and external SVG assets
 * Uses @mdi/js for MDI icons and can load external SVG files from assets
 */
export class MdiIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--icon-size, 1.6em);
      height: var(--icon-size, 1.6em);
      vertical-align: middle;
    }

    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
      display: block;
    }

    .external-svg {
      width: 100%;
      height: 100%;
      color: inherit;
    }
  `;

  static properties = {
    path: { type: String },
    asset: { type: String }, // Path to external SVG asset
    size: { type: String },
    color: { type: String },
    title: { type: String },
    _externalSvgContent: { type: String, state: true },
    _isLoading: { type: Boolean, state: true }
  };

  constructor() {
    super();
    this.path = '';
    this.asset = '';
    this.size = '24';
    this.color = 'currentColor';
    this.title = '';
    this._externalSvgContent = '';
    this._isLoading = false;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    // Update CSS custom properties for size
    if (changedProperties.has('size')) {
      this.style.setProperty('--icon-size', `${this.size}px`);
    }

    // Load external SVG if asset property changes
    if (changedProperties.has('asset') && this.asset) {
      this._loadExternalSvg();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Set initial size
    this.style.setProperty('--icon-size', `${this.size}px`);

    // Load external SVG if asset is provided
    if (this.asset) {
      this._loadExternalSvg();
    }
  }

  async _loadExternalSvg() {
    this._isLoading = true;
    try {
      this._externalSvgContent = await assetService.getSvgContent(this.asset);
    } catch (error) {
      console.error('Failed to load external SVG:', error);
      this._externalSvgContent = '';
    } finally {
      this._isLoading = false;
    }
  }

  render() {
    // If using external SVG asset
    if (this.asset) {
      if (this._isLoading) {
        // Show loading state or empty while loading
        return html`
          <div
            class="external-svg"
            title="${this.title}"
          ></div>
        `;
      }

      if (this._externalSvgContent) {
        return html`
          <div
            class="external-svg"
            .innerHTML="${this._externalSvgContent}"
            title="${this.title}"
          ></div>
        `;
      }

      // Fallback if asset failed to load - show empty or default icon
      return html`
        <div
          class="external-svg"
          title="${this.title}"
        ></div>
      `;
    }

    // If using MDI path
    if (!this.path) {
      console.warn('MdiIcon: No path or asset provided');
      return html``;
    }

    return html`
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="${!this.title}"
        style="width: ${this.size}px; height: ${this.size}px;"
      >
        ${this.title ? html`<title>${this.title}</title>` : ''}
        <path d="${this.path}" fill="currentColor"></path>
      </svg>
    `;
  }
}

customElements.define('mdi-icon', MdiIcon);
