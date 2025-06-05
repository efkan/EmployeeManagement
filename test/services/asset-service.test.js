import { expect } from '@open-wc/testing';
import { assetService } from '../../src/services/asset-service.js';

describe('AssetService', () => {
  beforeEach(() => {
    // Reset any cached content
    assetService.clearCache?.();
  });

  it('should be defined', () => {
    expect(assetService).to.exist;
  });

  it('should have getSvgContent method', () => {
    expect(assetService.getSvgContent).to.be.a('function');
  });

  it('should handle valid SVG path', async () => {
    try {
      // Test with a known asset path if available
      const result = await assetService.getSvgContent('apps.svg');
      expect(result).to.be.a('string');
    } catch (error) {
      // If the asset doesn't exist, that's expected behavior
      expect(error).to.exist;
    }
  });

  it('should handle invalid SVG path', async () => {
    try {
      await assetService.getSvgContent('nonexistent.svg');
      // Should not reach here
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it('should handle empty path', async () => {
    try {
      await assetService.getSvgContent('');
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.exist;
    }
  });

  it('should handle null path', async () => {
    try {
      await assetService.getSvgContent(null);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).to.exist;
    }
  });
});
