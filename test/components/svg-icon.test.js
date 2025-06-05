import { html, fixture, expect } from '@open-wc/testing';
import '../../src/components/ui/svg-icon.js';

describe('SvgIcon', () => {
  it('should render with asset', async () => {
    const element = await fixture(html`<svg-icon asset="apps.svg"></svg-icon>`);
    expect(element).to.exist;
    expect(element.asset).to.equal('apps.svg');
  });

  it('should render with title', async () => {
    const element = await fixture(html`<svg-icon asset="apps.svg" title="Apps Icon"></svg-icon>`);
    expect(element.title).to.equal('Apps Icon');
  });

  it('should render with custom size', async () => {
    const element = await fixture(html`<svg-icon asset="apps.svg" size="32"></svg-icon>`);
    expect(element.size).to.equal('32');
  });

  it('should handle missing asset gracefully', async () => {
    const element = await fixture(html`<svg-icon></svg-icon>`);
    expect(element).to.exist;
    expect(element.asset).to.equal('');
  });

  it('should apply CSS custom properties for size', async () => {
    const element = await fixture(html`<svg-icon asset="apps.svg" size="48"></svg-icon>`);

    // Wait for update
    await element.updateComplete;

    const computedStyle = getComputedStyle(element);
    expect(element.style.getPropertyValue('--icon-size')).to.equal('48px');
  });

  it('should have proper default values', async () => {
    const element = await fixture(html`<svg-icon></svg-icon>`);

    expect(element.asset).to.equal('');
    expect(element.size).to.equal('24');
    expect(element.title).to.equal('');
  });
});
