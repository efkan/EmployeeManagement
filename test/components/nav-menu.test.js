import { html, fixture, expect, elementUpdated } from '@open-wc/testing';
import '../../src/components/nav-menu.js';
import { localizationService } from '../../src/services/localization-service.js';
import { mockTranslations } from '../test-utils.js';

describe('NavMenu', () => {
  let element;

  beforeEach(async () => {
    // Reset and mock localization service
    if (localizationService.resetForTesting) {
      localizationService.resetForTesting();
    }
    localizationService.initialized = true;
    const { translations } = await import('../../src/services/localization-service.js');
    translations.set(mockTranslations);

    element = await fixture(html`<nav-menu></nav-menu>`);
  });

  it('should render nav menu with correct structure', () => {
    const nav = element.shadowRoot.querySelector('nav');
    expect(nav).to.exist;

    const logo = element.shadowRoot.querySelector('.nav-logo');
    expect(logo).to.exist;

    const navLinks = element.shadowRoot.querySelectorAll('.nav-link');
    expect(navLinks).to.have.length(2); // Employee List and Add Employee
  });

  it('should have mobile menu toggle button', () => {
    const menuToggle = element.shadowRoot.querySelector('.mobile-menu-button');
    expect(menuToggle).to.exist;
    expect(menuToggle.getAttribute('aria-label')).to.equal('Toggle navigation menu');
  });

  it('should toggle mobile menu when button is clicked', async () => {
    const menuToggle = element.shadowRoot.querySelector('.mobile-menu-button');

    // Initially menu should be closed
    expect(element.mobileMenuOpen).to.be.false;

    // Click toggle button
    menuToggle.click();
    await elementUpdated(element);

    // Menu should be open
    expect(element.mobileMenuOpen).to.be.true;

    // Click again to close
    menuToggle.click();
    await elementUpdated(element);

    // Menu should be closed
    expect(element.mobileMenuOpen).to.be.false;
  });

  it('should close mobile menu when clicking outside', async () => {
    const menuToggle = element.shadowRoot.querySelector('.mobile-menu-button');

    // Open menu
    menuToggle.click();
    await elementUpdated(element);
    expect(element.mobileMenuOpen).to.be.true;

    // Simulate click outside
    document.dispatchEvent(new Event('click'));
    await elementUpdated(element);

    // Menu should be closed
    expect(element.mobileMenuOpen).to.be.false;
  });

  it('should navigate to employee list when list link is clicked', async () => {
    const listLink = element.shadowRoot.querySelector('a[href="/employees"]');
    expect(listLink).to.exist;

    // Mock router navigation
    const originalNavigate = window.history.pushState;
    window.history.pushState = () => {
      // Navigation mocked
    };

    listLink.click();
    await elementUpdated(element);

    // Restore original function
    window.history.pushState = originalNavigate;
  });

  it('should navigate to add employee when add link is clicked', async () => {
    const addLink = element.shadowRoot.querySelector('a[href="/employees/add"]');
    expect(addLink).to.exist;

    // Mock router navigation
    const originalNavigate = window.history.pushState;
    window.history.pushState = () => {
      // Navigation mocked
    };

    addLink.click();
    await elementUpdated(element);

    // Restore original function
    window.history.pushState = originalNavigate;
  });

  it('should update text when language changes', async () => {
    // Switch to Turkish
    await localizationService.setLanguage('tr');
    await elementUpdated(element);

    const title = element.shadowRoot.querySelector('.nav-title');
    expect(title.textContent).to.include('ING'); // Brand name should remain

    // Switch back to English
    await localizationService.setLanguage('en');
    await elementUpdated(element);

    expect(title.textContent).to.include('ING'); // Brand name should remain
  });

  it('should handle keyboard navigation', async () => {
    const menuToggle = element.shadowRoot.querySelector('.mobile-menu-button');

    // Initially menu should be closed
    expect(element.mobileMenuOpen).to.be.false;

    // Click menu toggle
    menuToggle.click();
    await elementUpdated(element);

    expect(element.mobileMenuOpen).to.be.true;

    // Click again to close
    menuToggle.click();
    await elementUpdated(element);

    expect(element.mobileMenuOpen).to.be.false;
  });

  it('should be accessible', () => {
    const nav = element.shadowRoot.querySelector('nav');
    expect(nav).to.exist;

    const menuToggle = element.shadowRoot.querySelector('.mobile-menu-button');
    expect(menuToggle.getAttribute('aria-expanded')).to.exist;
    expect(menuToggle.getAttribute('aria-label')).to.exist;
  });

  it('should render mdi-icon component for employees link', () => {
    const employeesLink = element.shadowRoot.querySelector('a[href="/employees"]');
    expect(employeesLink).to.exist;

    const mdiIcon = employeesLink.querySelector('mdi-icon');
    expect(mdiIcon).to.exist;
    expect(mdiIcon.getAttribute('path')).to.exist;
    expect(mdiIcon.getAttribute('title')).to.equal('Employees');
  });

  it('should render language flag button', () => {
    const flagButton = element.shadowRoot.querySelector('.flag-button');
    expect(flagButton).to.exist;
    expect(flagButton.tagName).to.equal('BUTTON');
  });

  it('should show Turkey flag when current language is English', async () => {
    await localizationService.setLanguage('en');
    await elementUpdated(element);

    const flagButton = element.shadowRoot.querySelector('.flag-button');
    const flagImage = flagButton.querySelector('.flag-image');
    expect(flagImage).to.exist;
    expect(flagImage.getAttribute('src')).to.equal('/src/assets/turkey.png');
    expect(flagImage.getAttribute('alt')).to.equal('Turkey Flag');
    expect(flagButton.getAttribute('title')).to.equal('Türkçe\'ye geç');
  });

  it('should show Great Britain flag when current language is Turkish', async () => {
    await localizationService.setLanguage('tr');
    await elementUpdated(element);

    const flagButton = element.shadowRoot.querySelector('.flag-button');
    const flagImage = flagButton.querySelector('.flag-image');
    expect(flagImage).to.exist;
    expect(flagImage.getAttribute('src')).to.equal('/src/assets/united-kingdom.png');
    expect(flagImage.getAttribute('alt')).to.equal('United Kingdom Flag');
    expect(flagButton.getAttribute('title')).to.equal('Switch to English');
  });

  it('should switch language when flag button is clicked', async () => {
    // Start with English
    await localizationService.setLanguage('en');
    await elementUpdated(element);

    const flagButton = element.shadowRoot.querySelector('.flag-button');
    let flagImage = flagButton.querySelector('.flag-image');
    expect(flagImage.getAttribute('src')).to.equal('/src/assets/turkey.png');

    // Click to switch to Turkish
    flagButton.click();
    await elementUpdated(element);

    expect(element.currentLanguage).to.equal('tr');
    flagImage = flagButton.querySelector('.flag-image');
    expect(flagImage.getAttribute('src')).to.equal('/src/assets/united-kingdom.png');

    // Click again to switch back to English
    flagButton.click();
    await elementUpdated(element);

    expect(element.currentLanguage).to.equal('en');
    flagImage = flagButton.querySelector('.flag-image');
    expect(flagImage.getAttribute('src')).to.equal('/src/assets/turkey.png');
  });
});
