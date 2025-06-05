import { fixture, expect, html } from '@open-wc/testing';
import '../../src/components/ui/mdi-icon.js';
import { mdiAccount } from '@mdi/js';

describe('MdiIcon', () => {
  it('renders with a path', async () => {
    const element = await fixture(html`<mdi-icon path="${mdiAccount}"></mdi-icon>`);

    const svg = element.shadowRoot.querySelector('svg');
    expect(svg).to.exist;

    const path = element.shadowRoot.querySelector('path');
    expect(path).to.exist;
    expect(path.getAttribute('d')).to.equal(mdiAccount);
  });

  it('sets viewBox to 0 0 24 24', async () => {
    const element = await fixture(html`<mdi-icon path="${mdiAccount}"></mdi-icon>`);

    const svg = element.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('viewBox')).to.equal('0 0 24 24');
  });

  it('applies custom color', async () => {
    const customColor = '#FF6200';
    const element = await fixture(html`<mdi-icon path="${mdiAccount}" color="${customColor}"></mdi-icon>`);

    // Color is applied via CSS color property, not fill attribute
    expect(element.color).to.equal(customColor);

    const path = element.shadowRoot.querySelector('path');
    expect(path.getAttribute('fill')).to.equal('currentColor');
  });

  it('applies custom size', async () => {
    const customSize = '32';
    const element = await fixture(html`<mdi-icon path="${mdiAccount}" size="${customSize}"></mdi-icon>`);

    expect(element.size).to.equal(customSize);
  });

  it('includes title when provided', async () => {
    const titleText = 'Account Icon';
    const element = await fixture(html`<mdi-icon path="${mdiAccount}" title="${titleText}"></mdi-icon>`);

    const title = element.shadowRoot.querySelector('title');
    expect(title).to.exist;
    expect(title.textContent).to.equal(titleText);
  });

  it('sets aria-hidden when no title provided', async () => {
    const element = await fixture(html`<mdi-icon path="${mdiAccount}"></mdi-icon>`);

    const svg = element.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).to.equal('true');
  });

  it('does not set aria-hidden when title is provided', async () => {
    const element = await fixture(html`<mdi-icon path="${mdiAccount}" title="Test"></mdi-icon>`);

    const svg = element.shadowRoot.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).to.equal('false');
  });

  it('warns when no path is provided', async () => {
    // Save original console.warn
    const originalWarn = console.warn;
    let warnCalled = false;
    let warnMessage = '';

    // Mock console.warn
    console.warn = (message) => {
      warnCalled = true;
      warnMessage = message;
    };

    await fixture(html`<mdi-icon></mdi-icon>`);

    expect(warnCalled).to.be.true;
    expect(warnMessage).to.include('MdiIcon: No path');

    // Restore original console.warn
    console.warn = originalWarn;
  });

  it('renders empty when no path is provided', async () => {
    const element = await fixture(html`<mdi-icon></mdi-icon>`);

    const svg = element.shadowRoot.querySelector('svg');
    expect(svg).to.not.exist;
  });
});
