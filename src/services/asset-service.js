/**
 * Asset service for managing SVG and other static assets
 */
class AssetService {
  constructor() {
    this.svgCache = new Map();
  }

  /**
   * Get SVG content as a string
   * @param {string} assetPath - Path to the SVG asset relative to src/assets/
   * @returns {Promise<string>} SVG content
   */
  async getSvgContent(assetPath) {
    if (this.svgCache.has(assetPath)) {
      return this.svgCache.get(assetPath);
    }

    try {
      const response = await fetch(`/src/assets/${assetPath}`);
      if (!response.ok) {
        throw new Error(`Failed to load SVG: ${assetPath}`);
      }
      const svgContent = await response.text();
      this.svgCache.set(assetPath, svgContent);
      return svgContent;
    } catch (error) {
      console.error('Error loading SVG asset:', error);
      return '';
    }
  }

  /**
   * Get SVG as data URL for use in CSS backgrounds
   * @param {string} assetPath - Path to the SVG asset relative to src/assets/
   * @returns {Promise<string>} Data URL
   */
  async getSvgDataUrl(assetPath) {
    const svgContent = await this.getSvgContent(assetPath);
    if (!svgContent) return '';

    const encodedSvg = encodeURIComponent(svgContent);
    return `data:image/svg+xml,${encodedSvg}`;
  }

  /**
   * Preload commonly used SVG assets
   */
  async preloadAssets() {
    const commonAssets = ['apps.svg', 'ing.svg'];
    await Promise.all(
      commonAssets.map(asset => this.getSvgContent(asset))
    );
  }
}

export const assetService = new AssetService();
